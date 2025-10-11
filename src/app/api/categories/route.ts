import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/categories - Get all categories for the organization
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

    // Get all categories with prompt counts
    const categories = await prisma.category.findMany({
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
    const transformedCategories = categories.map(category => ({
      ...category,
      promptCount: category._count.prompts,
    }))

    return NextResponse.json(transformedCategories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

// POST /api/categories - Create a new category
export async function POST(request: NextRequest) {
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

    // Check if category with same slug already exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        organizationId: organization.id,
        slug,
      },
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: 'A category with this name already exists' },
        { status: 400 }
      )
    }

    // Create category
    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug,
        description: description?.trim() || null,
        color: color || null,
        icon: icon || null,
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
          action: 'CATEGORY_CREATED',
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
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}
