# Week 1, Day 1 - Development Environment Setup

**Goal**: Get your development environment fully configured and ready to code.

**Time Required**: 1-2 hours

---

## ✅ Checklist

- [ ] Set up Clerk account and configure organizations
- [ ] Set up Neon database
- [ ] Configure environment variables
- [ ] Run initial database migration
- [ ] Test authentication flow

---

## 📋 Step-by-Step Instructions

### Step 1: Set Up Clerk Account (15 minutes)

Clerk provides authentication and multi-tenancy (organizations) out of the box.

#### 1.1 Create Account
1. Go to [https://clerk.com](https://clerk.com)
2. Click "Start building for free"
3. Sign up with email or GitHub

#### 1.2 Create Application
1. Click "Add application" or "Create Application"
2. Name: **Prompt Vault** (or your preferred name)
3. Select authentication methods:
   - ✅ Email
   - ✅ Google (recommended)
   - ✅ GitHub (recommended)
4. Click "Create application"

#### 1.3 Enable Organizations
1. In your Clerk dashboard, navigate to **"Organizations"** in the sidebar
2. Toggle **"Enable organizations"** to ON
3. Configure settings:
   - ✅ Allow users to create organizations
   - ✅ Max organizations per user: **Unlimited** (or set a limit)
   - ✅ Creator role: **Admin** (recommended)
4. Click "Save"

#### 1.4 Configure Paths
1. Go to **"Paths"** in the sidebar
2. Set the following:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in URL: `/dashboard`
   - After sign-up URL: `/dashboard`
3. Click "Save"

#### 1.5 Copy API Keys
1. Go to **"API Keys"** in the sidebar
2. Copy both keys (you'll need these next):
   - **Publishable key**: `pk_test_...`
   - **Secret key**: `sk_test_...`

**✅ Checkpoint**: You should have two API keys copied.

---

### Step 2: Set Up Neon Database (10 minutes)

Neon provides serverless PostgreSQL with a generous free tier.

#### 2.1 Create Account
1. Go to [https://neon.tech](https://neon.tech)
2. Click "Sign up" (you can use GitHub for quick signup)
3. Verify your email

#### 2.2 Create Project
1. Click "Create a project" or "New Project"
2. Name: **prompt-vault** (or your preferred name)
3. Region: Choose closest to your location (e.g., US East, EU West)
4. Postgres version: **Latest** (16 recommended)
5. Click "Create project"

#### 2.3 Copy Connection String
1. After project creation, you'll see the connection details
2. Copy the **Connection string** (it looks like):
   ```
   postgresql://username:password@host.neon.tech/dbname?sslmode=require
   ```
3. **Important**: Save this securely - you'll need it in the next step

**Alternative**: If the connection string isn't visible:
- Go to "Dashboard" → "Connection Details"
- Copy the "Connection string"

**✅ Checkpoint**: You should have a PostgreSQL connection string.

---

### Step 3: Configure Environment Variables (5 minutes)

Now let's configure your local environment.

#### 3.1 Navigate to Project
```bash
cd /mnt/f/promptvault
```

#### 3.2 Create .env File
The `.env.example` file already exists. Let's copy it:
```bash
cp .env.example .env
```

#### 3.3 Edit .env File
Open `.env` in your editor and fill in the values:

```env
# ============================================
# App Configuration
# ============================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# ============================================
# Clerk Authentication
# ============================================
# From Step 1.5 - Copy both keys from Clerk dashboard
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
CLERK_SECRET_KEY=sk_test_YOUR_SECRET_HERE

# These should match what you set in Step 1.4
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# ============================================
# Database (Neon Postgres)
# ============================================
# From Step 2.3 - Paste your full connection string
DATABASE_URL=postgresql://username:password@host.neon.tech/dbname?sslmode=require

# ============================================
# Optional Services (Leave blank for now)
# ============================================
# We'll configure these in later weeks
BLOB_READ_WRITE_TOKEN=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
MEILISEARCH_HOST=
MEILISEARCH_MASTER_KEY=
```

**✅ Checkpoint**: Your `.env` file should have Clerk keys and database URL filled in.

---

### Step 4: Install Dependencies (5 minutes)

#### 4.1 Install pnpm (if not already installed)
```bash
# Check if pnpm is installed
pnpm --version

# If not installed, install it globally
npm install -g pnpm
```

#### 4.2 Install Project Dependencies
```bash
cd /mnt/f/promptvault
pnpm install
```

This will install all dependencies from `package.json` (~200 packages).

**Expected output**:
```
Progress: resolved XXX, reused XXX, downloaded XXX, added XXX
Dependencies installed successfully
```

**⏱️ Time**: 2-3 minutes depending on internet speed.

**✅ Checkpoint**: No errors during installation.

---

### Step 5: Run Initial Database Migration (5 minutes)

Now let's set up your database schema.

#### 5.1 Generate Prisma Client
```bash
pnpm db:generate
```

**What this does**: Generates TypeScript types from your Prisma schema.

**Expected output**:
```
✔ Generated Prisma Client
```

#### 5.2 Push Schema to Database
```bash
pnpm db:push
```

**What this does**: Creates all tables in your Neon database based on `prisma/schema.prisma`.

**Expected output**:
```
Your database is now in sync with your schema.
✔ Generated Prisma Client
```

#### 5.3 Verify Database (Optional)
```bash
pnpm db:studio
```

This opens Prisma Studio in your browser where you can see all tables:
- organizations
- users
- prompts
- categories
- tags
- collections
- comments
- favorites
- activities
- api_keys
- etc.

**✅ Checkpoint**: All tables visible in Prisma Studio.

---

### Step 6: Start Development Server (2 minutes)

#### 6.1 Start the Server
```bash
pnpm dev
```

**Expected output**:
```
  ▲ Next.js 14.2.0
  - Local:        http://localhost:3000
  - Environments: .env

 ✓ Ready in 2.1s
```

#### 6.2 Open in Browser
Visit [http://localhost:3000](http://localhost:3000)

**What you should see**:
- Landing page with "Welcome to Prompt Vault"
- "Get Started" and "Sign In" buttons
- Dark mode toggle working

**✅ Checkpoint**: Landing page loads successfully.

---

### Step 7: Test Authentication Flow (10 minutes)

Let's verify Clerk authentication is working.

#### 7.1 Test Sign Up
1. Click "Get Started" or "Sign Up" button
2. You should see Clerk's sign-up form
3. Create an account using:
   - Email + password, OR
   - Google/GitHub OAuth

#### 7.2 Test Organization Creation
After signing up, Clerk should:
1. Automatically create your first organization
2. Redirect you to `/dashboard`

**Expected behavior**:
- User is authenticated
- Organization is created
- Redirect to `/dashboard` (may show 404 for now - that's OK!)

#### 7.3 Verify in Database
Open Prisma Studio (if not already open):
```bash
pnpm db:studio
```

Check:
- **users** table: Your user should be there with `clerkUserId`
- **organizations** table: May be empty (we'll create org sync in Week 9)

**Note**: Clerk manages users internally. We'll sync to our database when needed.

#### 7.4 Test Sign Out & Sign In
1. Sign out (if you see a sign-out option)
2. Go to [http://localhost:3000/sign-in](http://localhost:3000/sign-in)
3. Sign in with your credentials
4. Should redirect to `/dashboard`

**✅ Checkpoint**: Can sign up, sign in, and sign out successfully.

---

## 🐛 Troubleshooting

### Issue: "Invalid Clerk keys"
**Solution**:
- Double-check your `.env` file
- Ensure keys are copied correctly (no extra spaces)
- Restart dev server: `Ctrl+C` then `pnpm dev`

### Issue: "Can't connect to database"
**Solution**:
- Verify DATABASE_URL in `.env`
- Ensure `?sslmode=require` is at the end
- Check Neon dashboard - is database running?
- Verify your IP isn't blocked in Neon settings

### Issue: "Module not found" errors
**Solution**:
```bash
# Clear and reinstall
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

### Issue: "Prisma Client not found"
**Solution**:
```bash
pnpm db:generate
```

### Issue: Port 3000 already in use
**Solution**:
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
pnpm dev -- -p 3001
```

---

## ✅ Day 1 Completion Checklist

By the end of Day 1, you should have:

- [x] ✅ Clerk account created with organizations enabled
- [x] ✅ Neon database created and accessible
- [x] ✅ `.env` file configured with all credentials
- [x] ✅ Dependencies installed (`node_modules/` exists)
- [x] ✅ Database schema pushed (all tables created)
- [x] ✅ Dev server running on http://localhost:3000
- [x] ✅ Authentication working (can sign up/sign in)
- [x] ✅ Landing page displaying correctly

---

## 🎯 What's Next?

**Tomorrow (Day 2-4)**: Install shadcn/ui components

Commands you'll run:
```bash
pnpx shadcn-ui@latest init
pnpx shadcn-ui@latest add button form input textarea
# ... more components
```

**Day 5**: Create layout components (Navbar, Sidebar, etc.)

---

## 📸 Screenshots to Take (for reference)

1. Clerk dashboard - Organizations enabled
2. Neon dashboard - Database created
3. Prisma Studio - Tables created
4. Browser - Landing page working
5. Browser - Clerk sign-up form
6. Browser - Successfully authenticated

---

## 💾 Save Your Credentials

Create a secure note with:
- Clerk publishable key
- Clerk secret key
- Neon connection string
- Neon dashboard URL
- Your test account email/password

**Security Note**: Never commit `.env` to git (it's already in `.gitignore`).

---

## 🎉 Congratulations!

You've completed Week 1, Day 1! Your development environment is fully set up and ready for building features.

**Next Steps**: Take a break, then proceed to Day 2 when ready.

---

**Need Help?**
- Clerk Docs: https://clerk.com/docs
- Neon Docs: https://neon.tech/docs
- Prisma Docs: https://www.prisma.io/docs
- Next.js Docs: https://nextjs.org/docs

**Questions?** Review the troubleshooting section or check the main documentation.
