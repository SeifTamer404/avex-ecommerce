"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSession } from "@/lib/auth-client";
import { userActions } from "@/store/slices/userSlice";

/**
 * AuthSync — no visual output, mounts once inside ReduxProvider.
 *
 * Watches the better-auth session and keeps Redux userSlice in sync:
 *   - session present  → dispatch setUser()  (Navbar, dashboards, etc. react instantly)
 *   - session absent   → dispatch clearUser() (logout clears Redux state)
 */
export default function AuthSync() {
  const dispatch = useDispatch();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    // Don't touch Redux until the session hook has resolved
    if (isPending) return;

    if (session?.user) {
      const { id, name, email, image, role, points, wishlist } = session.user;
      dispatch(
        userActions.setUser({
          id,
          name: name ?? "",
          email: email ?? "",
          avatar: image ?? "",   // better-auth stores the avatar URL as `image`
          role: role ?? "customer",
          points: points ?? 0,
          wishlist: wishlist ?? [],
        }),
      );
    } else {
      dispatch(userActions.clearUser());
    }
  }, [session, isPending, dispatch]);

  return null;
}
