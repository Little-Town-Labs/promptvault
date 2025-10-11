import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/collections/[id] - Get a single collection
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, orgId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const collection = await prisma.collection.findUnique({
      where: {
        id: params.id,
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

    if (!collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
    }

    // Check access (user must be in the same organization)
    const organizationId = orgId || `user_${userId}`
    const organization = await prisma.organization.findUnique({
      where: { clerkOrgId: organizationId },
    })

    if (!organization || collection.organizationId !== organization.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    return NextResponse.json({
      ...collection,
      promptCount: collection._count.prompts,
      childrenCount: collection._count.children,
    })
  } catch (error) {
    console.error('Error fetching collection:', error)
    return NextResponse.json(
      { error: 'Failed to fetch collection' },
      { status: 500 }
    )
  }
}

// PUT /api/collections/[id] - Update a collection
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
    const { name, description, parentId } = body

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Collection name is required' },
        { status: 400 }
      )
    }

    // Get existing collection
    const existingCollection = await prisma.collection.findUnique({
      where: { id: params.id },
    })

    if (!existingCollection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
    }

    // Check access
    const organizationId = orgId || `user_${userId}`
    const organization = await prisma.organization.findUnique({
      where: { clerkOrgId: organizationId },
    })

    if (!organization || existingCollection.organizationId !== organization.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // If parentId is provided, verify it exists and belongs to the same organization
    // Also prevent circular references
    if (parentId) {
      if (parentId === params.id) {
        return NextResponse.json(
          { error: 'A collection cannot be its own parent' },
          { status: 400 }
        )
      }

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

      // Check if the parent is a descendant of this collection (would create a cycle)
      let currentParent = parentCollection
      while (currentParent.parentId) {
        if (currentParent.parentId === params.id) {
          return NextResponse.json(
            { error: 'Cannot set parent to a descendant collection (would create a cycle)' },
            { status: 400 }
          )
        }
        const nextParent = await prisma.collection.findUnique({
          where: { id: currentParent.parentId },
        })
        if (!nextParent) break
        currentParent = nextParent
      }
    }

    // Update collection
    const collection = await prisma.collection.update({
      where: { id: params.id },
      data: {
        name: name.trim(),
        description: description !== undefined ? (description?.trim() || null) : existingCollection.description,
        parentId: parentId !== undefined ? (parentId || null) : existingCollection.parentId,
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
          action: 'COLLECTION_UPDATED',
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
    console.error('Error updating collection:', error)
    return NextResponse.json(
      { error: 'Failed to update collection' },
      { status: 500 }
    )
  }
}

// DELETE /api/collections/[id] - Delete a collection
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, orgId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get collection
    const collection = await prisma.collection.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            prompts: true,
            children: true,
          },
        },
      },
    })

    if (!collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
    }

    // Check access
    const organizationId = orgId || `user_${userId}`
    const organization = await prisma.organization.findUnique({
      where: { clerkOrgId: organizationId },
    })

    if (!organization || collection.organizationId !== organization.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Check if collection has prompts
    if (collection._count.prompts > 0) {
      return NextResponse.json(
        { error: `Cannot delete collection with ${collection._count.prompts} prompt(s). Please reassign or delete the prompts first.` },
        { status: 400 }
      )
    }

    // Check if collection has children
    if (collection._count.children > 0) {
      return NextResponse.json(
        { error: `Cannot delete collection with ${collection._count.children} sub-collection(s). Please delete or reassign them first.` },
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
          action: 'COLLECTION_DELETED',
          entityType: 'COLLECTION',
          entityId: collection.id,
          userId: dbUser.id,
          organizationId: organization.id,
          metadata: {
            collectionName: collection.name,
          },
        },
      })
    }

    // Delete collection
    await prisma.collection.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Collection deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting collection:', error)
    return NextResponse.json(
      { error: 'Failed to delete collection' },
      { status: 500 }
    )
  }
}
