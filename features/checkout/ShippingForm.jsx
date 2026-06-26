"use client";

import Input from "@/components/ui/Input";

// ─────────────────────────────────────────────────────────────────────────────
// ShippingForm — Section 1 of checkout
//
// Props:
//   fields   : { fullName, email, phone, address, city, state, zip, country }
//   onChange : (field, value) => void
//   errors   : { [field]: string }
// ─────────────────────────────────────────────────────────────────────────────
export default function ShippingForm({ fields, onChange, errors = {} }) {
  const field = (name, props) => ({
    value: fields[name] ?? "",
    onChange: (e) => onChange(name, e.target.value),
    error: errors[name],
    ...props,
  });

  return (
    <section aria-labelledby="shipping-heading" className="flex flex-col gap-6">
      {/* ── Section header ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <StepBadge number={1} />
        <div>
          <h2
            id="shipping-heading"
            className="font-display font-extrabold tracking-tight"
            style={{ fontSize: "1.2rem", color: "var(--color-inverted-bg)" }}
          >
            Shipping Address
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--color-inverted-bg)", opacity: 0.45 }}>
            Where should we deliver your order?
          </p>
        </div>
      </div>

      {/* ── Form card ───────────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl p-5 md:p-6 flex flex-col gap-4"
        style={{
          background: "var(--color-surface-low)",
          border: "1px solid var(--color-outline-variant)",
        }}
      >
        {/* Row 1: Full name + Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full name"
            icon="person"
            iconPosition="left"
            placeholder="Jane Smith"
            autoComplete="name"
            id="checkout-full-name"
            {...field("fullName")}
          />
          <Input
            label="Email address"
            type="email"
            icon="email"
            iconPosition="left"
            placeholder="jane@example.com"
            autoComplete="email"
            id="checkout-email"
            {...field("email")}
          />
        </div>

        {/* Row 2: Phone */}
        <Input
          label="Phone number"
          type="tel"
          icon="phone"
          iconPosition="left"
          placeholder="+1 (555) 000-0000"
          autoComplete="tel"
          id="checkout-phone"
          {...field("phone")}
        />

        {/* Row 3: Street address */}
        <Input
          label="Street address"
          icon="home"
          iconPosition="left"
          placeholder="123 Main St, Apt 4B"
          autoComplete="street-address"
          id="checkout-address"
          {...field("address")}
        />

        {/* Row 4: City + State + ZIP */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="City"
            placeholder="New York"
            autoComplete="address-level2"
            id="checkout-city"
            {...field("city")}
          />
          <Input
            label="State / Province"
            placeholder="NY"
            autoComplete="address-level1"
            id="checkout-state"
            {...field("state")}
          />
          <Input
            label="ZIP / Postal code"
            placeholder="10001"
            autoComplete="postal-code"
            id="checkout-zip"
            {...field("zip")}
          />
        </div>

        {/* Row 5: Country */}
        <div className="relative w-full flex flex-col gap-1.5">
          <label
            htmlFor="checkout-country"
            className="text-sm font-medium"
            style={{ color: "var(--color-inverted-bg)" }}
          >
            Country
          </label>
          <div className="relative">
            <span
              className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none select-none"
              style={{ fontSize: "1.15rem", color: "var(--color-inverted-bg)", opacity: 0.4 }}
            >
              public
            </span>
            <select
              id="checkout-country"
              value={fields.country ?? "US"}
              onChange={(e) => onChange("country", e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-[var(--radius-sm)] outline-none border-none transition-all focus:ring-2 focus:ring-primary appearance-none"
              style={{
                background: "var(--color-surface-highest)",
                color: "var(--color-inverted-bg)",
              }}
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="EG">Egypt</option>
              <option value="AE">United Arab Emirates</option>
              <option value="SA">Saudi Arabia</option>
            </select>
            <span
              className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none select-none"
              style={{ fontSize: "1.1rem", color: "var(--color-inverted-bg)", opacity: 0.4 }}
            >
              expand_more
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Shared step badge ─────────────────────────────────────────────────────────
export function StepBadge({ number, done = false }) {
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-display font-bold text-sm transition-all duration-300"
      style={{
        background: done
          ? "#16a34a"
          : "linear-gradient(135deg, var(--color-primary), var(--color-brand-purple, #7500cc))",
        color: "#fff",
        boxShadow: done
          ? "0 2px 10px rgba(22,163,74,0.35)"
          : "0 2px 10px rgba(19,74,241,0.35)",
      }}
    >
      {done ? (
        <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
          check
        </span>
      ) : (
        number
      )}
    </div>
  );
}
