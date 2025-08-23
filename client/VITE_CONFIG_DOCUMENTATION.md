# Vite Configuration Documentation

## Overview

This document provides a comprehensive breakdown of the Vite configuration for the URL Shortener application. The configuration is environment-aware and optimized for both development and production workflows.

## Configuration Structure

### Plugins

```typescript
plugins: [react(), tailwindcss()];
```

- **React Plugin**: Enables React support with JSX transformation and Fast Refresh
- **Tailwind CSS Plugin**: Integrates Tailwind CSS processing directly into Vite's build pipeline

### Base Path Configuration

```typescript
base: mode === "production" ? "/shrink-iq-web-app" : "/";
```

- **Production**: Uses `/shrink-iq-web-app` as the base path for deployment
- **Development**: Uses root path `/` for local development
- **Purpose**: Handles deployment to subdirectories in production environments

### Path Resolution

```typescript
resolve: {
  alias: {
    "@": path.resolve(__dirname, "./src"),
  },
}
```

- **Alias Configuration**: Maps `@` to the `src` directory
- **Benefits**:
  - Cleaner imports: `import Component from "@/components/Component"`
  - Eliminates relative path complexity: `../../../components/Component`

### Environment Variables (Define)

```typescript
define: {
  "import.meta.env.VITE_API_BASE_URL":
    mode === "production"
      ? '"https://url-shortener-api-1d56.onrender.com/api"'
      : mode === "development:local"
      ? '"http://localhost:5000/api"'
      : '"/api"',
}
```

#### Environment-Specific API URLs:

| Mode                    | API Base URL                                      | Purpose                              |
| ----------------------- | ------------------------------------------------- | ------------------------------------ |
| `production`            | `https://url-shortener-api-1d56.onrender.com/api` | Production deployment on Render.com  |
| `development:local`     | `http://localhost:5000/api`                       | Local backend development            |
| `development` (default) | `/api`                                            | Development with proxy to remote API |

#### Key Features:

- **Build-time replacement**: Values are statically replaced during compilation
- **Type safety**: Accessible via `import.meta.env.VITE_API_BASE_URL`
- **Performance optimization**: No runtime environment variable lookups

### Development Server

```typescript
server: {
  port: 3000,
  host: true,
  proxy: { /* environment-specific */ }
}
```

#### Server Settings:

- **Port**: Development server runs on port 3000
- **Host**: `true` enables external connections (network access from other devices)

#### Proxy Configuration:

##### Development Mode (Remote API)

```typescript
"/api": {
  target: "https://url-shortener-api-1d56.onrender.com/",
  changeOrigin: true,
  secure: true,
}
```

- **Target**: Production API on Render.com
- **Change Origin**: Modifies the origin header to match target
- **Secure**: Enables SSL verification for HTTPS requests

##### Development:Local Mode (Local API)

```typescript
"/api": {
  target: "http://localhost:5000",
  changeOrigin: true,
  secure: false,
}
```

- **Target**: Local development server
- **Secure**: Disabled for local HTTP connections

##### Production Mode

- **No Proxy**: Empty object `{}` - direct API calls in production

### Build Configuration

```typescript
build: {
  outDir: "dist",
  sourcemap: true,
}
```

- **Output Directory**: Built files placed in `dist` folder
- **Source Maps**: Enabled for debugging production builds

## Environment Modes

### Available Modes:

1. **`production`**: Production deployment configuration
2. **`development`**: Default development mode with remote API proxy
3. **`development:local`**: Local development with local backend

### Mode Usage:

```bash
# Production build
npm run build

# Development with remote API
npm run dev

# Development with local API
npm run dev -- --mode development:local
```

## Configuration Benefits

### Development Experience

- **Flexible API targeting**: Switch between local and remote backends
- **CORS resolution**: Proxy eliminates cross-origin issues
- **Hot reload**: Fast refresh for React components
- **Network testing**: External device access via `host: true`

### Production Optimization

- **Static replacement**: Environment variables compiled into bundle
- **Clean builds**: Separate output directory
- **Debug support**: Source maps for production debugging
- **Deployment ready**: Configurable base path for subdirectory deployments

### Code Organization

- **Path aliases**: Clean import statements with `@` prefix
- **Type safety**: TypeScript support throughout
- **Modern tooling**: Vite's fast development and optimized builds

## Usage Examples

### API Calls in Components

```typescript
// Using defined environment variable
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const response = await fetch(`${apiUrl}/shorten`, {
  /* options */
});

// Using proxy (development only)
const response = await fetch("/api/shorten", {
  /* options */
});
```

### Import Aliases

```typescript
// Instead of: import Button from '../../../components/ui/Button'
import Button from "@/components/ui/Button";

// Instead of: import { api } from '../../services/api'
import { api } from "@/services/api";
```

## Best Practices Implemented

1. **Environment Separation**: Clear distinction between local, development, and production
2. **Performance Optimization**: Build-time constant replacement
3. **Developer Ergonomics**: Proxy configuration eliminates CORS issues
4. **Maintainability**: Path aliases improve code readability
5. **Debugging Support**: Source maps for production troubleshooting
6. **Deployment Flexibility**: Configurable base paths for various hosting scenarios

## Troubleshooting

### Common Issues:

- **CORS Errors**: Ensure proxy configuration matches your API endpoints
- **Import Errors**: Verify `@` alias paths are correct relative to `src`
- **Environment Variables**: Check mode-specific API URL configurations
- **Build Failures**: Ensure all defined values are properly string-wrapped

### Mode Verification:

```typescript
console.log("Current mode:", import.meta.env.MODE);
console.log("API URL:", import.meta.env.VITE_API_BASE_URL);
```
