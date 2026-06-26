import mongoose from "mongoose";

const MONGODB_URI = process.env.DB_URI;

// Cache connection across hot-reloads in dev (avoids "too many connections")
let cached = global._mongooseCache;
if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

export default async function dbConnect() {
  if (!MONGODB_URI) {
    throw new Error(
      "DB_URI is not defined. Check your .env.local file."
    );
  }

  // Already connected — return immediately
  if (cached.conn) return cached.conn;

  // Connection in progress — wait for it
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, { bufferCommands: false })
      .then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
