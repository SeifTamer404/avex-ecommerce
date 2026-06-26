import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getDashboardData } from "@/features/user/actions";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { 
  Package, 
  Truck, 
  Award, 
  ChevronRight, 
  User as UserIcon, 
  Shield, 
  Bell,
  CheckCircle2
} from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "Account Overview",
  description: "Manage your AVEX account.",
  alternates: {
    canonical: "/account",
  },
};

function getStatusVariant(status) {
  switch (status.toLowerCase()) {
    case "delivered": return "success";
    case "shipped": return "info";
    case "in_transit": return "info";
    case "processing": return "warning";
    case "cancelled": return "error";
    default: return "default";
  }
}

export default async function AccountOverviewPage() {
  const instance = await auth();
  const session = await instance.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;
  const { totalOrders, activeDeliveries, points, recentOrders } = await getDashboardData(user.id);

  // Simple completeness heuristic
  let completeness = 50; // Base: Name + Email
  if (user.avatar) completeness += 25;
  // If they have any orders, assume they added an address or just bump completeness
  if (totalOrders > 0) completeness += 25;

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h1 className="text-2xl font-bold font-display tracking-tight text-[var(--color-inverted-bg)]">
        Overview
      </h1>

      {/* Profile Card */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-outline-variant)]/50 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center md:items-start shadow-sm relative overflow-hidden">
        {/* Decorative background blob */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--color-primary)]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-24 h-24 rounded-full ring-4 ring-[var(--color-primary)]/10 overflow-hidden flex-shrink-0 flex items-center justify-center bg-[var(--color-primary)]/5 text-[var(--color-primary)] font-bold text-3xl shadow-inner">
          {user.avatar ? (
            <Image 
              src={user.avatar} 
              alt={user.name} 
              width={96} 
              height={96} 
              className="w-full h-full object-cover" 
            />
          ) : (
            (user.name?.[0] || "U").toUpperCase()
          )}
        </div>

        <div className="flex-1 flex flex-col md:flex-row gap-6 w-full justify-between items-center md:items-start z-10">
          <div className="text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-[var(--color-inverted-bg)]">{user.name}</h2>
              <Badge label={user.role === "admin" ? "Admin" : (points > 1000 ? "Pro Curator" : "Customer")} variant={points > 1000 ? "primary" : "default"} />
            </div>
            <p className="text-[var(--color-inverted-bg)]/60 text-sm font-medium">
              Member since {memberSince}
            </p>
          </div>

          <div className="w-full md:w-64 bg-[var(--color-surface-highest)] rounded-2xl p-4 border border-[var(--color-outline-variant)]/30">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-[var(--color-inverted-bg)]/70 uppercase tracking-wide">Profile Completeness</span>
              <span className="text-sm font-bold text-[var(--color-primary)]">{completeness}%</span>
            </div>
            <div className="w-full bg-[var(--color-outline-variant)]/40 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-[var(--color-primary)] h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${completeness}%` }}
              />
            </div>
            <p className="text-xs text-[var(--color-inverted-bg)]/50 mt-2">
              {completeness === 100 ? "Your profile is fully complete!" : "Add a profile photo or address to complete your profile."}
            </p>
          </div>
        </div>
      </div>

      {/* 3 Stat Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {/* Total Orders */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-outline-variant)]/50 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-xl group-hover:scale-110 transition-transform">
              <Package className="w-6 h-6" />
            </div>
            <Badge label="LIFETIME" variant="default" className="text-[10px]" />
          </div>
          <div>
            <h3 className="text-[var(--color-inverted-bg)]/60 text-sm font-semibold mb-1">Total Orders</h3>
            <p className="text-3xl font-display font-bold text-[var(--color-inverted-bg)]">{totalOrders}</p>
          </div>
        </div>

        {/* Active Deliveries */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-outline-variant)]/50 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl group-hover:scale-110 transition-transform">
              <Truck className="w-6 h-6" />
            </div>
            <Badge label="ACTIVE" variant="info" className="text-[10px]" />
          </div>
          <div>
            <h3 className="text-[var(--color-inverted-bg)]/60 text-sm font-semibold mb-1">Active Deliveries</h3>
            <p className="text-3xl font-display font-bold text-[var(--color-inverted-bg)]">{activeDeliveries}</p>
          </div>
        </div>

        {/* AVEX Points */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-outline-variant)]/50 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <Badge label="TIER" variant="primary" className="text-[10px]" />
          </div>
          <div>
            <h3 className="text-[var(--color-inverted-bg)]/60 text-sm font-semibold mb-1">AVEX Points</h3>
            <p className="text-3xl font-display font-bold text-[var(--color-inverted-bg)]">{points}</p>
          </div>
        </div>
      </div>

      {/* Recent Orders & Account Settings Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Recent Orders Table */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold font-display text-[var(--color-inverted-bg)]">Recent Orders</h3>
            <Link href="/account/orders" className="text-sm font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1">
              VIEW ALL <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-[var(--color-surface)] border border-[var(--color-outline-variant)]/50 rounded-3xl overflow-hidden shadow-sm">
            {recentOrders && recentOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-[var(--color-surface-highest)] text-[var(--color-inverted-bg)]/70 text-xs uppercase font-semibold">
                    <tr>
                      <th className="px-6 py-4">Order ID</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Items</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-outline-variant)]/50">
                    {recentOrders.map((order) => {
                      const itemsDesc = order.items?.map(i => i.product?.name || "Product").join(", ") || "Items";
                      const truncatedItems = itemsDesc.length > 30 ? itemsDesc.substring(0, 30) + "..." : itemsDesc;
                      
                      return (
                        <tr key={order._id} className="hover:bg-[var(--color-surface-highest)]/50 transition-colors">
                          <td className="px-6 py-4 font-medium font-mono text-[var(--color-inverted-bg)]">
                            #{order._id.toString().substring(order._id.toString().length - 6).toUpperCase()}
                          </td>
                          <td className="px-6 py-4 text-[var(--color-inverted-bg)]/70 whitespace-nowrap">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-[var(--color-inverted-bg)]/80 max-w-[150px] truncate" title={itemsDesc}>
                            {truncatedItems}
                          </td>
                          <td className="px-6 py-4">
                            <Badge label={order.status} variant={getStatusVariant(order.status)} />
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-[var(--color-inverted-bg)]">
                            ${order.total?.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-10 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-[var(--color-outline-variant)]/20 rounded-full flex items-center justify-center mb-4">
                  <Package className="w-8 h-8 text-[var(--color-inverted-bg)]/40" />
                </div>
                <h4 className="font-bold text-[var(--color-inverted-bg)] mb-1">No orders yet</h4>
                <p className="text-sm text-[var(--color-inverted-bg)]/60 mb-4">When you place an order, it will appear here.</p>
                <Button href="/products" type="primary">
                  Start Shopping
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Account Settings Panel */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold font-display text-[var(--color-inverted-bg)]">Account Settings</h3>
          
          <div className="bg-[var(--color-surface)] border border-[var(--color-outline-variant)]/50 rounded-3xl overflow-hidden shadow-sm divide-y divide-[var(--color-outline-variant)]/50">
            {/* Row 1 */}
            <Link href="/account/settings" className="flex items-center p-5 hover:bg-[var(--color-surface-highest)]/50 transition-colors group">
              <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <UserIcon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-[var(--color-inverted-bg)] text-sm">Personal Information</h4>
                <p className="text-xs text-[var(--color-inverted-bg)]/60 mt-0.5">Update your name, email & avatar</p>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--color-inverted-bg)]/40 group-hover:text-[var(--color-primary)] group-hover:translate-x-1 transition-all" />
            </Link>

            {/* Row 2 */}
            <Link href="/account/settings" className="flex items-center p-5 hover:bg-[var(--color-surface-highest)]/50 transition-colors group">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <Shield className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-[var(--color-inverted-bg)] text-sm">Security</h4>
                <p className="text-xs text-[var(--color-inverted-bg)]/60 mt-0.5">Change password and auth methods</p>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--color-inverted-bg)]/40 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
            </Link>

            {/* Row 3 */}
            <Link href="/account/settings" className="flex items-center p-5 hover:bg-[var(--color-surface-highest)]/50 transition-colors group">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-[var(--color-inverted-bg)] text-sm">Notifications</h4>
                <p className="text-xs text-[var(--color-inverted-bg)]/60 mt-0.5">Manage alerts and emails</p>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--color-inverted-bg)]/40 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
