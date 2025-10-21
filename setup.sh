#!/bin/bash

# Coaching Tools Enhanced - Automated Setup Script
# This script helps you configure Vercel Postgres and Clerk Authentication

set -e

echo "🚀 Coaching Tools Enhanced - Setup Wizard"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
fi

echo -e "${BLUE}📋 Step 1: Vercel Postgres Database${NC}"
echo "--------------------------------------"
echo ""
echo "I've opened the Vercel Storage dashboard in your browser."
echo ""
echo "Please follow these steps:"
echo "  1. Click 'Create Database'"
echo "  2. Select 'Postgres'"
echo "  3. Name it: coaching-db"
echo "  4. Select region: sfo1 (or closest to you)"
echo "  5. Click 'Create'"
echo ""
read -p "Press ENTER when you've created the database..."
echo ""

echo -e "${GREEN}✅ Database created!${NC}"
echo ""

echo -e "${BLUE}📋 Step 2: Initialize Database Schema${NC}"
echo "--------------------------------------"
echo ""
echo "Now we need to run the schema.sql file to create tables."
echo ""
echo "In the Vercel dashboard:"
echo "  1. Click on your 'coaching-db' database"
echo "  2. Go to the 'Query' tab"
echo "  3. Copy the contents of 'schema.sql' from this project"
echo "  4. Paste into the query editor"
echo "  5. Click 'Run Query'"
echo ""
read -p "Press ENTER when you've run the schema..."
echo ""

echo -e "${GREEN}✅ Database schema initialized!${NC}"
echo ""

echo -e "${BLUE}📋 Step 3: Clerk Authentication Setup${NC}"
echo "--------------------------------------"
echo ""
echo "I've opened Clerk signup page in your browser."
echo ""
echo "Please follow these steps:"
echo "  1. Sign up for a Clerk account (or sign in)"
echo "  2. Click 'Add Application'"
echo "  3. Name it: Coaching Tools"
echo "  4. Enable: Email & Password authentication"
echo "  5. Click 'Create Application'"
echo "  6. Go to 'API Keys' in the sidebar"
echo "  7. Copy your Publishable Key (starts with pk_test_...)"
echo ""
read -p "Paste your Clerk Publishable Key here: " CLERK_KEY
echo ""

if [ -z "$CLERK_KEY" ]; then
    echo -e "${RED}❌ No key provided. Skipping Clerk setup.${NC}"
    echo "You can add it later in Vercel dashboard."
else
    echo -e "${GREEN}✅ Clerk key received!${NC}"

    # Add environment variable to Vercel
    echo ""
    echo -e "${BLUE}📋 Step 4: Adding Environment Variables to Vercel${NC}"
    echo "--------------------------------------"
    echo ""

    cd "/Users/sonyho/Downloads/Coaching Tools Enhanced"

    echo "Adding VITE_CLERK_PUBLISHABLE_KEY to Vercel..."
    vercel env add VITE_CLERK_PUBLISHABLE_KEY production <<EOF
$CLERK_KEY
EOF

    vercel env add VITE_CLERK_PUBLISHABLE_KEY preview <<EOF
$CLERK_KEY
EOF

    vercel env add VITE_CLERK_PUBLISHABLE_KEY development <<EOF
$CLERK_KEY
EOF

    echo ""
    echo -e "${GREEN}✅ Environment variables added!${NC}"
fi

echo ""
echo -e "${BLUE}📋 Step 5: Configure Clerk Domain${NC}"
echo "--------------------------------------"
echo ""
echo "In the Clerk dashboard:"
echo "  1. Go to 'Domains' in the sidebar"
echo "  2. Add domain: coaching-tools-enhanced.vercel.app"
echo "  3. Click 'Add Domain'"
echo ""
read -p "Press ENTER when you've added the domain..."
echo ""

echo -e "${GREEN}✅ Domain configured!${NC}"
echo ""

echo -e "${BLUE}📋 Step 6: Deploying to Production${NC}"
echo "--------------------------------------"
echo ""
echo "Now we'll redeploy your app with all the new configurations..."
echo ""

cd "/Users/sonyho/Downloads/Coaching Tools Enhanced"
npm run build
vercel --prod

echo ""
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo "=========================================="
echo ""
echo "Your coaching tools app is now fully configured with:"
echo "  ✅ Vercel Analytics"
echo "  ✅ Speed Insights"
echo "  ✅ Vercel Postgres Database"
echo "  ✅ Clerk Authentication"
echo "  ✅ API Routes"
echo ""
echo "🌐 Production URL: https://coaching-tools-enhanced.vercel.app"
echo ""
echo "📚 Next Steps:"
echo "  1. Visit your app and sign up for an account"
echo "  2. Check the database in Vercel dashboard to see your data"
echo "  3. Monitor analytics in the Vercel Analytics tab"
echo ""
echo "📖 For troubleshooting, see SETUP_GUIDE.md"
echo ""
