import Link from "next/link";
import Button from "@/components/ui/Button";
import ProductCard from "@/features/products/ProductCard";
import { getFeaturedProducts } from "@/features/products/actions";

// ── Category grid data ────────────────────────────────────────────────────────
const CATEGORIES = [
  { slug: "electronics",  label: "Electronics",   icon: "devices",          gradient: "from-blue-600 to-indigo-700" },
  { slug: "fashion",      label: "Fashion",        icon: "apparel",          gradient: "from-rose-500 to-pink-700" },
  { slug: "home-living",  label: "Home & Living",  icon: "chair",            gradient: "from-amber-500 to-orange-600" },
  { slug: "beauty",       label: "Beauty",         icon: "spa",              gradient: "from-purple-500 to-fuchsia-700" },
  { slug: "groceries",    label: "Groceries",      icon: "local_mall",       gradient: "from-emerald-500 to-teal-700" },
  { slug: "toys",         label: "Toys",           icon: "toys",             gradient: "from-sky-500 to-cyan-700" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Homepage — pure server component, no 'use client'
// ─────────────────────────────────────────────────────────────────────────────
export const metadata = {
  title: "AVEX — Your Premium Marketplace",
  description:
    "Shop electronics, fashion, groceries, beauty and more — with fast delivery and unbeatable prices.",
  alternates: {
    canonical: "/",
  },
};

export const revalidate = 600; // 10 minutes ISR

export default async function HomePage() {
  // Parallel fetches — both resolve before the page renders
  const [featured] = await Promise.all([
    getFeaturedProducts(),
  ]);

  return (
    <div className="flex flex-col gap-16 pb-8">

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* HERO                                                                  */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        className="relative -mx-4 md:-mx-8 overflow-hidden rounded-none md:rounded-3xl min-h-[480px] md:min-h-[560px] flex items-center"
        aria-label="Hero banner"
      >
        {/* Background gradient mesh */}
        <div
          className="absolute inset-0 bg-[var(--color-surface-low)]"
          aria-hidden="true"
        >
          {/* Orbs */}
          <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-[var(--color-primary)]/20 blur-[100px]" />
          <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-[var(--color-secondary)]/20 blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[var(--color-tertiary)]/10 blur-[80px]" />
        </div>

        {/* Content */}
        <div className="relative z-10 px-6 md:px-16 py-20 max-w-2xl">
          {/* Eyebrow */}
          <span className="inline-flex items-center gap-1.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-bold px-3 py-1 rounded-full mb-6 border border-[var(--color-primary)]/20">
            <span className="material-symbols-outlined text-sm">bolt</span>
            New Season Drops Available
          </span>

          {/* Headline */}
          <h1 className="font-display font-extrabold text-4xl md:text-6xl lg:text-7xl tracking-tight text-[var(--color-inverted-bg)] leading-[1.05] mb-5">
            Everything You<br />
            <span
              style={{
                backgroundImage: "linear-gradient(135deg, var(--color-primary), var(--color-brand-purple, #7500cc))",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                display: "inline-block",
              }}
            >
              Love, Delivered.
            </span>
          </h1>

          {/* Sub-copy */}
          <p className="text-[var(--color-inverted-bg)]/60 text-lg md:text-xl mb-8 leading-relaxed max-w-lg">
            From cutting-edge electronics to everyday essentials — one store,
            infinite possibilities.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <Button type="primary" size="md" href="/categories">
              <span className="material-symbols-outlined text-lg mr-2">shopping_bag</span>
              Shop Now
            </Button>
            <Button type="secondary" size="md" href="/categories/electronics">
              Explore Deals
              <span className="material-symbols-outlined text-lg ml-2">arrow_forward</span>
            </Button>
          </div>

          {/* Trust chips */}
          <div className="flex flex-wrap gap-4 mt-8">
            {[
              { icon: "local_shipping", text: "Free delivery over $50" },
              { icon: "autorenew",      text: "30-day returns" },
              { icon: "verified_user",  text: "Secure checkout" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 text-sm text-[var(--color-inverted-bg)]/50">
                <span className="material-symbols-outlined text-base text-[var(--color-primary)]">{icon}</span>
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Floating product cards decoration (desktop only) */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-3 opacity-90" aria-hidden="true">
          {[
            { icon: "headphones", label: "Wireless Earbuds", price: "$79.99", sub: "-30% today" },
            { icon: "directions_run", label: "Running Sneakers", price: "$129.99", sub: "New arrival" },
            { icon: "eco", label: "Organic Coffee",   price: "$18.99", sub: "Top seller" },
          ].map((card) => (
            <div
              key={card.label}
              className="bg-[var(--color-surface)]/80 backdrop-blur-md border border-[var(--color-outline-variant)]/30 rounded-2xl px-4 py-3 flex items-center gap-3 w-52 shadow-lg"
            >
              <span className="material-symbols-outlined text-3xl text-[var(--color-primary)]">{card.icon}</span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[var(--color-inverted-bg)] truncate">{card.label}</p>
                <p className="text-xs text-[var(--color-primary)] font-bold">{card.price}</p>
                <p className="text-[10px] text-[var(--color-inverted-bg)]/40">{card.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* TRENDING TODAY                                                        */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section aria-labelledby="trending-heading">
        {/* Section header */}
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest mb-1">
              Hand-picked for you
            </p>
            <h2
              id="trending-heading"
              className="font-display font-extrabold text-2xl md:text-3xl tracking-tight text-[var(--color-inverted-bg)]"
            >
              Trending Today
            </h2>
          </div>
          <Link
            href="/categories"
            className="hidden sm:flex items-center gap-1 text-sm font-semibold text-[var(--color-primary)] hover:underline"
          >
            View all
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>

        {/* Horizontal scroll row */}
        <div
          className="flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {featured.length === 0 ? (
            <p className="text-[var(--color-inverted-bg)]/40 text-sm py-8">No featured products yet.</p>
          ) : (
            featured.map((product) => (
              <div
                key={product._id}
                className="flex-shrink-0 w-48 sm:w-56 md:w-auto snap-start"
              >
                <ProductCard product={product} />
              </div>
            ))
          )}
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* BENTO PROMO BANNERS                                                   */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4" aria-label="Promotional banners">

        {/* Banner 1 — Groceries editorial */}
        <Link
          href="/categories/groceries"
          className="group relative overflow-hidden rounded-2xl min-h-[220px] md:min-h-[280px] flex flex-col justify-end p-6 bg-[var(--color-surface-low)] border border-[var(--color-outline-variant)]/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/80 to-teal-800/90" aria-hidden="true" />
          {/* Pattern overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "28px 28px" }}
            aria-hidden="true"
          />
          <div className="relative z-10">
            <div className="flex gap-2 mb-3 text-emerald-300 opacity-90">
              <span className="material-symbols-outlined text-3xl">eco</span>
              <span className="material-symbols-outlined text-3xl">nutrition</span>
              <span className="material-symbols-outlined text-3xl">local_cafe</span>
            </div>
            <p className="text-emerald-300 text-xs font-bold uppercase tracking-widest mb-1">Fresh & Organic</p>
            <h3 className="text-white font-display font-extrabold text-2xl tracking-tight mb-2 leading-tight">
              Farm to Table.<br />Every Day.
            </h3>
            <p className="text-white/70 text-sm mb-4">
              Premium organic groceries delivered fresh to your door.
            </p>
            <span className="inline-flex items-center gap-1 text-white font-semibold text-sm group-hover:gap-2 transition-all">
              Shop Groceries
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </span>
          </div>
        </Link>

        {/* Banner 2 — Electronics gradient promo */}
        <Link
          href="/categories/electronics"
          className="group relative overflow-hidden rounded-2xl min-h-[220px] md:min-h-[280px] flex flex-col justify-end p-6 border border-[var(--color-outline-variant)]/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-brand-purple)] to-[var(--color-secondary)]" aria-hidden="true" />
          {/* Glowing orb */}
          <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" aria-hidden="true" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl" aria-hidden="true" />

          <div className="relative z-10">
            <div className="flex gap-2 mb-3 text-yellow-300 opacity-90">
              <span className="material-symbols-outlined text-3xl">bolt</span>
              <span className="material-symbols-outlined text-3xl">headphones</span>
              <span className="material-symbols-outlined text-3xl">laptop_mac</span>
            </div>
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Limited Time</p>
            <h3 className="text-white font-display font-extrabold text-2xl tracking-tight mb-2 leading-tight">
              Tech Deals Up to<br />
              <span className="text-4xl text-yellow-300">50% Off</span>
            </h3>
            <p className="text-white/70 text-sm mb-4">
              Headphones, keyboards, monitors and more — sale ends soon.
            </p>
            <span className="inline-flex items-center gap-1 text-white font-semibold text-sm group-hover:gap-2 transition-all">
              Grab the Deal
              <span className="material-symbols-outlined text-base">bolt</span>
            </span>
          </div>
        </Link>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* CATEGORY GRID                                                         */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section aria-labelledby="categories-heading">
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest mb-1">
              Browse by category
            </p>
            <h2
              id="categories-heading"
              className="font-display font-extrabold text-2xl md:text-3xl tracking-tight text-[var(--color-inverted-bg)]"
            >
              Shop by Category
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.map(({ slug, label, icon, gradient }) => (
            <Link
              key={slug}
              href={`/categories/${slug}`}
              className={[
                "group relative overflow-hidden rounded-2xl p-4",
                "flex flex-col items-center justify-center gap-3",
                "min-h-[120px]",
                "border border-[var(--color-outline-variant)]/20",
                "transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
                "hover:-translate-y-1 hover:shadow-lg",
                `bg-gradient-to-br ${gradient}`,
              ].join(" ")}
            >
              {/* Icon */}
              <span
                className="material-symbols-outlined text-white/90 group-hover:scale-110 transition-transform duration-300"
                style={{ fontSize: "2rem", fontVariationSettings: "'FILL' 1" }}
              >
                {icon}
              </span>

              {/* Label */}
              <span className="text-white font-display font-bold text-sm text-center leading-tight">
                {label}
              </span>

              {/* Arrow — appears on hover */}
              <span className="material-symbols-outlined text-white/70 text-sm absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-200">
                arrow_forward
              </span>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
