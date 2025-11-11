.PHONY: help start stop restart logs build clean db-shell db-backup db-restore status

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
NC := \033[0m # No Color

help: ## Show this help message
	@echo "$(BLUE)Chatty Docker Commands$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}'

start: ## Start all services
	@echo "$(BLUE)Starting Chatty services...$(NC)"
	@docker-compose up -d postgres
	@echo "$(YELLOW)Waiting for PostgreSQL to be ready...$(NC)"
	@sleep 10
	@docker-compose up -d api client-dev
	@echo "$(GREEN)✓ Services started!$(NC)"
	@echo ""
	@make status

start-prod: ## Start with production client
	@echo "$(BLUE)Starting Chatty (production mode)...$(NC)"
	@docker-compose up -d postgres
	@sleep 10
	@docker-compose up -d api client
	@echo "$(GREEN)✓ Services started!$(NC)"
	@make status

stop: ## Stop all services
	@echo "$(BLUE)Stopping Chatty services...$(NC)"
	@docker-compose down
	@echo "$(GREEN)✓ Services stopped$(NC)"

restart: ## Restart all services
	@echo "$(BLUE)Restarting Chatty services...$(NC)"
	@docker-compose restart
	@echo "$(GREEN)✓ Services restarted$(NC)"

restart-api: ## Restart only API service
	@docker-compose restart api

restart-client: ## Restart only client service
	@docker-compose restart client-dev

logs: ## Show logs for all services
	@docker-compose logs -f

logs-api: ## Show API logs
	@docker-compose logs -f api

logs-db: ## Show PostgreSQL logs
	@docker-compose logs -f postgres

logs-client: ## Show client logs
	@docker-compose logs -f client-dev

build: ## Rebuild all services
	@echo "$(BLUE)Building services...$(NC)"
	@docker-compose build
	@echo "$(GREEN)✓ Build complete$(NC)"

build-api: ## Rebuild API service
	@docker-compose build api

build-client: ## Rebuild client service
	@docker-compose build client-dev

clean: ## Stop services and remove volumes (WARNING: deletes database!)
	@echo "$(YELLOW)WARNING: This will delete all database data!$(NC)"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker-compose down -v; \
		echo "$(GREEN)✓ Cleaned$(NC)"; \
	else \
		echo "$(YELLOW)Cancelled$(NC)"; \
	fi

db-shell: ## Open PostgreSQL shell
	@docker exec -it chatty-postgres psql -U postgres -d ChattyDb

db-backup: ## Backup database to backup.sql
	@echo "$(BLUE)Backing up database...$(NC)"
	@docker exec chatty-postgres pg_dump -U postgres ChattyDb > backup.sql
	@echo "$(GREEN)✓ Database backed up to backup.sql$(NC)"

db-restore: ## Restore database from backup.sql
	@echo "$(BLUE)Restoring database...$(NC)"
	@docker exec -i chatty-postgres psql -U postgres -d ChattyDb < backup.sql
	@echo "$(GREEN)✓ Database restored$(NC)"

status: ## Show service status and URLs
	@echo "$(BLUE)Service Status:$(NC)"
	@docker-compose ps
	@echo ""
	@echo "$(BLUE)Access URLs:$(NC)"
	@echo "  $(GREEN)PostgreSQL:$(NC) localhost:5433"
	@echo "  $(GREEN)API:$(NC)        http://localhost:5000"
	@echo "  $(GREEN)Client Dev:$(NC) http://localhost:3001"
	@echo "  $(GREEN)Client:$(NC)     http://localhost:3000"

dev-db-only: ## Start only PostgreSQL (for local development)
	@echo "$(BLUE)Starting PostgreSQL only...$(NC)"
	@docker-compose up -d postgres
	@echo "$(GREEN)✓ PostgreSQL started on localhost:5433$(NC)"
	@echo "$(YELLOW)Run your API and Client locally$(NC)"

ps: ## Show running containers
	@docker-compose ps

exec-api: ## Open shell in API container
	@docker exec -it chatty-api /bin/bash

exec-db: ## Open shell in PostgreSQL container
	@docker exec -it chatty-postgres /bin/bash

health: ## Check health status of services
	@echo "$(BLUE)Checking service health...$(NC)"
	@docker inspect chatty-postgres | grep -A 10 Health || echo "PostgreSQL container not running"
	@echo ""
	@docker exec chatty-postgres pg_isready -U postgres && echo "$(GREEN)✓ PostgreSQL is ready$(NC)" || echo "$(YELLOW)⚠ PostgreSQL is not ready$(NC)"

update: ## Pull latest images and rebuild
	@echo "$(BLUE)Updating services...$(NC)"
	@docker-compose pull
	@docker-compose build --pull
	@echo "$(GREEN)✓ Updated$(NC)"

