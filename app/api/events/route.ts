import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Event } from "@/database";
import type { IEvent } from "@/database/event.model";

/**
 * Request body interface for creating an event
 * Excludes auto-generated fields (slug, createdAt, updatedAt)
 * Derived from IEvent to avoid duplication
 */
type CreateEventRequest = Omit<
  IEvent,
  "slug" | "createdAt" | "updatedAt" | "_id" | "__v"
>;

/**
 * API response interface
 */
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

/**
 * POST /api/events
 * Creates a new event in the database
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<IEvent>>> {
  try {
    // Parse request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON in request body",
          errors: ["Request body must be valid JSON"],
        },
        { status: 400 }
      );
    }

    // Basic type check - detailed validation will be handled by Mongoose schema
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body",
          errors: ["Request body must be a valid object"],
        },
        { status: 400 }
      );
    }

    // Connect to database
    try {
      await connectDB();
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return NextResponse.json(
        {
          success: false,
          message: "Database connection failed",
          errors: ["Unable to connect to database. Please try again later."],
        },
        { status: 500 }
      );
    }

    // Create event
    const eventData = body as CreateEventRequest;
    let newEvent: IEvent;

    try {
      newEvent = await Event.create(eventData);
    } catch (mongooseError: unknown) {
      // Handle Mongoose validation errors
      if (
        mongooseError &&
        typeof mongooseError === "object" &&
        "code" in mongooseError
      ) {
        // Handle duplicate key error (e.g., duplicate slug)
        if (mongooseError.code === 11000) {
          return NextResponse.json(
            {
              success: false,
              message: "Event creation failed",
              errors: ["An event with similar details already exists"],
            },
            { status: 409 }
          );
        }
      }

      // Handle Mongoose validation errors
      // Mongoose schema validations are already defined in the model
      if (
        mongooseError &&
        typeof mongooseError === "object" &&
        "errors" in mongooseError
      ) {
        const validationErrors = Object.values(
          (mongooseError as { errors: Record<string, { message: string }> })
            .errors
        ).map((err) => err.message);
        return NextResponse.json(
          {
            success: false,
            message: "Validation failed",
            errors: validationErrors,
          },
          { status: 400 }
        );
      }

      // Generic error handling
      console.error("Event creation error:", mongooseError);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to create event",
          errors: ["An unexpected error occurred while creating the event"],
        },
        { status: 500 }
      );
    }

    // Convert Mongoose document to plain object
    const eventObject = newEvent.toObject();

    // Remove internal Mongoose fields from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { __v, ...eventResponse } = eventObject;

    return NextResponse.json(
      {
        success: true,
        message: "Event created successfully",
        data: eventResponse as IEvent,
      },
      { status: 201 }
    );
  } catch (error) {
    // Handle unexpected errors
    console.error("Unexpected error in POST /api/events:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        errors: ["An unexpected error occurred. Please try again later."],
      },
      { status: 500 }
    );
  }
}
