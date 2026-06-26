"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "next-themes";
import { useRouter, usePathname } from "next/navigation";
import { uiActions } from "@/store/slices/uiSlice";
import { userActions } from "@/store/slices/userSlice";
import { authClient } from "@/lib/auth-client";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { searchProducts } from "@/features/products/actions";

export default function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  // ── Redux selectors ──────────────────────────────────────────────────────────
  const cartItemCount = useSelector((state) => state.cart.itemCount);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const userAvatar = useSelector((state) => state.user.avatar);
  const userName = useSelector((state) => state.user.name);
  const searchQuery = useSelector((state) => state.ui.searchQuery);

  // ── Search Dropdown State ────────────────────────────────────────────────────
  const [results, setResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef(null);

  // ── next-themes ──────────────────────────────────────────────────────────────
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  // Prevent hydration mismatch — theme is unknown on the server
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // ── Search Debounce & Click Outside ──────────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery && searchQuery.trim().length >= 2) {
        try {
          const res = await searchProducts(searchQuery, 5);
          setResults(res);
          setIsDropdownOpen(true);
        } catch (error) {
          console.error("Search failed:", error);
        }
      } else {
        setResults([]);
        setIsDropdownOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleSearchChange = (e) => {
    dispatch(uiActions.setSearchQuery(e.target.value));
    if (!isDropdownOpen && e.target.value.trim().length >= 2 && results.length > 0) {
      setIsDropdownOpen(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      setIsDropdownOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleProductClick = (slug) => {
    setIsDropdownOpen(false);
    dispatch(uiActions.setSearchQuery(""));
    router.push(`/products/${slug}`);
  };

  const handleCartOpen = () => {
    dispatch(uiActions.toggleCart());
  };

  const handleSidebarOpen = () => {
    dispatch(uiActions.toggleSidebar());
  };

  const handleThemeToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const handleLogout = async () => {
    await authClient.signOut();
    dispatch(userActions.clearUser());
    router.push("/");
  };

  return (
    <header className="fixed top-0 w-full z-50 glass-header border-b border-[var(--color-outline-variant)] flex justify-between items-center px-4 md:px-8 py-3">
      {/* ── LEFT ZONE: Logo + Category nav ──────────────────────────────────── */}
      <div className="flex items-center gap-6 lg:gap-8">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="AVEX Logo"
            width={90}
            height={30}
            priority
          />
        </Link>

        {/* Desktop nav links — hidden on mobile */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6">
          <Link 
            href="/"
            className={pathname === "/" ? "text-primary font-bold border-b-2 border-primary pb-1 font-display tracking-tight" : "text-[var(--color-inverted-bg)]/70 font-medium hover:text-[var(--color-inverted-bg)] transition-colors font-display font-semibold tracking-tight hover:-translate-y-[1px]"}
          >
            Home
          </Link>

          {/* Categories Dropdown */}
          <div className={`group relative cursor-pointer flex items-center gap-1 ${pathname.startsWith("/categories") ? "text-primary font-bold border-b-2 border-primary pb-1 font-display tracking-tight" : "text-[var(--color-inverted-bg)]/70 hover:text-[var(--color-inverted-bg)] transition-colors font-display font-semibold tracking-tight hover:-translate-y-[1px]"}`}>
            <span>Categories</span>
            <span className="material-symbols-outlined text-sm transition-transform duration-300 group-hover:rotate-180">
              expand_more
            </span>

            {/* invisible bridge so hover doesn't break on gap */}
            <div className="absolute top-full left-0 w-full h-4 bg-transparent"></div>

            <div className="absolute top-[calc(100%+1rem)] left-0 w-56 bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col overflow-hidden z-50">
              <Link
                href="/categories/electronics"
                className="px-5 py-3 text-sm text-[var(--color-inverted-bg)]/80 hover:text-primary hover:bg-[var(--color-primary)]/10 transition-colors border-b border-[var(--color-outline-variant)]/50 last:border-none flex items-center gap-3"
              >
                <span className="material-symbols-outlined text-base">devices</span>
                Electronics
              </Link>
              <Link
                href="/categories/groceries"
                className="px-5 py-3 text-sm text-[var(--color-inverted-bg)]/80 hover:text-primary hover:bg-[var(--color-primary)]/10 transition-colors border-b border-[var(--color-outline-variant)]/50 last:border-none flex items-center gap-3"
              >
                <span className="material-symbols-outlined text-base">local_mall</span>
                Groceries
              </Link>
              <Link
                href="/categories/fashion"
                className="px-5 py-3 text-sm text-[var(--color-inverted-bg)]/80 hover:text-primary hover:bg-[var(--color-primary)]/10 transition-colors border-b border-[var(--color-outline-variant)]/50 last:border-none flex items-center gap-3"
              >
                <span className="material-symbols-outlined text-base">apparel</span>
                Fashion
              </Link>
              <Link
                href="/categories/beauty"
                className="px-5 py-3 text-sm text-[var(--color-inverted-bg)]/80 hover:text-primary hover:bg-[var(--color-primary)]/10 transition-colors border-b border-[var(--color-outline-variant)]/50 last:border-none flex items-center gap-3"
              >
                <span className="material-symbols-outlined text-base">spa</span>
                Beauty
              </Link>
              <div className="bg-[var(--color-outline-variant)]/10">
                <Link
                  href="/categories"
                  className="px-5 py-3 text-sm text-primary font-medium hover:bg-[var(--color-primary)]/10 transition-colors flex items-center justify-between"
                >
                  View All Categories
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>

          <Link
            href="/deals"
            className={pathname === "/deals" ? "text-primary font-bold border-b-2 border-primary pb-1 font-display tracking-tight" : "text-[var(--color-inverted-bg)]/70 font-medium hover:text-[var(--color-inverted-bg)] transition-colors font-display font-semibold tracking-tight hover:-translate-y-[1px]"}
          >
            Deals
          </Link>
          <Link
            href="/new-arrivals"
            className={`hidden lg:block ${pathname === "/new-arrivals" ? "text-primary font-bold border-b-2 border-primary pb-1 font-display tracking-tight" : "text-[var(--color-inverted-bg)]/70 font-medium hover:text-[var(--color-inverted-bg)] transition-colors font-display font-semibold tracking-tight hover:-translate-y-[1px]"}`}
          >
            New Arrivals
          </Link>
        </nav>
      </div>

      {/* ── CENTER ZONE: Search bar — hidden on mobile ───────────────────────── */}
      <div ref={searchRef} className="relative hidden lg:flex flex-1 max-w-sm xl:max-w-md mx-6">
        <Input
          icon="search"
          iconPosition="left"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          aria-label="Search products"
          autoComplete="off"
        />

        {/* Search Dropdown */}
        {isDropdownOpen && results.length > 0 && (
          <div className="absolute top-[calc(100%+0.5rem)] left-0 w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl shadow-lg overflow-hidden z-50 flex flex-col">
            {results.map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product.slug)}
                className="flex items-center gap-3 p-3 hover:bg-[var(--color-primary)]/10 cursor-pointer border-b border-[var(--color-outline-variant)]/50 last:border-none transition-colors"
              >
                <div className="w-10 h-10 rounded bg-[var(--color-surface-highest)] flex-shrink-0 overflow-hidden">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="w-full h-full flex items-center justify-center material-symbols-outlined text-[var(--color-inverted-bg)]/40 text-lg">
                      image
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--color-inverted-bg)] truncate">
                    {product.name}
                  </p>
                  <span className="inline-block px-2 py-0.5 mt-0.5 text-[10px] font-medium bg-[var(--color-outline-variant)]/20 text-[var(--color-inverted-bg)]/70 rounded-full capitalize">
                    {product.category}
                  </span>
                </div>
                <div className="text-sm font-bold text-primary">
                  ${product.price?.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── RIGHT ZONE: Theme + Cart + Auth ──────────────────────────────────── */}
      <div className="flex items-center gap-2 lg:gap-3">

        {/* Theme Toggle */}
        <button
          onClick={handleThemeToggle}
          aria-label="Toggle theme"
          className="p-2 text-[var(--color-inverted-bg)]/60 hover:text-primary transition-colors flex items-center justify-center"
        >
          <span className={`material-symbols-outlined text-xl transition-opacity ${mounted ? "opacity-100" : "opacity-0"}`}>
            {mounted ? (isDark ? "light_mode" : "dark_mode") : "dark_mode"}
          </span>
        </button>

        {/* Divider */}
        <div className="h-6 w-[1px] bg-[var(--color-inverted-bg)]/10 mx-1 hidden sm:block"></div>

        {/* Cart Icon — visible on desktop (md+); BottomNav handles mobile */}
        <button
          onClick={handleCartOpen}
          aria-label="Open cart"
          className="hidden md:flex relative p-2 text-[var(--color-inverted-bg)]/60 hover:text-primary transition-colors items-center justify-center"
        >
          <span className="material-symbols-outlined text-xl">shopping_cart</span>
          {cartItemCount > 0 && (
            <span className="absolute top-1 right-1 bg-primary text-white text-[9px] font-bold w-[18px] h-[18px] flex items-center justify-center rounded-full leading-none">
              {cartItemCount > 99 ? "99+" : cartItemCount}
            </span>
          )}
        </button>

        {/* Auth: Avatar + dropdown or Login button */}
        {isAuthenticated ? (
          <div className="group relative hidden sm:block">
            {/* ── Trigger: avatar circle ───────────────────────────────── */}
            <button
              aria-label="User menu"
              aria-haspopup="true"
              className="flex items-center gap-2 rounded-full transition-all"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-primary/30 group-hover:ring-primary transition-all flex-shrink-0">
                {userAvatar ? (
                  <Image
                    src={userAvatar}
                    alt={userName || "User"}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="w-full h-full bg-kinetic-pulse flex items-center justify-center text-white text-xs font-bold">
                    {userName?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                )}
              </div>
            </button>

            {/* invisible hover bridge */}
            <div className="absolute top-full right-0 w-full h-3 bg-transparent" />

            {/* ── Dropdown menu ────────────────────────────────────────── */}
            <div
              role="menu"
              className="absolute top-[calc(100%+0.75rem)] right-0 w-48 bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
            >
              {/* User info header */}
              <div className="px-4 py-3 border-b border-[var(--color-outline-variant)]">
                <p className="text-sm font-semibold text-[var(--color-inverted-bg)] truncate">
                  {userName || "Account"}
                </p>
              </div>

              {/* Menu items */}
              <Link
                href="/account"
                role="menuitem"
                className="flex items-center gap-3 px-4 py-3 text-sm text-[var(--color-inverted-bg)]/75 hover:text-primary hover:bg-[var(--color-primary)]/10 transition-colors"
              >
                <span className="material-symbols-outlined text-base">person</span>
                My Account
              </Link>
              <Link
                href="/account/orders"
                role="menuitem"
                className="flex items-center gap-3 px-4 py-3 text-sm text-[var(--color-inverted-bg)]/75 hover:text-primary hover:bg-[var(--color-primary)]/10 transition-colors border-t border-[var(--color-outline-variant)]/50"
              >
                <span className="material-symbols-outlined text-base">receipt_long</span>
                My Orders
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                role="menuitem"
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 transition-colors border-t border-[var(--color-outline-variant)]"
              >
                <span className="material-symbols-outlined text-base">logout</span>
                Sign out
              </button>
            </div>
          </div>
        ) : (
          <Button
            type="primary"
            size="sm"
            href="/login"
            className="hidden sm:flex"
          >
            Login
          </Button>
        )}

        {/* Hamburger — mobile only (md breakpoint and below) */}
        <button
          onClick={handleSidebarOpen}
          aria-label="Open menu"
          className="md:hidden flex items-center justify-center p-2 text-[var(--color-inverted-bg)]/70 hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-xl">menu</span>
        </button>
      </div>
    </header>
  );
}
