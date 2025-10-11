# Correct Clerk Setup for Next.js App Router

**✅ This guide uses the CURRENT and CORRECT Clerk integration method.**

---

## Overview

This project uses:
- **Clerk SDK**: `@clerk/nextjs` (latest version)
- **Next.js**: App Router (not Pages Router)
- **Middleware**: `clerkMiddleware()` from `@clerk/nextjs/server`

---

## Step 1: Create Clerk Account

1. Go to [https://clerk.com](https://clerk.com)
2. Click "Start building for free"
3. Sign up (GitHub OAuth is fastest)
4. Verify your email

---

## Step 2: Create Application

1. Click "Add application" or "Create Application"
2. Application name: **Prompt Vault**
3. Select authentication methods:
   - ✅ **Email** (required)
   - ✅ **Google** (recommended)
   - ✅ **GitHub** (recommended)
4. Click "Create application"

---

## Step 3: Enable Organizations

Organizations provide multi-tenancy out of the box.

1. In Clerk dashboard, go to **"Organizations"** in sidebar
2. Toggle **"Enable organizations"** → ON
3. Configure:
   - ✅ Allow users to create organizations
   - ✅ Max organizations per user: **Unlimited**
   - ✅ Creator role: **Admin**
4. Click "Save"

---

## Step 4: Copy API Keys

1. Go to **"API Keys"** in sidebar
2. You'll see two keys:
   ```
   Publishable Key: pk_test_...
   Secret Key: sk_test_...
   ```
3. Click to copy each key
4. **IMPORTANT**: Keep these secure!

**Direct link**: [https://dashboard.clerk.com/last-active?path=api-keys](https://dashboard.clerk.com/last-active?path=api-keys)

---

## Step 5: Add Keys to .env.local

Create or edit `.env.local` (or `.env`) in project root:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
CLERK_SECRET_KEY=sk_test_YOUR_SECRET_HERE
```

**✅ Verification**:
- Publishable key starts with `pk_test_` (or `pk_live_` in production)
- Secret key starts with `sk_test_` (or `sk_live_` in production)
- No extra spaces or quotes
- File is `.env.local` or `.env` (not `.env.txt`)

---

## Step 6: Verify Implementation

Our project already has the correct Clerk implementation:

### ✅ Middleware (`src/middleware.ts`)
```typescript
import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware()

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
```

### ✅ Layout (`src/app/layout.tsx`)
```typescript
import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
```

### ✅ Sign-In Page (`src/app/sign-in/[[...sign-in]]/page.tsx`)
```typescript
import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn />
    </div>
  )
}
```

### ✅ Sign-Up Page (`src/app/sign-up/[[...sign-up]]/page.tsx`)
```typescript
import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp />
    </div>
  )
}
```

### ✅ Homepage with Auth Components (`src/app/page.tsx`)
```typescript
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export default function Home() {
  return (
    <>
      <SignedOut>
        <SignInButton />
        <SignUpButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </>
  )
}
```

---

## Step 7: Test Authentication

1. **Start dev server**:
   ```bash
   pnpm dev
   ```

2. **Open browser**:
   ```
   http://localhost:3000
   ```

3. **Test sign-up**:
   - Click "Get Started"
   - Create account (email or OAuth)
   - Should redirect to homepage (authenticated)

4. **Test sign-in**:
   - Sign out (click user button → sign out)
   - Click "Sign In"
   - Sign in with credentials
   - Should redirect to homepage

5. **Test organization**:
   - After signing up, Clerk creates default organization
   - Check organization in Clerk dashboard

---

## Common Issues & Solutions

### Issue: "Clerk: Missing publishable key"
**Solution**:
- Check `.env.local` or `.env` has correct keys
- Verify key starts with `NEXT_PUBLIC_`
- Restart dev server: `Ctrl+C` then `pnpm dev`

### Issue: "Clerk: Invalid key"
**Solution**:
- Copy keys again from Clerk dashboard
- Ensure no extra spaces or quotes
- Check you're using test keys (not production)

### Issue: Sign-in page not found (404)
**Solution**:
- Verify folder structure: `src/app/sign-in/[[...sign-in]]/page.tsx`
- Check brackets are correct: `[[...sign-in]]`
- Restart dev server

### Issue: Redirect not working
**Solution**:
- Check Clerk dashboard → Paths
- Verify redirect URLs are set
- Or use default behavior (will redirect to referrer)

---

## Security Best Practices

### ✅ DO:
- Store keys in `.env.local` or `.env`
- Add `.env*` to `.gitignore` (already done)
- Use test keys (`pk_test_`, `sk_test_`) in development
- Use live keys (`pk_live_`, `sk_live_`) in production
- Rotate keys if exposed

### ❌ DON'T:
- Commit keys to git
- Share keys publicly
- Use production keys in development
- Hard-code keys in source files

---

## Using Clerk in Your App

### Check Authentication Status

```typescript
import { auth } from '@clerk/nextjs/server'

export default async function Page() {
  const { userId } = await auth()

  if (!userId) {
    return <div>Not signed in</div>
  }

  return <div>User ID: {userId}</div>
}
```

### Get User Data

```typescript
import { currentUser } from '@clerk/nextjs/server'

export default async function Page() {
  const user = await currentUser()

  if (!user) return null

  return (
    <div>
      <p>Hello {user.firstName}!</p>
      <p>Email: {user.emailAddresses[0]?.emailAddress}</p>
    </div>
  )
}
```

### Protect API Routes

```typescript
// app/api/protected/route.ts
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({ data: 'Protected data' })
}
```

### Get Organization Info

```typescript
import { auth } from '@clerk/nextjs/server'

export default async function Page() {
  const { orgId, orgRole, orgSlug } = await auth()

  if (!orgId) {
    return <div>No organization selected</div>
  }

  return (
    <div>
      <p>Org ID: {orgId}</p>
      <p>Role: {orgRole}</p>
      <p>Slug: {orgSlug}</p>
    </div>
  )
}
```

---

## Official Resources

- **Clerk Dashboard**: [https://dashboard.clerk.com](https://dashboard.clerk.com)
- **Next.js Quickstart**: [https://clerk.com/docs/quickstarts/nextjs](https://clerk.com/docs/quickstarts/nextjs)
- **API Reference**: [https://clerk.com/docs/references/nextjs/overview](https://clerk.com/docs/references/nextjs/overview)
- **Organizations**: [https://clerk.com/docs/organizations/overview](https://clerk.com/docs/organizations/overview)

---

## What's Implemented

✅ **Correct `clerkMiddleware()`** usage (not deprecated `authMiddleware`)
✅ **App Router** structure (not Pages Router)
✅ **Correct imports** from `@clerk/nextjs` and `@clerk/nextjs/server`
✅ **Sign-in/Sign-up pages** with catch-all routes
✅ **ClerkProvider** wrapping app
✅ **Clerk components** (`SignInButton`, `SignUpButton`, `UserButton`, etc.)
✅ **Environment variables** properly configured
✅ **Organizations** enabled for multi-tenancy

---

## Next Steps

After Clerk is working:

1. ✅ Test authentication flow
2. ✅ Create test organization
3. ✅ Verify user appears in Clerk dashboard
4. → Move to Week 1, Day 2: Install shadcn/ui components
5. → Build dashboard layout

---

**✅ Your Clerk setup is correct and ready to use!**
