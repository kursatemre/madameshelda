"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MobileNav } from "./MobileNav";

const navLinks = [
  { href: "/galeri", label: "Galeri" },
  { href: "/workshoplar", label: "Workshoplar" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transparent = !scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-cream/95 backdrop-blur-sm border-b border-sand shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Mobile: sol boşluk (hamburger genişliğinde) | Desktop: Logo solda */}
          <div className="w-10 lg:w-auto">
            <Link href="/" className="hidden lg:flex items-center">
              <Image
                src={scrolled ? "/logo-dark.png" : "/logo.png"}
                alt="Madame Shelda Design Art"
                width={120}
                height={48}
                className="h-10 lg:h-12 w-auto object-contain transition-opacity duration-300"
                priority
              />
            </Link>
          </div>

          {/* Mobile: Logo ortada | Desktop: Nav ortada */}
          <div className="flex-1 flex justify-center lg:justify-center">
            {/* Mobil logo */}
            <Link href="/" className="lg:hidden">
              <Image
                src={scrolled ? "/logo-dark.png" : "/logo.png"}
                alt="Madame Shelda Design Art"
                width={120}
                height={48}
                className="h-9 w-auto object-contain transition-opacity duration-300"
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-label transition-colors duration-300 gold-underline ${
                    transparent
                      ? "text-cream/80 hover:text-cream"
                      : "text-brown/70 hover:text-gold"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* CTA + Mobile hamburger */}
          <div className="flex items-center gap-4">
            <Link
              href="/iletisim"
              className={`hidden lg:inline-flex items-center gap-2 font-label px-6 py-3 transition-all duration-300 ${
                transparent
                  ? "bg-cream/15 text-cream border border-cream/30 hover:bg-cream/25"
                  : "bg-brown text-cream hover:bg-brown-light"
              }`}
            >
              Sipariş Ver
            </Link>
            <MobileNav transparent={transparent} />
          </div>
        </div>
      </div>
    </header>
  );
}
