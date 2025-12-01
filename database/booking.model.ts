import mongoose, { Schema, Model, Document, Types } from "mongoose";
import Event from "./event.model";

/**
 * Booking document interface
 * Defines the structure of a Booking document in MongoDB
 */
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Booking schema definition
 * Defines validation rules and field types for the Booking model
 */
const bookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      required: [true, "Event ID is required"],
      ref: "Event",
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string) => {
          // Email validation regex
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value);
        },
        message: "Please provide a valid email address",
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

/**
 * Pre-save hook: Validates that the referenced event exists
 * Throws an error if the eventId does not correspond to an existing Event
 */
bookingSchema.pre("save", async function (this: IBooking) {
  // Check if eventId exists in the Event collection
  const event = await Event.findById(this.eventId);
  if (!event) {
    throw new Error(`Event with ID ${this.eventId} does not exist`);
  }
});

// Create index on eventId for faster queries
bookingSchema.index({ eventId: 1 });

/**
 * Booking model
 * Mongoose model for Booking documents
 */
const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", bookingSchema);

export default Booking;
