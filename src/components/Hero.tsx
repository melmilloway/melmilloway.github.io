"use client";

import { Fragment } from "react";
import HeroBlob from "./HeroBlob";

export default function Hero() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative min-h-screen flex items-start overflow-hidden pt-40 pb-16 md:pt-24 hero-section"
      aria-label="Hero"
    >
      <div className="max-w-[1400px] mx-auto px-6 w-full grid md:grid-cols-[3fr_2fr] gap-12 items-center">
        {/* Text content */}
        <div className="relative z-10">
          <h1 className="font-serif text-ink mb-6 hero-headline">
            <span className="hero-headline-line">
              {(["I", "create", "and", "lead", "learning"] as const).map((w, i) => (
                <Fragment key={w}><span className="hero-word" style={{ animation: `wordIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) ${i * 65}ms both` }}>{w}</span>{" "}</Fragment>
              ))}
            </span>
            <span className="hero-headline-line">
              {(["systems", "that", "drive", "results"] as const).map((w, i) => (
                <Fragment key={w}><span className="hero-word" style={{ animation: `wordIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) ${(5 + i) * 65}ms both` }}>{w}</span>{" "}</Fragment>
              ))}
            </span>
            <span className="hero-headline-line">
              <span className="hero-word" style={{ animation: `wordIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) ${9 * 65}ms both` }}>at</span>{" "}
              <em className="instrument-serif-italic" style={{ fontStyle: "italic" }}>
                <span className="hero-word" style={{ animation: `wordIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) ${10 * 65}ms both` }}>any</span>{" "}
                <span className="hero-word" style={{ animation: `wordIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) ${11 * 65}ms both` }}>scale</span>
              </em>
              <span className="hero-word" style={{ animation: `wordIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) ${11 * 65}ms both` }}>.</span>
            </span>
          </h1>

          <p
            className="font-sans text-[16px] font-medium text-muted mb-10 max-w-md"
            style={{ animation: "fadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) 1.1s both" }}
          >
            Previously at Amazon, leading teams that impacted more than 1
            million employees.
          </p>

          <div className="flex flex-wrap items-center gap-6">
            <button
              onClick={() => scrollTo("case-studies")}
              className="font-sans font-semibold text-[16px] text-white bg-purple px-6 py-3 rounded-none hover:bg-purple-medium transition-[background-color,transform] active:scale-[0.97]"
              style={{ animation: "fadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) 1.3s both" }}
            >
              View case studies
            </button>
            <button
              onClick={() => scrollTo("contact")}
              className="font-sans font-medium text-[15px] text-purple link-underline"
              style={{ animation: "fadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) 1.5s both" }}
            >
              Get in touch
            </button>
          </div>
        </div>

        {/* Blob container — absolute overlay on mobile, in-flow on desktop */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none md:relative md:inset-auto md:overflow-visible md:flex md:justify-end" style={{ zIndex: 0 }}>
          <HeroBlob />
          <div
            className="absolute inset-0 md:hidden"
            style={{ background: "linear-gradient(to right, #faf8f4 0%, transparent 65%), linear-gradient(to bottom, transparent 55%, #faf8f4 72%)" }}
          />
        </div>
      </div>
    </section>
  );
}
