'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Prompt {
  id: string
  title: string
  description: string | null
  content: string
  status: string
  author: {
    id: string
    email: string
    firstName: string | null
    lastName: string | null
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
  favoritedAt: string
  createdAt: string
  updatedAt: string
}

export default function FavoritesPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFavorites()
  }, [])

  const fetchFavorites = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/favorites')

      if (!response.ok) {
        throw new Error('Failed to fetch favorites')
      }

      const data = await response.json()
      setPrompts(data)
    } catch (error) {
      console.error('Error fetching favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleFavorite = async (prompt: Prompt) => {
    try {
      const response = await fetch(`/api/prompts/${prompt.id}/favorite`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to toggle favorite')
      }

      // Remove from list (since unfavoriting)
      setPrompts(prevPrompts => prevPrompts.filter(p => p.id !== prompt.id))
    } catch (error) {
      console.error('Error toggling favorite:', error)
      alert('Failed to remove favorite. Please try again.')
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

  const getUserName = (user: { firstName: string | null; lastName: string | null; email: string }) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`
    }
    if (user.firstName) return user.firstName
    return user.email
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Favorites</h1>
          <p className="text-muted-foreground mt-2">
            Your favorited prompts in one place
          </p>
        </div>
      </div>

      {loading ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              Loading favorites...
            </div>
          </CardContent>
        </Card>
      ) : prompts.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Favorites Yet</CardTitle>
            <CardDescription>Prompts you favorite will appear here</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <span className="text-4xl mb-4 block">⭐</span>
              <p className="text-lg font-medium mb-2">Start favoriting prompts</p>
              <p className="text-sm mb-4">
                Click the star icon on any prompt to add it to your favorites
              </p>
              <Button asChild>
                <Link href="/prompts">Browse Prompts</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {prompts.map((prompt) => (
            <Card key={prompt.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl">
                        <Link
                          href={`/prompts/${prompt.id}`}
                          className="hover:text-primary transition-colors"
                        >
                          {prompt.title}
                        </Link>
                      </CardTitle>
                      <Badge variant={getStatusColor(prompt.status)}>
                        {prompt.status}
                      </Badge>
                    </div>
                    {prompt.description && (
                      <CardDescription className="text-base">
                        {prompt.description}
                      </CardDescription>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleFavorite(prompt)}
                      className="text-yellow-500"
                      title="Remove from favorites"
                    >
                      ⭐
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/prompts/${prompt.id}/edit`}>Edit</Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Preview */}
                <div className="bg-muted/50 rounded-md p-4">
                  <p className="text-sm text-muted-foreground font-mono line-clamp-2">
                    {prompt.content}
                  </p>
                </div>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <span>📚</span>
                    <span>{prompt.versionCount} version{prompt.versionCount !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>💬</span>
                    <span>{prompt.commentCount} comment{prompt.commentCount !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>⭐</span>
                    <span>{prompt.favoriteCount} favorite{prompt.favoriteCount !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="ml-auto">
                    <span>by {getUserName(prompt.author)}</span>
                  </div>
                </div>

                {/* Tags and Category */}
                <div className="flex flex-wrap items-center gap-2">
                  {prompt.category && (
                    <Badge variant="outline" className="gap-1">
                      🏷️ {prompt.category.name}
                    </Badge>
                  )}
                  {prompt.tags.map((tag) => (
                    <Badge key={tag.id} variant="secondary">
                      {tag.name}
                    </Badge>
                  ))}
                </div>

                {/* Timestamps */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                  <span>Favorited {new Date(prompt.favoritedAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>Created {new Date(prompt.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
