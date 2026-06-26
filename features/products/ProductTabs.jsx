"use client";

import { useState } from "react";

const TABS = [
  { key: "specs",          label: "Specifications" },
  { key: "experience",     label: "Experience" },
  { key: "sustainability", label: "Sustainability" },
];

const TAB_CONTENT = {
  specs: (
    <p className="text-sm text-[var(--color-inverted-bg)]/60 leading-relaxed">
      Full technical specifications are listed in the spec grid above. Additional
      documentation, compatibility guides, and configuration details are available
      in the product manual included in the box.
    </p>
  ),
  experience: (
    <p className="text-sm text-[var(--color-inverted-bg)]/60 leading-relaxed">
      Designed with premium materials and ergonomic principles for all-day comfort.
      Every detail has been considered — from the weight distribution to the
      tactile finish — to deliver a best-in-class feel from the moment you unbox.
    </p>
  ),
  sustainability: (
    <p className="text-sm text-[var(--color-inverted-bg)]/60 leading-relaxed">
      Packaged in 100% recycled cardboard with soy-based inks. The product
      housing uses at least 30% post-consumer recycled materials. AVEX is
      committed to achieving carbon-neutral shipping by 2026.
    </p>
  ),
};

/**
 * ProductTabs — client island, controls which tab is active with useState.
 * Content is static copy for now; in a future phase this can pull from the DB.
 */
export default function ProductTabs() {
  const [active, setActive] = useState("specs");

  return (
    <div className="flex flex-col gap-4">
      {/* Tab strip */}
      <div
        role="tablist"
        className="flex gap-1 border-b border-[var(--color-outline-variant)]/20"
      >
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            role="tab"
            aria-selected={active === key}
            onClick={() => setActive(key)}
            className={[
              "px-4 py-2.5 text-sm font-semibold transition-all duration-200",
              "border-b-2 -mb-px",
              active === key
                ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                : "border-transparent text-[var(--color-inverted-bg)]/45 hover:text-[var(--color-inverted-bg)]/70",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div role="tabpanel" className="py-1">
        {TAB_CONTENT[active]}
      </div>
    </div>
  );
}
