import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";

// ─────────────────────────────────────────────────────────────────────────────
// Delivery method display config (mirrors DeliveryMethod.jsx — no client import)
// ─────────────────────────────────────────────────────────────────────────────
const DELIVERY_META = {
  standard: {
    label:       "Standard Delivery",
    description: "3–5 business days",
    icon:        "local_shipping",
    badge:       "FREE",
    badgeColor:  "#16a34a",
    windowDays:  [3, 5],
  },
  priority: {
    label:       "Priority Delivery",
    description: "Next business day",
    icon:        "bolt",
    badge:       "NEXT DAY",
    badgeColor:  "var(--color-primary)",
    windowDays:  [1, 1],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function fmt(n) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

function addBusinessDays(date, days) {
  const result = new Date(date);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    const dow = result.getDay();
    if (dow !== 0 && dow !== 6) added++; // skip weekends
  }
  return result;
}

function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month:   "long",
    day:     "numeric",
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Page metadata (dynamic)
// ─────────────────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { orderId } = await params;
  return {
    title: `Order Confirmed #${orderId.slice(-8).toUpperCase()}`,
    description: "Your order has been placed successfully.",
    alternates: {
      canonical: `/order-confirmed/${orderId}`,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// /order-confirmed/[orderId] — Server component
//
// Security contract:
//   1. Session required — unauthenticated → /login
//   2. Order must exist in MongoDB
//   3. order.user must match session.user.id — any mismatch → 404
//      (returning 404 instead of 403 avoids leaking whether an order exists)
// ─────────────────────────────────────────────────────────────────────────────
export default async function OrderConfirmedPage({ params }) {
  const { orderId } = await params;

  // ── 1. Verify session ────────────────────────────────────────────────────────
  let session = null;
  try {
    const instance     = await auth();
    const headersList  = await headers();
    session = await instance.api.getSession({ headers: headersList });
  } catch (err) {
    console.error("[order-confirmed] auth error:", err);
  }

  if (!session?.user?.id) {
    redirect(`/login?next=/order-confirmed/${orderId}`);
  }

  // ── 2. Validate orderId format before hitting the DB ────────────────────────
  if (!mongoose.Types.ObjectId.isValid(orderId)) notFound();

  // ── 3. Fetch order + populate product info ───────────────────────────────────
  await dbConnect();

  const order = await Order.findById(orderId)
    .populate("items.product", "name images slug category")
    .lean();

  if (!order) notFound();

  // ── 4. Ownership check — prevents URL-guessing (returns 404, not 403) ───────
  if (order.user.toString() !== session.user.id) notFound();

  // ── 5. Serialize (ObjectIds → strings, Dates → ISO strings) ─────────────────
  const o = JSON.parse(JSON.stringify(order));

  // ── 6. Compute delivery window ───────────────────────────────────────────────
  const meta        = DELIVERY_META[o.deliveryMethod] ?? DELIVERY_META.standard;
  const placedAt    = new Date(o.createdAt);
  const windowStart = addBusinessDays(placedAt, meta.windowDays[0]);
  const windowEnd   = addBusinessDays(placedAt, meta.windowDays[1]);
  const sameDay     = meta.windowDays[0] === meta.windowDays[1];
  const deliveryWindow = sameDay
    ? formatDate(windowStart)
    : `${formatDate(windowStart)} – ${formatDate(windowEnd)}`;

  // Short order ref shown to user (last 8 hex chars, uppercase)
  const orderRef = o._id.slice(-8).toUpperCase();

  return (
    <div className="flex flex-col gap-10 pb-12 max-w-3xl mx-auto">

      {/* ── Success hero ──────────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-3xl p-8 md:p-12 flex flex-col items-center text-center gap-5"
        style={{
          background:
            "linear-gradient(135deg, var(--color-primary), var(--color-brand-purple, #7500cc))",
        }}
      >
        {/* Background orbs */}
        <div
          className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-20 blur-3xl"
          style={{ background: "#fff" }}
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-10 blur-3xl"
          style={{ background: "#fff" }}
          aria-hidden="true"
        />

        {/* Checkmark */}
        <div
          className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.2)" }}
        >
          <span
            className="material-symbols-outlined text-white"
            style={{ fontSize: "2.8rem", fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
        </div>

        {/* Copy */}
        <div className="relative z-10 flex flex-col gap-2">
          <h1
            className="font-display font-extrabold text-white tracking-tight"
            style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)" }}
          >
            Order Confirmed!
          </h1>
          <p className="text-white/75 text-base">
            Thank you, {o.address.fullName.split(" ")[0]}. Your order is being
            prepared.
          </p>
        </div>

        {/* Order ref chip */}
        <div
          className="relative z-10 inline-flex items-center gap-2 rounded-full px-4 py-2"
          style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}
        >
          <span className="material-symbols-outlined text-white/70" style={{ fontSize: "1rem" }}>
            receipt_long
          </span>
          <span className="text-white font-mono font-bold text-sm tracking-widest">
            #{orderRef}
          </span>
        </div>

        {/* Placed at */}
        <p className="relative z-10 text-white/50 text-xs">
          Placed on{" "}
          {new Date(o.createdAt).toLocaleDateString("en-US", {
            weekday: "long", year: "numeric", month: "long", day: "numeric",
          })}
        </p>
      </div>

      {/* ── Delivery window banner ────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-4 rounded-2xl p-4 md:p-5"
        style={{
          background: "var(--color-surface-low)",
          border: "1px solid var(--color-outline-variant)",
        }}
      >
        <div
          className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: meta.badgeColor }}
        >
          <span
            className="material-symbols-outlined text-white"
            style={{ fontSize: "1.3rem", fontVariationSettings: "'FILL' 1" }}
          >
            {meta.icon}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <p
            className="font-display font-bold text-sm"
            style={{ color: "var(--color-inverted-bg)" }}
          >
            {meta.label}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--color-inverted-bg)", opacity: 0.5 }}>
            Estimated delivery: <span className="font-semibold" style={{ opacity: 1 }}>{deliveryWindow}</span>
          </p>
        </div>

        <span
          className="flex-shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full"
          style={{ background: meta.badgeColor, color: "#fff" }}
        >
          {meta.badge}
        </span>
      </div>

      {/* ── Items list ───────────────────────────────────────────────────────── */}
      <section aria-labelledby="items-heading">
        <SectionTitle id="items-heading" icon="inventory_2">
          Items Ordered
        </SectionTitle>

        <ul className="flex flex-col gap-3 mt-4" role="list">
          {o.items.map((item, idx) => {
            const product = item.product ?? {};
            const image   = product.images?.[0] ?? null;
            const lineTotal = item.price * item.quantity;

            return (
              <li
                key={item._id ?? idx}
                className="flex items-center gap-4 rounded-2xl p-4"
                style={{
                  background: "var(--color-surface-low)",
                  border: "1px solid var(--color-outline-variant)",
                }}
              >
                {/* Product image */}
                <div
                  className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center"
                  style={{ background: "var(--color-surface-highest)" }}
                >
                  {image ? (
                    <Image
                      src={image}
                      alt={product.name ?? "Product"}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "1.5rem", color: "var(--color-inverted-bg)", opacity: 0.2 }}
                    >
                      image
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p
                    className="font-display font-semibold text-sm leading-snug line-clamp-2"
                    style={{ color: "var(--color-inverted-bg)" }}
                  >
                    {product.name ?? "Product"}
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: "var(--color-inverted-bg)", opacity: 0.45 }}
                  >
                    {fmt(item.price)} × {item.quantity}
                  </p>
                </div>

                {/* Line total */}
                <span
                  className="font-display font-extrabold tabular-nums flex-shrink-0"
                  style={{ fontSize: "1rem", color: "var(--color-inverted-bg)" }}
                >
                  {fmt(lineTotal)}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ── Two-column: Address + Cost breakdown ─────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        {/* Shipping address */}
        <section
          aria-labelledby="address-heading"
          className="rounded-2xl p-5 flex flex-col gap-3"
          style={{
            background: "var(--color-surface-low)",
            border: "1px solid var(--color-outline-variant)",
          }}
        >
          <SectionTitle id="address-heading" icon="location_on" small>
            Shipping Address
          </SectionTitle>

          <address
            className="not-italic text-sm leading-relaxed flex flex-col gap-0.5"
            style={{ color: "var(--color-inverted-bg)", opacity: 0.75 }}
          >
            <span className="font-semibold not-italic" style={{ opacity: 1 }}>
              {o.address.fullName}
            </span>
            {o.address.phone && <span>{o.address.phone}</span>}
            <span>{o.address.street}</span>
            <span>{o.address.city}</span>
            {o.address.buildingDetails && <span>{o.address.buildingDetails}</span>}
          </address>
        </section>

        {/* Cost breakdown */}
        <section
          aria-labelledby="total-heading"
          className="rounded-2xl p-5 flex flex-col gap-3"
          style={{
            background: "var(--color-surface-low)",
            border: "1px solid var(--color-outline-variant)",
          }}
        >
          <SectionTitle id="total-heading" icon="payments" small>
            Order Total
          </SectionTitle>

          {/* Status badge */}
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full capitalize"
              style={{
                background: "rgba(22,163,74,0.12)",
                color: "#16a34a",
                border: "1px solid rgba(22,163,74,0.3)",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "0.85rem", fontVariationSettings: "'FILL' 1" }}
              >
                fiber_manual_record
              </span>
              {o.status}
            </span>
          </div>

          {/* Line items */}
          <dl className="flex flex-col gap-2">
            <TotalRow dt="Payment method" dd="Cash on Delivery" />
            <div
              className="h-px my-1"
              style={{ background: "var(--color-outline-variant)" }}
              aria-hidden="true"
            />
            <TotalRow
              dt="Total paid"
              dd={fmt(o.total)}
              highlight
            />
          </dl>
        </section>
      </div>

      {/* ── CTAs ─────────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/"
          id="confirmed-continue-shopping"
          className="inline-flex items-center gap-2 rounded-xl font-display font-bold transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
          style={{
            background:
              "linear-gradient(135deg, var(--color-primary), var(--color-brand-purple, #7500cc))",
            color: "#fff",
            padding: "0.85rem 1.75rem",
            fontSize: "0.9rem",
            boxShadow: "0 4px 18px rgba(19,74,241,0.3)",
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>
            shopping_bag
          </span>
          Continue Shopping
        </Link>

        <Link
          href="/account/orders"
          id="confirmed-view-orders"
          className="inline-flex items-center gap-2 rounded-xl font-display font-bold transition-all duration-200 hover:bg-[var(--color-inverted-bg)]/5"
          style={{
            border: "2px solid var(--color-outline-variant)",
            color: "var(--color-inverted-bg)",
            padding: "0.85rem 1.75rem",
            fontSize: "0.9rem",
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>
            receipt_long
          </span>
          View All Orders
        </Link>
      </div>
    </div>
  );
}

// ── Shared sub-components (server-only, no 'use client') ──────────────────────

function SectionTitle({ id, icon, children, small = false }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="material-symbols-outlined"
        style={{
          fontSize: small ? "1rem" : "1.15rem",
          color: "var(--color-primary)",
          fontVariationSettings: "'FILL' 1",
        }}
      >
        {icon}
      </span>
      <h2
        id={id}
        className="font-display font-bold tracking-tight"
        style={{
          fontSize: small ? "0.9rem" : "1rem",
          color: "var(--color-inverted-bg)",
        }}
      >
        {children}
      </h2>
    </div>
  );
}

function TotalRow({ dt, dd, highlight = false }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt
        className="text-sm"
        style={{ color: "var(--color-inverted-bg)", opacity: highlight ? 0.75 : 0.5 }}
      >
        {dt}
      </dt>
      <dd
        className={`font-${highlight ? "extrabold font-display" : "semibold"} text-sm tabular-nums`}
        style={{
          color: "var(--color-inverted-bg)",
          fontSize: highlight ? "1.1rem" : undefined,
        }}
      >
        {dd}
      </dd>
    </div>
  );
}
