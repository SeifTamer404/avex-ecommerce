"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "next-themes";
import { useRouter, usePathname } from "next/navigation";
import { uiActions } from "@/store/slices/uiSlice";
import { userActions } from "@/store/slices/userSlice";
import { authClient } from "@/lib/auth-client";
import { searchProducts } from "@/features/products/actions";

/**
 * MobileMenu — Full-featured slide-in sidebar drawer for mobile (md:hidden).
 * Triggered by the hamburger button in Navbar.
 * Contains: search, nav links, account info, theme toggle, quick links.
 */
export default function MobileMenu() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  // ── Redux selectors ──────────────────────────────────────────────────────────
  const isSidebarOpen = useSelector((state) => state.ui.isSidebarOpen);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const userAvatar = useSelector((state) => state.user.avatar);
  const userName = useSelector((state) => state.user.name);
  const userEmail = useSelector((state) => state.user.email);
  const userPoints = useSelector((state) => state.user.points);
  const cartItemCount = useSelector((state) => state.cart.itemCount);
  const wishlistCount = useSelector((state) => state.user.wishlist?.length ?? 0);

  // ── Theme ─────────────────────────────────────────────────────────────────────
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // ── Local search state ───────────────────────────────────────────────────────
  const [localQuery, setLocalQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef(null);

  // ── Close drawer ──────────────────────────────────────────────────────────────
  const handleClose = useCallback(() => dispatch(uiActions.setIsSidebarOpen(false)), [dispatch]);

  // ── Close on route change (skip initial mount) ────────────────────────────────
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (isSidebarOpen) handleClose();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // ── Lock body scroll when open ────────────────────────────────────────────────
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
      // Auto-focus search input after animation
      const t = setTimeout(() => searchInputRef.current?.focus(), 320);
      return () => clearTimeout(t);
    } else {
      document.body.style.overflow = "";
    }
  }, [isSidebarOpen]);

  // ── Search debounce ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!localQuery.trim() || localQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await searchProducts(localQuery, 5);
        setSearchResults(res);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [localQuery]);

  const navigateToSearch = () => {
    if (localQuery.trim()) {
      handleClose();
      setLocalQuery("");
      router.push(`/search?q=${encodeURIComponent(localQuery.trim())}`);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigateToSearch();
  };

  const handleProductClick = (slug) => {
    handleClose();
    setLocalQuery("");
    router.push(`/products/${slug}`);
  };

  // ── Logout ────────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    handleClose();
    await authClient.signOut();
    dispatch(userActions.clearUser());
    router.push("/");
  };

  // ── Nav link helper ───────────────────────────────────────────────────────────
  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const navLinks = [
    { href: "/", label: "Home", icon: "home" },
    { href: "/categories", label: "Categories", icon: "grid_view" },
    { href: "/deals", label: "Deals", icon: "local_offer" },
    { href: "/new-arrivals", label: "New Arrivals", icon: "new_releases" },
    { href: "/search", label: "Browse All", icon: "explore" },
  ];

  const accountLinks = [
    { href: "/account", label: "My Account", icon: "person" },
    { href: "/account/orders", label: "My Orders", icon: "receipt_long" },
    { href: "/account/wishlist", label: "Wishlist", icon: "favorite", badge: wishlistCount },
    { href: "/account/addresses", label: "My Addresses", icon: "location_on" },
    { href: "/account/settings", label: "Settings", icon: "settings" },
    { href: "/account/help", label: "Help & Support", icon: "help" },
  ];

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
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(3px)",
          WebkitBackdropFilter: "blur(3px)",
          opacity: isSidebarOpen ? 1 : 0,
          pointerEvents: isSidebarOpen ? "auto" : "none",
          transition: "opacity 0.35s cubic-bezier(0.2,0,0,1)",
        }}
      />

      {/* ── Drawer Panel ──────────────────────────────────────────────────────── */}
      <aside
        aria-label="Mobile navigation menu"
        aria-modal="true"
        role="dialog"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 999,
          width: "min(320px, 90vw)",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "var(--color-surface)",
          borderLeft: "1px solid var(--color-outline-variant)",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.22)",
          transform: isSidebarOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.2,0,0,1)",
          overflowY: "auto",
          overflowX: "hidden",
          scrollbarWidth: "thin",
          scrollbarColor: "var(--color-outline-variant) transparent",
        }}
      >
        {/* ── Header ──────────────────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem 1.25rem",
            borderBottom: "1px solid var(--color-outline-variant)",
            flexShrink: 0,
            background: "linear-gradient(135deg, var(--color-primary)15, transparent)",
          }}
        >
          <Image src="/logo.png" alt="AVEX" width={80} height={27} priority />
          <button
            onClick={handleClose}
            aria-label="Close menu"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0.4rem",
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
            <span className="material-symbols-outlined" style={{ fontSize: "1.3rem" }}>
              close
            </span>
          </button>
        </div>

        {/* ── Search Bar ──────────────────────────────────────────────────────── */}
        <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--color-outline-variant)" }}>
          <form onSubmit={handleSearchSubmit} style={{ position: "relative" }}>
            <span
              className="material-symbols-outlined"
              style={{
                position: "absolute",
                left: "0.85rem",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "1.1rem",
                color: "var(--color-inverted-bg)",
                opacity: 0.4,
                pointerEvents: "none",
              }}
            >
              search
            </span>
            <input
              ref={searchInputRef}
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Search products..."
              aria-label="Search products"
              autoComplete="off"
              style={{
                width: "100%",
                padding: "0.65rem 2.5rem 0.65rem 2.5rem",
                border: "1.5px solid var(--color-outline-variant)",
                borderRadius: "0.75rem",
                background: "var(--color-surface-low)",
                color: "var(--color-inverted-bg)",
                fontSize: "0.9rem",
                outline: "none",
                transition: "border-color 0.2s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--color-outline-variant)")}
            />
            {localQuery && (
              <button
                type="button"
                onClick={() => { setLocalQuery(""); setSearchResults([]); }}
                aria-label="Clear search"
                style={{
                  position: "absolute",
                  right: "0.6rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "0.2rem",
                  display: "flex",
                  color: "var(--color-inverted-bg)",
                  opacity: 0.4,
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>close</span>
              </button>
            )}
          </form>

          {/* Search Results */}
          {(isSearching || searchResults.length > 0) && (
            <div
              style={{
                marginTop: "0.5rem",
                background: "var(--color-surface-low)",
                border: "1px solid var(--color-outline-variant)",
                borderRadius: "0.75rem",
                overflow: "hidden",
              }}
            >
              {isSearching ? (
                <div style={{ padding: "1rem", textAlign: "center", color: "var(--color-inverted-bg)", opacity: 0.4, fontSize: "0.85rem" }}>
                  Searching...
                </div>
              ) : (
                <>
                  {searchResults.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleProductClick(product.slug)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.65rem 0.85rem",
                        width: "100%",
                        background: "none",
                        border: "none",
                        borderBottom: "1px solid var(--color-outline-variant)",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-primary)12")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                    >
                      <div style={{
                        width: 38, height: 38, borderRadius: "0.5rem",
                        overflow: "hidden", background: "var(--color-surface-highest)",
                        flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {product.image ? (
                          <Image src={product.image} alt={product.name} width={38} height={38}
                            style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                        ) : (
                          <span className="material-symbols-outlined" style={{ fontSize: "1rem", opacity: 0.3 }}>image</span>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: "0.82rem", fontWeight: 600, color: "var(--color-inverted-bg)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {product.name}
                        </p>
                        <p style={{ margin: 0, fontSize: "0.78rem", fontWeight: 700, color: "var(--color-primary)" }}>
                          ${product.price?.toFixed(2)}
                        </p>
                      </div>
                    </button>
                  ))}
                  {/* View all results link */}
                  <button
                    onClick={navigateToSearch}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      padding: "0.7rem 1rem",
                      width: "100%",
                      background: "var(--color-primary)10",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--color-primary)",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-primary)20")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-primary)10")}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>search</span>
                    View all results for &quot;{localQuery}&quot;
                    <span className="material-symbols-outlined" style={{ fontSize: "0.9rem" }}>arrow_forward</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* ── User Profile Card ────────────────────────────────────────────────── */}
        {isAuthenticated ? (
          <div
            style={{
              margin: "1rem 1.25rem",
              padding: "1rem",
              background: "linear-gradient(135deg, var(--color-primary)18, var(--color-brand-purple, #7500cc)10)",
              border: "1px solid var(--color-primary)30",
              borderRadius: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.85rem",
              flexShrink: 0,
            }}
          >
            {/* Avatar */}
            <div style={{
              width: 48, height: 48, borderRadius: "50%", overflow: "hidden",
              flexShrink: 0, border: "2px solid var(--color-primary)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {userAvatar ? (
                <Image src={userAvatar} alt={userName || "User"} width={48} height={48}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }} />
              ) : (
                <span style={{
                  width: "100%", height: "100%",
                  background: "linear-gradient(135deg, var(--color-primary), var(--color-brand-purple, #7500cc))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 700, fontSize: "1.1rem",
                }}>
                  {userName?.charAt(0)?.toUpperCase() || "U"}
                </span>
              )}
            </div>
            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: "0.9rem", color: "var(--color-inverted-bg)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {userName || "User"}
              </p>
              <p style={{ margin: "0.1rem 0 0", fontSize: "0.75rem", color: "var(--color-inverted-bg)", opacity: 0.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {userEmail}
              </p>
              {userPoints > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.3rem" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "0.85rem", color: "#f59e0b" }}>star</span>
                  <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "#f59e0b" }}>{userPoints} pts</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Guest CTA */
          <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--color-outline-variant)" }}>
            <Link
              href="/login"
              onClick={handleClose}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                background: "linear-gradient(135deg, var(--color-primary), var(--color-brand-purple, #7500cc))",
                color: "#fff", fontWeight: 700, fontSize: "0.9rem",
                borderRadius: "0.75rem", padding: "0.75rem 1.25rem",
                textDecoration: "none", transition: "opacity 0.2s, transform 0.2s",
                boxShadow: "0 4px 18px rgba(19,74,241,0.3)",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>login</span>
              Sign in to your account
            </Link>
            <p style={{ margin: "0.6rem 0 0", textAlign: "center", fontSize: "0.78rem", color: "var(--color-inverted-bg)", opacity: 0.45 }}>
              New here?{" "}
              <Link href="/register" onClick={handleClose} style={{ color: "var(--color-primary)", fontWeight: 600, textDecoration: "none" }}>
                Create an account
              </Link>
            </p>
          </div>
        )}

        {/* ── Quick Stats (cart + wishlist) ────────────────────────────────────── */}
        <div style={{ display: "flex", gap: "0.75rem", padding: "0 1.25rem 1rem", flexShrink: 0 }}>
          <button
            onClick={() => { handleClose(); dispatch(uiActions.toggleCart()); }}
            style={{
              flex: 1, display: "flex", alignItems: "center", gap: "0.5rem",
              padding: "0.65rem 0.85rem", borderRadius: "0.75rem",
              background: "var(--color-surface-low)", border: "1px solid var(--color-outline-variant)",
              cursor: "pointer", color: "var(--color-inverted-bg)", transition: "background 0.2s",
              position: "relative",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-surface-highest)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-surface-low)")}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "1.2rem", color: "var(--color-primary)" }}>shopping_cart</span>
            <div style={{ textAlign: "left" }}>
              <p style={{ margin: 0, fontSize: "0.7rem", opacity: 0.5, lineHeight: 1 }}>Cart</p>
              <p style={{ margin: 0, fontWeight: 700, fontSize: "0.85rem", color: "var(--color-primary)" }}>{cartItemCount} items</p>
            </div>
          </button>

          <Link
            href="/account/wishlist"
            onClick={handleClose}
            style={{
              flex: 1, display: "flex", alignItems: "center", gap: "0.5rem",
              padding: "0.65rem 0.85rem", borderRadius: "0.75rem",
              background: "var(--color-surface-low)", border: "1px solid var(--color-outline-variant)",
              textDecoration: "none", color: "var(--color-inverted-bg)", transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-surface-highest)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-surface-low)")}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "1.2rem", color: "#ec4899" }}>favorite</span>
            <div>
              <p style={{ margin: 0, fontSize: "0.7rem", opacity: 0.5, lineHeight: 1 }}>Wishlist</p>
              <p style={{ margin: 0, fontWeight: 700, fontSize: "0.85rem", color: "#ec4899" }}>{wishlistCount} saved</p>
            </div>
          </Link>
        </div>

        {/* ── Main Navigation ───────────────────────────────────────────────────── */}
        <div style={{ padding: "0 1.25rem", flexShrink: 0 }}>
          <p style={{ margin: "0 0 0.5rem", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-inverted-bg)", opacity: 0.35 }}>
            Navigate
          </p>
          <nav style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
            {navLinks.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                onClick={handleClose}
                style={{
                  display: "flex", alignItems: "center", gap: "0.85rem",
                  padding: "0.8rem 1rem", borderRadius: "0.75rem",
                  textDecoration: "none", transition: "background 0.15s, color 0.15s",
                  color: isActive(href) ? "var(--color-primary)" : "var(--color-inverted-bg)",
                  background: isActive(href) ? "var(--color-primary)15" : "transparent",
                  fontWeight: isActive(href) ? 700 : 500,
                  fontSize: "0.92rem",
                }}
                onMouseEnter={(e) => { if (!isActive(href)) e.currentTarget.style.background = "var(--color-surface-low)"; }}
                onMouseLeave={(e) => { if (!isActive(href)) e.currentTarget.style.background = "transparent"; }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "1.2rem" }}>{icon}</span>
                {label}
                {isActive(href) && (
                  <span className="material-symbols-outlined" style={{ fontSize: "0.9rem", marginLeft: "auto" }}>chevron_right</span>
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* ── Divider ──────────────────────────────────────────────────────────── */}
        <div style={{ height: "1px", background: "var(--color-outline-variant)", margin: "1rem 1.25rem" }} />

        {/* ── Account Links ─────────────────────────────────────────────────────── */}
        <div style={{ padding: "0 1.25rem", flexShrink: 0 }}>
          <p style={{ margin: "0 0 0.5rem", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-inverted-bg)", opacity: 0.35 }}>
            Account
          </p>
          <nav style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
            {(isAuthenticated ? accountLinks : accountLinks.slice(0, 1)).map(({ href, label, icon, badge }) => (
              <Link
                key={href}
                href={isAuthenticated ? href : "/login"}
                onClick={handleClose}
                style={{
                  display: "flex", alignItems: "center", gap: "0.85rem",
                  padding: "0.8rem 1rem", borderRadius: "0.75rem",
                  textDecoration: "none", transition: "background 0.15s",
                  color: isActive(href) ? "var(--color-primary)" : "var(--color-inverted-bg)",
                  background: isActive(href) ? "var(--color-primary)15" : "transparent",
                  fontWeight: isActive(href) ? 700 : 500,
                  fontSize: "0.92rem", opacity: isAuthenticated ? 1 : 0.5,
                }}
                onMouseEnter={(e) => { if (!isActive(href)) e.currentTarget.style.background = "var(--color-surface-low)"; }}
                onMouseLeave={(e) => { if (!isActive(href)) e.currentTarget.style.background = "transparent"; }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "1.2rem" }}>{icon}</span>
                {label}
                {badge > 0 && (
                  <span style={{
                    marginLeft: "auto", background: "var(--color-primary)", color: "#fff",
                    fontSize: "0.65rem", fontWeight: 700, borderRadius: "999px", padding: "2px 7px",
                  }}>
                    {badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* ── Spacer ────────────────────────────────────────────────────────────── */}
        <div style={{ flex: 1 }} />

        {/* ── Footer Actions ────────────────────────────────────────────────────── */}
        <div
          style={{
            padding: "1rem 1.25rem",
            borderTop: "1px solid var(--color-outline-variant)",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            style={{
              display: "flex", alignItems: "center", gap: "0.85rem",
              padding: "0.8rem 1rem", borderRadius: "0.75rem",
              background: "var(--color-surface-low)", border: "1px solid var(--color-outline-variant)",
              cursor: "pointer", color: "var(--color-inverted-bg)", width: "100%",
              fontSize: "0.92rem", fontWeight: 500, transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-surface-highest)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-surface-low)")}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "1.2rem", color: mounted && isDark ? "#f59e0b" : "var(--color-primary)" }}>
              {mounted ? (isDark ? "light_mode" : "dark_mode") : "dark_mode"}
            </span>
            {mounted ? (isDark ? "Switch to Light Mode" : "Switch to Dark Mode") : "Toggle Theme"}
          </button>

          {/* Logout / sign-in */}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              style={{
                display: "flex", alignItems: "center", gap: "0.85rem",
                padding: "0.8rem 1rem", borderRadius: "0.75rem",
                background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                cursor: "pointer", color: "#ef4444", width: "100%",
                fontSize: "0.92rem", fontWeight: 500, transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.15)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "1.2rem" }}>logout</span>
              Sign Out
            </button>
          ) : (
            <Link
              href="/login"
              onClick={handleClose}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                padding: "0.8rem 1rem", borderRadius: "0.75rem",
                background: "linear-gradient(135deg, var(--color-primary), var(--color-brand-purple, #7500cc))",
                color: "#fff", fontWeight: 700, fontSize: "0.9rem",
                textDecoration: "none", transition: "opacity 0.2s",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>login</span>
              Login
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
