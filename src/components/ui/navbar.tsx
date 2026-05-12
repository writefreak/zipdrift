"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "./button";

const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
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

const MenuIcon = ({ open }: { open: boolean }) => (
  <div className="relative w-5 h-4 flex flex-col justify-between">
    <span
      className={`block h-px bg-white/70 transition-all duration-300 origin-center ${
        open ? "rotate-45 translate-y-1.75" : ""
      }`}
    />
    <span
      className={`block h-px bg-white/70 transition-all duration-300 ${
        open ? "opacity-0 translate-x-2" : ""
      }`}
    />
    <span
      className={`block h-px bg-white/70 transition-all duration-300 origin-center ${
        open ? "-rotate-45 -translate-y-2.25" : ""
      }`}
    />
  </div>
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
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "py-3  bg-[#0a0a0a]/90 backdrop-blur-xl"
            : "py-5 bg-transparent"
        }`}
      >
        <div className=" mx-auto px-5 flex items-center justify-between md:px-14 p-4 md:p-0">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-md bg-white/10 border border-white/10 flex items-center justify-center text-white/80 group-hover:bg-white/15 group-hover:border-white/20 transition-all duration-200">
              <ZipIcon />
            </div>
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
                className="text-[15px] text-white/70 hover:text-white transition-colors duration-200 tracking-wide"
              >
                {link.label}
              </Link>
            ))}
            <div className="hidden md:flex items-center gap-3">
            <Button
              
              className="text-[15px] px-4 py-2 rounded-lg bg-white text-black font-medium hover:bg-white/90 active:scale-95 transition-all duration-150"
            >
              Start extracting
            </Button>
          </div>

          </nav>

         
          
          {/* Mobile menu toggle */}
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors duration-150"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <MenuIcon open={menuOpen} />
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />

        {/* Drawer */}
        <div
          className={`absolute top-0 right-0 h-full w-64 bg-[#111111] border-l border-white/[0.07] flex flex-col transition-transform duration-300 ease-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between px-5 py-5 border-b border-white/[0.07]">
            <span className="text-white/50 text-xs uppercase tracking-widest font-medium">Menu</span>
            <button
              onClick={() => setMenuOpen(false)}
              className="w-7 h-7 flex items-center justify-center text-white/40 hover:text-white/80 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Drawer links */}
          <nav className="flex flex-col px-5 py-6 gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-[15px] text-white/50 hover:text-white py-3 border-b border-white/[0.05] transition-colors duration-150"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Drawer CTA */}
          <div className="px-5 mt-auto pb-8">
            <a
              href="#tool"
              onClick={() => setMenuOpen(false)}
              className="block w-full text-center text-[14px] px-4 py-3 rounded-lg bg-white text-black font-medium hover:bg-white/90 active:scale-95 transition-all duration-150"
            >
              Start extracting
            </a>
          </div>
        </div>
      </div>
    </>
  );
}