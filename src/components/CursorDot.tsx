"use client";

import { useEffect, useRef } from "react";

export default function CursorDot() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    const interactive = "a, button, input, textarea, select, [role='button'], [role='link'], label";

    const onMove = (e: MouseEvent) => {
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
      dot.style.opacity = "1";
    };

    const onOver = (e: MouseEvent) => {
      if ((e.target as Element).closest(interactive)) {
        dot.classList.add("is-hovering");
      }
    };

    const onOut = (e: MouseEvent) => {
      if ((e.target as Element).closest(interactive)) {
        dot.classList.remove("is-hovering");
      }
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, []);

  return (
    <div
      id="circularcursor"
      ref={dotRef}
      aria-hidden="true"
    />
  );
}
