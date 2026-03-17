"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { label: "Case Studies", href: "#case-studies" },
  { label: "Speaking & Writing", href: "#speaking" },
  { label: "About", href: "#about" },
  { label: "Let's Talk", href: "#contact" },
];

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
      setMenuOpen(false);
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      aria-label="Main navigation"
    >
      <div className="px-10 py-5 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          className="no-underline font-serif text-ink leading-tight hover:text-purple transition-colors"
          aria-label="Mel Milloway — home"
        >
          <span className="block text-[28px]">Mel</span>
          <span className="block text-[28px]">Milloway</span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8" role="list">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="font-sans text-[16px] font-medium text-muted hover:text-purple transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2 -mr-2"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span
            className={`block w-5 h-[2px] bg-ink transition-all duration-200 origin-center ${menuOpen ? "rotate-45 translate-y-[6.5px]" : ""}`}
          />
          <span
            className={`block w-5 h-[2px] bg-ink transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-5 h-[2px] bg-ink transition-all duration-200 origin-center ${menuOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden bg-cream transition-[max-height,opacity] duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          menuOpen ? "max-h-[500px] opacity-100 border-t border-ink/10" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col px-6 py-4 gap-5" role="list">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="font-sans text-[16px] font-medium text-muted hover:text-purple transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
