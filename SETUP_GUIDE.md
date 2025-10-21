# Coaching Tools Enhanced - Setup Guide

This guide will walk you through setting up Analytics, Database, Authentication, and deploying your coaching tools application.

## Overview

Your application now includes:
- ✅ **Vercel Analytics** - Track real user metrics
- ✅ **Speed Insights** - Monitor Core Web Vitals
- ✅ **Vercel Postgres** - Persistent database storage
- ✅ **Clerk Authentication** - Secure user authentication
- ✅ **API Routes** - Serverless backend functions

## Prerequisites

- Vercel account (free tier available)
- Clerk account (free tier available)
- Your project already deployed on Vercel

---

## Step 1: Create Vercel Postgres Database

### 1.1 Access Vercel Dashboard

1. Go to https://vercel.com
2. Select your project: `coaching-tools-enhanced`
3. Click on the **Storage** tab

### 1.2 Create Postgres Database

1. Click **Create Database**
2. Select **Postgres**
3. Choose a name: `coaching-db`
4. Select region: closest to your users (e.g., `sfo1` for San Francisco)
5. Click **Create**

### 1.3 Run Database Schema

1. Once created, click **Connect**
2. Go to the **Query** tab
3. Copy the contents of `schema.sql` from your project
4. Paste into the query editor
5. Click **Run Query**

This will create all necessary tables:
- `users` - User accounts
- `clients` - Client profiles
- `assessments` - All assessment data
- `sessions` - Session history

### 1.4 Connect to Your Project

The database connection is automatically configured via environment variables. Vercel sets these automatically:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`

---

## Step 2: Set Up Clerk Authentication

### 2.1 Create Clerk Application

1. Go to https://clerk.com
2. Sign up or log in
3. Click **Add Application**
4. Name it: `Coaching Tools`
5. Enable these authentication methods:
   - ✅ Email & Password
   - ✅ Google (optional)
   - ✅ Facebook (optional)
6. Click **Create Application**

### 2.2 Get Your Publishable Key

1. In Clerk Dashboard, go to **API Keys**
2. Copy your **Publishable Key** (starts with `pk_test_...`)

### 2.3 Add to Vercel Environment Variables

1. Go to Vercel Dashboard → Your Project
2. Click **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name**: `VITE_CLERK_PUBLISHABLE_KEY`
   - **Value**: Your Clerk publishable key (from step 2.2)
   - **Environments**: Select all (Production, Preview, Development)
4. Click **Save**

### 2.4 Configure Clerk Domain

1. In Clerk Dashboard, go to **Domains**
2. Add your Vercel domain: `coaching-tools-enhanced.vercel.app`
3. This allows Clerk to work on your production domain

---

## Step 3: Initialize Database with Your User

After deploying (next step), the first time you sign in with Clerk, you need to add your user to the database.

### 3.1 Get Your User ID

1. Sign in to your app
2. Open browser console (F12)
3. Run: `localStorage.getItem('clerk-user')`
4. Copy your user ID

### 3.2 Add User to Database

1. Go to Vercel Dashboard → Storage → Your Postgres DB
2. Go to **Query** tab
3. Run:
```sql
INSERT INTO users (id, email, name)
VALUES ('your-clerk-user-id', 'your-email@example.com', 'Your Name');
```

---

## Step 4: Deploy to Vercel

### 4.1 Deploy from Local

```bash
# Build the project
npm run build

# Deploy to production
vercel --prod
```

### 4.2 Or Connect GitHub (Recommended)

1. Go to Vercel Dashboard → Your Project
2. Click **Settings** → **Git**
3. Connect your GitHub repository
4. Every push to `main` will auto-deploy

---

## Step 5: Verify Everything Works

### 5.1 Check Analytics

1. Visit your site and navigate through a few pages
2. Go to Vercel Dashboard → Your Project → **Analytics**
3. You should see page views and web vitals

### 5.2 Check Authentication

1. Visit your site
2. Click **Đăng Ký** (Sign Up) in the sidebar
3. Create an account
4. You should see your name and profile picture

### 5.3 Check Database

1. Create a test client in the app
2. Go to Vercel Dashboard → Storage → coaching-db → Data
3. Check the `clients` table - you should see your test client

---

## Environment Variables Summary

Your Vercel project should have these environment variables:

| Variable | Value | Source |
|----------|-------|--------|
| `VITE_CLERK_PUBLISHABLE_KEY` | `pk_test_...` | Clerk Dashboard |
| `POSTGRES_URL` | Auto-set | Vercel Postgres |
| `POSTGRES_PRISMA_URL` | Auto-set | Vercel Postgres |
| `POSTGRES_URL_NON_POOLING` | Auto-set | Vercel Postgres |

---

## API Endpoints

Your app now has these API endpoints:

### Clients API (`/api/clients.js`)
- `GET` - Get all clients for the authenticated user
- `POST` - Create a new client
- `PUT` - Update an existing client
- `DELETE` - Delete a client

### Assessments API (`/api/assessments.js`)
- `GET ?clientId=123` - Get assessment data for a client
- `POST` - Create/update assessment data

### Sessions API (`/api/sessions.js`)
- `GET ?clientId=123` - Get session history for a client
- `POST` - Create a new session record

---

## Database Schema

```
users
├── id (VARCHAR)
├── email (VARCHAR)
├── name (VARCHAR)
└── timestamps

clients
├── id (SERIAL)
├── user_id (FK → users)
├── name, email, phone
└── timestamps

assessments
├── id (SERIAL)
├── client_id (FK → clients)
├── user_id (FK → users)
├── personal_history (JSONB)
├── readiness_answers (JSONB)
├── wheel_scores (JSONB)
├── ... (all assessment data)
└── timestamps

sessions
├── id (SERIAL)
├── client_id (FK → clients)
├── user_id (FK → users)
├── session_date, duration
└── notes, tools_used
```

---

## Troubleshooting

### "Clerk is not defined" Error
- Make sure you've added `VITE_CLERK_PUBLISHABLE_KEY` to Vercel environment variables
- Redeploy your app after adding the variable

### Database Connection Error
- Check that Vercel Postgres is created and connected to your project
- Verify schema.sql was run successfully

### Authentication Not Working
- Verify your domain is added in Clerk Dashboard
- Check that the Clerk publishable key is correct

### Analytics Not Showing
- Analytics data takes a few minutes to appear
- Make sure you're visiting the production URL (not preview)

---

## Demo Mode

The app works in **demo mode** if Clerk is not configured. It will:
- Use localStorage instead of database
- Skip authentication
- Show all features without login

This is perfect for testing locally before setting up production services.

---

## Next Steps

### Recommended Enhancements

1. **Custom Domain**
   ```bash
   vercel domains add yourdomain.com
   ```

2. **Backup Strategy**
   - Set up automated database backups
   - Export client data periodically

3. **Email Notifications**
   - Use Clerk webhooks to send welcome emails
   - Set up session reminders

4. **Advanced Analytics**
   - Add custom events to track specific user actions
   - Set up conversion funnels

---

## Support

- Vercel Docs: https://vercel.com/docs
- Clerk Docs: https://clerk.com/docs
- Postgres Docs: https://vercel.com/docs/storage/vercel-postgres

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│                   User Browser                  │
│  ┌──────────────────────────────────────────┐  │
│  │     React App (Vite)                     │  │
│  │  • Analytics                             │  │
│  │  • Speed Insights                        │  │
│  │  • Clerk Auth (ClerkProvider)           │  │
│  └──────────────────────────────────────────┘  │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│              Vercel Platform                    │
│  ┌──────────────────┐  ┌──────────────────┐    │
│  │  Static Hosting  │  │  API Routes      │    │
│  │  (React App)     │  │  /api/clients    │    │
│  │                  │  │  /api/assessments│    │
│  │                  │  │  /api/sessions   │    │
│  └──────────────────┘  └──────────────────┘    │
│                               │                  │
│                               ▼                  │
│                      ┌──────────────────┐       │
│                      │ Vercel Postgres  │       │
│                      │  • users         │       │
│                      │  • clients       │       │
│                      │  • assessments   │       │
│                      │  • sessions      │       │
│                      └──────────────────┘       │
└─────────────────────────────────────────────────┘
                  ▲
                  │
          ┌───────┴────────┐
          │  Clerk Auth    │
          │  (External)    │
          └────────────────┘
```

---

## Congratulations! 🎉

Your coaching tools app is now fully upgraded with:
- Real-time analytics
- Persistent database storage
- Secure authentication
- Professional deployment

Happy coaching! 🚀
