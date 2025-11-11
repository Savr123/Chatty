# Changes Summary - Docker PostgreSQL Migration

This document summarizes the changes made to migrate from local PostgreSQL to Docker-based PostgreSQL.

## Files Created

### 1. `docker-compose.yml` (Root)
Main Docker Compose configuration with:
- **PostgreSQL service**: Official PostgreSQL 15 Alpine image
  - Port: 5433 (host) → 5432 (container)
  - Health checks enabled
  - Persistent volume for data
- **API service**: .NET 8 backend
  - Port: 5000
  - Waits for PostgreSQL to be healthy
  - Environment-based connection string
- **Client services**: React frontend (dev & prod)
  - Dev port: 3001 (with hot reload)
  - Prod port: 3000

### 2. `docker-compose.override.yml`
Development overrides for local customization

### 3. `docker-start.bat` / `docker-start.sh`
Quick start scripts for Windows and Linux/Mac

### 4. `.dockerignore` (Root & API)
Optimizes Docker builds by excluding unnecessary files

### 5. `api/Chatty.Api/appsettings.Docker.json`
Docker-specific configuration with internal service name connection string

### 6. `.env.example`
Template for environment variables

### 7. `DOCKER_SETUP.md`
Comprehensive Docker documentation

### 8. `README_DOCKER.md`
Quick start guide

## Files Modified

### 1. `api/Chatty.Api/dockerfile`
**Changed:**
- Updated from .NET 6.0 to .NET 8.0
  ```diff
  - FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
  + FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
  
  - FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
  + FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
  ```

### 2. `api/Chatty.Api/appsettings.json`
**Added:**
- Docker connection string reference
  ```json
  "PostgreSQLConnectionStringDocker": "Host=postgres;Port=5432;Database=ChattyDb;Username=postgres;Password=admin;"
  ```

### 3. `api/Chatty.Api/Program.cs`
**Changed:**
- Updated CORS policy to include production client port
  ```diff
  .WithOrigins(
  +   "http://localhost:3000",  // Production client
      "http://localhost:3001",  // Development client
      "https://localhost:3001"
  );
  ```

## Architecture Changes

### Before (Local PostgreSQL)
```
┌─────────────┐
│   Client    │ :3001
│  (React)    │
└─────┬───────┘
      │
      ↓
┌─────────────┐
│     API     │ :5000
│  (.NET 8)   │
└─────┬───────┘
      │
      ↓
┌─────────────┐
│ PostgreSQL  │ :5433 (local install)
│   (Local)   │
└─────────────┘
```

### After (Docker PostgreSQL)
```
         ┌────────────────────────────────┐
         │    chatty-network (Docker)     │
         │                                │
         │  ┌─────────────┐              │
         │  │ PostgreSQL  │ :5432        │
         │  │  (Docker)   │              │
         │  └─────┬───────┘              │
         │        │                       │
         │        ↓                       │
         │  ┌─────────────┐              │
Host ←───┼──│     API     │ :80 ←─────── ┼─→ :5000
         │  │  (Docker)   │              │
         │  └─────────────┘              │
         │                                │
         │  ┌─────────────┐              │
Host ←───┼──│   Client    │ :3000/80 ←── ┼─→ :3001 (dev)
         │  │  (Docker)   │              │     :3000 (prod)
         │  └─────────────┘              │
         │                                │
         └────────────────────────────────┘
              │
Host ←────────┘ :5433 (PostgreSQL exposed)
```

## Connection Strings

### Local Development (using Docker PostgreSQL only)
```
Host=localhost;PORT=5433;Database=ChattyDb;Username=postgres;Password=admin;
```
- API runs locally via `dotnet run`
- Connects to PostgreSQL in Docker via exposed port

### Full Docker Stack
```
Host=postgres;Port=5432;Database=ChattyDb;Username=postgres;Password=admin;
```
- API runs in Docker
- Uses Docker internal networking
- Service name "postgres" resolves via Docker DNS

## Network Configuration

### Docker Network: `chatty-network`
- Type: Bridge network
- Services can communicate using service names
- DNS resolution built-in
- Isolated from host network (except exposed ports)

### Port Mappings
| Service    | Container Port | Host Port | Protocol |
|------------|---------------|-----------|----------|
| PostgreSQL | 5432          | 5433      | TCP      |
| API        | 80            | 5000      | HTTP     |
| Client Dev | 3000          | 3001      | HTTP     |
| Client Prod| 80            | 3000      | HTTP     |

## Volume Management

### PostgreSQL Data Volume
- Name: `postgres_data`
- Type: Named volume (managed by Docker)
- Path in container: `/var/lib/postgresql/data/pgdata`
- Persistence: Survives container restarts and `docker-compose down`
- Deletion: Only removed with `docker-compose down -v`

## Environment Variables

### PostgreSQL Container
- `POSTGRES_DB=ChattyDb`
- `POSTGRES_USER=postgres`
- `POSTGRES_PASSWORD=admin`
- `PGDATA=/var/lib/postgresql/data/pgdata`

### API Container
- `ASPNETCORE_ENVIRONMENT=Development`
- `ConnectionStrings__PostgreSQLConnectionString=Host=postgres;Port=5432;...`
- `ASPNETCORE_URLS=http://+:80`

### Client Container
- `CHOKIDAR_USEPOLLING=true` (for hot reload in Docker)
- `WATCHPACK_POLLING=true`
- `REACT_APP_API_URL=http://localhost:5000`

## Migration Path

### Option 1: Fresh Start (No Data Migration)
```bash
docker-compose up -d
```
Database will be created automatically via EF Core's `Database.EnsureCreated()`

### Option 2: Migrate Existing Data
1. Backup from local PostgreSQL:
   ```bash
   pg_dump -h localhost -p 5433 -U postgres -d ChattyDb > backup.sql
   ```

2. Start Docker PostgreSQL:
   ```bash
   docker-compose up -d postgres
   ```

3. Restore to Docker:
   ```bash
   docker exec -i chatty-postgres psql -U postgres -d ChattyDb < backup.sql
   ```

## Development Workflows

### Workflow 1: Full Docker Stack
Best for: Production-like environment, testing deployments
```bash
docker-compose up -d
```
All services run in Docker

### Workflow 2: Docker DB + Local Dev
Best for: Active development with IDE debugging
```bash
# Start only database
docker-compose up -d postgres

# Run API locally
cd api/Chatty.Api
dotnet run

# Run client locally
cd client
npm start
```

### Workflow 3: Hybrid (Docker DB + API, Local Client)
Best for: Frontend development
```bash
# Start database and API in Docker
docker-compose up -d postgres api

# Run client locally with hot reload
cd client
npm start
```

## Health Checks

PostgreSQL health check:
```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U postgres -d ChattyDb"]
  interval: 10s
  timeout: 5s
  retries: 5
```

The API service waits for PostgreSQL to pass health checks before starting:
```yaml
depends_on:
  postgres:
    condition: service_healthy
```

## Security Considerations

### Current Setup (Development)
- ⚠️ Default credentials (postgres/admin)
- ⚠️ Exposed port 5433
- ⚠️ Connection strings in appsettings.json

### Production Recommendations
1. Use Docker secrets or environment variables for credentials
2. Don't expose PostgreSQL port to host
3. Use strong passwords
4. Enable SSL/TLS for PostgreSQL connections
5. Use connection string encryption
6. Implement network policies
7. Regular security updates of base images

## Troubleshooting Tips

### Check Service Status
```bash
docker-compose ps
```

### View Logs
```bash
docker-compose logs -f [service-name]
```

### Database Connection Test
```bash
docker exec -it chatty-postgres psql -U postgres -d ChattyDb -c "SELECT version();"
```

### Network Inspection
```bash
docker network inspect chatty-network
```

### Restart Individual Service
```bash
docker-compose restart api
```

### Complete Reset
```bash
docker-compose down -v  # Removes volumes!
docker-compose up -d --build
```

## Performance Considerations

### Volume Performance (Windows/Mac)
- Named volumes are faster than bind mounts
- PostgreSQL uses named volume `postgres_data` for optimal performance

### Build Performance
- `.dockerignore` files optimize build context
- Multi-stage builds reduce final image size
- Layer caching speeds up rebuilds

## Next Steps

1. ✅ PostgreSQL is now containerized
2. ⏭️ Consider containerizing development tools (pgAdmin)
3. ⏭️ Add database backup automation
4. ⏭️ Set up CI/CD with Docker
5. ⏭️ Implement production-grade security
6. ⏭️ Add monitoring and logging (Prometheus, Grafana)
7. ⏭️ Consider Kubernetes for orchestration

## Rollback Plan

To revert to local PostgreSQL:

1. Stop Docker services:
   ```bash
   docker-compose down
   ```

2. In `api/Chatty.Api/Program.cs`, connection string is already pointing to localhost:5433

3. Start local PostgreSQL service

4. Restore data if needed:
   ```bash
   psql -h localhost -p 5433 -U postgres -d ChattyDb < backup.sql
   ```

## Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/)
- [ASP.NET Core Docker](https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/docker/)

