# Quick Start Guide

Get Prompt Vault running in under 10 minutes!

## 🚀 Prerequisites

- Node.js 20+
- pnpm 8+ (install with `npm install -g pnpm`)
- PostgreSQL database (get free at [neon.tech](https://neon.tech))
- Clerk account (get free at [clerk.com](https://clerk.com))

## ⚡ 5-Minute Setup

### 1. Install Dependencies (1 min)

```bash
cd /mnt/f/promptvault
pnpm install
```

### 2. Set Up Clerk (2 min)

1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Enable "Organizations" in settings
4. Copy your API keys

### 3. Set Up Database (1 min)

1. Go to [neon.tech](https://neon.tech) and create an account
2. Create a new project
3. Copy the connection string

### 4. Configure Environment (1 min)

```bash
cp .env.example .env
```

Edit `.env` and add your keys:

```env
# Clerk (required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx

# Database (required)
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Initialize Database (30 sec)

```bash
pnpm db:generate  # Generate Prisma client
pnpm db:push      # Create database tables
```

### 6. Start Development Server (30 sec)

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

## 📱 What You Get

After setup, you'll have:

✅ **Landing Page** - Marketing homepage
✅ **Authentication** - Sign up/sign in with Clerk
✅ **Multi-Tenancy** - Organization support
✅ **Database** - PostgreSQL with Prisma
✅ **UI Components** - Tailwind CSS + shadcn/ui
✅ **Dark Mode** - Theme switching

## 🎨 Add UI Components

Install shadcn/ui components as needed:

```bash
# Initialize shadcn/ui (first time only)
pnpx shadcn-ui@latest init

# Add components
pnpx shadcn-ui@latest add button
pnpx shadcn-ui@latest add form
pnpx shadcn-ui@latest add dialog
pnpx shadcn-ui@latest add dropdown-menu
pnpx shadcn-ui@latest add table
```

## 🛠️ Next Steps

### Build Core Features

1. **Dashboard Page**
   ```bash
   mkdir -p src/app/dashboard
   touch src/app/dashboard/page.tsx
   ```

2. **Prompts CRUD**
   ```bash
   mkdir -p src/app/dashboard/prompts
   touch src/app/dashboard/prompts/page.tsx
   touch src/app/dashboard/prompts/new/page.tsx
   ```

3. **API Routes**
   ```bash
   mkdir -p src/app/api/prompts
   touch src/app/api/prompts/route.ts
   ```

### Add Search (Optional)

1. Sign up at [meilisearch.com](https://www.meilisearch.com/cloud)
2. Add credentials to `.env`:
   ```env
   MEILISEARCH_HOST=https://xxx.meilisearch.io
   MEILISEARCH_MASTER_KEY=xxx
   ```

### Deploy to Vercel (5 min)

```bash
# Install Vercel CLI
pnpm install -g vercel

# Deploy
vercel
```

Or:
1. Push to GitHub
2. Import in [vercel.com](https://vercel.com)
3. Add environment variables
4. Deploy!

## 📚 Documentation

- **Full PRD**: [docs/prd/PRODUCT_REQUIREMENTS_DOCUMENT.md](docs/prd/PRODUCT_REQUIREMENTS_DOCUMENT.md)
- **Setup Guide**: [docs/technical/SETUP_GUIDE.md](docs/technical/SETUP_GUIDE.md)
- **Project Summary**: [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

## 🐛 Troubleshooting

### Prisma Client Error

```bash
pnpm db:generate
```

### Clerk Redirect Error

Check your `.env` file has:
```env
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

### Database Connection Error

1. Verify DATABASE_URL is correct
2. Ensure `?sslmode=require` is at the end
3. Check your IP is whitelisted in Neon

## 💡 Tips

- Use `pnpm db:studio` to view your database
- Run `pnpm lint` before committing
- Check `package.json` for all available scripts
- Use `pnpm format` to format code

## 🎉 You're Ready!

Start building your prompt vault features. Happy coding! 🚀

---

**Need help?** Check the [README.md](README.md) or open an issue.
