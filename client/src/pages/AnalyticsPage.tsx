import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, Copy, Check, Calendar, MousePointer, Globe } from "lucide-react";
import { format } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { analyticsAPI } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";
import type { UrlAnalytics } from "../types";

const AnalyticsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [analytics, setAnalytics] = useState<UrlAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      loadAnalytics();
    }
  }, [id]);

  const loadAnalytics = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const response = await analyticsAPI.getUrlAnalytics(id);
      setAnalytics(response.data);
    } catch (error) {
      toast.error("Failed to load analytics data");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (analytics?.url) {
      try {
        await navigator.clipboard.writeText(`short.ly/${analytics.url.shortCode}`);
        setCopied(true);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        toast.error("Failed to copy to clipboard");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Analytics not found</h2>
          <p className="text-gray-600 mb-4">The URL analytics could not be loaded.</p>
          <Link to="/dashboard" className="btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const { url, analytics: analyticsData } = analytics;

  // Prepare chart colors
  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">URL Analytics</h1>
              <p className="text-gray-600">Detailed analytics for your shortened URL</p>
            </div>
          </div>
        </div>

        {/* URL Info Card */}
        <div className="card mb-8">
          <div className="card-body">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-gray-900 mb-2">URL Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Original:</span>
                    <a
                      href={url.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-800 text-sm truncate flex items-center space-x-1"
                    >
                      <span className="truncate">{url.originalUrl}</span>
                      <ExternalLink className="h-3 w-3 flex-shrink-0" />
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Short URL:</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">short.ly/{url.shortCode}</span>
                      <button onClick={copyToClipboard} className="p-1 text-gray-400 hover:text-gray-600 rounded">
                        {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Created: {format(new Date(url.createdAt), "MMM d, yyyy")}</span>
                    {url.customSlug && <span>Custom slug: {url.customSlug}</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="card-body">
              <div className="flex items-center">
                <MousePointer className="h-8 w-8 text-primary-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                  <p className="text-2xl font-bold text-gray-900">{url.totalClicks}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Last 30 Days</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.clicksLast30Days}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="flex items-center">
                <Globe className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Unique Referrers</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.referrerStats.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Daily Clicks Chart */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Daily Clicks (Last 30 Days)</h3>
            </div>
            <div className="card-body">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData.dailyClicks}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" stroke="#6b7280" tickFormatter={(value) => format(new Date(value), "MMM d")} />
                    <YAxis stroke="#6b7280" />
                    <Tooltip labelFormatter={(value) => format(new Date(value), "MMM d, yyyy")} formatter={(value) => [value, "Clicks"]} />
                    <Line type="monotone" dataKey="clicks" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Browser Stats */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Browser Distribution</h3>
            </div>
            <div className="card-body">
              {analyticsData.browserStats.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData.browserStats}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ browser, percent }) => `${browser} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {analyticsData.browserStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, "Clicks"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">No browser data available</div>
              )}
            </div>
          </div>
        </div>

        {/* Referrer Stats and Recent Clicks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Referrers */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Top Referrers</h3>
            </div>
            <div className="card-body p-0">
              {analyticsData.referrerStats.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {analyticsData.referrerStats.slice(0, 10).map((referrer, index) => (
                    <div key={index} className="px-6 py-4 flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {referrer.referrer === "Direct" ? "Direct Traffic" : referrer.referrer}
                        </p>
                      </div>
                      <div className="ml-4 flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{referrer.count} clicks</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full"
                            style={{
                              width: `${(referrer.count / analyticsData.referrerStats[0].count) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-6 py-8 text-center text-gray-500">No referrer data available</div>
              )}
            </div>
          </div>

          {/* Recent Clicks */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Recent Clicks</h3>
            </div>
            <div className="card-body p-0">
              {analyticsData.recentClicks.length > 0 ? (
                <div className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
                  {analyticsData.recentClicks.map((click, index) => (
                    <div key={index} className="px-6 py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{click.referrer || "Direct"}</p>
                          <p className="text-xs text-gray-500 truncate">{click.userAgent}</p>
                        </div>
                        <div className="ml-4 text-right">
                          <p className="text-xs text-gray-500">{format(new Date(click.timestamp), "MMM d, HH:mm")}</p>
                          <p className="text-xs text-gray-400">{click.ip}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-6 py-8 text-center text-gray-500">No clicks recorded yet</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
