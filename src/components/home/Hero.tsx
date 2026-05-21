"use client";

import Link from "next/link";
import { ArrowDown } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Left — Dark Panel */}
      <div className="relative flex-1 lg:w-[45%] bg-brown flex flex-col justify-end px-8 pt-24 pb-8 lg:px-16 lg:pt-32 lg:pb-16 min-h-[70vh] lg:min-h-screen">
        {/* Decorative line */}
        <div className="absolute top-20 lg:top-24 left-8 lg:left-16 flex items-center gap-4">
          <div className="w-10 h-px bg-gold/50" />
          <span className="font-label text-gold/70 text-[0.6rem]">
            Soma · Manisa · Türkiye
          </span>
        </div>

        {/* Main Heading */}
        <div className="mb-8 lg:mb-12">
          <p className="font-label text-gold/80 text-[0.65rem] mb-6">
            El Yapımı Çiçek Tasarımları
          </p>
          <h1
            className="font-serif text-cream leading-[0.9] mb-6"
            style={{
              fontSize: "clamp(3rem, 7vw, 6rem)",
              fontStyle: "italic",
            }}
          >
            Madame
            <br />
            Shelda
          </h1>
          <h2
            className="font-serif text-cream/40 leading-tight"
            style={{
              fontSize: "clamp(1rem, 2vw, 1.4rem)",
              fontStyle: "italic",
              fontWeight: 400,
            }}
          >
            Design Art
          </h2>
        </div>

        {/* Description */}
        <p className="text-cream/55 text-sm font-light leading-relaxed max-w-sm mb-10">
          Her mekan için özenle tasarlanmış, doğanın güzelliğini kalıcı kılan
          el yapımı çiçek sanatı.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-12 lg:mb-16">
          <Link
            href="/galeri"
            className="inline-flex items-center justify-center gap-3 bg-gold text-cream font-label px-8 py-4 hover:bg-gold-dark transition-colors duration-300"
          >
            Eserleri Keşfet
          </Link>
          <Link
            href="/workshoplar"
            className="inline-flex items-center justify-center gap-3 border border-cream/20 text-cream font-label px-8 py-4 hover:border-cream/50 transition-colors duration-300"
          >
            Workshoplar
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="hidden lg:flex items-center gap-3 text-cream/30">
          <ArrowDown size={14} className="animate-bounce" />
          <span className="font-label text-[0.55rem]">Aşağı kaydır</span>
        </div>
      </div>

      {/* Right — Image Panel */}
      <div className="relative flex-1 lg:w-[55%] min-h-[40vh] lg:min-h-screen img-zoom">
        {/* Placeholder gradient — gerçek fotoğraf buraya gelecek */}
        <div
          className="img-inner absolute inset-0 w-full h-full"
          style={{
            background: `
              radial-gradient(ellipse at 30% 40%, #e8c99a 0%, transparent 60%),
              radial-gradient(ellipse at 70% 70%, #d4b0be 0%, transparent 50%),
              linear-gradient(135deg, #f5eef0 0%, #f0dde4 40%, #d4b0be 80%, #7a2440 100%)
            `,
          }}
        />

        {/* Botanical decorative shapes */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          viewBox="0 0 800 900"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Large circle */}
          <circle cx="500" cy="350" r="280" stroke="#5c1a2e" strokeWidth="0.5" />
          <circle cx="500" cy="350" r="220" stroke="#5c1a2e" strokeWidth="0.3" />
          {/* Petal shapes */}
          <ellipse cx="500" cy="150" rx="60" ry="180" fill="#7a2440" opacity="0.15" transform="rotate(0 500 350)" />
          <ellipse cx="500" cy="150" rx="60" ry="180" fill="#7a2440" opacity="0.1" transform="rotate(45 500 350)" />
          <ellipse cx="500" cy="150" rx="60" ry="180" fill="#7a2440" opacity="0.12" transform="rotate(90 500 350)" />
          <ellipse cx="500" cy="150" rx="60" ry="180" fill="#7a2440" opacity="0.08" transform="rotate(135 500 350)" />
          <ellipse cx="500" cy="150" rx="60" ry="180" fill="#7a2440" opacity="0.1" transform="rotate(180 500 350)" />
          <ellipse cx="500" cy="150" rx="60" ry="180" fill="#7a2440" opacity="0.12" transform="rotate(225 500 350)" />
          <ellipse cx="500" cy="150" rx="60" ry="180" fill="#7a2440" opacity="0.08" transform="rotate(270 500 350)" />
          <ellipse cx="500" cy="150" rx="60" ry="180" fill="#7a2440" opacity="0.1" transform="rotate(315 500 350)" />
          {/* Center */}
          <circle cx="500" cy="350" r="40" fill="#7a2440" opacity="0.2" />
          {/* Bottom floral */}
          <ellipse cx="250" cy="750" rx="40" ry="120" fill="#5c1a2e" opacity="0.12" transform="rotate(15 250 750)" />
          <ellipse cx="250" cy="750" rx="40" ry="120" fill="#5c1a2e" opacity="0.1" transform="rotate(75 250 750)" />
          <ellipse cx="250" cy="750" rx="40" ry="120" fill="#5c1a2e" opacity="0.12" transform="rotate(135 250 750)" />
          <circle cx="250" cy="750" r="25" fill="#5c1a2e" opacity="0.15" />
        </svg>

        {/* Overlay info card */}
        <div className="absolute bottom-8 right-8 lg:bottom-12 lg:right-12 bg-brown/90 backdrop-blur-sm p-5 lg:p-6 max-w-50">
          <p className="font-label text-gold text-[0.55rem] mb-2">
            Bu yıl
          </p>
          <p
            className="font-serif text-cream text-3xl lg:text-4xl mb-1"
            style={{ fontStyle: "italic" }}
          >
            120+
          </p>
          <p className="font-label text-cream/50 text-[0.6rem]">
            Tamamlanan Eser
          </p>
        </div>

        {/* Side label */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3">
          <div className="w-px h-16 bg-brown/20" />
          <span
            className="font-label text-brown/40 text-[0.55rem] -rotate-90 whitespace-nowrap"
            style={{ writingMode: "vertical-rl" }}
          >
            El Yapımı · Özgün · Kalıcı
          </span>
          <div className="w-px h-16 bg-brown/20" />
        </div>
      </div>
    </section>
  );
}
