# Docker Workflow Guide

This guide explains how to build, tag, and deploy Docker images for the URL Shortener API project.

## 🔄 Workflow Overview: Code, Tag, Build, Push

The general process for releasing a new version of your application is:

1. **Make code changes:** Update your application's source code
2. **Choose a new tag:** Decide on a version number for your new build
3. **Build the image:** Use `docker build` with the new tag
4. **Push the image:** Use `docker push` to upload the new version to Docker Hub

## 📋 Prerequisites

- Docker installed and running on your system
- Docker Hub account ([create one here](https://hub.docker.com/))
- Access to this project's source code

## 🚀 Method 1: Using the Build Script (Recommended)

The project includes a `docker-build.sh` script that automates the build and push process.

### Initial Setup

```bash
# Navigate to the server directory
cd server

# Make the script executable (Linux/Mac)
chmod +x docker-build.sh
```

### Building and Pushing

```bash
# Build with default 'latest' tag
./docker-build.sh latest your-dockerhub-username

# Build with a specific version tag
./docker-build.sh 1.1.0 your-dockerhub-username

# Build with a feature tag
./docker-build.sh feature-auth your-dockerhub-username
```

The script will:
1. Build the Docker image with the specified tag
2. Ask for confirmation before pushing to Docker Hub
3. Push the image if confirmed
4. Display deployment commands

## 🔧 Method 2: Manual Docker Commands

If you prefer manual control or are on Windows, you can use these Docker commands directly.

### Prerequisites

1. **Navigate to the server directory:**
   ```bash
   cd server
   ```

2. **Log in to Docker Hub:**
   ```bash
   docker login
   ```

### Initial Build (First Time)

```bash
# Build and tag the image
docker build -t your-dockerhub-username/url-shortener-api:latest .

# Push to Docker Hub
docker push your-dockerhub-username/url-shortener-api:latest
```

### Creating New Versions

When you make code changes and want to release a new version:

#### Step 1: Choose a New Tag
Use [semantic versioning](https://semver.org/) for your tags:
- `1.0.0` - Major release
- `1.1.0` - Minor update (new features)
- `1.0.1` - Patch (bug fixes)

#### Step 2: Build with New Tag
```bash
# Example: Building version 1.1.0
docker build -t your-dockerhub-username/url-shortener-api:1.0.1 .
```

#### Step 3: Push the New Version
```bash
docker push your-dockerhub-username/url-shortener-api:1.0.1
```

#### Step 4: Update 'latest' Tag (Recommended)
```bash
# Re-tag the new version as 'latest'
docker tag your-dockerhub-username/url-shortener-api:1.1.0 your-dockerhub-username/url-shortener-api:latest

# Push the updated 'latest' tag
docker push your-dockerhub-username/url-shortener-api:latest
```

## 🏷️ Tagging Strategy

### Recommended Tag Formats

| Tag Type | Format | Example | Use Case |
|----------|--------|---------|----------|
| Latest | `latest` | `latest` | Always points to newest stable version |
| Version | `x.y.z` | `1.2.0` | Specific stable releases |
| Feature | `feature-name` | `feature-auth` | Feature development |
| Hotfix | `hotfix-description` | `hotfix-security` | Emergency fixes |
| Environment | `env-name` | `staging` | Environment-specific builds |

### Examples

```bash
# Stable release
docker build -t your-dockerhub-username/url-shortener-api:1.2.0 .

# Development feature
docker build -t your-dockerhub-username/url-shortener-api:feature-analytics .

# Staging environment
docker build -t your-dockerhub-username/url-shortener-api:staging .

# Hotfix
docker build -t your-dockerhub-username/url-shortener-api:hotfix-cors .
```

## 🚀 Deployment

### Quick Deployment Commands

After pushing your image to Docker Hub, deploy it anywhere Docker is available:

```bash
# Pull and run the latest version
docker pull your-dockerhub-username/url-shortener-api:latest
docker run -d -p 5000:5000 --env-file .env --name url-shortener-api your-dockerhub-username/url-shortener-api:latest

# Or use the deployment script
./docker-deploy.sh your-dockerhub-username latest 5000
```

### Environment File Setup

Before deploying, ensure you have the proper environment file:

```bash
# For production deployment
cp env.production.example .env
# Edit .env with your actual values
```

## 🔍 Useful Commands

### List Your Images
```bash
# See all local images for this project
docker images | grep url-shortener-api

# See all tags on Docker Hub (requires docker hub account)
docker search your-dockerhub-username/url-shortener-api
```

### Clean Up Local Images
```bash
# Remove old local images
docker image prune

# Remove specific image
docker rmi your-dockerhub-username/url-shortener-api:old-tag
```

### Container Management
```bash
# Stop running container
docker stop url-shortener-api

# Remove container
docker rm url-shortener-api

# View logs
docker logs -f url-shortener-api

# Execute commands in running container
docker exec -it url-shortener-api sh
```

## 🎯 Best Practices

### 1. Version Management
- Always tag stable releases with version numbers
- Keep the `latest` tag pointing to your most recent stable version
- Use descriptive tags for feature branches
- Never overwrite existing version tags

### 2. Build Optimization
- Use `.dockerignore` to exclude unnecessary files
- Leverage Docker's multi-stage builds (already implemented)
- Build images on the same architecture where they'll be deployed

### 3. Security
- Regularly update base images
- Scan images for vulnerabilities
- Use non-root users in containers (already implemented)
- Keep sensitive data in environment variables, not in images

### 4. Testing
- Test images locally before pushing
- Use health checks (already implemented)
- Verify environment variable injection

## 🐛 Troubleshooting

### Common Issues

#### 1. Permission Denied (Linux/Mac)
```bash
chmod +x docker-build.sh
```

#### 2. Image Build Fails
```bash
# Clean Docker cache
docker system prune

# Rebuild without cache
docker build --no-cache -t your-dockerhub-username/url-shortener-api:latest .
```

#### 3. Push Fails
```bash
# Re-login to Docker Hub
docker logout
docker login
```

#### 4. Container Won't Start
```bash
# Check logs for errors
docker logs url-shortener-api

# Verify environment file exists
ls -la .env
```

## 📚 Additional Resources

- [Docker Official Documentation](https://docs.docker.com/)
- [Docker Hub Documentation](https://docs.docker.com/docker-hub/)
- [Semantic Versioning](https://semver.org/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

## Quick Reference

### One-Line Commands

```bash
# Complete build and push (using script)
./docker-build.sh 1.2.0 your-dockerhub-username

# Manual build and push
docker build -t your-dockerhub-username/url-shortener-api:1.2.0 . && docker push your-dockerhub-username/url-shortener-api:1.2.0

# Deploy latest version
./docker-deploy.sh your-dockerhub-username latest 5000
```

Remember to replace `your-dockerhub-username` with your actual Docker Hub username in all commands! 