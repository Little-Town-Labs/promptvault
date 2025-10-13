# PromptVault - Claude Context File

> **Purpose**: This file provides comprehensive context about the PromptVault application for AI assistants to better understand the codebase, architecture, and development patterns.

**Last Updated**: 2025-10-12
**Project Version**: 0.1.0
**Framework**: Next.js 14 (App Router)

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Database Schema](#database-schema)
5. [Authentication & Multi-Tenancy](#authentication--multi-tenancy)
6. [API Design Patterns](#api-design-patterns)
7. [File Structure](#file-structure)
8. [Code Conventions](#code-conventions)
9. [Component Patterns](#component-patterns)
10. [State Management](#state-management)
11. [Environment Variables](#environment-variables)
12. [Development Workflow](#development-workflow)
13. [Testing Strategy](#testing-strategy)
14. [Known Gotchas](#known-gotchas)
15. [Business Logic](#business-logic)

---

## Project Overview

**PromptVault** is a modern, production-ready prompt management platform designed for teams and individuals working with AI prompts. It provides enterprise-grade features including:

- **Multi-tenant architecture** with complete data isolation
- **Version control** for prompt history
- **Favorites system** for quick access
- **Categories and tags** for organization
- **Search and filtering** capabilities
- **API key management** for programmatic access
- **Role-based access control** (OWNER, ADMIN, EDITOR, VIEWER)

### Key Features
- ✅ Complete CRUD operations for prompts
- ✅ Automatic version tracking when content changes
- ✅ Organization-based multi-tenancy via Clerk
- ✅ Search by title, description, or content
- ✅ Categories with colors and icons
- ✅ Flexible tagging system
- ✅ Favorites/starring system
- ✅ Dark mode support
- ✅ Responsive design (mobile, tablet, desktop)

---

## Tech Stack

### Core Framework
- **Next.js 14.2.0** - React framework with App Router
- **React 18.2.0** - UI library
- **TypeScript 5.9.3** - Type safety

### Database & ORM
- **PostgreSQL** - Primary database (via Neon)
- **Prisma 5.10.0** - ORM with full-text search preview feature
- **Database URL Pattern**: `postgresql://user:password@host/database?sslmode=require`

### Authentication
- **Clerk 5.0.0** - Complete authentication solution
  - Handles user management
  - Organization management
  - OAuth providers
  - Session management

### UI Components
- **shadcn/ui** - Radix UI + Tailwind CSS components
- **Tailwind CSS 3.4.1** - Utility-first CSS
- **Lucide React** - Icon library
- **next-themes** - Dark mode support
- **Sonner** - Toast notifications

### Additional Services
- **Vercel Analytics** - Performance monitoring
- **Vercel Speed Insights** - Real user monitoring
- **Vercel Blob** - File storage (optional)
- **Upstash Redis** - Rate limiting (optional)
- **Meilisearch** - Advanced search (optional)

### Development Tools
- **pnpm 8.15.0** - Package manager
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Vitest** - Unit testing
- **Playwright** - E2E testing

---

## Architecture

### Application Structure
```
Next.js App Router (src/app/)
├── Root Layout (RootLayout with ClerkProvider)
├── Public Pages
│   ├── Landing Page (/)
│   ├── Sign In (/sign-in)
│   └── Sign Up (/sign-up)
└── Protected Dashboard (/(dashboard)/)
    ├── Dashboard Layout (Navbar + Sidebar)
    ├── Dashboard (/dashboard)
    ├── Prompts (/prompts)
    ├── Categories (/categories)
    ├── Tags (/tags)
    ├── Collections (/collections)
    ├── Favorites (/favorites)
    └── Settings (/settings)
```

### Data Flow
```
User Request
    ↓
Next.js API Route (src/app/api/)
    ↓
Clerk Authentication (auth(), currentUser())
    ↓
Authorization Check (org-based)
    ↓
Prisma ORM
    ↓
PostgreSQL Database
    ↓
Response (JSON)
```

### Multi-Tenancy Model
- **Organization-based isolation**: All data tied to `organizationId`
- **Clerk Organization ID**: Used as unique org identifier
- **Fallback mechanism**: Personal workspace for users without org (`user_${userId}`)
- **Automatic organization creation**: Created on first prompt/category creation
- **Data access**: Users can only access data from their current organization

---

## Database Schema

### Core Models

#### Organization
```prisma
- id: String (cuid)
- name: String
- slug: String (unique)
- clerkOrgId: String (unique) // Links to Clerk
- plan: Plan (FREE, STARTER, PRO, ENTERPRISE)
- status: Status (ACTIVE, SUSPENDED, DELETED)
```

#### User
```prisma
- id: String (cuid)
- clerkUserId: String (unique) // Links to Clerk
- email: String (unique)
- firstName: String?
- lastName: String?
- avatarUrl: String?
```

#### Prompt (Core Entity)
```prisma
- id: String (cuid)
- organizationId: String // Multi-tenant isolation
- authorId: String
- title: String
- description: String?
- content: String (TEXT)
- variables: Json? // Array of { name, description }
- status: PromptStatus (DRAFT, PUBLISHED, ARCHIVED)
- visibility: Visibility (PRIVATE, ORGANIZATION, PUBLIC)
- categoryId: String?
- collectionId: String?
- metadata: Json? // AI model settings
- viewCount: Int
- useCount: Int
- favoriteCount: Int
```

#### PromptVersion
```prisma
- id: String (cuid)
- promptId: String
- version: Int
- content: String (TEXT)
- variables: Json?
- changeDescription: String?
- createdById: String
- createdAt: DateTime
```

#### Category
```prisma
- id: String (cuid)
- organizationId: String
- name: String
- slug: String
- description: String?
- color: String? // Hex color
- icon: String? // Emoji or icon name
```

#### Tag
```prisma
- id: String (cuid)
- organizationId: String
- name: String
- slug: String
- color: String?
```

#### Favorite
```prisma
- id: String (cuid)
- userId: String
- promptId: String
- createdAt: DateTime
- UNIQUE constraint on (userId, promptId)
```

#### Activity (Audit Log)
```prisma
- id: String (cuid)
- organizationId: String
- userId: String
- entityType: String
- entityId: String
- action: String
- metadata: Json?
- createdAt: DateTime
```

### Key Relationships
- Organization → Users (many-to-many via OrganizationUser)
- Organization → Prompts (one-to-many)
- Prompt → PromptVersions (one-to-many)
- Prompt → Category (many-to-one)
- Prompt → Tags (many-to-many via PromptTag)
- User → Favorites (one-to-many)
- Prompt → Comments (one-to-many)

### Indexes
- All `organizationId` fields indexed for multi-tenancy queries
- `clerkUserId` and `clerkOrgId` indexed for auth lookups
- `status`, `createdAt` indexed for filtering/sorting
- Full-text search enabled (Prisma preview feature)

---

## Authentication & Multi-Tenancy

### Clerk Integration

**Setup Pattern**:
```typescript
// Root Layout (src/app/layout.tsx)
<ClerkProvider>
  <html lang="en">
    <body>
      <ThemeProvider>{children}</ThemeProvider>
    </body>
  </html>
</ClerkProvider>
```

**API Authentication Pattern**:
```typescript
import { auth, currentUser } from '@clerk/nextjs/server'

export async function GET(request: NextRequest) {
  // Get auth context
  const { userId, orgId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get full user if needed
  const user = await currentUser()

  // Use orgId for multi-tenancy
  const organizationId = orgId || `user_${userId}` // Fallback to personal workspace

  // ... rest of logic
}
```

### Multi-Tenancy Implementation

**Organization Lookup Pattern**:
```typescript
// Always get org from Clerk context
const { orgId } = await auth()
const organizationId = orgId || `user_${userId}`

// Find or create organization
let organization = await prisma.organization.findUnique({
  where: { clerkOrgId: organizationId }
})

if (!organization) {
  // Auto-create on first use
  organization = await prisma.organization.create({
    data: {
      clerkOrgId: organizationId,
      name: orgId ? 'Organization' : `${user.firstName || 'Personal'} Workspace`,
      slug: organizationId.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    }
  })
}
```

**Data Access Control**:
```typescript
// ALWAYS filter by organizationId
const prompts = await prisma.prompt.findMany({
  where: {
    organizationId: organization.id, // Critical for data isolation
    // ... other filters
  }
})

// Check access before operations
if (prompt.organizationId !== organization.id) {
  return NextResponse.json({ error: 'Access denied' }, { status: 403 })
}
```

### User Management

**User Creation Pattern**:
```typescript
// Get or create user in database
let dbUser = await prisma.user.findUnique({
  where: { clerkUserId: userId }
})

if (!dbUser) {
  const clerkUser = await currentUser()
  dbUser = await prisma.user.create({
    data: {
      clerkUserId: userId,
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
    }
  })
}
```

---

## API Design Patterns

### Standard REST Endpoints

**Naming Convention**: `/api/{resource}` and `/api/{resource}/[id]`

### Common Patterns

#### GET Collection
```typescript
// GET /api/prompts
export async function GET(request: NextRequest) {
  const { userId, orgId } = await auth()
  if (!userId) return unauthorized()

  // Parse query params
  const searchParams = request.nextUrl.searchParams
  const search = searchParams.get('search')
  const status = searchParams.get('status')

  // Build where clause
  const where: any = {
    organizationId: orgId || `user_${userId}`,
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
    ]
  }

  // Fetch with relations
  const items = await prisma.prompt.findMany({
    where,
    include: { author: true, category: true, tags: true },
    orderBy: { updatedAt: 'desc' },
  })

  return NextResponse.json(items)
}
```

#### GET Single Item
```typescript
// GET /api/prompts/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId, orgId } = await auth()
  if (!userId) return unauthorized()

  const item = await prisma.prompt.findUnique({
    where: { id: params.id },
    include: { /* relations */ },
  })

  if (!item) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Check access
  const organization = await getOrganization(orgId, userId)
  if (item.organizationId !== organization.id) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 })
  }

  return NextResponse.json(item)
}
```

#### POST Create
```typescript
// POST /api/prompts
export async function POST(request: NextRequest) {
  const { userId, orgId } = await auth()
  if (!userId) return unauthorized()

  const body = await request.json()
  const { title, content, /* ... */ } = body

  // Validate required fields
  if (!title || !content) {
    return NextResponse.json(
      { error: 'Title and content are required' },
      { status: 400 }
    )
  }

  // Get or create user and organization
  const dbUser = await getOrCreateUser(userId)
  const organization = await getOrCreateOrganization(orgId, userId)

  // Create item
  const item = await prisma.prompt.create({
    data: {
      title: title.trim(),
      content: content.trim(),
      organizationId: organization.id,
      authorId: dbUser.id,
      // ... other fields
    },
    include: { /* relations */ },
  })

  // Log activity
  await logActivity('PROMPT_CREATED', item.id, dbUser.id, organization.id)

  return NextResponse.json(item, { status: 201 })
}
```

#### PUT Update
```typescript
// PUT /api/prompts/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId, orgId } = await auth()
  if (!userId) return unauthorized()

  const body = await request.json()

  // Get existing item
  const existing = await prisma.prompt.findUnique({
    where: { id: params.id }
  })

  if (!existing) return notFound()

  // Check access
  const organization = await getOrganization(orgId, userId)
  if (existing.organizationId !== organization.id) return forbidden()

  // Update item
  const updated = await prisma.prompt.update({
    where: { id: params.id },
    data: {
      title: body.title?.trim() || existing.title,
      content: body.content?.trim() || existing.content,
      // ... other fields
    },
  })

  // Create version if content changed
  if (body.content && body.content !== existing.content) {
    await createVersion(updated.id, body.content, userId)
  }

  return NextResponse.json(updated)
}
```

#### DELETE
```typescript
// DELETE /api/prompts/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId, orgId } = await auth()
  if (!userId) return unauthorized()

  const item = await prisma.prompt.findUnique({
    where: { id: params.id }
  })

  if (!item) return notFound()

  // Check access
  const organization = await getOrganization(orgId, userId)
  if (item.organizationId !== organization.id) return forbidden()

  // Log before deletion
  await logActivity('PROMPT_DELETED', item.id, userId, organization.id)

  // Delete (cascade handles relations)
  await prisma.prompt.delete({
    where: { id: params.id }
  })

  return NextResponse.json({ success: true })
}
```

### Error Handling Pattern
```typescript
try {
  // ... operation
} catch (error) {
  console.error('Error description:', error)
  return NextResponse.json(
    { error: 'User-friendly message' },
    { status: 500 }
  )
}
```

### Activity Logging Pattern
```typescript
await prisma.activity.create({
  data: {
    action: 'PROMPT_CREATED', // or UPDATED, DELETED, etc.
    entityType: 'PROMPT',
    entityId: prompt.id,
    userId: dbUser.id,
    organizationId: organization.id,
    metadata: {
      promptTitle: prompt.title,
      // ... additional context
    },
  },
})
```

---

## File Structure

```
PromptVault/
├── .github/
│   └── workflows/
│       └── ci.yml                    # CI/CD pipeline
├── prisma/
│   ├── schema.prisma                 # Database schema
│   └── seed.ts                       # Database seeding
├── public/                           # Static assets
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout (ClerkProvider)
│   │   ├── page.tsx                  # Landing page
│   │   ├── globals.css               # Global styles
│   │   ├── sign-in/[[...sign-in]]/   # Clerk sign-in page
│   │   ├── sign-up/[[...sign-up]]/   # Clerk sign-up page
│   │   ├── (dashboard)/              # Protected routes group
│   │   │   ├── layout.tsx            # Dashboard layout (Navbar + Sidebar)
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── prompts/
│   │   │   │   ├── page.tsx          # List prompts
│   │   │   │   ├── new/page.tsx      # Create prompt
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx      # View prompt
│   │   │   │       └── edit/page.tsx # Edit prompt
│   │   │   ├── categories/page.tsx
│   │   │   ├── tags/page.tsx
│   │   │   ├── collections/page.tsx
│   │   │   ├── favorites/page.tsx
│   │   │   └── settings/
│   │   │       ├── page.tsx
│   │   │       └── api-keys/page.tsx
│   │   └── api/                      # API routes
│   │       ├── prompts/
│   │       │   ├── route.ts          # GET, POST /api/prompts
│   │       │   └── [id]/
│   │       │       ├── route.ts      # GET, PUT, DELETE /api/prompts/[id]
│   │       │       └── favorite/route.ts
│   │       ├── categories/
│   │       │   ├── route.ts
│   │       │   └── [id]/route.ts
│   │       ├── tags/
│   │       ├── collections/
│   │       ├── favorites/
│   │       └── api-keys/
│   ├── components/
│   │   ├── ui/                       # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── badge.tsx
│   │   │   └── ...
│   │   └── layout/
│   │       ├── navbar.tsx            # Top navigation
│   │       └── sidebar.tsx           # Side navigation
│   ├── lib/
│   │   ├── prisma.ts                 # Prisma client singleton
│   │   └── utils.ts                  # Utility functions
│   ├── types/                        # TypeScript type definitions
│   └── hooks/                        # Custom React hooks
├── tests/                            # Test files (Playwright, Vitest)
├── docs/                             # Documentation
├── .env.example                      # Environment variables template
├── .eslintrc.json                    # ESLint configuration
├── .prettierrc                       # Prettier configuration
├── tailwind.config.ts                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
├── next.config.js                    # Next.js configuration
├── package.json                      # Dependencies and scripts
└── pnpm-lock.yaml                    # pnpm lockfile
```

### Path Aliases
```typescript
// Configured in tsconfig.json
"@/*": ["./src/*"]
"@/components/*": ["./src/components/*"]
"@/lib/*": ["./src/lib/*"]
"@/types/*": ["./src/types/*"]
"@/hooks/*": ["./src/hooks/*"]
```

---

## Code Conventions

### Naming Conventions

**Files**:
- React components: `PascalCase.tsx` (e.g., `PromptCard.tsx`)
- Pages: `page.tsx`, `layout.tsx`, `route.ts`
- Utilities: `kebab-case.ts` (e.g., `date-utils.ts`)
- Types: `PascalCase.ts` or grouped in `types/index.ts`

**Variables & Functions**:
- Variables: `camelCase`
- Functions: `camelCase`
- React components: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- Types/Interfaces: `PascalCase`

**Database**:
- Tables: `snake_case` (e.g., `prompt_versions`)
- Model names in Prisma: `PascalCase` (e.g., `PromptVersion`)
- IDs: `cuid()` for all primary keys

### TypeScript Patterns

**Type Definitions**:
```typescript
// Prefer interfaces for objects
interface Prompt {
  id: string
  title: string
  content: string
  // ...
}

// Use type for unions
type PromptStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

// Use Prisma-generated types where possible
import { Prompt, Category } from '@prisma/client'

// For API responses with relations
type PromptWithRelations = Prompt & {
  author: User
  category: Category | null
  tags: Tag[]
}
```

**Async/Await**:
```typescript
// Always use async/await (not promises)
const data = await fetchData()

// Use try-catch for error handling
try {
  const result = await operation()
} catch (error) {
  console.error('Error:', error)
}
```

### React Patterns

**Client vs Server Components**:
```typescript
// Server components by default (no 'use client')
// API route components
export default function Page() {
  // Can use async/await directly
  const data = await fetchData()
  return <div>{data}</div>
}

// Client components when needed
'use client' // Add at top of file

// Needed for:
// - useState, useEffect, useContext
// - Event handlers
// - Browser APIs
// - Third-party client libraries
```

**State Management**:
```typescript
// Use local state for component-specific data
const [data, setData] = useState<Type[]>([])
const [loading, setLoading] = useState(true)

// Use fetch in useEffect
useEffect(() => {
  fetchData()
}, []) // Dependencies array
```

**Event Handlers**:
```typescript
// Name handlers with 'handle' prefix
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  // ... logic
}

const handleDelete = async (id: string) => {
  // ... logic
}
```

### Styling

**Tailwind CSS**:
```typescript
// Use cn() utility for conditional classes
import { cn } from '@/lib/utils'

<div className={cn(
  'base classes',
  condition && 'conditional classes',
  anotherCondition ? 'true classes' : 'false classes'
)} />
```

**Component Variants**:
```typescript
// Use shadcn/ui button variants
<Button variant="default">Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>

// Use size variants
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
```

### Error Handling

**API Routes**:
```typescript
// Always return proper status codes
return NextResponse.json({ error: 'Message' }, { status: 401 }) // Unauthorized
return NextResponse.json({ error: 'Message' }, { status: 403 }) // Forbidden
return NextResponse.json({ error: 'Message' }, { status: 404 }) // Not Found
return NextResponse.json({ error: 'Message' }, { status: 400 }) // Bad Request
return NextResponse.json({ error: 'Message' }, { status: 500 }) // Server Error
```

**Client-side**:
```typescript
// Check response status
const response = await fetch('/api/prompts')
if (!response.ok) {
  throw new Error('Failed to fetch')
}
const data = await response.json()

// Use try-catch
try {
  await operation()
} catch (error) {
  console.error('Error:', error)
  alert('User-friendly message') // Or use toast
}
```

---

## Component Patterns

### shadcn/ui Components

**Installation Pattern**:
```bash
# Components are copied into src/components/ui/
# Modified as needed for the project
```

**Common Components**:
- `Button` - All CTAs and actions
- `Card` - Content containers
- `Dialog` - Modals and confirmations
- `Input` - Text inputs
- `Textarea` - Multi-line text
- `Select` - Dropdowns
- `Badge` - Status indicators, tags
- `Separator` - Dividers
- `Toaster` - Toast notifications (via Sonner)
- `Switch` - Toggle switches

### Layout Components

**Navbar** (`src/components/layout/navbar.tsx`):
- Sticky top header
- Logo and navigation links
- User menu (Clerk UserButton)
- Search button (cmd+k)

**Sidebar** (`src/components/layout/sidebar.tsx`):
- Left navigation panel
- Main navigation (Dashboard, Prompts, Favorites, etc.)
- Secondary navigation (Settings, API Keys)
- "New Prompt" button at bottom
- Active route highlighting

### Page Structure Pattern

```typescript
'use client'

import { useEffect, useState } from 'react'
// ... imports

export default function PageName() {
  // State
  const [data, setData] = useState<Type[]>([])
  const [loading, setLoading] = useState(true)

  // Effects
  useEffect(() => {
    fetchData()
  }, [])

  // Functions
  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/endpoint')
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Event handlers
  const handleAction = async () => {
    // ... logic
  }

  // Render
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Title</h1>
          <p className="text-muted-foreground">Description</p>
        </div>
        <Button>Action</Button>
      </div>

      {/* Content */}
      {loading ? (
        <Card>Loading...</Card>
      ) : data.length === 0 ? (
        <Card>Empty state</Card>
      ) : (
        <div className="grid gap-4">
          {data.map(item => (
            <Card key={item.id}>...</Card>
          ))}
        </div>
      )}
    </div>
  )
}
```

---

## State Management

### Local State (useState)
- Used for all component-specific state
- Form inputs, loading states, dialogs
- No global state management library (Redux, Zustand) currently

### Server State
- Data fetched from API routes
- No caching library (React Query, SWR) currently
- Manual refetching after mutations

### URL State
- Search params for filters
- Route params for IDs
- Next.js navigation hooks

### Theme State
- Managed by `next-themes`
- System, light, dark modes
- Persisted in localStorage

---

## Environment Variables

### Required Variables

```bash
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000      # App URL (public)
NODE_ENV=development                            # Environment

# Clerk Authentication (Required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...  # Clerk public key
CLERK_SECRET_KEY=sk_test_...                    # Clerk secret key

# Database (Required)
DATABASE_URL=postgresql://...                   # PostgreSQL connection
```

### Optional Variables

```bash
# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=vercel_blob_xxx

# Upstash Redis (Rate Limiting)
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx

# Meilisearch (Advanced Search)
MEILISEARCH_HOST=https://xxx.meilisearch.io
MEILISEARCH_MASTER_KEY=xxx

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_AI_SUGGESTIONS=false
```

### Access Pattern

```typescript
// Client-side (must be prefixed with NEXT_PUBLIC_)
const appUrl = process.env.NEXT_PUBLIC_APP_URL

// Server-side only
const dbUrl = process.env.DATABASE_URL
const clerkSecret = process.env.CLERK_SECRET_KEY
```

---

## Development Workflow

### Commands

```bash
# Development
pnpm dev              # Start dev server (localhost:3000)
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm format           # Format with Prettier
pnpm type-check       # TypeScript type checking

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema to database
pnpm db:migrate       # Create migration
pnpm db:studio        # Open Prisma Studio GUI

# Testing
pnpm test             # Run Vitest unit tests
pnpm e2e              # Run Playwright E2E tests
pnpm e2e:ui           # Run Playwright with UI
```

### Git Workflow

```bash
# Husky hooks configured for:
# - pre-commit: lint-staged (format + lint)
# - commit-msg: conventional commits

# Feature branch workflow
git checkout -b feature/new-feature
git commit -m "feat: add new feature"
git push origin feature/new-feature
# Create PR on GitHub
```

### CI/CD Pipeline

**GitHub Actions** (`.github/workflows/ci.yml`):
1. Install dependencies (pnpm)
2. Generate Prisma client
3. Run linter
4. Run type check
5. Build application

**Deployment** (Vercel):
- Automatic deployments on push to main
- Preview deployments for PRs
- Environment variables set in Vercel dashboard

---

## Testing Strategy

### Current Status
- **Unit Tests**: Configured with Vitest (not yet implemented)
- **E2E Tests**: Configured with Playwright (test plan created)
- **CI**: Basic checks (lint, type-check, build)

### Playwright Test Plan
See `PLAYWRIGHT_TEST_PLAN.md` for comprehensive E2E test strategy including:
- Authentication tests
- CRUD operations
- Multi-tenancy isolation
- API tests
- Visual regression
- Accessibility

### Testing Approach
- Test critical paths first (auth, prompts CRUD, multi-tenancy)
- Use test database with seeded data
- Clean up after each test
- Mock Clerk authentication in tests

---

## Known Gotchas

### 1. Organization Auto-Creation
- Organizations are auto-created on first prompt/category creation
- This can lead to orphaned organizations
- **Solution**: Accept this behavior or implement explicit org creation flow

### 2. Clerk User Sync
- Users must be synced to local database before creating content
- Auto-sync happens on first API call
- **Solution**: Use `getOrCreateUser()` helper in all API routes

### 3. Multi-Tenancy Pitfalls
- **ALWAYS** filter by `organizationId` in queries
- **ALWAYS** check `organizationId` match before updates/deletes
- Missing checks = data leaks between organizations
- **Solution**: Use consistent patterns, add tests for isolation

### 4. Version Creation
- Versions only created when `content` changes (not title/description)
- Manual version creation in API routes
- **Solution**: Consider extracting to helper function

### 5. Tag Management
- Tags auto-created when used in prompts
- Can lead to duplicate tags with different cases
- **Solution**: Normalize tag names to lowercase

### 6. Prisma Client
- Must regenerate after schema changes (`pnpm db:generate`)
- Client is singleton (avoid multiple instances)
- **Solution**: Always use `lib/prisma.ts` export

### 7. Route Groups
- `(dashboard)` folder doesn't affect URL path
- Used for layout grouping only
- **Solution**: Understand App Router routing conventions

### 8. Client vs Server Components
- Default is server component
- Add `'use client'` only when needed (state, effects, events)
- **Solution**: Start with server component, convert if needed

### 9. Image Handling
- No image upload implemented yet
- Avatar URLs from Clerk
- **Solution**: Implement Vercel Blob if needed

### 10. Search Limitations
- Basic contains search (case-insensitive)
- No full-text search yet
- **Solution**: Implement Meilisearch for advanced search

---

## Business Logic

### Prompt Lifecycle

```
1. DRAFT (default)
   ↓
2. PUBLISHED (user action)
   ↓
3. ARCHIVED (user action)
```

- New prompts start as DRAFT
- Only PUBLISHED prompts shown in public/shared views (future feature)
- ARCHIVED prompts hidden by default

### Version Control

**When versions are created**:
- Initial version (v1) on prompt creation
- New version when `content` field changes
- Not when title, description, or metadata changes

**Version numbering**:
- Auto-incremented integer (1, 2, 3, ...)
- Stored with full content snapshot
- Change description optional

### Favorites System

**How it works**:
- User can favorite/unfavorite any prompt in their org
- Toggle endpoint: POST `/api/prompts/[id]/favorite`
- Returns new favorite state and count
- `isFavorited` flag added to prompt responses

**Favorite count**:
- Denormalized on Prompt model
- Updated on favorite/unfavorite
- Could be inconsistent (consider using `_count` instead)

### Activity Logging

**Actions logged**:
- PROMPT_CREATED
- PROMPT_UPDATED
- PROMPT_DELETED
- CATEGORY_CREATED
- (Add more as needed)

**Activity record**:
```typescript
{
  action: 'PROMPT_CREATED',
  entityType: 'PROMPT',
  entityId: '...',
  userId: '...',
  organizationId: '...',
  metadata: { /* contextual data */ },
  createdAt: Date
}
```

**Usage**:
- Audit trail
- Activity feed (not yet implemented)
- Analytics (not yet implemented)

### Search & Filter Logic

**Search**:
- Searches in: title, description, content
- Case-insensitive
- Uses PostgreSQL `contains` (not full-text yet)
- OR logic (matches any field)

**Filters**:
- Category: Exact match on `categoryId`
- Status: Exact match on `status` enum
- Tags: Implemented client-side (filter results after fetch)
  - Consider moving to server-side for performance

### Permissions (Future)

**Current state**:
- All org members have full access
- No role-based restrictions enforced

**Planned**:
- OWNER: All permissions
- ADMIN: Manage categories, tags, members
- EDITOR: Create, edit, delete own prompts
- VIEWER: Read-only access

**Implementation needed**:
- Check role in API routes
- Conditional UI based on role
- Add `canEdit()`, `canDelete()` helpers

---

## Important Files Reference

### Must-Read Files
1. `prisma/schema.prisma` - Complete data model
2. `src/app/api/prompts/route.ts` - API pattern examples
3. `src/app/(dashboard)/prompts/page.tsx` - Client component pattern
4. `src/lib/utils.ts` - Utility functions
5. `src/components/layout/sidebar.tsx` - Navigation structure

### Configuration Files
- `tsconfig.json` - Path aliases, compiler options
- `tailwind.config.ts` - Design tokens
- `.env.example` - Required environment variables
- `next.config.js` - Next.js configuration

### Documentation
- `README.md` - Project overview and setup
- `PLAYWRIGHT_TEST_PLAN.md` - Testing strategy
- `DEPLOYMENT_GUIDE.md` - Vercel deployment steps

---

## Future Enhancements

**Planned Features** (from README.md):
- [ ] Collections/Folders (UI ready, logic needed)
- [ ] Comments system (schema ready, UI needed)
- [ ] Public prompt sharing
- [ ] API key authentication
- [ ] AI-powered suggestions
- [ ] Prompt templates
- [ ] Export/Import functionality
- [ ] Advanced analytics
- [ ] Role-based access control
- [ ] Full-text search with Meilisearch

**Technical Improvements**:
- [ ] Add React Query for server state management
- [ ] Implement rate limiting with Upstash
- [ ] Add Sentry for error monitoring
- [ ] Implement image upload with Vercel Blob
- [ ] Add E2E tests with Playwright
- [ ] Add unit tests with Vitest
- [ ] Implement optimistic updates
- [ ] Add WebSocket for real-time updates
- [ ] Performance monitoring
- [ ] SEO optimization

---

## Quick Reference

### Common Queries

**Get prompts for current user's org**:
```typescript
const prompts = await prisma.prompt.findMany({
  where: { organizationId: org.id },
  include: { author: true, category: true, tags: true },
})
```

**Check if user has access to prompt**:
```typescript
const prompt = await prisma.prompt.findUnique({ where: { id } })
const org = await getOrganization(orgId, userId)
if (prompt.organizationId !== org.id) {
  throw new Error('Access denied')
}
```

**Create version**:
```typescript
await prisma.promptVersion.create({
  data: {
    promptId,
    version: nextVersionNumber,
    content,
    createdById: userId,
  },
})
```

### Common Utilities

**Slugify**:
```typescript
import { slugify } from '@/lib/utils'
const slug = slugify('My Category Name') // 'my-category-name'
```

**Format Date**:
```typescript
import { formatDate, formatRelativeTime } from '@/lib/utils'
formatDate(new Date()) // 'Jan 1, 2025'
formatRelativeTime(new Date()) // '2h ago'
```

**Extract Variables**:
```typescript
import { extractVariables } from '@/lib/utils'
const vars = extractVariables('Hello {{name}}, welcome to {{place}}!')
// ['name', 'place']
```

**Class Names**:
```typescript
import { cn } from '@/lib/utils'
cn('base-class', condition && 'conditional-class')
```

---

## Support & Resources

### Official Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Clerk Docs](https://clerk.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Project-Specific
- GitHub Repository: (Add URL)
- Deployment: (Add Vercel URL)
- Database: Neon PostgreSQL
- Auth: Clerk Dashboard

---

**This file is maintained as the source of truth for AI assistants working with the PromptVault codebase. Keep it updated as the project evolves.**
