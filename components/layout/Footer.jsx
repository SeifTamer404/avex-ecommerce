import Link from "next/link";
import Image from "next/image";
import NewsletterForm from "@/components/layout/NewsletterForm";

// ── Link data ────────────────────────────────────────────────────────────────
const CATEGORY_LINKS = [
  { label: "Electronics", href: "/categories/electronics" },
  { label: "Fashion", href: "/categories/fashion" },
  { label: "Groceries", href: "/categories/groceries" },
  { label: "Health & Beauty", href: "/categories/health" },
  { label: "Home & Living", href: "/categories/home" },
  { label: "New Arrivals", href: "/new-arrivals" },
];

const SUPPORT_LINKS = [
  { label: "Help Centre", href: "/help" },
  { label: "Track My Order", href: "/orders" },
  { label: "Returns & Refunds", href: "/returns" },
  { label: "Shipping Policy", href: "/shipping" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: "X / Twitter",
    href: "https://twitter.com",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://tiktok.com",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.54V6.79a4.85 4.85 0 01-1.02-.1z" />
      </svg>
    ),
  },
];

// ── Sub-components ───────────────────────────────────────────────────────────
function FooterHeading({ children }) {
  return (
    <h3 className="text-[var(--color-inverted-bg)] font-display font-bold text-sm tracking-widest uppercase mb-5 opacity-90">
      {children}
    </h3>
  );
}

function FooterLink({ href, children }) {
  return (
    <Link
      href={href}
      className="text-sm text-[var(--color-inverted-bg)]/55 hover:text-[var(--color-primary)] transition-colors duration-200 leading-relaxed"
    >
      {children}
    </Link>
  );
}

// ── Main Footer ──────────────────────────────────────────────────────────────
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-outline-variant)] bg-[var(--color-surface-low)]">
      {/* ── Main grid ─────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-14 pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

        {/* ── Column 1: Brand ─────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-5">
          <Link href="/" aria-label="AVEX home">
            <Image
              src="/logo.png"
              alt="AVEX"
              width={80}
              height={27}
              className="opacity-90 hover:opacity-100 transition-opacity"
            />
          </Link>

          <p className="text-sm text-[var(--color-inverted-bg)]/50 leading-relaxed max-w-[220px]">
            Your premium destination for electronics, fashion, groceries, and more — delivered fast.
          </p>

          {/* Trust badges */}
          <div className="flex flex-col gap-2 mt-1">
            {[
              { icon: "verified_user", label: "Secure checkout" },
              { icon: "local_shipping", label: "Free delivery over $50" },
              { icon: "autorenew", label: "30-day returns" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-[var(--color-primary)] text-base"
                  style={{ fontSize: "1rem" }}
                >
                  {icon}
                </span>
                <span className="text-xs text-[var(--color-inverted-bg)]/50 font-medium">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Column 2: Categories ────────────────────────────────────────────── */}
        <div className="flex flex-col">
          <FooterHeading>Categories</FooterHeading>
          <nav className="flex flex-col gap-3" aria-label="Category links">
            {CATEGORY_LINKS.map((link) => (
              <FooterLink key={link.href} href={link.href}>
                {link.label}
              </FooterLink>
            ))}
          </nav>
        </div>

        {/* ── Column 3: Support ───────────────────────────────────────────────── */}
        <div className="flex flex-col">
          <FooterHeading>Support</FooterHeading>
          <nav className="flex flex-col gap-3" aria-label="Support links">
            {SUPPORT_LINKS.map((link) => (
              <FooterLink key={link.href} href={link.href}>
                {link.label}
              </FooterLink>
            ))}
          </nav>
        </div>

        {/* ── Column 4: Newsletter ────────────────────────────────────────────── */}
        <div className="flex flex-col">
          <FooterHeading>Stay in the loop</FooterHeading>

          <p className="text-sm text-[var(--color-inverted-bg)]/50 mb-5 leading-relaxed">
            Deals, new arrivals & exclusive drops — straight to your inbox.
          </p>

          {/* Client island — handles state + validation */}
          <NewsletterForm />

          <p className="text-xs text-[var(--color-inverted-bg)]/30 mt-3 leading-relaxed">
            No spam. Unsubscribe any time.
          </p>
        </div>
      </div>

      {/* ── Divider ───────────────────────────────────────────────────────────── */}
      <div className="border-t border-[var(--color-outline-variant)] max-w-7xl mx-auto" />

      {/* ── Bottom bar ────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-[var(--color-inverted-bg)]/35 text-center sm:text-left">
          © {year} AVEX. All rights reserved.
        </p>

        {/* Social icons */}
        <div className="flex items-center gap-1" role="list" aria-label="Social media links">
          {SOCIAL_LINKS.map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              role="listitem"
              className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-inverted-bg)]/40 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-all duration-200"
            >
              {icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
