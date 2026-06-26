export default function ProductSkeletonCard() {
  return (
    <div className="flex flex-col bg-[var(--color-surface-low)] border border-[var(--color-outline-variant)]/20 rounded-2xl overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="w-full aspect-square bg-[var(--color-surface-highest)]" />

      {/* Info skeleton */}
      <div className="flex flex-col gap-2 p-3.5">
        {/* Title (2 lines) */}
        <div className="flex flex-col gap-1.5">
          <div className="h-4 bg-[var(--color-outline-variant)]/30 rounded w-full" />
          <div className="h-4 bg-[var(--color-outline-variant)]/30 rounded w-3/4" />
        </div>

        {/* Rating spacer */}
        <div className="h-3 w-1/3 bg-[var(--color-outline-variant)]/20 rounded mt-1" />

        {/* Price row */}
        <div className="h-5 w-1/2 bg-[var(--color-outline-variant)]/40 rounded mt-2" />
      </div>
    </div>
  );
}
