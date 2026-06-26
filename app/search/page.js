import Link from "next/link";
import { getProducts } from "@/features/products/actions";
import ProductCard from "@/features/products/ProductCard";

export async function generateMetadata({ searchParams }) {
  const sp = await searchParams;
  const query = sp.q || "";
  return {
    title: query ? `Search: "${query}"` : "Search",
    description: query
      ? `Search results for "${query}" on AVEX`
      : "Search for products on AVEX",
    alternates: { canonical: "/search" },
  };
}

// ── Pagination component ───────────────────────────────────────────────────────
function Pagination({ currentPage, totalPages, query }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const delta = 2;

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      pages.push(i);
    } else if (
      i === currentPage - delta - 1 ||
      i === currentPage + delta + 1
    ) {
      pages.push("...");
    }
  }

  const buildHref = (p) =>
    `/search?q=${encodeURIComponent(query)}&page=${p}`;

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-2 mt-10 flex-wrap"
    >
      {/* Prev */}
      {currentPage > 1 ? (
        <Link
          href={buildHref(currentPage - 1)}
          className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold bg-[var(--color-surface-low)] border border-[var(--color-outline-variant)]/30 text-[var(--color-inverted-bg)]/70 hover:text-primary hover:border-primary transition-all"
        >
          <span className="material-symbols-outlined text-base">chevron_left</span>
          Prev
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold bg-[var(--color-surface-lowest)] border border-[var(--color-outline-variant)]/10 text-[var(--color-inverted-bg)]/25 cursor-not-allowed">
          <span className="material-symbols-outlined text-base">chevron_left</span>
          Prev
        </span>
      )}

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page, idx) =>
          page === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className="px-2 py-2 text-sm text-[var(--color-inverted-bg)]/30"
            >
              …
            </span>
          ) : page === currentPage ? (
            <span
              key={page}
              aria-current="page"
              className="w-9 h-9 flex items-center justify-center rounded-xl text-sm font-bold bg-primary text-white shadow-sm"
            >
              {page}
            </span>
          ) : (
            <Link
              key={page}
              href={buildHref(page)}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold bg-[var(--color-surface-low)] border border-[var(--color-outline-variant)]/30 text-[var(--color-inverted-bg)]/70 hover:text-primary hover:border-primary hover:bg-[var(--color-primary)]/5 transition-all"
            >
              {page}
            </Link>
          )
        )}
      </div>

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={buildHref(currentPage + 1)}
          className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold bg-[var(--color-surface-low)] border border-[var(--color-outline-variant)]/30 text-[var(--color-inverted-bg)]/70 hover:text-primary hover:border-primary transition-all"
        >
          Next
          <span className="material-symbols-outlined text-base">chevron_right</span>
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold bg-[var(--color-surface-lowest)] border border-[var(--color-outline-variant)]/10 text-[var(--color-inverted-bg)]/25 cursor-not-allowed">
          Next
          <span className="material-symbols-outlined text-base">chevron_right</span>
        </span>
      )}
    </nav>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function SearchPage({ searchParams }) {
  const sp = await searchParams;
  const query = sp.q || "";
  const page = Math.max(1, parseInt(sp.page || "1", 10));
  const sort = sp.sort || "newest";

  // ── Empty state (no query) ────────────────────────────────────────────────────
  if (!query || query.trim().length < 2) {
    return (
      <div className="flex flex-col gap-6 mt-6 min-h-[50vh] items-center justify-center text-center">
        <span
          className="material-symbols-outlined text-[var(--color-inverted-bg)]/20"
          style={{ fontSize: "4.5rem" }}
        >
          search
        </span>
        <h1 className="font-display font-extrabold text-2xl md:text-3xl tracking-tight text-[var(--color-inverted-bg)]">
          Search AVEX
        </h1>
        <p className="text-sm text-[var(--color-inverted-bg)]/50 max-w-md">
          Type above to find the best deals on electronics, fashion, groceries, and more.
        </p>
        {/* Popular categories */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
          {[
            { href: "/categories/electronics", label: "Electronics", icon: "devices" },
            { href: "/categories/fashion", label: "Fashion", icon: "apparel" },
            { href: "/categories/groceries", label: "Groceries", icon: "local_mall" },
            { href: "/categories/beauty", label: "Beauty", icon: "spa" },
          ].map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-[var(--color-surface-low)] text-[var(--color-inverted-bg)]/70 hover:text-primary hover:border-primary border border-[var(--color-outline-variant)]/30 transition-all"
            >
              <span className="material-symbols-outlined text-base">{icon}</span>
              {label}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // ── Fetch paginated results ───────────────────────────────────────────────────
  const { products, total, totalPages, page: currentPage } = await getProducts({
    search: query,
    page,
    sort,
  });

  return (
    <div className="flex flex-col gap-6 mt-6">
      {/* ── Breadcrumb ──────────────────────────────────────────────────────────── */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs text-[var(--color-inverted-bg)]/40"
      >
        <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">
          Home
        </Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-[var(--color-inverted-bg)]/70 font-medium">Search</span>
      </nav>

      {/* ── Header ──────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="font-display font-extrabold text-2xl md:text-3xl tracking-tight text-[var(--color-inverted-bg)]">
            Results for &quot;{query}&quot;
          </h1>
          <p className="text-sm text-[var(--color-inverted-bg)]/40">
            {total} {total === 1 ? "product" : "products"} found
            {totalPages > 1 && (
              <span> — page {currentPage} of {totalPages}</span>
            )}
          </p>
        </div>

        {/* Sort */}
        {total > 0 && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs text-[var(--color-inverted-bg)]/40 font-medium">Sort:</span>
            <div className="flex gap-1.5 flex-wrap">
              {[
                { value: "newest", label: "Relevant" },
                { value: "price-asc", label: "Price ↑" },
                { value: "price-desc", label: "Price ↓" },
                { value: "rating", label: "Rating" },
              ].map(({ value, label }) => (
                <Link
                  key={value}
                  href={`/search?q=${encodeURIComponent(query)}&sort=${value}&page=1`}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                    sort === value
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-[var(--color-surface-low)] text-[var(--color-inverted-bg)]/60 border-[var(--color-outline-variant)]/30 hover:text-primary hover:border-primary"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Results / Empty ───────────────────────────────────────────────────── */}
      {products.length === 0 ? (
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
            {[
              { href: "/categories/electronics", label: "Electronics" },
              { href: "/categories/fashion", label: "Fashion" },
              { href: "/categories/home-living", label: "Home & Living" },
              { href: "/categories/groceries", label: "Groceries" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-4 py-2 rounded-full text-sm font-semibold bg-[var(--color-surface-low)] text-[var(--color-inverted-bg)]/70 hover:text-primary hover:border-primary border border-[var(--color-outline-variant)]/30 transition-all"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* ── Pagination ───────────────────────────────────────────────────── */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            query={query}
          />
        </>
      )}
    </div>
  );
}
