'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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

export default function NewPromptPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [categories, setCategories] = useState<Category[]>([])

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    variables: '',
    tags: '',
    categoryId: '',
  })

  useEffect(() => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
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

      const response = await fetch('/api/prompts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          content: formData.content.trim(),
          variables: variables.length > 0 ? variables : null,
          categoryId: formData.categoryId || null,
          tags,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create prompt')
      }

      const prompt = await response.json()

      // Redirect to prompts list
      router.push('/prompts')
      router.refresh()
    } catch (error) {
      console.error('Error creating prompt:', error)
      setErrors({
        submit: error instanceof Error ? error.message : 'Failed to create prompt. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Prompt</h1>
          <p className="text-muted-foreground mt-2">
            Add a new prompt to your library
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/prompts">Cancel</Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Prompt Details</CardTitle>
            <CardDescription>
              Fill in the information below to create your prompt
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

            {/* Category */}
            {categories.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="category">Category (Optional)</Label>
                <Select value={formData.categoryId} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
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
                {isSubmitting ? 'Creating...' : 'Create Prompt'}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/prompts">Cancel</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Help Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tips for Writing Great Prompts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <ul className="space-y-2 list-disc list-inside">
            <li>Be specific and clear about what you want the AI to do</li>
            <li>Use variables for dynamic content: {'{topic}'}, {'{tone}'}, {'{audience}'}</li>
            <li>Include context and examples when helpful</li>
            <li>Test and iterate on your prompts to improve results</li>
            <li>Add descriptive tags to make prompts easy to find later</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
