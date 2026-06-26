"use client";

import Link from "next/link";

// ── Constants ──────────────────────────────────────────────────────────────────
const FREE_SHIPPING_THRESHOLD = 50;  // free shipping above this amount
const FLAT_SHIPPING_RATE      = 5.99;
const TAX_RATE                = 0.08; // 8% — display only; server recalculates

// ─────────────────────────────────────────────────────────────────────────────
// OrderSummary
// Right-column panel on /cart.
//
// Props:
//   subtotal : number  — from cartSlice
//   itemCount: number  — from cartSlice
// ─────────────────────────────────────────────────────────────────────────────
export default function OrderSummary({ subtotal, itemCount }) {
  const shipping  = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_RATE;
  const tax       = subtotal * TAX_RATE;
  const total     = subtotal + shipping + tax;

  const fmt = (n) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

  return (
    <aside
      className="rounded-2xl p-6 flex flex-col gap-5 sticky top-28 self-start"
      style={{
        background: "var(--color-surface-low)",
        border: "1px solid var(--color-outline-variant)",
      }}
      aria-label="Order summary"
    >
      {/* ── Heading ────────────────────────────────────────────────────────── */}
      <h2
        className="font-display font-extrabold tracking-tight"
        style={{ fontSize: "1.15rem", color: "var(--color-inverted-bg)" }}
      >
        Order Summary
      </h2>

      {/* ── Line items ─────────────────────────────────────────────────────── */}
      <ul className="flex flex-col gap-3" role="list">
        {/* Subtotal */}
        <SummaryRow label={`Subtotal (${itemCount} item${itemCount !== 1 ? "s" : ""})`} value={fmt(subtotal)} />

        {/* Shipping */}
        <SummaryRow
          label="Shipping"
          value={
            shipping === 0 ? (
              <span
                className="text-sm font-bold"
                style={{ color: "#16a34a" }}
              >
                FREE
              </span>
            ) : (
              fmt(shipping)
            )
          }
          hint={
            shipping > 0
              ? `Add ${fmt(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping`
              : null
          }
        />

        {/* Tax */}
        <SummaryRow
          label={`Tax (${(TAX_RATE * 100).toFixed(0)}%)`}
          value={fmt(tax)}
          muted
        />
      </ul>

      {/* ── Divider ────────────────────────────────────────────────────────── */}
      <hr style={{ borderColor: "var(--color-outline-variant)", margin: 0 }} />

      {/* ── Gradient total ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <span
          className="font-display font-bold"
          style={{ color: "var(--color-inverted-bg)", fontSize: "0.95rem" }}
        >
          Total
        </span>
        <span
          className="font-display font-extrabold tracking-tight"
          style={{
            fontSize: "1.6rem",
            backgroundImage:
              "linear-gradient(135deg, var(--color-primary), var(--color-brand-purple, #7500cc))",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {fmt(total)}
        </span>
      </div>

      {/* ── Tax disclaimer ─────────────────────────────────────────────────── */}
      <p
        className="text-xs text-center leading-relaxed"
        style={{ color: "var(--color-inverted-bg)", opacity: 0.4 }}
      >
        Tax is estimated. Final amount confirmed at checkout.
      </p>

      {/* ── Proceed to Checkout ────────────────────────────────────────────── */}
      <Link
        href="/checkout"
        id="cart-checkout-btn"
        className="flex items-center justify-center gap-2 rounded-xl font-display font-bold transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 active:scale-95"
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
        <span className="material-symbols-outlined" style={{ fontSize: "1.15rem" }}>
          lock
        </span>
        Proceed to Checkout
      </Link>

      {/* ── Trust badges ───────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        {[
          { icon: "verified_user",  text: "Secure SSL checkout" },
          { icon: "autorenew",      text: "Free 30-day returns" },
          { icon: "local_shipping", text: "Fast, tracked delivery" },
        ].map(({ icon, text }) => (
          <div
            key={text}
            className="flex items-center gap-2 text-xs"
            style={{ color: "var(--color-inverted-bg)", opacity: 0.5 }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "1rem", color: "var(--color-primary)", opacity: 1 }}
            >
              {icon}
            </span>
            {text}
          </div>
        ))}
      </div>
    </aside>
  );
}

// ── Internal helpers ──────────────────────────────────────────────────────────

function SummaryRow({ label, value, hint, muted = false }) {
  return (
    <li className="flex flex-col gap-0.5">
      <div className="flex items-center justify-between gap-4">
        <span
          className="text-sm"
          style={{
            color: "var(--color-inverted-bg)",
            opacity: muted ? 0.45 : 0.7,
          }}
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
      {hint && (
        <p
          className="text-xs"
          style={{ color: "var(--color-primary)", opacity: 0.85 }}
        >
          {hint}
        </p>
      )}
    </li>
  );
}
