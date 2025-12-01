import mongoose, { Mongoose } from "mongoose";

/**
 * MongoDB connection interface
 * Stores the cached connection and promise to prevent multiple connections
 */
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Declare global variable to cache the connection
// This prevents multiple connections during development hot-reloading
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

/**
 * Cached connection object
 * Uses global variable in development to persist across hot-reloads
 * Uses module-level variable in production
 */
const cached: MongooseCache = (global.mongoose = {
  conn: null,
  promise: null,
});

/**
 * Establishes a connection to MongoDB using Mongoose
 * Implements connection caching to prevent multiple connections
 *
 * @returns {Promise<Mongoose>} Mongoose connection instance
 * @throws {Error} If MONGODB_URI environment variable is not set
 */
async function connectDB(): Promise<Mongoose> {
  // Check if MongoDB URI is provided
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local"
    );
  }

  // Return cached connection if it exists
  if (cached.conn) {
    return cached.conn;
  }

  // If no cached promise exists, create a new connection
  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false, // Disable mongoose buffering
    };

    // Create connection promise
    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance: Mongoose) => {
        return mongooseInstance;
      });
  }

  try {
    // Wait for connection to be established
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset promise on error to allow retry
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

/**
 * Disconnects from MongoDB
 * Useful for cleanup in testing or graceful shutdown
 *
 * @returns {Promise<void>}
 */
async function disconnectDB(): Promise<void> {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
  }
}

export { connectDB, disconnectDB };
export default connectDB;
