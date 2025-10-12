import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// DELETE /api/api-keys/[id] - Delete/revoke an API key
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, orgId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get API key
    const apiKey = await prisma.apiKey.findUnique({
      where: { id: params.id },
    })

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 })
    }

    // Check access
    const organizationId = orgId || `user_${userId}`
    const organization = await prisma.organization.findUnique({
      where: { clerkOrgId: organizationId },
    })

    if (!organization || apiKey.organizationId !== organization.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Get user for activity logging
    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    })

    if (dbUser) {
      // Log activity before deletion (DO NOT log the full key)
      await prisma.activity.create({
        data: {
          action: 'API_KEY_DELETED',
          entityType: 'API_KEY',
          entityId: apiKey.id,
          userId: dbUser.id,
          organizationId: organization.id,
          metadata: {
            apiKeyName: apiKey.name,
          },
        },
      })
    }

    // Delete API key
    await prisma.apiKey.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: 'API key deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting API key:', error)
    return NextResponse.json(
      { error: 'Failed to delete API key' },
      { status: 500 }
    )
  }
}
