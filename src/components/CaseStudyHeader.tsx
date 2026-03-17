"use client";

import Image from "next/image";
import { Fragment } from "react";

interface CaseStudyHeaderProps {
  title: string;
  subtitle: string;
  disclaimer?: string;
  image?: string;
  liveLink?: { label: string; href: string };
}

const easing = "cubic-bezier(0.22, 1, 0.36, 1)";

export default function CaseStudyHeader({
  title,
  subtitle,
  disclaimer,
  image,
  liveLink,
}: CaseStudyHeaderProps) {
  const words = title.split(" ");

  return (
    <header className="grid md:grid-cols-2 gap-12 items-center mb-16">
      {image && (
        <div
          className="w-full aspect-video overflow-hidden"
          style={{ animation: `fadeIn 0.6s ${easing} 0.05s both` }}
        >
          <Image
            src={image}
            alt=""
            width={896}
            height={504}
            className="w-full h-full object-cover"
            priority
          />
        </div>
      )}
      <div>
        {disclaimer && (
          <p
            className="font-serif italic text-muted text-[15px] mb-6 pb-6 border-b border-ink/10"
            style={{ animation: `fadeIn 0.5s ${easing} 0.1s both` }}
          >
            {disclaimer}
          </p>
        )}
        <h1
          className="font-serif text-ink mb-4"
          style={{
            fontSize: "clamp(32px, 4vw, 52px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}
        >
          {words.map((word, i) => (
            <Fragment key={i}>
              {i > 0 && " "}
              <span
                style={{
                  display: "inline-block",
                  animation: `wordIn 0.55s ${easing} ${i * 80}ms both`,
                }}
              >
                {word}
              </span>
            </Fragment>
          ))}
        </h1>
        <p
          className="font-sans italic text-muted text-[16px]"
          style={{ animation: `fadeIn 0.5s ${easing} 0.2s both` }}
        >
          {subtitle}
        </p>
        {liveLink && (
          <a
            href={liveLink.href}
            {...(liveLink.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="inline-block mt-6 font-sans font-semibold text-[14px] text-white bg-purple px-6 py-3 rounded-none hover:bg-purple-medium transition-colors"
            style={{ animation: `fadeIn 0.5s ${easing} 0.35s both` }}
          >
            {liveLink.label} {"\u2197\uFE0E"}
          </a>
        )}
      </div>
    </header>
  );
}
