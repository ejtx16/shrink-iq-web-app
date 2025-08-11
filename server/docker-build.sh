#!/bin/bash

# Docker Build and Push Script for URL Shortener API
# Usage: ./docker-build.sh [tag] [docker-username]

set -e

# Configuration
DEFAULT_TAG="latest"
IMAGE_NAME="url-shortener-api"

# Parse arguments
TAG=${1:-$DEFAULT_TAG}
DOCKER_USERNAME=${2:-}

if [ -z "$DOCKER_USERNAME" ]; then
    echo "Error: Docker Hub username is required"
    echo "Usage: $0 [tag] <docker-username>"
    echo "Example: $0 latest myusername"
    exit 1
fi

FULL_IMAGE_NAME="$DOCKER_USERNAME/$IMAGE_NAME:$TAG"

echo "🐳 Building Docker image..."
echo "Image: $FULL_IMAGE_NAME"
echo "Context: $(pwd)"

# Build the Docker image
docker build -t "$FULL_IMAGE_NAME" .

echo "✅ Successfully built image: $FULL_IMAGE_NAME"

# Ask for confirmation before pushing
read -p "Do you want to push this image to Docker Hub? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Pushing image to Docker Hub..."
    docker push "$FULL_IMAGE_NAME"
    echo "✅ Successfully pushed image: $FULL_IMAGE_NAME"
    
    echo ""
    echo "🎉 Deployment commands:"
    echo "docker pull $FULL_IMAGE_NAME"
    echo "docker run -d -p 5000:5000 --env-file .env --name url-shortener-api $FULL_IMAGE_NAME"
else
    echo "⏭️  Skipping push to Docker Hub"
    echo ""
    echo "🧪 Local testing commands:"
    echo "docker run -d -p 5000:5000 --env-file .env --name url-shortener-api $FULL_IMAGE_NAME"
fi

echo ""
echo "📋 Available images:"
docker images | grep "$DOCKER_USERNAME/$IMAGE_NAME" || echo "No images found" 