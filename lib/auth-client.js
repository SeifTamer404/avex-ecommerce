import { createAuthClient } from "better-auth/react";

/**
 * Client-side auth companion.
 * Import only in 'use client' components.
 *
 * Usage:
 *   import { authClient, useSession } from "@/lib/auth-client";
 *
 *   // Hook (reactive session state)
 *   const { data: session, isPending } = useSession();
 *
 *   // Actions
 *   await authClient.signUp.email({ email, password, name });
 *   await authClient.signIn.email({ email, password });
 *   await authClient.signOut();
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
});

// Convenience named exports so call-sites stay tidy
export const { useSession, signIn, signUp, signOut } = authClient;
