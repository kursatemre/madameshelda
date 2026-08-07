import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { HomeHeroContent } from "@/lib/site-content";

export function Hero({ content }: { content: HomeHeroContent }) {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden pt-16 lg:pt-20 bg-brown">
      {/* Arkaplan görseli (admin panelinden yüklenir) veya marka renklerinde gradyan fallback */}
      <div className="absolute inset-0">
        {content.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={content.image_url}
            alt={content.title_line1 + " " + content.title_line2}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <>
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(155deg, #3a0f1c 0%, #5c1a2e 45%, #7a2740 72%, #a8506a 100%)",
              }}
            />
            {/* Minimal çiçek motifi — sadece gerçek görsel yokken görünür */}
            <svg
              className="absolute -right-24 top-1/2 -translate-y-1/2 w-[70vw] max-w-3xl opacity-[0.08]"
              viewBox="0 0 600 700"
              fill="none"
              preserveAspectRatio="xMidYMid slice"
            >
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <ellipse
                  key={angle}
                  cx="300"
                  cy="350"
                  rx="55"
                  ry="170"
                  fill="#fdf8f3"
                  transform={`rotate(${angle} 300 350)`}
                />
              ))}
              <circle cx="300" cy="350" r="45" fill="#fdf8f3" />
            </svg>
          </>
        )}

        {/* Metin okunabilirliği için karartma katmanları */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(100deg, rgba(12,6,8,0.82) 0%, rgba(12,6,8,0.58) 32%, rgba(12,6,8,0.2) 58%, rgba(12,6,8,0.05) 78%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/25" />
      </div>

      {/* Üst etiket şeridi */}
      <div className="relative z-10 border-b border-cream/15 px-6 lg:px-12 py-3 flex items-center justify-between">
        <span className="font-label text-cream/70 text-[0.6rem]">
          Soma · Manisa · Türkiye
        </span>
        <span className="font-label text-cream/70 text-[0.6rem]">
          El Yapımı · Özgün · Kalıcı
        </span>
      </div>

      {/* Hero içerik */}
      <div className="relative z-10 flex-1 flex items-center px-6 lg:px-16 xl:px-24 py-16">
        <div className="max-w-xl">
          <p className="font-label text-gold text-[0.65rem] mb-8 tracking-[0.2em]">
            {content.eyebrow}
          </p>

          <h1
            className="font-serif leading-[0.92] mb-8 text-cream"
            style={{
              fontSize: "clamp(3.5rem, 8vw, 7rem)",
              fontStyle: "italic",
            }}
          >
            {content.title_line1}
            <br />
            <span className="text-gold">{content.title_line2}</span>
            <br />
            <span
              className="text-cream/65"
              style={{ fontSize: "clamp(1.5rem, 3.5vw, 3rem)" }}
            >
              {content.title_line3}
            </span>
          </h1>

          <p className="text-cream/75 font-light text-sm lg:text-base leading-relaxed max-w-sm mb-10">
            {content.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/galeri"
              className="inline-flex items-center justify-center gap-3 bg-cream text-brown font-label px-8 py-4 hover:bg-white transition-colors duration-300 group"
            >
              {content.cta_primary_label}
              <ArrowRight
                size={13}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </Link>
            <Link
              href="/workshoplar"
              className="inline-flex items-center justify-center gap-3 border border-cream/40 text-cream font-label px-8 py-4 hover:bg-cream/10 hover:border-cream transition-colors duration-300"
            >
              {content.cta_secondary_label}
            </Link>
          </div>
        </div>
      </div>

      {/* Alt şerit — istatistik kartı + kaydırma ipucu */}
      <div className="relative z-10 flex items-end justify-between gap-6 px-6 lg:px-12 pb-10 lg:pb-12">
        <div className="bg-cream/10 backdrop-blur-md border border-cream/20 px-5 py-4 lg:px-6 lg:py-5">
          <p className="font-label text-gold text-[0.55rem] mb-2">{content.stat_eyebrow}</p>
          <p
            className="font-serif text-cream text-3xl lg:text-4xl mb-1"
            style={{ fontStyle: "italic" }}
          >
            {content.stat_value}
          </p>
          <p className="font-label text-cream/70 text-[0.6rem]">
            {content.stat_label}
          </p>
        </div>

        <div className="hidden sm:flex flex-col items-center gap-2 text-cream/45">
          <span className="font-label text-[0.55rem] tracking-[0.2em]">Kaydır</span>
          <span className="w-px h-10 bg-cream/30" />
        </div>
      </div>
    </section>
  );
}
