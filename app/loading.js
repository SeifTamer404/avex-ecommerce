import ProductSkeletonCard from "@/features/products/ProductSkeletonCard";

export default function LoadingHomepage() {
  return (
    <div className="flex flex-col gap-16 pb-8 animate-pulse">
      {/* HERO SKELETON */}
      <section className="relative -mx-4 md:-mx-8 overflow-hidden rounded-none md:rounded-3xl min-h-[480px] md:min-h-[560px] flex items-center bg-[var(--color-surface-low)]">
        <div className="relative z-10 px-6 md:px-16 py-20 w-full max-w-2xl">
          <div className="h-6 w-48 bg-[var(--color-outline-variant)]/30 rounded-full mb-6" />
          <div className="h-16 md:h-20 w-3/4 bg-[var(--color-outline-variant)]/30 rounded-2xl mb-6" />
          <div className="h-16 md:h-20 w-1/2 bg-[var(--color-outline-variant)]/30 rounded-2xl mb-8" />
          <div className="space-y-3 mb-10">
            <div className="h-4 w-full bg-[var(--color-outline-variant)]/20 rounded-md" />
            <div className="h-4 w-5/6 bg-[var(--color-outline-variant)]/20 rounded-md" />
            <div className="h-4 w-2/3 bg-[var(--color-outline-variant)]/20 rounded-md" />
          </div>
          <div className="h-14 w-40 bg-[var(--color-outline-variant)]/30 rounded-xl" />
        </div>
      </section>

      {/* CATEGORIES SKELETON */}
      <section>
        <div className="h-8 w-48 bg-[var(--color-outline-variant)]/30 rounded-lg mb-8" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[var(--color-surface-low)] rounded-3xl aspect-square border border-[var(--color-outline-variant)]/20 flex flex-col items-center justify-center p-4">
              <div className="w-12 h-12 rounded-full bg-[var(--color-outline-variant)]/30 mb-4" />
              <div className="h-4 w-20 bg-[var(--color-outline-variant)]/30 rounded-md" />
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS SKELETON */}
      <section>
        <div className="h-8 w-64 bg-[var(--color-outline-variant)]/30 rounded-lg mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={i === 4 ? "hidden xl:block" : ""}>
              <ProductSkeletonCard />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
