"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

export interface GalleryItem {
  src: string;
  thumb: string;
  alt: string;
  caption: string;
  /** "browser" (default) frames it like a desktop window; "device" like a phone. */
  frame?: "browser" | "device";
  width: number;
  height: number;
  thumbWidth: number;
  thumbHeight: number;
}

/* Screely-style chrome: a title bar with three dots and an address pill. */
function BrowserBar() {
  return (
    <span className="flex items-center gap-[5px] h-[22px] px-2.5 bg-[#ece8e1] border-b border-ink/10">
      <span className="w-[7px] h-[7px] rounded-full bg-[#dd6b60]" />
      <span className="w-[7px] h-[7px] rounded-full bg-[#e3b341]" />
      <span className="w-[7px] h-[7px] rounded-full bg-[#73bf54]" />
      <span className="ml-1.5 flex-1 h-[11px] rounded-full bg-white/70" />
    </span>
  );
}

/* Phone-shaped shots get a speaker slot instead of a window title bar. */
function DeviceBar() {
  return (
    <span className="flex items-center justify-center h-[18px] bg-[#ece8e1] border-b border-ink/10">
      <span className="w-10 h-[4px] rounded-full bg-ink/25" />
    </span>
  );
}

export default function Gallery({
  items,
  heading,
  blurb,
}: {
  items: GalleryItem[];
  heading: string;
  blurb?: string;
}) {
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
      {blurb && (
        <p className="font-sans text-ink/80 text-[15px] leading-relaxed max-w-[62ch] mt-3">
          {blurb}
        </p>
      )}
      <p className="font-sans text-muted text-[13px] mb-6 mt-2">
        {items.length === 1
          ? "One screen. Select it to see it full size."
          : `${items.length} screens. Select one to see it full size.`}
      </p>

      {/* Masonry, so every screen keeps its own proportions and nothing is cropped */}
      <div className="columns-2 md:columns-3 gap-4 [column-fill:_balance]">
        {items.map((it, i) => (
          <figure key={it.src} className="mb-5 break-inside-avoid">
            <button
              type="button"
              onClick={() => setOpen(i)}
              className={`group block w-full cursor-pointer overflow-hidden ${it.frame === "device" ? "rounded-xl" : "rounded-md"} border border-ink/15 bg-white shadow-[0_1px_2px_rgba(26,24,20,0.06),0_6px_16px_-6px_rgba(26,24,20,0.18)] transition-[border-color,box-shadow] hover:border-purple/50 hover:shadow-[0_1px_2px_rgba(26,24,20,0.06),0_10px_24px_-8px_rgba(66,49,169,0.28)] focus:outline-none focus-visible:border-purple`}
              aria-label={`Open full size: ${it.alt}`}
            >
              {it.frame === "device" ? <DeviceBar /> : <BrowserBar />}
              <Image
                src={it.thumb}
                alt={it.alt}
                width={it.thumbWidth}
                height={it.thumbHeight}
                className="w-full h-auto transition-opacity group-hover:opacity-90"
              />
            </button>
            <figcaption className="font-sans text-muted text-[12px] leading-[1.45] mt-2">
              {it.caption}
            </figcaption>
          </figure>
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
          <figure
            className="w-full mx-auto"
            style={{ maxWidth: Math.min(current.width, 1100) }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              key={current.src}
              src={current.src}
              alt={current.alt}
              width={current.width}
              height={current.height}
              className="w-full h-auto bg-white"
            />
            <figcaption className="font-sans text-[13px] text-white/80 leading-relaxed mt-3 pb-4">
              {current.caption}
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
