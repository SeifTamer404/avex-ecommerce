"use client";

import Image from "next/image";
import { useDispatch } from "react-redux";
import { cartActions } from "@/store/slices/cartSlice";

// ─────────────────────────────────────────────────────────────────────────────
// CartItem
// Renders a single row in the /cart page item list.
//
// Props:
//   item — CartItem shape from Redux:
//     { productId, slug, name, price, image, quantity }
// ─────────────────────────────────────────────────────────────────────────────
export default function CartItem({ item }) {
  const dispatch = useDispatch();

  // productId is the canonical key; fall back to slug for items that were
  // added before productId was in the payload (AddToCartButton omits it).
  const key = item.productId ?? item.slug;

  const handleIncrease = () =>
    dispatch(
      cartActions.updateQuantity({ productId: key, newQty: item.quantity + 1 })
    );

  const handleDecrease = () =>
    dispatch(
      cartActions.updateQuantity({ productId: key, newQty: item.quantity - 1 })
    );

  const handleRemove = () =>
    dispatch(cartActions.removeFromCart(key));

  const lineTotal = (item.price * item.quantity).toFixed(2);

  return (
    <li
      className="group flex gap-4 md:gap-5 items-start p-4 md:p-5 rounded-2xl border transition-all duration-200 hover:shadow-md"
      style={{
        background: "var(--color-surface-low)",
        borderColor: "var(--color-outline-variant)",
      }}
    >
      {/* ── Product image ──────────────────────────────────────────────────── */}
      <div
        className="flex-shrink-0 rounded-xl overflow-hidden flex items-center justify-center"
        style={{
          width: 88,
          height: 88,
          background: "var(--color-surface-highest)",
          minWidth: 88,
        }}
      >
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            width={88}
            height={88}
            className="object-cover w-full h-full"
          />
        ) : (
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "2rem", color: "var(--color-inverted-bg)", opacity: 0.2 }}
          >
            image
          </span>
        )}
      </div>

      {/* ── Item details ───────────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        {/* Name */}
        <p
          className="font-display font-semibold leading-snug line-clamp-2"
          style={{ fontSize: "0.95rem", color: "var(--color-inverted-bg)" }}
        >
          {item.name}
        </p>

        {/* Unit price */}
        <p
          className="text-xs font-medium"
          style={{ color: "var(--color-inverted-bg)", opacity: 0.45 }}
        >
          ${item.price.toFixed(2)} each
        </p>

        {/* Quantity controls + line total */}
        <div className="flex items-center justify-between flex-wrap gap-3 mt-1">
          {/* Stepper */}
          <div
            className="flex items-center gap-0.5 rounded-full p-0.5"
            style={{
              border: "1.5px solid var(--color-outline-variant)",
              background: "var(--color-surface)",
            }}
          >
            {/* Decrease / delete */}
            <button
              onClick={handleDecrease}
              aria-label={
                item.quantity <= 1
                  ? `Remove ${item.name}`
                  : `Decrease quantity of ${item.name}`
              }
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 hover:bg-red-500 hover:text-white"
              style={{ color: "var(--color-inverted-bg)" }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "1rem" }}
              >
                {item.quantity <= 1 ? "delete" : "remove"}
              </span>
            </button>

            {/* Quantity display */}
            <span
              className="font-bold tabular-nums text-center"
              style={{
                minWidth: 28,
                fontSize: "0.9rem",
                color: "var(--color-inverted-bg)",
              }}
            >
              {item.quantity}
            </span>

            {/* Increase */}
            <button
              onClick={handleIncrease}
              aria-label={`Increase quantity of ${item.name}`}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 hover:bg-[var(--color-primary)] hover:text-white"
              style={{ color: "var(--color-inverted-bg)" }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "1rem" }}
              >
                add
              </span>
            </button>
          </div>

          {/* Line total */}
          <span
            className="font-display font-extrabold tracking-tight"
            style={{
              fontSize: "1.1rem",
              color: "var(--color-inverted-bg)",
            }}
          >
            ${lineTotal}
          </span>
        </div>
      </div>

      {/* ── Remove button ──────────────────────────────────────────────────── */}
      <button
        onClick={handleRemove}
        aria-label={`Remove ${item.name} from cart`}
        className="flex-shrink-0 mt-0.5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 opacity-30 hover:opacity-100 hover:bg-red-500/10 hover:text-red-500"
        style={{ color: "var(--color-inverted-bg)" }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>
          close
        </span>
      </button>
    </li>
  );
}
