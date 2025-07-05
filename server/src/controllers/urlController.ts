import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { Url } from "../models/Url";
import { AuthRequest, CreateUrlRequest } from "../types";
import { generateUniqueShortCode, validateCustomSlug, isCustomSlugAvailable, formatShortUrl } from "../utils/urlGenerator";

export const shortenUrl = async (req: AuthRequest & Request<{}, {}, CreateUrlRequest>, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: "Validation failed", details: errors.array() });
      return;
    }

    const { originalUrl, customSlug } = req.body;
    const userId = req.user?.userId;

    let shortCode: string;

    // Handle custom slug
    if (customSlug) {
      // if (!validateCustomSlug(customSlug)) {
      //   res.status(400).json({
      //     error: "Invalid custom slug. Must be 3-50 characters and contain only letters, numbers, hyphens, and underscores.",
      //   });
      //   return;
      // }

      const isAvailable = await isCustomSlugAvailable(customSlug);
      if (!isAvailable) {
        res.status(400).json({ error: "Custom slug is already taken" });
        return;
      }

      shortCode = customSlug;
    } else {
      shortCode = await generateUniqueShortCode();
    }

    // Create URL document
    const urlDoc = new Url({
      originalUrl,
      shortCode,
      customSlug: customSlug || undefined,
      userId: userId || undefined,
    });

    await urlDoc.save();

    const shortUrl = formatShortUrl(shortCode);

    res.status(201).json({
      message: "URL shortened successfully",
      data: {
        id: urlDoc._id,
        originalUrl: urlDoc.originalUrl,
        shortCode: urlDoc.shortCode,
        shortUrl,
        customSlug: urlDoc.customSlug,
        clickCount: urlDoc.clickCount,
        createdAt: urlDoc.createdAt,
      },
    });
  } catch (error) {
    console.error("URL shortening error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const redirectUrl = async (req: Request<{ shortCode: string }>, res: Response): Promise<void> => {
  try {
    const { shortCode } = req.params;

    const urlDoc = await Url.findOne({
      $or: [{ shortCode }, { customSlug: shortCode }],
    });

    if (!urlDoc) {
      res.status(404).json({ error: "Short URL not found" });
      return;
    }

    // Check if URL has expired
    if (urlDoc.expiresAt && urlDoc.expiresAt < new Date()) {
      res.status(410).json({ error: "Short URL has expired" });
      return;
    }

    // Track click
    const clickData = {
      timestamp: new Date(),
      ip: req.ip || "unknown",
      userAgent: req.get("User-Agent") || "unknown",
      referrer: req.get("Referer") || "",
    };

    // Update click count and add click data
    await Url.findByIdAndUpdate(urlDoc._id, {
      $inc: { clickCount: 1 },
      $push: { clicks: clickData },
    });

    // Redirect to original URL
    res.redirect(urlDoc.originalUrl);
  } catch (error) {
    console.error("URL redirect error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserUrls = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const urls = await Url.find({ userId })
      .select("-clicks") // Exclude clicks array for performance
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Url.countDocuments({ userId });

    const urlsWithShortUrls = urls.map((url) => ({
      id: url._id,
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      shortUrl: formatShortUrl(url.shortCode),
      customSlug: url.customSlug,
      clickCount: url.clickCount,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
    }));

    res.json({
      data: urlsWithShortUrls,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get user URLs error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteUrl = async (req: AuthRequest & Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const urlDoc = await Url.findOne({ _id: id, userId });
    if (!urlDoc) {
      res.status(404).json({ error: "URL not found or you do not have permission to delete it" });
      return;
    }

    await Url.findByIdAndDelete(id);

    res.json({ message: "URL deleted successfully" });
  } catch (error) {
    console.error("Delete URL error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUrlDetails = async (req: AuthRequest & Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const urlDoc = await Url.findOne({ _id: id, userId });
    if (!urlDoc) {
      res.status(404).json({ error: "URL not found or you do not have permission to view it" });
      return;
    }

    res.json({
      data: {
        id: urlDoc._id,
        originalUrl: urlDoc.originalUrl,
        shortCode: urlDoc.shortCode,
        shortUrl: formatShortUrl(urlDoc.shortCode),
        customSlug: urlDoc.customSlug,
        clickCount: urlDoc.clickCount,
        clicks: urlDoc.clicks.slice(-50), // Return last 50 clicks
        createdAt: urlDoc.createdAt,
        updatedAt: urlDoc.updatedAt,
        expiresAt: urlDoc.expiresAt,
      },
    });
  } catch (error) {
    console.error("Get URL details error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
