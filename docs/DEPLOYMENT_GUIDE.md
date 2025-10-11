# 🚀 Vercel Deployment Guide - Prompt Vault

Complete guide to deploy your Prompt Vault to Vercel.

---

## ✅ Prerequisites

Before deploying, ensure you have:

- [x] Vercel account (free at [vercel.com](https://vercel.com))
- [x] GitHub account with this repo pushed
- [x] Neon PostgreSQL database (already set up)
- [x] Clerk account for authentication (already set up)

---

## 📋 Step-by-Step Deployment

### **Step 1: Push to GitHub**

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Ready for deployment"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/prompt-vault.git
git branch -M main
git push -u origin main
```

### **Step 2: Import to Vercel**

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. **Import Git Repository** → Select your GitHub repo
4. Vercel will auto-detect Next.js

### **Step 3: Configure Environment Variables**

Click **"Environment Variables"** and add these:

#### **Required Variables:**

In Vercel environment variables, enter these **exactly as shown** (values will be different for your project):

| **Name** | **Value** | **Environment** | **Notes** |
|----------|-----------|------------------|-----------|
| `DATABASE_URL` | `postgresql://neondb_owner:npg_xxxx@ep-xxxxxx-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require` | Production, Preview | Your Neon connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx` | Production, Preview | From Clerk Dashboard → API Keys |
| `CLERK_SECRET_KEY` | `sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx` | Production, Preview | From Clerk Dashboard → API Keys |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` | Production, Preview | Keep as-is |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` | Production, Preview | Keep as-is |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | `/dashboard` | Production, Preview | Keep as-is |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | `/dashboard` | Production, Preview | Keep as-is |
| `NEXT_PUBLIC_APP_URL` | `https://your-project.vercel.app` | Production, Preview | Will be your Vercel URL after deployment |

**❗ IMPORTANT:** Enter these as **direct values**, NOT as secret references like `@production-url`. Just paste the actual values.

**⚠️ Note:** After first deployment, update `NEXT_PUBLIC_APP_URL` with your actual Vercel URL (e.g., `https://promptvault-5j8e9x.vercel.app`).

### **Step 4: Configure Build Settings**

Vercel should auto-detect, but verify:

```
Framework Preset: Next.js
Build Command: pnpm build
Output Directory: .next
Install Command: pnpm install
Development Command: pnpm dev
Node.js Version: 20.x
```

### **Step 5: Deploy**

1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. Get your deployment URL: `https://your-project.vercel.app`

---

## 🔧 Post-Deployment Configuration

### **Update Clerk Settings**

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigate to your application
3. Go to **"Domains"** → Add your Vercel domain:
   ```
   https://your-project.vercel.app
   ```
4. Update **"Allowed Redirect URLs"**:
   ```
   https://your-project.vercel.app/dashboard
   https://your-project.vercel.app/*
   ```

### **Update Environment Variables**

Go back to Vercel → Settings → Environment Variables:

1. Update `NEXT_PUBLIC_APP_URL` with your actual URL
2. **Redeploy** for changes to take effect

### **Database Migration**

Your Neon database is already set up, but verify:

```bash
# Run this locally to ensure schema is up to date
pnpm db:push
```

---

## 🎨 Custom Domain (Optional)

### **Add Your Domain:**

1. Vercel Dashboard → **Settings** → **Domains**
2. Add your domain: `promptvault.com`
3. Update DNS records (Vercel provides instructions)
4. Update Clerk allowed domains

### **Update Environment Variables:**

```env
NEXT_PUBLIC_APP_URL=https://promptvault.com
```

Then update Clerk Dashboard with new domain.

---

## 🔄 Continuous Deployment

**Automatic Deployments:**
- Push to `main` branch → Auto-deploy to production
- Create PR → Automatic preview deployment
- Merge PR → Auto-deploy to production

**Preview Deployments:**
Every PR gets its own preview URL:
```
https://prompt-vault-git-feature-branch-username.vercel.app
```

---

## 📊 Monitoring & Analytics

### **Built-in Vercel Analytics:**

1. Go to your project → **Analytics** tab
2. See real-time traffic, performance metrics
3. Monitor API response times

### **Environment-Specific Deployments:**

```
Production:  main branch      → your-project.vercel.app
Preview:     feature branches → auto-generated URLs
Development: local            → localhost:3000
```

---

## 🚨 Troubleshooting

### **Build Fails:**

```bash
# Check build locally first
pnpm build

# If it works locally, check:
# 1. Environment variables in Vercel
# 2. Node.js version (should be 20.x)
# 3. pnpm version in package.json
```

### **Database Connection Issues:**

```
Error: Can't reach database server

Solutions:
1. Check DATABASE_URL in Vercel env vars
2. Ensure Neon database is active
3. Verify connection string has ?sslmode=require
```

### **Clerk Authentication Fails:**

```
Error: Invalid publishable key

Solutions:
1. Verify CLERK keys are correct
2. Check domain is added in Clerk Dashboard
3. Ensure redirect URLs match
```

### **API Routes Timeout:**

```
Error: Function execution timeout

Solutions:
1. Check database queries are optimized
2. Ensure connection pooling is configured
3. Verify Neon database is in same region
```

---

## 🎯 Performance Optimization

### **Enable Edge Runtime (Optional):**

For faster API routes, add to API files:

```typescript
// src/app/api/prompts/route.ts
export const runtime = 'edge' // 'nodejs' (default) | 'edge'
```

**Note:** Prisma currently works best with Node.js runtime.

### **Image Optimization:**

Already configured in `next.config.mjs`:
- Automatic WebP conversion
- Responsive images
- CDN caching

### **Caching Strategy:**

Add to API routes for better performance:

```typescript
export const revalidate = 60 // Revalidate every 60 seconds
```

---

## 💰 Cost Estimation

### **Vercel Free Tier Limits:**
- ✅ 100GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Unlimited preview deployments
- ✅ 1,000 serverless function executions/day
- ✅ 100 GB-hours compute time

### **Expected Usage (Small Team):**
- **Bandwidth:** ~10GB/month (well within free tier)
- **Functions:** ~500/day (well within free tier)
- **Database (Neon):** Free tier sufficient for development
- **Clerk:** Free tier (10,000 MAU)

**Total Monthly Cost:** **$0** (free tier sufficient)

### **Scaling to Pro (if needed):**
- **Vercel Pro:** $20/month (per user)
  - 1TB bandwidth
  - Unlimited team members
  - Advanced analytics
  - Priority support

---

## 🎉 Deployment Checklist

Before going live:

- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] Clerk authentication configured
- [ ] Custom domain added (optional)
- [ ] SSL certificate active (automatic)
- [ ] First deployment successful
- [ ] Test all features in production
- [ ] Update Clerk allowed domains
- [ ] Monitor first few hours

---

## 📚 Useful Commands

```bash
# Deploy from CLI (optional)
npx vercel

# Link project
npx vercel link

# Pull environment variables
npx vercel env pull

# View logs
npx vercel logs

# List deployments
npx vercel ls
```

---

## 🔗 Important Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Deployment Logs:** Your Project → Deployments → Latest
- **Environment Variables:** Your Project → Settings → Environment Variables
- **Domains:** Your Project → Settings → Domains
- **Analytics:** Your Project → Analytics

---

## 🆘 Support

**Vercel Support:**
- Docs: https://vercel.com/docs
- Community: https://github.com/vercel/vercel/discussions
- Status: https://www.vercel-status.com/

**Need Help?**
1. Check Vercel deployment logs
2. Review this guide's troubleshooting section
3. Check Vercel documentation
4. Ask in Vercel Discord/GitHub

---

## ✅ Success!

Once deployed, your Prompt Vault will be live at:

```
https://your-project.vercel.app
```

**Test Everything:**
1. Authentication (sign up/sign in)
2. Create a prompt
3. Create a category
4. Favorite a prompt
5. Search and filter
6. All CRUD operations

**You're done!** 🎉

Your production-ready prompt management platform is now live on Vercel with:
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Automatic scaling
- ✅ Zero-downtime deployments
- ✅ Preview deployments for PRs
- ✅ Built-in analytics

---

**Estimated Deployment Time:** 10-15 minutes total
**Difficulty:** Easy (if following this guide)
**Cost:** $0 (free tier sufficient)
