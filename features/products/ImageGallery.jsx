"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * ImageGallery — client island.
 * Main image + thumbnail row. Clicking a thumbnail swaps the main image.
 * State is page-local (useState) — no Redux needed.
 */
export default function ImageGallery({ images = [], name = "" }) {
  const [active, setActive] = useState(0);

  const src = images[active] ?? null;

  return (
    <div className="flex flex-col gap-3">
      {/* ── Main image ──────────────────────────────────────────────────────── */}
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[var(--color-surface-low)] border border-[var(--color-outline-variant)]/20">
        {src ? (
          <Image
            key={src}
            src={src}
            alt={name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-opacity duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span
              className="material-symbols-outlined text-[var(--color-inverted-bg)]/20"
              style={{ fontSize: "4rem" }}
            >
              image
            </span>
          </div>
        )}
      </div>

      {/* ── Thumbnails — only if more than one image ─────────────────────────── */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={[
                "flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200",
                i === active
                  ? "border-[var(--color-primary)] opacity-100"
                  : "border-[var(--color-outline-variant)]/30 opacity-60 hover:opacity-90 hover:border-[var(--color-outline-variant)]",
              ].join(" ")}
            >
              <Image
                src={img}
                alt={`${name} thumbnail ${i + 1}`}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
