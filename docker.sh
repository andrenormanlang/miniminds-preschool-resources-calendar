#!/bin/bash

# MiniMinds Docker Helper Script

case "$1" in
    "start")
        echo "Starting MiniMinds application..."
        docker-compose up -d
        echo "Application started! Frontend: http://localhost:3000, Backend: http://localhost:4000"
        ;;
    "stop")
        echo "Stopping MiniMinds application..."
        docker-compose down
        ;;
    "build")
        echo "Building MiniMinds application..."
        docker-compose build
        ;;
    "rebuild")
        echo "Rebuilding and starting MiniMinds application..."
        docker-compose up --build -d
        ;;
    "logs")
        if [ -z "$2" ]; then
            docker-compose logs -f
        else
            docker-compose logs -f $2
        fi
        ;;
    "shell")
        if [ -z "$2" ]; then
            echo "Please specify a service: backend, frontend, or db"
        else
            docker-compose exec $2 sh
        fi
        ;;
    "reset-db")
        echo "Resetting database..."
        docker-compose down
        docker volume rm miniminds_postgres_data 2>/dev/null
        docker-compose up -d db
        echo "Database reset complete!"
        ;;
    "migrate")
        echo "Running database migrations..."
        docker-compose exec backend bunx prisma migrate deploy
        ;;
    "studio")
        echo "Opening Prisma Studio..."
        docker-compose exec backend bunx prisma studio
        ;;
    *)
        echo "MiniMinds Docker Helper"
        echo "Usage: $0 {start|stop|build|rebuild|logs|shell|reset-db|migrate|studio}"
        echo ""
        echo "Commands:"
        echo "  start      - Start all services in background"
        echo "  stop       - Stop all services"
        echo "  build      - Build all services"
        echo "  rebuild    - Rebuild and start all services"
        echo "  logs       - Show logs (add service name for specific service)"
        echo "  shell      - Open shell in service (specify: backend, frontend, or db)"
        echo "  reset-db   - Reset database (WARNING: deletes all data)"
        echo "  migrate    - Run database migrations"
        echo "  studio     - Open Prisma Studio"
        echo ""
        echo "Examples:"
        echo "  $0 start"
        echo "  $0 logs backend"
        echo "  $0 shell backend"
        ;;
esac
