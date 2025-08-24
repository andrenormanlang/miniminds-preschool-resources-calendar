@echo off

if "%1"=="start" (
    echo Starting MiniMinds application...
    docker-compose up -d
    echo Application started! Frontend: http://localhost:3000, Backend: http://localhost:4000
    goto :eof
)

if "%1"=="stop" (
    echo Stopping MiniMinds application...
    docker-compose down
    goto :eof
)

if "%1"=="build" (
    echo Building MiniMinds application...
    docker-compose build
    goto :eof
)

if "%1"=="rebuild" (
    echo Rebuilding and starting MiniMinds application...
    docker-compose up --build -d
    goto :eof
)

if "%1"=="logs" (
    if "%2"=="" (
        docker-compose logs -f
    ) else (
        docker-compose logs -f %2
    )
    goto :eof
)

if "%1"=="shell" (
    if "%2"=="" (
        echo Please specify a service: backend, frontend, or db
    ) else (
        docker-compose exec %2 sh
    )
    goto :eof
)

if "%1"=="reset-db" (
    echo Resetting database...
    docker-compose down
    docker volume rm miniminds_postgres_data 2>nul
    docker-compose up -d db
    echo Database reset complete!
    goto :eof
)

if "%1"=="migrate" (
    echo Running database migrations...
    docker-compose exec backend bunx prisma migrate deploy
    goto :eof
)

if "%1"=="studio" (
    echo Opening Prisma Studio...
    docker-compose exec backend bunx prisma studio
    goto :eof
)

echo MiniMinds Docker Helper
echo Usage: %0 {start^|stop^|build^|rebuild^|logs^|shell^|reset-db^|migrate^|studio}
echo.
echo Commands:
echo   start      - Start all services in background
echo   stop       - Stop all services
echo   build      - Build all services
echo   rebuild    - Rebuild and start all services
echo   logs       - Show logs (add service name for specific service)
echo   shell      - Open shell in service (specify: backend, frontend, or db)
echo   reset-db   - Reset database (WARNING: deletes all data)
echo   migrate    - Run database migrations
echo   studio     - Open Prisma Studio
echo.
echo Examples:
echo   %0 start
echo   %0 logs backend
echo   %0 shell backend
