'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

interface Tag {
  id: string
  name: string
  slug: string
  color: string | null
  promptCount: number
  createdAt: string
}

const DEFAULT_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#f59e0b', // amber
  '#10b981', // green
  '#3b82f6', // blue
  '#6366f1', // indigo
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f43f5e', // rose
]

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    name: '',
    color: DEFAULT_COLORS[0],
  })

  useEffect(() => {
    fetchTags()
  }, [])

  const fetchTags = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/tags')

      if (!response.ok) {
        throw new Error('Failed to fetch tags')
      }

      const data = await response.json()
      setTags(data)
    } catch (error) {
      console.error('Error fetching tags:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateClick = () => {
    setFormData({
      name: '',
      color: DEFAULT_COLORS[0],
    })
    setErrors({})
    setCreateDialogOpen(true)
  }

  const handleEditClick = (tag: Tag) => {
    setSelectedTag(tag)
    setFormData({
      name: tag.name,
      color: tag.color || DEFAULT_COLORS[0],
    })
    setErrors({})
    setEditDialogOpen(true)
  }

  const handleDeleteClick = (tag: Tag) => {
    setSelectedTag(tag)
    setDeleteDialogOpen(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Tag name is required'
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCreate = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          color: formData.color,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create tag')
      }

      const newTag = await response.json()
      setTags(prev => [...prev, newTag].sort((a, b) => a.name.localeCompare(b.name)))
      setCreateDialogOpen(false)
    } catch (error) {
      console.error('Error creating tag:', error)
      setErrors({
        submit: error instanceof Error ? error.message : 'Failed to create tag',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdate = async () => {
    if (!selectedTag || !validateForm()) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/tags/${selectedTag.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          color: formData.color,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update tag')
      }

      const updatedTag = await response.json()
      setTags(prev =>
        prev
          .map(tag => (tag.id === updatedTag.id ? updatedTag : tag))
          .sort((a, b) => a.name.localeCompare(b.name))
      )
      setEditDialogOpen(false)
    } catch (error) {
      console.error('Error updating tag:', error)
      setErrors({
        submit: error instanceof Error ? error.message : 'Failed to update tag',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedTag) return

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/tags/${selectedTag.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete tag')
      }

      setTags(prev => prev.filter(tag => tag.id !== selectedTag.id))
      setDeleteDialogOpen(false)
    } catch (error) {
      console.error('Error deleting tag:', error)
      alert(error instanceof Error ? error.message : 'Failed to delete tag')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tags</h1>
          <p className="text-muted-foreground mt-2">
            Label and organize prompts with tags
          </p>
        </div>
        <Button onClick={handleCreateClick}>+ New Tag</Button>
      </div>

      {loading ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              Loading tags...
            </div>
          </CardContent>
        </Card>
      ) : tags.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Prompt Tags</CardTitle>
            <CardDescription>Add tags to categorize and filter your prompts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <span className="text-4xl mb-4 block">#</span>
              <p className="text-lg font-medium mb-2">No tags yet</p>
              <p className="text-sm mb-4">Create tags to organize and filter your prompts</p>
              <Button onClick={handleCreateClick}>Create Tag</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tags.map((tag) => (
            <Card key={tag.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: tag.color || '#6366f1' }}
                    />
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{tag.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {tag.promptCount} prompt{tag.promptCount !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEditClick(tag)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDeleteClick(tag)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Tag</DialogTitle>
            <DialogDescription>
              Add a new tag to organize your prompts
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., creative, technical, marketing"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2 flex-wrap">
                {DEFAULT_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-10 h-10 rounded-lg border-2 transition-all ${
                      formData.color === color ? 'border-primary scale-110' : 'border-border'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                  />
                ))}
              </div>
            </div>

            {errors.submit && (
              <div className="rounded-md bg-destructive/10 p-3">
                <p className="text-sm text-destructive">{errors.submit}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Tag'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Tag</DialogTitle>
            <DialogDescription>
              Update tag details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-name"
                name="name"
                placeholder="e.g., creative, technical, marketing"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2 flex-wrap">
                {DEFAULT_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-10 h-10 rounded-lg border-2 transition-all ${
                      formData.color === color ? 'border-primary scale-110' : 'border-border'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                  />
                ))}
              </div>
            </div>

            {errors.submit && (
              <div className="rounded-md bg-destructive/10 p-3">
                <p className="text-sm text-destructive">{errors.submit}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Tag</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{selectedTag?.name}&quot;?
              {selectedTag && selectedTag.promptCount > 0 && (
                <span className="block mt-2 text-destructive">
                  This tag is used by {selectedTag.promptCount} prompt{selectedTag.promptCount !== 1 ? 's' : ''}. Please remove the tag from prompts first.
                </span>
              )}
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
              disabled={isDeleting || (selectedTag?.promptCount ?? 0) > 0}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
