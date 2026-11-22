"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

export interface GalleryItem {
  src: string;
  thumb: string;
  alt: string;
  width: number;
  height: number;
  thumbWidth: number;
  thumbHeight: number;
}

export default function Gallery({ items, heading }: { items: GalleryItem[]; heading: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (d: number) => setOpen((i) => (i === null ? i : (i + d + items.length) % items.length)),
    [items.length]
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close, step]);

  if (!items.length) return null;
  const current = open === null ? null : items[open];

  return (
    <section className="mt-16 md:mt-20" aria-labelledby="gallery-heading">
      <h2
        id="gallery-heading"
        className="font-serif text-ink text-[24px] tracking-[-0.01em] mb-1"
      >
        {heading}
      </h2>
      <p className="font-sans text-muted text-[13px] mb-6">
        {items.length === 1
          ? "One screen. Select it to see it full size."
          : `${items.length} screens. Select one to see it full size.`}
      </p>

      {/* Masonry, so every screen keeps its own proportions and nothing is cropped */}
      <div className="columns-2 md:columns-3 gap-3 [column-fill:_balance]">
        {items.map((it, i) => (
          <button
            key={it.src}
            type="button"
            onClick={() => setOpen(i)}
            className="group mb-3 block w-full break-inside-avoid cursor-pointer border border-ink/10 bg-white overflow-hidden transition-colors hover:border-purple/60 focus:outline-none focus-visible:border-purple"
            aria-label={`Open full size: ${it.alt}`}
          >
            <Image
              src={it.thumb}
              alt={it.alt}
              width={it.thumbWidth}
              height={it.thumbHeight}
              className="w-full h-auto transition-opacity group-hover:opacity-85"
            />
          </button>
        ))}
      </div>

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          className="fixed inset-0 z-50 bg-ink/90 overflow-auto overscroll-contain p-4 sm:p-8"
          onClick={close}
        >
          <div className="sticky top-0 z-10 flex items-center justify-between gap-4 mb-4">
            <p className="font-sans text-[13px] text-white/80">
              {open! + 1} of {items.length}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); step(-1); }}
                className="font-sans text-[13px] text-white/90 bg-white/10 hover:bg-white/20 px-3 py-1.5 cursor-pointer"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); step(1); }}
                className="font-sans text-[13px] text-white/90 bg-white/10 hover:bg-white/20 px-3 py-1.5 cursor-pointer"
              >
                Next
              </button>
              <button
                type="button"
                onClick={close}
                className="font-sans text-[13px] text-ink bg-white hover:bg-white/90 px-3 py-1.5 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
          <Image
            key={current.src}
            src={current.src}
            alt={current.alt}
            width={current.width}
            height={current.height}
            className="w-full max-w-[1100px] h-auto mx-auto bg-white"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
