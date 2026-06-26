"use client";

import { useDispatch } from "react-redux";
import { cartActions } from "@/store/slices/cartSlice";
import { uiActions } from "@/store/slices/uiSlice";

/**
 * AddToCartButton — the only interactive slice of ProductCard.
 * Isolated as a client island so the parent card stays server-renderable.
 *
 * Props:
 *   product — plain product object from .lean() / server action
 */
export default function AddToCartButton({ product }) {
  const dispatch = useDispatch();

  function handleAdd(e) {
    // Stop propagation so clicking + doesn't trigger a parent <Link>
    e.preventDefault();
    e.stopPropagation();

    dispatch(
      cartActions.addToCart({
        productId: product._id,        // ← the key the slice uses for all ops
        slug:      product.slug,
        name:      product.name,
        price:     product.price,
        image:     product.images?.[0] ?? "",
        quantity:  1,
      }),
    );

    // Toast notification — auto-dismissed by the notification renderer
    dispatch(
      uiActions.addNotification({
        id: `cart-${product.slug}-${Date.now()}`,
        message: `${product.name} added to cart`,
        type: "success",
      }),
    );
  }

  return (
    <button
      onClick={handleAdd}
      aria-label={`Add ${product.name} to cart`}
      className={[
        "absolute bottom-3 right-3",
        "w-9 h-9 rounded-full",
        "bg-[var(--color-primary)] text-white",
        "flex items-center justify-center",
        "shadow-lg shadow-[var(--color-primary)]/30",
        "opacity-0 translate-y-1",
        "group-hover:opacity-100 group-hover:translate-y-0",
        "transition-all duration-200 ease-out",
        "hover:scale-110 active:scale-95",
        "z-10",
      ].join(" ")}
    >
      <span className="material-symbols-outlined text-base leading-none">
        add
      </span>
    </button>
  );
}
