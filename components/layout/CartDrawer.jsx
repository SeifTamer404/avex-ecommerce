"use client";

import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "@/store/slices/uiSlice";
import { cartActions } from "@/store/slices/cartSlice";

export default function CartDrawer() {
  const dispatch = useDispatch();

  // ── Redux selectors ──────────────────────────────────────────────────────────
  const isCartOpen = useSelector((state) => state.ui.isCartOpen);
  const items = useSelector((state) => state.cart.items);
  const subtotal = useSelector((state) => state.cart.subtotal);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleClose = () => dispatch(uiActions.setIsCartOpen(false));

  // removeFromCart payload = productId string
  // updateQuantity payload = { productId, newQty }
  const handleIncrease = (productId, currentQty) =>
    dispatch(cartActions.updateQuantity({ productId, newQty: currentQty + 1 }));

  const handleDecrease = (productId, currentQty) => {
    if (currentQty <= 1) {
      dispatch(cartActions.removeFromCart(productId));
    } else {
      dispatch(cartActions.updateQuantity({ productId, newQty: currentQty - 1 }));
    }
  };

  const handleRemove = (productId) =>
    dispatch(cartActions.removeFromCart(productId));

  const formattedSubtotal = subtotal.toFixed(2);

  return (
    <>
      {/* ── Backdrop ──────────────────────────────────────────────────────────── */}
      <div
        onClick={handleClose}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 998,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
          opacity: isCartOpen ? 1 : 0,
          pointerEvents: isCartOpen ? "auto" : "none",
          transition: "opacity 0.35s cubic-bezier(0.2,0,0,1)",
        }}
      />

      {/* ── Drawer panel ──────────────────────────────────────────────────────── */}
      <aside
        aria-label="Shopping cart"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 999,
          width: "min(420px, 100vw)",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "var(--color-surface)",
          borderLeft: "1px solid var(--color-outline-variant)",
          boxShadow: "-8px 0 32px rgba(0,0,0,0.18)",
          transform: isCartOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.2,0,0,1)",
        }}
      >
        {/* ── Header ──────────────────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid var(--color-outline-variant)",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "1.3rem", color: "var(--color-primary)" }}
            >
              shopping_bag
            </span>
            <h2
              style={{
                margin: 0,
                fontSize: "1.05rem",
                fontWeight: 700,
                fontFamily: "var(--font-display, sans-serif)",
                color: "var(--color-inverted-bg)",
                letterSpacing: "-0.02em",
              }}
            >
              Your Cart
            </h2>
            {items.length > 0 && (
              <span
                style={{
                  background: "var(--color-primary)",
                  color: "#fff",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  borderRadius: "999px",
                  padding: "2px 8px",
                  lineHeight: 1.4,
                }}
              >
                {items.length}
              </span>
            )}
          </div>

          <button
            onClick={handleClose}
            aria-label="Close cart"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0.35rem",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-inverted-bg)",
              opacity: 0.6,
              transition: "opacity 0.2s, background 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.background = "var(--color-surface-highest)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "0.6";
              e.currentTarget.style.background = "none";
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "1.2rem" }}>
              close
            </span>
          </button>
        </div>

        {/* ── Item list ───────────────────────────────────────────────────────── */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: items.length === 0 ? "0" : "0.75rem 1.25rem",
            scrollbarWidth: "thin",
            scrollbarColor: "var(--color-outline-variant) transparent",
          }}
        >
          {items.length === 0 ? (
            /* Empty state */
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                gap: "1rem",
                padding: "2rem",
                textAlign: "center",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: "4rem",
                  color: "var(--color-inverted-bg)",
                  opacity: 0.15,
                }}
              >
                shopping_cart
              </span>
              <p
                style={{
                  margin: 0,
                  color: "var(--color-inverted-bg)",
                  opacity: 0.45,
                  fontSize: "0.95rem",
                  fontWeight: 500,
                }}
              >
                Your cart is empty
              </p>
              <p
                style={{
                  margin: 0,
                  color: "var(--color-inverted-bg)",
                  opacity: 0.3,
                  fontSize: "0.8rem",
                }}
              >
                Add some items to get started
              </p>
            </div>
          ) : (
            /* Item cards */
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {items.map((item) => (
                <li
                  key={item.productId ?? item.slug}
                  style={{
                    display: "flex",
                    gap: "0.85rem",
                    alignItems: "flex-start",
                    background: "var(--color-surface-low)",
                    borderRadius: "0.85rem",
                    padding: "0.85rem",
                    border: "1px solid var(--color-outline-variant)",
                    position: "relative",
                  }}
                >
                  {/* Product image */}
                  <div
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: "0.6rem",
                      overflow: "hidden",
                      background: "var(--color-surface-highest)",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={70}
                        height={70}
                        style={{ objectFit: "cover", width: "100%", height: "100%" }}
                      />
                    ) : (
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "1.6rem", opacity: 0.3 }}
                      >
                        image
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        margin: "0 0 0.2rem",
                        fontWeight: 600,
                        fontSize: "0.88rem",
                        color: "var(--color-inverted-bg)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        paddingRight: "1.5rem",
                      }}
                    >
                      {item.name}
                    </p>

                    <p
                      style={{
                        margin: "0 0 0.65rem",
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        color: "var(--color-primary)",
                        fontFamily: "var(--font-display, sans-serif)",
                      }}
                    >
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>

                    {/* Quantity controls */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <button
                        onClick={() => handleDecrease(item.productId, item.quantity)}
                        aria-label={`Decrease quantity of ${item.name}`}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          border: "1.5px solid var(--color-outline-variant)",
                          background: "var(--color-surface)",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--color-inverted-bg)",
                          transition: "background 0.2s, border-color 0.2s",
                          flexShrink: 0,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "var(--color-primary)";
                          e.currentTarget.style.borderColor = "var(--color-primary)";
                          e.currentTarget.style.color = "#fff";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "var(--color-surface)";
                          e.currentTarget.style.borderColor = "var(--color-outline-variant)";
                          e.currentTarget.style.color = "var(--color-inverted-bg)";
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: "0.9rem" }}>
                          {item.quantity <= 1 ? "delete" : "remove"}
                        </span>
                      </button>

                      <span
                        style={{
                          minWidth: 22,
                          textAlign: "center",
                          fontWeight: 700,
                          fontSize: "0.9rem",
                          color: "var(--color-inverted-bg)",
                        }}
                      >
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => handleIncrease(item.productId, item.quantity)}
                        aria-label={`Increase quantity of ${item.name}`}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          border: "1.5px solid var(--color-outline-variant)",
                          background: "var(--color-surface)",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--color-inverted-bg)",
                          transition: "background 0.2s, border-color 0.2s",
                          flexShrink: 0,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "var(--color-primary)";
                          e.currentTarget.style.borderColor = "var(--color-primary)";
                          e.currentTarget.style.color = "#fff";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "var(--color-surface)";
                          e.currentTarget.style.borderColor = "var(--color-outline-variant)";
                          e.currentTarget.style.color = "var(--color-inverted-bg)";
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: "0.9rem" }}>
                          add
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => handleRemove(item.productId)}
                    aria-label={`Remove ${item.name} from cart`}
                    style={{
                      position: "absolute",
                      top: "0.6rem",
                      right: "0.6rem",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "0.2rem",
                      borderRadius: "50%",
                      display: "flex",
                      color: "var(--color-inverted-bg)",
                      opacity: 0.35,
                      transition: "opacity 0.2s, color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "1";
                      e.currentTarget.style.color = "#ef4444";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "0.35";
                      e.currentTarget.style.color = "var(--color-inverted-bg)";
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
                      close
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ── Footer: subtotal + CTA ────────────────────────────────────────────── */}
        {items.length > 0 && (
          <div
            style={{
              padding: "1.25rem 1.5rem",
              borderTop: "1px solid var(--color-outline-variant)",
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              background: "var(--color-surface)",
            }}
          >
            {/* Subtotal row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "0.9rem",
                  color: "var(--color-inverted-bg)",
                  opacity: 0.65,
                  fontWeight: 500,
                }}
              >
                Subtotal
              </span>
              <span
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 800,
                  color: "var(--color-inverted-bg)",
                  fontFamily: "var(--font-display, sans-serif)",
                  letterSpacing: "-0.03em",
                }}
              >
                ${formattedSubtotal}
              </span>
            </div>

            <p
              style={{
                margin: 0,
                fontSize: "0.75rem",
                color: "var(--color-inverted-bg)",
                opacity: 0.4,
                textAlign: "center",
              }}
            >
              Taxes & shipping calculated at checkout
            </p>

            {/* Go to Cart CTA */}
            <Link
              href="/cart"
              onClick={handleClose}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                background: "linear-gradient(135deg, var(--color-primary), var(--color-brand-purple, #7500cc))",
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.95rem",
                fontFamily: "var(--font-display, sans-serif)",
                borderRadius: "0.75rem",
                padding: "0.85rem 1.5rem",
                textDecoration: "none",
                letterSpacing: "-0.01em",
                transition: "opacity 0.2s, transform 0.2s",
                boxShadow: "0 4px 18px rgba(19,74,241,0.35)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.92";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>
                shopping_cart_checkout
              </span>
              Go to Cart
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
