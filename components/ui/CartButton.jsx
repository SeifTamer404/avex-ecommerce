"use client";

import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "@/store/slices/uiSlice";

/**
 * CartButton — standalone "use client" component that reads cart.itemCount
 * from Redux and dispatches toggleCart() on click.
 * Used inside the desktop Navbar only (md+).
 */
export default function CartButton() {
  const dispatch = useDispatch();
  const cartItemCount = useSelector((state) => state.cart.itemCount);

  const handleOpenCart = () => {
    dispatch(uiActions.toggleCart());
  };

  return (
    <button
      onClick={handleOpenCart}
      aria-label="Open cart"
      className="hidden md:flex relative p-2 text-[var(--color-inverted-bg)]/60 hover:text-primary transition-colors items-center justify-center"
    >
      <span className="material-symbols-outlined text-xl">shopping_cart</span>

      {cartItemCount > 0 && (
        <span className="absolute top-1 right-1 bg-primary text-white text-[9px] font-bold w-[18px] h-[18px] flex items-center justify-center rounded-full leading-none">
          {cartItemCount > 99 ? "99+" : cartItemCount}
        </span>
      )}
    </button>
  );
}
