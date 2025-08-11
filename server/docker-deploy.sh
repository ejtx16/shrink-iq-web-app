#!/bin/bash

# Docker Deployment Script for URL Shortener API
# Usage: ./docker-deploy.sh [docker-username] [tag] [port]

set -e

# Configuration
DEFAULT_TAG="latest"
DEFAULT_PORT="5000"
IMAGE_NAME="url-shortener-api"
CONTAINER_NAME="url-shortener-api"

# Parse arguments
DOCKER_USERNAME=${1:-}
TAG=${2:-$DEFAULT_TAG}
HOST_PORT=${3:-$DEFAULT_PORT}

if [ -z "$DOCKER_USERNAME" ]; then
    echo "Error: Docker Hub username is required"
    echo "Usage: $0 <docker-username> [tag] [port]"
    echo "Example: $0 myusername latest 5000"
    exit 1
fi

FULL_IMAGE_NAME="$DOCKER_USERNAME/$IMAGE_NAME:$TAG"

echo "🚀 Deploying URL Shortener API..."
echo "Image: $FULL_IMAGE_NAME"
echo "Port: $HOST_PORT:5000"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found!"
    echo "Creating .env from template..."
    
    if [ -f "env.production.example" ]; then
        cp env.production.example .env
        echo "✅ Created .env from env.production.example"
        echo "🔧 Please edit .env file with your actual values before running again"
        exit 1
    else
        echo "❌ No env.production.example template found"
        echo "Please create a .env file with the required environment variables"
        exit 1
    fi
fi

# Stop and remove existing container if it exists
if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
    echo "🛑 Stopping existing container..."
    docker stop $CONTAINER_NAME || true
    docker rm $CONTAINER_NAME || true
fi

# Pull the latest image
echo "📥 Pulling latest image..."
docker pull "$FULL_IMAGE_NAME"

# Run the container
echo "🏃 Starting container..."
docker run -d \
    --name $CONTAINER_NAME \
    -p $HOST_PORT:5000 \
    --env-file .env \
    --restart unless-stopped \
    "$FULL_IMAGE_NAME"

# Wait a moment for container to start
sleep 3

# Check container status
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    echo "✅ Container started successfully!"
    echo ""
    echo "📊 Container information:"
    docker ps -f name=$CONTAINER_NAME --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    
    echo ""
    echo "🌐 API endpoints:"
    echo "Health check: http://localhost:$HOST_PORT/health"
    echo "API base: http://localhost:$HOST_PORT/api"
    
    echo ""
    echo "📋 Useful commands:"
    echo "View logs: docker logs -f $CONTAINER_NAME"
    echo "Stop container: docker stop $CONTAINER_NAME"
    echo "Remove container: docker rm $CONTAINER_NAME"
    echo "Container shell: docker exec -it $CONTAINER_NAME sh"
else
    echo "❌ Failed to start container"
    echo "Check logs: docker logs $CONTAINER_NAME"
    exit 1
fi 