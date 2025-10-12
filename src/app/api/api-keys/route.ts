import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

// GET /api/api-keys - Get all API keys for the organization
export async function GET(_request: NextRequest) {
  try {
    const { userId, orgId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get or create organization
    const organizationId = orgId || `user_${userId}`
    let organization = await prisma.organization.findUnique({
      where: { clerkOrgId: organizationId },
    })

    if (!organization) {
      // Auto-create organization if it doesn't exist
      organization = await prisma.organization.create({
        data: {
          name: organizationId.startsWith('user_') ? 'Personal' : organizationId,
          slug: organizationId,
          clerkOrgId: organizationId,
        },
      })
    }

    // Get all API keys (never return the full key)
    const apiKeys = await prisma.apiKey.findMany({
      where: {
        organizationId: organization.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Mask the keys - only show first 8 and last 4 characters
    const maskedKeys = apiKeys.map(key => ({
      ...key,
      key: `${key.key.substring(0, 8)}...${key.key.substring(key.key.length - 4)}`,
    }))

    return NextResponse.json(maskedKeys)
  } catch (error) {
    console.error('Error fetching API keys:', error)
    return NextResponse.json(
      { error: 'Failed to fetch API keys' },
      { status: 500 }
    )
  }
}

// POST /api/api-keys - Create a new API key
export async function POST(request: NextRequest) {
  try {
    const { userId, orgId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, expiresAt } = body

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'API key name is required' },
        { status: 400 }
      )
    }

    // Validate expiration date if provided
    if (expiresAt) {
      const expirationDate = new Date(expiresAt)
      if (isNaN(expirationDate.getTime())) {
        return NextResponse.json(
          { error: 'Invalid expiration date' },
          { status: 400 }
        )
      }
      if (expirationDate <= new Date()) {
        return NextResponse.json(
          { error: 'Expiration date must be in the future' },
          { status: 400 }
        )
      }
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

    // Generate secure API key
    // Format: pk_live_<64 chars of random hex>
    const randomBytes = crypto.randomBytes(32).toString('hex')
    const apiKey = `pk_live_${randomBytes}`

    // Create API key
    const newApiKey = await prisma.apiKey.create({
      data: {
        name: name.trim(),
        key: apiKey,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        organizationId: organization.id,
      },
    })

    // Get user for activity logging
    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    })

    if (dbUser) {
      // Log activity (DO NOT log the full key in metadata)
      await prisma.activity.create({
        data: {
          action: 'API_KEY_CREATED',
          entityType: 'API_KEY',
          entityId: newApiKey.id,
          userId: dbUser.id,
          organizationId: organization.id,
          metadata: {
            apiKeyName: newApiKey.name,
            keyPreview: `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`,
          },
        },
      })
    }

    // Return the FULL key only once (on creation)
    return NextResponse.json({
      ...newApiKey,
      key: apiKey, // Full key returned only on creation
    })
  } catch (error) {
    console.error('Error creating API key:', error)
    return NextResponse.json(
      { error: 'Failed to create API key' },
      { status: 500 }
    )
  }
}
