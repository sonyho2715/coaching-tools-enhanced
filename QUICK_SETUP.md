# Quick Setup Checklist ✅

Complete these 6 steps to fully configure your coaching tools:

---

## ☐ Step 1: Create Vercel Postgres Database (5 min)

**URL**: Already opened in your browser → Vercel Storage Dashboard

1. Click the **"Create Database"** button
2. Select **"Postgres"**
3. Database name: `coaching-db`
4. Region: `sfo1` (or closest to you)
5. Click **"Create"**
6. Wait for provisioning (~2 minutes)

✅ **Done when**: You see your database in the list

---

## ☐ Step 2: Initialize Database Tables (2 min)

**URL**: https://vercel.com/sony-hos-projects/coaching-tools-enhanced/stores/coaching-db

1. Click on your new **"coaching-db"** database
2. Click the **"Query"** tab at the top
3. Open the file `schema.sql` from your project folder
4. Copy ALL the contents (Cmd+A, Cmd+C)
5. Paste into the query editor
6. Click **"Run Query"**

✅ **Done when**: You see "Query executed successfully" and 4 tables created

**Tables created**:
- users
- clients
- assessments
- sessions

---

## ☐ Step 3: Sign Up for Clerk (3 min)

**URL**: Already opened in your browser → Clerk Dashboard

1. Sign up with your email (or use Google)
2. Verify your email
3. Click **"Add Application"**
4. Application name: `Coaching Tools`
5. Select authentication methods:
   - ✅ Email
   - ✅ Password
   - ✅ Google (optional)
6. Click **"Create Application"**

✅ **Done when**: You see your new app dashboard

---

## ☐ Step 4: Get Clerk API Key (1 min)

**URL**: https://dashboard.clerk.com

1. In your Coaching Tools app dashboard
2. Click **"API Keys"** in the left sidebar
3. Find **"Publishable key"** section
4. Click the **copy icon** next to the key (starts with `pk_test_`)
5. **Save this key** - you'll need it in the next step!

Example: `pk_test_Y29hY2hpbmctdG9vbHMuY2xlcmsuYWNjb3VudHMuZGV2JA`

✅ **Done when**: You have the key copied

---

## ☐ Step 5: Add Environment Variable to Vercel (2 min)

**URL**: https://vercel.com/sony-hos-projects/coaching-tools-enhanced/settings/environment-variables

1. Click **"Add New"** button
2. **Key**: `VITE_CLERK_PUBLISHABLE_KEY`
3. **Value**: Paste your Clerk publishable key from Step 4
4. **Environments**: Select all three:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. Click **"Save"**

✅ **Done when**: You see the variable in the list (value is hidden)

---

## ☐ Step 6: Configure Clerk Domain (1 min)

**URL**: https://dashboard.clerk.com

1. In Clerk dashboard, click **"Domains"** in sidebar
2. Click **"Add Domain"**
3. Enter: `coaching-tools-enhanced.vercel.app`
4. Click **"Add Domain"**

✅ **Done when**: Domain shows as verified

---

## 🚀 Final Step: Redeploy

Run this command in your terminal:

```bash
cd "/Users/sonyho/Downloads/Coaching Tools Enhanced"
vercel --prod
```

This will redeploy your app with all the new configurations!

---

## ✅ Verify Everything Works

After deployment completes:

### Test 1: Analytics
1. Visit https://coaching-tools-enhanced.vercel.app
2. Go to Vercel Dashboard → Analytics
3. You should see page views within 5 minutes

### Test 2: Authentication
1. Click **"Đăng Ký"** (Sign Up) in your app sidebar
2. Create an account with your email
3. You should be signed in and see your profile

### Test 3: Database
1. Create a test client in your app
2. Go to Vercel Dashboard → Storage → coaching-db → Data
3. Check the `clients` table
4. You should see your test client!

---

## 📊 Estimated Total Time: 15-20 minutes

## ❓ Troubleshooting

**Can't find Vercel Storage?**
- Make sure you're viewing the correct project
- Storage tab is between "Settings" and "Deployments"

**Clerk key not working?**
- Make sure you copied the **Publishable Key**, not Secret Key
- Check that it starts with `pk_test_` or `pk_live_`

**Environment variable not taking effect?**
- You must redeploy after adding variables
- Run: `vercel --prod`

---

## 🎉 Success!

When all checkboxes are complete, your app will have:
- ✅ Real-time analytics
- ✅ User authentication
- ✅ Persistent database storage
- ✅ Professional deployment

**Your app**: https://coaching-tools-enhanced.vercel.app
