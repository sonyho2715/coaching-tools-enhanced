# Railway Deployment Guide

This guide will help you deploy the Coaching Assessment Tool to Railway.

## Prerequisites

1. A Railway account (sign up at [railway.app](https://railway.app))
2. Railway CLI installed (optional, but recommended)
3. Your GitHub repository connected to Railway

## Step 1: Create a New Project on Railway

1. Go to [railway.app](https://railway.app) and log in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository (`coaching-tools-enhanced`)
5. Railway will automatically detect the configuration from `railway.toml`

## Step 2: Add PostgreSQL Database

1. In your Railway project, click "+ New"
2. Select "Database" → "Add PostgreSQL"
3. Railway will automatically provision a PostgreSQL database
4. The `DATABASE_URL` environment variable will be automatically added to your service

## Step 3: Configure Environment Variables

Go to your service's "Variables" tab and add the following environment variables:

### Required Environment Variables

```bash
# Database (automatically set by Railway when you add PostgreSQL)
DATABASE_URL=postgresql://...

# Node Environment
NODE_ENV=production

# Supabase Configuration (optional if using Railway Postgres)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Clerk Authentication (optional)
VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_key_here
CLERK_SECRET_KEY=sk_live_your_key_here

# Stripe Configuration (optional)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key_here
STRIPE_SECRET_KEY=sk_live_your_secret_key_here

# Port (automatically set by Railway)
PORT=3000
```

## Step 4: Initialize Database Schema

After your first deployment, you need to initialize the database schema.

### Option 1: Using Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link

# Run the schema initialization
railway run psql $DATABASE_URL < schema.sql
```

### Option 2: Using Railway Dashboard

1. Go to your PostgreSQL database in Railway dashboard
2. Click on "Query" tab
3. Copy the contents of `schema.sql` and paste it into the query editor
4. Click "Run Query"

## Step 5: Deploy

Railway will automatically deploy your application when you push to your connected GitHub branch.

### Manual Deployment via CLI

```bash
# Deploy using Railway CLI
railway up
```

### Deployment Process

Railway will:
1. Run `npm run railway:build` (installs dependencies and builds the frontend)
2. Run `npm start` to start the Express.js server
3. Your application will be available at `https://your-app-name.up.railway.app`

## Step 6: Custom Domain (Optional)

1. In your Railway project, go to "Settings"
2. Click "Generate Domain" for a free Railway domain
3. Or add your custom domain in the "Domains" section

## Architecture Overview

The application is deployed as a single Node.js service that:
- Serves the static React frontend from the `dist` directory
- Provides API endpoints at `/api/*` for database operations
- Connects to Railway PostgreSQL database

## Health Check

Once deployed, you can check if your application is running:

```bash
curl https://your-app-name.up.railway.app/health
```

You should receive a response like:
```json
{
  "status": "ok",
  "timestamp": "2025-10-23T..."
}
```

## Troubleshooting

### Build Failures

- Check the build logs in Railway dashboard
- Ensure all dependencies are listed in `package.json`
- Verify that `railway:build` script runs successfully locally

### Database Connection Issues

- Verify that `DATABASE_URL` is set correctly
- Check that the PostgreSQL service is running
- Ensure the database schema has been initialized

### Application Not Starting

- Check the deployment logs in Railway dashboard
- Verify that the `PORT` environment variable is being used
- Ensure `NODE_ENV=production` is set

### API Endpoints Not Working

- Check that the server is serving the API routes
- Verify CORS settings if calling from a different domain
- Check database connection and query logs

## Monitoring

Railway provides built-in monitoring:
- View logs in real-time from the Railway dashboard
- Monitor resource usage (CPU, Memory, Network)
- Set up alerts for downtime or errors

## Scaling

Railway automatically scales based on your plan:
- Hobby Plan: Suitable for small applications and testing
- Pro Plan: Better performance and higher resource limits

## Cost Estimation

Railway pricing:
- **Hobby Plan**: $5/month + usage-based pricing
- **PostgreSQL**: Included in usage-based pricing
- Estimate: ~$5-10/month for small to medium traffic

## Support

For issues specific to Railway:
- Railway Documentation: [docs.railway.app](https://docs.railway.app)
- Railway Discord: [discord.gg/railway](https://discord.gg/railway)
- Railway Support: support@railway.app

For application-specific issues:
- Check the repository issues
- Review application logs in Railway dashboard
