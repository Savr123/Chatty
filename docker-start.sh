#!/bin/bash

echo "Starting Chatty with Docker PostgreSQL..."
echo ""

# Check if .env file exists, if not copy from example
if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
fi

echo "Starting Docker containers..."
docker-compose up -d postgres

echo "Waiting for PostgreSQL to be ready..."
sleep 10

echo "Starting API and Client..."
docker-compose up -d api client-dev

echo ""
echo "========================================"
echo "Chatty is starting!"
echo "========================================"
echo ""
echo "PostgreSQL: localhost:5433"
echo "API:        http://localhost:5000"
echo "Client Dev: http://localhost:3001"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop:      docker-compose down"
echo "========================================"

