import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Next.js 16 proxy (formerly "middleware") — cookie-only check, no database hit.
 *
 * getSessionCookie() reads the better-auth session cookie from the request
 * headers. It does NOT validate the session against the database — that
 * lightweight check is intentional here; actual data-level protection must
 * happen inside server components / API routes via auth.api.getSession().
 *
 * Rules:
 *  1. Protected routes (/account/*, /checkout/*) → redirect to /login if no cookie
 *  2. Guest-only routes (/login, /register) → redirect to / if cookie present
 */
export function proxy(request) {
  const { pathname } = request.nextUrl;
  const sessionCookie = getSessionCookie(request);

  // ── 1. Protected routes ────────────────────────────────────────────────────
  const isProtected =
    pathname.startsWith("/account") || pathname.startsWith("/checkout");

  if (isProtected && !sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    // Preserve intended destination so login can redirect back after auth
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── 2. Guest-only routes ───────────────────────────────────────────────────
  const isGuestOnly =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  if (isGuestOnly && sessionCookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/account/:path*",
    "/checkout/:path*",
    "/login",
    "/register",
  ],
};
