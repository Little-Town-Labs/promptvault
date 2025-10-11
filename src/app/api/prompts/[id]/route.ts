import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/prompts/[id] - Get a single prompt
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, orgId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const prompt = await prisma.prompt.findUnique({
      where: {
        id: params.id,
      },
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
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
        versions: {
          orderBy: {
            version: 'desc',
          },
          take: 10,
          include: {
            createdBy: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        comments: {
          orderBy: {
            createdAt: 'desc',
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

    // Check if current user has favorited this prompt
    const currentDbUser = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    })

    let isFavorited = false
    if (currentDbUser) {
      const favorite = await prisma.favorite.findUnique({
        where: {
          userId_promptId: {
            userId: currentDbUser.id,
            promptId: params.id,
          },
        },
      })
      isFavorited = !!favorite
    }

    // Transform response
    const transformedPrompt = {
      ...prompt,
      tags: prompt.tags.map(pt => pt.tag),
      isFavorited,
    }

    return NextResponse.json(transformedPrompt)
  } catch (error) {
    console.error('Error fetching prompt:', error)
    return NextResponse.json(
      { error: 'Failed to fetch prompt' },
      { status: 500 }
    )
  }
}

// PUT /api/prompts/[id] - Update a prompt
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
    const { title, description, content, variables, status, categoryId, tags } = body

    // Get user
    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get existing prompt
    const existingPrompt = await prisma.prompt.findUnique({
      where: { id: params.id },
      include: {
        versions: {
          orderBy: { version: 'desc' },
          take: 1,
        },
      },
    })

    if (!existingPrompt) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 })
    }

    // Check access
    const organizationId = orgId || `user_${userId}`
    const organization = await prisma.organization.findUnique({
      where: { clerkOrgId: organizationId },
    })

    if (!organization || existingPrompt.organizationId !== organization.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Check if content changed
    const contentChanged = content && content.trim() !== existingPrompt.content

    // Update prompt
    const prompt = await prisma.prompt.update({
      where: { id: params.id },
      data: {
        title: title?.trim() || existingPrompt.title,
        description: description !== undefined ? (description?.trim() || null) : existingPrompt.description,
        content: content?.trim() || existingPrompt.content,
        variables: variables !== undefined ? variables : existingPrompt.variables,
        status: status || existingPrompt.status,
        categoryId: categoryId !== undefined ? categoryId : existingPrompt.categoryId,
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
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    // Create new version if content changed
    if (contentChanged) {
      const latestVersion = existingPrompt.versions[0]
      const nextVersion = latestVersion ? latestVersion.version + 1 : 1

      await prisma.promptVersion.create({
        data: {
          promptId: prompt.id,
          version: nextVersion,
          content: content.trim(),
          variables: variables || null,
          changeDescription: 'Updated via API',
          createdById: dbUser.id,
        },
      })
    }

    // Update tags if provided
    if (tags !== undefined && Array.isArray(tags)) {
      // Remove existing tags
      await prisma.promptTag.deleteMany({
        where: { promptId: prompt.id },
      })

      // Add new tags
      for (const tagName of tags) {
        const trimmedTag = tagName.trim()
        if (!trimmedTag) continue

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
        action: 'PROMPT_UPDATED',
        entityType: 'PROMPT',
        entityId: prompt.id,
        userId: dbUser.id,
        organizationId: organization.id,
        metadata: {
          promptTitle: prompt.title,
          contentChanged,
        },
      },
    })

    // Fetch updated prompt with tags
    const updatedPrompt = await prisma.prompt.findUnique({
      where: { id: prompt.id },
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
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    return NextResponse.json(updatedPrompt)
  } catch (error) {
    console.error('Error updating prompt:', error)
    return NextResponse.json(
      { error: 'Failed to update prompt' },
      { status: 500 }
    )
  }
}

// DELETE /api/prompts/[id] - Delete a prompt
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, orgId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user
    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get prompt
    const prompt = await prisma.prompt.findUnique({
      where: { id: params.id },
    })

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 })
    }

    // Check access
    const organizationId = orgId || `user_${userId}`
    const organization = await prisma.organization.findUnique({
      where: { clerkOrgId: organizationId },
    })

    if (!organization || prompt.organizationId !== organization.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Log activity before deletion
    await prisma.activity.create({
      data: {
        action: 'PROMPT_DELETED',
        entityType: 'PROMPT',
        entityId: prompt.id,
        userId: dbUser.id,
        organizationId: organization.id,
        metadata: {
          promptTitle: prompt.title,
        },
      },
    })

    // Delete prompt (cascade will handle related records)
    await prisma.prompt.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true, message: 'Prompt deleted successfully' })
  } catch (error) {
    console.error('Error deleting prompt:', error)
    return NextResponse.json(
      { error: 'Failed to delete prompt' },
      { status: 500 }
    )
  }
}
