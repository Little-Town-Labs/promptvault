'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Version {
  id: string
  version: number
  content: string
  variables: string[] | null
  changeDescription: string | null
  createdAt: string
  createdBy: {
    id: string
    email: string
    firstName: string | null
    lastName: string | null
  }
}

interface Comment {
  id: string
  content: string
  createdAt: string
  user: {
    id: string
    email: string
    firstName: string | null
    lastName: string | null
  }
}

interface Prompt {
  id: string
  title: string
  description: string | null
  content: string
  status: string
  variables: string[] | null
  author: {
    id: string
    clerkUserId: string
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
  versions: Version[]
  comments: Comment[]
  _count: {
    versions: number
    comments: number
    favorites: number
  }
  isFavorited: boolean
  createdAt: string
  updatedAt: string
}

export default function PromptDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchPrompt()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  const fetchPrompt = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/prompts/${params.id}`)

      if (!response.ok) {
        if (response.status === 404) {
          setError('Prompt not found')
        } else if (response.status === 403) {
          setError('Access denied')
        } else {
          setError('Failed to load prompt')
        }
        return
      }

      const data = await response.json()
      setPrompt(data)
    } catch (error) {
      console.error('Error fetching prompt:', error)
      setError('Failed to load prompt')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!prompt) return

    try {
      setIsDeleting(true)
      const response = await fetch(`/api/prompts/${prompt.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete prompt')
      }

      router.push('/prompts')
    } catch (error) {
      console.error('Error deleting prompt:', error)
      alert('Failed to delete prompt. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCopyContent = async () => {
    if (!prompt) return

    try {
      await navigator.clipboard.writeText(prompt.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      alert('Failed to copy to clipboard')
    }
  }

  const handleToggleFavorite = async () => {
    if (!prompt) return

    try {
      const response = await fetch(`/api/prompts/${prompt.id}/favorite`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to toggle favorite')
      }

      const data = await response.json()

      // Update the prompt state
      setPrompt({
        ...prompt,
        isFavorited: data.isFavorited,
        _count: {
          ...prompt._count,
          favorites: data.favoriteCount,
        },
      })
    } catch (error) {
      console.error('Error toggling favorite:', error)
      alert('Failed to toggle favorite. Please try again.')
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

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              Loading prompt...
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !prompt) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error || 'Prompt not found'}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/prompts">Back to Prompts</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{prompt.title}</h1>
            <Badge variant={getStatusColor(prompt.status)}>{prompt.status}</Badge>
          </div>
          {prompt.description && (
            <p className="text-muted-foreground text-lg">{prompt.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleToggleFavorite}
            className={prompt.isFavorited ? 'text-yellow-500' : ''}
            title={prompt.isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            {prompt.isFavorited ? '⭐ Favorited' : '☆ Favorite'}
          </Button>
          <Button asChild variant="outline">
            <Link href={`/prompts/${prompt.id}/edit`}>Edit</Link>
          </Button>
          <Button variant="outline" onClick={() => setDeleteDialogOpen(true)}>
            Delete
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Prompt Content</CardTitle>
            <Button variant="outline" size="sm" onClick={handleCopyContent}>
              {copied ? '✓ Copied!' : '📋 Copy'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-md p-4">
            <pre className="text-sm font-mono whitespace-pre-wrap break-words">
              {prompt.content}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Metadata Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Author</div>
              <div className="text-sm">{getUserName(prompt.author)}</div>
            </div>

            {prompt.category && (
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Category</div>
                <Badge variant="outline" className="gap-1">
                  🏷️ {prompt.category.name}
                </Badge>
              </div>
            )}

            {prompt.tags.length > 0 && (
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">Tags</div>
                <div className="flex flex-wrap gap-2">
                  {prompt.tags.map((tag) => (
                    <Badge key={tag.id} variant="secondary">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {prompt.variables && prompt.variables.length > 0 && (
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">Variables</div>
                <div className="flex flex-wrap gap-2">
                  {prompt.variables.map((variable, index) => (
                    <Badge key={index} variant="outline">
                      {variable}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Created:</span>
                <span>{new Date(prompt.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Updated:</span>
                <span>{new Date(prompt.updatedAt).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Card */}
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>📚</span>
                <span>Versions</span>
              </div>
              <span className="font-semibold">{prompt._count.versions}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>💬</span>
                <span>Comments</span>
              </div>
              <span className="font-semibold">{prompt._count.comments}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>⭐</span>
                <span>Favorites</span>
              </div>
              <span className="font-semibold">{prompt._count.favorites}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Version History */}
      {prompt.versions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Version History</CardTitle>
            <CardDescription>
              Latest {prompt.versions.length} version{prompt.versions.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {prompt.versions.map((version, index) => (
                <div key={version.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant={index === 0 ? 'default' : 'secondary'}>
                        v{version.version} {index === 0 && '(current)'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        by {getUserName(version.createdBy)}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(version.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {version.changeDescription && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {version.changeDescription}
                    </p>
                  )}

                  <div className="bg-muted/50 rounded-md p-3">
                    <pre className="text-xs font-mono whitespace-pre-wrap break-words line-clamp-3">
                      {version.content}
                    </pre>
                  </div>

                  {version.variables && version.variables.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      <span className="text-xs text-muted-foreground">Variables:</span>
                      {version.variables.map((variable, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {variable}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comments */}
      {prompt.comments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Comments</CardTitle>
            <CardDescription>
              {prompt.comments.length} comment{prompt.comments.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {prompt.comments.map((comment) => (
                <div key={comment.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm font-medium">
                      {getUserName(comment.user)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Prompt</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{prompt.title}&quot;? This action cannot be undone.
              All versions, comments, and associated data will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
