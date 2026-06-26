import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";

/**
 * Lazily initialise the auth instance on first use so that the mongoose
 * connection is always established before we try to extract the native
 * MongoClient / Db handles.
 */
let _auth = null;

async function getAuth() {
  if (_auth) return _auth;

  try {
    // Reuse the Phase-0 cached connection — never opens a second socket
    await dbConnect();

    const client = mongoose.connection.getClient(); // raw MongoClient
    // Use client.db() — safer than mongoose.connection.db in mongoose v9
    const db = client.db();

    _auth = betterAuth({
      // ── Database ───────────────────────────────────────────────────────────
      database: mongodbAdapter(db, { client }),

      // ── Email / password auth ──────────────────────────────────────────────
      emailAndPassword: {
        enabled: true,
      },

      // ── Extended user schema ───────────────────────────────────────────────
      user: {
        additionalFields: {
          role: {
            type: "string",
            defaultValue: "customer",
            required: false,
          },
          points: {
            type: "number",
            defaultValue: 0,
            required: false,
          },
          avatar: {
            type: "string",
            required: false,
          },
          wishlist: {
            type: "string[]",
            defaultValue: [],
            required: false,
          },
          emailOrderUpdates: {
            type: "boolean",
            defaultValue: true,
            required: false,
          },
          emailPromotions: {
            type: "boolean",
            defaultValue: false,
            required: false,
          },
          emailNewArrivals: {
            type: "boolean",
            defaultValue: false,
            required: false,
          },
        },
      },

      // ── Runtime secrets ────────────────────────────────────────────────────
      secret: process.env.BETTER_AUTH_SECRET,
      baseURL: process.env.BETTER_AUTH_URL,
    });
  } catch (err) {
    console.error("[auth] Failed to initialise better-auth:", err);
    throw err; // re-throw so the route returns a proper 500 with a message
  }

  return _auth;
}

// Named export — route handlers call: const instance = await auth();
export { getAuth as auth };
