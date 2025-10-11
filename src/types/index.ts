import { Prisma } from '@prisma/client'

// Re-export Prisma types
export type {
  Organization,
  User,
  OrganizationUser,
  Prompt,
  PromptVersion,
  Category,
  Collection,
  Tag,
  PromptTag,
  Comment,
  Favorite,
  Activity,
  ApiKey,
  Role,
  Plan,
  Status,
  PromptStatus,
  Visibility,
} from '@prisma/client'

// Extended types with relations
export type PromptWithRelations = Prisma.PromptGetPayload<{
  include: {
    author: true
    category: true
    collection: true
    tags: {
      include: {
        tag: true
      }
    }
    versions: true
    _count: {
      select: {
        comments: true
        favorites: true
      }
    }
  }
}>

export type OrganizationWithUsers = Prisma.OrganizationGetPayload<{
  include: {
    users: {
      include: {
        user: true
      }
    }
  }
}>

// Variable type for prompts
export interface Variable {
  name: string
  description?: string
  type: 'text' | 'number' | 'boolean' | 'select'
  required: boolean
  defaultValue?: string
  options?: string[]
}

// Metadata type for prompts
export interface PromptMetadata {
  model?: string
  temperature?: number
  maxTokens?: number
  topP?: number
  frequencyPenalty?: number
  presencePenalty?: number
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Filter and sort types
export interface PromptFilters {
  search?: string
  categoryId?: string
  collectionId?: string
  tagIds?: string[]
  authorId?: string
  status?: string
  visibility?: string
  dateFrom?: string
  dateTo?: string
}

export type SortField = 'createdAt' | 'updatedAt' | 'title' | 'viewCount' | 'useCount' | 'favoriteCount'
export type SortOrder = 'asc' | 'desc'

export interface SortOptions {
  field: SortField
  order: SortOrder
}

// Form types
export interface CreatePromptInput {
  title: string
  description?: string
  content: string
  categoryId?: string
  collectionId?: string
  tagIds?: string[]
  metadata?: PromptMetadata
  status?: 'DRAFT' | 'PUBLISHED'
  visibility?: 'PRIVATE' | 'ORGANIZATION'
}

export interface UpdatePromptInput extends Partial<CreatePromptInput> {
  changeNote?: string
}

// Search types
export interface SearchResult {
  id: string
  title: string
  description?: string
  content: string
  categoryName?: string
  tags: string[]
  authorName: string
  createdAt: string
  updatedAt: string
  highlights?: {
    title?: string[]
    description?: string[]
    content?: string[]
  }
}
