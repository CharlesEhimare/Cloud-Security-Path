#!/bin/bash

# DevOps Portfolio Project 1 - Setup Script
# This script sets up the development environment

set -e

echo "🚀 Setting up DevOps Portfolio Project 1..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

# Check if Node.js is installed (for local development)
if ! command -v node &> /dev/null; then
    echo "⚠️  Node.js is not installed. You'll need it for local development."
    echo "Visit: https://nodejs.org/"
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "✅ .env file created. Please review and update the values as needed."
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p logs
mkdir -p data/postgres
mkdir -p ssl

# Set proper permissions
echo "🔐 Setting proper permissions..."
chmod +x scripts/*.sh

# Build and start services
echo "🐳 Building and starting Docker containers..."
docker-compose down --remove-orphans
docker-compose build --no-cache
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check if services are running
echo "🔍 Checking service health..."

# Check database
if docker-compose exec -T database pg_isready -U postgres -d devops_portfolio > /dev/null 2>&1; then
    echo "✅ Database is ready"
else
    echo "❌ Database is not ready"
fi

# Check backend
if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "✅ Backend API is ready"
else
    echo "❌ Backend API is not ready"
fi

# Check frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is ready"
else
    echo "❌ Frontend is not ready"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📱 Access your application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000"
echo "   Database: localhost:5432"
echo ""
echo "📚 Useful commands:"
echo "   View logs: docker-compose logs -f"
echo "   Stop services: docker-compose down"
echo "   Restart services: docker-compose restart"
echo "   Rebuild services: docker-compose up --build"
echo ""
echo "🔧 Development commands:"
echo "   Backend logs: docker-compose logs -f backend"
echo "   Frontend logs: docker-compose logs -f frontend"
echo "   Database logs: docker-compose logs -f database"
echo ""
echo "Happy coding! 🚀"
