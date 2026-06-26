"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  PackageSearch, 
  MapPin, 
  Settings, 
  HelpCircle,
  Heart
} from "lucide-react";
import Image from "next/image";

const NAV_LINKS = [
  { name: "Overview", href: "/account", icon: LayoutDashboard },
  { name: "Order History", href: "/account/orders", icon: PackageSearch },
  { name: "Wishlist", href: "/account/wishlist", icon: Heart },
  { name: "Addresses", href: "/account/addresses", icon: MapPin },
  { name: "Settings", href: "/account/settings", icon: Settings },
  { name: "Help", href: "/account/help", icon: HelpCircle },
];

export default function AccountSidebarNav({ user }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col bg-[var(--color-surface)] md:rounded-2xl md:shadow-sm md:border border-[var(--color-outline-variant)]/50 overflow-hidden">
      {/* User Info Section (Hidden on mobile tab bar to save vertical space) */}
      <div className="hidden md:flex p-6 border-b border-[var(--color-outline-variant)]/50 items-center gap-4 bg-[var(--color-primary)]/5">
        <div className="w-12 h-12 rounded-full ring-2 ring-[var(--color-primary)]/20 overflow-hidden flex-shrink-0 flex items-center justify-center bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold text-lg">
          {user?.avatar ? (
            <Image 
              src={user.avatar} 
              alt={user?.name || "User"} 
              width={48} 
              height={48} 
              className="w-full h-full object-cover" 
            />
          ) : (
            (user?.name?.[0] || "U").toUpperCase()
          )}
        </div>
        <div className="overflow-hidden">
          <h2 className="font-semibold text-[var(--color-inverted-bg)] truncate text-lg">
            {user?.name || "Customer"}
          </h2>
          <div className="mt-1 flex">
            <span className="text-[10px] px-2 py-0.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full font-bold tracking-wide uppercase">
              {user?.role || "USER"}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      {/* On mobile: overflow-x-auto, hidden scrollbar, horizontal flex */}
      <nav className="overflow-x-auto overflow-y-hidden md:overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] md:p-3 border-b border-[var(--color-outline-variant)]/50 md:border-none bg-[var(--color-surface)] sticky top-0 z-10 md:static">
        <ul className="flex md:flex-col gap-2 min-w-max md:min-w-0 p-3 md:p-0">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            // Exact match for Overview, prefix match for others so nested routes stay active
            const isActive = link.href === "/account" 
              ? pathname === "/account" 
              : pathname?.startsWith(link.href);

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`
                    flex items-center gap-3 px-4 py-2.5 md:py-3 rounded-xl transition-all duration-200 font-medium text-sm
                    ${isActive 
                      ? "bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/20" 
                      : "text-[var(--color-inverted-bg)]/70 hover:bg-[var(--color-outline-variant)]/30 hover:text-[var(--color-inverted-bg)]"
                    }
                  `}
                >
                  <Icon className={`w-[18px] h-[18px] ${isActive ? "opacity-100" : "opacity-70"}`} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="whitespace-nowrap">{link.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Upgrade to VIP button */}
      <div className="hidden md:block p-4 mt-2">
        <div className="bg-gradient-to-br from-[var(--color-primary)] to-purple-600 p-5 rounded-2xl text-white shadow-lg relative overflow-hidden group cursor-pointer hover:-translate-y-1 transition-transform duration-300">
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <h3 className="font-bold mb-1">Upgrade to VIP</h3>
          <p className="text-xs text-white/80 mb-4 leading-relaxed">Unlock free shipping & exclusive rewards.</p>
          <button className="w-full bg-white text-black font-semibold py-2 rounded-lg text-sm transition-transform active:scale-95 shadow-sm">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}
