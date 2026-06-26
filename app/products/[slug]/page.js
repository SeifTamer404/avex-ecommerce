import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, getRelatedProducts } from "@/features/products/actions";
import ImageGallery from "@/features/products/ImageGallery";
import ProductActions from "@/features/products/ProductActions";
import ProductTabs from "@/features/products/ProductTabs";
import ProductCard from "@/features/products/ProductCard";

export const revalidate = 3600; // 1 hour ISR

// ── Helpers ───────────────────────────────────────────────────────────────────
const CATEGORY_LABELS = {
  electronics:  "Electronics",
  fashion:      "Fashion",
  "home-living":"Home & Living",
  beauty:       "Beauty",
  groceries:    "Groceries",
  toys:         "Toys",
};

function formatPrice(n) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

function StarRating({ rating }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} stars`}>
      {[...Array(5)].map((_, i) => {
        const icon = i < full ? "star" : i === full && half ? "star_half" : "star_border";
        return (
          <span
            key={i}
            className="material-symbols-outlined text-amber-400"
            style={{ fontSize: "1rem", fontVariationSettings: "'FILL' 1" }}
          >
            {icon}
          </span>
        );
      })}
    </div>
  );
}

// ── Dynamic metadata ──────────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description?.slice(0, 155),
    alternates: {
      canonical: `/products/${slug}`,
    },
    openGraph: {
      images: product.images?.[0] ? [product.images[0]] : [],
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Product detail page — server component
// ─────────────────────────────────────────────────────────────────────────────
export default async function ProductPage({ params }) {
  const { slug } = await params;

  // Parallel fetch — product + related, neither waits for the other
  const [product, related] = await Promise.all([
    getProductBySlug(slug),
    // We need product to get category, so related runs after product resolves.
    // We'll fix with a two-step below if product is null.
    Promise.resolve(null),
  ]);

  if (!product) notFound();

  // Now fetch related (needs product.category and product._id)
  const relatedProducts = await getRelatedProducts(product.category, product._id, 6);

  const onSale       = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPct  = onSale ? Math.round((1 - product.price / product.compareAtPrice) * 100) : null;
  const outOfStock   = product.stock === 0;
  const categoryLabel = CATEGORY_LABELS[product.category] ?? product.category;

  return (
    <div className="flex flex-col gap-12 mt-6">

      {/* ── Breadcrumb ──────────────────────────────────────────────────────── */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[var(--color-inverted-bg)]/40 flex-wrap">
        <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">Home</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <Link href="/categories" className="hover:text-[var(--color-primary)] transition-colors">Categories</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <Link href={`/categories/${product.category}`} className="hover:text-[var(--color-primary)] transition-colors">
          {categoryLabel}
        </Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-[var(--color-inverted-bg)]/70 font-medium line-clamp-1 max-w-[200px]">
          {product.name}
        </span>
      </nav>

      {/* ── Main content: image + info ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-14">

        {/* LEFT — Image gallery (client island) */}
        <div className="w-full">
          <ImageGallery images={product.images} name={product.name} />
        </div>

        {/* RIGHT — Product info */}
        <div className="flex flex-col gap-5">

          {/* Badges row */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-[var(--color-inverted-bg)]/50 bg-[var(--color-surface-low)] border border-[var(--color-outline-variant)]/20 px-2.5 py-1 rounded-full">
              {categoryLabel}
            </span>
            {onSale && (
              <span className="text-xs font-bold text-white bg-[var(--color-primary)] px-2.5 py-1 rounded-full">
                -{discountPct}% Sale
              </span>
            )}
            {outOfStock && (
              <span className="text-xs font-bold text-white bg-[var(--color-inverted-bg)]/60 px-2.5 py-1 rounded-full">
                Sold out
              </span>
            )}
          </div>

          {/* Name */}
          <h1 className="font-display font-extrabold text-2xl md:text-3xl text-[var(--color-inverted-bg)] leading-snug tracking-tight">
            {product.name}
          </h1>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center gap-2">
              <StarRating rating={product.rating} />
              <span className="text-sm font-semibold text-[var(--color-inverted-bg)]">
                {product.rating}
              </span>
              <span className="text-sm text-[var(--color-inverted-bg)]/40">
                ({product.reviewCount?.toLocaleString()} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="font-display font-extrabold text-3xl text-[var(--color-inverted-bg)] tracking-tight">
              {formatPrice(product.price)}
            </span>
            {onSale && (
              <span className="text-lg text-[var(--color-inverted-bg)]/35 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-[var(--color-inverted-bg)]/60 leading-relaxed border-t border-[var(--color-outline-variant)]/15 pt-4">
            {product.description}
          </p>

          {/* Stock indicator */}
          <div className="flex items-center gap-2 text-sm">
            <span
              className={`w-2 h-2 rounded-full flex-shrink-0 ${
                outOfStock ? "bg-red-500" : product.stock < 10 ? "bg-amber-400" : "bg-emerald-500"
              }`}
            />
            <span className="text-[var(--color-inverted-bg)]/50">
              {outOfStock
                ? "Out of stock"
                : product.stock < 10
                ? `Only ${product.stock} left in stock`
                : "In stock"}
            </span>
          </div>

          {/* CTA buttons — client island */}
          {!outOfStock && <ProductActions product={product} />}

          {/* Spec grid — 2×2 */}
          {product.specs?.length > 0 && (
            <div className="grid grid-cols-2 gap-3 border-t border-[var(--color-outline-variant)]/15 pt-5">
              {product.specs.slice(0, 4).map((spec) => (
                <div
                  key={spec.key}
                  className="flex flex-col gap-1 bg-[var(--color-surface-low)] border border-[var(--color-outline-variant)]/20 rounded-xl p-3.5"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-inverted-bg)]/35">
                    {spec.key}
                  </span>
                  <span className="text-sm font-semibold text-[var(--color-inverted-bg)]">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Trust badges */}
          <div className="flex flex-wrap gap-3 border-t border-[var(--color-outline-variant)]/15 pt-4">
            {[
              { icon: "local_shipping", text: "Free shipping over $50" },
              { icon: "autorenew",      text: "30-day returns" },
              { icon: "verified_user",  text: "2-year warranty" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 text-xs text-[var(--color-inverted-bg)]/45">
                <span className="material-symbols-outlined text-base text-[var(--color-primary)]">{icon}</span>
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tabs ────────────────────────────────────────────────────────────── */}
      <div className="border border-[var(--color-outline-variant)]/20 rounded-2xl p-6 bg-[var(--color-surface-low)]">
        <ProductTabs />
      </div>

      {/* ── Related products ─────────────────────────────────────────────────── */}
      {relatedProducts.length > 0 && (
        <section aria-labelledby="related-heading">
          <div className="flex items-end justify-between mb-5">
            <div>
              <p className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest mb-1">
                You might also like
              </p>
              <h2
                id="related-heading"
                className="font-display font-extrabold text-2xl tracking-tight text-[var(--color-inverted-bg)]"
              >
                Related Products
              </h2>
            </div>
            <Link
              href={`/categories/${product.category}`}
              className="hidden sm:flex items-center gap-1 text-sm font-semibold text-[var(--color-primary)] hover:underline"
            >
              View all {categoryLabel}
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </div>

          {/* Horizontal scroll on mobile, grid on desktop */}
          <div
            className="flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-3 lg:grid-cols-6"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {relatedProducts.map((p) => (
              <div
                key={p._id}
                className="flex-shrink-0 w-48 sm:w-56 md:w-auto snap-start"
              >
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
