import Link from "next/link";
import { getProducts } from "@/features/products/actions";
import ProductCard from "@/features/products/ProductCard";

export const metadata = {
  title: "Deals & Offers",
  description: "Discover the best deals and offers on AVEX.",
  alternates: {
    canonical: "/deals",
  },
};

export default async function DealsPage({ searchParams }) {
  const sp = await searchParams;
  const page = sp.page ? Number(sp.page) : 1;

  // We sort by price-asc to simulate "deals" (cheapest products)
  const { products, total, totalPages, hasNextPage, hasPrevPage } = await getProducts({
    sort: "price-asc",
    page,
  });

  return (
    <div className="flex flex-col gap-6 mt-6">
      {/* ── Breadcrumb ──────────────────────────────────────────────────────── */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[var(--color-inverted-bg)]/40">
        <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">Home</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-[var(--color-inverted-bg)]/70 font-medium">Deals</span>
      </nav>

      {/* ── Page heading ────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1">
        <h1 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight text-[var(--color-inverted-bg)]">
          Today's Best Deals
        </h1>
        <p className="text-sm text-[var(--color-inverted-bg)]/40">
          {total} {total === 1 ? "product" : "products"} with amazing discounts
        </p>
      </div>

      {/* ── Product grid ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* ── Pagination ──────────────────────────────────────────────────────── */}
      {totalPages > 1 && (
        <nav aria-label="Pagination" className="flex items-center justify-between pt-4 border-t border-[var(--color-outline-variant)]/20">
          {hasPrevPage ? (
            <Link
              href={`/deals?page=${page - 1}`}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-[var(--color-surface-low)] text-[var(--color-inverted-bg)] border border-[var(--color-outline-variant)]/20 hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)] transition-all"
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
              href={`/deals?page=${page + 1}`}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-[var(--color-surface-low)] text-[var(--color-inverted-bg)] border border-[var(--color-outline-variant)]/20 hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)] transition-all"
            >
              Next
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          ) : <div />}
        </nav>
      )}
    </div>
  );
}
