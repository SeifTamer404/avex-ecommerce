import { getWishlist } from "@/features/user/actions";
import ProductCard from "@/features/products/ProductCard";
import Link from "next/link";
import { Heart } from "lucide-react";

export const metadata = {
  title: "My Wishlist",
  description: "View and manage your saved products",
  alternates: {
    canonical: "/account/wishlist",
  },
};

export default async function WishlistPage() {
  const products = await getWishlist();

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-8 md:mb-10">
        <h1 className="text-2xl md:text-3xl font-bold font-display tracking-tight text-[var(--color-inverted-bg)]">
          My Wishlist
        </h1>
        <p className="text-[var(--color-inverted-bg)]/55 text-sm md:text-base mt-2 max-w-2xl">
          Products you've saved for later. Prices and availability may change.
        </p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-[var(--color-surface-low)] border border-[var(--color-outline-variant)]/40 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-20 h-20 bg-[var(--color-primary)]/5 rounded-full flex items-center justify-center mb-6">
            <Heart className="w-10 h-10 text-[var(--color-primary)]/40" strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-bold font-display text-[var(--color-inverted-bg)] mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-[var(--color-inverted-bg)]/55 mb-8 max-w-sm mx-auto text-sm">
            Save items you love by clicking the heart icon on any product.
          </p>
          <Link
            href="/"
            className="bg-[var(--color-primary)] text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-[var(--color-primary)]/20 hover:shadow-[var(--color-primary)]/30 hover:-translate-y-0.5 transition-all active:translate-y-0"
          >
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
}
