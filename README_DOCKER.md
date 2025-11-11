# 🚀 Quick Start with Docker

Get Chatty running with PostgreSQL in Docker in under 2 minutes!

## Prerequisites

- ✅ Docker Desktop installed and running

## Start Everything

### Windows
```bash
docker-start.bat
```

### Linux/Mac
```bash
chmod +x docker-start.sh
./docker-start.sh
```

Or manually:
```bash
docker-compose up -d
```

## Access Your Application

- 🌐 **Client (Dev)**: http://localhost:3001
- 🔌 **API**: http://localhost:5000
- 🗄️ **PostgreSQL**: localhost:5433
  - Database: `ChattyDb`
  - Username: `postgres`
  - Password: `admin`

## Stop Everything

```bash
docker-compose down
```

## View Logs

```bash
docker-compose logs -f
```

---

📖 **For detailed documentation, see [DOCKER_SETUP.md](./DOCKER_SETUP.md)**

