"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";

type AccentColor = "purple" | "teal" | "terracotta";

interface CaseStudyCardProps {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  image?: string;
  accentColor?: AccentColor;
  index?: number;
}

export default function CaseStudyCard({
  slug,
  title,
  subtitle,
  description,
  image,
  accentColor = "purple",
  index = 0,
}: CaseStudyCardProps) {
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    card.classList.remove("in-view");

    let observer: IntersectionObserver;
    const timer = setTimeout(() => {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            card.classList.add("in-view");
            observer.disconnect();
          }
        },
        { threshold: 0.15, rootMargin: "0px 0px -80px 0px" }
      );
      observer.observe(card);
    }, 100);

    return () => {
      clearTimeout(timer);
      observer?.disconnect();
      card.classList.remove("in-view");
    };
  }, []);

  return (
    <article
      ref={cardRef}
      className={`relative flex flex-col rounded-none overflow-hidden border border-ink/8 bg-white/60 card-animate card-accent-${accentColor} transition-transform duration-[350ms] ease-in-out hover:scale-[1.015]`}
      style={{ animationDelay: `${index * 120}ms` }}
    >
      {/* Full-card clickable link */}
      <Link
        href={`/case-studies/${slug}`}
        className="absolute inset-0 z-10 no-underline"
        aria-label={title}
      />

      {/* Thumbnail */}
      <div className="aspect-video w-full overflow-hidden" aria-hidden="true">
        {image ? (
          <Image
            src={image}
            alt=""
            width={800}
            height={450}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-light/30 to-purple/20" />
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-6 gap-4">
        <h3 className="font-serif text-ink text-[26px] leading-snug">
          {title}
        </h3>
        <p className="font-sans italic text-muted text-[16px]">{subtitle}</p>
        <p className="font-sans text-ink/80 text-[17px] leading-relaxed flex-1">
          {description}
        </p>
        <span
          className="font-sans font-medium text-[15px] text-purple mt-2 self-start view-case-link"
          aria-hidden="true"
        >
          View Case Study →
        </span>
      </div>
    </article>
  );
}
