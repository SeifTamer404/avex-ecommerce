"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { userActions } from "@/store/slices/userSlice";
import { uiActions } from "@/store/slices/uiSlice";
import { addToWishlist, removeFromWishlist } from "@/features/user/actions";

export default function WishlistButton({ productId }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const wishlist = useSelector((state) => state.user.wishlist);
  const isWishlisted = wishlist.includes(productId);

  const [isPending, setIsPending] = useState(false);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push(`/login?returnUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    if (isPending) return;

    // Optimistic UI update
    dispatch(userActions.toggleWishlist(productId));
    setIsPending(true);

    try {
      if (isWishlisted) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(productId);
      }
    } catch (error) {
      // Revert optimistic update
      dispatch(userActions.toggleWishlist(productId));
      dispatch(
        uiActions.addNotification({
          id: `wishlist-err-${Date.now()}`,
          message: "Failed to update wishlist. Please try again.",
          type: "error",
        })
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      disabled={isPending}
      className={`
        absolute top-3 right-3 w-8 h-8 rounded-full 
        flex items-center justify-center backdrop-blur-md
        transition-all duration-200 ease-out z-10 
        ${
          isWishlisted
            ? "opacity-100 bg-[var(--color-surface)] shadow-md shadow-red-500/10 scale-100"
            : "opacity-0 group-hover:opacity-100 bg-[var(--color-surface)]/60 hover:bg-[var(--color-surface)] scale-95 group-hover:scale-100"
        }
      `}
    >
      <span
        className="material-symbols-outlined transition-colors duration-200"
        style={{
          fontSize: "1.1rem",
          color: isWishlisted ? "#ef4444" : "var(--color-inverted-bg)",
          fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0",
        }}
      >
        favorite
      </span>
    </button>
  );
}
