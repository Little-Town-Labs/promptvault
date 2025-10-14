import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/collections - Get all collections for the organization
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

    // If no organization exists yet, return empty array
    if (!organization) {
      return NextResponse.json([])
    }

    // Get all collections with prompt counts and parent information
    const collections = await prisma.collection.findMany({
      where: {
        organizationId: organization.id,
      },
      include: {
        _count: {
          select: {
            prompts: true,
            children: true,
          },
        },
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    // Transform response to include prompt count and children count
    const transformedCollections = collections.map(collection => ({
      ...collection,
      promptCount: collection._count.prompts,
      childrenCount: collection._count.children,
    }))

    return NextResponse.json(transformedCollections)
  } catch (error) {
    console.error('Error fetching collections:', error)
    if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack)
    }
    return NextResponse.json(
      {
        error: 'Failed to fetch collections',
        message: error instanceof Error ? error.message : 'Unknown error',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}

// POST /api/collections - Create a new collection
export async function POST(request: NextRequest) {
  try {
    const { userId, orgId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, parentId } = body

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Collection name is required' },
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

    // If parentId is provided, verify it exists and belongs to the same organization
    if (parentId) {
      const parentCollection = await prisma.collection.findUnique({
        where: { id: parentId },
      })

      if (!parentCollection) {
        return NextResponse.json(
          { error: 'Parent collection not found' },
          { status: 404 }
        )
      }

      if (parentCollection.organizationId !== organization.id) {
        return NextResponse.json(
          { error: 'Parent collection belongs to a different organization' },
          { status: 403 }
        )
      }
    }

    // Create collection
    const collection = await prisma.collection.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        parentId: parentId || null,
        organizationId: organization.id,
      },
      include: {
        _count: {
          select: {
            prompts: true,
            children: true,
          },
        },
        parent: {
          select: {
            id: true,
            name: true,
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
          action: 'COLLECTION_CREATED',
          entityType: 'COLLECTION',
          entityId: collection.id,
          userId: dbUser.id,
          organizationId: organization.id,
          metadata: {
            collectionName: collection.name,
            parentId: collection.parentId,
          },
        },
      })
    }

    return NextResponse.json({
      ...collection,
      promptCount: collection._count.prompts,
      childrenCount: collection._count.children,
    })
  } catch (error) {
    console.error('Error creating collection:', error)
    return NextResponse.json(
      { error: 'Failed to create collection' },
      { status: 500 }
    )
  }
}
