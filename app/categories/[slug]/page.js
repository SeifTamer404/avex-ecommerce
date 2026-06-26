import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { getProducts } from "@/features/products/actions";
import ProductCard from "@/features/products/ProductCard";
import FilterPanel from "@/features/products/FilterPanel";

// ── Valid category slugs — rejects any unknown slug at the page level ─────────
const VALID_CATEGORIES = {
  electronics: "Electronics",
  fashion:     "Fashion",
  "home-living":"Home & Living",
  beauty:      "Beauty",
  groceries:   "Groceries",
  toys:        "Toys",
};

export const revalidate = 3600; // 1 hour ISR

// ── Dynamic metadata ──────────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const label = VALID_CATEGORIES[slug];
  if (!label) return { title: "Category Not Found" };
  return {
    title: label,
    description: `Browse the best ${label.toLowerCase()} products on AVEX.`,
    alternates: {
      canonical: `/categories/${slug}`,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Category listing page — server component
// All filter state lives in the URL:  ?sort=&minPrice=&maxPrice=&page=
// ─────────────────────────────────────────────────────────────────────────────
export default async function CategoryPage({ params, searchParams }) {
  const { slug } = await params;
  const sp = await searchParams;

  // 404 for unknown category slugs
  if (!VALID_CATEGORIES[slug]) notFound();

  const sort     = sp.sort     ?? "newest";
  const minPrice = sp.minPrice ? Number(sp.minPrice) : undefined;
  const maxPrice = sp.maxPrice ? Number(sp.maxPrice) : undefined;
  const page     = sp.page     ? Number(sp.page)     : 1;

  const { products, total, totalPages, hasNextPage, hasPrevPage } =
    await getProducts({ category: slug, page, sort, minPrice, maxPrice });

  const label = VALID_CATEGORIES[slug];

  // Build a page-navigation URL that keeps existing filter params
  function pageUrl(p) {
    const params = new URLSearchParams();
    if (sort     !== "newest") params.set("sort",     sort);
    if (minPrice !== undefined) params.set("minPrice", minPrice);
    if (maxPrice !== undefined) params.set("maxPrice", maxPrice);
    params.set("page", p);
    return `/categories/${slug}?${params.toString()}`;
  }

  return (
    <div className="flex flex-col gap-6 mt-6">

      {/* ── Breadcrumb ──────────────────────────────────────────────────────── */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[var(--color-inverted-bg)]/40">
        <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">Home</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-[var(--color-inverted-bg)]/70 font-medium">{label}</span>
      </nav>

      {/* ── Page heading ────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1">
        <h1 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight text-[var(--color-inverted-bg)]">
          {label}
        </h1>
        <p className="text-sm text-[var(--color-inverted-bg)]/40">
          {total} {total === 1 ? "product" : "products"} found
        </p>
      </div>

      {/* ── Layout: sidebar + grid ───────────────────────────────────────────── */}
      <div className="flex gap-8 items-start">

        {/* Sidebar (desktop only) */}
        <div className="hidden lg:block w-56 flex-shrink-0 sticky top-24">
          <Suspense>
            <FilterPanel
              currentSort={sort}
              currentMin={minPrice}
              currentMax={maxPrice}
            />
          </Suspense>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">

          {/* Mobile filter strip */}
          <div className="flex lg:hidden items-center gap-3 overflow-x-auto pb-1 -mx-4 px-4">
            <Suspense>
              <MobileFilterStrip
                slug={slug}
                sort={sort}
                minPrice={minPrice}
                maxPrice={maxPrice}
              />
            </Suspense>
          </div>

          {/* Product grid */}
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <span
                className="material-symbols-outlined text-[var(--color-inverted-bg)]/20"
                style={{ fontSize: "4rem" }}
              >
                search_off
              </span>
              <p className="font-display font-semibold text-lg text-[var(--color-inverted-bg)]/50">
                No products found
              </p>
              <p className="text-sm text-[var(--color-inverted-bg)]/30">
                Try adjusting your filters or{" "}
                <Link
                  href={`/categories/${slug}`}
                  className="text-[var(--color-primary)] hover:underline"
                >
                  clear them all
                </Link>
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav
              aria-label="Pagination"
              className="flex items-center justify-between pt-4 border-t border-[var(--color-outline-variant)]/20"
            >
              {hasPrevPage ? (
                <Link
                  href={pageUrl(page - 1)}
                  className={[
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold",
                    "bg-[var(--color-surface-low)] text-[var(--color-inverted-bg)]",
                    "border border-[var(--color-outline-variant)]/20",
                    "hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)] transition-all",
                  ].join(" ")}
                >
                  <span className="material-symbols-outlined text-base">arrow_back</span>
                  Previous
                </Link>
              ) : <div />}

              <p className="text-sm text-[var(--color-inverted-bg)]/40">
                Page {page} of {totalPages}
              </p>

              {hasNextPage ? (
                <Link
                  href={pageUrl(page + 1)}
                  className={[
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold",
                    "bg-[var(--color-surface-low)] text-[var(--color-inverted-bg)]",
                    "border border-[var(--color-outline-variant)]/20",
                    "hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)] transition-all",
                  ].join(" ")}
                >
                  Next
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </Link>
              ) : <div />}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Mobile filter strip — quick sort chips ─────────────────────────────────────
// Inlined here to avoid an extra file; server component, reads from props
function MobileFilterStrip({ slug, sort, minPrice, maxPrice }) {
  const SORT_CHIPS = [
    { value: "newest",     label: "Newest" },
    { value: "price-asc",  label: "$ Low–High" },
    { value: "price-desc", label: "$ High–Low" },
    { value: "rating",     label: "Top Rated" },
  ];

  return (
    <>
      {SORT_CHIPS.map((chip) => {
        const params = new URLSearchParams();
        params.set("sort", chip.value);
        if (minPrice) params.set("minPrice", minPrice);
        if (maxPrice) params.set("maxPrice", maxPrice);
        const active = sort === chip.value;
        return (
          <Link
            key={chip.value}
            href={`/categories/${slug}?${params.toString()}`}
            className={[
              "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
              active
                ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                : "bg-[var(--color-surface-low)] text-[var(--color-inverted-bg)]/60 border-[var(--color-outline-variant)]/30 hover:border-[var(--color-primary)]/40",
            ].join(" ")}
          >
            {chip.label}
          </Link>
        );
      })}
    </>
  );
}
