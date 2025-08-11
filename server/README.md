# URL Shortener Backend

A robust Node.js/Express backend API for the URL shortener application built with TypeScript, MongoDB, and comprehensive analytics.

## 🚀 Features

- **URL Shortening**: Generate unique short codes for long URLs
- **Custom Slugs**: Allow users to create custom short URLs
- **User Authentication**: JWT-based authentication system
- **Click Tracking**: Detailed analytics with IP, user agent, and referrer tracking
- **Rate Limiting**: Protect against abuse with configurable rate limits
- **Security**: Helmet, CORS, input validation, and XSS protection
- **Analytics**: Comprehensive analytics for dashboard and individual URLs

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator
- **Security**: Helmet, CORS, bcrypt
- **Rate Limiting**: Express Rate Limit
- **ID Generation**: nanoid

## 📁 Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── database.ts          # MongoDB connection setup
│   ├── controllers/
│   │   ├── authController.ts    # Authentication endpoints
│   │   ├── urlController.ts     # URL shortening and management
│   │   └── analyticsController.ts # Analytics and reporting
│   ├── middleware/
│   │   ├── auth.ts              # JWT authentication middleware
│   │   ├── rateLimiter.ts       # Rate limiting configuration
│   │   └── validation.ts        # Input validation schemas
│   ├── models/
│   │   ├── User.ts              # User model with password hashing
│   │   └── Url.ts               # URL model with click tracking
│   ├── routes/
│   │   ├── auth.ts              # Authentication routes
│   │   ├── urls.ts              # URL management routes
│   │   ├── analytics.ts         # Analytics routes
│   │   └── redirect.ts          # URL redirect handling
│   ├── types/
│   │   └── index.ts             # TypeScript type definitions
│   ├── utils/
│   │   └── urlGenerator.ts      # URL code generation utilities
│   └── index.ts                 # Main application entry point
├── package.json
├── tsconfig.json
└── env.example                  # Environment variables template
```

## 🔧 Installation & Setup

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Set up environment variables**:

   ```bash
   cp env.example .env
   ```

   Update `.env` with your values:

   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/url-shortener
   JWT_SECRET=your-super-secret-jwt-key-here
   BASE_URL=http://localhost:3000
   SHORT_DOMAIN=short.ly
   NODE_ENV=development
   ```

3. **Start MongoDB** (if running locally):

   ```bash
   mongod
   ```

4. **Run in development mode**:

   ```bash
   npm run dev
   ```

5. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

## 📊 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### URLs

- `POST /api/urls/shorten` - Create shortened URL
- `GET /api/urls/my` - Get user's URLs (protected)
- `GET /api/urls/:id` - Get URL details (protected)
- `DELETE /api/urls/:id` - Delete URL (protected)

### Analytics

- `GET /api/analytics/dashboard` - Get dashboard analytics (protected)
- `GET /api/analytics/url/:id` - Get URL-specific analytics (protected)

### Redirects

- `GET /:shortCode` - Redirect to original URL (tracks click)

## 🔒 Security Features

- **Rate Limiting**:
  - URL shortening: 100 requests/hour per user/IP
  - Authentication: 5 attempts per 15 minutes
  - General API: 1000 requests/hour
- **Input Validation**: Comprehensive validation for all endpoints
- **Authentication**: JWT tokens with secure password hashing
- **CORS**: Configured for frontend domain
- **Helmet**: Security headers protection
- **XSS Protection**: Input sanitization

## 📈 Analytics Features

- **Click Tracking**: IP, user agent, referrer, timestamp
- **Dashboard Analytics**: Total URLs, clicks, time-based metrics
- **URL Analytics**: Daily clicks, browser stats, referrer analysis
- **Real-time Data**: Live click tracking and analytics updates

## 🔄 Rate Limiting

| Endpoint Type  | Limit         | Window     |
| -------------- | ------------- | ---------- |
| URL Shortening | 100 requests  | 1 hour     |
| Authentication | 5 attempts    | 15 minutes |
| General API    | 1000 requests | 1 hour     |

## 🌐 Environment Variables

| Variable       | Description               | Default                                 |
| -------------- | ------------------------- | --------------------------------------- |
| `PORT`         | Server port               | 5000                                    |
| `MONGODB_URI`  | MongoDB connection string | mongodb://localhost:27017/url-shortener |
| `JWT_SECRET`   | JWT signing secret        | -                                       |
| `BASE_URL`     | Frontend URL for CORS     | http://localhost:3000                   |
| `SHORT_DOMAIN` | Domain for short URLs     | short.ly                                |
| `NODE_ENV`     | Environment               | development                             |

## 🚀 Deployment

### Production Checklist

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Configure MongoDB Atlas or production database
4. Set up proper logging
5. Configure reverse proxy (Nginx)
6. Enable HTTPS
7. Set up monitoring

### Docker Support

The API is fully containerized with multi-stage builds for optimal production deployment.

#### Quick Docker Commands

```bash
# Build and run locally
npm run docker:build
npm run docker:run

# Stop and cleanup
npm run docker:stop
npm run docker:clean

# View logs
npm run docker:logs
```

#### Docker Hub Deployment

```bash
# Build and push to Docker Hub
./docker-build.sh latest your-dockerhub-username

# Deploy from Docker Hub
./docker-deploy.sh your-dockerhub-username latest 5000
```

#### Manual Docker Commands

```bash
# Build image
docker build -t your-username/url-shortener-api:latest .

# Run container
docker run -d \
  --name url-shortener-api \
  -p 5000:5000 \
  --env-file .env \
  --restart unless-stopped \
  your-username/url-shortener-api:latest

# Check health
curl http://localhost:5000/health
```

## 🐳 Docker Deployment

### Prerequisites

- Docker installed and running
- Docker Hub account (for registry deployment)

### Environment Setup

1. **Create environment file**:
   ```bash
   cp env.production.example .env
   # Edit .env with your actual values
   ```

2. **Required environment variables**:
   - `MONGODB_URI`: MongoDB Atlas connection string
   - `JWT_SECRET`: Strong JWT signing secret
   - `BASE_URL`: Frontend URL for CORS
   - `SHORT_DOMAIN`: Domain for short URLs

### Local Development

```bash
# Build Docker image
npm run docker:build

# Run container with environment file
npm run docker:run

# View container logs
npm run docker:logs

# Stop and remove container
npm run docker:clean
```

### Production Deployment

1. **Build and push to Docker Hub**:
   ```bash
   # Login to Docker Hub
   docker login

   # Build and push (interactive script)
   ./docker-build.sh latest your-dockerhub-username
   ```

2. **Deploy from Docker Hub**:
   ```bash
   # Deploy to any server with Docker
   ./docker-deploy.sh your-dockerhub-username latest 5000
   ```

### Docker Features

- **Multi-stage build**: Optimized production image size
- **Security**: Non-root user, minimal attack surface
- **Health checks**: Built-in container health monitoring
- **Environment**: Runtime configuration via environment variables
- **Logging**: Structured logging with Docker logs integration

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run linting
npm run lint

# Test Docker container
docker run --rm -p 5000:5000 --env-file .env your-username/url-shortener-api:latest
curl http://localhost:5000/health
```

## 📝 API Response Examples

### Successful URL Creation

```json
{
  "message": "URL shortened successfully",
  "data": {
    "id": "64f123abc456789012345678",
    "originalUrl": "https://example.com/very-long-url",
    "shortCode": "abc123",
    "shortUrl": "short.ly/abc123",
    "clickCount": 0,
    "createdAt": "2023-12-01T10:00:00.000Z"
  }
}
```

### Analytics Response

```json
{
  "data": {
    "totalUrls": 15,
    "totalClicks": 1250,
    "clicksToday": 45,
    "clicksThisWeek": 320,
    "clicksThisMonth": 890,
    "topReferrers": [
      { "referrer": "google.com", "count": 450 },
      { "referrer": "Direct", "count": 380 }
    ]
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.
