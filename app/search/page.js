import Link from "next/link";
import { searchProducts } from "@/features/products/actions";
import ProductCard from "@/features/products/ProductCard";

export const metadata = {
  title: "Search Results",
  description: "Search for products on AVEX",
  alternates: {
    canonical: "/search",
  },
};

export default async function SearchPage({ searchParams }) {
  const sp = await searchParams;
  const query = sp.q;

  // Empty query state
  if (!query || query.trim().length < 2) {
    return (
      <div className="flex flex-col gap-6 mt-6 min-h-[50vh] items-center justify-center text-center">
        <span
          className="material-symbols-outlined text-[var(--color-inverted-bg)]/20"
          style={{ fontSize: "4rem" }}
        >
          search
        </span>
        <h1 className="font-display font-extrabold text-2xl md:text-3xl tracking-tight text-[var(--color-inverted-bg)]">
          Search AVEX
        </h1>
        <p className="text-sm text-[var(--color-inverted-bg)]/50 max-w-md">
          Type above to find the best deals on electronics, fashion, groceries, and more.
        </p>
      </div>
    );
  }

  // Call the searchProducts action
  const results = await searchProducts(query, 20);

  return (
    <div className="flex flex-col gap-6 mt-6">
      {/* ── Breadcrumb ──────────────────────────────────────────────────────── */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs text-[var(--color-inverted-bg)]/40"
      >
        <Link
          href="/"
          className="hover:text-[var(--color-primary)] transition-colors"
        >
          Home
        </Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-[var(--color-inverted-bg)]/70 font-medium">
          Search
        </span>
      </nav>

      {/* ── Page heading ────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1">
        <h1 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight text-[var(--color-inverted-bg)]">
          Search results for &quot;{query}&quot;
        </h1>
        <p className="text-sm text-[var(--color-inverted-bg)]/40">
          {results.length} {results.length === 1 ? "result" : "results"} found
        </p>
      </div>

      {/* ── Results ─────────────────────────────────────────────────────────── */}
      {results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center border-t border-[var(--color-outline-variant)]/20 mt-4">
          <span
            className="material-symbols-outlined text-[var(--color-inverted-bg)]/20"
            style={{ fontSize: "4rem" }}
          >
            search_off
          </span>
          <p className="font-display font-semibold text-lg text-[var(--color-inverted-bg)]/50">
            No results for &quot;{query}&quot;
          </p>
          <p className="text-sm text-[var(--color-inverted-bg)]/40">
            Try checking your spelling or explore our popular categories:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
            <Link
              href="/categories/electronics"
              className="px-4 py-2 rounded-full text-sm font-semibold bg-[var(--color-surface-low)] text-[var(--color-inverted-bg)]/70 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] border border-[var(--color-outline-variant)]/30 transition-all"
            >
              Electronics
            </Link>
            <Link
              href="/categories/fashion"
              className="px-4 py-2 rounded-full text-sm font-semibold bg-[var(--color-surface-low)] text-[var(--color-inverted-bg)]/70 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] border border-[var(--color-outline-variant)]/30 transition-all"
            >
              Fashion
            </Link>
            <Link
              href="/categories/home-living"
              className="px-4 py-2 rounded-full text-sm font-semibold bg-[var(--color-surface-low)] text-[var(--color-inverted-bg)]/70 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] border border-[var(--color-outline-variant)]/30 transition-all"
            >
              Home & Living
            </Link>
            <Link
              href="/categories/groceries"
              className="px-4 py-2 rounded-full text-sm font-semibold bg-[var(--color-surface-low)] text-[var(--color-inverted-bg)]/70 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] border border-[var(--color-outline-variant)]/30 transition-all"
            >
              Groceries
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {results.map((product) => {
            // Adapt the minimal search payload for the full ProductCard component
            const cardProduct = {
              _id: product.id,
              slug: product.slug,
              name: product.name,
              category: product.category,
              price: product.price,
              images: product.image ? [product.image] : [],
            };
            return <ProductCard key={product.id} product={cardProduct} />;
          })}
        </div>
      )}
    </div>
  );
}
