
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getOrderById } from "@/features/user/actions";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { ArrowLeft, PackageCheck, MapPin, Truck, Calendar, CreditCard, ChevronRight } from "lucide-react";
import Image from "next/image";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return {
    title: `Order #${id.slice(-8).toUpperCase()}`,
    description: "View details for your AVEX order.",
    alternates: {
      canonical: `/account/orders/${id}`,
    },
  };
}

function getStatusVariant(status) {
  switch (status?.toLowerCase()) {
    case "delivered": return "success";
    case "shipped": return "info";
    case "in_transit": return "info";
    case "processing": return "warning";
    case "cancelled": return "error";
    default: return "default";
  }
}

export default async function OrderDetailsPage({ params }) {
  const { id } = await params;
  
  const instance = await auth();
  const session = await instance.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) redirect("/login");

  const order = await getOrderById(id, session.user.id);

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      {/* ── Header & Back Link ──────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 mb-6">
        <Link 
          href="/account/orders" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-inverted-bg)]/60 hover:text-[var(--color-primary)] transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display tracking-tight text-[var(--color-inverted-bg)] mb-1 flex items-center gap-3">
              Order #{order._id.toString().substring(order._id.toString().length - 6).toUpperCase()}
              <Badge label={order.status || "pending"} variant={getStatusVariant(order.status)} />
            </h1>
            <div className="flex items-center gap-4 text-[var(--color-inverted-bg)]/60 text-sm mt-2">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Main Content: Items List ───────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[var(--color-surface)] border border-[var(--color-outline-variant)]/50 rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-bold font-display text-[var(--color-inverted-bg)] mb-4 flex items-center gap-2">
              <PackageCheck className="w-5 h-5 text-[var(--color-primary)]" /> Items Ordered
            </h2>
            <div className="divide-y divide-[var(--color-outline-variant)]/50">
              {order.items?.map((item, index) => (
                <div key={index} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-[var(--color-surface-highest)] border border-[var(--color-outline-variant)]/30 overflow-hidden relative flex-shrink-0">
                    {item.product?.images?.[0] ? (
                      <Image 
                        src={item.product.images[0]} 
                        alt={item.product.name} 
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[var(--color-inverted-bg)]/20">
                        <PackageCheck className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link 
                      href={`/products/${item.product?.slug || '#'}`}
                      className="text-base font-bold text-[var(--color-inverted-bg)] hover:text-[var(--color-primary)] transition-colors truncate block"
                    >
                      {item.product?.name || "Unknown Product"}
                    </Link>
                    <p className="text-sm text-[var(--color-inverted-bg)]/60 mt-1">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right font-bold text-[var(--color-inverted-bg)]">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Order Summary ─────────────────────────────────────────────────── */}
          <div className="bg-[var(--color-surface)] border border-[var(--color-outline-variant)]/50 rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-bold font-display text-[var(--color-inverted-bg)] mb-4">
              Order Summary
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-[var(--color-inverted-bg)]/70">
                <span>Subtotal</span>
                <span>${order.total?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[var(--color-inverted-bg)]/70">
                <span>Shipping</span>
                <span>Calculated</span>
              </div>
              <div className="pt-3 border-t border-[var(--color-outline-variant)]/50 flex justify-between font-bold text-lg text-[var(--color-inverted-bg)]">
                <span>Total</span>
                <span>${order.total?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Sidebar: Details ───────────────────────────────────────────────── */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <div className="bg-[var(--color-surface)] border border-[var(--color-outline-variant)]/50 rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-[var(--color-inverted-bg)] flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-[var(--color-primary)]" /> Shipping Address
            </h3>
            {order.address ? (
              <div className="text-sm text-[var(--color-inverted-bg)]/70 space-y-1">
                <p className="font-semibold text-[var(--color-inverted-bg)]">{order.address.fullName}</p>
                <p>{order.address.street} {order.address.buildingDetails ? `, ${order.address.buildingDetails}` : ""}</p>
                <p>{order.address.city}</p>
                <p className="pt-2 text-xs uppercase tracking-wider text-[var(--color-inverted-bg)]/40 font-bold">Phone</p>
                <p>{order.address.phone}</p>
              </div>
            ) : (
              <p className="text-sm text-[var(--color-inverted-bg)]/50">Address not provided.</p>
            )}
          </div>

          {/* Delivery Method */}
          <div className="bg-[var(--color-surface)] border border-[var(--color-outline-variant)]/50 rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-[var(--color-inverted-bg)] flex items-center gap-2 mb-4">
              <Truck className="w-4 h-4 text-[var(--color-primary)]" /> Delivery Method
            </h3>
            <div className="text-sm text-[var(--color-inverted-bg)]/70 capitalize font-medium">
              {order.deliveryMethod || "Standard"} Shipping
            </div>
          </div>

          {/* Payment Status */}
          <div className="bg-[var(--color-surface)] border border-[var(--color-outline-variant)]/50 rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-[var(--color-inverted-bg)] flex items-center gap-2 mb-4">
              <CreditCard className="w-4 h-4 text-[var(--color-primary)]" /> Payment
            </h3>
            <div className="text-sm text-[var(--color-inverted-bg)]/70">
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Paid
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
