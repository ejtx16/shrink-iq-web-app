# 🔗 URL Shortener Application

A full-stack URL shortener application with comprehensive analytics, built with React, Node.js, TypeScript, and MongoDB.

## 🚀 Features

### Core Functionality

- **URL Shortening**: Convert long URLs into short, manageable links
- **Custom Slugs**: Create personalized short URLs with alphanumeric characters, hyphens, and underscores
- **Click Tracking**: Detailed analytics with IP, user agent, referrer, and timestamp data
- **User Management**: Secure authentication with JWT tokens

### Analytics & Insights

- **Dashboard Analytics**: Overview of all URLs with click statistics
- **Detailed URL Analytics**: Individual URL performance with charts
- **Real-time Tracking**: Live click data and user activity
- **Visual Charts**: Interactive graphs for click patterns and browser usage

### Security & Performance

- **Rate Limiting**: Protection against abuse (100 requests/hour for URL shortening)
- **Input Validation**: Comprehensive server and client-side validation
- **Security Headers**: Helmet.js protection with CORS configuration
- **Mobile Responsive**: Optimized for all device sizes

## 🛠 Tech Stack

### Frontend

- **React 18** with TypeScript
- **Vite** for fast builds and development
- **Tailwind CSS** for modern styling
- **React Router DOM** for navigation
- **Recharts** for analytics visualization
- **React Hook Form** for form management
- **Axios** for API communication

### Backend

- **Node.js** with Express.js
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Rate Limit** for API protection
- **nanoid** for unique ID generation

## 📁 Project Structure

```
url-shortener-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── contexts/       # React contexts (Auth)
│   │   ├── services/       # API service layer
│   │   └── types/          # TypeScript definitions
│   └── package.json
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   └── utils/          # Utility functions
│   └── package.json
├── PRD.md                  # Product Requirements Document
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- Docker and Docker Compose (for local MongoDB)
- npm or yarn

### 1. Clone the Repository

```bash
git clone <repository-url>
cd url-shortener-app
```

### 2. Start MongoDB with Docker Compose

```bash
# Start MongoDB and Mongo Express (database admin UI)
docker-compose up -d

# Check if containers are running
docker-compose ps
```

### 3. Setup Backend

```bash
cd server
npm install

# Copy and configure environment variables
cp env.example .env
# The .env file is already configured for Docker MongoDB

# Start the backend server
npm run dev
```

### 4. Setup Frontend

```bash
cd ../client
npm install

# Start the frontend development server
npm run dev
```

### 5. Access the Application

- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`
- **Health Check**: `http://localhost:5000/health`
- **MongoDB Admin UI**: `http://localhost:8081` (Mongo Express)

## 🐳 Docker Setup

The project includes Docker Compose configuration for easy local development with MongoDB.

### What's Included

- **MongoDB 7.0**: Main database with authentication
- **Mongo Express**: Web-based MongoDB admin interface
- **Persistent Storage**: Data persists between container restarts
- **Network**: Isolated Docker network for services

### Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove all data
docker-compose down -v

# Rebuild containers
docker-compose up -d --build
```

### Database Access

- **Application Connection**: `mongodb://urlshortener:urlshortener123@localhost:27017/url-shortener`
- **Admin Connection**: `mongodb://admin:password123@localhost:27017/url-shortener`
- **Web UI**: http://localhost:8081 (Mongo Express)

## 🔧 Configuration

### Backend Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=5000
# For Docker Compose (recommended):
MONGODB_URI=mongodb://urlshortener:urlshortener123@localhost:27017/url-shortener
JWT_SECRET=your-super-secret-jwt-key-here
BASE_URL=http://localhost:3000
SHORT_DOMAIN=short.ly
NODE_ENV=development
```

### Frontend Configuration

The frontend is configured to proxy API requests to the backend during development. For production, update the API base URL in the Vite configuration.

## 📊 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### URL Management

- `POST /api/urls/shorten` - Create short URL
- `GET /api/urls/my` - Get user's URLs
- `GET /api/urls/:id` - Get URL details
- `DELETE /api/urls/:id` - Delete URL

### Analytics

- `GET /api/analytics/dashboard` - Dashboard analytics
- `GET /api/analytics/url/:id` - URL-specific analytics

### Redirects

- `GET /:shortCode` - Redirect to original URL

## 🎨 User Interface

### Home Page

- Public URL shortening interface
- Feature highlights and call-to-action
- Mobile-responsive design

### Dashboard

- URL management interface
- Analytics overview cards
- Quick actions for creating and managing URLs

### Analytics Page

- Detailed charts and graphs
- Click timeline and browser statistics
- Referrer analysis and recent activity

## 🔒 Security Features

- **Authentication**: JWT-based user authentication
- **Rate Limiting**: Configurable limits for different endpoints
- **Input Validation**: Server-side validation with Express Validator
- **Password Security**: bcrypt hashing with salt rounds
- **CORS Protection**: Configured for frontend domain
- **Security Headers**: Helmet.js for standard security headers

## 📈 Analytics Capabilities

### Dashboard Metrics

- Total URLs created
- Total clicks across all URLs
- Daily, weekly, and monthly click statistics
- Top referrer sources

### URL-Specific Analytics

- Click history over the last 30 days
- Browser and device distribution
- Detailed referrer analysis
- Real-time click tracking with timestamps
- Geographic data (IP-based)

## 🚀 Deployment

### Backend Deployment

1. Build the TypeScript code: `npm run build`
2. Set production environment variables
3. Deploy to your preferred platform (Heroku, AWS, etc.)

### Frontend Deployment

1. Build the React app: `npm run build`
2. Deploy the `dist` folder to a static hosting service
3. Configure environment variables for API endpoints

### Database Setup

- Use MongoDB Atlas for production
- Set up proper indexes for performance
- Configure backup and monitoring

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration and login
- [ ] URL shortening (with and without custom slugs)
- [ ] URL redirection and click tracking
- [ ] Dashboard analytics display
- [ ] Detailed URL analytics
- [ ] Mobile responsiveness
- [ ] Rate limiting functionality

### Automated Testing (Future Enhancement)

- Unit tests for utility functions
- Integration tests for API endpoints
- E2E tests for user workflows

## 🔄 Rate Limiting

| Feature        | Limit         | Window     |
| -------------- | ------------- | ---------- |
| URL Shortening | 100 requests  | 1 hour     |
| Authentication | 5 attempts    | 15 minutes |
| General API    | 1000 requests | 1 hour     |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Future Enhancements

- [ ] QR code generation for short URLs
- [ ] Bulk URL shortening
- [ ] Advanced analytics with geographic data
- [ ] Custom domain support
- [ ] Link expiration dates
- [ ] API rate limiting per user tier
- [ ] Email notifications for analytics

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🙏 Acknowledgments

Built with modern web technologies and best practices for scalability, security, and user experience.
