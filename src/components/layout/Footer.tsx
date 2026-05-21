import Link from "next/link";
import { Mail, Phone } from "lucide-react";

function InstagramIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-brown text-cream">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex flex-col leading-none mb-5">
              <span
                className="font-serif text-2xl text-cream"
                style={{ fontStyle: "italic" }}
              >
                Madame Shelda
              </span>
              <span className="font-label text-gold text-[0.55rem] tracking-[0.25em] mt-1">
                Design Art
              </span>
            </Link>
            <p className="text-cream/50 text-sm font-light leading-relaxed max-w-xs">
              Soma, Manisa&apos;da el yapımı dev çiçek tasarımları. Her eser,
              bir hikaye.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-2">
            <div>
              <p className="font-label text-gold text-[0.6rem] mb-5">
                Keşfet
              </p>
              <ul className="space-y-3">
                {[
                  { href: "/galeri", label: "Galeri" },
                  { href: "/workshoplar", label: "Workshoplar" },
                  { href: "/hakkimizda", label: "Hakkımızda" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-cream/60 hover:text-cream text-sm font-light transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-label text-gold text-[0.6rem] mb-5">
                İletişim
              </p>
              <ul className="space-y-3">
                <li>
                  <a
                    href="tel:+905001234567"
                    className="flex items-center gap-2 text-cream/60 hover:text-cream text-sm font-light transition-colors duration-300"
                  >
                    <Phone size={13} />
                    +90 500 123 45 67
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@madameshelda.com"
                    className="flex items-center gap-2 text-cream/60 hover:text-cream text-sm font-light transition-colors duration-300"
                  >
                    <Mail size={13} />
                    info@madameshelda.com
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-cream/60 hover:text-cream text-sm font-light transition-colors duration-300"
                  >
                    <InstagramIcon size={13} />
                    @madameshelda
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-brown-light/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-label text-cream/30 text-[0.6rem]">
            © 2025 Madame Shelda Design Art. Tüm hakları saklıdır.
          </p>
          <p className="font-label text-cream/30 text-[0.6rem]">
            OrionSoft.dev tarafından geliştirilmiştir
          </p>
        </div>
      </div>
    </footer>
  );
}
