import mongoose, { Schema, Document } from "mongoose";

export interface IClickDocument {
  timestamp: Date;
  ip: string;
  userAgent: string;
  referrer?: string;
}

export interface IUrlDocument extends Document {
  originalUrl: string;
  shortCode: string;
  customSlug?: string;
  userId?: mongoose.Types.ObjectId;
  clickCount: number;
  clicks: IClickDocument[];
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const clickSchema = new Schema<IClickDocument>(
  {
    timestamp: {
      type: Date,
      default: Date.now,
    },
    ip: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    referrer: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const urlSchema = new Schema<IUrlDocument>(
  {
    originalUrl: {
      type: String,
      required: true,
      validate: {
        validator: function (url: string) {
          try {
            new URL(url);
            return true;
          } catch {
            return false;
          }
        },
        message: "Please provide a valid URL",
      },
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customSlug: {
      type: String,
      sparse: true,
      unique: true,
      match: [/^[a-zA-Z0-9_-]+$/, "Custom slug can only contain letters, numbers, hyphens, and underscores"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    clickCount: {
      type: Number,
      default: 0,
    },
    clicks: [clickSchema],
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
urlSchema.index({ createdAt: 1 });
urlSchema.index({ userId: 1, createdAt: -1 });

export const Url = mongoose.model<IUrlDocument>("Url", urlSchema);
