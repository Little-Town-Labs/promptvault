'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Category {
  id: string
  name: string
  icon: string | null
  color: string | null
}

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

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [promptToDelete, setPromptToDelete] = useState<Prompt | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchPrompts()
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchPrompts = async (searchQuery?: string, category?: string) => {
    try {
      setLoading(true)
      const params = new URLSearchParams()

      if (searchQuery) {
        params.append('search', searchQuery)
      }
      if (category && category !== 'all') {
        params.append('category', category)
      }

      const url = params.toString()
        ? `/api/prompts?${params.toString()}`
        : '/api/prompts'

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Failed to fetch prompts')
      }

      const data = await response.json()
      setPrompts(data)
    } catch (error) {
      console.error('Error fetching prompts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchPrompts(search, categoryFilter)
  }

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value)
    fetchPrompts(search, value)
  }

  const handleClearFilters = () => {
    setSearch('')
    setCategoryFilter('all')
    fetchPrompts()
  }

  const handleToggleFavorite = async (prompt: Prompt) => {
    try {
      const response = await fetch(`/api/prompts/${prompt.id}/favorite`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to toggle favorite')
      }

      const data = await response.json()

      // Update the prompt in the list
      setPrompts(prevPrompts =>
        prevPrompts.map(p =>
          p.id === prompt.id
            ? { ...p, isFavorited: data.isFavorited, favoriteCount: data.favoriteCount }
            : p
        )
      )
    } catch (error) {
      console.error('Error toggling favorite:', error)
      alert('Failed to toggle favorite. Please try again.')
    }
  }

  const handleDeleteClick = (prompt: Prompt) => {
    setPromptToDelete(prompt)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!promptToDelete) return

    try {
      setIsDeleting(true)
      const response = await fetch(`/api/prompts/${promptToDelete.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete prompt')
      }

      // Remove from list
      setPrompts(prompts.filter(p => p.id !== promptToDelete.id))
      setDeleteDialogOpen(false)
      setPromptToDelete(null)
    } catch (error) {
      console.error('Error deleting prompt:', error)
      alert('Failed to delete prompt. Please try again.')
    } finally {
      setIsDeleting(false)
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prompts</h1>
          <p className="text-muted-foreground mt-2">
            Manage and organize your AI prompts
          </p>
        </div>
        <Button asChild>
          <Link href="/prompts/new">+ New Prompt</Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Search prompts by title, description, or content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Search</Button>
          </form>

          {categories.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">Filter by:</span>
              <Select value={categoryFilter} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        {category.icon && <span>{category.icon}</span>}
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(search || categoryFilter) && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Prompts List */}
      {loading ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              Loading prompts...
            </div>
          </CardContent>
        </Card>
      ) : prompts.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Your Prompt Library</CardTitle>
            <CardDescription>All your prompts in one place</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <span className="text-4xl mb-4 block">📝</span>
              <p className="text-lg font-medium mb-2">
                {search ? 'No prompts found' : 'No prompts yet'}
              </p>
              <p className="text-sm mb-4">
                {search
                  ? 'Try adjusting your search terms'
                  : 'Create your first prompt to get started'}
              </p>
              {!search && (
                <Button asChild>
                  <Link href="/prompts/new">Create Prompt</Link>
                </Button>
              )}
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
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/prompts/${prompt.id}/edit`}>Edit</Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(prompt)}
                    >
                      Delete
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
                  <button
                    onClick={() => handleToggleFavorite(prompt)}
                    className="flex items-center gap-1 hover:text-primary transition-colors"
                    title={prompt.isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <span className={prompt.isFavorited ? 'text-yellow-500' : ''}>
                      {prompt.isFavorited ? '⭐' : '☆'}
                    </span>
                    <span>{prompt.favoriteCount} favorite{prompt.favoriteCount !== 1 ? 's' : ''}</span>
                  </button>
                  <div className="ml-auto">
                    <span>by {prompt.author.name || prompt.author.email}</span>
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
                  <span>Created {new Date(prompt.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>Updated {new Date(prompt.updatedAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Prompt</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{promptToDelete?.title}&quot;? This action cannot be undone.
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
              onClick={handleDeleteConfirm}
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
