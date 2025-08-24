# Docker Setup for MiniMinds

This guide will help you run the MiniMinds application using Docker.

## Prerequisites

- Docker Desktop installed on your machine
- Git (to clone the repository)

## Quick Start

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <your-repository-url>
   cd miniminds
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file and fill in your actual values:
   - Clerk authentication keys
   - Gemini AI API key
   - Cloudinary credentials

3. **Build and run the application**:
   ```bash
   docker-compose up --build
   ```

4. **Access the application**:
   - Frontend: <http://localhost:3000>
   - Backend API: <http://localhost:4000>
   - Database: localhost:5432

## Services

### Frontend (React + Vite)
- **Port**: 3000
- **Built with**: Multi-stage Docker build using Nginx for production
- **Access**: http://localhost:3000

### Backend (Node.js + Express)
- **Port**: 4000
- **Database**: PostgreSQL with Prisma ORM
- **API Endpoint**: <http://localhost:4000/api>

### Database (PostgreSQL)
- **Port**: 5432
- **Database Name**: mini_minds
- **Credentials**: postgres/postgres (for development)

## Docker Commands

### Start all services:
```bash
docker-compose up
```

### Start services in background:
```bash
docker-compose up -d
```

### Rebuild services:
```bash
docker-compose up --build
```

### Stop all services:
```bash
docker-compose down
```

### View logs:
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db
```

### Execute commands in containers:
```bash
# Backend shell
docker-compose exec backend sh

# Run Prisma commands
docker-compose exec backend npx prisma migrate dev
docker-compose exec backend npx prisma studio
```

## Development Mode

For development with hot reload, you can run services individually:

### Backend (with file watching):
```bash
cd backend
npm install
npm run dev
```

### Frontend (with Vite dev server):
```bash
cd frontend
npm install
npm run dev
```

### Database only:
```bash
docker-compose up db
```

## Environment Variables

Make sure to set these environment variables in your `.env` file:

### Required for Backend:
- `DATABASE_URL`: Already configured for Docker
- `CLERK_SECRET_KEY`: Your Clerk secret key
- `GEMINI_API_KEY`: Your Google Gemini API key
- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Your Cloudinary API key
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret

### Required for Frontend:
- `VITE_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key
- `VITE_API_URL`: Backend API URL (default: http://localhost:5000/api)

## Database Management

The PostgreSQL database data is persisted in a Docker volume. To reset the database:

```bash
# Stop all services
docker-compose down

# Remove the volume (WARNING: This will delete all data)
docker volume rm miniminds_postgres_data

# Start services again
docker-compose up
```

## Troubleshooting

### Port conflicts:
If you get port conflict errors, make sure ports 3000, 5000, and 5432 are not being used by other applications.

### Permission issues:
On Linux/Mac, you might need to adjust file permissions:
```bash
sudo chown -R $USER:$USER .
```

### Database connection issues:
- Ensure the database service is running: `docker-compose ps`
- Check database logs: `docker-compose logs db`
- Verify environment variables are set correctly

### Frontend build issues:
- Clear Docker cache: `docker system prune -a`
- Rebuild without cache: `docker-compose build --no-cache frontend`

## Production Deployment

For production deployment, make sure to:

1. Use secure database credentials
2. Set `NODE_ENV=production`
3. Configure proper CORS settings
4. Use HTTPS in production
5. Set up proper logging and monitoring

## File Structure

```
miniminds/
├── docker-compose.yml          # Multi-service orchestration
├── .env.example               # Environment variables template
├── .env                       # Your environment variables (not in git)
├── backend/
│   ├── Dockerfile            # Backend container configuration
│   ├── .dockerignore         # Files to exclude from Docker build
│   └── src/                  # Backend source code
├── frontend/
│   ├── Dockerfile            # Frontend container configuration
│   ├── nginx.conf            # Nginx configuration for production
│   ├── .dockerignore         # Files to exclude from Docker build
│   └── src/                  # Frontend source code
└── README.Docker.md          # This file
```
