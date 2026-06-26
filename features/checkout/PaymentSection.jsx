"use client";

import { StepBadge } from "./ShippingForm";

// ─────────────────────────────────────────────────────────────────────────────
// PaymentSection — Section 3 of checkout
//
// No real payment collection. Shows:
//  - Cash on Delivery (selected by default)
//  - A disabled card UI for visual completeness
//
// Props:
//   selected : "cod" | "card"
//   onChange : (method) => void
// ─────────────────────────────────────────────────────────────────────────────
export default function PaymentSection({ selected, onChange }) {
  return (
    <section aria-labelledby="payment-heading" className="flex flex-col gap-6">
      {/* ── Section header ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <StepBadge number={3} />
        <div>
          <h2
            id="payment-heading"
            className="font-display font-extrabold tracking-tight"
            style={{ fontSize: "1.2rem", color: "var(--color-inverted-bg)" }}
          >
            Payment
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--color-inverted-bg)", opacity: 0.45 }}>
            How would you like to pay?
          </p>
        </div>
      </div>

      {/* ── Options ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">

        {/* ── Cash on Delivery ────────────────────────────────────────────── */}
        <label
          htmlFor="payment-cod"
          className="flex items-center gap-4 rounded-2xl p-4 md:p-5 cursor-pointer transition-all duration-200"
          style={{
            background: selected === "cod"
              ? "color-mix(in srgb, var(--color-primary) 8%, var(--color-surface-low))"
              : "var(--color-surface-low)",
            border: selected === "cod"
              ? "2px solid var(--color-primary)"
              : "2px solid var(--color-outline-variant)",
            boxShadow: selected === "cod"
              ? "0 0 0 4px color-mix(in srgb, var(--color-primary) 10%, transparent)"
              : "none",
          }}
        >
          <input
            type="radio"
            id="payment-cod"
            name="payment-method"
            value="cod"
            checked={selected === "cod"}
            onChange={() => onChange("cod")}
            className="sr-only"
          />

          {/* Custom radio */}
          <div
            className="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200"
            style={{
              borderColor: selected === "cod" ? "var(--color-primary)" : "var(--color-outline-variant)",
              background: selected === "cod" ? "var(--color-primary)" : "transparent",
            }}
          >
            {selected === "cod" && <div className="w-2 h-2 rounded-full bg-white" />}
          </div>

          {/* Icon */}
          <div
            className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: selected === "cod" ? "var(--color-primary)" : "var(--color-surface-highest)",
              transition: "background 0.2s",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: "1.25rem",
                color: selected === "cod" ? "#fff" : "var(--color-inverted-bg)",
                opacity: selected === "cod" ? 1 : 0.5,
                fontVariationSettings: "'FILL' 1",
              }}
            >
              payments
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-display font-bold text-sm" style={{ color: "var(--color-inverted-bg)" }}>
              Cash on Delivery
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-inverted-bg)", opacity: 0.5 }}>
              Pay in cash when your order arrives
            </p>
          </div>
        </label>

        {/* ── Credit / Debit card (disabled placeholder) ──────────────────── */}
        <div
          className="flex flex-col gap-4 rounded-2xl p-4 md:p-5 opacity-50 cursor-not-allowed"
          style={{
            background: "var(--color-surface-low)",
            border: "2px solid var(--color-outline-variant)",
          }}
          aria-disabled="true"
          title="Online card payments coming soon"
        >
          <div className="flex items-center gap-4">
            {/* Disabled radio */}
            <div
              className="flex-shrink-0 w-5 h-5 rounded-full border-2"
              style={{ borderColor: "var(--color-outline-variant)" }}
            />

            {/* Icon */}
            <div
              className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "var(--color-surface-highest)" }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "1.25rem", color: "var(--color-inverted-bg)", opacity: 0.4, fontVariationSettings: "'FILL' 1" }}
              >
                credit_card
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-display font-bold text-sm" style={{ color: "var(--color-inverted-bg)" }}>
                  Credit / Debit Card
                </p>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "var(--color-surface-highest)", color: "var(--color-inverted-bg)" }}
                >
                  COMING SOON
                </span>
              </div>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-inverted-bg)", opacity: 0.5 }}>
                Visa, Mastercard, Amex, and more
              </p>
            </div>
          </div>

          {/* Fake card UI */}
          <div
            className="rounded-xl p-4 select-none"
            style={{
              background: "linear-gradient(135deg, #1e293b, #0f172a)",
              color: "#fff",
            }}
            aria-hidden="true"
          >
            <div className="flex justify-between items-start mb-6">
              <span className="text-xs font-bold tracking-widest opacity-60 uppercase">Card Number</span>
              <div className="flex gap-1.5">
                {/* Mastercard-style circles */}
                <div className="w-6 h-6 rounded-full bg-red-500 opacity-80" />
                <div className="w-6 h-6 rounded-full bg-yellow-400 opacity-80 -ml-3" />
              </div>
            </div>
            <p className="font-mono tracking-widest text-base mb-4 opacity-70">
              •••• •••• •••• ••••
            </p>
            <div className="flex justify-between text-xs opacity-50">
              <span>CARD HOLDER NAME</span>
              <span>MM / YY</span>
            </div>
          </div>

          {/* Input row placeholders */}
          <div className="grid grid-cols-2 gap-3">
            <div
              className="rounded-[var(--radius-sm)] h-9"
              style={{ background: "var(--color-surface-highest)" }}
            />
            <div
              className="rounded-[var(--radius-sm)] h-9"
              style={{ background: "var(--color-surface-highest)" }}
            />
          </div>
        </div>
      </div>

      {/* ── Security note ───────────────────────────────────────────────────── */}
      <p
        className="flex items-center gap-1.5 text-xs"
        style={{ color: "var(--color-inverted-bg)", opacity: 0.4 }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: "1rem", opacity: 1, color: "#16a34a" }}>
          verified_user
        </span>
        Your order details are protected with 256-bit SSL encryption
      </p>
    </section>
  );
}
