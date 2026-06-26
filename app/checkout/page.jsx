import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import CheckoutClient from "@/features/checkout/CheckoutClient";

// ─────────────────────────────────────────────────────────────────────────────
// /checkout — Server component
//
// 1. Reads the session via better-auth's server-side API.
// 2. Redirects to /login if the user is not authenticated.
// 3. Extracts name + email from the session and passes them as prefill props
//    to CheckoutClient, which owns all mutable form state client-side.
// ─────────────────────────────────────────────────────────────────────────────

export const metadata = {
  title: "Checkout — AVEX",
  description: "Complete your purchase securely.",
};

export default async function CheckoutPage() {
  // ── Fetch session server-side ──────────────────────────────────────────────
  let session = null;

  try {
    const instance = await auth();
    const headersList = await headers();

    session = await instance.api.getSession({
      headers: headersList,
    });
  } catch (err) {
    // Auth initialisation can fail locally if the DB isn't seeded.
    // In that case we fall through and let middleware handle auth enforcement.
    console.error("[checkout] session fetch error:", err);
  }

  // Redirect unauthenticated users — middleware also guards this route,
  // but an explicit server-side redirect gives a cleaner UX.
  if (!session?.user) {
    redirect("/login?next=/checkout");
  }

  // ── Extract prefill data ───────────────────────────────────────────────────
  const prefill = {
    fullName: session.user.name  ?? "",
    email:    session.user.email ?? "",
  };

  return <CheckoutClient prefill={prefill} />;
}
