import ProductSkeletonCard from "@/features/products/ProductSkeletonCard";

export default function LoadingSearchPage() {
  return (
    <div className="flex flex-col gap-6 mt-6 animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="h-4 w-32 bg-[var(--color-outline-variant)]/30 rounded-md" />

      {/* Page heading skeleton */}
      <div className="flex flex-col gap-2">
        <div className="h-10 w-64 bg-[var(--color-outline-variant)]/30 rounded-lg" />
        <div className="h-4 w-24 bg-[var(--color-outline-variant)]/20 rounded-md" />
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <ProductSkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
