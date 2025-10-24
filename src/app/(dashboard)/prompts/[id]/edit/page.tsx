'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

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
  variables: string[] | null
  categoryId: string | null
  tags: Array<{
    id: string
    name: string
  }>
}

export default function EditPromptPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [originalPrompt, setOriginalPrompt] = useState<Prompt | null>(null)
  const [categories, setCategories] = useState<Category[]>([])

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    variables: '',
    tags: '',
    status: 'DRAFT',
    categoryId: '',
  })

  useEffect(() => {
    fetchPrompt()
    fetchCategories()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

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

  const fetchPrompt = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/prompts/${params.id}`)

      if (!response.ok) {
        if (response.status === 404) {
          setErrors({ fetch: 'Prompt not found' })
        } else if (response.status === 403) {
          setErrors({ fetch: 'Access denied' })
        } else {
          setErrors({ fetch: 'Failed to load prompt' })
        }
        return
      }

      const prompt = await response.json()
      setOriginalPrompt(prompt)

      // Populate form
      setFormData({
        title: prompt.title,
        description: prompt.description || '',
        content: prompt.content,
        variables: prompt.variables ? prompt.variables.join(', ') : '',
        tags: prompt.tags.map((t: { name: string }) => t.name).join(', '),
        status: prompt.status || 'DRAFT',
        categoryId: prompt.categoryId || '',
      })
    } catch (error) {
      console.error('Error fetching prompt:', error)
      setErrors({ fetch: 'Failed to load prompt' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleStatusChange = (value: string) => {
    setFormData(prev => ({ ...prev, status: value }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, categoryId: value }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters'
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Prompt content is required'
    } else if (formData.content.length < 10) {
      newErrors.content = 'Content must be at least 10 characters'
    }

    // Validate variables format if provided
    if (formData.variables.trim()) {
      try {
        const vars = formData.variables.split(',').map(v => v.trim()).filter(Boolean)
        if (vars.some(v => !v.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/))) {
          newErrors.variables = 'Variables must be valid identifiers (letters, numbers, underscores)'
        }
      } catch (e) {
        newErrors.variables = 'Invalid variable format'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Parse variables and tags
      const variables = formData.variables
        ? formData.variables.split(',').map(v => v.trim()).filter(Boolean)
        : []

      const tags = formData.tags
        ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        : []

      const response = await fetch(`/api/prompts/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          content: formData.content.trim(),
          variables: variables.length > 0 ? variables : null,
          status: formData.status,
          categoryId: formData.categoryId && formData.categoryId !== 'none' ? formData.categoryId : null,
          tags,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update prompt')
      }

      // Redirect to prompt detail page
      router.push(`/prompts/${params.id}`)
      router.refresh()
    } catch (error) {
      console.error('Error updating prompt:', error)
      setErrors({
        submit: error instanceof Error ? error.message : 'Failed to update prompt. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
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

  if (errors.fetch || !originalPrompt) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{errors.fetch || 'Prompt not found'}</CardDescription>
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

  const contentChanged = formData.content.trim() !== originalPrompt.content

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Prompt</h1>
          <p className="text-muted-foreground mt-2">
            Update your prompt details
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/prompts/${params.id}`}>Cancel</Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Prompt Details</CardTitle>
            <CardDescription>
              Make changes to your prompt below
              {contentChanged && (
                <span className="block mt-1 text-orange-600 dark:text-orange-400">
                  ⚠️ Content has changed - a new version will be created
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Blog Post Generator"
                value={formData.title}
                onChange={handleChange}
                className={errors.title ? 'border-destructive' : ''}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Brief description of what this prompt does..."
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Help others understand the purpose of this prompt
              </p>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Draft prompts are only visible to you
              </p>
            </div>

            {/* Category */}
            {categories.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="category">Category (Optional)</Label>
                <Select value={formData.categoryId} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
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
                <p className="text-xs text-muted-foreground">
                  Organize your prompt into a category
                </p>
              </div>
            )}

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">
                Prompt Content <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Enter your prompt here. Use {variable_name} for dynamic variables..."
                value={formData.content}
                onChange={handleChange}
                rows={10}
                className={errors.content ? 'border-destructive' : ''}
              />
              {errors.content && (
                <p className="text-sm text-destructive">{errors.content}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Use curly braces for variables, e.g., {'{topic}'}, {'{tone}'}
              </p>
            </div>

            {/* Variables */}
            <div className="space-y-2">
              <Label htmlFor="variables">Variables (Optional)</Label>
              <Input
                id="variables"
                name="variables"
                placeholder="topic, tone, length"
                value={formData.variables}
                onChange={handleChange}
                className={errors.variables ? 'border-destructive' : ''}
              />
              {errors.variables && (
                <p className="text-sm text-destructive">{errors.variables}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Comma-separated list of variable names used in your prompt
              </p>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (Optional)</Label>
              <Input
                id="tags"
                name="tags"
                placeholder="marketing, content, blog"
                value={formData.tags}
                onChange={handleChange}
              />
              <p className="text-xs text-muted-foreground">
                Comma-separated tags to help organize and find this prompt
              </p>
              {formData.tags && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.split(',').map((tag, index) => {
                    const trimmedTag = tag.trim()
                    return trimmedTag ? (
                      <Badge key={index} variant="secondary">
                        {trimmedTag}
                      </Badge>
                    ) : null
                  })}
                </div>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="rounded-md bg-destructive/10 p-4">
                <p className="text-sm text-destructive">{errors.submit}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href={`/prompts/${params.id}`}>Cancel</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Help Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Version History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            When you change the prompt content, a new version will be automatically created.
            You can view the full version history on the prompt detail page.
          </p>
          <ul className="space-y-2 list-disc list-inside mt-3">
            <li>Versions are automatically numbered (v1, v2, v3...)</li>
            <li>Previous versions are preserved and can be viewed</li>
            <li>Only content changes create new versions</li>
            <li>Metadata changes (title, description, tags) don&apos;t create versions</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
