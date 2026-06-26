"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "@/store/slices/uiSlice";

/**
 * BottomNav — mobile-only bottom navigation bar (md:hidden).
 * Reads cart.itemCount from Redux for the live cart badge.
 * Cart icon dispatches toggleCart() instead of navigating to /cart.
 */
export default function BottomNav() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const cartItemCount = useSelector((state) => state.cart.itemCount);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  const handleCartOpen = () => {
    dispatch(uiActions.toggleCart());
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[var(--color-surface)] border-t border-[var(--color-outline-variant)] z-50 px-6 py-3 flex justify-between items-center pb-safe">
      {/* Home */}
      <Link
        href="/"
        className={`flex flex-col items-center gap-1 transition-colors ${pathname === "/" ? "text-[var(--color-primary)]" : "text-[var(--color-inverted-bg)]/50 hover:text-[var(--color-inverted-bg)]"}`}
      >
        <span className="material-symbols-outlined text-2xl">home</span>
        <span className="text-[10px] font-medium tracking-tight">Home</span>
      </Link>

      {/* Categories */}
      <Link
        href="/categories"
        className={`flex flex-col items-center gap-1 transition-colors ${pathname.startsWith("/categories") ? "text-[var(--color-primary)]" : "text-[var(--color-inverted-bg)]/50 hover:text-[var(--color-inverted-bg)]"}`}
      >
        <span className="material-symbols-outlined text-2xl">grid_view</span>
        <span className="text-[10px] font-medium tracking-tight">Categories</span>
      </Link>

      {/* Cart — dispatches Redux action (opens cart drawer/modal) */}
      <button
        onClick={handleCartOpen}
        aria-label="Open cart"
        className="flex flex-col items-center gap-1 text-[var(--color-inverted-bg)]/50 hover:text-[var(--color-inverted-bg)] transition-colors relative"
      >
        <span className="material-symbols-outlined text-2xl">shopping_cart</span>
        <span className="text-[10px] font-medium tracking-tight">Cart</span>

        {/* Live badge from Redux */}
        {cartItemCount > 0 && (
          <span className="absolute -top-1 right-0 bg-primary text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full leading-none">
            {cartItemCount > 99 ? "99+" : cartItemCount}
          </span>
        )}
      </button>

      {/* Account */}
      <Link
        href={isAuthenticated ? "/account" : "/login"}
        className={`flex flex-col items-center gap-1 transition-colors ${pathname.startsWith("/account") || pathname === "/login" ? "text-[var(--color-primary)]" : "text-[var(--color-inverted-bg)]/50 hover:text-[var(--color-inverted-bg)]"}`}
      >
        <span className="material-symbols-outlined text-2xl">account_circle</span>
        <span className="text-[10px] font-medium tracking-tight">Account</span>
      </Link>
    </nav>
  );
}
