"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "./button";

const NAV_LINKS = [
  { label: "Home", href: "#" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Compatibility", href: "#compatibility" },
  { label: "FAQ", href: "#faq" },
];

const ZipIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="2" width="9" height="2" rx="1" fill="currentColor" opacity="0.9" />
    <rect x="3" y="6" width="6" height="2" rx="1" fill="currentColor" opacity="0.7" />
    <rect x="3" y="10" width="9" height="2" rx="1" fill="currentColor" opacity="0.5" />
    <path d="M13 12 L17 16 M13 16 L17 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    <path d="M10 14 L10 19 M8 17 L10 19 L12 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "py-3 bg-[#0a0a0a]/90 backdrop-blur-xl" : "py-5 bg-transparent"
        }`}
      >
        <div className="mx-auto px-5 flex items-center justify-between md:px-14 p-4 md:p-0">
          <Link href="/" className="flex items-center gap-2.5 group">
            
            <span className="text-white font-semibold tracking-tight text-2xl">
              Zipdrift
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[15px] font-nunito text-white/70 hover:text-white transition-colors duration-200 tracking-wide"
              >
                {link.label}
              </Link>
            ))}
            <Button className="text-[15px] px-4 py-2 rounded-lg bg-[#984cd6] text-white font-medium hover:bg-white/90 active:scale-95 transition-all duration-150">
              Start extracting
            </Button>
          </nav>

          {/* Hamburger — only shows when menu is closed */}
          {!menuOpen && (
            <button
              className="md:hidden flex flex-col gap-1.5 p-2"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <span className="block w-6 h-px bg-white" />
              <span className="block w-6 h-px bg-white" />
              <span className="block w-6 h-px bg-white" />
            </button>
          )}
        </div>
      </header>

      {/* Mobile full-screen overlay */}
      <div
  className={`md:hidden fixed inset-0 z-60 bg-black/40 backdrop-blur-2xl flex flex-col items-center justify-center gap-8 transition-all duration-300 ${
    menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
  }`}
>
        {/* Close button */}
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-5 right-7 text-white/40 hover:text-white text-2xl transition-colors"
          aria-label="Close menu"
        >
          ✕
        </button>

        {NAV_LINKS.map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className="text-2xl font-nunito font-semibold text-white/60 hover:text-white transition-colors text-center"
            style={{
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "translateX(0)" : "translateX(-24px)",
              transition: `opacity 0.35s ease ${i * 0.07}s, transform 0.35s ease ${i * 0.07}s, color 0.2s`,
            }}
          >
            {link.label}
          </Link>
        ))}

        <a
          href="#tool"
          onClick={() => setMenuOpen(false)}
          className="text-base font-medium bg-[#984cd6] text-white px-8 py-3 rounded-lg text-center"
          style={{
            opacity: menuOpen ? 1 : 0,
            transform: menuOpen ? "translateX(0)" : "translateX(-24px)",
            transition: `opacity 0.35s ease ${NAV_LINKS.length * 0.07}s, transform 0.35s ease ${NAV_LINKS.length * 0.07}s`,
          }}
        >
          Start extracting
        </a>
      </div>
    </>
  );
}