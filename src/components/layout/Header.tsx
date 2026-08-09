"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, UserRound } from "lucide-react";
import { MobileNav } from "./MobileNav";
import { useCart } from "@/contexts/CartContext";
import { useAuthUser } from "@/hooks/useAuthUser";
import type { GeneralContent } from "@/lib/site-content";

const navLinks = [
  { href: "/galeri", label: "Eserler" },
  { href: "/workshoplar", label: "Workshoplar" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

// Sayfa en üstündeyken arkasında koyu/görselli bir hero olan sayfalar —
// sadece bu sayfalarda header şeffaf + açık renk (cream) ikonlarla başlar.
// Diğer tüm sayfaların üst bölümü açık renkli olduğundan header orada hep
// katı arka plan + koyu (brown) ikonlarla gösterilir, aksi halde cream
// ikonlar açık arka plan üzerinde görünmez hale gelir.
const DARK_HERO_PATHS = ["/", "/workshoplar"];

export function Header({ general }: { general: GeneralContent }) {
  const [scrolled, setScrolled] = useState(false);
  const { count, setIsOpen } = useCart();
  const { user } = useAuthUser();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hasDarkHero = DARK_HERO_PATHS.includes(pathname);
  const transparent = hasDarkHero && !scrolled;
  const logoSrc = transparent ? general.logo_url : general.logo_dark_url;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        transparent
          ? "bg-transparent"
          : "bg-cream/95 backdrop-blur-sm border-b border-sand shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Mobile: sol boşluk (hamburger genişliğinde) | Desktop: Logo solda */}
          <div className="w-10 lg:w-auto">
            <Link href="/" className="hidden lg:flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoSrc}
                alt="Madame Shelda Design Art"
                className="h-10 lg:h-12 w-auto object-contain transition-opacity duration-300"
              />
            </Link>
          </div>

          {/* Mobile: Logo ortada | Desktop: Nav ortada */}
          <div className="flex-1 flex justify-center lg:justify-center">
            {/* Mobil logo */}
            <Link href="/" className="lg:hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoSrc}
                alt="Madame Shelda Design Art"
                className="h-9 w-auto object-contain transition-opacity duration-300"
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

          {/* Cart + CTA + Mobile hamburger */}
          <div className="flex items-center gap-3">
            {/* Hesap */}
            <Link
              href={user ? "/hesabim" : "/giris"}
              className={`hidden sm:inline-flex p-2 transition-colors duration-300 ${
                transparent ? "text-cream/80 hover:text-cream" : "text-brown/70 hover:text-brown"
              }`}
              aria-label={user ? "Hesabım" : "Giriş Yap"}
              title={user ? "Hesabım" : "Giriş Yap"}
            >
              <UserRound size={18} />
            </Link>

            {/* Cart button */}
            <button
              onClick={() => setIsOpen(true)}
              className={`relative p-2 transition-colors duration-300 ${
                transparent ? "text-cream/80 hover:text-cream" : "text-brown/70 hover:text-brown"
              }`}
              aria-label="Sepet"
            >
              <ShoppingBag size={18} />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brown text-cream text-[0.5rem] font-label flex items-center justify-center rounded-full">
                  {count}
                </span>
              )}
            </button>

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
            <MobileNav transparent={transparent} logoUrl={general.logo_url} instagramUrl={general.instagram_url} />
          </div>
        </div>
      </div>
    </header>
  );
}
