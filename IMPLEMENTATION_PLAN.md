# Prompt Vault - Implementation Plan

**From Foundation to Production**

This document provides a step-by-step plan to build Prompt Vault from the current foundation to a production-ready MVP.

---

## 🎯 Plan Overview

**Timeline**: 12 weeks (3 months)
**Goal**: Production-ready MVP with core features
**Target**: 100 beta users, 1,000 prompts created

---

## 📅 Week-by-Week Plan

### **Week 1: Environment Setup & UI Foundation**

#### Day 1-2: Development Environment
```bash
# Tasks
□ Set up Clerk account and configure organizations
□ Set up Neon database
□ Configure environment variables
□ Run initial database migration
□ Test authentication flow

# Commands
pnpm install
cp .env.example .env
# Edit .env with credentials
pnpm db:generate
pnpm db:push
pnpm dev
```

#### Day 3-4: Install shadcn/ui Components
```bash
# Initialize shadcn/ui
pnpx shadcn-ui@latest init

# Install required components
pnpx shadcn-ui@latest add button
pnpx shadcn-ui@latest add form
pnpx shadcn-ui@latest add input
pnpx shadcn-ui@latest add label
pnpx shadcn-ui@latest add textarea
pnpx shadcn-ui@latest add select
pnpx shadcn-ui@latest add dialog
pnpx shadcn-ui@latest add dropdown-menu
pnpx shadcn-ui@latest add table
pnpx shadcn-ui@latest add badge
pnpx shadcn-ui@latest add avatar
pnpx shadcn-ui@latest add card
pnpx shadcn-ui@latest add tabs
pnpx shadcn-ui@latest add separator
pnpx shadcn-ui@latest add command
pnpx shadcn-ui@latest add popover
pnpx shadcn-ui@latest add tooltip
```

#### Day 5: Layout Components
Create core layout components:

**Files to Create**:
- `src/components/layout/navbar.tsx` - Top navigation
- `src/components/layout/sidebar.tsx` - Side navigation
- `src/components/layout/user-menu.tsx` - User dropdown
- `src/components/layout/org-switcher.tsx` - Organization switcher
- `src/components/layout/main-layout.tsx` - Main wrapper

#### Deliverables
- ✅ Development environment ready
- ✅ shadcn/ui components installed
- ✅ Basic layout structure
- ✅ Authentication working

---

### **Week 2: Dashboard & Navigation**

#### Day 1-2: Dashboard Page
**File**: `src/app/(dashboard)/dashboard/page.tsx`

Features:
- Welcome message with user name
- Quick stats (total prompts, recent activity)
- Recent prompts list
- Quick actions (Create Prompt button)

#### Day 3: Dashboard Layout
**File**: `src/app/(dashboard)/layout.tsx`

Components:
- Sidebar with navigation
- Top navbar with search, notifications, user menu
- Breadcrumbs
- Organization switcher

#### Day 4: Navigation & Routing
Create route structure:
```
src/app/(dashboard)/
├── dashboard/
│   └── page.tsx              # Dashboard home
├── prompts/
│   ├── page.tsx              # List prompts
│   ├── new/page.tsx          # Create prompt
│   └── [id]/
│       ├── page.tsx          # View prompt
│       └── edit/page.tsx     # Edit prompt
├── categories/
│   └── page.tsx              # Manage categories
├── tags/
│   └── page.tsx              # Manage tags
└── settings/
    └── page.tsx              # Settings
```

#### Day 5: Empty States & Loading
- Empty state components
- Loading skeletons
- Error boundaries

#### Deliverables
- ✅ Dashboard with navigation
- ✅ Route structure defined
- ✅ Layout components working

---

### **Week 3: Prompt List & View**

#### Day 1-2: API Route - List Prompts
**File**: `src/app/api/prompts/route.ts`

```typescript
// GET /api/prompts
// Features:
- Pagination (limit, offset)
- Filtering (category, tags, status, author)
- Sorting (createdAt, updatedAt, title, viewCount)
- Search integration (coming later)
- Row-level security (organizationId)
```

#### Day 3-4: Prompt List Page
**File**: `src/app/(dashboard)/prompts/page.tsx`

Components:
- Prompt grid/list view toggle
- Filter sidebar (category, tags, date, author)
- Sort dropdown
- Pagination controls
- Prompt card component

**Create**: `src/components/prompts/prompt-card.tsx`
- Title, description
- Tags, category badge
- Author avatar
- Stats (views, favorites)
- Quick actions (view, edit, delete)

#### Day 5: Prompt Detail View
**File**: `src/app/(dashboard)/prompts/[id]/page.tsx`

Features:
- Full prompt content display
- Metadata (author, dates, category, tags)
- Variable list
- Action buttons (edit, delete, favorite, duplicate)
- Version history tab
- Comments section (placeholder)

#### Deliverables
- ✅ List prompts with filtering
- ✅ Prompt card component
- ✅ Prompt detail page
- ✅ API route with RLS

---

### **Week 4: Create & Edit Prompts**

#### Day 1-2: API Routes
**Files**:
- `src/app/api/prompts/route.ts` - POST (create)
- `src/app/api/prompts/[id]/route.ts` - GET, PATCH, DELETE

Features:
- Validation with Zod
- Automatic variable extraction
- Version creation on edit
- RBAC checks (role permissions)

#### Day 3-4: Create Prompt Form
**File**: `src/app/(dashboard)/prompts/new/page.tsx`

Form fields:
- Title (required)
- Description (optional)
- Content (textarea, required)
- Category (select)
- Tags (multi-select with create)
- Collection (select)
- Status (draft/published)
- Visibility (private/organization)
- Metadata (model, temperature, etc.)

**Create**: `src/components/prompts/prompt-form.tsx`
- React Hook Form + Zod validation
- Auto-save draft (debounced)
- Variable preview (extracted from content)
- Rich text editor integration prep

#### Day 5: Edit Prompt
**File**: `src/app/(dashboard)/prompts/[id]/edit/page.tsx`

Features:
- Load existing prompt
- Reuse prompt-form component
- Version note field
- Preview mode toggle

#### Deliverables
- ✅ Create prompt functionality
- ✅ Edit prompt functionality
- ✅ Form validation
- ✅ Auto-save drafts

---

### **Week 5: Categories & Tags Management**

#### Day 1: API Routes
**Files**:
- `src/app/api/categories/route.ts` - GET, POST
- `src/app/api/categories/[id]/route.ts` - PATCH, DELETE
- `src/app/api/tags/route.ts` - GET, POST
- `src/app/api/tags/[id]/route.ts` - DELETE

#### Day 2-3: Categories Page
**File**: `src/app/(dashboard)/categories/page.tsx`

Features:
- List categories with prompt count
- Create category dialog
- Edit category inline
- Delete with confirmation
- Color picker for category color
- Icon/emoji selector

#### Day 4: Tags Page
**File**: `src/app/(dashboard)/tags/page.tsx`

Features:
- Tag cloud visualization
- Usage count per tag
- Merge tags functionality
- Bulk delete
- Rename tags

#### Day 5: Tag/Category Components
**Create**:
- `src/components/categories/category-badge.tsx`
- `src/components/categories/category-selector.tsx`
- `src/components/tags/tag-input.tsx` - Create tags on the fly
- `src/components/tags/tag-badge.tsx`

#### Deliverables
- ✅ Category management
- ✅ Tag management
- ✅ Reusable components
- ✅ API routes complete

---

### **Week 6: Collections & Organization**

#### Day 1-2: Collections API
**Files**:
- `src/app/api/collections/route.ts` - GET, POST
- `src/app/api/collections/[id]/route.ts` - GET, PATCH, DELETE

Features:
- Nested collections (folders)
- Move prompts between collections
- Collection hierarchy

#### Day 3-4: Collections UI
**Create**:
- `src/components/collections/collection-tree.tsx` - Nested tree view
- `src/components/collections/collection-dialog.tsx` - Create/edit

Features:
- Drag-and-drop (react-dnd or dnd-kit)
- Breadcrumb navigation
- Collection context menu
- Move to collection dialog

#### Day 5: Integrate with Prompts
Update prompt list page:
- Add collection filter
- Show collection in prompt card
- Bulk move to collection

#### Deliverables
- ✅ Collections functionality
- ✅ Nested folder structure
- ✅ Move prompts to collections
- ✅ Collection tree navigation

---

### **Week 7: Search & Filtering**

#### Day 1-2: Meilisearch Setup
```bash
# Sign up at meilisearch.com or self-host
# Add credentials to .env

MEILISEARCH_HOST=https://xxx.meilisearch.io
MEILISEARCH_MASTER_KEY=xxx
```

**Create**: `src/lib/meilisearch.ts`
- Initialize client
- Index management
- Search functions

#### Day 3: Indexing Service
**Create**: `src/lib/services/search-index.ts`

Functions:
- `indexPrompt(prompt)` - Add to index
- `updatePromptIndex(prompt)` - Update index
- `deleteFromIndex(promptId)` - Remove
- `reindexAll()` - Bulk reindex

Hook into prompt CRUD operations to auto-index.

#### Day 4: Search API
**File**: `src/app/api/search/route.ts`

Features:
- Full-text search across title, description, content
- Faceted search (filters)
- Typo tolerance
- Highlighting
- Sort by relevance

#### Day 5: Search UI
**Create**: `src/components/search/search-bar.tsx`

Features:
- Command palette (Cmd+K)
- Instant search results
- Keyboard navigation
- Recent searches
- Search filters

#### Deliverables
- ✅ Meilisearch integrated
- ✅ Auto-indexing on CRUD
- ✅ Search API endpoint
- ✅ Search UI with command palette

---

### **Week 8: Version History**

#### Day 1-2: Version API
**File**: `src/app/api/prompts/[id]/versions/route.ts`

Features:
- List all versions
- Get specific version
- Revert to version (creates new version)
- Compare versions (diff)

#### Day 3-4: Version History UI
**Create**: `src/components/prompts/version-history.tsx`

Features:
- Timeline view of versions
- Version metadata (who, when, note)
- Diff viewer (text comparison)
- Revert button with confirmation
- Version notes

#### Day 5: Diff Viewer
**Create**: `src/components/prompts/diff-viewer.tsx`

Use library: `react-diff-viewer` or `diff-match-patch`

Features:
- Side-by-side diff
- Inline diff option
- Syntax highlighting
- Line numbers

#### Deliverables
- ✅ Version history API
- ✅ Version timeline UI
- ✅ Diff viewer
- ✅ Revert functionality

---

### **Week 9: User & Organization Management**

#### Day 1-2: Organization Settings
**File**: `src/app/(dashboard)/settings/organization/page.tsx`

Features:
- Organization name, slug
- Branding (logo, colors)
- Plan information
- Usage stats
- Billing (placeholder)

#### Day 3-4: Team Management
**File**: `src/app/(dashboard)/settings/team/page.tsx`

Features:
- List team members with roles
- Invite members (email)
- Change member roles
- Remove members
- Pending invitations

**API**:
- `src/app/api/organizations/[id]/members/route.ts`
- `src/app/api/organizations/[id]/invites/route.ts`

#### Day 5: User Settings
**File**: `src/app/(dashboard)/settings/profile/page.tsx`

Features:
- Profile information
- Avatar upload
- Email preferences
- Notification settings
- API keys (next week)

#### Deliverables
- ✅ Organization settings
- ✅ Team member management
- ✅ Invite system
- ✅ User profile settings

---

### **Week 10: API Keys & Public API**

#### Day 1-2: API Key Management
**File**: `src/app/(dashboard)/settings/api-keys/page.tsx`

Features:
- Generate API keys
- List keys with last used date
- Revoke keys
- Set expiration
- Copy to clipboard

**API**: `src/app/api/api-keys/route.ts`

#### Day 3: API Authentication Middleware
**Create**: `src/lib/api-auth.ts`

Features:
- JWT validation (Clerk)
- API key validation
- Rate limiting per key
- Usage tracking

#### Day 4-5: Public API Endpoints
Create public API versions:
```
/api/v1/prompts
/api/v1/prompts/:id
/api/v1/categories
/api/v1/tags
```

Features:
- RESTful design
- API key authentication
- Rate limiting
- Proper error responses
- OpenAPI documentation (Swagger)

#### Deliverables
- ✅ API key generation
- ✅ API authentication
- ✅ Public API endpoints
- ✅ Rate limiting

---

### **Week 11: Collaboration Features**

#### Day 1-2: Favorites
**API**: `src/app/api/prompts/[id]/favorite/route.ts`

Features:
- Toggle favorite
- List favorited prompts
- Favorite count

**UI**: Add to prompt card and detail page

#### Day 3-4: Comments
**API**: `src/app/api/prompts/[id]/comments/route.ts`

Features:
- Add comment
- Reply to comment (threaded)
- Edit/delete own comments
- @mentions

**Create**: `src/components/prompts/comments-section.tsx`

#### Day 5: Activity Feed
**Create**: `src/components/dashboard/activity-feed.tsx`

Features:
- Recent activities (created, edited, commented)
- Filter by user, action type
- Pagination
- Real-time updates (optional)

#### Deliverables
- ✅ Favorite prompts
- ✅ Comments system
- ✅ Activity feed
- ✅ Collaboration features

---

### **Week 12: Polish & Testing**

#### Day 1: Error Handling
- Error boundaries for all routes
- Toast notifications for actions
- Proper error messages
- Retry mechanisms

#### Day 2: Performance Optimization
- Image optimization
- Code splitting
- Lazy loading
- Database query optimization
- Add indexes

#### Day 3: Testing
```bash
# Write tests for:
- API routes (integration tests)
- Components (unit tests)
- E2E user flows (Playwright)
- Database queries

pnpm test
pnpm e2e
```

#### Day 4: Security Audit
- Review RBAC implementation
- Test RLS (can users access other org's data?)
- Rate limiting tests
- Input validation review
- XSS/CSRF checks

#### Day 5: Documentation
- Update README
- API documentation (Swagger/OpenAPI)
- User guide
- Video walkthrough
- Deploy to production

#### Deliverables
- ✅ Error handling complete
- ✅ Performance optimized
- ✅ Tests written (80%+ coverage)
- ✅ Security audited
- ✅ Production deployment

---

## 🎯 Post-MVP: Phase 2 Features

### Week 13-16: Enhanced Collaboration
- [ ] Email notifications
- [ ] Webhooks for integrations
- [ ] Export/import (CSV, JSON)
- [ ] Prompt templates
- [ ] Duplicate/fork prompts
- [ ] Share prompt links

### Week 17-20: Analytics
- [ ] Usage dashboard
- [ ] Prompt performance metrics
- [ ] User activity analytics
- [ ] Search analytics
- [ ] Export reports

### Week 21-24: Advanced Features
- [ ] AI-powered prompt suggestions
- [ ] Semantic search (pgvector)
- [ ] Prompt testing framework
- [ ] A/B testing
- [ ] Chrome extension
- [ ] Slack/Discord bot

---

## 📊 Component Hierarchy

### Core Layout
```
MainLayout
├── Navbar
│   ├── Search (Cmd+K)
│   ├── OrganizationSwitcher
│   └── UserMenu
└── Sidebar
    ├── Navigation Links
    └── QuickActions
```

### Prompts
```
PromptListPage
├── FiltersSidebar
│   ├── CategoryFilter
│   ├── TagFilter
│   ├── AuthorFilter
│   └── DateFilter
├── PromptGrid/List
│   └── PromptCard[]
└── Pagination

PromptDetailPage
├── PromptHeader (title, actions)
├── PromptContent
├── PromptMetadata
├── Tabs
│   ├── VersionHistory
│   ├── Comments
│   └── Analytics (future)
└── RelatedPrompts (future)
```

### Forms
```
PromptForm
├── BasicInfo (title, description)
├── ContentEditor
├── VariablesList (auto-extracted)
├── Organization
│   ├── CategorySelect
│   ├── TagInput
│   └── CollectionSelect
├── Settings
│   ├── Status (draft/published)
│   ├── Visibility
│   └── Metadata (model settings)
└── Actions (save, publish, cancel)
```

---

## 🗂️ File Structure (Expanded)

```
src/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   └── sign-up/[[...sign-up]]/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── prompts/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       └── edit/page.tsx
│   │   ├── categories/page.tsx
│   │   ├── tags/page.tsx
│   │   ├── collections/page.tsx
│   │   └── settings/
│   │       ├── page.tsx
│   │       ├── profile/page.tsx
│   │       ├── organization/page.tsx
│   │       ├── team/page.tsx
│   │       └── api-keys/page.tsx
│   ├── api/
│   │   ├── prompts/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       ├── route.ts
│   │   │       ├── favorite/route.ts
│   │   │       ├── comments/route.ts
│   │   │       └── versions/route.ts
│   │   ├── categories/
│   │   ├── tags/
│   │   ├── collections/
│   │   ├── search/
│   │   ├── api-keys/
│   │   └── organizations/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── layout/
│   │   ├── main-layout.tsx
│   │   ├── navbar.tsx
│   │   ├── sidebar.tsx
│   │   ├── user-menu.tsx
│   │   └── org-switcher.tsx
│   ├── prompts/
│   │   ├── prompt-card.tsx
│   │   ├── prompt-form.tsx
│   │   ├── prompt-list.tsx
│   │   ├── prompt-filters.tsx
│   │   ├── version-history.tsx
│   │   ├── diff-viewer.tsx
│   │   └── comments-section.tsx
│   ├── categories/
│   │   ├── category-badge.tsx
│   │   ├── category-selector.tsx
│   │   └── category-dialog.tsx
│   ├── tags/
│   │   ├── tag-badge.tsx
│   │   ├── tag-input.tsx
│   │   └── tag-selector.tsx
│   ├── collections/
│   │   ├── collection-tree.tsx
│   │   └── collection-dialog.tsx
│   ├── search/
│   │   ├── search-bar.tsx
│   │   └── command-palette.tsx
│   ├── dashboard/
│   │   ├── stats-card.tsx
│   │   └── activity-feed.tsx
│   ├── ui/ (shadcn components)
│   └── theme-provider.tsx
├── lib/
│   ├── prisma.ts
│   ├── utils.ts
│   ├── api-auth.ts
│   ├── meilisearch.ts
│   ├── validations/
│   │   ├── prompt.ts
│   │   ├── category.ts
│   │   └── tag.ts
│   └── services/
│       ├── prompt-service.ts
│       ├── search-service.ts
│       └── activity-service.ts
├── hooks/
│   ├── use-prompts.ts
│   ├── use-categories.ts
│   ├── use-tags.ts
│   └── use-search.ts
├── types/
│   └── index.ts
└── middleware.ts
```

---

## 🧪 Testing Strategy

### Unit Tests (Vitest)
```typescript
// Example: src/lib/__tests__/utils.test.ts
describe('extractVariables', () => {
  it('should extract variables from prompt content', () => {
    const content = 'Hello {{name}}, your {{item}} is ready'
    const vars = extractVariables(content)
    expect(vars).toEqual(['name', 'item'])
  })
})
```

### Integration Tests
```typescript
// Example: src/app/api/prompts/__tests__/route.test.ts
describe('POST /api/prompts', () => {
  it('should create a prompt with valid data', async () => {
    const res = await POST(mockRequest)
    expect(res.status).toBe(201)
  })

  it('should enforce organization isolation', async () => {
    // Test RLS
  })
})
```

### E2E Tests (Playwright)
```typescript
// Example: e2e/prompts.spec.ts
test('create and edit prompt flow', async ({ page }) => {
  await page.goto('/prompts/new')
  await page.fill('[name="title"]', 'Test Prompt')
  await page.fill('[name="content"]', 'Hello {{name}}')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL(/\/prompts\/[\w-]+/)
})
```

---

## 🔍 Code Quality Checklist

### Before Each Commit
- [ ] Run `pnpm lint` (no errors)
- [ ] Run `pnpm format` (code formatted)
- [ ] Run `pnpm type-check` (TypeScript passes)
- [ ] Write/update tests for new features
- [ ] Update documentation if needed

### Before Each PR
- [ ] All tests pass (`pnpm test`)
- [ ] E2E tests pass (`pnpm e2e`)
- [ ] No console.logs in production code
- [ ] Error handling implemented
- [ ] Loading states implemented
- [ ] RBAC checks in place
- [ ] RLS verified (can't access other org data)

### Before Production Deploy
- [ ] Security audit complete
- [ ] Performance tested (Lighthouse > 90)
- [ ] Database migrations tested
- [ ] Backup strategy in place
- [ ] Monitoring/logging configured (Sentry)
- [ ] Rate limiting tested
- [ ] Error tracking working

---

## 📈 Success Metrics

### Week 4 Checkpoint
- [ ] Basic CRUD working
- [ ] 5 test users can create prompts
- [ ] 50 prompts created

### Week 8 Checkpoint
- [ ] Search working
- [ ] 20 test users
- [ ] 200 prompts created
- [ ] All core features functional

### Week 12 Checkpoint (MVP Launch)
- [ ] 100 beta users
- [ ] 1,000 prompts created
- [ ] < 200ms API response time
- [ ] 99%+ uptime
- [ ] Positive user feedback

---

## 🚀 Deployment Strategy

### Development
- Branch: `develop`
- Deploy: Vercel Preview
- Database: Neon dev branch
- Updates: On every push

### Staging
- Branch: `staging`
- Deploy: Vercel Preview (custom domain)
- Database: Neon staging branch
- Updates: Manual promotion from develop

### Production
- Branch: `main`
- Deploy: Vercel Production
- Database: Neon production branch
- Updates: Manual promotion from staging
- Requires: Code review + QA approval

---

## 💡 Pro Tips

### Development
1. **Use Prisma Studio**: `pnpm db:studio` - visualize data
2. **Hot Reload**: Next.js dev server supports fast refresh
3. **TypeScript**: Let types guide you - if it compiles, it usually works
4. **Console**: Use `console.log` liberally, remove before commit

### Performance
1. **React Server Components**: Use by default, client components only when needed
2. **Lazy Loading**: Use `next/dynamic` for heavy components
3. **Images**: Use `next/image` for optimization
4. **Database**: Add indexes on foreign keys and query columns

### Security
1. **Never trust user input**: Validate everything with Zod
2. **Check organizationId**: On EVERY database query
3. **Test RLS**: Try to access other org's data (should fail)
4. **API keys**: Hash before storing, never log

### Debugging
1. **Network Tab**: Check API requests/responses
2. **React DevTools**: Inspect component state
3. **Prisma Logs**: Enable query logging in dev
4. **Vercel Logs**: Check serverless function logs

---

## 🎉 You're Ready to Build!

Start with Week 1, Day 1 and work through systematically.

**First command to run:**
```bash
cd /mnt/f/promptvault
pnpm install
```

**Questions?** Refer to:
- `QUICK_START.md` - Setup help
- `PROJECT_SUMMARY.md` - Architecture overview
- `docs/prd/PRODUCT_REQUIREMENTS_DOCUMENT.md` - Feature specs

**Good luck! 🚀**
