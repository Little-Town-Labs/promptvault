import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/tags - Get all tags for the organization
export async function GET(_request: NextRequest) {
  try {
    const { userId, orgId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get organization
    const organizationId = orgId || `user_${userId}`
    const organization = await prisma.organization.findUnique({
      where: { clerkOrgId: organizationId },
    })

    if (!organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    // Get all tags with prompt counts
    const tags = await prisma.tag.findMany({
      where: {
        organizationId: organization.id,
      },
      include: {
        _count: {
          select: {
            prompts: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    // Transform response to include prompt count
    const transformedTags = tags.map(tag => ({
      ...tag,
      promptCount: tag._count.prompts,
    }))

    return NextResponse.json(transformedTags)
  } catch (error) {
    console.error('Error fetching tags:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    )
  }
}

// POST /api/tags - Create a new tag
export async function POST(request: NextRequest) {
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

    // Get or create organization
    const organizationId = orgId || `user_${userId}`
    let organization = await prisma.organization.findUnique({
      where: { clerkOrgId: organizationId },
    })

    if (!organization) {
      // Auto-create organization
      organization = await prisma.organization.create({
        data: {
          name: organizationId.startsWith('user_') ? 'Personal' : organizationId,
          slug: organizationId,
          clerkOrgId: organizationId,
        },
      })
    }

    // Generate slug from name
    const slug = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    // Check if tag with same slug already exists
    const existingTag = await prisma.tag.findFirst({
      where: {
        organizationId: organization.id,
        slug,
      },
    })

    if (existingTag) {
      return NextResponse.json(
        { error: 'A tag with this name already exists' },
        { status: 400 }
      )
    }

    // Create tag
    const tag = await prisma.tag.create({
      data: {
        name: name.trim(),
        slug,
        color: color || null,
        organizationId: organization.id,
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
          action: 'TAG_CREATED',
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
    console.error('Error creating tag:', error)
    return NextResponse.json(
      { error: 'Failed to create tag' },
      { status: 500 }
    )
  }
}
