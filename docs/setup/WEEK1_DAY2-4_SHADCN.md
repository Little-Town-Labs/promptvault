# Week 1, Days 2-4 - Install shadcn/ui Components

**Goal**: Set up shadcn/ui and install all necessary components for Prompt Vault.

**Time Required**: 2-3 hours (spread over 3 days)

---

## 📋 Overview

shadcn/ui is a collection of re-usable components built with Radix UI and Tailwind CSS. Instead of installing as a dependency, components are copied directly into your project, giving you full control.

**Why shadcn/ui?**
- ✅ Beautiful, accessible components
- ✅ Full customization (you own the code)
- ✅ Built on Radix UI (accessibility-first)
- ✅ Tailwind CSS styling
- ✅ Dark mode support
- ✅ TypeScript

---

## Day 2: Initialize shadcn/ui

### Step 1: Run shadcn/ui Init (5 minutes)

This command sets up the base configuration for shadcn/ui.

```bash
cd /mnt/f/promptvault
pnpx shadcn@latest init
```

**You'll be asked several questions. Use these answers:**

```
? Which style would you like to use? › New York
? Which color would you like to use as base color? › Zinc
? Would you like to use CSS variables for colors? › yes
```

**What this does:**
- Creates `components.json` config file
- Sets up `src/components/ui/` directory
- Configures imports and paths
- Updates `tailwind.config.ts`
- Updates `globals.css` with CSS variables

**✅ Checkpoint**: You should see a `components.json` file in your project root.

---

### Step 2: Verify Installation (2 minutes)

Check that files were created:

```bash
# Check components.json exists
ls -la components.json

# Check ui directory was created
ls -la src/components/ui/

# Check button component (first component to test)
pnpx shadcn@latest add button
```

**Expected output:**
```
✔ Done. Component button added to src/components/ui/button.tsx
```

**✅ Checkpoint**: Button component exists at `src/components/ui/button.tsx`

---

## Day 2-3: Install Core Components

### Form & Input Components (15 minutes)

These are essential for any forms (create/edit prompts, settings, etc.)

```bash
# Form components
pnpx shadcn@latest add form
pnpx shadcn@latest add input
pnpx shadcn@latest add textarea
pnpx shadcn@latest add label
pnpx shadcn@latest add select
pnpx shadcn@latest add checkbox
pnpx shadcn@latest add radio-group
pnpx shadcn@latest add switch
```

**Used for:**
- Prompt creation/edit forms
- Settings forms
- Category/tag creation
- User preferences

---

### Layout Components (10 minutes)

```bash
pnpx shadcn@latest add card
pnpx shadcn@latest add separator
pnpx shadcn@latest add tabs
pnpx shadcn@latest add accordion
pnpx shadcn@latest add aspect-ratio
pnpx shadcn@latest add scroll-area
```

**Used for:**
- Prompt cards
- Dashboard layout
- Section dividers
- Tabbed interfaces
- Settings sections

---

### Navigation Components (10 minutes)

```bash
pnpx shadcn@latest add dropdown-menu
pnpx shadcn@latest add navigation-menu
pnpx shadcn@latest add menubar
pnpx shadcn@latest add breadcrumb
pnpx shadcn@latest add pagination
```

**Used for:**
- User menu
- Navigation header
- Sidebar menu
- Page navigation
- List pagination

---

## Day 3: Install Advanced Components

### Overlay Components (15 minutes)

```bash
pnpx shadcn@latest add dialog
pnpx shadcn@latest add alert-dialog
pnpx shadcn@latest add sheet
pnpx shadcn@latest add popover
pnpx shadcn@latest add tooltip
pnpx shadcn@latest add context-menu
pnpx shadcn@latest add hover-card
```

**Used for:**
- Modals (create/edit/delete confirmations)
- Mobile sidebar (sheet)
- Context menus
- Tooltips
- Popovers

---

### Data Display Components (15 minutes)

```bash
pnpx shadcn@latest add table
pnpx shadcn@latest add badge
pnpx shadcn@latest add avatar
pnpx shadcn@latest add skeleton
pnpx shadcn@latest add progress
pnpx shadcn@latest add alert
```

**Used for:**
- Prompt lists
- Tags and categories
- User avatars
- Loading states
- Alerts and notifications

---

### Feedback Components (10 minutes)

```bash
pnpx shadcn@latest add toast
pnpx shadcn@latest add sonner
pnpx shadcn@latest add alert
```

**Used for:**
- Success/error messages
- Notifications
- User feedback

**Note**: Choose either `toast` or `sonner` (we recommend `sonner` - it's more modern).

---

### Utility Components (10 minutes)

```bash
pnpx shadcn@latest add command
pnpx shadcn@latest add calendar
pnpx shadcn@latest add slider
pnpx shadcn@latest add resizable
```

**Used for:**
- Command palette (Cmd+K search)
- Date pickers
- Settings sliders
- Resizable panels

---

## Day 4: Verification & Testing

### Complete Component List

By the end of Day 4, you should have installed:

**✅ Form Components (8)**
- button
- form
- input
- textarea
- label
- select
- checkbox
- radio-group
- switch

**✅ Layout Components (6)**
- card
- separator
- tabs
- accordion
- aspect-ratio
- scroll-area

**✅ Navigation Components (5)**
- dropdown-menu
- navigation-menu
- menubar
- breadcrumb
- pagination

**✅ Overlay Components (7)**
- dialog
- alert-dialog
- sheet
- popover
- tooltip
- context-menu
- hover-card

**✅ Data Display Components (6)**
- table
- badge
- avatar
- skeleton
- progress
- alert

**✅ Feedback Components (1)**
- sonner (or toast)

**✅ Utility Components (4)**
- command
- calendar
- slider
- resizable

**Total: ~37 components**

---

### Verification Checklist

```bash
# Check all components exist
ls -la src/components/ui/

# Should see files like:
# button.tsx
# form.tsx
# input.tsx
# ... (37+ files)

# Count components
ls src/components/ui/ | wc -l
# Should be 37+
```

---

## Quick Install Script

If you want to install all at once (copy and paste):

```bash
#!/bin/bash
cd /mnt/f/promptvault

# Initialize (if not done yet)
# pnpx shadcn@latest init

# Core form components
pnpx shadcn@latest add button
pnpx shadcn@latest add form
pnpx shadcn@latest add input
pnpx shadcn@latest add textarea
pnpx shadcn@latest add label
pnpx shadcn@latest add select
pnpx shadcn@latest add checkbox
pnpx shadcn@latest add radio-group
pnpx shadcn@latest add switch

# Layout components
pnpx shadcn@latest add card
pnpx shadcn@latest add separator
pnpx shadcn@latest add tabs
pnpx shadcn@latest add accordion
pnpx shadcn@latest add aspect-ratio
pnpx shadcn@latest add scroll-area

# Navigation components
pnpx shadcn@latest add dropdown-menu
pnpx shadcn@latest add navigation-menu
pnpx shadcn@latest add menubar
pnpx shadcn@latest add breadcrumb
pnpx shadcn@latest add pagination

# Overlay components
pnpx shadcn@latest add dialog
pnpx shadcn@latest add alert-dialog
pnpx shadcn@latest add sheet
pnpx shadcn@latest add popover
pnpx shadcn@latest add tooltip
pnpx shadcn@latest add context-menu
pnpx shadcn@latest add hover-card

# Data display components
pnpx shadcn@latest add table
pnpx shadcn@latest add badge
pnpx shadcn@latest add avatar
pnpx shadcn@latest add skeleton
pnpx shadcn@latest add progress
pnpx shadcn@latest add alert

# Feedback components
pnpx shadcn@latest add sonner

# Utility components
pnpx shadcn@latest add command
pnpx shadcn@latest add calendar
pnpx shadcn@latest add slider
pnpx shadcn@latest add resizable

echo "✅ All shadcn/ui components installed!"
```

---

## Testing Components

### Create a Test Page

Create `src/app/components-test/page.tsx`:

```typescript
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function ComponentsTestPage() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-4xl font-bold">shadcn/ui Components Test</h1>

      {/* Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
          <CardDescription>Different button variants</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </CardContent>
      </Card>

      {/* Inputs */}
      <Card>
        <CardHeader>
          <CardTitle>Form Inputs</CardTitle>
          <CardDescription>Input fields and labels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="test-input">Email</Label>
            <Input id="test-input" type="email" placeholder="Enter your email" />
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Badges</CardTitle>
          <CardDescription>Badge variants</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </CardContent>
      </Card>

      {/* Avatars */}
      <Card>
        <CardHeader>
          <CardTitle>Avatars</CardTitle>
          <CardDescription>User avatars</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
        </CardContent>
      </Card>
    </div>
  )
}
```

**Test it:**
```bash
pnpm dev
# Visit: http://localhost:3000/components-test
```

---

## Common Issues & Solutions

### Issue: "Module not found"
**Solution:**
```bash
# Reinstall dependencies
pnpm install
```

### Issue: "Cannot find module @/components/ui/button"
**Solution:**
- Check `tsconfig.json` has path alias `"@/*": ["./src/*"]`
- Restart TypeScript server in your editor

### Issue: "Styles not applying"
**Solution:**
- Check `tailwind.config.ts` includes `./src/components/**/*.{ts,tsx}`
- Restart dev server

### Issue: Command hangs or fails
**Solution:**
```bash
# Use verbose mode
pnpx shadcn@latest add button --verbose

# Or try with npm
npx shadcn@latest add button
```

---

## Tips & Best Practices

### 1. **Install Components As Needed**
Don't install all at once if you prefer incremental approach:
- Day 2: Core components (button, input, form)
- Day 3: Layout & navigation
- Day 4: Advanced components

### 2. **Customize Components**
After installation, components are in `src/components/ui/`:
- You own the code
- Modify as needed
- No breaking changes from updates

### 3. **Use Component Variants**
Most components have variants:
```typescript
<Button variant="default">Default</Button>
<Button variant="outline">Outline</Button>
<Button size="lg">Large</Button>
<Button size="sm">Small</Button>
```

### 4. **Check Documentation**
For each component:
- Visit: https://ui.shadcn.com/docs/components/[component-name]
- See examples, props, variants

---

## What's Next?

After installing all components:

✅ **Day 5**: Create layout components (Navbar, Sidebar)
✅ **Week 2**: Build dashboard with installed components
✅ **Week 3**: Create prompt forms using form components

---

## Component Usage Reference

Quick reference for common components:

### Button
```typescript
import { Button } from '@/components/ui/button'
<Button onClick={handleClick}>Click me</Button>
```

### Input
```typescript
import { Input } from '@/components/ui/input'
<Input type="email" placeholder="Email" />
```

### Card
```typescript
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Dialog
```typescript
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'
<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>Content</DialogContent>
</Dialog>
```

---

## ✅ Completion Checklist

By end of Day 4:

- [ ] shadcn/ui initialized (`components.json` exists)
- [ ] All 37+ components installed in `src/components/ui/`
- [ ] Test page created and working
- [ ] Components render correctly
- [ ] Dark mode working
- [ ] No TypeScript errors

---

## 🎉 Success!

When all components are installed, you're ready for **Day 5: Layout Components**!

**Estimated Time Spent**: 2-3 hours
**Components Installed**: 37+
**Ready for**: Building actual UI

---

**Resources**:
- shadcn/ui docs: https://ui.shadcn.com
- Component examples: https://ui.shadcn.com/docs/components
- Radix UI: https://www.radix-ui.com
