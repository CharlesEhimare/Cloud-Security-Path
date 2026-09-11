# DevOps Portfolio Project 1 - Makefile
# Common commands for development and deployment

.PHONY: help setup build start stop restart logs clean test lint deploy

# Default target
help:
	@echo "DevOps Portfolio Project 1 - Available Commands:"
	@echo ""
	@echo "Development:"
	@echo "  setup     - Set up the development environment"
	@echo "  build     - Build all Docker images"
	@echo "  start     - Start all services"
	@echo "  stop      - Stop all services"
	@echo "  restart   - Restart all services"
	@echo "  logs      - View logs from all services"
	@echo "  clean     - Clean up containers and volumes"
	@echo ""
	@echo "Testing:"
	@echo "  test      - Run all tests"
	@echo "  test-backend - Run backend tests"
	@echo "  test-frontend - Run frontend tests"
	@echo "  lint      - Run linting on all code"
	@echo ""
	@echo "Deployment:"
	@echo "  deploy-staging - Deploy to staging environment"
	@echo "  deploy-prod    - Deploy to production environment"
	@echo ""
	@echo "Database:"
	@echo "  db-migrate - Run database migrations"
	@echo "  db-seed    - Seed database with sample data"
	@echo "  db-reset   - Reset database (WARNING: destroys data)"

# Development commands
setup:
	@echo "🚀 Setting up development environment..."
	@chmod +x scripts/*.sh
	@./scripts/setup.sh

build:
	@echo "🐳 Building Docker images..."
	docker-compose build --no-cache

start:
	@echo "🚀 Starting services..."
	docker-compose up -d

stop:
	@echo "🛑 Stopping services..."
	docker-compose down

restart:
	@echo "🔄 Restarting services..."
	docker-compose restart

logs:
	@echo "📋 Viewing logs..."
	docker-compose logs -f

clean:
	@echo "🧹 Cleaning up..."
	docker-compose down -v --remove-orphans
	docker system prune -f

# Testing commands
test:
	@echo "🧪 Running all tests..."
	@$(MAKE) test-backend
	@$(MAKE) test-frontend

test-backend:
	@echo "🧪 Running backend tests..."
	cd backend && npm test

test-frontend:
	@echo "🧪 Running frontend tests..."
	cd frontend && npm test

lint:
	@echo "🔍 Running linters..."
	cd backend && npm run lint
	cd frontend && npm run lint

# Deployment commands
deploy-staging:
	@echo "🎭 Deploying to staging..."
	@chmod +x scripts/deploy.sh
	./scripts/deploy.sh staging

deploy-prod:
	@echo "🏭 Deploying to production..."
	@chmod +x scripts/deploy.sh
	./scripts/deploy.sh production

# Database commands
db-migrate:
	@echo "🗄️ Running database migrations..."
	docker-compose exec backend npm run migrate

db-seed:
	@echo "🌱 Seeding database..."
	docker-compose exec backend npm run seed

db-reset:
	@echo "⚠️ Resetting database (WARNING: This will destroy all data)..."
	@read -p "Are you sure? (y/N): " confirm && [ "$$confirm" = "y" ]
	docker-compose down -v
	docker-compose up -d database
	sleep 10
	@$(MAKE) db-migrate
	@$(MAKE) db-seed

# Health checks
health:
	@echo "🔍 Checking service health..."
	@echo "Database:"
	@docker-compose exec database pg_isready -U postgres -d devops_portfolio || echo "❌ Database not ready"
	@echo "Backend:"
	@curl -f http://localhost:5000/api/health || echo "❌ Backend not ready"
	@echo "Frontend:"
	@curl -f http://localhost:3000 || echo "❌ Frontend not ready"

# Development helpers
dev-backend:
	@echo "🔧 Starting backend in development mode..."
	cd backend && npm run dev

dev-frontend:
	@echo "🔧 Starting frontend in development mode..."
	cd frontend && npm start

# Security
security-scan:
	@echo "🔒 Running security scans..."
	docker run --rm -v $(PWD):/app aquasec/trivy fs /app

# Monitoring
monitor:
	@echo "📊 Opening monitoring dashboard..."
	@echo "Backend health: http://localhost:5000/api/health"
	@echo "Frontend: http://localhost:3000"
	@echo "Database: localhost:5432"
