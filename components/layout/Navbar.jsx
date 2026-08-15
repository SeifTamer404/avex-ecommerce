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
import { searchProducts } from "@/features/products/actions";
import { Search, X, Menu, ShoppingCart, User, Sun, Moon } from "lucide-react";

export default function Navbar({ variant = "light" }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  // ── Redux selectors ──────────────────────────────────────────────────────────
  const cartItemCount = useSelector((state) => state.cart.itemCount);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const userAvatar = useSelector((state) => state.user.avatar);
  const userName = useSelector((state) => state.user.name);

  // ── next-themes ──────────────────────────────────────────────────────────────
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // ── DAR states ───────────────────────────────────────────────────────────────
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchMounted, setSearchMounted] = useState(false);
  const [searchEntered, setSearchEntered] = useState(false);
  const [menuMounted, setMenuMounted] = useState(false);
  const [menuEntered, setMenuEntered] = useState(false);

  // ── Search logic ─────────────────────────────────────────────────────────────
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Search debounce
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        let res = await searchProducts(query, 10);
        setSearchResults(res);
      } catch (e) {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [query]);

  // Scroll logic
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Modals animation
  useEffect(() => {
    if (searchOpen) {
      setSearchMounted(true);
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => setSearchEntered(true)));
      return () => cancelAnimationFrame(raf);
    } else if (searchMounted) {
      setSearchEntered(false);
      const t = setTimeout(() => setSearchMounted(false), 500);
      return () => clearTimeout(t);
    }
  }, [searchOpen, searchMounted]);

  useEffect(() => {
    if (menuOpen) {
      setMenuMounted(true);
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => setMenuEntered(true)));
      return () => cancelAnimationFrame(raf);
    } else if (menuMounted) {
      setMenuEntered(false);
      const t = setTimeout(() => setMenuMounted(false), 600);
      return () => clearTimeout(t);
    }
  }, [menuOpen, menuMounted]);

  // Lock body scroll
  useEffect(() => {
    const shouldLock = searchOpen || menuOpen;
    if (!shouldLock) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [searchOpen, menuOpen]);

  // Close modals on route change
  useEffect(() => {
    setSearchOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await authClient.signOut();
    dispatch(userActions.clearUser());
    router.push("/");
  };

  const handleProductClick = (slug) => {
    setSearchOpen(false);
    router.push(`/products/${slug}`);
  };

  const goToSearch = () => {
    if (query.trim()) {
      setSearchOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const textColor = "text-[var(--color-inverted-bg)]";
  const linkHover = "hover:text-primary transition-colors";

  return (
    <>
      <nav
        className={[
          "fixed inset-x-0 top-0 z-50 flex justify-center transition-all duration-500 ease-out",
          scrolled ? "p-3 md:p-4" : "p-4 md:p-6",
        ].join(" ")}
      >
        <div
          className={[
            "flex w-full items-center justify-between transition-all duration-500 ease-out",
            scrolled
              ? "max-w-5xl rounded-full bg-[var(--color-surface)]/80 px-5 py-2.5 ring-1 ring-[var(--color-inverted-bg)]/10 backdrop-blur-xl md:px-7 md:py-3 shadow-sm"
              : "max-w-7xl px-2 py-2 md:px-4",
          ].join(" ")}
        >
          <Link
            href="/"
            className={[
              "transition-all flex items-center",
              scrolled ? "scale-90 origin-left" : "scale-100 origin-left",
            ].join(" ")}
          >
            <Image
              src="/logo.png"
              alt="AVEX Logo"
              width={90}
              height={30}
              priority
            />
          </Link>

          <div
            className={[
              "hidden items-center gap-6 md:flex text-[10px] uppercase font-bold tracking-[0.25em]",
              textColor,
            ].join(" ")}
          >
            <Link href="/categories" className={linkHover}>
              Categories
            </Link>
            <Link href="/deals" className={linkHover}>
              Deals
            </Link>
            <Link href="/new-arrivals" className={linkHover}>
              New Arrivals
            </Link>
            <button
              onClick={() => setSearchOpen(true)}
              className={["flex items-center gap-1.5", linkHover].join(" ")}
              aria-label="Search products"
            >
              <Search className="size-3.5" strokeWidth={2} />
              <span>Search</span>
            </button>
          </div>

          <div className={["flex items-center gap-2 md:gap-3", textColor].join(" ")}>
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="p-2 transition-colors hover:text-primary hidden sm:flex"
              aria-label="Toggle theme"
            >
              {mounted ? (isDark ? <Sun className="size-5" strokeWidth={1.5} /> : <Moon className="size-5" strokeWidth={1.5} />) : <Moon className="size-5" strokeWidth={1.5} />}
            </button>

            {/* Cart Icon */}
            <button
              onClick={() => dispatch(uiActions.toggleCart())}
              className="relative p-2 transition-colors hover:text-primary hidden sm:flex"
              aria-label="Open cart"
            >
              <ShoppingCart className="size-5" strokeWidth={1.5} />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-white text-[9px] font-bold w-[18px] h-[18px] flex items-center justify-center rounded-full leading-none">
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </span>
              )}
            </button>

            {/* User Dropdown */}
            {isAuthenticated ? (
              <div className="group relative hidden sm:block">
                <button aria-label="User menu" className="flex items-center justify-center p-2 transition-colors hover:text-primary cursor-pointer">
                  {userAvatar ? (
                    <div className="w-6 h-6 rounded-full overflow-hidden border border-[var(--color-outline-variant)]">
                        <Image src={userAvatar} alt={userName || "User"} width={24} height={24} className="object-cover w-full h-full" />
                    </div>
                  ) : (
                    <User className="size-5" strokeWidth={1.5} />
                  )}
                </button>
                <div className="absolute top-full right-0 w-full h-3 bg-transparent" />
                <div className="absolute top-[calc(100%+0.5rem)] right-0 w-48 bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="px-4 py-3 border-b border-[var(--color-outline-variant)]">
                    <p className="text-sm font-semibold text-[var(--color-inverted-bg)] truncate">
                      {userName || "Account"}
                    </p>
                  </div>
                  <Link href="/account" className="flex items-center gap-3 px-4 py-3 text-sm text-[var(--color-inverted-bg)]/75 hover:text-primary hover:bg-[var(--color-primary)]/10 transition-colors">
                    My Account
                  </Link>
                  <Link href="/account/orders" className="flex items-center gap-3 px-4 py-3 text-sm text-[var(--color-inverted-bg)]/75 hover:text-primary hover:bg-[var(--color-primary)]/10 transition-colors border-t border-[var(--color-outline-variant)]/50">
                    My Orders
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 transition-colors border-t border-[var(--color-outline-variant)]">
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
               <Link href="/login" className="hidden sm:flex p-2 transition-colors hover:text-primary">
                  <User className="size-5" strokeWidth={1.5} />
               </Link>
            )}

            {/* Mobile: search + hamburger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="md:hidden p-2 hover:text-primary transition-colors"
              aria-label="Search"
            >
              <Search className="size-5" strokeWidth={1.5} />
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden p-2 -mr-2 hover:text-primary transition-colors"
              aria-label="Open menu"
            >
              <Menu className="size-6" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </nav>

      {/* SEARCH PORTAL */}
      {searchMounted && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]"
          role="dialog"
          aria-modal="true"
        >
          <button
            aria-label="Close search"
            onClick={() => setSearchOpen(false)}
            className={[
              "absolute inset-0 bg-[var(--color-surface)]/60 backdrop-blur-md transition-opacity duration-500 ease-[var(--ease-kinetic)]",
              searchEntered ? "opacity-100" : "opacity-0",
            ].join(" ")}
          />

          <div
            className={[
              "relative w-full max-w-2xl origin-top overflow-hidden rounded-2xl border border-[var(--color-outline-variant)] bg-[var(--color-surface)] shadow-2xl ring-1 ring-black/5 transition-[opacity,transform] duration-500 ease-[var(--ease-kinetic)] will-change-transform",
              searchEntered
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-5 scale-[0.96]",
            ].join(" ")}
          >
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute right-3 top-3 z-10 rounded-full p-1.5 text-[var(--color-inverted-bg)]/50 transition-colors hover:bg-[var(--color-inverted-bg)]/5 hover:text-[var(--color-inverted-bg)]"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>

            <div className="flex items-center gap-3 border-b border-[var(--color-outline-variant)] px-5 py-4">
              <Search className="size-4 shrink-0 text-[var(--color-inverted-bg)]/50" strokeWidth={1.5} />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchResults.length > 0) {
                    handleProductClick(searchResults[0].slug);
                  } else if (e.key === "Enter") {
                    goToSearch();
                  }
                }}
                placeholder="Search products..."
                className="w-full bg-transparent pr-8 text-sm outline-none placeholder:text-[var(--color-inverted-bg)]/40 text-[var(--color-inverted-bg)] font-medium"
              />
            </div>

            <div className="max-h-[52vh] overflow-y-auto py-2">
              {isSearching ? (
                 <p className="px-5 py-8 text-center text-sm text-[var(--color-inverted-bg)]/50">
                  Searching...
                </p>
              ) : searchResults.length === 0 && query.trim().length >= 2 ? (
                <p className="px-5 py-8 text-center text-sm text-[var(--color-inverted-bg)]/50">
                  No products match your search.
                </p>
              ) : searchResults.length === 0 ? (
                 <p className="px-5 py-8 text-center text-sm text-[var(--color-inverted-bg)]/50">
                  Type to search for products...
                </p>
              ) : (
                <ul>
                  {searchResults.map((product) => (
                    <li key={product.id}>
                      <button
                        onClick={() => handleProductClick(product.slug)}
                        className="flex w-full items-center justify-between gap-4 px-5 py-3 text-left transition-colors hover:bg-[var(--color-primary)]/10 group"
                      >
                        <span className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded bg-[var(--color-surface-highest)] flex-shrink-0 overflow-hidden">
                              {product.image ? (
                                <Image src={product.image} alt={product.name} width={40} height={40} className="w-full h-full object-cover" />
                              ) : (
                                <span className="material-symbols-outlined w-full h-full flex items-center justify-center text-[var(--color-inverted-bg)]/40 text-lg">image</span>
                              )}
                           </div>
                          <div>
                              <span className="text-sm font-semibold text-[var(--color-inverted-bg)] group-hover:text-primary transition-colors">{product.name}</span>
                              <div className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-inverted-bg)]/50 mt-0.5">{product.category}</div>
                          </div>
                        </span>
                        <span className="text-sm font-bold text-primary">
                          ${product.price?.toFixed(2)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {searchResults.length > 0 && (
               <div className="border-t border-[var(--color-outline-variant)]">
                  <button onClick={goToSearch} className="w-full py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-primary hover:bg-[var(--color-primary)]/10 transition-colors">
                     View All Results
                  </button>
               </div>
            )}
          </div>
        </div>
      )}

      {/* MOBILE MENU PORTAL */}
      {menuMounted && (
        <div className="fixed inset-0 z-[100] md:hidden" role="dialog" aria-modal="true">
          <button
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className={[
              "absolute inset-0 bg-black/50 backdrop-blur-md transition-opacity duration-500 ease-[var(--ease-kinetic)]",
              menuEntered ? "opacity-100" : "opacity-0",
            ].join(" ")}
          />

          <div
            className={[
              "absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-[var(--color-surface)] shadow-2xl transition-[transform,opacity] duration-500 ease-[var(--ease-kinetic)] will-change-transform",
              menuEntered ? "translate-x-0 opacity-100" : "translate-x-full opacity-95",
            ].join(" ")}
          >
            <div className="flex items-center justify-between p-4 border-b border-[var(--color-outline-variant)]">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
              >
                <Image src="/logo.png" alt="AVEX Logo" width={80} height={26} />
              </Link>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="p-2 -mr-2 text-[var(--color-inverted-bg)]/70 hover:text-primary transition-colors"
              >
                <X className="size-6" strokeWidth={1.5} />
              </button>
            </div>

            <nav className="flex flex-1 flex-col justify-center px-8">
              <ul className="space-y-2">
                {[
                  { href: "/", label: "Home", num: "01" },
                  { href: "/categories", label: "Categories", num: "02" },
                  { href: "/deals", label: "Deals", num: "03" },
                  { href: "/new-arrivals", label: "New Arrivals", num: "04" },
                ].map((item, i) => (
                  <li key={item.href} className="overflow-hidden">
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={[
                        "group flex items-baseline gap-4 py-2 transition-all duration-700 ease-[var(--ease-kinetic)]",
                        menuEntered
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-6",
                      ].join(" ")}
                      style={{ transitionDelay: `${menuEntered ? 180 + i * 70 : 0}ms` }}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-inverted-bg)]/40">
                        {item.num}
                      </span>
                      <span className="font-display font-bold text-4xl leading-none transition-colors group-hover:text-primary text-[var(--color-inverted-bg)]">
                        {item.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div
                className={[
                  "mt-12 space-y-3 transition-all duration-700 ease-[var(--ease-kinetic)]",
                  menuEntered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                ].join(" ")}
                style={{ transitionDelay: menuEntered ? "480ms" : "0ms" }}
              >
                <Link
                  href="/search"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full bg-[var(--color-inverted-bg)] px-6 py-4 text-center font-bold text-[10px] uppercase tracking-[0.3em] text-[var(--color-surface)] transition-colors hover:bg-primary"
                >
                  Explore All Products
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setTimeout(() => setSearchOpen(true), 400);
                  }}
                  className="flex w-full items-center justify-center gap-2 border border-[var(--color-outline-variant)] px-6 py-4 font-bold text-[10px] uppercase tracking-[0.3em] text-[var(--color-inverted-bg)] transition-colors hover:bg-[var(--color-inverted-bg)]/5"
                >
                  <Search className="size-3.5" strokeWidth={1.5} />
                  Search Products
                </button>
              </div>
            </nav>

            <div
              className={[
                "flex flex-col border-t border-[var(--color-outline-variant)] px-8 py-6 transition-all duration-700 ease-[var(--ease-kinetic)] space-y-4",
                menuEntered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
              ].join(" ")}
              style={{ transitionDelay: menuEntered ? "560ms" : "0ms" }}
            >
               {isAuthenticated ? (
                  <div className="flex items-center justify-between">
                     <Link href="/account" onClick={() => setMenuOpen(false)} className="font-bold text-[10px] uppercase tracking-[0.25em] text-[var(--color-inverted-bg)] hover:text-primary transition-colors">
                        My Account
                     </Link>
                     <button onClick={handleLogout} className="font-bold text-[10px] uppercase tracking-[0.25em] text-red-500 hover:text-red-600 transition-colors">
                        Sign Out
                     </button>
                  </div>
               ) : (
                  <Link href="/login" onClick={() => setMenuOpen(false)} className="font-bold text-[10px] uppercase tracking-[0.25em] text-[var(--color-inverted-bg)] hover:text-primary transition-colors text-center w-full block">
                     Login / Register
                  </Link>
               )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
