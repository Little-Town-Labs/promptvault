import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/prompts/[id]/favorite - Toggle favorite (add or remove)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, orgId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    })

    if (!user) {
      const clerkUser = await import('@clerk/nextjs/server').then(m => m.currentUser())
      const currentUser = await clerkUser()

      user = await prisma.user.create({
        data: {
          clerkUserId: userId,
          email: currentUser?.emailAddresses[0]?.emailAddress || `user_${userId}@temp.com`,
          firstName: currentUser?.firstName || null,
          lastName: currentUser?.lastName || null,
        },
      })
    }

    // Get prompt
    const prompt = await prisma.prompt.findUnique({
      where: { id: params.id },
    })

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 })
    }

    // Check access (user must be in the same organization)
    const organizationId = orgId || `user_${userId}`
    const organization = await prisma.organization.findUnique({
      where: { clerkOrgId: organizationId },
    })

    if (!organization || prompt.organizationId !== organization.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Check if already favorited
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_promptId: {
          userId: user.id,
          promptId: params.id,
        },
      },
    })

    let isFavorited = false

    if (existingFavorite) {
      // Remove favorite
      await prisma.favorite.delete({
        where: {
          id: existingFavorite.id,
        },
      })

      // Decrement favorite count
      await prisma.prompt.update({
        where: { id: params.id },
        data: {
          favoriteCount: {
            decrement: 1,
          },
        },
      })

      isFavorited = false

      // Log activity
      await prisma.activity.create({
        data: {
          action: 'PROMPT_UNFAVORITED',
          entityType: 'PROMPT',
          entityId: prompt.id,
          userId: user.id,
          organizationId: organization.id,
          metadata: {
            promptTitle: prompt.title,
          },
        },
      })
    } else {
      // Add favorite
      await prisma.favorite.create({
        data: {
          userId: user.id,
          promptId: params.id,
        },
      })

      // Increment favorite count
      await prisma.prompt.update({
        where: { id: params.id },
        data: {
          favoriteCount: {
            increment: 1,
          },
        },
      })

      isFavorited = true

      // Log activity
      await prisma.activity.create({
        data: {
          action: 'PROMPT_FAVORITED',
          entityType: 'PROMPT',
          entityId: prompt.id,
          userId: user.id,
          organizationId: organization.id,
          metadata: {
            promptTitle: prompt.title,
          },
        },
      })
    }

    return NextResponse.json({
      success: true,
      isFavorited,
      favoriteCount: isFavorited ? prompt.favoriteCount + 1 : prompt.favoriteCount - 1,
    })
  } catch (error) {
    console.error('Error toggling favorite:', error)
    return NextResponse.json(
      { error: 'Failed to toggle favorite' },
      { status: 500 }
    )
  }
}
