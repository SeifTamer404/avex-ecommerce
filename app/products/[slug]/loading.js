export default function LoadingProductDetail() {
  return (
    <div className="flex flex-col gap-12 mt-6 animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="h-4 w-64 bg-[var(--color-outline-variant)]/30 rounded-md" />

      {/* Main content: image + info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-14">
        {/* LEFT — Image gallery skeleton */}
        <div className="w-full">
          <div className="w-full aspect-square bg-[var(--color-surface-low)] border border-[var(--color-outline-variant)]/20 rounded-3xl" />
          <div className="flex gap-4 mt-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-20 h-20 bg-[var(--color-surface-low)] border border-[var(--color-outline-variant)]/20 rounded-xl" />
            ))}
          </div>
        </div>

        {/* RIGHT — Product info skeleton */}
        <div className="flex flex-col gap-5 pt-2">
          {/* Badges row */}
          <div className="h-6 w-24 bg-[var(--color-outline-variant)]/30 rounded-full" />

          {/* Name */}
          <div className="space-y-3">
            <div className="h-8 md:h-10 w-full bg-[var(--color-outline-variant)]/30 rounded-lg" />
            <div className="h-8 md:h-10 w-2/3 bg-[var(--color-outline-variant)]/30 rounded-lg" />
          </div>

          {/* Rating */}
          <div className="h-5 w-48 bg-[var(--color-outline-variant)]/20 rounded-md" />

          {/* Price */}
          <div className="h-10 w-32 bg-[var(--color-outline-variant)]/40 rounded-lg mt-2" />

          {/* Description */}
          <div className="space-y-2 mt-4">
            <div className="h-4 w-full bg-[var(--color-outline-variant)]/20 rounded-md" />
            <div className="h-4 w-5/6 bg-[var(--color-outline-variant)]/20 rounded-md" />
            <div className="h-4 w-3/4 bg-[var(--color-outline-variant)]/20 rounded-md" />
          </div>

          {/* Add to cart / quantity skeleton */}
          <div className="h-14 w-full max-w-md bg-[var(--color-outline-variant)]/30 rounded-xl mt-6" />

          {/* Features / delivery skeleton */}
          <div className="space-y-4 mt-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[var(--color-outline-variant)]/30" />
                <div className="h-5 w-40 bg-[var(--color-outline-variant)]/20 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
