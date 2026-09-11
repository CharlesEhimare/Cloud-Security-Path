#!/bin/bash

# DevOps Portfolio Project 1 - Deployment Script
# This script handles deployment to different environments

set -e

# Configuration
ENVIRONMENT=${1:-staging}
DOCKER_REGISTRY=${DOCKER_REGISTRY:-ghcr.io}
IMAGE_TAG=${IMAGE_TAG:-latest}

echo "🚀 Deploying DevOps Portfolio Project 1 to $ENVIRONMENT..."

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(staging|production)$ ]]; then
    echo "❌ Invalid environment. Use 'staging' or 'production'"
    exit 1
fi

# Check if required tools are installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed"
    exit 1
fi

if ! command -v kubectl &> /dev/null && [ "$ENVIRONMENT" = "production" ]; then
    echo "⚠️  kubectl is not installed. Required for production deployment."
fi

# Build and tag images
echo "🐳 Building and tagging Docker images..."

# Build backend image
docker build -t $DOCKER_REGISTRY/devops-portfolio/backend:$IMAGE_TAG ./backend
docker build -t $DOCKER_REGISTRY/devops-portfolio/backend:$ENVIRONMENT ./backend

# Build frontend image
docker build -t $DOCKER_REGISTRY/devops-portfolio/frontend:$IMAGE_TAG ./frontend
docker build -t $DOCKER_REGISTRY/devops-portfolio/frontend:$ENVIRONMENT ./frontend

# Push images to registry
echo "📤 Pushing images to registry..."
docker push $DOCKER_REGISTRY/devops-portfolio/backend:$IMAGE_TAG
docker push $DOCKER_REGISTRY/devops-portfolio/backend:$ENVIRONMENT
docker push $DOCKER_REGISTRY/devops-portfolio/frontend:$IMAGE_TAG
docker push $DOCKER_REGISTRY/devops-portfolio/frontend:$ENVIRONMENT

# Deploy based on environment
if [ "$ENVIRONMENT" = "staging" ]; then
    echo "🎭 Deploying to staging environment..."
    
    # Update docker-compose for staging
    export COMPOSE_PROJECT_NAME=devops-portfolio-staging
    docker-compose -f docker-compose.yml -f docker-compose.staging.yml up -d
    
    # Run health checks
    echo "🔍 Running health checks..."
    sleep 30
    
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        echo "✅ Staging deployment successful"
    else
        echo "❌ Staging deployment failed"
        exit 1
    fi
    
elif [ "$ENVIRONMENT" = "production" ]; then
    echo "🏭 Deploying to production environment..."
    
    # Check if Kubernetes manifests exist
    if [ ! -d "./k8s" ]; then
        echo "❌ Kubernetes manifests not found. Please create them first."
        exit 1
    fi
    
    # Apply Kubernetes manifests
    kubectl apply -f ./k8s/namespace.yaml
    kubectl apply -f ./k8s/configmap.yaml
    kubectl apply -f ./k8s/secret.yaml
    kubectl apply -f ./k8s/database.yaml
    kubectl apply -f ./k8s/backend.yaml
    kubectl apply -f ./k8s/frontend.yaml
    kubectl apply -f ./k8s/ingress.yaml
    
    # Wait for deployment to complete
    echo "⏳ Waiting for deployment to complete..."
    kubectl rollout status deployment/devops-portfolio-backend -n devops-portfolio
    kubectl rollout status deployment/devops-portfolio-frontend -n devops-portfolio
    
    # Run health checks
    echo "🔍 Running health checks..."
    kubectl get pods -n devops-portfolio
    
    echo "✅ Production deployment successful"
fi

echo ""
echo "🎉 Deployment to $ENVIRONMENT completed successfully!"
echo ""
echo "📱 Access your application:"
if [ "$ENVIRONMENT" = "staging" ]; then
    echo "   URL: http://localhost:3000"
elif [ "$ENVIRONMENT" = "production" ]; then
    echo "   URL: Check your ingress configuration"
fi
echo ""
echo "📊 Monitor your deployment:"
if [ "$ENVIRONMENT" = "production" ]; then
    echo "   kubectl get pods -n devops-portfolio"
    echo "   kubectl logs -f deployment/devops-portfolio-backend -n devops-portfolio"
fi
