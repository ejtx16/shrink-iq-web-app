import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"
import tailwindcss from "@tailwindcss/vite"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  base: mode === "production" ? "/shrink-iq-web-app" : "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // Set API URL based on mode
    "import.meta.env.VITE_API_BASE_URL":
      mode === "production"
        ? '"https://url-shortener-api-1d56.onrender.com/api"'
        : mode === "development:local"
        ? '"http://localhost:5000/api"'
        : '"/api"',
  },
  server: {
    port: 3000,
    host: true, // Allow external connections
    proxy:
      mode === "development"
        ? {
            "/api": {
              target: "https://url-shortener-api-1d56.onrender.com/",
              changeOrigin: true,
              secure: true,
            },
          }
        : mode === "development:local"
        ? {
            "/api": {
              target: "http://localhost:5000",
              changeOrigin: true,
              secure: false,
            },
          }
        : {},
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
}));