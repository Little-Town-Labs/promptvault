# PromptVault Landing Page - Design Requirements

**Date**: 2025-10-10
**Project**: PromptVault - AI Prompt Management Platform
**Document Type**: Designer Handoff & Requirements

---

## 📋 Table of Contents
- [Tech Stack](#tech-stack)
- [Design System](#design-system)
- [Page Structure](#page-structure)
- [Design Assets Needed](#design-assets-needed)
- [Responsive Requirements](#responsive-requirements)
- [Brand Guidelines](#brand-guidelines)

---

## 🛠 Tech Stack

### Frontend Framework
- **Next.js 14.2.0** - React framework with App Router
- **React 18.2.0** - UI library
- **TypeScript 5.9.3** - Type-safe JavaScript

### Styling & Design
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Shadcn/ui** - Component library (Radix UI primitives)
- **tailwindcss-animate** - Animation utilities
- **next-themes 0.3.0** - Dark/light mode support

### Fonts
- **Inter** - Google Font (loaded via Next.js font optimization)

### Authentication
- **Clerk** - User authentication and management

### Design Tokens
```css
/* Color Palette (HSL values) */
--primary: 221.2 83.2% 53.3%        /* Blue #4F7CFF */
--background: 0 0% 100%              /* White */
--foreground: 222.2 84% 4.9%         /* Near Black */
--muted: 210 40% 96.1%               /* Light Gray */
--muted-foreground: 215.4 16.3% 46.9% /* Medium Gray */
```

### Component Library
- Custom components built with Radix UI:
  - Button (variants: default, ghost, outline)
  - Card (CardHeader, CardTitle, CardDescription, CardContent)
  - Badge (variants: default, secondary)
  - Separator
  - Dialog (for modals)

---

## 🎨 Design System

### Typography Scale
```
Hero Headline:     4xl → 5xl → 6xl → 7xl → 8xl (responsive)
Section Titles:    3xl → 4xl → 5xl (responsive)
Subsections:       xl → 2xl
Body Text:         lg → xl
Small Text:        sm → base
```

### Spacing System
```
Sections:      py-24 → py-32 (96px to 128px vertical)
Elements:      gap-4 → gap-8 (16px to 32px)
Cards:         p-6 → p-12 (24px to 48px)
Containers:    max-w-2xl → max-w-6xl (responsive max-width)
```

### Color Usage
- **Primary Gradient**: `from-primary via-primary/80 to-primary/60`
- **Background Layers**: Subtle overlays with opacity (10%, 5%, 2%)
- **Shadows**: `shadow-lg`, `shadow-xl`, `shadow-2xl` with primary color tint
- **Borders**: Subtle borders with transparency

### Visual Effects
- Gradient text with `bg-clip-text`
- Backdrop blur on sticky header (`backdrop-blur-xl`)
- Hover lift animations (`hover:-translate-y-1`)
- Icon scale on hover (`hover:scale-110`)
- Smooth transitions (300ms duration)
- Pulsing dot animation for "New" badge
- Grid background pattern (subtle)

---

## 📐 Page Structure

### 1. Sticky Header
**Height**: 64px (h-16)
**Background**: Semi-transparent with blur effect
**Position**: Fixed to top, appears on scroll

**Elements**:
- **Logo** (left): 📝 emoji + "Prompt Vault" gradient text
- **Navigation** (center, hidden on mobile):
  - Features
  - How It Works
  - Pricing
  - Testimonials
- **Auth Buttons** (right):
  - Signed Out: "Sign In" (ghost) + "Get Started" (primary with shadow)
  - Signed In: "Dashboard" (ghost) + User Avatar

---

### 2. Hero Section
**Padding**: py-24 → py-32 → py-40 (responsive)
**Background**: Gradient overlay + grid pattern

**Elements** (top to bottom):

**A. Animated Badge**
- Text: "New: AI-Powered Prompt Suggestions"
- Pulsing dot indicator (animation)
- Secondary variant with border and shadow

**B. Main Headline**
- Line 1: "Manage Your AI Prompts"
- Line 2: "Effortlessly" (gradient text)
- Font size: 4xl → 5xl → 6xl → 7xl → 8xl (responsive)
- Font weight: Bold
- Max width: 5xl (1024px)

**C. Subheadline**
- Text: "Version control, collaborate, and scale your AI operations with the most powerful prompt management platform built for modern teams."
- Font size: lg → xl → 2xl (responsive)
- Color: Muted foreground
- Max width: 2xl (672px)

**D. CTA Buttons**
- Primary: "Start Free Trial →" (with shadow)
- Secondary: "Watch Demo ▶" (outline variant)
- Layout: Stack on mobile, horizontal on desktop

**E. Social Proof Bar**
- ⭐⭐⭐⭐⭐ 5.0 (500+ reviews)
- 🔒 SOC 2 Certified
- ⚡ 99.99% Uptime
- Separated by vertical dividers

**F. Stats Grid** (4 columns on desktop, 2 on mobile)
- **100K+** Prompts Managed
- **5K+** Active Users
- **50+** Enterprise Clients
- **24/7** Support
- Numbers in gradient text, large font (4xl)

**G. Product Mockup Placeholder**
- Aspect ratio: 16:9 (aspect-video)
- Border radius: xl
- Background: Gradient (primary/20 to primary/5)
- Shadow: 2xl
- Center content: 📝 emoji + "Product Screenshot" text
- Max width: 6xl (1280px)

---

### 3. Features Section
**ID**: `#features`
**Padding**: py-24 → py-32
**Layout**: Grid (1 → 2 → 3 columns responsive)

**Section Header**:
- Badge: "Features"
- Title: "Everything You Need"
- Subtitle: "Powerful features designed for teams of all sizes..."

**Feature Cards** (6 total):
Each card has:
- Icon (emoji in colored circle background)
- Title (text-xl)
- Description (text-base, muted color)
- Hover effects: Lift, shadow increase, icon scale, gradient overlay fade-in

**Features**:
1. 🏢 **Multi-Tenant Architecture** - Organization isolation with RBAC
2. 📚 **Version History** - Full version control and rollback
3. 👥 **Team Collaboration** - Real-time comments and sharing
4. 🏷️ **Smart Organization** - Categories, tags, collections, search
5. 🔒 **Enterprise Security** - Encryption, SSO, audit logs
6. ⚡ **API Access** - RESTful API with documentation

---

### 4. How It Works Section
**ID**: `#how-it-works`
**Padding**: py-24 → py-32
**Layout**: Grid (1 → 2 → 4 columns responsive)

**Section Header**:
- Badge: "How It Works"
- Title: "Get Started in Minutes"
- Subtitle: "Four simple steps to transform your workflow"

**Step Cards** (4 total):
Each step has:
- Circular icon container (emoji, 64px)
- Step label: "STEP 01", "STEP 02", etc.
- Title (text-xl, semibold)
- Description (muted color)
- Connecting line between steps (desktop only)

**Steps**:
1. ✨ **Sign Up** - Create account, no credit card for trial
2. 📝 **Create Prompts** - Add prompts with variables, tags, categories
3. 🤝 **Collaborate** - Invite team, share, comment
4. 🚀 **Scale & Integrate** - Use API, scale across organization

---

### 5. Testimonials Section
**ID**: `#testimonials`
**Padding**: py-24 → py-32
**Layout**: Grid (1 → 2 → 3 columns responsive)

**Section Header**:
- Badge: "Testimonials"
- Title: "Loved by Teams Worldwide"
- Subtitle: "See what our customers have to say..."

**Testimonial Cards** (3 total):
Each card has:
- Gradient top border (1px, primary gradient)
- 5-star rating (⭐⭐⭐⭐⭐)
- Quote (italic, text-base)
- Avatar (initials in colored circle)
- Author name (semibold)
- Role and company (small, muted)

**Testimonials**:
1. **Sarah Johnson** - CTO @ TechCorp
   - "Transformed our AI workflows. Version control saved countless hours."
2. **Michael Chen** - Founder @ AI Agency Pro
   - "Multi-tenant architecture perfect for our agency. All clients in one place."
3. **Emily Rodriguez** - Product Manager @ StartupXYZ
   - "Best prompt management tool. Seamless API integration, responsive support."

---

### 6. Pricing Section
**ID**: `#pricing`
**Padding**: py-24 → py-32
**Layout**: Grid (1 → 3 columns responsive)

**Section Header**:
- Badge: "Pricing"
- Title: "Simple, Transparent Pricing"
- Subtitle: "Choose the plan that's right for you. All plans include 14-day free trial."

**Pricing Tiers** (3 total):

**Tier 1: Starter**
- Price: **$9**/month
- Tagline: "Perfect for individuals"
- Features:
  - Up to 100 prompts
  - Basic version history
  - Categories & tags
  - API access
  - Email support
- Button: "Start Free Trial" (outline variant)

**Tier 2: Professional** (HIGHLIGHTED)
- Badge: "Most Popular"
- Border: 2px primary color
- Scale: 105% on large screens
- Shadow: 2xl
- Price: **$29**/month
- Tagline: "For growing teams"
- Features:
  - Unlimited prompts
  - Full version history
  - Team collaboration
  - Advanced search
  - Priority support
  - Up to 10 team members
- Button: "Start Free Trial" (primary with shadow)

**Tier 3: Enterprise**
- Price: **Custom**
- Tagline: "For large organizations"
- Features:
  - Everything in Professional
  - Unlimited team members
  - SSO & SAML
  - Custom integrations
  - Dedicated support
  - SLA guarantee
- Button: "Contact Sales" (outline variant)

---

### 7. Final CTA Section
**Padding**: py-24 → py-32
**Background**: Gradient card with border

**Elements**:
- Badge: "Ready to Get Started?"
- Headline: "Join Thousands of Teams Using Prompt Vault"
- Subtext: "Start your 14-day free trial today. No credit card required. Cancel anytime."
- CTA Buttons: Same as hero section
- Trust badges:
  - ✓ 14-day free trial
  - ✓ No credit card required
  - ✓ Cancel anytime

---

### 8. Footer
**Background**: Muted/30
**Border**: Top border
**Padding**: py-12 → py-16

**Layout**: Grid (1 → 2 → 5 columns)

**Column 1-2: Brand Section**
- Logo: 📝 + "Prompt Vault" (gradient)
- Description: "The modern way to manage your AI prompts..."
- Social Icons:
  - Twitter/X
  - GitHub
  - LinkedIn

**Column 3: Product**
- Features
- How It Works
- Pricing
- Changelog
- Roadmap

**Column 4: Company**
- About
- Blog
- Careers
- Contact

**Column 5: Legal**
- Privacy
- Terms
- Security
- Cookies

**Bottom Bar**:
- Copyright: "© 2024 Prompt Vault. All rights reserved."
- Tagline: "Made with ❤️ for AI teams worldwide"

---

## 🎯 Design Assets Needed

### Images & Graphics

1. **Product Screenshots**
   - **Dashboard View** (Hero section)
     - Size: 1280x720px minimum (16:9 aspect ratio)
     - Shows: Prompt list, sidebar navigation, search bar
     - Format: PNG with transparency or JPG
     - Notes: Should show realistic data, modern UI

   - **Additional Screenshots** (optional for later):
     - Prompt editor interface
     - Version history view
     - Team collaboration features
     - Analytics dashboard

2. **Icons** (if replacing emojis)
   - Multi-tenant architecture icon
   - Version history icon
   - Team collaboration icon
   - Organization/tags icon
   - Security/lock icon
   - API/lightning icon
   - All icons should be SVG format
   - Style: Line icons or filled, consistent style
   - Size: 24x24px base size (scalable)

3. **Logo**
   - **Full Logo**: Icon + Wordmark
     - SVG format (scalable)
     - Versions: Color, White, Black
   - **Icon Only**: For mobile/favicon
     - Sizes: 16x16, 32x32, 192x192, 512x512
     - Formats: SVG, PNG, ICO
   - **Favicon**:
     - Currently using 📝 emoji
     - Should be replaced with custom icon

4. **Background Patterns/Textures**
   - Grid pattern (currently CSS-generated, could be image)
   - Gradient overlays (currently CSS, acceptable)
   - Optional: Abstract shapes for visual interest

5. **Illustrations** (optional enhancements)
   - Hero section illustration
   - Empty states for dashboard
   - Error state illustrations
   - Success/confirmation illustrations

### Brand Assets

6. **Company Logos** (for social proof)
   - Client/customer logos
   - Format: SVG or PNG with transparency
   - Size: Variable, but consistent height (~40px)
   - Style: Grayscale or color

7. **Team Photos** (for testimonials)
   - Replace initials with actual photos
   - Format: JPG or PNG
   - Size: 80x80px minimum (circular crop)
   - 3 photos needed initially

---

## 📱 Responsive Requirements

### Breakpoints
```
Mobile:    < 640px  (sm)   - Single column, stacked layout
Tablet:    640-768px (md)  - 2 columns for grids
Desktop:   768-1024px (lg) - 3 columns, full navigation
Large:     1024-1280px (xl) - Larger typography
X-Large:   1280px+ (2xl)   - Max container width
```

### Mobile-Specific Requirements (< 640px)
- Navigation hidden (hamburger menu needed)
- Single column layouts
- Stacked CTA buttons
- Smaller text sizes (4xl hero headline)
- 2-column stats grid
- Full-width cards
- Touch-friendly buttons (min 44px height)

### Tablet Requirements (640-768px)
- 2-column grids
- Visible navigation
- Medium text sizes (5xl hero headline)
- Horizontal CTA buttons

### Desktop Requirements (768px+)
- 3-4 column grids
- Large text sizes (6xl-8xl hero headline)
- Sidebar navigation in dashboard
- Full-width sections

---

## 🎨 Brand Guidelines

### Color Palette

**Primary Colors**:
- **Primary Blue**: `hsl(221.2, 83.2%, 53.3%)` / #4F7CFF
  - Use for: CTAs, links, accents, gradients
  - Variations: /80 (80% opacity), /60, /25, /10, /5

**Neutral Colors**:
- **Background**: `hsl(0, 0%, 100%)` / White
- **Foreground**: `hsl(222.2, 84%, 4.9%)` / #0A0E27 (near black)
- **Muted**: `hsl(210, 40%, 96.1%)` / #F1F5F9 (light gray)
- **Muted Foreground**: `hsl(215.4, 16.3%, 46.9%)` / #64748B (medium gray)

**Accent Colors**:
- **Secondary**: `hsl(210, 40%, 96.1%)` / #F1F5F9
- **Destructive**: `hsl(0, 84.2%, 60.2%)` / #EF4444 (red for errors)
- **Success**: Green (define if needed)
- **Warning**: Yellow (define if needed)

**Gradients**:
- **Primary Gradient**: `from-primary via-primary/80 to-primary/60`
- **Background Gradient**: `from-primary/10 via-primary/5 to-background`

### Typography

**Font Family**: Inter (Google Font)
- **Weights**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- **Line Height**: 1.5 for body, 1.2 for headings
- **Letter Spacing**: Tight for headings (`tracking-tight`), normal for body

**Hierarchy**:
```
H1: 4xl-8xl (responsive), bold, tight tracking
H2: 3xl-5xl (responsive), bold, tight tracking
H3: xl-2xl, semibold
Body: lg-xl, regular
Small: sm-base, regular
```

### Spacing

**Consistent Scale** (Tailwind defaults):
```
0.5 = 2px
1 = 4px
2 = 8px
3 = 12px
4 = 16px
6 = 24px
8 = 32px
12 = 48px
16 = 64px
24 = 96px
32 = 128px
40 = 160px
```

**Common Patterns**:
- Section padding: `py-24` or `py-32`
- Card padding: `p-6` or `p-8`
- Element gaps: `gap-4`, `gap-6`, `gap-8`
- Button padding: `px-8 py-2` (lg size)

### Shadows

```css
shadow-sm:   0 1px 2px rgba(0,0,0,0.05)
shadow:      0 1px 3px rgba(0,0,0,0.1)
shadow-md:   0 4px 6px rgba(0,0,0,0.1)
shadow-lg:   0 10px 15px rgba(0,0,0,0.1)
shadow-xl:   0 20px 25px rgba(0,0,0,0.1)
shadow-2xl:  0 25px 50px rgba(0,0,0,0.25)
```

**With Color**: `shadow-xl shadow-primary/25` (primary color at 25% opacity)

### Border Radius

```
sm: 0.125rem (2px)
DEFAULT: 0.25rem (4px)
md: 0.375rem (6px)
lg: 0.5rem (8px)
xl: 0.75rem (12px)
2xl: 1rem (16px)
full: 9999px (circular)
```

### Animations

**Transitions**: `transition-all duration-300 ease-in-out`

**Common Effects**:
- Hover lift: `hover:-translate-y-1`
- Scale: `hover:scale-110`
- Fade in: `opacity-0 group-hover:opacity-100`
- Spin (loading): `animate-spin`
- Ping (badge): `animate-ping`

---

## ✅ Design Checklist

### Must-Haves
- [ ] Product screenshot for hero section (1280x720px)
- [ ] Custom logo (SVG + PNG)
- [ ] Favicon set (16x16, 32x32, 192x192, 512x512)
- [ ] Consistent icon style (if replacing emojis)
- [ ] Mobile-responsive layouts tested
- [ ] Dark mode consideration (optional for v1)

### Nice-to-Haves
- [ ] Customer/client logos for social proof
- [ ] Team photos for testimonials
- [ ] Additional product screenshots
- [ ] Custom illustrations
- [ ] Animated elements
- [ ] Video demo embed
- [ ] Interactive components

### Accessibility
- [ ] Color contrast ratios meet WCAG AA (4.5:1 for normal text)
- [ ] Focus states for keyboard navigation
- [ ] Alt text for all images
- [ ] Semantic HTML structure
- [ ] Touch targets minimum 44x44px
- [ ] Screen reader friendly labels

---

## 📦 Deliverables Format

### Preferred Formats
- **Logos**: SVG (vector) + PNG exports
- **Icons**: SVG (inline-able)
- **Photos/Screenshots**: JPG (optimized) or PNG (if transparency needed)
- **Illustrations**: SVG preferred, PNG acceptable
- **Favicon**: ICO + PNG set

### Naming Convention
```
logo-full-color.svg
logo-full-white.svg
logo-icon-color.svg
icon-[name]-24px.svg
screenshot-dashboard-hero.jpg
photo-testimonial-[name].jpg
```

### File Organization
```
public/
├── images/
│   ├── logo/
│   ├── icons/
│   ├── screenshots/
│   ├── testimonials/
│   └── clients/
└── favicon.ico
```

---

## 🔗 Additional Resources

### Live Development
- **Current URL**: http://localhost:3002
- **Tech Stack Docs**:
  - [Next.js 14](https://nextjs.org/docs)
  - [Tailwind CSS](https://tailwindcss.com/docs)
  - [Shadcn/ui](https://ui.shadcn.com)

### Design Inspiration
The landing page is inspired by modern SaaS companies:
- **Vercel**: Gradient text, blur effects, minimalism
- **Linear**: High contrast, clean typography, subtle animations
- **Stripe**: Professional, clear hierarchy, excellent spacing
- **Tailwind UI**: Modern components, responsive design

---

## 📞 Contact & Questions

For design questions or clarifications:
- Review live site: http://localhost:3002
- Check existing components in `/src/components/ui/`
- Reference color system in `/src/app/globals.css`
- See page structure in `/src/app/page.tsx`

---

**Version**: 1.0
**Last Updated**: 2025-10-10
**Status**: Active Development
