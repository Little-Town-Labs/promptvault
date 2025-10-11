# ✅ Week 1, Days 2-4 - shadcn/ui Installation Checklist

**Goal**: Install all shadcn/ui components
**Time**: 2-3 hours (spread over 3 days)

---

## 🎯 Quick Start

### Option 1: Automated Installation (Recommended)

Run the installation script:

```bash
cd /mnt/f/promptvault
bash scripts/install-shadcn-components.sh
```

**This will:**
- Initialize shadcn/ui (if not done)
- Install all 37+ components
- Show progress for each category
- Verify installation

**Time**: 15-20 minutes (mostly downloading)

---

### Option 2: Manual Installation

Follow the detailed guide:

```bash
# Read the guide
cat docs/setup/WEEK1_DAY2-4_SHADCN.md

# Or open in browser
open docs/setup/WEEK1_DAY2-4_SHADCN.md
```

---

## 📋 Day-by-Day Tasks

### Day 2: Setup & Core Components ☐

**Tasks:**
- [ ] Initialize shadcn/ui configuration
- [ ] Install button component (test)
- [ ] Install form components (9 components)
  - button, form, input, textarea, label, select, checkbox, radio-group, switch
- [ ] Install layout components (6 components)
  - card, separator, tabs, accordion, aspect-ratio, scroll-area

**Commands:**
```bash
# Initialize
pnpx shadcn@latest init

# Test with button
pnpx shadcn@latest add button

# Install core components
pnpx shadcn@latest add form input textarea label select checkbox radio-group switch
pnpx shadcn@latest add card separator tabs accordion aspect-ratio scroll-area
```

**Time**: ~1 hour

---

### Day 3: Navigation & Overlays ☐

**Tasks:**
- [ ] Install navigation components (5 components)
  - dropdown-menu, navigation-menu, menubar, breadcrumb, pagination
- [ ] Install overlay components (7 components)
  - dialog, alert-dialog, sheet, popover, tooltip, context-menu, hover-card
- [ ] Install data display components (6 components)
  - table, badge, avatar, skeleton, progress, alert

**Commands:**
```bash
# Navigation
pnpx shadcn@latest add dropdown-menu navigation-menu menubar breadcrumb pagination

# Overlays
pnpx shadcn@latest add dialog alert-dialog sheet popover tooltip context-menu hover-card

# Data display
pnpx shadcn@latest add table badge avatar skeleton progress alert
```

**Time**: ~1 hour

---

### Day 4: Utilities & Testing ☐

**Tasks:**
- [ ] Install feedback components (1 component)
  - sonner (or toast)
- [ ] Install utility components (4 components)
  - command, calendar, slider, resizable
- [ ] Verify all components installed
- [ ] Create test page
- [ ] Test components work

**Commands:**
```bash
# Feedback & utilities
pnpx shadcn@latest add sonner
pnpx shadcn@latest add command calendar slider resizable

# Count installed components
ls src/components/ui/ | wc -l
# Should be 37+

# Start dev server
pnpm dev

# Visit test page
open http://localhost:3000/components-test
```

**Time**: ~30 minutes

---

## ✅ Verification Checklist

### Files Created

- [ ] `components.json` exists in project root
- [ ] `src/components/ui/` directory exists
- [ ] 37+ `.tsx` files in `src/components/ui/`

### Components by Category

**Form Components (9)** ☐
- [ ] button.tsx
- [ ] form.tsx
- [ ] input.tsx
- [ ] textarea.tsx
- [ ] label.tsx
- [ ] select.tsx
- [ ] checkbox.tsx
- [ ] radio-group.tsx
- [ ] switch.tsx

**Layout Components (6)** ☐
- [ ] card.tsx
- [ ] separator.tsx
- [ ] tabs.tsx
- [ ] accordion.tsx
- [ ] aspect-ratio.tsx
- [ ] scroll-area.tsx

**Navigation Components (5)** ☐
- [ ] dropdown-menu.tsx
- [ ] navigation-menu.tsx
- [ ] menubar.tsx
- [ ] breadcrumb.tsx
- [ ] pagination.tsx

**Overlay Components (7)** ☐
- [ ] dialog.tsx
- [ ] alert-dialog.tsx
- [ ] sheet.tsx
- [ ] popover.tsx
- [ ] tooltip.tsx
- [ ] context-menu.tsx
- [ ] hover-card.tsx

**Data Display Components (6)** ☐
- [ ] table.tsx
- [ ] badge.tsx
- [ ] avatar.tsx
- [ ] skeleton.tsx
- [ ] progress.tsx
- [ ] alert.tsx

**Feedback Components (1)** ☐
- [ ] sonner.tsx (or toast.tsx)

**Utility Components (4)** ☐
- [ ] command.tsx
- [ ] calendar.tsx
- [ ] slider.tsx
- [ ] resizable.tsx

---

## 🧪 Testing

### Step 1: Check Files Exist

```bash
# List all components
ls -la src/components/ui/

# Count components
ls src/components/ui/*.tsx | wc -l
```

**Expected**: 37+ files

---

### Step 2: Test in Browser

```bash
# Start dev server (if not running)
pnpm dev
```

Visit these URLs:

1. **Homepage**: http://localhost:3000
   - [ ] Button component works
   - [ ] No errors in console

2. **Component Test Page**: http://localhost:3000/components-test
   - [ ] All components render
   - [ ] Buttons work
   - [ ] Forms work
   - [ ] Dialogs open
   - [ ] Dropdowns work
   - [ ] No TypeScript errors

---

### Step 3: Test Component Import

Create a test file or open homepage:

```typescript
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

// Should not show TypeScript errors
```

**Expected**: No import errors, autocomplete works

---

## 🐛 Troubleshooting

### Issue: "Cannot resolve @/components/ui/button"

**Check:**
```bash
# Verify file exists
ls src/components/ui/button.tsx

# Check tsconfig.json has path alias
cat tsconfig.json | grep "@/\*"
```

**Solution:**
- Restart TypeScript server in your editor
- Restart dev server

---

### Issue: Components don't have styles

**Check:**
```bash
# Verify globals.css imported
cat src/app/globals.css | head -20

# Check tailwind.config.ts includes components
cat tailwind.config.ts | grep "components"
```

**Solution:**
- Restart dev server
- Check `content` array in `tailwind.config.ts` includes:
  ```
  './src/components/**/*.{ts,tsx}'
  ```

---

### Issue: Installation fails/hangs

**Try:**
```bash
# Use npm instead
npx shadcn@latest add button

# Use verbose mode
pnpx shadcn@latest add button --verbose

# Check internet connection
ping ui.shadcn.com
```

---

## 📚 Resources

### Documentation
- **shadcn/ui Docs**: https://ui.shadcn.com
- **Components**: https://ui.shadcn.com/docs/components
- **Installation**: https://ui.shadcn.com/docs/installation/next

### Internal Docs
- **Detailed Guide**: `docs/setup/WEEK1_DAY2-4_SHADCN.md`
- **Installation Script**: `scripts/install-shadcn-components.sh`
- **Test Page**: `src/app/components-test/page.tsx`

---

## ✅ Completion Criteria

You've completed Days 2-4 when:

- [x] shadcn/ui initialized
- [x] 37+ components installed
- [x] Test page works
- [x] No TypeScript errors
- [x] No console errors
- [x] Dark mode working
- [x] All component categories installed

---

## 🎯 What's Next?

**Day 5: Create Layout Components**

You'll build:
- Navbar with user menu
- Sidebar with navigation
- Main layout wrapper
- Dashboard layout

**Required components** (should be installed):
- Button ✓
- Avatar ✓
- Dropdown Menu ✓
- Separator ✓
- Card ✓

---

## 💡 Pro Tips

### 1. Install As Needed
Don't need all components? Install only what you need:
```bash
# Just the essentials
pnpx shadcn@latest add button input card dialog
```

### 2. Customize After Install
Components are in your codebase - modify as needed:
```bash
# Edit any component
code src/components/ui/button.tsx
```

### 3. Check Examples
Each component has examples:
```bash
# Visit shadcn docs for examples
open https://ui.shadcn.com/docs/components/button
```

### 4. Use Component CLI
```bash
# See what components are available
pnpx shadcn@latest --help

# Check component before installing
pnpx shadcn@latest diff button
```

---

## 📊 Time Tracking

| Day | Tasks | Time | Status |
|-----|-------|------|--------|
| Day 2 | Setup + Core (15 components) | ~1 hour | ☐ |
| Day 3 | Navigation + Overlays (18 components) | ~1 hour | ☐ |
| Day 4 | Utilities + Testing (5 components) | ~30 min | ☐ |
| **Total** | **37+ components** | **~2.5 hours** | ☐ |

---

## 🎉 Success!

When all checkboxes are marked, you're ready for **Day 5**!

**Achievement unlocked**: 🎨 UI Components Master

**Next**: Build the dashboard layout with your new components!

---

**Need help?** Check `docs/setup/WEEK1_DAY2-4_SHADCN.md` for detailed instructions.
