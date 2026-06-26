"use client";

import { StepBadge } from "./ShippingForm";

// ─────────────────────────────────────────────────────────────────────────────
// Delivery methods config
// ─────────────────────────────────────────────────────────────────────────────
export const DELIVERY_METHODS = [
  {
    id: "standard",
    label: "Standard Delivery",
    description: "3–5 business days",
    price: 0,
    icon: "local_shipping",
    badge: "FREE",
    badgeColor: "#16a34a",
  },
  {
    id: "priority",
    label: "Priority Delivery",
    description: "Next business day",
    price: 12,
    icon: "bolt",
    badge: "NEXT DAY",
    badgeColor: "var(--color-primary)",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// DeliveryMethod — Section 2 of checkout
//
// Props:
//   selected : "standard" | "priority"
//   onChange : (methodId) => void
// ─────────────────────────────────────────────────────────────────────────────
export default function DeliveryMethod({ selected, onChange }) {
  return (
    <section aria-labelledby="delivery-heading" className="flex flex-col gap-6">
      {/* ── Section header ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <StepBadge number={2} />
        <div>
          <h2
            id="delivery-heading"
            className="font-display font-extrabold tracking-tight"
            style={{ fontSize: "1.2rem", color: "var(--color-inverted-bg)" }}
          >
            Delivery Method
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--color-inverted-bg)", opacity: 0.45 }}>
            Choose how fast you'd like it
          </p>
        </div>
      </div>

      {/* ── Options ─────────────────────────────────────────────────────────── */}
      <fieldset className="flex flex-col gap-3 border-0 p-0 m-0">
        <legend className="sr-only">Delivery method</legend>

        {DELIVERY_METHODS.map((method) => {
          const isSelected = selected === method.id;
          return (
            <label
              key={method.id}
              htmlFor={`delivery-${method.id}`}
              className="flex items-center gap-4 rounded-2xl p-4 md:p-5 cursor-pointer transition-all duration-200"
              style={{
                background: isSelected
                  ? "color-mix(in srgb, var(--color-primary) 8%, var(--color-surface-low))"
                  : "var(--color-surface-low)",
                border: isSelected
                  ? "2px solid var(--color-primary)"
                  : "2px solid var(--color-outline-variant)",
                boxShadow: isSelected ? "0 0 0 4px color-mix(in srgb, var(--color-primary) 10%, transparent)" : "none",
              }}
            >
              {/* Hidden radio */}
              <input
                type="radio"
                id={`delivery-${method.id}`}
                name="delivery-method"
                value={method.id}
                checked={isSelected}
                onChange={() => onChange(method.id)}
                className="sr-only"
              />

              {/* Custom radio dot */}
              <div
                className="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200"
                style={{
                  borderColor: isSelected ? "var(--color-primary)" : "var(--color-outline-variant)",
                  background: isSelected ? "var(--color-primary)" : "transparent",
                }}
              >
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>

              {/* Icon */}
              <div
                className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: isSelected
                    ? "var(--color-primary)"
                    : "var(--color-surface-highest)",
                  transition: "background 0.2s",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "1.25rem",
                    color: isSelected ? "#fff" : "var(--color-inverted-bg)",
                    opacity: isSelected ? 1 : 0.5,
                    fontVariationSettings: "'FILL' 1",
                  }}
                >
                  {method.icon}
                </span>
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="font-display font-bold text-sm"
                    style={{ color: "var(--color-inverted-bg)" }}
                  >
                    {method.label}
                  </span>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      background: method.badgeColor,
                      color: "#fff",
                    }}
                  >
                    {method.badge}
                  </span>
                </div>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "var(--color-inverted-bg)", opacity: 0.5 }}
                >
                  {method.description}
                </p>
              </div>

              {/* Price */}
              <span
                className="font-display font-extrabold tabular-nums flex-shrink-0"
                style={{
                  fontSize: "1rem",
                  color: method.price === 0 ? "#16a34a" : "var(--color-inverted-bg)",
                }}
              >
                {method.price === 0 ? "FREE" : `$${method.price.toFixed(2)}`}
              </span>
            </label>
          );
        })}
      </fieldset>
    </section>
  );
}
