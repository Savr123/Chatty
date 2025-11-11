# Docker Setup for Chatty

This guide explains how to run the Chatty application with Docker-based PostgreSQL.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose V2 (included with Docker Desktop)

## Quick Start

### Option 1: Using the Batch Script (Windows)

```bash
docker-start.bat
```

### Option 2: Manual Docker Compose

```bash
# Start all services
docker-compose up -d

# Or start services individually
docker-compose up -d postgres  # Start database first
docker-compose up -d api       # Start API
docker-compose up -d client-dev # Start React client (dev mode)
```

## Architecture

The Docker setup includes:

1. **PostgreSQL Database** (`postgres` service)
   - Image: `postgres:15-alpine`
   - Port: `5433:5432` (host:container)
   - Database: `ChattyDb`
   - Credentials: `postgres/admin`
   - Volume: `postgres_data` for data persistence

2. **.NET API** (`api` service)
   - Built from `api/Chatty.Api/dockerfile`
   - Port: `5000:80`
   - Connects to PostgreSQL via internal Docker network
   - Auto-waits for database to be healthy

3. **React Client - Development** (`client-dev` service)
   - Hot-reload enabled
   - Port: `3001:3000`
   - Volume-mounted for live code changes

4. **React Client - Production** (`client` service)
   - Optimized build
   - Port: `3000:80`

## Connection Strings

### From Host Machine (localhost)
```
Host=localhost;PORT=5433;Database=ChattyDb;Username=postgres;Password=admin;
```

### From Docker Containers (internal network)
```
Host=postgres;Port=5432;Database=ChattyDb;Username=postgres;Password=admin;
```

## Useful Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f postgres
docker-compose logs -f client-dev
```

### Stop Services
```bash
# Stop all
docker-compose down

# Stop and remove volumes (deletes database data!)
docker-compose down -v
```

### Restart Services
```bash
# Restart specific service
docker-compose restart api
docker-compose restart postgres

# Restart all
docker-compose restart
```

### Rebuild After Code Changes
```bash
# Rebuild API
docker-compose build api
docker-compose up -d api

# Rebuild client
docker-compose build client-dev
docker-compose up -d client-dev
```

### Database Access

#### Using psql from Docker
```bash
docker exec -it chatty-postgres psql -U postgres -d ChattyDb
```

#### Using pgAdmin or other tools
- Host: `localhost`
- Port: `5433`
- Database: `ChattyDb`
- Username: `postgres`
- Password: `admin`

## Environment Configuration

### .env.example
Copy `.env.example` to `.env` and customize if needed:

```bash
cp .env.example .env
```

Default values:
- `POSTGRES_DB=ChattyDb`
- `POSTGRES_USER=postgres`
- `POSTGRES_PASSWORD=admin`
- `POSTGRES_PORT=5433`

## Network

All services run on a custom bridge network called `chatty-network`:
- Allows services to communicate using service names (e.g., `postgres`, `api`)
- Isolated from other Docker networks
- DNS resolution built-in

## Data Persistence

Database data is stored in a Docker volume named `postgres_data`:
- Survives container restarts
- Survives `docker-compose down`
- Only deleted with `docker-compose down -v`

## Troubleshooting

### Port Already in Use
If port 5433, 5000, or 3001 is already in use:

1. Edit `docker-compose.yml` and change the port mapping:
   ```yaml
   ports:
     - "NEW_PORT:5432"  # Change left side only
   ```

2. Update connection string in `appsettings.json` if changing PostgreSQL port

### Database Connection Failed
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Check PostgreSQL logs
docker-compose logs postgres

# Verify health
docker inspect chatty-postgres | grep Health
```

### API Cannot Connect to Database
```bash
# Ensure services are on same network
docker network inspect chatty-network

# Check environment variables
docker exec chatty-api env | grep ConnectionStrings
```

### Fresh Start
```bash
# Stop everything, remove containers and volumes
docker-compose down -v

# Rebuild and start
docker-compose up -d --build
```

## Development Workflow

### Local Development with Docker PostgreSQL Only

If you want to run API and Client locally but use Docker for PostgreSQL only:

```bash
# Start only PostgreSQL
docker-compose up -d postgres

# Run API locally (uses appsettings.json connection string)
cd api/Chatty.Api
dotnet run

# Run Client locally
cd client
npm start
```

### Switching Between Local and Docker Database

**For Local PostgreSQL:**
- Use connection string in `appsettings.json`: `Host=localhost;PORT=5433`

**For Docker PostgreSQL:**
- The API container automatically uses: `Host=postgres;Port=5432`

## Production Deployment

For production, use the production client service:

```bash
docker-compose up -d postgres api client
```

Consider:
1. Using secrets management instead of plain-text passwords
2. Setting up proper SSL/TLS certificates
3. Using a reverse proxy (nginx) in front of services
4. Setting `ASPNETCORE_ENVIRONMENT=Production`
5. Backing up the `postgres_data` volume regularly

## Migration Between Local and Docker

If you have existing data in local PostgreSQL and want to migrate:

### Backup from Local
```bash
pg_dump -h localhost -p 5433 -U postgres -d ChattyDb > backup.sql
```

### Restore to Docker
```bash
docker exec -i chatty-postgres psql -U postgres -d ChattyDb < backup.sql
```

