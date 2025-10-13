'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Prompt {
  id: string
  title: string
  description: string | null
  content: string
  status: string
  author: {
    id: string
    name: string
    email: string
  }
  category: {
    id: string
    name: string
    color: string | null
  } | null
  tags: Array<{
    id: string
    name: string
  }>
  versionCount: number
  commentCount: number
  favoriteCount: number
  isFavorited: boolean
  createdAt: string
  updatedAt: string
}

interface Category {
  id: string
  name: string
  icon: string | null
  color: string | null
}

interface Collection {
  id: string
  name: string
}

interface DashboardStats {
  totalPrompts: number
  totalCategories: number
  totalCollections: number
  totalFavorites: number
}

export default function DashboardPage() {
  const { user } = useUser()
  const [stats, setStats] = useState<DashboardStats>({
    totalPrompts: 0,
    totalCategories: 0,
    totalCollections: 0,
    totalFavorites: 0,
  })
  const [recentPrompts, setRecentPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch all data in parallel
      const [promptsRes, categoriesRes, collectionsRes, favoritesRes] = await Promise.all([
        fetch('/api/prompts'),
        fetch('/api/categories'),
        fetch('/api/collections'),
        fetch('/api/favorites'),
      ])

      const prompts: Prompt[] = promptsRes.ok ? await promptsRes.json() : []
      const categories: Category[] = categoriesRes.ok ? await categoriesRes.json() : []
      const collections: Collection[] = collectionsRes.ok ? await collectionsRes.json() : []
      const favorites: Prompt[] = favoritesRes.ok ? await favoritesRes.json() : []

      // Update stats
      setStats({
        totalPrompts: prompts.length,
        totalCategories: categories.length,
        totalCollections: collections.length,
        totalFavorites: favorites.length,
      })

      // Get recent prompts (top 5)
      setRecentPrompts(prompts.slice(0, 5))
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'default'
      case 'DRAFT':
        return 'secondary'
      case 'ARCHIVED':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.firstName || 'there'}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Here&apos;s what&apos;s happening with your prompts today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Prompts</CardTitle>
            <span className="text-2xl">📝</span>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-2xl font-bold">...</div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalPrompts}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalPrompts === 0 ? 'No prompts yet' : `${stats.totalPrompts} prompt${stats.totalPrompts !== 1 ? 's' : ''}`}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <span className="text-2xl">🏷️</span>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-2xl font-bold">...</div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalCategories}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalCategories === 0 ? 'Create your first category' : `${stats.totalCategories} categor${stats.totalCategories !== 1 ? 'ies' : 'y'}`}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collections</CardTitle>
            <span className="text-2xl">📁</span>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-2xl font-bold">...</div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalCollections}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalCollections === 0 ? 'Organize with collections' : `${stats.totalCollections} collection${stats.totalCollections !== 1 ? 's' : ''}`}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorites</CardTitle>
            <span className="text-2xl">⭐</span>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-2xl font-bold">...</div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalFavorites}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalFavorites === 0 ? 'Star your favorites' : `${stats.totalFavorites} favorite${stats.totalFavorites !== 1 ? 's' : ''}`}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with your prompt library</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/prompts/new">
            <Button className="h-24 w-full flex flex-col items-center justify-center gap-2">
              <span className="text-2xl">➕</span>
              <span>Create Prompt</span>
            </Button>
          </Link>
          <Link href="/categories">
            <Button variant="outline" className="h-24 w-full flex flex-col items-center justify-center gap-2">
              <span className="text-2xl">🏷️</span>
              <span>Add Category</span>
            </Button>
          </Link>
          <Link href="/collections">
            <Button variant="outline" className="h-24 w-full flex flex-col items-center justify-center gap-2">
              <span className="text-2xl">📁</span>
              <span>Create Collection</span>
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Prompts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Prompts</CardTitle>
            <CardDescription>Your most recently created or edited prompts</CardDescription>
          </div>
          {recentPrompts.length > 0 && (
            <Button variant="outline" size="sm" asChild>
              <Link href="/prompts">View All</Link>
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              Loading prompts...
            </div>
          ) : recentPrompts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <span className="text-4xl mb-4 block">📝</span>
              <p className="text-lg font-medium mb-2">No prompts yet</p>
              <p className="text-sm mb-4">Create your first prompt to get started</p>
              <Link href="/prompts/new">
                <Button>Create Your First Prompt</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentPrompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Link
                          href={`/prompts/${prompt.id}`}
                          className="font-semibold hover:text-primary transition-colors"
                        >
                          {prompt.title}
                        </Link>
                        <Badge variant={getStatusColor(prompt.status)} className="text-xs">
                          {prompt.status}
                        </Badge>
                      </div>
                      {prompt.description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {prompt.description}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        {prompt.category && (
                          <span className="flex items-center gap-1">
                            🏷️ {prompt.category.name}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          📚 {prompt.versionCount} version{prompt.versionCount !== 1 ? 's' : ''}
                        </span>
                        <span className="flex items-center gap-1">
                          {prompt.isFavorited ? '⭐' : '☆'} {prompt.favoriteCount}
                        </span>
                        <span className="ml-auto">
                          Updated {new Date(prompt.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/prompts/${prompt.id}`}>View</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Getting Started Guide - Only show if no prompts */}
      {stats.totalPrompts === 0 && !loading && (
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Learn how to use Prompt Vault effectively</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <Badge className="mt-1">1</Badge>
              <div>
                <h4 className="font-medium">Create your first prompt</h4>
                <p className="text-sm text-muted-foreground">
                  Start building your prompt library by creating your first prompt
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Badge className="mt-1">2</Badge>
              <div>
                <h4 className="font-medium">Organize with categories</h4>
                <p className="text-sm text-muted-foreground">
                  Create categories to organize prompts by type or purpose
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Badge className="mt-1">3</Badge>
              <div>
                <h4 className="font-medium">Use collections</h4>
                <p className="text-sm text-muted-foreground">
                  Group related prompts together in collections for easy access
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Badge className="mt-1">4</Badge>
              <div>
                <h4 className="font-medium">Share and collaborate</h4>
                <p className="text-sm text-muted-foreground">
                  Invite team members to collaborate on your prompt library
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
