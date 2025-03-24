@echo off
rem Check if Docker is installed
where docker >nul 2>&1
if errorlevel 1 (
    echo Error: Docker is not installed or not in PATH
    echo Please install Docker from https://docs.docker.com/get-docker/
    pause
    exit /b 1
)

rem Check for docker-compose or docker compose plugin
set "DOCKER_COMPOSE_CMD="
where docker-compose >nul 2>&1
if not errorlevel 1 (
    set "DOCKER_COMPOSE_CMD=docker-compose"
) else (
    docker compose version >nul 2>&1
    if not errorlevel 1 (
        set "DOCKER_COMPOSE_CMD=docker compose"
    ) else (
        echo Error: Neither docker-compose nor docker compose plugin is available
        echo Please install Docker Compose from https://docs.docker.com/compose/install/
        pause
        exit /b 1
    )
)

echo Using Docker Compose command: %DOCKER_COMPOSE_CMD%

rem Change to the API directory
cd API

rem Check if .env file exists in the API directory
if not exist .env (
    echo Error: .env file is missing in the API directory
    echo Please create a .env file with the required API configuration in the API directory
    pause
    exit /b 1
)

rem Build and start the containers
echo Building and starting Docker containers...
%DOCKER_COMPOSE_CMD% up --build -d

rem Wait for services to start
echo Waiting for services to start...
timeout /t 10 >nul

rem Check if services are running
%DOCKER_COMPOSE_CMD% ps | findstr /C:"Up" >nul
if %errorlevel%==0 (
    echo Site available at: http://localhost:3000
    echo.
    echo Press Enter to continue...
    pause
) else (
    echo Error: Services failed to start properly
    %DOCKER_COMPOSE_CMD% logs
    pause
    exit /b 1
)
