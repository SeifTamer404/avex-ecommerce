import Link from "next/link";

export const metadata = {
  title: "All Categories — AVEX",
  description: "Browse all product categories on AVEX — electronics, fashion, groceries, beauty, home & living, and toys.",
};

const CATEGORIES = [
  {
    slug: "electronics",
    label: "Electronics",
    description: "Gadgets, audio, smart home & more",
    icon: "devices",
    gradient: "from-blue-600 to-indigo-700",
  },
  {
    slug: "fashion",
    label: "Fashion",
    description: "Clothing, shoes, bags & accessories",
    icon: "apparel",
    gradient: "from-rose-500 to-pink-700",
  },
  {
    slug: "home-living",
    label: "Home & Living",
    description: "Furniture, decor, kitchen & bedding",
    icon: "chair",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    slug: "beauty",
    label: "Beauty",
    description: "Skincare, haircare & cosmetics",
    icon: "spa",
    gradient: "from-purple-500 to-fuchsia-700",
  },
  {
    slug: "groceries",
    label: "Groceries",
    description: "Organic, pantry staples & drinks",
    icon: "local_mall",
    gradient: "from-emerald-500 to-teal-700",
  },
  {
    slug: "toys",
    label: "Toys",
    description: "Educational, creative & outdoor toys",
    icon: "toys",
    gradient: "from-sky-500 to-cyan-700",
  },
];

export default function CategoriesPage() {
  return (
    <div className="flex flex-col gap-10 mt-6">

      {/* Header */}
      <div>
        <p className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest mb-2">
          Browse by category
        </p>
        <h1 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight text-[var(--color-inverted-bg)]">
          All Categories
        </h1>
        <p className="mt-2 text-[var(--color-inverted-bg)]/50 text-sm">
          6 categories · 100+ products
        </p>
      </div>

      {/* Category cards — 2-col on mobile, 3-col on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {CATEGORIES.map(({ slug, label, description, icon, gradient }) => (
          <Link
            key={slug}
            href={`/categories/${slug}`}
            className={[
              "group relative overflow-hidden rounded-2xl p-6",
              "flex flex-col justify-between gap-4 min-h-[180px]",
              `bg-gradient-to-br ${gradient}`,
              "border border-white/10",
              "transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
              "hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/20",
            ].join(" ")}
          >
            {/* Dot pattern */}
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                backgroundSize: "24px 24px",
              }}
              aria-hidden="true"
            />

            {/* Large decorative icon — top-right background accent */}
            <span
              className="absolute -top-3 -right-3 text-white/20 group-hover:text-white/30 transition-colors duration-300 select-none pointer-events-none"
              style={{
                fontSize: "6rem",
                fontFamily: "Material Symbols Outlined",
                fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48",
                lineHeight: 1,
              }}
              aria-hidden="true"
            >
              {icon}
            </span>

            {/* Small solid icon — top-left */}
            <div className="relative w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
              <span
                className="material-symbols-outlined text-white"
                style={{ fontSize: "1.4rem", fontVariationSettings: "'FILL' 1" }}
              >
                {icon}
              </span>
            </div>

            {/* Text + CTA */}
            <div className="relative">
              <h2 className="font-display font-extrabold text-xl text-white mb-1">
                {label}
              </h2>
              <p className="text-white/60 text-sm leading-snug mb-3">
                {description}
              </p>
              <span className="inline-flex items-center gap-1 text-white/80 text-sm font-semibold group-hover:gap-2 transition-all">
                Shop now
                <span className="material-symbols-outlined text-base">
                  arrow_forward
                </span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
