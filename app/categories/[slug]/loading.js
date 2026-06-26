import ProductSkeletonCard from "@/features/products/ProductSkeletonCard";

export default function LoadingCategoryPage() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      {/* Breadcrumbs & Title */}
      <div className="space-y-4">
        <div className="h-4 w-40 bg-[var(--color-outline-variant)]/30 rounded-md" />
        <div className="h-10 w-64 bg-[var(--color-outline-variant)]/30 rounded-lg" />
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-hidden mb-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 w-24 bg-[var(--color-surface-low)] border border-[var(--color-outline-variant)]/20 rounded-full shrink-0" />
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6">
        {[...Array(12)].map((_, i) => (
          <ProductSkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
