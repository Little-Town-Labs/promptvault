import { auth, currentUser } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/prompts - List all prompts for the current organization
export async function GET(request: NextRequest) {
  try {
    const { userId, orgId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get search params
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const categoryId = searchParams.get('categoryId') || searchParams.get('category')
    const tag = searchParams.get('tag')

    // Build where clause
    const where: any = {
      organizationId: orgId || `user_${userId}`, // Fallback to user-based org if no org
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status) {
      where.status = status
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    // Fetch prompts
    const prompts = await prisma.prompt.findMany({
      where,
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
      orderBy: {
        updatedAt: 'desc',
      },
    })

    // Get current user to check favorites
    const currentDbUser = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    })

    // Get user's favorites if user exists
    const userFavorites = currentDbUser
      ? await prisma.favorite.findMany({
          where: { userId: currentDbUser.id },
          select: { promptId: true },
        })
      : []

    const favoritedPromptIds = new Set(userFavorites.map(f => f.promptId))

    // Filter by tag if specified (since tags are in a relation)
    let filteredPrompts = prompts
    if (tag) {
      filteredPrompts = prompts.filter(prompt =>
        prompt.tags.some(pt => pt.tag.name.toLowerCase() === tag.toLowerCase())
      )
    }

    // Transform the response
    const transformedPrompts = filteredPrompts.map(prompt => ({
      id: prompt.id,
      title: prompt.title,
      description: prompt.description,
      content: prompt.content,
      variables: prompt.variables,
      status: prompt.status,
      visibility: prompt.visibility,
      author: {
        id: prompt.author.id,
        email: prompt.author.email,
        name: `${prompt.author.firstName || ''} ${prompt.author.lastName || ''}`.trim() || prompt.author.email,
      },
      category: prompt.category,
      tags: prompt.tags.map(pt => pt.tag),
      versionCount: prompt._count.versions,
      commentCount: prompt._count.comments,
      favoriteCount: prompt._count.favorites,
      isFavorited: favoritedPromptIds.has(prompt.id),
      createdAt: prompt.createdAt,
      updatedAt: prompt.updatedAt,
    }))

    return NextResponse.json(transformedPrompts)
  } catch (error) {
    console.error('Error fetching prompts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch prompts' },
      { status: 500 }
    )
  }
}

// POST /api/prompts - Create a new prompt
export async function POST(request: NextRequest) {
  try {
    const { userId, orgId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { title, description, content, variables, categoryId, tags } = body

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Get or create organization
    const organizationId = orgId || `user_${userId}`

    // Get or create user in database
    let dbUser = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    })

    if (!dbUser) {
      // Create user if doesn't exist
      dbUser = await prisma.user.create({
        data: {
          clerkUserId: userId,
          email: user.emailAddresses[0]?.emailAddress || '',
          firstName: user.firstName,
          lastName: user.lastName,
        },
      })
    }

    // Get or create organization
    let organization = await prisma.organization.findUnique({
      where: { clerkOrgId: organizationId },
    })

    if (!organization) {
      organization = await prisma.organization.create({
        data: {
          clerkOrgId: organizationId,
          name: orgId ? 'Organization' : `${user.firstName || 'Personal'} Workspace`,
          slug: organizationId.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        },
      })

      // Create organization user relationship
      await prisma.organizationUser.create({
        data: {
          organizationId: organization.id,
          userId: dbUser.id,
          role: 'OWNER',
        },
      })
    }

    // Create the prompt
    const prompt = await prisma.prompt.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        content: content.trim(),
        variables: variables || null,
        status: 'DRAFT',
        visibility: 'PRIVATE',
        organizationId: organization.id,
        authorId: dbUser.id,
        categoryId: categoryId || null,
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        category: true,
      },
    })

    // Create initial version
    await prisma.promptVersion.create({
      data: {
        promptId: prompt.id,
        version: 1,
        content: content.trim(),
        variables: variables || null,
        changeDescription: 'Initial version',
        createdById: dbUser.id,
      },
    })

    // Handle tags if provided
    if (tags && Array.isArray(tags) && tags.length > 0) {
      for (const tagName of tags) {
        const trimmedTag = tagName.trim()
        if (!trimmedTag) continue

        // Get or create tag
        let tag = await prisma.tag.findFirst({
          where: {
            name: trimmedTag,
            organizationId: organization.id,
          },
        })

        if (!tag) {
          tag = await prisma.tag.create({
            data: {
              name: trimmedTag,
              slug: trimmedTag.toLowerCase().replace(/\s+/g, '-'),
              organizationId: organization.id,
            },
          })
        }

        // Create prompt-tag relationship
        await prisma.promptTag.create({
          data: {
            promptId: prompt.id,
            tagId: tag.id,
          },
        })
      }
    }

    // Log activity
    await prisma.activity.create({
      data: {
        action: 'PROMPT_CREATED',
        entityType: 'PROMPT',
        entityId: prompt.id,
        userId: dbUser.id,
        organizationId: organization.id,
        metadata: {
          promptTitle: prompt.title,
        },
      },
    })

    return NextResponse.json(prompt, { status: 201 })
  } catch (error) {
    console.error('Error creating prompt:', error)
    return NextResponse.json(
      { error: 'Failed to create prompt' },
      { status: 500 }
    )
  }
}
