export interface User {
  id: string;
  email: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface Url {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  customSlug?: string;
  clickCount: number;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
}

export interface UrlWithClicks extends Url {
  clicks: Click[];
}

export interface Click {
  timestamp: string;
  ip: string;
  userAgent: string;
  referrer?: string;
  urlId?: string;
}

export interface CreateUrlRequest {
  originalUrl: string;
  customSlug?: string;
}

export interface UrlResponse {
  message: string;
  data: Url;
}

export interface UrlsResponse {
  data: Url[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AnalyticsData {
  totalUrls: number;
  totalClicks: number;
  clicksToday: number;
  clicksThisWeek: number;
  clicksThisMonth: number;
  recentClicks: Click[];
  topReferrers: { referrer: string; count: number }[];
}

export interface UrlAnalytics {
  url: {
    id: string;
    originalUrl: string;
    shortCode: string;
    customSlug?: string;
    totalClicks: number;
    createdAt: string;
  };
  analytics: {
    clicksLast30Days: number;
    dailyClicks: { date: string; clicks: number }[];
    browserStats: { browser: string; count: number }[];
    referrerStats: { referrer: string; count: number }[];
    recentClicks: Click[];
  };
}

export interface ApiError {
  error: string;
  details?: any;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
}
