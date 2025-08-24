#!/bin/bash

# MiniMinds Deployment Script for Render.com
echo "🚀 Deploying MiniMinds to Render.com..."

# Create .dockerignore files for optimized builds
echo "📦 Creating optimized Docker builds..."

# Backend .dockerignore
cat > backend/.dockerignore << EOF
node_modules
npm-debug.log
.nyc_output
coverage
.env.local
.env.development.local
.env.test.local
.env.production.local
.git
.gitignore
README.md
.eslintrc.json
.prettierrc
*.md
docker-compose.yml
Dockerfile
.dockerignore
EOF

# Frontend .dockerignore
cat > frontend/.dockerignore << EOF
node_modules
npm-debug.log
.nyc_output
coverage
.env.local
.env.development.local
.env.test.local
.env.production.local
.git
.gitignore
README.md
.eslintrc.json
.prettierrc
*.md
docker-compose.yml
Dockerfile
.dockerignore
EOF

echo "✅ Docker ignore files created"
echo ""

echo "🐳 Docker Hub Setup Instructions:"
echo "================================="
echo "1. Go to https://hub.docker.com"
echo "2. Log in to your Docker Hub account"
echo "3. Click 'Create Repository'"
echo "4. Create these repositories:"
echo "   - Repository name: miniminds-backend"
echo "   - Visibility: Public"
echo "   - Click 'Create'"
echo ""
echo "   - Repository name: miniminds-frontend"
echo "   - Visibility: Public"
echo "   - Click 'Create'"
echo ""

echo "🔧 Render.com Deployment Instructions:"
echo "======================================"
echo "1. Go to https://render.com and sign up/login"
echo "2. Connect your GitHub account"
echo "3. Create a new 'Blueprint' service"
echo "4. Select 'Deploy from Git Repository'"
echo "5. Choose your MiniMinds repository"
echo "6. Render will detect the render.yaml file automatically"
echo ""

echo "🔑 Environment Variables Setup:"
echo "==============================="
echo "You'll need to add these environment variables in Render.com:"
echo ""
echo "Backend Service Environment Variables:"
echo "- CLERK_SECRET_KEY=<your_clerk_secret_key>"
echo "- CLERK_PUBLISHABLE_KEY=<your_clerk_publishable_key>"
echo "- CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>"
echo "- CLOUDINARY_API_KEY=<your_cloudinary_api_key>"
echo "- CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>"
echo "- GEMINI_API_KEY=<your_gemini_api_key>"
echo ""
echo "Frontend Service Environment Variables:"
echo "- VITE_CLERK_PUBLISHABLE_KEY=<your_clerk_publishable_key>"
echo ""

echo "📋 Deployment Checklist:"
echo "========================"
echo "✅ Docker configuration complete"
echo "✅ render.yaml blueprint created"
echo "✅ Docker ignore files created"
echo "🔲 Create Docker Hub repositories"
echo "🔲 Push images to Docker Hub"
echo "🔲 Deploy to Render.com"
echo "🔲 Configure environment variables"
echo "🔲 Test production deployment"
echo ""

echo "🎯 Next Steps:"
echo "=============="
echo "1. Create the Docker Hub repositories as instructed above"
echo "2. Run: docker push andrelang/miniminds-backend:latest"
echo "3. Run: docker push andrelang/miniminds-frontend:latest"
echo "4. Deploy to Render.com using the blueprint"
echo "5. Configure your environment variables"
echo ""

echo "🌟 Deployment script complete!"
