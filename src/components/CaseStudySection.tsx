"use client";

import { useEffect, useRef } from "react";
import AnimatedHeading from "./AnimatedHeading";

interface CaseStudySectionProps {
  heading: string;
  body: string;
  index: number;
}

export default function CaseStudySection({ heading, body, index }: CaseStudySectionProps) {
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
    <section ref={ref} aria-labelledby={heading}>
      <AnimatedHeading
        as="h2"
        className="font-serif text-ink text-[24px] tracking-[-0.01em] mb-4"
      >
        {heading}
      </AnimatedHeading>
      {body.split("\n\n").map((paragraph, i) => (
        <p
          key={i}
          className="font-sans text-ink/85 text-[16px] leading-relaxed mb-4 last:mb-0"
        >
          {paragraph}
        </p>
      ))}
    </section>
  );
}
