import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Plus, Link as LinkIcon, Copy, Check, Trash2, BarChart3, ExternalLink, Calendar, MousePointer } from "lucide-react";
import { format } from "date-fns";
import { urlsAPI, analyticsAPI } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";
import type { Url, CreateUrlRequest, AnalyticsData } from "../types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const DashboardPage: React.FC = () => {
  const [urls, setUrls] = useState<Url[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateUrlRequest>();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [urlsResponse, analyticsResponse] = await Promise.all([urlsAPI.getUserUrls(1, 20), analyticsAPI.getDashboardAnalytics()]);
      setUrls(urlsResponse.data);
      setAnalytics(analyticsResponse.data);
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: CreateUrlRequest) => {
    setIsSubmitting(true);
    try {
      const response = await urlsAPI.shortenUrl(data);
      setUrls([response.data, ...urls]);
      reset();
      setShowForm(false);
      toast.success("URL shortened successfully!");
      // Refresh analytics
      const analyticsResponse = await analyticsAPI.getDashboardAnalytics();
      setAnalytics(analyticsResponse.data);
    } catch (error) {
      // Error is handled by API interceptor
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const deleteUrl = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this URL?")) {
      return;
    }

    try {
      await urlsAPI.deleteUrl(id);
      setUrls(urls.filter((url) => url.id !== id));
      toast.success("URL deleted successfully");
      // Refresh analytics
      const analyticsResponse = await analyticsAPI.getDashboardAnalytics();
      setAnalytics(analyticsResponse.data);
    } catch (error) {
      // Error is handled by API interceptor
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <p className="text-lg text-muted-foreground">Manage your shortened URLs and view analytics</p>
        </div>

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total URLs</CardTitle>
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalUrls}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Clicks</CardTitle>
                <MousePointer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalClicks}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Clicks Today</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.clicksToday}</div>
                <p className="text-xs text-muted-foreground">Today</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">This Week</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.clicksThisWeek}</div>
                <p className="text-xs text-muted-foreground">Last 7 days</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Create URL Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Create New Short URL</CardTitle>
                <CardDescription>Generate a shortened URL for easy sharing</CardDescription>
              </div>
              <Button onClick={() => setShowForm(!showForm)} variant={showForm ? "outline" : "default"}>
                <Plus className="h-4 w-4 mr-2" />
                {showForm ? "Cancel" : "New URL"}
              </Button>
            </div>
          </CardHeader>

          {showForm && (
            <>
              <Separator />
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="originalUrl">Long URL</Label>
                    <Input
                      id="originalUrl"
                      type="url"
                      placeholder="https://example.com/very-long-url"
                      className={errors.originalUrl ? "border-destructive" : ""}
                      {...register("originalUrl", {
                        required: "URL is required",
                        pattern: {
                          value: /^https?:\/\/.+/,
                          message: "Please enter a valid URL starting with http:// or https://",
                        },
                      })}
                    />
                    {errors.originalUrl && <p className="text-sm text-destructive">{errors.originalUrl.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customSlug">Custom Slug (Optional)</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm text-muted-foreground">
                        short.ly/
                      </span>
                      <Input
                        id="customSlug"
                        type="text"
                        placeholder="my-custom-link"
                        className={`rounded-l-none ${errors.customSlug ? "border-destructive" : ""}`}
                        {...register("customSlug", {
                          pattern: {
                            value: /^[a-zA-Z0-9_-]+$/,
                            message: "Only letters, numbers, hyphens, and underscores are allowed",
                          },
                          minLength: {
                            value: 3,
                            message: "Custom slug must be at least 3 characters",
                          },
                          maxLength: {
                            value: 50,
                            message: "Custom slug must be less than 50 characters",
                          },
                        })}
                      />
                    </div>
                    {errors.customSlug && <p className="text-sm text-destructive">{errors.customSlug.message}</p>}
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                    {isSubmitting ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <LinkIcon className="h-4 w-4 mr-2" />
                        Shorten URL
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </>
          )}
        </Card>

        {/* URLs List */}
        <Card>
          <CardHeader>
            <CardTitle>Your URLs</CardTitle>
            <CardDescription>Manage and track your shortened URLs</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {urls.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <LinkIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No URLs yet</h3>
                <p className="text-muted-foreground mb-6 max-w-sm">
                  Create your first shortened URL to get started with link management and analytics
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create URL
                </Button>
              </div>
            ) : (
              <div className="divide-y">
                {urls.map((url, index) => (
                  <div key={url.id} className="p-6 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0 space-y-3">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-sm truncate">{url.originalUrl}</h3>
                          <Button variant="ghost" size="sm" asChild>
                            <a href={url.originalUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <code className="bg-muted px-2 py-1 rounded text-xs font-mono">{url.shortUrl}</code>
                          <div className="flex items-center gap-1">
                            <MousePointer className="h-3 w-3" />
                            <span>{url.clickCount} clicks</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{format(new Date(url.createdAt), "MMM d, yyyy")}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(url.shortUrl, url.id)}>
                          {copiedId === url.id ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                        </Button>

                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/analytics/${url.id}`}>
                            <BarChart3 className="h-4 w-4" />
                          </Link>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteUrl(url.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {index < urls.length - 1 && <Separator className="mt-6" />}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
