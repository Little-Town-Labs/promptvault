import { auth, currentUser } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/favorites - Get all favorited prompts for current user
export async function GET(_request: NextRequest) {
  try {
    const { userId, orgId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const clerkUser = await currentUser()
    if (!clerkUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get or create user in database
    let user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkUserId: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
        },
      })
    }

    // Get or create organization
    const organizationId = orgId || `user_${userId}`
    let organization = await prisma.organization.findUnique({
      where: { clerkOrgId: organizationId },
    })

    if (!organization) {
      organization = await prisma.organization.create({
        data: {
          clerkOrgId: organizationId,
          name: orgId ? 'Organization' : `${clerkUser.firstName || 'Personal'} Workspace`,
          slug: organizationId.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        },
      })

      // Create organization user relationship
      await prisma.organizationUser.create({
        data: {
          organizationId: organization.id,
          userId: user.id,
          role: 'OWNER',
        },
      })
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
    if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack)
    }
    return NextResponse.json(
      {
        error: 'Failed to fetch favorites',
        message: error instanceof Error ? error.message : 'Unknown error',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}
