"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

const navLinks = [
  { href: "/galeri", label: "Galeri" },
  { href: "/workshoplar", label: "Workshoplar" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

export function MobileNav({ transparent }: { transparent?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className={`lg:hidden flex items-center justify-center w-10 h-10 transition-colors duration-300 ${
          transparent ? "text-cream" : "text-brown"
        }`}
        aria-label="Menü"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:w-80 bg-brown border-none p-0 flex flex-col"
      >
        {/* Header */}
        <div className="px-8 pt-10 pb-6 border-b border-brown-light">
          <Link href="/" onClick={() => setOpen(false)}>
            <Image
              src="/logo.png"
              alt="Madame Shelda Design Art"
              width={120}
              height={48}
              className="h-10 w-auto object-contain brightness-0 invert"
            />
          </Link>
          {/* Mobil menü her zaman koyu arka plan üzerinde açılır, logo.png invert yeterli */}
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col justify-center px-8 gap-2">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="group py-4 border-b border-brown-light/40 flex items-center justify-between"
            >
              <span
                className="font-serif text-3xl text-cream/80 group-hover:text-cream transition-colors duration-300"
                style={{ fontStyle: "italic" }}
              >
                {link.label}
              </span>
              <span className="text-gold/60 font-label text-xs">
                0{i + 1}
              </span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-8 pb-10 pt-6 flex items-center justify-between border-t border-brown-light/40">
          <span className="font-label text-sand/50 text-[0.6rem]">
            Soma, Manisa
          </span>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:text-gold-light transition-colors duration-300"
            aria-label="Instagram"
          >
            <InstagramIcon size={18} />
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
