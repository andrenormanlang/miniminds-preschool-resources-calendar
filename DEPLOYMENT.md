# MiniMinds Production Deployment Guide

## 🐳 Docker Hub Deployment

Your Docker images are built and ready for deployment! Here's what we've accomplished:

### ✅ Completed Setup
- Docker containerization for both frontend and backend
- Production-ready Dockerfiles with multi-stage builds
- Docker Compose orchestration
- Render.com deployment blueprint (`render.yaml`)
- Optimized `.dockerignore` files

### 📦 Docker Images Built
- `andrelang/miniminds-backend:latest` - Express.js API with Bun runtime
- `andrelang/miniminds-frontend:latest` - React/Vite app with Nginx

## 🚀 Docker Hub Setup

### Step 1: Create Repositories
1. Go to [Docker Hub](https://hub.docker.com)
2. Log in to your account
3. Click "Create Repository"
4. Create these two repositories:
   - **Repository name**: `miniminds-backend`
   - **Visibility**: Public
   - Click "Create"
   
   - **Repository name**: `miniminds-frontend` 
   - **Visibility**: Public
   - Click "Create"

### Step 2: Push Images
Once repositories are created, push your images:

```bash
# Push backend image
docker push andrelang/miniminds-backend:latest

# Push frontend image  
docker push andrelang/miniminds-frontend:latest
```

## 🌐 Render.com Deployment

### Step 1: Setup Render Account
1. Go to [Render.com](https://render.com)
2. Sign up or log in
3. Connect your GitHub account

### Step 2: Deploy Using Blueprint
1. Click "New" → "Blueprint"
2. Select "Deploy from Git Repository"
3. Choose your MiniMinds repository
4. Render will automatically detect the `render.yaml` file

### Step 3: Configure Environment Variables

#### Backend Service Variables
```
CLERK_SECRET_KEY=<your_clerk_secret_key>
CLERK_PUBLISHABLE_KEY=<your_clerk_publishable_key>  
CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
GEMINI_API_KEY=<your_gemini_api_key>
```

#### Frontend Service Variables
```
VITE_CLERK_PUBLISHABLE_KEY=<your_clerk_publishable_key>
```

### Step 4: Database Setup
Render will automatically create a PostgreSQL database as specified in the blueprint.

## 🔧 Architecture Overview

### Production Stack
- **Frontend**: React + Vite + Nginx (Static Site)
- **Backend**: Express.js + Bun runtime (Web Service)
- **Database**: PostgreSQL (Managed Database)
- **Authentication**: Clerk
- **File Storage**: Cloudinary
- **AI Integration**: Google Gemini

### Service URLs (after deployment)
- Frontend: `https://miniminds-frontend.onrender.com`
- Backend API: `https://miniminds-backend.onrender.com`
- Database: Managed by Render (internal connection)

## 📋 Deployment Checklist

- [x] Docker configuration complete
- [x] Production Dockerfiles created
- [x] render.yaml blueprint configured
- [x] Docker images built locally
- [ ] Docker Hub repositories created
- [ ] Images pushed to Docker Hub
- [ ] Render.com account setup
- [ ] Services deployed via blueprint
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Production testing complete

## 🔍 Troubleshooting

### Docker Hub Push Issues
If you get "access denied" errors:
1. Ensure repositories exist on Docker Hub
2. Verify you're logged in: `docker login`
3. Check repository names match exactly

### Render Deployment Issues
1. Check build logs in Render dashboard
2. Verify environment variables are set
3. Ensure Docker images are publicly accessible
4. Check that all required services are running

## 🌟 Next Steps

1. **Create Docker Hub repositories** (as instructed above)
2. **Push your images** to Docker Hub
3. **Deploy to Render.com** using the blueprint
4. **Configure environment variables** in Render dashboard
5. **Test your production deployment**

Your application is now ready for production deployment! 🎉
