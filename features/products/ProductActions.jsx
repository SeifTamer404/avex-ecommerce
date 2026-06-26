"use client";

import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { cartActions } from "@/store/slices/cartSlice";
import { uiActions } from "@/store/slices/uiSlice";

/**
 * ProductActions — client island for the two primary CTA buttons.
 * Isolated so the rest of the product page stays server-rendered.
 */
export default function ProductActions({ product }) {
  const dispatch = useDispatch();
  const router   = useRouter();

  const cartPayload = {
    productId: product._id,   // stable identity key used by cartSlice
    slug:      product.slug,  // kept for URLs / display
    name:      product.name,
    price:     product.price,
    image:     product.images?.[0] ?? "",
    quantity:  1,
  };

  function handleAddToCart() {
    dispatch(cartActions.addToCart(cartPayload));
    dispatch(
      uiActions.addNotification({
        id:      `cart-${product.slug}-${Date.now()}`,
        message: `${product.name} added to cart`,
        type:    "success",
      }),
    );
  }

  function handleBuyNow() {
    dispatch(cartActions.addToCart(cartPayload));
    router.push("/checkout");
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        onClick={handleAddToCart}
        className={[
          "flex-1 flex items-center justify-center gap-2",
          "px-6 py-3.5 rounded-xl text-sm font-bold",
          "bg-[var(--color-primary)] text-white",
          "hover:opacity-90 active:scale-[0.98] transition-all duration-150",
          "shadow-lg shadow-[var(--color-primary)]/25",
        ].join(" ")}
      >
        <span className="material-symbols-outlined text-lg">shopping_cart</span>
        Add to Cart
      </button>

      <button
        onClick={handleBuyNow}
        className={[
          "flex-1 flex items-center justify-center gap-2",
          "px-6 py-3.5 rounded-xl text-sm font-bold",
          "bg-[var(--color-surface-low)] text-[var(--color-inverted-bg)]",
          "border border-[var(--color-outline-variant)]/30",
          "hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)] active:scale-[0.98] transition-all duration-150",
        ].join(" ")}
      >
        <span className="material-symbols-outlined text-lg">bolt</span>
        Buy Now
      </button>
    </div>
  );
}
