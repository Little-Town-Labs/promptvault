#!/bin/bash
# Week 1, Day 1 - Command Reference
# Run these commands in order after setting up .env file

echo "🚀 Week 1, Day 1 - Setup Commands"
echo "=================================="
echo ""

# Navigate to project
echo "📁 Step 1: Navigate to project directory"
echo "Command: cd /mnt/f/promptvault"
cd /mnt/f/promptvault
echo "✅ Current directory: $(pwd)"
echo ""

# Check if .env exists
echo "🔍 Step 2: Check .env file"
if [ -f .env ]; then
    echo "✅ .env file exists"
else
    echo "❌ .env file not found!"
    echo "Run: cp .env.example .env"
    echo "Then edit .env with your credentials"
    exit 1
fi
echo ""

# Install pnpm if needed
echo "📦 Step 3: Check pnpm installation"
if command -v pnpm &> /dev/null; then
    echo "✅ pnpm is installed: $(pnpm --version)"
else
    echo "❌ pnpm not found. Installing..."
    npm install -g pnpm
fi
echo ""

# Install dependencies
echo "📥 Step 4: Install dependencies"
echo "Command: pnpm install"
echo "This may take 2-3 minutes..."
# pnpm install
echo ""

# Generate Prisma client
echo "🔧 Step 5: Generate Prisma Client"
echo "Command: pnpm db:generate"
# pnpm db:generate
echo ""

# Push database schema
echo "🗄️ Step 6: Push schema to database"
echo "Command: pnpm db:push"
# pnpm db:push
echo ""

# Start dev server
echo "🚀 Step 7: Start development server"
echo "Command: pnpm dev"
echo ""
echo "After running 'pnpm dev', open http://localhost:3000"
echo ""

echo "=================================="
echo "✅ Setup commands ready to run!"
echo "=================================="
echo ""
echo "📝 Manual steps required:"
echo "1. Set up Clerk account → Copy API keys"
echo "2. Set up Neon database → Copy connection string"
echo "3. Edit .env file with your credentials"
echo "4. Run: pnpm install"
echo "5. Run: pnpm db:generate"
echo "6. Run: pnpm db:push"
echo "7. Run: pnpm dev"
echo ""
echo "📚 Full instructions: docs/setup/WEEK1_DAY1_SETUP.md"
echo "🔐 Credentials template: docs/setup/CREDENTIALS_TEMPLATE.md"
