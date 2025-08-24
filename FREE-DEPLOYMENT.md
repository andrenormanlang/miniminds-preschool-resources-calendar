# 🚀 Free Deployment Guide for MiniMinds with Clerk

## Overview
This guide shows you how to deploy your MiniMinds app with Clerk authentication for **completely free** using Render.com's provided subdomains.

## ✅ What You Get for Free
- ✅ Render.com free tier (750 hours/month)
- ✅ Clerk free tier (10,000 monthly active users)
- ✅ Free subdomain: `your-app.onrender.com`
- ✅ PostgreSQL database (free tier)
- ✅ SSL certificates (automatic)

## � Critical: Clerk Publishable Key Setup

### **⚠️ The Main Issue with Clerk on Free Deployments**

The Clerk publishable key is **domain-specific**. This means:

1. **Development key** (pk_test_...) works only on localhost
2. **Production key** requires a verified domain OR a specific Render setup

### **✅ Solutions for Free Deployment:**

#### Option 1: Use Development Keys (Simplest)
Clerk allows you to use development keys on any domain during development:

1. **In Clerk Dashboard:**
   - Go to "API Keys"
   - Copy your **development** publishable key (starts with `pk_test_`)
   - This key works on ANY domain (including Render subdomains)

2. **Set Environment Variables:**
   ```bash
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_development_key_here
   CLERK_SECRET_KEY=sk_test_your_development_secret_here
   ```

#### Option 2: Add Render Domain to Clerk (Recommended)
1. **In Clerk Dashboard, go to "Domains"**
2. **Click "Add Domain"**
3. **Add your Render frontend URL:** `miniminds-frontend.onrender.com`
4. **Clerk will generate a production key for this domain**
5. **Use the production keys in your deployment**

#### Option 3: Use Clerk's Allowlist Feature
1. **In Clerk Dashboard, go to "Domains"**
2. **Under "Development," add:** `*.onrender.com`
3. **This allows your development keys to work on any Render subdomain**

### 1. Clerk Dashboard Configuration

1. **Login to your Clerk Dashboard** (https://clerk.com)
2. **Go to your project settings**
3. **Navigate to "Domains"**
4. **Add your Render URLs:**
   - Frontend: `https://miniminds-frontend.onrender.com`
   - Backend: `https://miniminds-backend.onrender.com`

### 2. Environment Variables Setup

**Backend Environment Variables** (in Render dashboard):
```bash
NODE_ENV=production
PORT=4000
FRONTEND_URL=https://miniminds-frontend.onrender.com
DATABASE_URL=[Render will provide this]
DIRECT_URL=[Same as DATABASE_URL]
CLERK_SECRET_KEY=[From Clerk Dashboard]
CLERK_PUBLISHABLE_KEY=[From Clerk Dashboard]
CLERK_WEBHOOK_SECRET=[From Clerk Dashboard - Optional]
CLOUDINARY_CLOUD_NAME=[Your Cloudinary account]
CLOUDINARY_API_KEY=[Your Cloudinary account]
CLOUDINARY_API_SECRET=[Your Cloudinary account]
GEMINI_API_KEY=[From Google AI Studio]
```

**Frontend Environment Variables** (in Render dashboard):
```bash
VITE_API_URL=https://miniminds-backend.onrender.com
VITE_CLERK_PUBLISHABLE_KEY=[From Clerk Dashboard]
```

### 3. Clerk Webhook Configuration (Optional but Recommended)

1. **In Clerk Dashboard, go to "Webhooks"**
2. **Add endpoint:** `https://miniminds-backend.onrender.com/api/webhooks/clerk`
3. **Select events:** `user.created`, `user.updated`, `user.deleted`
4. **Copy the webhook secret** and add it to your backend env vars

### 4. Database Setup

Your app uses PostgreSQL. Render provides a free PostgreSQL database:
1. **In your Render dashboard, create a PostgreSQL database**
2. **Copy the connection string**
3. **Use it for both `DATABASE_URL` and `DIRECT_URL`**

### 5. Deploy to Render

1. **Connect your GitHub repository to Render**
2. **Use the provided `render.yaml` blueprint**
3. **Deploy both services:**
   - Backend: Web Service (Docker)
   - Frontend: Web Service (Docker)
   - Database: PostgreSQL

### 6. Post-Deployment Steps

1. **Run database migrations:**
   ```bash
   # This happens automatically in your Docker build
   npx prisma migrate deploy
   npx prisma generate
   ```

2. **Create your first admin user:**
   - Sign up through your deployed frontend
   - Use the backend script to promote yourself to admin

3. **Test authentication:**
   - Sign up/Sign in should work
   - Check that user roles sync properly

## 🎯 Alternative Free Options

### Option 1: Netlify + Railway
- **Frontend:** Netlify (free)
- **Backend + Database:** Railway (free tier)
- **Pros:** Faster builds, better CDN
- **Cons:** Railway has usage limits

### Option 2: Vercel + PlanetScale
- **Frontend:** Vercel (free)
- **Backend:** Vercel (serverless functions)
- **Database:** PlanetScale (free tier)
- **Pros:** Excellent performance
- **Cons:** Requires refactoring to serverless

### Option 3: Render + Neon
- **Full Stack:** Render (free)
- **Database:** Neon PostgreSQL (free)
- **Pros:** Better database performance
- **Cons:** Multiple providers to manage

## 🔍 Troubleshooting

### Common Issues:

**1. Clerk Authentication Fails:**
- Check that your domain is added in Clerk dashboard
- Verify environment variables are set correctly
- Ensure HTTPS is used (not HTTP)

**2. CORS Errors:**
- Your backend already includes the correct CORS configuration
- Make sure frontend URL matches exactly

**3. Database Connection Issues:**
- Check DATABASE_URL format
- Ensure database is in the same region as your app

**4. Build Failures:**
- Check Docker build logs
- Verify all environment variables are set
- Ensure your package.json scripts are correct

## 💡 Pro Tips

1. **Monitor Usage:** Keep an eye on Render's free tier limits (750 hours/month)
2. **Optimize Images:** Use Cloudinary's transformations to reduce bandwidth
3. **Enable Caching:** The app already includes proper caching headers
4. **Use Environment Variables:** Never hardcode URLs or keys

## 🚀 Ready to Deploy?

1. **Push your code to GitHub**
2. **Connect to Render**
3. **Set environment variables**
4. **Deploy!**

Your app will be available at:
- Frontend: `https://miniminds-frontend.onrender.com`
- Backend: `https://miniminds-backend.onrender.com`

## 🆘 Need Help?

- Check Render's documentation
- Review Clerk's deployment guide
- Check the application logs in Render dashboard
- Ensure all environment variables match exactly

**Happy deploying! 🎉**
