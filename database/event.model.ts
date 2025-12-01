import mongoose, { Schema, Model, Document } from "mongoose";

/**
 * Event document interface
 * Defines the structure of an Event document in MongoDB
 */
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: "online" | "offline" | "hybrid";
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Event schema definition
 * Defines validation rules and field types for the Event model
 */
const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: "Title cannot be empty",
      },
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: "Description cannot be empty",
      },
    },
    overview: {
      type: String,
      required: [true, "Overview is required"],
      trim: true,
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: "Overview cannot be empty",
      },
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: "Image URL cannot be empty",
      },
    },
    venue: {
      type: String,
      required: [true, "Venue is required"],
      trim: true,
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: "Venue cannot be empty",
      },
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: "Location cannot be empty",
      },
    },
    date: {
      type: String,
      required: [true, "Date is required"],
      trim: true,
    },
    time: {
      type: String,
      required: [true, "Time is required"],
      trim: true,
    },
    mode: {
      type: String,
      required: [true, "Mode is required"],
      enum: {
        values: ["online", "offline", "hybrid"],
        message: "Mode must be one of: online, offline, hybrid",
      },
    },
    audience: {
      type: String,
      required: [true, "Audience is required"],
      trim: true,
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: "Audience cannot be empty",
      },
    },
    agenda: {
      type: [String],
      required: [true, "Agenda is required"],
      validate: {
        validator: (value: string[]) => value.length > 0,
        message: "Agenda must contain at least one item",
      },
    },
    organizer: {
      type: String,
      required: [true, "Organizer is required"],
      trim: true,
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: "Organizer cannot be empty",
      },
    },
    tags: {
      type: [String],
      required: [true, "Tags are required"],
      validate: {
        validator: (value: string[]) => value.length > 0,
        message: "Tags must contain at least one item",
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

/**
 * Generates a URL-friendly slug from a string
 * Converts to lowercase, replaces spaces and special chars with hyphens
 */
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Normalizes date string to ISO format
 * Attempts to parse and convert various date formats to ISO string
 */
function normalizeDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // If parsing fails, return original string
      return dateString;
    }
    return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD format
  } catch {
    return dateString;
  }
}

/**
 * Normalizes time string to consistent format (HH:MM or HH:MM:SS)
 * Removes extra spaces and ensures consistent formatting
 */
function normalizeTime(timeString: string): string {
  return timeString.trim().replace(/\s+/g, " ");
}

/**
 * Pre-save hook: Generates slug, normalizes date and time
 * Only regenerates slug if title has changed
 */
eventSchema.pre("save", function (this: IEvent) {
  // Generate slug only if title is modified or slug doesn't exist
  if (this.isModified("title") || !this.slug) {
    this.slug = generateSlug(this.title);
  }

  // Normalize date to ISO format if date is modified
  if (this.isModified("date")) {
    this.date = normalizeDate(this.date);
  }

  // Normalize time format if time is modified
  if (this.isModified("time")) {
    this.time = normalizeTime(this.time);
  }
});

// Create unique index on slug for faster lookups
eventSchema.index({ slug: 1 }, { unique: true });

/**
 * Event model
 * Mongoose model for Event documents
 */
const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", eventSchema);

export default Event;
