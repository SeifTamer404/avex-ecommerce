"use client";

import { useState, useCallback, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import ShippingForm from "@/features/checkout/ShippingForm";
import DeliveryMethod from "@/features/checkout/DeliveryMethod";
import PaymentSection from "@/features/checkout/PaymentSection";
import CheckoutSummary from "@/features/checkout/CheckoutSummary";
import { placeOrderAction } from "@/features/orders/actions";
import { cartActions } from "@/store/slices/cartSlice";
import { uiActions } from "@/store/slices/uiSlice";

// ─────────────────────────────────────────────────────────────────────────────
// CheckoutClient — owns all mutable checkout state
//
// Props:
//   prefill : { fullName, email } — seeded from the server-fetched session
// ─────────────────────────────────────────────────────────────────────────────
export default function CheckoutClient({ prefill = {} }) {
  // ── Shipping address state ─────────────────────────────────────────────────
  const [fields, setFields] = useState({
    fullName: prefill.fullName ?? "",
    email:    prefill.email    ?? "",
    phone:    "",
    address:  "",
    city:     "",
    state:    "",
    zip:      "",
    country:  "US",
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const handleFieldChange = useCallback((name, value) => {
    setFields((prev) => ({ ...prev, [name]: value }));
    // Clear the error for that field on edit
    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  // ── Delivery method state ──────────────────────────────────────────────────
  const [deliveryMethod, setDeliveryMethod] = useState("standard");

  // ── Payment method state ───────────────────────────────────────────────────
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // ── Submission state ──────────────────────────────────────────────────────
  const [serverError, setServerError] = useState("");
  const [isPending, startTransition] = useTransition();

  const dispatch = useDispatch();
  const router   = useRouter();
  const cartItems = useSelector((state) => state.cart.items);

  // ── Form submission ────────────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    setServerError("");

    // ── Client-side validation (fast feedback before hitting the server) ──
    const required = ["fullName", "email", "address", "city", "state", "zip"];
    const errors = {};
    required.forEach((key) => {
      if (!fields[key]?.trim()) errors[key] = "This field is required";
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const firstKey = Object.keys(errors)[0];
      document
        .getElementById(
          `checkout-${firstKey.replace(/([A-Z])/g, "-$1").toLowerCase()}`
        )
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // ── Call the server action inside a transition ────────────────────────
    startTransition(async () => {
      const result = await placeOrderAction({
        // Send only productId + quantity — never trust client prices
        cartItems: cartItems.map((item) => ({
          productId: item.productId ?? item.slug, // slug fallback for legacy items
          quantity:  item.quantity,
        })),
        shippingAddress: fields,
        deliveryMethod,
        paymentMethod,
      });

      if (!result.ok) {
        setServerError(result.error ?? "Something went wrong. Please try again.");
        window.scrollTo({ top: 0, behavior: "smooth" });
        dispatch(
          uiActions.addNotification({
            id: `error-${Date.now()}`,
            message: result.error ?? "Order failed. Please try again.",
            type: "error",
          })
        );
        return;
      }

      // ── Success: clear cart then navigate ────────────────────────────────
      dispatch(cartActions.clearCart());
      dispatch(
        uiActions.addNotification({
          id: `order-${result.orderId}`,
          message: "Order placed successfully!",
          type: "success",
          duration: 4000,
        })
      );
      router.push(`/order-confirmed/${result.orderId}`);
    });
  };

  const isSubmitting = isPending;

  return (
    <div className="flex flex-col gap-10 pb-10">
      {/* ── Page header ──────────────────────────────────────────────────────── */}
      <header>
        <p
          className="text-xs font-bold uppercase tracking-widest mb-1"
          style={{ color: "var(--color-primary)" }}
        >
          Almost there
        </p>
        <h1
          className="font-display font-extrabold tracking-tight"
          style={{ fontSize: "2rem", color: "var(--color-inverted-bg)" }}
        >
          Checkout
        </h1>
      </header>

      {/* ── Progress breadcrumb ──────────────────────────────────────────────── */}
      <CheckoutProgress />

      {/* ── Server-side error banner ─────────────────────────────────────────── */}
      {serverError && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl p-4"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1.5px solid rgba(239,68,68,0.35)",
          }}
        >
          <span
            className="material-symbols-outlined flex-shrink-0 mt-0.5"
            style={{ fontSize: "1.1rem", color: "#ef4444" }}
          >
            error
          </span>
          <p className="text-sm font-medium" style={{ color: "#ef4444" }}>
            {serverError}
          </p>
        </div>
      )}

      {/* ── Two-column layout ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-8 items-start">

        {/* ── Left: form sections ──────────────────────────────────────────── */}
        <form
          id="checkout-form"
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-8"
        >
          <ShippingForm
            fields={fields}
            onChange={handleFieldChange}
            errors={fieldErrors}
          />

          {/* Divider */}
          <SectionDivider />

          <DeliveryMethod
            selected={deliveryMethod}
            onChange={setDeliveryMethod}
          />

          {/* Divider */}
          <SectionDivider />

          <PaymentSection
            selected={paymentMethod}
            onChange={setPaymentMethod}
          />

          {/* Mobile-only submit button (the sidebar has it on desktop) */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="lg:hidden w-full flex items-center justify-center gap-2 rounded-xl font-display font-bold transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background:
                "linear-gradient(135deg, var(--color-primary), var(--color-brand-purple, #7500cc))",
              color: "#fff",
              padding: "0.9rem 1.5rem",
              fontSize: "0.95rem",
              boxShadow: "0 4px 20px rgba(19,74,241,0.35)",
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
                <span className="material-symbols-outlined" style={{ fontSize: "1.15rem" }}>check_circle</span>
                Place Order
              </>
            )}
          </button>
        </form>

        {/* ── Right: order summary ─────────────────────────────────────────── */}
        <CheckoutSummary deliveryMethod={deliveryMethod} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}

// ── Internal helpers ──────────────────────────────────────────────────────────

function SectionDivider() {
  return (
    <div className="flex items-center gap-4">
      <div
        className="flex-1 h-px"
        style={{ background: "var(--color-outline-variant)" }}
      />
      <span
        className="material-symbols-outlined"
        style={{ fontSize: "1rem", color: "var(--color-inverted-bg)", opacity: 0.2 }}
      >
        more_horiz
      </span>
      <div
        className="flex-1 h-px"
        style={{ background: "var(--color-outline-variant)" }}
      />
    </div>
  );
}

function CheckoutProgress() {
  const steps = [
    { label: "Cart",     icon: "shopping_cart",    done: true },
    { label: "Checkout", icon: "edit_document",     done: false, active: true },
    { label: "Confirm",  icon: "check_circle",      done: false },
  ];

  return (
    <nav aria-label="Checkout progress" className="flex items-center gap-0">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center">
          {/* Step node */}
          <div className="flex flex-col items-center gap-1">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
              style={{
                background: step.done
                  ? "#16a34a"
                  : step.active
                  ? "linear-gradient(135deg, var(--color-primary), var(--color-brand-purple, #7500cc))"
                  : "var(--color-surface-highest)",
                boxShadow: step.active
                  ? "0 2px 10px rgba(19,74,241,0.35)"
                  : "none",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: "1rem",
                  color: step.done || step.active ? "#fff" : "var(--color-inverted-bg)",
                  opacity: step.done || step.active ? 1 : 0.3,
                  fontVariationSettings: "'FILL' 1",
                }}
              >
                {step.icon}
              </span>
            </div>
            <span
              className="text-xs font-semibold"
              style={{
                color: "var(--color-inverted-bg)",
                opacity: step.active ? 1 : step.done ? 0.7 : 0.35,
              }}
            >
              {step.label}
            </span>
          </div>

          {/* Connector line — not after last step */}
          {i < steps.length - 1 && (
            <div
              className="h-0.5 flex-1 mx-2 mb-5 min-w-12 rounded-full"
              style={{
                background: step.done
                  ? "#16a34a"
                  : "var(--color-surface-highest)",
              }}
            />
          )}
        </div>
      ))}
    </nav>
  );
}
