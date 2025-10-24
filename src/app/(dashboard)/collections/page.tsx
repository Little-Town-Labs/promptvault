'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

interface Collection {
  id: string
  name: string
  description: string | null
  parentId: string | null
  parent: {
    id: string
    name: string
  } | null
  promptCount: number
  childrenCount: number
  createdAt: string
  updatedAt: string
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentId: '',
  })

  useEffect(() => {
    fetchCollections()
  }, [])

  const fetchCollections = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/collections')

      if (!response.ok) {
        throw new Error('Failed to fetch collections')
      }

      const data = await response.json()
      setCollections(data)
    } catch (error) {
      console.error('Error fetching collections:', error)
    } finally {
      setLoading(false)
    }
  }

  // Get root collections (those without a parent)
  const rootCollections = collections.filter(c => !c.parentId)

  // Get children for a specific collection
  const getChildren = (parentId: string) => {
    return collections.filter(c => c.parentId === parentId)
  }

  // Get available parent collections (excluding the selected collection and its descendants)
  const getAvailableParentCollections = () => {
    if (!selectedCollection) return collections

    // Function to get all descendant IDs recursively
    const getDescendantIds = (collectionId: string): string[] => {
      const children = collections.filter(c => c.parentId === collectionId)
      const descendantIds = children.map(c => c.id)
      children.forEach(child => {
        descendantIds.push(...getDescendantIds(child.id))
      })
      return descendantIds
    }

    const excludedIds = [selectedCollection.id, ...getDescendantIds(selectedCollection.id)]
    return collections.filter(c => !excludedIds.includes(c.id))
  }

  const handleCreateClick = () => {
    setFormData({
      name: '',
      description: '',
      parentId: '',
    })
    setErrors({})
    setCreateDialogOpen(true)
  }

  const handleEditClick = (collection: Collection) => {
    setSelectedCollection(collection)
    setFormData({
      name: collection.name,
      description: collection.description || '',
      parentId: collection.parentId || '',
    })
    setErrors({})
    setEditDialogOpen(true)
  }

  const handleDeleteClick = (collection: Collection) => {
    setSelectedCollection(collection)
    setDeleteDialogOpen(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Collection name is required'
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
      const response = await fetch('/api/collections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          parentId: formData.parentId && formData.parentId !== 'none' ? formData.parentId : null,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create collection')
      }

      const newCollection = await response.json()
      setCollections(prev => [...prev, newCollection].sort((a, b) => a.name.localeCompare(b.name)))
      setCreateDialogOpen(false)
    } catch (error) {
      console.error('Error creating collection:', error)
      setErrors({
        submit: error instanceof Error ? error.message : 'Failed to create collection',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdate = async () => {
    if (!selectedCollection || !validateForm()) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/collections/${selectedCollection.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          parentId: formData.parentId && formData.parentId !== 'none' ? formData.parentId : null,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update collection')
      }

      const updatedCollection = await response.json()
      setCollections(prev =>
        prev
          .map(col => (col.id === updatedCollection.id ? updatedCollection : col))
          .sort((a, b) => a.name.localeCompare(b.name))
      )
      setEditDialogOpen(false)
    } catch (error) {
      console.error('Error updating collection:', error)
      setErrors({
        submit: error instanceof Error ? error.message : 'Failed to update collection',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedCollection) return

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/collections/${selectedCollection.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete collection')
      }

      setCollections(prev => prev.filter(col => col.id !== selectedCollection.id))
      setDeleteDialogOpen(false)
    } catch (error) {
      console.error('Error deleting collection:', error)
      alert(error instanceof Error ? error.message : 'Failed to delete collection')
    } finally {
      setIsDeleting(false)
    }
  }

  // Recursive component to render collection tree
  const CollectionTreeItem = ({ collection, level = 0 }: { collection: Collection; level?: number }) => {
    const children = getChildren(collection.id)
    const hasChildren = children.length > 0

    return (
      <div key={collection.id}>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {level > 0 && (
                      <span className="text-muted-foreground text-sm">
                        {'└─'.padStart(level * 2 + 2, ' ')}
                      </span>
                    )}
                    <CardTitle className="text-lg truncate">{collection.name}</CardTitle>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary">
                      {collection.promptCount} prompt{collection.promptCount !== 1 ? 's' : ''}
                    </Badge>
                    {hasChildren && (
                      <Badge variant="outline">
                        {collection.childrenCount} sub-collection{collection.childrenCount !== 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>
                  {collection.parent && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Parent: {collection.parent.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          {collection.description && (
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {collection.description}
              </p>
            </CardContent>
          )}
          <CardContent className="pt-0">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => handleEditClick(collection)}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => handleDeleteClick(collection)}
              >
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>

        {hasChildren && (
          <div className="ml-6 mt-4 space-y-4">
            {children.map(child => (
              <CollectionTreeItem key={child.id} collection={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Collections</h1>
          <p className="text-muted-foreground mt-2">
            Organize prompts into collections and sub-collections
          </p>
        </div>
        <Button onClick={handleCreateClick}>+ New Collection</Button>
      </div>

      {loading ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              Loading collections...
            </div>
          </CardContent>
        </Card>
      ) : collections.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Prompt Collections</CardTitle>
            <CardDescription>Group related prompts together in collections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <span className="text-4xl mb-4 block">📁</span>
              <p className="text-lg font-medium mb-2">No collections yet</p>
              <p className="text-sm mb-4">Create collections to organize your prompts hierarchically</p>
              <Button onClick={handleCreateClick}>Create Collection</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {rootCollections.map((collection) => (
            <CollectionTreeItem key={collection.id} collection={collection} />
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Collection</DialogTitle>
            <DialogDescription>
              Add a new collection to organize your prompts
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
                placeholder="e.g., Customer Support, Product Descriptions"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="What kind of prompts belong in this collection?"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentId">Parent Collection (Optional)</Label>
              <Select
                value={formData.parentId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, parentId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="None (top level)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (top level)</SelectItem>
                  {collections.map((collection) => (
                    <SelectItem key={collection.id} value={collection.id}>
                      {collection.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              {isSubmitting ? 'Creating...' : 'Create Collection'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Collection</DialogTitle>
            <DialogDescription>
              Update collection details
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
                placeholder="e.g., Customer Support, Product Descriptions"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (Optional)</Label>
              <Textarea
                id="edit-description"
                name="description"
                placeholder="What kind of prompts belong in this collection?"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-parentId">Parent Collection (Optional)</Label>
              <Select
                value={formData.parentId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, parentId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="None (top level)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (top level)</SelectItem>
                  {getAvailableParentCollections().map((collection) => (
                    <SelectItem key={collection.id} value={collection.id}>
                      {collection.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <DialogTitle>Delete Collection</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{selectedCollection?.name}&quot;?
              {selectedCollection && selectedCollection.promptCount > 0 && (
                <span className="block mt-2 text-destructive">
                  This collection has {selectedCollection.promptCount} prompt{selectedCollection.promptCount !== 1 ? 's' : ''}. Please reassign or delete them first.
                </span>
              )}
              {selectedCollection && selectedCollection.childrenCount > 0 && (
                <span className="block mt-2 text-destructive">
                  This collection has {selectedCollection.childrenCount} sub-collection{selectedCollection.childrenCount !== 1 ? 's' : ''}. Please delete or reassign them first.
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
              disabled={isDeleting || (selectedCollection?.promptCount ?? 0) > 0 || (selectedCollection?.childrenCount ?? 0) > 0}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
