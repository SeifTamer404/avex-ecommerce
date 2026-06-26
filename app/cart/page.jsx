"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import CartItem from "@/features/cart/CartItem";
import OrderSummary from "@/features/cart/OrderSummary";
import ProductCard from "@/features/products/ProductCard";

// ─────────────────────────────────────────────────────────────────────────────
// /cart — Full client component (all data lives in Redux)
// ─────────────────────────────────────────────────────────────────────────────
export default function CartPage() {
  const items     = useSelector((state) => state.cart.items);
  const subtotal  = useSelector((state) => state.cart.subtotal);
  const itemCount = useSelector((state) => state.cart.itemCount);

  // ── Related products (empty-state suggestion) ──────────────────────────────
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (items.length > 0) return; // only fetch when cart is empty

    // Grab a default category to seed the "You might like" row
    const category = "electronics";

    fetch(`/api/products/related?category=${category}&limit=6`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.products?.length) setRelated(data.products);
      })
      .catch(() => {}); // silent fail — related products are non-critical
  }, [items.length]);

  // ── Empty state ────────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-12 py-12">
        {/* Illustration + message */}
        <div className="flex flex-col items-center gap-5 text-center max-w-md">
          {/* Animated cart icon */}
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{ background: "var(--color-surface-highest)" }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: "3rem",
                color: "var(--color-inverted-bg)",
                opacity: 0.2,
              }}
            >
              shopping_cart
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <h1
              className="font-display font-extrabold tracking-tight"
              style={{ fontSize: "1.75rem", color: "var(--color-inverted-bg)" }}
            >
              Your cart is empty
            </h1>
            <p
              className="text-base leading-relaxed"
              style={{ color: "var(--color-inverted-bg)", opacity: 0.5 }}
            >
              Looks like you haven't added anything yet.
              <br />
              Start exploring — something great awaits.
            </p>
          </div>

          <Link
            href="/"
            id="cart-empty-start-shopping"
            className="inline-flex items-center gap-2 rounded-xl font-display font-bold transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
            style={{
              background:
                "linear-gradient(135deg, var(--color-primary), var(--color-brand-purple, #7500cc))",
              color: "#fff",
              padding: "0.85rem 2rem",
              fontSize: "0.95rem",
              boxShadow: "0 4px 20px rgba(19,74,241,0.3)",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>
              shopping_bag
            </span>
            Start Shopping
          </Link>
        </div>

        {/* Related / suggested products */}
        {related.length > 0 && (
          <section className="w-full" aria-labelledby="cart-empty-suggestions">
            <div className="mb-5">
              <p
                className="text-xs font-bold uppercase tracking-widest mb-1"
                style={{ color: "var(--color-primary)" }}
              >
                You might like
              </p>
              <h2
                id="cart-empty-suggestions"
                className="font-display font-extrabold tracking-tight"
                style={{ fontSize: "1.4rem", color: "var(--color-inverted-bg)" }}
              >
                Popular Right Now
              </h2>
            </div>

            {/* Horizontal scroll */}
            <div
              className="flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 md:mx-0 md:px-0 snap-x"
              style={{ scrollbarWidth: "none" }}
            >
              {related.map((product) => (
                <div
                  key={product._id}
                  className="flex-shrink-0 w-48 sm:w-56 snap-start"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  // ── Filled cart ────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* ── Page header ──────────────────────────────────────────────────────── */}
      <header className="flex items-end gap-4 flex-wrap">
        <div>
          <p
            className="text-xs font-bold uppercase tracking-widest mb-1"
            style={{ color: "var(--color-primary)" }}
          >
            Review your order
          </p>
          <h1
            className="font-display font-extrabold tracking-tight"
            style={{ fontSize: "2rem", color: "var(--color-inverted-bg)" }}
          >
            Your Cart
          </h1>
        </div>

        {/* Item count pill */}
        <span
          className="mb-1.5 text-sm font-bold px-3 py-1 rounded-full"
          style={{
            background: "var(--color-primary)",
            color: "#fff",
          }}
        >
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </span>
      </header>

      {/* ── Main layout: items (left) + summary (right) ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] gap-8 items-start">

        {/* ── Left: cart items list ─────────────────────────────────────────── */}
        <section aria-label="Cart items">
          <ul className="flex flex-col gap-3" role="list">
            {items.map((item) => (
              <CartItem
                key={item.productId ?? item.slug}
                item={item}
              />
            ))}
          </ul>

          {/* Continue shopping link */}
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-150 hover:underline"
              style={{ color: "var(--color-primary)" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
                arrow_back
              </span>
              Continue Shopping
            </Link>
          </div>
        </section>

        {/* ── Right: order summary ──────────────────────────────────────────── */}
        <OrderSummary subtotal={subtotal} itemCount={itemCount} />
      </div>

      {/* ── Security / trust strip ────────────────────────────────────────────── */}
      <div
        className="flex flex-wrap items-center justify-center gap-6 py-5 rounded-2xl"
        style={{
          background: "var(--color-surface-low)",
          border: "1px solid var(--color-outline-variant)",
        }}
        aria-label="Trust indicators"
      >
        {[
          { icon: "verified_user",  text: "256-bit SSL encrypted" },
          { icon: "autorenew",      text: "30-day hassle-free returns" },
          { icon: "local_shipping", text: "Free delivery on orders $50+" },
          { icon: "headset_mic",    text: "24/7 customer support" },
        ].map(({ icon, text }) => (
          <div
            key={text}
            className="flex items-center gap-2 text-sm"
            style={{ color: "var(--color-inverted-bg)", opacity: 0.55 }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "1.15rem", color: "var(--color-primary)", opacity: 1 }}
            >
              {icon}
            </span>
            {text}
          </div>
        ))}
      </div>
    </div>
  );
}
