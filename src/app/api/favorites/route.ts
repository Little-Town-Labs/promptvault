import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/favorites - Get all favorited prompts for current user
export async function GET(_request: NextRequest) {
  try {
    const { userId, orgId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get organization
    const organizationId = orgId || `user_${userId}`
    const organization = await prisma.organization.findUnique({
      where: { clerkOrgId: organizationId },
    })

    if (!organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    // Get all favorites with prompt details
    const favorites = await prisma.favorite.findMany({
      where: {
        userId: user.id,
        prompt: {
          organizationId: organization.id,
        },
      },
      include: {
        prompt: {
          include: {
            author: {
              select: {
                id: true,
                clerkUserId: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
            category: {
              select: {
                id: true,
                name: true,
                color: true,
              },
            },
            tags: {
              include: {
                tag: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
            _count: {
              select: {
                versions: true,
                comments: true,
                favorites: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Transform response
    const prompts = favorites.map(favorite => ({
      ...favorite.prompt,
      tags: favorite.prompt.tags.map(pt => pt.tag),
      versionCount: favorite.prompt._count.versions,
      commentCount: favorite.prompt._count.comments,
      favoriteCount: favorite.prompt._count.favorites,
      isFavorited: true,
      favoritedAt: favorite.createdAt,
    }))

    return NextResponse.json(prompts)
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    )
  }
}
