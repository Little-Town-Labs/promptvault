# ✅ Week 1, Day 1 - Setup Checklist

**Goal**: Get development environment ready
**Time**: 1-2 hours

---

## 🎯 Current Status

- [x] Project structure created
- [x] Configuration files ready
- [x] `.env` file created (needs credentials)
- [ ] Dependencies installed
- [ ] Database connected
- [ ] Dev server running

---

## 📋 Tasks To Complete

### 1️⃣ Set Up Clerk (15 min)

**Go to**: [clerk.com](https://clerk.com)

**Actions**:
- [ ] Sign up for Clerk account
- [ ] Create new application named "Prompt Vault"
- [ ] Enable authentication methods (Email, Google, GitHub)
- [ ] Enable Organizations feature
- [ ] Configure paths:
  - Sign-in: `/sign-in`
  - Sign-up: `/sign-up`
  - After sign-in: `/dashboard`
- [ ] Copy API keys (2 keys):
  - Publishable key: `pk_test_...`
  - Secret key: `sk_test_...`

**Save keys to**: `.env` file

---

### 2️⃣ Set Up Neon Database (10 min)

**Go to**: [neon.tech](https://neon.tech)

**Actions**:
- [ ] Sign up for Neon account
- [ ] Create new project named "prompt-vault"
- [ ] Choose region closest to you
- [ ] Copy connection string
- [ ] Verify it ends with `?sslmode=require`

**Save to**: `.env` file as `DATABASE_URL`

---

### 3️⃣ Configure .env File (5 min)

**File location**: `/mnt/f/promptvault/.env`

**Edit and add**:
```env
# Clerk keys (from step 1)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY
CLERK_SECRET_KEY=sk_test_YOUR_KEY

# Database URL (from step 2)
DATABASE_URL=postgresql://user:pass@host.neon.tech/db?sslmode=require
```

**Checklist**:
- [ ] Clerk keys added
- [ ] Database URL added
- [ ] No extra spaces or quotes
- [ ] File saved

---

### 4️⃣ Install Dependencies (5 min)

**Commands to run**:
```bash
cd /mnt/f/promptvault
pnpm install
```

**Expected result**: `node_modules/` folder created

**Checklist**:
- [ ] pnpm installed globally (`npm install -g pnpm` if needed)
- [ ] Dependencies installed successfully
- [ ] No error messages

---

### 5️⃣ Setup Database (5 min)

**Commands to run**:
```bash
# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push
```

**Expected result**: "Your database is now in sync with your schema"

**Checklist**:
- [ ] Prisma client generated
- [ ] Schema pushed successfully
- [ ] No connection errors

---

### 6️⃣ Start Dev Server (2 min)

**Command to run**:
```bash
pnpm dev
```

**Expected result**:
```
▲ Next.js 14.2.0
- Local: http://localhost:3000
✓ Ready in 2.1s
```

**Checklist**:
- [ ] Server started successfully
- [ ] No error messages
- [ ] Can access http://localhost:3000

---

### 7️⃣ Test Authentication (10 min)

**Open**: http://localhost:3000

**Actions**:
- [ ] Landing page loads
- [ ] Click "Get Started" or "Sign Up"
- [ ] See Clerk sign-up form
- [ ] Create test account (email or OAuth)
- [ ] Successfully redirected after sign-up
- [ ] Can sign out
- [ ] Can sign in again

---

## ✅ Completion Checklist

By end of Day 1, you should have:

- [x] ✅ Clerk account created
- [x] ✅ Neon database created
- [x] ✅ `.env` file configured
- [ ] ✅ Dependencies installed
- [ ] ✅ Database tables created
- [ ] ✅ Dev server running
- [ ] ✅ Authentication working
- [ ] ✅ Can create test account

---

## 🐛 Common Issues

### "Invalid Clerk keys"
→ Check `.env` file, restart server

### "Can't connect to database"
→ Verify DATABASE_URL has `?sslmode=require`

### "Module not found"
→ Run `pnpm install` again

### "Prisma Client not found"
→ Run `pnpm db:generate`

### Port 3000 in use
→ Run: `lsof -ti:3000 | xargs kill -9`

---

## 📚 Documentation

- **Full Setup Guide**: `docs/setup/WEEK1_DAY1_SETUP.md`
- **Credentials Template**: `docs/setup/CREDENTIALS_TEMPLATE.md`
- **Quick Start**: `QUICK_START.md`

---

## 🎉 Success!

When all items are checked, you're ready for **Day 2**!

**Next**: Install shadcn/ui components (Week 1, Day 2)

---

## 💾 Screenshot Checklist

Take screenshots of:
- [ ] Clerk dashboard (organizations enabled)
- [ ] Neon dashboard (database created)
- [ ] Terminal (dev server running)
- [ ] Browser (landing page working)
- [ ] Browser (Clerk sign-up form)
- [ ] Browser (authenticated state)

---

## 🆘 Need Help?

1. Review `docs/setup/WEEK1_DAY1_SETUP.md`
2. Check troubleshooting section
3. Verify all credentials are correct
4. Try restarting dev server

---

**Current Time Investment**: 0 hours
**Estimated Time**: 1-2 hours
**Status**: Ready to begin! 🚀
