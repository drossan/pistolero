# Deployment Guide - Western Pistolero Game

This guide covers deploying Western Pistolero Game to Vercel with Convex backend.

## Prerequisites

- Vercel account (https://vercel.com)
- Convex account (https://convex.dev)
- GitHub repository with the project code

## Overview

The deployment consists of:
1. **Frontend** - React + Vite app deployed to Vercel
2. **Backend** - Convex realtime database

## Part 1: Convex Deployment

### 1.1 Initialize Convex Project

```bash
# Install Convex CLI globally
npm install -g convex-dev

# Login to Convex
npx convex login

# Initialize Convex in your project
npx convex init
```

During initialization:
- Choose "Create a new project"
- Select your team/organization
- The CLI will generate `convex/_generated/` files

### 1.2 Configure Environment Variables

The project already has these environment variables configured in `.env.local`:
```env
CONVEX_DEPLOYMENT_URL=https://western-pistolero-game.convex.cloud
VITE_CONVEX_URL=https://western-pistolero-game.convex.cloud
```

### 1.3 Deploy Convex Backend

```bash
# Deploy your Convex backend
npx convex deploy

# This command:
# - Creates/updates your Convex deployment
# - Deploys all schema, functions, and migrations
# - Returns your CONVEX_DEPLOYMENT_URL
```

### 1.4 Update Environment Variables

After deployment, update your local `.env.local` with the actual deployment URL:
```bash
# Copy the URL from the deploy command output
CONVEX_DEPLOYMENT_URL=<your-deployment-url>
VITE_CONVEX_URL=<your-deployment-url>
```

Add these to your Vercel project (see Part 2).

### 1.5 Verify Deployment

```bash
# Verify your Convex deployment is working
npx convex dev

# Check the dashboard at https://dashboard.convex.dev
```

## Part 2: Vercel Deployment

### 2.1 Install Vercel CLI

```bash
npm install -g vercel
```

### 2.2 Deploy to Vercel

```bash
# Build and deploy to Vercel
vercel

# Or use npm script
npm run build
vercel --prod
```

First deployment:
- Vercel will ask for project configuration
- Set "Root Directory" as `.`
- Set "Build Command" as `npm run build`
- Set "Output Directory" as `dist`
- Set "Install Command" as `npm i`

### 2.3 Configure Environment Variables in Vercel

Add these environment variables in Vercel Dashboard:

1. Go to your project in Vercel Dashboard
2. Navigate to Settings → Environment Variables
3. Add the following variables:

```env
CONVEX_DEPLOYMENT_URL=<your-convex-url>
VITE_CONVEX_URL=<your-convex-url>
```

**Important**: Get the actual URL from:
- Your Convex dashboard: https://dashboard.convex.dev
- Or from `npx convex deploy` output

### 2.4 Redeploy with Environment Variables

```bash
# Redeploy to pick up environment variables
vercel --prod
```

## Part 3: GitHub Integration (Recommended)

### 3.1 Connect GitHub Repository

1. In Vercel Dashboard, click "Import Project"
2. Select your GitHub repository
3. Configure build settings (same as above)
4. Add environment variables

### 3.2 Automatic Deployments

Vercel will automatically deploy:
- On every push to `main` branch
- On every pull request
- When you push git tags

## Part 4: Post-Deployment Verification

### 4.1 Test Your Deployed App

```bash
# Visit your Vercel URL
# Usually: https://your-project-name.vercel.app

# Test the application:
1. ✅ PWA features work offline
2. ✅ Single-player game works
3. ✅ Multiplayer login works
4. ✅ Room creation works
5. ✅ All game phases work correctly
```

### 4.2 Check Convex Dashboard

Visit https://dashboard.convex.dev to verify:
- Your deployment is active
- Functions are deployed
- No errors in logs
- Database tables are created

### 4.3 Monitor Performance

- Vercel Analytics: https://vercel.com/analytics
- Convex Dashboard: https://dashboard.convex.dev

## Part 5: Custom Domain (Optional)

### 5.1 Add Custom Domain in Vercel

1. Go to your project in Vercel Dashboard
2. Navigate to Settings → Domains
3. Add your custom domain
4. Configure DNS according to Vercel instructions

### 5.2 Update Convex CORS Settings

If using a custom domain, update Convex CORS:

```typescript
// convex/http.ts (if you have custom HTTP routes)
export const http = httpRouter()
```

Convex automatically handles CORS for your deployed domain.

## Part 6: Troubleshooting

### Common Issues

#### Issue 1: "Cannot connect to Convex"

**Solution**: Verify `VITE_CONVEX_URL` is set correctly in Vercel environment variables.

#### Issue 2: "CORS errors"

**Solution**: Make sure your Convex deployment URL is correct and properly configured.

#### Issue 3: "Build fails"

**Solution**:
- Clear Vercel cache: `vercel --force`
- Check build logs for specific errors
- Ensure all dependencies are in `package.json`

#### Issue 4: "PWA doesn't work"

**Solution**:
- Ensure service worker is properly registered
- Check that manifest.json is accessible
- Verify site is served over HTTPS

#### Issue 5: "Multiplayer not working"

**Solution**:
- Verify Convex deployment is active
- Check browser console for errors
- Ensure environment variables are set in Vercel

## Part 7: CI/CD Configuration

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## Part 8: Monitoring and Maintenance

### Logs and Analytics

1. **Vercel Logs**: Dashboard → Your Project → Logs
2. **Convex Logs**: https://dashboard.convex.dev → Your Project → Logs
3. **Analytics**: Vercel Dashboard → Analytics

### Regular Maintenance

```bash
# Update dependencies
npm update

# Redeploy Convex (after schema changes)
npx convex deploy

# Redeploy Vercel
vercel --prod
```

## Part 9: Performance Optimization

### Bundle Size Monitoring

Current bundle size: 305 KB

Target: < 350 KB

### Optimization Steps (If Needed)

1. **Code Splitting**: Already partially implemented
2. **Tree Shaking**: Remove unused Tailwind classes
3. **Lazy Loading**: Lazy load animations (confetti, game-over)
4. **Image Optimization**: Use WebP format

### Performance Monitoring

```bash
# Run Lighthouse CI
npm run lighthouse:ci

# Check bundle size
npm run build
# Check the output for bundle sizes
```

## Part 10: Rollback Procedures

### If Deployment Fails

```bash
# Rollback Vercel deployment
vercel rollback

# Rollback Convex deployment
npx convex deploy <previous-version>
```

### Emergency Rollback

```bash
# List recent Vercel deployments
vercel ls

# Rollback to specific deployment
vercel promote <deployment-url>
```

## Quick Reference

### Essential Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm test                 # Run unit tests
npm run test:e2e         # Run E2E tests

# Convex
npx convex dev           # Start Convex dev mode
npx convex deploy        # Deploy Convex backend
npx convex dashboard     # Open Convex dashboard

# Vercel
vercel                   # Deploy to Vercel (preview)
vercel --prod           # Deploy to Vercel (production)
vercel ls               # List deployments
vercel rollback        # Rollback last deployment
```

### Important URLs

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Convex Dashboard**: https://dashboard.convex.dev
- **Your App**: `https://your-project-name.vercel.app`
- **Convex Deployment**: Check your dashboard

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Convex Docs**: https://docs.convex.dev
- **GitHub Issues**: Create an issue in the repository

## Summary

Deployment Steps:
1. ✅ Deploy Convex backend: `npx convex deploy`
2. ✅ Add environment variables to Vercel
3. ✅ Deploy frontend to Vercel: `vercel --prod`
4. ✅ Test the deployed application
5. ✅ Monitor logs and analytics

The app is now live and fully functional with:
- ✅ PWA support with offline capabilities
- ✅ Single-player mode with AI
- ✅ Real-time multiplayer with Convex
- ✅ Authentication (anonymous + GitHub ready)
- ✅ Complete game flow with all phases
- ✅ Leaderboard system
