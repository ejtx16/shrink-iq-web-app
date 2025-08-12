import axios from "axios";
import toast from "react-hot-toast";
import type {
  AuthResponse,
  LoginForm,
  RegisterForm,
  CreateUrlRequest,
  UrlResponse,
  UrlsResponse,
  AnalyticsData,
  UrlAnalytics,
  User,
  Url,
} from "../types";

const api = axios.create({
  baseURL: (import.meta as any).env.VITE_API_BASE_URL || "/api",
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || "An unexpected error occurred";

    // Don't show toast for 401 errors on silent requests
    if (error.response?.status === 401 && !error.config?.showErrorToast) {
      return Promise.reject(error);
    }

    // Show error toast for other errors
    if (error.config?.showErrorToast !== false) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (data: RegisterForm): Promise<AuthResponse> => {
    const response = await api.post("/auth/register", {
      email: data.email,
      password: data.password,
    });
    return response.data;
  },

  login: async (data: LoginForm): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  getProfile: async (): Promise<{ user: User }> => {
    const response = await api.get("/auth/profile", {
      showErrorToast: false,
    } as any);
    return response.data;
  },
};

// URLs API
export const urlsAPI = {
  shortenUrl: async (data: CreateUrlRequest): Promise<UrlResponse> => {
    const response = await api.post("/urls/shorten", data);
    return response.data;
  },

  getUserUrls: async (page: number = 1, limit: number = 10): Promise<UrlsResponse> => {
    const response = await api.get(`/urls/my?page=${page}&limit=${limit}`);
    return response.data;
  },

  getUrlDetails: async (id: string): Promise<{ data: Url }> => {
    const response = await api.get(`/urls/${id}`);
    return response.data;
  },

  deleteUrl: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/urls/${id}`);
    return response.data;
  },
};

// Analytics API
export const analyticsAPI = {
  getDashboardAnalytics: async (): Promise<{ data: AnalyticsData }> => {
    const response = await api.get("/analytics/dashboard");
    return response.data;
  },

  getUrlAnalytics: async (id: string): Promise<{ data: UrlAnalytics }> => {
    const response = await api.get(`/analytics/url/${id}`);
    return response.data;
  },
};

// Utility functions
export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

export default api;
