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
import { useToast } from '@/hooks/use-toast'
import { Copy, Key, Trash2, AlertTriangle } from 'lucide-react'

interface ApiKey {
  id: string
  name: string
  key: string
  createdAt: string
  lastUsedAt: string | null
  expiresAt: string | null
}

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedKey, setSelectedKey] = useState<ApiKey | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [newKeyCreated, setNewKeyCreated] = useState<string | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: '',
    expiresAt: '',
  })

  useEffect(() => {
    fetchApiKeys()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchApiKeys = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/api-keys')

      if (!response.ok) {
        throw new Error('Failed to fetch API keys')
      }

      const data = await response.json()
      setApiKeys(data)
    } catch (error) {
      console.error('Error fetching API keys:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load API keys',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateClick = () => {
    setFormData({
      name: '',
      expiresAt: '',
    })
    setErrors({})
    setNewKeyCreated(null)
    setCreateDialogOpen(true)
  }

  const handleDeleteClick = (apiKey: ApiKey) => {
    setSelectedKey(apiKey)
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
      newErrors.name = 'API key name is required'
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters'
    }

    if (formData.expiresAt) {
      const expirationDate = new Date(formData.expiresAt)
      if (isNaN(expirationDate.getTime())) {
        newErrors.expiresAt = 'Invalid date format'
      } else if (expirationDate <= new Date()) {
        newErrors.expiresAt = 'Expiration date must be in the future'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCreate = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          expiresAt: formData.expiresAt || null,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create API key')
      }

      const newKey = await response.json()
      setNewKeyCreated(newKey.key) // Store the full key to display once
      setApiKeys(prev => [newKey, ...prev])

      toast({
        title: 'Success',
        description: 'API key created successfully. Make sure to copy it now!',
      })
    } catch (error) {
      console.error('Error creating API key:', error)
      setErrors({
        submit: error instanceof Error ? error.message : 'Failed to create API key',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedKey) return

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/api-keys/${selectedKey.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete API key')
      }

      setApiKeys(prev => prev.filter(key => key.id !== selectedKey.id))
      setDeleteDialogOpen(false)

      toast({
        title: 'Success',
        description: 'API key deleted successfully',
      })
    } catch (error) {
      console.error('Error deleting API key:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete API key',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: 'Copied',
        description: 'API key copied to clipboard',
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to copy to clipboard',
      })
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false
    return new Date(expiresAt) <= new Date()
  }

  const closeCreateDialog = () => {
    setCreateDialogOpen(false)
    setNewKeyCreated(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
          <p className="text-muted-foreground mt-2">
            Manage API keys for programmatic access
          </p>
        </div>
        <Button onClick={handleCreateClick}>+ New API Key</Button>
      </div>

      {/* Security Warning */}
      <Card className="border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
        <CardHeader>
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5" />
            <div>
              <CardTitle className="text-amber-900 dark:text-amber-100">Security Notice</CardTitle>
              <CardDescription className="text-amber-800 dark:text-amber-200 mt-2">
                Keep your API keys secure and never share them publicly. API keys provide full access to your organization&apos;s data.
                If you suspect a key has been compromised, delete it immediately and create a new one.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              Loading API keys...
            </div>
          </CardContent>
        </Card>
      ) : apiKeys.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>Create API keys for programmatic access to your prompts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No API keys yet</p>
              <p className="text-sm mb-4">Create an API key to access your prompts programmatically</p>
              <Button onClick={handleCreateClick}>Create API Key</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {apiKeys.map((apiKey) => (
            <Card key={apiKey.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{apiKey.name}</CardTitle>
                      {isExpired(apiKey.expiresAt) && (
                        <Badge variant="destructive">Expired</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2 font-mono text-sm">
                      <span className="text-muted-foreground">{apiKey.key}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => copyToClipboard(apiKey.key)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteClick(apiKey)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium">Created:</span> {formatDate(apiKey.createdAt)}
                  </div>
                  <div>
                    <span className="font-medium">Last Used:</span> {formatDate(apiKey.lastUsedAt)}
                  </div>
                  {apiKey.expiresAt && (
                    <div>
                      <span className="font-medium">Expires:</span> {formatDate(apiKey.expiresAt)}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={closeCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create API Key</DialogTitle>
            <DialogDescription>
              {newKeyCreated
                ? 'Your API key has been created. Copy it now as it will not be shown again.'
                : 'Create a new API key for programmatic access'
              }
            </DialogDescription>
          </DialogHeader>
          {newKeyCreated ? (
            <div className="space-y-4 py-4">
              <div className="rounded-md bg-muted p-4">
                <Label className="text-sm font-medium mb-2 block">Your API Key (copy it now!)</Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm font-mono bg-background px-3 py-2 rounded border break-all">
                    {newKeyCreated}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(newKeyCreated)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="rounded-md bg-destructive/10 p-3">
                <p className="text-sm text-destructive font-medium">
                  Important: This is the only time you&apos;ll see the full API key. Store it securely.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., Production API, Development Key"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiresAt">Expiration Date (Optional)</Label>
                <Input
                  id="expiresAt"
                  name="expiresAt"
                  type="date"
                  value={formData.expiresAt}
                  onChange={handleChange}
                  className={errors.expiresAt ? 'border-destructive' : ''}
                />
                {errors.expiresAt && (
                  <p className="text-sm text-destructive">{errors.expiresAt}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Leave empty for no expiration
                </p>
              </div>

              {errors.submit && (
                <div className="rounded-md bg-destructive/10 p-3">
                  <p className="text-sm text-destructive">{errors.submit}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeCreateDialog}
            >
              {newKeyCreated ? 'Close' : 'Cancel'}
            </Button>
            {!newKeyCreated && (
              <Button onClick={handleCreate} disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create API Key'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete API Key</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the API key &quot;{selectedKey?.name}&quot;?
              <span className="block mt-2 text-destructive">
                This action cannot be undone. Any applications using this key will lose access.
              </span>
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
