"use client";

import { useEffect, useRef } from "react";
import AnimatedHeading from "./AnimatedHeading";
import GapChart from "./GapChart";

interface CaseStudySectionProps {
  heading: string;
  body: string;
  index: number;
  visual?: "gap-chart";
  /** Render the visual after this paragraph (0-based). Omitted means after the last one. */
  visualAfter?: number;
}

const LINK = /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)/g;

// Body copy is plain text apart from markdown-style links, so parse those into anchors.
function renderBody(text: string) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  LINK.lastIndex = 0;
  while ((match = LINK.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const [, label, href] = match;
    parts.push(
      <a
        key={`${href}-${match.index}`}
        href={href}
        {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="no-underline text-purple underline decoration-purple underline-offset-4 hover:text-purple-medium transition-colors"
      >
        {label}
      </a>
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length ? parts : text;
}

export default function CaseStudySection({ heading, body, index, visual, visualAfter }: CaseStudySectionProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.opacity = "0";

    let observer: IntersectionObserver;
    const timer = setTimeout(() => {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.style.animation = `cardIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) both`;
            observer.disconnect();
          }
        },
        { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
      );
      observer.observe(el);
    }, 100);

    return () => {
      clearTimeout(timer);
      observer?.disconnect();
    };
  }, [index]);

  return (
    <section
      ref={ref}
      aria-labelledby={heading}
      className="grid gap-x-10 lg:gap-x-14 md:grid-cols-[180px_minmax(0,1fr)] lg:grid-cols-[200px_minmax(0,1fr)]"
    >
      <AnimatedHeading
        as="h2"
        className="font-serif text-ink text-[24px] tracking-[-0.01em] mb-4 md:mb-0 md:pt-1 md:sticky md:top-28 md:self-start"
      >
        {heading}
      </AnimatedHeading>
      <div>
      {(() => {
        const paragraphs = body.split("\n\n");
        const at = visualAfter ?? paragraphs.length - 1;
        return paragraphs.map((paragraph, i) => (
          <div key={i}>
            <p className="font-sans text-ink/85 text-[16px] leading-relaxed mb-4">
              {renderBody(paragraph)}
            </p>
            {visual === "gap-chart" && i === at && <GapChart />}
          </div>
        ));
      })()}
      </div>
    </section>
  );
}
