import Link from "next/link";
import Image from "next/image";
import AddToCartButton from "./AddToCartButton";
import WishlistButton from "./WishlistButton";

// ── Helpers ───────────────────────────────────────────────────────────────────
const CATEGORY_LABELS = {
  electronics: "Electronics",
  fashion: "Fashion",
  "home-living": "Home & Living",
  beauty: "Beauty",
  groceries: "Groceries",
  toys: "Toys",
};

function formatPrice(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

function StarRating({ rating }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {[...Array(5)].map((_, i) => {
        let icon = "star";
        if (i < full) icon = "star";
        else if (i === full && half) icon = "star_half";
        else icon = "star_border";
        return (
          <span
            key={i}
            className="material-symbols-outlined text-amber-400"
            style={{ fontSize: "0.85rem", fontVariationSettings: "'FILL' 1" }}
          >
            {icon}
          </span>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ProductCard
// Server component — no 'use client'. AddToCartButton is the only client island.
//
// Props:
//   product — plain serialized product from a server action (.lean() result)
// ─────────────────────────────────────────────────────────────────────────────
export default function ProductCard({ product }) {
  const {
    slug,
    name,
    category,
    price,
    compareAtPrice,
    images,
    rating,
    reviewCount,
    stock,
  } = product;

  const image = images?.[0];
  const onSale = compareAtPrice && compareAtPrice > price;
  const discountPct = onSale
    ? Math.round((1 - price / compareAtPrice) * 100)
    : null;
  const outOfStock = stock === 0;
  const categoryLabel = CATEGORY_LABELS[category] ?? category;

  return (
    <Link
      href={`/products/${slug}`}
      className={[
        "group relative flex flex-col",
        "bg-[var(--color-surface-low)]",
        "border border-[var(--color-outline-variant)]/20",
        "rounded-2xl overflow-hidden",
        /* kinetic hover — lift + shadow */
        "transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
        "hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10",
        "hover:border-[var(--color-outline-variant)]/50",
      ].join(" ")}
    >
      {/* ── Image ───────────────────────────────────────────────────────────── */}
      <div className="relative w-full aspect-square bg-[var(--color-surface-highest)] overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span
              className="material-symbols-outlined text-[var(--color-inverted-bg)]/20"
              style={{ fontSize: "3rem" }}
            >
              image
            </span>
          </div>
        )}

        {/* Badges (top-left stack) */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {/* Category chip */}
          <span className="bg-[var(--color-surface)]/80 backdrop-blur-sm text-[var(--color-inverted-bg)]/70 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-[var(--color-outline-variant)]/30 leading-tight">
            {categoryLabel}
          </span>

          {/* Sale badge */}
          {onSale && (
            <span className="bg-[var(--color-primary)] text-white text-[10px] font-bold px-2 py-0.5 rounded-full leading-tight">
              -{discountPct}%
            </span>
          )}

          {/* Out-of-stock badge */}
          {outOfStock && (
            <span className="bg-[var(--color-inverted-bg)]/70 text-[var(--color-inverted-text)] text-[10px] font-bold px-2 py-0.5 rounded-full leading-tight">
              Sold out
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <WishlistButton productId={product._id?.toString() || product.id} />

        {/* Add-to-cart button — client island, appears on hover */}
        {!outOfStock && <AddToCartButton product={product} />}
      </div>

      {/* ── Info ────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1.5 p-3.5">
        {/* Name */}
        <h3 className="text-sm font-semibold text-[var(--color-inverted-bg)] leading-snug line-clamp-2 font-display">
          {name}
        </h3>

        {/* Rating row */}
        {rating > 0 && (
          <div className="flex items-center gap-1.5">
            <StarRating rating={rating} />
            <span className="text-[11px] text-[var(--color-inverted-bg)]/40">
              ({reviewCount.toLocaleString()})
            </span>
          </div>
        )}

        {/* Price row */}
        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="text-base font-extrabold text-[var(--color-inverted-bg)] font-display tracking-tight">
            {formatPrice(price)}
          </span>
          {onSale && (
            <span className="text-xs text-[var(--color-inverted-bg)]/35 line-through">
              {formatPrice(compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
