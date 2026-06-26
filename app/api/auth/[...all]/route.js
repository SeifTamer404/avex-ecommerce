import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

/**
 * Catch-all route — every Better Auth endpoint (sign-up, sign-in,
 * sign-out, session, etc.) is served through here.
 *
 * auth() is an async getter that lazily boots the singleton on first call
 * so we await it before handing off to toNextJsHandler.
 */

const handler = toNextJsHandler(await auth());

export const { GET, POST } = handler;
