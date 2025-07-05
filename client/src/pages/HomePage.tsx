import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Link as LinkIcon, Copy, Check, Zap, Shield, BarChart3 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { urlsAPI } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";
import type { CreateUrlRequest } from "../types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [shortenedUrl, setShortenedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateUrlRequest>();

  const onSubmit = async (data: CreateUrlRequest) => {
    setIsLoading(true);
    try {
      const response = await urlsAPI.shortenUrl(data);
      setShortenedUrl(response.data.shortUrl);
      reset();
      toast.success("URL shortened successfully!");
    } catch (error) {
      // Error is handled by API interceptor
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (shortenedUrl) {
      try {
        await navigator.clipboard.writeText(shortenedUrl);
        setCopied(true);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        toast.error("Failed to copy to clipboard");
      }
    }
  };

  const features = [
    {
      icon: <Zap className="h-8 w-8 text-primary-600" />,
      title: "Lightning Fast",
      description: "Create shortened URLs in milliseconds with our optimized infrastructure.",
    },
    {
      icon: <Shield className="h-8 w-8 text-primary-600" />,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with 99.9% uptime guarantee.",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-primary-600" />,
      title: "Detailed Analytics",
      description: "Track clicks, analyze traffic, and understand your audience.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-primary-100 mb-6">
              Shorten Your URLs,
              <br />
              <span className="text-primary-200">Amplify Your Reach</span>
            </h1>
            <p className="text-xl text-primary-100 mb-12 max-w-3xl mx-auto">
              Create short, memorable links that are easy to share. Track every click with detailed analytics and boost your marketing
              campaigns.
            </p>
          </div>
        </div>
      </section>

      {/* URL Shortener Form */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary-900 mb-4">Shorten Your URL</h2>
            <p className="text-gray-600">Paste your long URL below and get a short, shareable link instantly.</p>
          </div>

          <div className="card max-w-2xl mx-auto">
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="originalUrl" className="block text-sm font-medium text-gray-700 mb-2">
                    Long URL
                  </label>
                  <Input
                    type="url"
                    id="originalUrl"
                    placeholder="https://example.com/very-long-url-that-needs-shortening"
                    className={`input-field ${errors.originalUrl ? "border-red-500" : ""}`}
                    {...register("originalUrl", {
                      required: "URL is required",
                      pattern: {
                        value: /^https?:\/\/[^\s]+\.[^\s]+/,
                        message: "Please enter a valid URL starting with http:// or https://",
                      },
                    })}
                  />
                  {errors.originalUrl && <p className="text-red-500 text-sm mt-1">{errors.originalUrl.message}</p>}
                </div>

                <div>
                  <label htmlFor="customSlug" className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Slug (Optional)
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      short.ly/
                    </span>
                    <Input
                      type="text"
                      id="customSlug"
                      placeholder="my-custom-link"
                      className={`input-field rounded-l-none ${errors.customSlug ? "border-red-500" : ""}`}
                      // {...register("customSlug", {
                      //   pattern: {
                      //     value: /^[a-zA-Z0-9_-]+$/,
                      //     message: "Only letters, numbers, hyphens, and underscores are allowed",
                      //   },
                      //   minLength: {
                      //     value: 3,
                      //     message: "Custom slug must be at least 3 characters",
                      //   },
                      //   maxLength: {
                      //     value: 50,
                      //     message: "Custom slug must be less than 50 characters",
                      //   },
                      // })}
                    />
                  </div>
                  {errors.customSlug && <p className="text-red-500 text-sm mt-1">{errors.customSlug.message}</p>}
                </div>

                <Button type="submit" disabled={isLoading} className="btn-primary w-full flex items-center justify-center space-x-2">
                  {isLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <LinkIcon className="h-5 w-5" />
                      <span>Shorten URL</span>
                    </>
                  )}
                </Button>
              </form>

              {shortenedUrl && (
                <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-800 mb-1">Your shortened URL:</p>
                      <p className="text-green-700 font-mono break-all">{shortenedUrl}</p>
                    </div>
                    <Button
                      onClick={copyToClipboard}
                      className="ml-4 p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-lg transition-colors"
                      title="Copy to clipboard"
                    >
                      {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>
              )}

              {!isAuthenticated && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Want more features?</strong>
                    <Link to="/register" className="text-blue-600 hover:text-blue-800 underline ml-1">
                      Create an account
                    </Link>{" "}
                    to track analytics, manage your links, and customize slugs.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose ShortLink?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our URL shortener provides everything you need to create, manage, and track your shortened links.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-16 bg-primary-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-primary-100 mb-4">Ready to Get Started?</h2>
            <p className="text-primary-100 mb-8 text-lg">Join thousands of users who trust ShortLink for their URL shortening needs.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary bg-primary-100 text-primary-600 hover:bg-gray-100">
                Create Free Account
              </Link>
              <Link to="/login" className="btn-secondary bg-primary-700 text-primary-100 hover:bg-primary-800 border-primary-700">
                Sign In
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
