# Credentials Setup Template

Use this as a checklist to fill in your `.env` file.

---

## 🔐 Step 1: Clerk Setup

### Go to: [https://clerk.com](https://clerk.com)

1. **Sign up / Log in**
2. **Create Application**:
   - Name: Prompt Vault
   - Enable: Email, Google, GitHub
3. **Enable Organizations**:
   - Settings → Organizations → Toggle ON
4. **Configure Paths**:
   - Sign-in: `/sign-in`
   - Sign-up: `/sign-up`
   - After sign-in: `/dashboard`
   - After sign-up: `/dashboard`
5. **Copy API Keys** (API Keys page):
   ```
   Publishable Key: pk_test_________________
   Secret Key: sk_test_________________
   ```

### ✅ Add to .env:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
CLERK_SECRET_KEY=sk_test_YOUR_SECRET_HERE
```

---

## 🗄️ Step 2: Neon Database Setup

### Go to: [https://neon.tech](https://neon.tech)

1. **Sign up / Log in** (use GitHub for quick signup)
2. **Create Project**:
   - Name: prompt-vault
   - Region: (choose closest to you)
   - Postgres: Latest version
3. **Copy Connection String**:
   - Look for "Connection string" on dashboard
   - Should look like: `postgresql://user:pass@host.neon.tech/db?sslmode=require`

### ✅ Add to .env:
```env
DATABASE_URL=postgresql://YOUR_CONNECTION_STRING_HERE
```

**IMPORTANT**: Make sure `?sslmode=require` is at the end!

---

## 📝 Your .env File Should Look Like This:

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Clerk (REQUIRED)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_XXX
CLERK_SECRET_KEY=sk_test_XXX
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Database (REQUIRED)
DATABASE_URL=postgresql://user:pass@host.neon.tech/db?sslmode=require

# Optional (leave blank for now)
BLOB_READ_WRITE_TOKEN=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
MEILISEARCH_HOST=
MEILISEARCH_MASTER_KEY=
```

---

## ✅ Verification Checklist

Before proceeding, verify:

- [ ] Clerk publishable key starts with `pk_test_`
- [ ] Clerk secret key starts with `sk_test_`
- [ ] Database URL starts with `postgresql://`
- [ ] Database URL ends with `?sslmode=require`
- [ ] No extra spaces or quotes around values
- [ ] File is saved as `.env` (not `.env.txt`)

---

## 🚀 Next Steps After Setup

Once your `.env` is configured:

```bash
# 1. Install dependencies
pnpm install

# 2. Generate Prisma client
pnpm db:generate

# 3. Push schema to database
pnpm db:push

# 4. Start dev server
pnpm dev
```

---

## 💾 Save Your Credentials Securely

Store these in a password manager:
- Clerk publishable key
- Clerk secret key
- Clerk dashboard URL
- Neon connection string
- Neon dashboard URL
- Test user email/password

**⚠️ NEVER commit `.env` to git!** (Already in `.gitignore`)

---

## 🆘 Need Help?

### Clerk Issues
- Dashboard: https://dashboard.clerk.com
- Docs: https://clerk.com/docs

### Neon Issues
- Dashboard: https://console.neon.tech
- Docs: https://neon.tech/docs

### Can't Find Keys?
- **Clerk**: Dashboard → Your App → API Keys
- **Neon**: Console → Your Project → Connection Details
