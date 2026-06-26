export default function LoadingAccountOverview() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-8 w-32 bg-[var(--color-outline-variant)]/30 rounded-lg" />

      {/* Profile Card Skeleton */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-outline-variant)]/20 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center md:items-start shadow-sm">
        <div className="w-24 h-24 rounded-full bg-[var(--color-outline-variant)]/30 shrink-0" />
        <div className="flex-1 w-full flex flex-col md:flex-row gap-6 justify-between items-center md:items-start">
          <div className="space-y-3 w-full max-w-[200px] flex flex-col items-center md:items-start">
            <div className="h-6 w-3/4 bg-[var(--color-outline-variant)]/30 rounded-md" />
            <div className="h-4 w-1/2 bg-[var(--color-outline-variant)]/20 rounded-md" />
          </div>
          <div className="w-full md:w-64 bg-[var(--color-surface-highest)] rounded-2xl p-4 border border-[var(--color-outline-variant)]/30">
            <div className="h-4 w-full bg-[var(--color-outline-variant)]/30 rounded-md mb-3" />
            <div className="h-2 w-full bg-[var(--color-outline-variant)]/20 rounded-full mb-3" />
            <div className="h-3 w-5/6 bg-[var(--color-outline-variant)]/20 rounded-md" />
          </div>
        </div>
      </div>

      {/* 3 Stat Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-[var(--color-surface)] border border-[var(--color-outline-variant)]/20 rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-outline-variant)]/30" />
              <div className="w-16 h-4 bg-[var(--color-outline-variant)]/20 rounded-full" />
            </div>
            <div className="space-y-2 mt-4">
              <div className="h-4 w-24 bg-[var(--color-outline-variant)]/20 rounded-md" />
              <div className="h-8 w-16 bg-[var(--color-outline-variant)]/30 rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* Table & Settings Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Table Skeleton */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-6 w-32 bg-[var(--color-outline-variant)]/30 rounded-md" />
            <div className="h-4 w-16 bg-[var(--color-outline-variant)]/20 rounded-md" />
          </div>
          <div className="bg-[var(--color-surface)] border border-[var(--color-outline-variant)]/20 rounded-3xl p-4 shadow-sm min-h-[300px] flex flex-col gap-4">
            <div className="h-10 w-full bg-[var(--color-outline-variant)]/30 rounded-xl" />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 w-full bg-[var(--color-outline-variant)]/10 rounded-xl" />
            ))}
          </div>
        </div>

        {/* Account Settings Skeleton */}
        <div className="lg:col-span-2 space-y-4">
          <div className="h-6 w-40 bg-[var(--color-outline-variant)]/30 rounded-md" />
          <div className="bg-[var(--color-surface)] border border-[var(--color-outline-variant)]/20 rounded-3xl p-4 shadow-sm flex flex-col gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4 items-center h-16">
                <div className="w-10 h-10 rounded-full bg-[var(--color-outline-variant)]/30 shrink-0" />
                <div className="flex flex-col gap-2 w-full">
                  <div className="h-4 w-1/2 bg-[var(--color-outline-variant)]/30 rounded-md" />
                  <div className="h-3 w-3/4 bg-[var(--color-outline-variant)]/20 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
