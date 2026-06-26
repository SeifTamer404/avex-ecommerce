"use client";

import { useSelector } from "react-redux";
import { DELIVERY_METHODS } from "./DeliveryMethod";
import Image from "next/image";

// ─────────────────────────────────────────────────────────────────────────────
// CheckoutSummary — sticky right-column sidebar
//
// Props:
//   deliveryMethod : "standard" | "priority"  — controlled by checkout page
//   isSubmitting   : boolean                   — forwarded from CheckoutClient
// ─────────────────────────────────────────────────────────────────────────────

const TAX_RATE = 0.08; // display only — server recalculates

export default function CheckoutSummary({ deliveryMethod, isSubmitting = false }) {
  const items     = useSelector((state) => state.cart.items);
  const subtotal  = useSelector((state) => state.cart.subtotal);
  const itemCount = useSelector((state) => state.cart.itemCount);

  const method   = DELIVERY_METHODS.find((m) => m.id === deliveryMethod) ?? DELIVERY_METHODS[0];
  const shipping  = method.price;
  const tax       = subtotal * TAX_RATE;
  const total     = subtotal + shipping + tax;

  const fmt = (n) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

  return (
    <aside
      className="rounded-2xl flex flex-col gap-5 sticky top-28 self-start overflow-hidden"
      style={{
        background: "var(--color-surface-low)",
        border: "1px solid var(--color-outline-variant)",
      }}
      aria-label="Checkout order summary"
    >
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div
        className="px-5 pt-5 pb-4 flex items-center justify-between"
        style={{ borderBottom: "1px solid var(--color-outline-variant)" }}
      >
        <h2
          className="font-display font-extrabold tracking-tight"
          style={{ fontSize: "1.1rem", color: "var(--color-inverted-bg)" }}
        >
          Order Summary
        </h2>
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-full"
          style={{ background: "var(--color-primary)", color: "#fff" }}
        >
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </span>
      </div>

      {/* ── Item list ───────────────────────────────────────────────────────── */}
      <ul className="flex flex-col gap-3 px-5 max-h-56 overflow-y-auto" style={{ scrollbarWidth: "thin" }} role="list">
        {items.map((item) => (
          <li
            key={item.productId ?? item.slug}
            className="flex items-center gap-3"
          >
            {/* Quantity badge + image */}
            <div className="relative flex-shrink-0">
              <div
                className="w-11 h-11 rounded-lg overflow-hidden flex items-center justify-center"
                style={{ background: "var(--color-surface-highest)" }}
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={44}
                    height={44}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "1.1rem", color: "var(--color-inverted-bg)", opacity: 0.25 }}
                  >
                    image
                  </span>
                )}
              </div>
              <span
                className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] font-bold"
                style={{
                  background: "var(--color-primary)",
                  color: "#fff",
                  minWidth: "1.1rem",
                  minHeight: "1.1rem",
                  padding: "0 3px",
                  lineHeight: 1,
                }}
              >
                {item.quantity}
              </span>
            </div>

            {/* Name */}
            <p
              className="flex-1 min-w-0 text-xs font-medium line-clamp-2 leading-snug"
              style={{ color: "var(--color-inverted-bg)" }}
            >
              {item.name}
            </p>

            {/* Line total */}
            <span
              className="text-xs font-bold tabular-nums flex-shrink-0"
              style={{ color: "var(--color-inverted-bg)" }}
            >
              {fmt(item.price * item.quantity)}
            </span>
          </li>
        ))}
      </ul>

      {/* ── Divider ─────────────────────────────────────────────────────────── */}
      <div style={{ borderTop: "1px solid var(--color-outline-variant)" }} />

      {/* ── Cost breakdown ──────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 px-5">
        <SummaryRow label={`Subtotal (${itemCount} items)`} value={fmt(subtotal)} />

        <SummaryRow
          label={
            <span className="flex items-center gap-1.5">
              Delivery
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: method.badgeColor, color: "#fff" }}
              >
                {method.badge}
              </span>
            </span>
          }
          value={shipping === 0 ? <GreenText>FREE</GreenText> : fmt(shipping)}
        />

        <SummaryRow
          label={`Tax (${(TAX_RATE * 100).toFixed(0)}%)`}
          value={fmt(tax)}
          muted
        />
      </div>

      {/* ── Gradient total ──────────────────────────────────────────────────── */}
      <div
        className="mx-5 rounded-xl p-4 flex items-center justify-between"
        style={{
          background: "linear-gradient(135deg, var(--color-primary), var(--color-brand-purple, #7500cc))",
        }}
      >
        <span className="font-display font-bold text-white/80 text-sm">Total</span>
        <span className="font-display font-extrabold text-white tracking-tight" style={{ fontSize: "1.4rem" }}>
          {fmt(total)}
        </span>
      </div>

      {/* ── Place order button ──────────────────────────────────────────────── */}
      <div className="px-5 pb-5">
        <button
          type="submit"
          form="checkout-form"
          id="checkout-place-order"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 rounded-xl font-display font-bold transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          style={{
            background:
              "linear-gradient(135deg, var(--color-primary), var(--color-brand-purple, #7500cc))",
            color: "#fff",
            padding: "0.9rem 1.5rem",
            fontSize: "0.95rem",
            boxShadow: "0 4px 20px rgba(19,74,241,0.35)",
            letterSpacing: "-0.01em",
          }}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Placing Order…
            </>
          ) : (
            <>
              <span className="material-symbols-outlined" style={{ fontSize: "1.15rem" }}>
                check_circle
              </span>
              Place Order
            </>
          )}
        </button>

        <p
          className="text-center text-xs mt-3"
          style={{ color: "var(--color-inverted-bg)", opacity: 0.35 }}
        >
          By placing your order you agree to our{" "}
          <span className="underline cursor-pointer">Terms & Conditions</span>
        </p>
      </div>
    </aside>
  );
}

// ── Internal helpers ──────────────────────────────────────────────────────────

function SummaryRow({ label, value, muted = false }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span
        className="text-sm"
        style={{ color: "var(--color-inverted-bg)", opacity: muted ? 0.4 : 0.65 }}
      >
        {label}
      </span>
      <span
        className="text-sm font-semibold tabular-nums"
        style={{ color: "var(--color-inverted-bg)" }}
      >
        {value}
      </span>
    </div>
  );
}

function GreenText({ children }) {
  return <span style={{ color: "#16a34a", fontWeight: 700 }}>{children}</span>;
}
