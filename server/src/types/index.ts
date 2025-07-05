import { Request } from "express";

export interface IUser {
  _id: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUrl {
  _id: string;
  originalUrl: string;
  shortCode: string;
  customSlug?: string;
  userId?: string;
  clickCount: number;
  clicks: IClick[];
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IClick {
  timestamp: Date;
  ip: string;
  userAgent: string;
  referrer?: string;
}

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export interface CreateUrlRequest {
  originalUrl: string;
  customSlug?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface AnalyticsData {
  totalClicks: number;
  clicksToday: number;
  clicksThisWeek: number;
  clicksThisMonth: number;
  recentClicks: IClick[];
  topReferrers: { referrer: string; count: number }[];
}
