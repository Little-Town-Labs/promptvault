# GitHub Repository Setup Guide

This guide will help you set up PromptVault on GitHub and configure it for development and deployment.

## Initial Setup

### 1. Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right → "New repository"
3. Repository name: `promptvault` (or your preferred name)
4. Description: `A modern AI prompt management and organization platform`
5. Make it **Public** or **Private** (your choice)
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

### 2. Initialize Local Git Repository

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: PromptVault application"

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/promptvault.git

# Push to GitHub
git push -u origin main
```

### 3. Configure Repository Settings

#### GitHub Pages (Optional)
1. Go to repository Settings → Pages
2. Source: "Deploy from a branch"
3. Branch: `main` → `/docs` (if you want to host documentation)
4. Save

#### Branch Protection (Recommended)
1. Go to Settings → Branches
2. Add rule for `main` branch:
   - Require pull request reviews before merging
   - Require status checks to pass before merging
   - Include administrators
   - Restrict pushes that create matching branches

### 4. Environment Variables Setup

Create environment variables in GitHub repository settings (Settings → Secrets and variables → Actions):

```
# Required for deployment
DATABASE_URL=postgresql://username:password@host:port/database
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Optional for additional features
OPENAI_API_KEY=your_openai_api_key (if adding AI features)
STRIPE_PUBLIC_KEY=your_stripe_public_key (if adding payments)
STRIPE_SECRET_KEY=your_stripe_secret_key (if adding payments)
```

## Development Workflow

### Branching Strategy

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push branch
git push origin feature/new-feature

# Create Pull Request on GitHub
# After review, merge to main
```

### Pull Request Template

Create `.github/PULL_REQUEST_TEMPLATE.md` in your repository:

```markdown
## Description
Brief description of the changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Tested on mobile/desktop
- [ ] Tested with different browsers

## Screenshots (if applicable)
Add screenshots of the changes.

## Checklist
- [ ] Code follows project conventions
- [ ] Tests updated/added
- [ ] Documentation updated
- [ ] Ready for review
```

### GitHub Actions (CI/CD)

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'pnpm'

    - name: Install dependencies
      run: pnpm install

    - name: Run linting
      run: pnpm lint

    - name: Run tests
      run: pnpm test

    - name: Build
      run: pnpm build
```

Create `.github/workflows/deploy.yml` for Vercel deployment:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        working-directory: ./
```

### Issue Templates

Create issue templates in `.github/ISSUE_TEMPLATE/`:

#### Bug Report Template (`bug_report.md`):
```markdown
---
name: Bug Report
about: Create a report to help us improve
title: "[BUG] "
labels: bug
assignees: ''

---

**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
- OS: [e.g. Windows 10]
- Browser [e.g. chrome, safari]
- Version [e.g. 1.0.0]

**Additional context**
Add any other context about the problem here.
```

#### Feature Request Template (`feature_request.md`):
```markdown
---
name: Feature Request
about: Suggest an idea for this project
title: "[FEATURE] "
labels: enhancement
assignees: ''

---

**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is.

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.
```

## Contributing Guidelines

Create `CONTRIBUTING.md`:

```markdown
# Contributing to PromptVault

Thank you for your interest in contributing to PromptVault!

## How to Contribute

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Run tests: `pnpm test`
5. Run linting: `pnpm lint`
6. Commit your changes: `git commit -m 'Add some feature'`
7. Push to the branch: `git push origin feature/your-feature-name`
8. Open a pull request

## Code Style

- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## Commit Message Format

```
[type]: [description]

[optional body]

[optional footer]
```

Types:
- feat: new feature
- fix: bug fix
- docs: documentation
- style: formatting
- refactor: code restructure
- test: tests
- chore: maintenance
```

## Repository Structure

```
├── src/                    # Source code
│   ├── app/               # Next.js app router
│   ├── components/        # React components
│   ├── lib/              # Utility libraries
│   └── types/            # TypeScript types
├── prisma/               # Database schema
├── public/              # Static assets
├── docs/                # Documentation
└── scripts/            # Build scripts
```

## Next Steps

After setting up the repository:

1. [Deploy to Vercel](DEPLOYMENT_GUIDE.md)
2. Set up monitoring and analytics
3. Create release tags for versioning
4. Set up code coverage reporting
5. Configure automated dependency updates

Happy contributing! 🚀
