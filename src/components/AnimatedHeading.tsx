"use client";

import { Fragment, useEffect, useRef, useState } from "react";

interface AnimatedHeadingProps {
  as?: "h1" | "h2" | "h3";
  id?: string;
  children: string;
  className?: string;
}

export default function AnimatedHeading({
  as: Tag = "h2",
  id,
  children,
  className,
}: AnimatedHeadingProps) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    setInView(false);

    let observer: IntersectionObserver;
    const timer = setTimeout(() => {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        },
        { threshold: 0.5, rootMargin: "0px 0px -40px 0px" }
      );
      observer.observe(el);
    }, 100);

    return () => {
      clearTimeout(timer);
      observer?.disconnect();
    };
  }, []);

  const words = children.split(" ");

  return (
    <Tag ref={ref} id={id} className={className}>
      {words.map((word, i) => (
        <Fragment key={i}>
          {i > 0 && " "}
          <span
            style={{
              display: "inline-block",
              ...(inView
                ? { animation: `wordIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) ${i * 80}ms both` }
                : { opacity: 0 }),
            }}
          >
            {word}
          </span>
        </Fragment>
      ))}
    </Tag>
  );
}
