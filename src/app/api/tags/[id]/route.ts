import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/tags/[id] - Get a single tag
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, orgId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tag = await prisma.tag.findUnique({
      where: {
        id: params.id,
      },
      include: {
        _count: {
          select: {
            prompts: true,
          },
        },
      },
    })

    if (!tag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 })
    }

    // Check access (user must be in the same organization)
    const organizationId = orgId || `user_${userId}`
    const organization = await prisma.organization.findUnique({
      where: { clerkOrgId: organizationId },
    })

    if (!organization || tag.organizationId !== organization.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    return NextResponse.json({
      ...tag,
      promptCount: tag._count.prompts,
    })
  } catch (error) {
    console.error('Error fetching tag:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tag' },
      { status: 500 }
    )
  }
}

// PUT /api/tags/[id] - Update a tag
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, orgId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, color } = body

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Tag name is required' },
        { status: 400 }
      )
    }

    // Get existing tag
    const existingTag = await prisma.tag.findUnique({
      where: { id: params.id },
    })

    if (!existingTag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 })
    }

    // Check access
    const organizationId = orgId || `user_${userId}`
    const organization = await prisma.organization.findUnique({
      where: { clerkOrgId: organizationId },
    })

    if (!organization || existingTag.organizationId !== organization.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Generate new slug if name changed
    let slug = existingTag.slug
    if (name.trim() !== existingTag.name) {
      slug = name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

      // Check if new slug conflicts with another tag
      const conflictingTag = await prisma.tag.findFirst({
        where: {
          organizationId: organization.id,
          slug,
          id: { not: params.id },
        },
      })

      if (conflictingTag) {
        return NextResponse.json(
          { error: 'A tag with this name already exists' },
          { status: 400 }
        )
      }
    }

    // Update tag
    const tag = await prisma.tag.update({
      where: { id: params.id },
      data: {
        name: name.trim(),
        slug,
        color: color !== undefined ? color : existingTag.color,
      },
      include: {
        _count: {
          select: {
            prompts: true,
          },
        },
      },
    })

    // Get user for activity logging
    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    })

    if (dbUser) {
      // Log activity
      await prisma.activity.create({
        data: {
          action: 'TAG_UPDATED',
          entityType: 'TAG',
          entityId: tag.id,
          userId: dbUser.id,
          organizationId: organization.id,
          metadata: {
            tagName: tag.name,
          },
        },
      })
    }

    return NextResponse.json({
      ...tag,
      promptCount: tag._count.prompts,
    })
  } catch (error) {
    console.error('Error updating tag:', error)
    return NextResponse.json(
      { error: 'Failed to update tag' },
      { status: 500 }
    )
  }
}

// DELETE /api/tags/[id] - Delete a tag
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, orgId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get tag
    const tag = await prisma.tag.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            prompts: true,
          },
        },
      },
    })

    if (!tag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 })
    }

    // Check access
    const organizationId = orgId || `user_${userId}`
    const organization = await prisma.organization.findUnique({
      where: { clerkOrgId: organizationId },
    })

    if (!organization || tag.organizationId !== organization.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Check if tag has prompts
    if (tag._count.prompts > 0) {
      return NextResponse.json(
        { error: `Cannot delete tag with ${tag._count.prompts} prompt(s). Please remove the tag from prompts first.` },
        { status: 400 }
      )
    }

    // Get user for activity logging
    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    })

    if (dbUser) {
      // Log activity before deletion
      await prisma.activity.create({
        data: {
          action: 'TAG_DELETED',
          entityType: 'TAG',
          entityId: tag.id,
          userId: dbUser.id,
          organizationId: organization.id,
          metadata: {
            tagName: tag.name,
          },
        },
      })
    }

    // Delete tag
    await prisma.tag.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Tag deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting tag:', error)
    return NextResponse.json(
      { error: 'Failed to delete tag' },
      { status: 500 }
    )
  }
}
