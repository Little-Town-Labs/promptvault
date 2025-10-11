# Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 20 or higher
- **pnpm**: Version 8 or higher (recommended package manager)
- **Git**: For version control
- **PostgreSQL**: Database (Neon recommended for production)

## Account Setup

You'll need accounts for the following services:

1. **Clerk** (Authentication)
   - Sign up at [clerk.com](https://clerk.com)
   - Create a new application
   - Enable organizations feature
   - Copy your API keys

2. **Neon** (Database)
   - Sign up at [neon.tech](https://neon.tech)
   - Create a new project
   - Copy the connection string

3. **Vercel** (Hosting - Optional)
   - Sign up at [vercel.com](https://vercel.com)
   - Install Vercel CLI: `pnpm install -g vercel`

4. **Meilisearch** (Search - Optional)
   - Sign up at [meilisearch.com](https://www.meilisearch.com/cloud)
   - Or self-host: [docs](https://www.meilisearch.com/docs/learn/getting_started/installation)

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd prompt-vault
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and fill in your credentials:

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Database (Neon Postgres)
DATABASE_URL=postgresql://user:password@host/promptvault?sslmode=require

# Optional: Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=vercel_blob_xxx

# Optional: Upstash Redis (Rate Limiting)
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx

# Optional: Meilisearch
MEILISEARCH_HOST=https://xxx.meilisearch.io
MEILISEARCH_MASTER_KEY=xxx
```

### 4. Database Setup

Generate Prisma client:

```bash
pnpm db:generate
```

Push the schema to your database:

```bash
pnpm db:push
```

Or create a migration:

```bash
pnpm db:migrate
```

(Optional) Seed the database:

```bash
pnpm db:seed
```

### 5. Start Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## Clerk Configuration

### Enable Organizations

1. Go to your Clerk dashboard
2. Navigate to "Organizations" in the sidebar
3. Enable organizations
4. Configure organization settings:
   - Allow users to create organizations
   - Set max organizations per user (or unlimited)
   - Enable domains (optional)

### Configure Paths

In your Clerk dashboard, set the following paths:

- **Sign-in URL**: `/sign-in`
- **Sign-up URL**: `/sign-up`
- **After sign-in URL**: `/dashboard`
- **After sign-up URL**: `/onboarding`

### Add OAuth Providers (Optional)

1. Navigate to "Social Connections"
2. Enable providers:
   - Google
   - GitHub
   - Microsoft
3. Configure OAuth credentials

## Database Management

### Prisma Studio

Open Prisma Studio to view and edit your database:

```bash
pnpm db:studio
```

### Migrations

Create a new migration:

```bash
pnpm db:migrate
```

Deploy migrations to production:

```bash
pnpm db:migrate:deploy
```

## Vercel Deployment

### Automatic Deployment (Recommended)

1. Push your code to GitHub
2. Import project in Vercel dashboard
3. Vercel will auto-detect Next.js
4. Add environment variables in Vercel dashboard
5. Deploy!

### Manual Deployment

```bash
# Install Vercel CLI
pnpm install -g vercel

# Login
vercel login

# Deploy
vercel
```

## Environment-Specific Configuration

### Development

- Use `.env.local` for local overrides (gitignored)
- Database: Local PostgreSQL or Neon development branch
- Clerk: Test mode keys

### Staging

- Use Vercel preview deployments
- Database: Neon staging branch
- Clerk: Test mode keys
- Enable debug logging

### Production

- Use Vercel production deployment
- Database: Neon production branch
- Clerk: Live mode keys
- Enable error tracking (Sentry)
- Enable analytics (PostHog)

## Troubleshooting

### Prisma Client Issues

If you see "Prisma Client not found" errors:

```bash
pnpm db:generate
```

### Build Errors

Clear Next.js cache:

```bash
rm -rf .next
pnpm build
```

### Database Connection Issues

1. Check your DATABASE_URL is correct
2. Ensure your IP is whitelisted in Neon
3. Verify SSL mode is set correctly

### Clerk Authentication Issues

1. Verify API keys are correct
2. Check middleware configuration in `src/middleware.ts`
3. Ensure public routes are properly configured

## Next Steps

- Review the [PRD](../prd/PRODUCT_REQUIREMENTS_DOCUMENT.md)
- Explore the [API documentation](../api/)
- Set up UI components with `pnpx shadcn-ui@latest add`
- Configure Meilisearch for search functionality
- Set up monitoring with Sentry

## Getting Help

- Check the [README](../../README.md)
- Open an issue on GitHub
- Join our Discord community
