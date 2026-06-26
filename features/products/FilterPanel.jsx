"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const SORT_OPTIONS = [
  { value: "newest",     label: "Newest" },
  { value: "price-asc",  label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating",     label: "Top Rated" },
];

/**
 * FilterPanel — client island.
 * Writes filter state into the URL (searchParams) so the server component
 * above re-fetches with fresh data on every change. No local state for
 * the actual filter values — URL is the single source of truth.
 */
export default function FilterPanel({ currentSort, currentMin, currentMax }) {
  const router     = useRouter();
  const pathname   = usePathname();
  const searchParams = useSearchParams();

  // Build a new URL with one param changed, preserving all others
  const buildUrl = useCallback(
    (updates) => {
      const params = new URLSearchParams(searchParams.toString());
      // Reset page on any filter change — stale page is irrelevant after filter
      params.set("page", "1");
      Object.entries(updates).forEach(([k, v]) => {
        if (v === "" || v == null) params.delete(k);
        else params.set(k, v);
      });
      return `${pathname}?${params.toString()}`;
    },
    [pathname, searchParams],
  );

  function handleSort(e) {
    router.push(buildUrl({ sort: e.target.value }));
  }

  function handlePriceApply(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const min = form.minPrice.value.trim();
    const max = form.maxPrice.value.trim();
    router.push(buildUrl({ minPrice: min, maxPrice: max }));
  }

  function handleClear() {
    router.push(pathname);
  }

  const hasActiveFilters =
    currentSort !== "newest" || currentMin || currentMax;

  return (
    <aside className="flex flex-col gap-6">

      {/* ── Sort ────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="sort-select"
          className="text-xs font-bold uppercase tracking-widest text-[var(--color-inverted-bg)]/50"
        >
          Sort by
        </label>
        <div className="relative">
          <select
            id="sort-select"
            value={currentSort}
            onChange={handleSort}
            className={[
              "w-full appearance-none",
              "bg-[var(--color-surface-low)] text-[var(--color-inverted-bg)]",
              "border border-[var(--color-outline-variant)]/30 rounded-xl",
              "px-4 py-2.5 pr-9 text-sm font-medium",
              "focus:outline-none focus:border-[var(--color-primary)]/50 focus:ring-1 focus:ring-[var(--color-primary)]/30",
              "transition-colors cursor-pointer",
            ].join(" ")}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <span
            className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-inverted-bg)]/40 pointer-events-none text-base"
          >
            unfold_more
          </span>
        </div>
      </div>

      {/* ── Price range ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-inverted-bg)]/50">
          Price range
        </p>
        <form onSubmit={handlePriceApply} className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--color-inverted-bg)]/40">$</span>
              <input
                type="number"
                name="minPrice"
                defaultValue={currentMin ?? ""}
                placeholder="Min"
                min={0}
                className={[
                  "w-full bg-[var(--color-surface-low)] text-[var(--color-inverted-bg)]",
                  "border border-[var(--color-outline-variant)]/30 rounded-xl",
                  "pl-6 pr-3 py-2.5 text-sm",
                  "focus:outline-none focus:border-[var(--color-primary)]/50 focus:ring-1 focus:ring-[var(--color-primary)]/30",
                  "transition-colors",
                  "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                ].join(" ")}
              />
            </div>
            <span className="text-[var(--color-inverted-bg)]/30 text-xs">–</span>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--color-inverted-bg)]/40">$</span>
              <input
                type="number"
                name="maxPrice"
                defaultValue={currentMax ?? ""}
                placeholder="Max"
                min={0}
                className={[
                  "w-full bg-[var(--color-surface-low)] text-[var(--color-inverted-bg)]",
                  "border border-[var(--color-outline-variant)]/30 rounded-xl",
                  "pl-6 pr-3 py-2.5 text-sm",
                  "focus:outline-none focus:border-[var(--color-primary)]/50 focus:ring-1 focus:ring-[var(--color-primary)]/30",
                  "transition-colors",
                  "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                ].join(" ")}
              />
            </div>
          </div>
          <button
            type="submit"
            className={[
              "w-full py-2 rounded-xl text-sm font-semibold",
              "bg-[var(--color-primary)] text-white",
              "hover:opacity-90 active:scale-95 transition-all",
            ].join(" ")}
          >
            Apply
          </button>
        </form>
      </div>

      {/* ── Clear filters ────────────────────────────────────────────────────── */}
      {hasActiveFilters && (
        <button
          onClick={handleClear}
          className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-inverted-bg)]/40 hover:text-[var(--color-primary)] transition-colors"
        >
          <span className="material-symbols-outlined text-base">close</span>
          Clear all filters
        </button>
      )}
    </aside>
  );
}
