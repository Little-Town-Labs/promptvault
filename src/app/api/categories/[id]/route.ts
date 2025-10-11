import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/categories/[id] - Get a single category
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, orgId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const category = await prisma.category.findUnique({
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

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    // Check access (user must be in the same organization)
    const organizationId = orgId || `user_${userId}`
    const organization = await prisma.organization.findUnique({
      where: { clerkOrgId: organizationId },
    })

    if (!organization || category.organizationId !== organization.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    return NextResponse.json({
      ...category,
      promptCount: category._count.prompts,
    })
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    )
  }
}

// PUT /api/categories/[id] - Update a category
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
    const { name, description, color, icon } = body

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      )
    }

    // Get existing category
    const existingCategory = await prisma.category.findUnique({
      where: { id: params.id },
    })

    if (!existingCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    // Check access
    const organizationId = orgId || `user_${userId}`
    const organization = await prisma.organization.findUnique({
      where: { clerkOrgId: organizationId },
    })

    if (!organization || existingCategory.organizationId !== organization.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Generate new slug if name changed
    let slug = existingCategory.slug
    if (name.trim() !== existingCategory.name) {
      slug = name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

      // Check if new slug conflicts with another category
      const conflictingCategory = await prisma.category.findFirst({
        where: {
          organizationId: organization.id,
          slug,
          id: { not: params.id },
        },
      })

      if (conflictingCategory) {
        return NextResponse.json(
          { error: 'A category with this name already exists' },
          { status: 400 }
        )
      }
    }

    // Update category
    const category = await prisma.category.update({
      where: { id: params.id },
      data: {
        name: name.trim(),
        slug,
        description: description !== undefined ? (description?.trim() || null) : existingCategory.description,
        color: color !== undefined ? color : existingCategory.color,
        icon: icon !== undefined ? icon : existingCategory.icon,
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
          action: 'CATEGORY_UPDATED',
          entityType: 'CATEGORY',
          entityId: category.id,
          userId: dbUser.id,
          organizationId: organization.id,
          metadata: {
            categoryName: category.name,
          },
        },
      })
    }

    return NextResponse.json({
      ...category,
      promptCount: category._count.prompts,
    })
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

// DELETE /api/categories/[id] - Delete a category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, orgId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get category
    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            prompts: true,
          },
        },
      },
    })

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    // Check access
    const organizationId = orgId || `user_${userId}`
    const organization = await prisma.organization.findUnique({
      where: { clerkOrgId: organizationId },
    })

    if (!organization || category.organizationId !== organization.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Check if category has prompts
    if (category._count.prompts > 0) {
      return NextResponse.json(
        { error: `Cannot delete category with ${category._count.prompts} prompt(s). Please reassign or delete the prompts first.` },
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
          action: 'CATEGORY_DELETED',
          entityType: 'CATEGORY',
          entityId: category.id,
          userId: dbUser.id,
          organizationId: organization.id,
          metadata: {
            categoryName: category.name,
          },
        },
      })
    }

    // Delete category
    await prisma.category.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}
