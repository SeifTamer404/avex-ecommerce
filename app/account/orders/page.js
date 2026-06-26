import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getOrders } from "@/features/user/actions";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { PackageSearch, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Order History",
  description: "View your past orders.",
  alternates: {
    canonical: "/account/orders",
  },
};

const TABS = [
  { label: "All Orders", value: "all" },
  { label: "Processing", value: "processing" },
  { label: "In Transit", value: "shipped" }, // the enum uses 'shipped' usually for in transit
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

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

export default async function OrderHistoryPage({ searchParams }) {
  // Await searchParams as required in Next.js 15
  const resolvedParams = await searchParams;
  const statusParam = resolvedParams.status || "all";
  const pageParam = parseInt(resolvedParams.page || "1", 10);

  const instance = await auth();
  const session = await instance.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) redirect("/login");

  const { orders, totalPages, currentPage, totalCount } = await getOrders(
    session.user.id, 
    { page: pageParam, status: statusParam }
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-[var(--color-inverted-bg)] mb-1">
            Order History
          </h1>
          <p className="text-[var(--color-inverted-bg)]/60 text-sm">
            Check the status of recent orders, manage returns, and discover similar products.
          </p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2 border-b border-[var(--color-outline-variant)]/50">
        {TABS.map(tab => {
          const isActive = statusParam === tab.value;
          return (
            <Link 
              key={tab.value}
              href={`/account/orders?status=${tab.value}`}
              className={`
                px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors
                ${isActive 
                  ? "bg-[var(--color-inverted-bg)] text-[var(--color-surface)]" 
                  : "bg-[var(--color-surface-highest)] text-[var(--color-inverted-bg)]/70 hover:bg-[var(--color-outline-variant)]/30 hover:text-[var(--color-inverted-bg)]"
                }
              `}
            >
              {tab.label}
            </Link>
          )
        })}
      </div>

      {/* Orders Table */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-outline-variant)]/50 rounded-3xl overflow-hidden shadow-sm">
        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[var(--color-surface-highest)] text-[var(--color-inverted-bg)]/70 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-outline-variant)]/50">
                {orders.map((order) => {
                  const itemsDesc = order.items?.map(i => i.product?.name || "Product").join(", ") || "Items";
                  const truncatedItems = itemsDesc.length > 30 ? itemsDesc.substring(0, 30) + "..." : itemsDesc;
                  
                  return (
                    <tr key={order._id} className="hover:bg-[var(--color-surface-highest)]/50 transition-colors group">
                      <td className="px-6 py-4 font-medium font-mono text-[var(--color-inverted-bg)]">
                        <Link href={`/account/orders/${order._id}`} className="hover:text-[var(--color-primary)] transition-colors inline-block w-full">
                          #{order._id.toString().substring(order._id.toString().length - 6).toUpperCase()}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-[var(--color-inverted-bg)]/70 whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-[var(--color-inverted-bg)]/80 max-w-[200px] truncate" title={itemsDesc}>
                        {truncatedItems}
                      </td>
                      <td className="px-6 py-4">
                        <Badge label={order.status || "pending"} variant={getStatusVariant(order.status)} />
                      </td>
                      <td className="px-6 py-4 font-bold text-[var(--color-inverted-bg)]">
                        ${order.total?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          href={`/account/orders/${order._id}`}
                          className="inline-flex items-center justify-center p-2 rounded-xl text-[var(--color-inverted-bg)]/40 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-all group-hover:text-[var(--color-primary)] group-hover:translate-x-1"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-[var(--color-outline-variant)]/20 rounded-full flex items-center justify-center mb-4">
              <PackageSearch className="w-10 h-10 text-[var(--color-inverted-bg)]/30" />
            </div>
            <h4 className="text-xl font-bold font-display text-[var(--color-inverted-bg)] mb-2">No orders found</h4>
            <p className="text-[var(--color-inverted-bg)]/60 mb-6 max-w-sm">
              {statusParam !== "all" 
                ? `You don't have any orders with the status "${statusParam}" right now.`
                : "You haven't placed any orders yet."}
            </p>
            {statusParam !== "all" ? (
              <Button href="/account/orders?status=all" type="secondary">
                View All Orders
              </Button>
            ) : (
              <Button href="/products" type="primary">
                Start Shopping
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-[var(--color-surface)] border border-[var(--color-outline-variant)]/50 p-4 rounded-2xl shadow-sm">
          <p className="text-sm text-[var(--color-inverted-bg)]/60">
            Showing page <span className="font-bold text-[var(--color-inverted-bg)]">{currentPage}</span> of <span className="font-bold text-[var(--color-inverted-bg)]">{totalPages}</span>
          </p>
          <div className="flex gap-2">
            <Link
              href={currentPage > 1 ? `/account/orders?status=${statusParam}&page=${currentPage - 1}` : "#"}
              className={`flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors
                ${currentPage > 1 
                  ? "bg-[var(--color-surface-highest)] hover:bg-[var(--color-outline-variant)]/30 text-[var(--color-inverted-bg)]" 
                  : "bg-[var(--color-surface-highest)]/50 text-[var(--color-inverted-bg)]/30 cursor-not-allowed pointer-events-none"
                }
              `}
              aria-disabled={currentPage <= 1}
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </Link>
            <Link
              href={currentPage < totalPages ? `/account/orders?status=${statusParam}&page=${currentPage + 1}` : "#"}
              className={`flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors
                ${currentPage < totalPages 
                  ? "bg-[var(--color-surface-highest)] hover:bg-[var(--color-outline-variant)]/30 text-[var(--color-inverted-bg)]" 
                  : "bg-[var(--color-surface-highest)]/50 text-[var(--color-inverted-bg)]/30 cursor-not-allowed pointer-events-none"
                }
              `}
              aria-disabled={currentPage >= totalPages}
            >
              Next <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
