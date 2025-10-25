# Skills Implementation Plan for PromptVault

**Date**: 2025-10-24
**Status**: Planning Phase
**Priority**: High

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [What are Claude Skills?](#what-are-claude-skills)
3. [Skills vs Prompts Comparison](#skills-vs-prompts-comparison)
4. [Feature Requirements](#feature-requirements)
5. [Database Schema Changes](#database-schema-changes)
6. [API Design](#api-design)
7. [UI/UX Design](#uiux-design)
8. [Sharing to Claude Desktop](#sharing-to-claude-desktop)
9. [Implementation Phases](#implementation-phases)
10. [Technical Considerations](#technical-considerations)
11. [Future Enhancements](#future-enhancements)

---

## Executive Summary

This plan outlines the implementation of **Skills** support in PromptVault, extending the platform beyond simple prompt management to include Claude's new Skills feature. Skills are folders containing instructions, scripts, and resources that Claude loads dynamically when needed.

### Key Goals:
1. ✅ Allow users to create, store, and manage Claude Skills
2. ✅ Enable Skills sharing within organizations
3. ✅ Provide one-click export to Claude Desktop/Code formats
4. ✅ Support both Prompts and Skills in a unified interface
5. ✅ Enable easy copy-to-clipboard for quick Claude Desktop use

---

## What are Claude Skills?

### Definition
Skills are **procedural knowledge packages** that teach Claude how to complete specific tasks in a repeatable way. They consist of:
- **SKILL.md** file with YAML frontmatter and instructions
- Optional supporting files (scripts, templates, examples)
- Automatic activation based on task relevance

### Key Characteristics

| Feature | Description |
|---------|-------------|
| **Progressive Disclosure** | Only loaded when relevant to the task |
| **Automatic Activation** | Claude determines when to invoke them |
| **Composability** | Multiple skills can work together |
| **Persistence** | Work across all chats, not just one project |

### File Structure

```
skill-name/
├── SKILL.md          (required - YAML frontmatter + instructions)
├── reference.md      (optional - additional context)
├── examples.md       (optional - usage examples)
├── scripts/          (optional - executable code)
└── templates/        (optional - file templates)
```

### SKILL.md Format

```yaml
---
name: your-skill-name
description: Brief description of what this Skill does and when to use it
---

# Your Skill Name

## Instructions
Provide clear, step-by-step guidance for Claude.

## Examples
Show concrete examples of using this Skill.
```

**Constraints**:
- `name`: lowercase letters, numbers, hyphens only (max 64 chars)
- `description`: max 1024 characters
- Must specify both functionality AND activation triggers

---

## Skills vs Prompts Comparison

| Aspect | Prompts | Skills |
|--------|---------|--------|
| **Purpose** | Single-use text templates | Reusable procedural workflows |
| **Structure** | Plain text with variables | YAML + Markdown + optional files |
| **Activation** | Manual copy/paste | Automatic (progressive disclosure) |
| **Scope** | One conversation | All conversations |
| **Complexity** | Simple (text only) | Complex (multi-file, scripts) |
| **Composability** | No | Yes (multiple skills work together) |
| **Context** | Static | Dynamic (loaded when needed) |

### When to Use Each

**Use Prompts for**:
- Quick one-off instructions
- Text templates with variables
- Simple AI interactions
- Copy-paste into any AI tool

**Use Skills for**:
- Complex, repeatable workflows
- Brand guidelines and style guides
- Data analysis procedures
- Multi-step automation
- Organization-wide standards

---

## Feature Requirements

### Phase 1: Core Skill Management (MVP)

#### FR-1.1: Skill Creation
- ✅ Create new Skills with YAML frontmatter
- ✅ Auto-validate skill name format (lowercase, numbers, hyphens)
- ✅ Rich markdown editor for skill content
- ✅ Syntax highlighting for YAML and code blocks
- ✅ Real-time preview of SKILL.md output

#### FR-1.2: Skill Storage
- ✅ Store skills in database with version control
- ✅ Support multi-file skills (additional resources)
- ✅ File upload for supporting materials
- ✅ Maximum file size limits (e.g., 10MB per skill)

#### FR-1.3: Skill Organization
- ✅ Categories for skills (same as prompts)
- ✅ Tags for skills
- ✅ Search by name, description, content
- ✅ Favorites/starring for skills

#### FR-1.4: Skill Viewing
- ✅ Detail view with preview
- ✅ Download as .zip file (skill-name.zip)
- ✅ Copy SKILL.md to clipboard
- ✅ View supporting files

### Phase 2: Sharing & Export

#### FR-2.1: Export Formats
- ✅ Export as .zip file (Claude Desktop format)
- ✅ Export as folder structure (Claude Code format)
- ✅ Copy SKILL.md markdown to clipboard
- ✅ Export multiple skills at once

#### FR-2.2: One-Click Share to Claude
- ✅ "Copy for Claude Desktop" button
- ✅ "Download for Claude Code" button
- ✅ Installation instructions overlay
- ✅ Auto-format for appropriate Claude variant

#### FR-2.3: Sharing Within Organization
- ✅ Share skills with organization members
- ✅ Public skill gallery (within org)
- ✅ Skill usage analytics

### Phase 3: Advanced Features

#### FR-3.1: Skill Builder
- ✅ Guided wizard for creating skills
- ✅ Templates for common skill types
- ✅ AI-assisted skill generation (using Claude!)
- ✅ Validation and linting

#### FR-3.2: Version Control
- ✅ Track skill changes over time
- ✅ Rollback to previous versions
- ✅ Compare versions
- ✅ Change descriptions

#### FR-3.3: Collaboration
- ✅ Comments on skills
- ✅ Suggest edits
- ✅ Approval workflows
- ✅ Usage examples from team

---

## Database Schema Changes

### New Models

#### Skill Model

```prisma
model Skill {
  id              String         @id @default(cuid())
  organizationId  String
  authorId        String

  // Skill Metadata (from YAML frontmatter)
  name            String         // skill-name format
  description     String         @db.Text
  allowedTools    String[]       // Optional: restrict tools

  // Content
  content         String         @db.Text  // Main SKILL.md content

  // Organization
  categoryId      String?
  collectionId    String?

  // Status & Visibility
  status          PromptStatus   @default(DRAFT)
  visibility      Visibility     @default(ORGANIZATION)

  // Metadata
  metadata        Json?          // Additional settings
  viewCount       Int            @default(0)
  useCount        Int            @default(0)
  downloadCount   Int            @default(0)
  favoriteCount   Int            @default(0)

  // Timestamps
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  // Relations
  organization    Organization   @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  author          User           @relation("SkillAuthor", fields: [authorId], references: [id])
  category        Category?      @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  collection      Collection?    @relation(fields: [collectionId], references: [id], onDelete: SetNull)
  tags            SkillTag[]
  files           SkillFile[]
  versions        SkillVersion[]
  favorites       SkillFavorite[]
  comments        SkillComment[]
  activities      Activity[]

  // Indexes
  @@index([organizationId])
  @@index([authorId])
  @@index([categoryId])
  @@index([status])
  @@index([createdAt])
  @@unique([organizationId, name]) // Unique skill name per org
}
```

#### SkillFile Model (Supporting Files)

```prisma
model SkillFile {
  id          String   @id @default(cuid())
  skillId     String

  // File Info
  filename    String   // e.g., "reference.md", "script.py"
  filepath    String   // Relative path in skill folder
  content     String   @db.Text
  mimeType    String   // e.g., "text/markdown", "text/python"
  size        Int      // File size in bytes

  // Metadata
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  skill       Skill    @relation(fields: [skillId], references: [id], onDelete: Cascade)

  @@index([skillId])
}
```

#### SkillVersion Model

```prisma
model SkillVersion {
  id                String   @id @default(cuid())
  skillId           String
  version           Int

  // Snapshot of skill at this version
  name              String
  description       String   @db.Text
  content           String   @db.Text
  allowedTools      String[]
  files             Json?    // Snapshot of associated files

  // Change tracking
  changeDescription String?  @db.Text
  createdById       String
  createdAt         DateTime @default(now())

  // Relations
  skill             Skill    @relation(fields: [skillId], references: [id], onDelete: Cascade)
  createdBy         User     @relation(fields: [createdById], references: [id])

  @@unique([skillId, version])
  @@index([skillId])
}
```

#### SkillTag, SkillFavorite, SkillComment

Similar structure to Prompt models:

```prisma
model SkillTag {
  id      String @id @default(cuid())
  skillId String
  tagId   String
  skill   Skill  @relation(fields: [skillId], references: [id], onDelete: Cascade)
  tag     Tag    @relation(fields: [tagId], references: [id], onDelete: Cascade)
  @@unique([skillId, tagId])
}

model SkillFavorite {
  id        String   @id @default(cuid())
  userId    String
  skillId   String
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  skill     Skill    @relation(fields: [skillId], references: [id], onDelete: Cascade)
  @@unique([userId, skillId])
}

model SkillComment {
  id        String   @id @default(cuid())
  skillId   String
  userId    String
  content   String   @db.Text
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  skill     Skill    @relation(fields: [skillId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### Updated Models

#### Category & Tag
Add relations for skills:

```prisma
model Category {
  // ... existing fields
  skills  Skill[]  // Add this
}

model Tag {
  // ... existing fields
  skills  SkillTag[]  // Add this
}

model Collection {
  // ... existing fields
  skills  Skill[]  // Add this
}
```

---

## API Design

### REST Endpoints

#### Skills CRUD

```typescript
// GET /api/skills - List all skills
// Query params: search, category, status, tags
export async function GET(request: NextRequest) {
  // Return skills with author, category, tags
}

// POST /api/skills - Create new skill
export async function POST(request: NextRequest) {
  // Validate name format (lowercase, hyphens, numbers only)
  // Validate description length (max 1024)
  // Create skill + initial version
}

// GET /api/skills/[id] - Get single skill
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Return skill with files, versions, etc.
}

// PUT /api/skills/[id] - Update skill
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Update skill
  // Create new version if content changed
}

// DELETE /api/skills/[id] - Delete skill
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Cascade delete files, versions, etc.
}
```

#### Skill Files

```typescript
// POST /api/skills/[id]/files - Upload supporting file
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Upload file (reference.md, script.py, etc.)
  // Validate file size and type
}

// GET /api/skills/[id]/files/[fileId] - Get file content
// DELETE /api/skills/[id]/files/[fileId] - Delete file
```

#### Export & Download

```typescript
// GET /api/skills/[id]/export - Export skill as .zip
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Generate zip file with SKILL.md + supporting files
  // Return as downloadable blob
}

// GET /api/skills/[id]/export/markdown - Get SKILL.md only
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Return formatted SKILL.md with YAML frontmatter
  // For clipboard copy
}

// POST /api/skills/[id]/favorite - Toggle favorite
// GET /api/skills/[id]/versions - List versions
// GET /api/skills/[id]/versions/[versionId] - Get specific version
```

---

## UI/UX Design

### Navigation Updates

Add "Skills" to sidebar navigation:

```
Dashboard
├── Dashboard
├── Prompts
├── Skills ⭐ NEW
├── Categories
├── Tags
├── Collections
├── Favorites
└── Settings
```

### Skills List Page (`/skills`)

Similar to prompts page:

```typescript
// Layout
[Header: "Skills" + "New Skill" button]

[Search Bar + Filters]
- Search by name/description
- Filter by category
- Filter by tags
- Filter by status

[Skills Grid/List]
Each card shows:
- Skill name (skill-name format)
- Description (truncated)
- Category badge
- Tags
- Author
- Stats (views, downloads, favorites)
- Actions: View, Edit, Download, Favorite
```

### New Skill Page (`/skills/new`)

```typescript
// Form Structure
[Skill Name]
- Input with validation (lowercase, hyphens, numbers)
- Real-time format validation
- Suggestion helper (e.g., "my-skill-name")

[Description]
- Textarea (max 1024 chars)
- Character counter
- Guidance: "Describe what the skill does AND when to use it"

[Content Editor]
- YAML frontmatter (auto-generated from name/description)
- Markdown editor with syntax highlighting
- Preview pane (split view)
- Insert code block buttons
- Insert example buttons

[Supporting Files] (Optional)
- File upload area
- Drag & drop
- List of uploaded files
- File size limits

[Category & Tags]
- Category dropdown
- Tag input (comma-separated)

[Advanced Settings]
- Allowed tools (multi-select)
- Status (Draft/Published)
- Visibility (Private/Organization)

[Preview Button]
- Shows full SKILL.md output
- Shows file structure

[Actions]
- Save Draft
- Publish
- Cancel
```

### Skill Detail Page (`/skills/[id]`)

```typescript
// Layout
[Header]
- Skill name (H1)
- Description
- Metadata (author, date, stats)
- Action buttons:
  • Edit
  • Delete
  • Favorite
  • Share

[Tabs]
1. Preview
   - Rendered markdown
   - Syntax-highlighted code blocks

2. SKILL.md
   - Raw markdown with YAML frontmatter
   - Copy button

3. Files (if any)
   - List of supporting files
   - Download individual files

4. Versions
   - Version history
   - Compare versions
   - Rollback option

5. Activity
   - Comments
   - Usage stats
   - Download history

[Export Section]
- "Download as ZIP" button
- "Copy SKILL.md" button
- "Share to Claude Desktop" button
- "Share to Claude Code" button
```

### Share to Claude Modal

When user clicks "Share to Claude Desktop/Code":

```typescript
// Modal Content
[Title: "Share to Claude Desktop"]

[Instructions]
Step 1: Copy Skill
[Copy SKILL.md] button
[Download ZIP] button

Step 2: Install in Claude
• Claude Desktop:
  1. Open Settings → Capabilities → Skills
  2. Click "Upload Skill"
  3. Select the downloaded ZIP file

• Claude Code:
  1. Navigate to project directory
  2. Create .claude/skills/skill-name/
  3. Place SKILL.md and files inside
  4. Skill will auto-activate when relevant

[Video Tutorial Link]
[Documentation Link]

[Close]
```

---

## Sharing to Claude Desktop

### Copy-to-Clipboard Functionality

#### Feature: One-Click Copy for Prompts

Add to existing prompt detail page:

```typescript
// New "Share" button on prompt page
<Button onClick={handleCopyForClaude}>
  📋 Copy for Claude
</Button>

const handleCopyForClaude = async () => {
  // Format prompt for easy pasting
  const formattedPrompt = `
# ${prompt.title}

${prompt.description}

---

${prompt.content}

${prompt.variables?.length > 0 ? `
## Variables
${prompt.variables.map(v => `- {{${v.name}}}: ${v.description}`).join('\n')}
` : ''}
  `.trim()

  await navigator.clipboard.writeText(formattedPrompt)
  toast.success('Prompt copied! Paste into Claude Desktop.')
}
```

#### Feature: Quick Share Button

Add floating share menu:

```typescript
// Prompt & Skill cards get share icon
<DropdownMenu>
  <DropdownMenuTrigger>
    <Share2 className="h-4 w-4" />
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onClick={copyToClipboard}>
      Copy to Clipboard
    </DropdownMenuItem>
    <DropdownMenuItem onClick={downloadForClaudeCode}>
      Download for Claude Code
    </DropdownMenuItem>
    <DropdownMenuItem onClick={shareViaEmail}>
      Share via Email
    </DropdownMenuItem>
    <DropdownMenuItem onClick={copyShareLink}>
      Copy Share Link
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Export Formats

#### 1. Claude Desktop Format (.zip)

```
skill-name.zip
└── skill-name/
    ├── SKILL.md
    ├── reference.md (if exists)
    ├── examples.md (if exists)
    └── scripts/
        └── ... (if any)
```

**Implementation**:

```typescript
// /api/skills/[id]/export/desktop
import JSZip from 'jszip'

export async function GET(request, { params }) {
  const skill = await prisma.skill.findUnique({
    where: { id: params.id },
    include: { files: true }
  })

  const zip = new JSZip()
  const folder = zip.folder(skill.name)

  // Add SKILL.md
  const skillMd = generateSkillMarkdown(skill)
  folder.file('SKILL.md', skillMd)

  // Add supporting files
  for (const file of skill.files) {
    folder.file(file.filepath, file.content)
  }

  const blob = await zip.generateAsync({ type: 'blob' })

  return new Response(blob, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${skill.name}.zip"`
    }
  })
}
```

#### 2. Claude Code Format (Folder)

```typescript
// /api/skills/[id]/export/code
// Returns a tar.gz or instructions for manual setup

export async function GET(request, { params }) {
  // Return JSON with folder structure and file contents
  // Frontend can display instructions or download as archive

  return NextResponse.json({
    skillName: skill.name,
    instructions: `
1. Create directory: .claude/skills/${skill.name}/
2. Create SKILL.md with the content below
3. Add any supporting files
    `,
    files: [
      {
        path: 'SKILL.md',
        content: skillMd
      },
      ...skill.files.map(f => ({
        path: f.filepath,
        content: f.content
      }))
    ]
  })
}
```

#### 3. Copy to Clipboard (Markdown)

```typescript
// Client-side function
const copySkillToClipboard = async (skillId: string) => {
  const response = await fetch(`/api/skills/${skillId}/export/markdown`)
  const data = await response.text()

  await navigator.clipboard.writeText(data)
  toast.success('SKILL.md copied to clipboard!')
}
```

### Prompts Copy Enhancement

For existing prompts, add similar functionality:

```typescript
// Enhanced prompt copy with formatting
const copyPromptForClaude = async (prompt: Prompt) => {
  const formatted = `
# ${prompt.title}

${prompt.description || ''}

${prompt.content}

---
Generated from PromptVault
  `.trim()

  await navigator.clipboard.writeText(formatted)
  toast.success('Prompt copied! Ready to paste in Claude.')
}

// Alternative: Convert prompt to skill format
const convertToSkill = async (prompt: Prompt) => {
  const skillMd = `---
name: ${slugify(prompt.title)}
description: ${prompt.description?.substring(0, 1024) || prompt.title}
---

# ${prompt.title}

${prompt.content}
  `

  await navigator.clipboard.writeText(skillMd)
  toast.success('Converted to skill format! Paste into SKILL.md')
}
```

---

## Implementation Phases

### Phase 1: MVP (Weeks 1-3)

**Goal**: Basic skill creation and viewing

**Tasks**:
- [ ] Database schema migration (Skill, SkillFile, SkillVersion models)
- [ ] API routes for CRUD operations
- [ ] Skills list page (`/skills`)
- [ ] New skill page (`/skills/new`)
- [ ] Skill detail page (`/skills/[id]`)
- [ ] Basic markdown editor with preview
- [ ] YAML frontmatter validation
- [ ] Copy to clipboard functionality

**Deliverables**:
- Users can create, view, edit, delete skills
- Skills display in a list with search/filter
- Basic export as markdown

### Phase 2: Export & Sharing (Weeks 4-5)

**Goal**: Enable sharing to Claude Desktop/Code

**Tasks**:
- [ ] ZIP export functionality
- [ ] Claude Desktop format export
- [ ] Claude Code format export
- [ ] Share modal with instructions
- [ ] Enhanced copy-to-clipboard for prompts
- [ ] "Convert Prompt to Skill" feature

**Deliverables**:
- Download skills as .zip for Claude Desktop
- Export folder structure for Claude Code
- One-click copy for quick use

### Phase 3: Advanced Features (Weeks 6-8)

**Goal**: Version control, collaboration, analytics

**Tasks**:
- [ ] Version history and comparison
- [ ] Comments on skills
- [ ] Skill templates library
- [ ] AI-assisted skill creation
- [ ] Usage analytics
- [ ] Bulk export (multiple skills)
- [ ] Import skills from ZIP

**Deliverables**:
- Full version control system
- Team collaboration features
- Skill analytics dashboard

### Phase 4: Polish & Optimization (Week 9)

**Goal**: UX improvements and performance

**Tasks**:
- [ ] Guided skill creation wizard
- [ ] Keyboard shortcuts
- [ ] Advanced search (filter by allowed-tools, etc.)
- [ ] Skill linting and validation
- [ ] Performance optimization
- [ ] Mobile responsiveness
- [ ] Accessibility audit

**Deliverables**:
- Production-ready Skills feature
- Documentation and tutorials

---

## Technical Considerations

### 1. Name Validation

Skills have strict naming requirements:

```typescript
const validateSkillName = (name: string): { valid: boolean; error?: string } => {
  // Must be lowercase, numbers, hyphens only
  const pattern = /^[a-z0-9-]+$/

  if (!pattern.test(name)) {
    return {
      valid: false,
      error: 'Name must contain only lowercase letters, numbers, and hyphens'
    }
  }

  if (name.length > 64) {
    return {
      valid: false,
      error: 'Name must be 64 characters or less'
    }
  }

  if (name.startsWith('-') || name.endsWith('-')) {
    return {
      valid: false,
      error: 'Name cannot start or end with a hyphen'
    }
  }

  return { valid: true }
}
```

### 2. YAML Frontmatter Generation

Auto-generate from form inputs:

```typescript
const generateSkillMarkdown = (skill: Skill): string => {
  const frontmatter = `---
name: ${skill.name}
description: ${skill.description}${skill.allowedTools?.length > 0 ? `
allowed-tools:
${skill.allowedTools.map(tool => `  - ${tool}`).join('\n')}` : ''}
---

${skill.content}
  `

  return frontmatter.trim()
}
```

### 3. File Size Limits

```typescript
const MAX_SKILL_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_TOTAL_SKILL_SIZE = 50 * 1024 * 1024 // 50MB per skill

const validateFileSize = (file: File): boolean => {
  return file.size <= MAX_SKILL_FILE_SIZE
}
```

### 4. Markdown Editor Options

Consider using:
- **react-markdown-editor-lite** - Rich editor with preview
- **@uiw/react-md-editor** - Lightweight, supports code highlighting
- **tiptap** - Headless editor, very customizable
- **monaco-editor** - VS Code editor (powerful but heavy)

**Recommendation**: `@uiw/react-md-editor` for balance of features and weight

### 5. ZIP Generation

Use **JSZip** library:

```bash
pnpm add jszip
pnpm add -D @types/jszip
```

### 6. Syntax Highlighting

Use **react-syntax-highlighter**:

```bash
pnpm add react-syntax-highlighter
pnpm add -D @types/react-syntax-highlighter
```

### 7. Multi-tenancy

Same pattern as prompts:
- All skills tied to `organizationId`
- Data isolation enforced in API routes
- Users can only access skills from their organization

### 8. Version Control

- Create new SkillVersion on every content change
- Store complete snapshot (not diffs)
- Auto-increment version number
- Optional change description

---

## Future Enhancements

### 1. Public Skill Marketplace

Allow users to:
- Share skills publicly (outside org)
- Browse community skills
- Fork/clone popular skills
- Rate and review skills

### 2. AI-Powered Skill Generation

Use Claude API to:
- Generate skills from natural language descriptions
- Suggest improvements to existing skills
- Auto-generate examples
- Validate skill quality

### 3. Skill Analytics

Track:
- Usage frequency
- Download count
- Success metrics
- User feedback
- Performance data

### 4. Integration with GitHub

- Sync skills to GitHub repo
- Auto-update from repo
- PR-based skill updates
- Team review workflows

### 5. Skill Testing

- Sandbox environment to test skills
- Sample inputs/outputs
- Validation suite
- Performance benchmarks

### 6. Skill Dependencies

- Skills that reference other skills
- Skill bundles/packages
- Dependency resolution

### 7. Prompt → Skill Conversion Tool

One-click button to convert any prompt into a skill:
- Auto-generate skill name from title
- Format content as instructions
- Add examples section
- Suggest when to activate

---

## Success Metrics

### Adoption Metrics
- Number of skills created per user
- Skills vs Prompts ratio
- Active skill users (weekly/monthly)

### Engagement Metrics
- Skills downloaded per week
- Skills favorited
- Skills shared within organization
- Comments and feedback on skills

### Quality Metrics
- Average skill file size
- Number of supporting files per skill
- Version updates per skill
- User ratings (future)

### Business Metrics
- Feature usage (Pro/Team plans)
- Upgrade conversions
- User retention impact
- Support ticket reduction

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| **User confusion** (Skills vs Prompts) | Medium | Clear documentation, onboarding tutorials, in-app guidance |
| **Complex UI** (multi-file management) | Medium | Progressive disclosure, simple defaults, advanced options hidden |
| **Storage costs** (files, versions) | Medium | File size limits, version retention policies, compression |
| **Performance** (large files, many versions) | Low | Lazy loading, pagination, CDN for downloads |
| **Claude format changes** | High | Monitor Anthropic docs, version export formats, backward compatibility |

---

## Questions for Product Review

1. **Should we support Prompt→Skill conversion**?
   - Auto-convert existing prompts to skills?
   - Manual "Convert to Skill" button?

2. **Public skills or org-only**?
   - Keep skills private to organizations?
   - Or allow public sharing (marketplace)?

3. **Skill approval workflow**?
   - Should skills require approval before publishing?
   - Role-based permissions (who can create/publish)?

4. **Skill templates**?
   - Pre-built templates for common skill types?
   - Starter skills for new users?

5. **Import from external sources**?
   - Import skills from GitHub?
   - Import from Claude Desktop (reverse)?

---

## Next Steps

1. **Review this plan** with product/engineering teams
2. **User research** - Interview 5-10 users about Skills use cases
3. **Design mockups** - Create high-fidelity UI designs
4. **Prototype** - Build a quick prototype of skill editor
5. **Estimate effort** - Detailed story pointing
6. **Prioritize** - Decide on MVP scope
7. **Kickoff** - Start Phase 1 development

---

## Appendix: Example Skills

### Example 1: Brand Guidelines Skill

```yaml
---
name: acme-brand-guidelines
description: Apply ACME Corp brand guidelines to all content including tone, style, colors, and formatting standards
---

# ACME Corp Brand Guidelines

## When to Use
Activate this skill when creating any content for ACME Corp including:
- Marketing materials
- Social media posts
- Email templates
- Presentations
- Documentation

## Brand Voice
- **Tone**: Professional yet approachable
- **Style**: Clear, concise, action-oriented
- **Voice**: We speak directly to users (use "you" and "we")

## Visual Guidelines
- **Primary Color**: #0066CC (ACME Blue)
- **Secondary Color**: #FF6600 (ACME Orange)
- **Font**: Inter for headings, Open Sans for body

## Writing Standards
1. Use active voice
2. Keep sentences under 20 words
3. Avoid jargon
4. Use Oxford comma
5. Capitalize product names: ACME Platform, ACME Cloud

## Examples
[Include real examples of on-brand content]
```

### Example 2: Data Analysis Skill

```yaml
---
name: financial-reporting
description: Analyze financial data and generate quarterly reports following our standardized format and calculations
allowed-tools:
  - python
  - code_execution
---

# Financial Reporting Skill

## When to Use
Use when analyzing financial data for quarterly reports, investor decks, or board presentations.

## Analysis Steps
1. Load data from provided CSV/Excel
2. Calculate key metrics:
   - Revenue growth (QoQ and YoY)
   - Gross margin
   - Operating margin
   - Cash burn rate
3. Generate visualizations
4. Format report in standard template

## Required Metrics
[List of metrics with formulas]

## Report Template
[Standard report structure]

## Code Template
```python
# Script for automated report generation
# (would be in supporting files)
```
```

---

**End of Implementation Plan**

*This is a living document. Update as requirements evolve.*
