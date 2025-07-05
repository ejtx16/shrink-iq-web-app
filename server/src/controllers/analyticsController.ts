import { Response } from "express";
import { Url } from "../models/Url";
import { AuthRequest, AnalyticsData } from "../types";

export const getDashboardAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    // Get all URLs for the user
    const userUrls = await Url.find({ userId }).select("clickCount clicks createdAt");

    // Calculate totals
    const totalUrls = userUrls.length;
    const totalClicks = userUrls.reduce((sum, url) => sum + url.clickCount, 0);

    // Get date ranges
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Count clicks by time period
    let clicksToday = 0;
    let clicksThisWeek = 0;
    let clicksThisMonth = 0;
    const recentClicks: any[] = [];
    const referrerMap = new Map<string, number>();

    userUrls.forEach((url) => {
      url.clicks.forEach((click) => {
        const clickDate = new Date(click.timestamp);

        if (clickDate >= todayStart) clicksToday++;
        if (clickDate >= weekStart) clicksThisWeek++;
        if (clickDate >= monthStart) clicksThisMonth++;

        // Collect recent clicks (last 100)
        recentClicks.push({
          timestamp: click.timestamp,
          ip: click.ip,
          userAgent: click.userAgent,
          referrer: click.referrer,
          urlId: url._id,
        });

        // Count referrers
        const referrer = click.referrer || "Direct";
        referrerMap.set(referrer, (referrerMap.get(referrer) || 0) + 1);
      });
    });

    // Sort recent clicks by timestamp (newest first) and limit to 50
    recentClicks.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const limitedRecentClicks = recentClicks.slice(0, 50);

    // Convert referrer map to sorted array
    const topReferrers = Array.from(referrerMap.entries())
      .map(([referrer, count]) => ({ referrer, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const analyticsData: AnalyticsData = {
      totalClicks,
      clicksToday,
      clicksThisWeek,
      clicksThisMonth,
      recentClicks: limitedRecentClicks,
      topReferrers,
    };

    res.json({
      data: {
        totalUrls,
        ...analyticsData,
      },
    });
  } catch (error) {
    console.error("Get dashboard analytics error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUrlAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const urlDoc = await Url.findOne({ _id: id, userId });
    if (!urlDoc) {
      res.status(404).json({ error: "URL not found or you do not have permission to view it" });
      return;
    }

    // Process clicks data
    const clicks = urlDoc.clicks;
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Daily clicks for the last 30 days
    const dailyClicks = new Map<string, number>();
    const last30DaysClicks = clicks.filter((click) => new Date(click.timestamp) >= last30Days);

    // Initialize last 30 days with 0 clicks
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateKey = date.toISOString().split("T")[0];
      dailyClicks.set(dateKey, 0);
    }

    // Count actual clicks
    last30DaysClicks.forEach((click) => {
      const dateKey = new Date(click.timestamp).toISOString().split("T")[0];
      dailyClicks.set(dateKey, (dailyClicks.get(dateKey) || 0) + 1);
    });

    // Convert to array for frontend
    const clicksChartData = Array.from(dailyClicks.entries()).map(([date, clicks]) => ({
      date,
      clicks,
    }));

    // Browser/User Agent analysis
    const browserMap = new Map<string, number>();
    last30DaysClicks.forEach((click) => {
      const userAgent = click.userAgent.toLowerCase();
      let browser = "Other";

      if (userAgent.includes("chrome")) browser = "Chrome";
      else if (userAgent.includes("firefox")) browser = "Firefox";
      else if (userAgent.includes("safari")) browser = "Safari";
      else if (userAgent.includes("edge")) browser = "Edge";

      browserMap.set(browser, (browserMap.get(browser) || 0) + 1);
    });

    const browserStats = Array.from(browserMap.entries()).map(([browser, count]) => ({
      browser,
      count,
    }));

    // Referrer analysis
    const referrerMap = new Map<string, number>();
    last30DaysClicks.forEach((click) => {
      const referrer = click.referrer || "Direct";
      referrerMap.set(referrer, (referrerMap.get(referrer) || 0) + 1);
    });

    const referrerStats = Array.from(referrerMap.entries())
      .map(([referrer, count]) => ({ referrer, count }))
      .sort((a, b) => b.count - a.count);

    res.json({
      data: {
        url: {
          id: urlDoc._id,
          originalUrl: urlDoc.originalUrl,
          shortCode: urlDoc.shortCode,
          customSlug: urlDoc.customSlug,
          totalClicks: urlDoc.clickCount,
          createdAt: urlDoc.createdAt,
        },
        analytics: {
          clicksLast30Days: last30DaysClicks.length,
          dailyClicks: clicksChartData,
          browserStats,
          referrerStats,
          recentClicks: clicks.slice(-20).reverse(), // Last 20 clicks, newest first
        },
      },
    });
  } catch (error) {
    console.error("Get URL analytics error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
