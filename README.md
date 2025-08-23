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

### Frontend Deployment to GitHub Pages

This project is configured for easy deployment to GitHub Pages. Follow these steps to deploy your frontend application:

#### 1. Install GitHub Pages Dependencies

First, ensure `gh-pages` is installed as a development dependency:

```bash
cd client
npm install --save-dev gh-pages
```

#### 2. Configure Vite for GitHub Pages

Update your `vite.config.ts` file with the following configurations:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  
  // Base URL configuration for GitHub Pages deployment
  // Handles deployment to subdirectories in production environments
  base: mode === "production" ? "/<your-repo-name>/" : "/",
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
  // Global constant replacements when bundling assets
  define: {
    // Set API URL based on mode
    "import.meta.env.VITE_API_BASE_URL":
      mode === "production"
        ? '"https://your-api-domain.com/api"'  // Replace with your actual API URL
        : mode === "development:local"
        ? '"http://localhost:5000/api"'
        : '"/api"',
  },
  
  // ... rest of your configuration
}));
```

**Key Vite Configuration Changes:**

- **`base` property**: Sets the base URL for assets in production. For GitHub Pages, this should be `"/<repository-name>/"` to handle deployment to subdirectories.
- **`define` property**: Provides global constant replacements during build time, allowing you to set different API URLs for different environments.

#### 3. Configure package.json for GitHub Pages

Update your `package.json` file in the client directory:

```json
{
  "name": "your-app-name",
  "description": "URL Shortener Web App",
  "homepage": "https://<your-username>.github.io/<your-repo-name>/",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "dev:local": "cross-env NODE_ENV=development:local vite --mode development:local",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  // ... rest of your configuration
}
```

**Key Package.json Changes:**

- **`homepage`**: Set to your GitHub Pages URL: `https://<username>.github.io/<repo-name>/`
- **`predeploy` script**: Automatically builds the project before deployment
- **`deploy` script**: Deploys the `dist` folder to the `gh-pages` branch

#### 4. Deploy to GitHub Pages

Once your configuration is complete, deploy your application:

```bash
cd client
npm run deploy
```

This command will:
1. Run `npm run build` (via the `predeploy` script)
2. Create a `gh-pages` branch (if it doesn't exist)
3. Push the built files from the `dist` directory to the `gh-pages` branch

#### 5. Configure GitHub Repository Settings

After running the deploy command, configure your GitHub repository:

1. **Go to your repository on GitHub**
2. **Navigate to Settings** → **Pages**
3. **Source**: Select "Deploy from a branch"
4. **Branch**: Choose `gh-pages` from the dropdown
5. **Folder**: Select `/ (root)`
6. **Click Save**

#### 6. Access Your Deployed Application

After a few minutes, your application will be available at:
```
https://<your-username>.github.io/<your-repo-name>/
```

#### 7. Subsequent Deployments

For future deployments, simply run:

```bash
cd client
npm run deploy
```

#### Important Notes

- **First deployment** may take 5-10 minutes to become available
- **Subsequent deployments** typically take 1-2 minutes to update
- Ensure your **API endpoints** are configured for production in the Vite config
- The `homepage` field in `package.json` must match your actual GitHub Pages URL
- Make sure your repository is **public** or you have **GitHub Pro** for private repo Pages

#### Troubleshooting GitHub Pages Deployment

**Common Issues:**

1. **404 Error**: Check that the `base` URL in Vite config matches your repository name
2. **API Errors**: Ensure your production API URL is correctly set in the `define` section
3. **Build Failures**: Run `npm run build` locally first to catch any build errors
4. **Assets Not Loading**: Verify the `base` property includes the correct repository name

**Useful Commands:**

```bash
# Check deployment status
git log --oneline -n 5 gh-pages

# Force redeploy
npm run deploy -- --force

# Preview build locally
npm run build && npm run preview
```

### Backend Deployment

1. Build the TypeScript code: `npm run build`
2. Set production environment variables
3. Deploy to your preferred platform (Heroku, AWS, etc.)

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
