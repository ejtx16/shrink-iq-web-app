import { Url } from "../models/Url";
import { nanoid } from "nanoid";

export const generateShortCode = async (length: number = 7): Promise<string> => {
  return nanoid(length);
};

export const generateUniqueShortCode = async (): Promise<string> => {
  let shortCode: string;
  let isUnique = false;

  do {
    shortCode = await generateShortCode();
    const existingUrl = await Url.findOne({ shortCode });
    isUnique = !existingUrl;
  } while (!isUnique);

  return shortCode;
};

export const validateCustomSlug = (slug: string): boolean => {
  // Check if slug matches allowed pattern: alphanumeric, hyphens, underscores
  const slugPattern = /^[a-zA-Z0-9_-]+$/;

  // Check length (3-50 characters)
  if (slug.length < 3 || slug.length > 50) {
    return false;
  }

  return slugPattern.test(slug);
};

export const isCustomSlugAvailable = async (slug: string): Promise<boolean> => {
  const existingUrl = await Url.findOne({
    $or: [{ shortCode: slug }, { customSlug: slug }],
  });

  return !existingUrl;
};

export const formatShortUrl = (code: string): string => {
  // Use localhost with server port for local development
  // const serverPort = process.env.PORT || 5000;
  const serverUrl = process.env.BASE_URL || "http://localhost:5000";
  return `${serverUrl}/${code}`;
};
