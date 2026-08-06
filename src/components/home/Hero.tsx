import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { HomeHeroContent } from "@/lib/site-content";

export function Hero({ content }: { content: HomeHeroContent }) {
  return (
    <section className="min-h-screen flex flex-col pt-16 lg:pt-20 bg-white">
      {/* Top label bar */}
      <div className="border-b border-sand px-6 lg:px-12 py-3 flex items-center justify-between">
        <span className="font-label text-[#888480] text-[0.6rem]">
          Soma · Manisa · Türkiye
        </span>
        <span className="font-label text-[#888480] text-[0.6rem]">
          El Yapımı · Özgün · Kalıcı
        </span>
      </div>

      {/* Hero body */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        {/* Left — Text */}
        <div className="flex flex-col justify-center px-6 lg:px-16 xl:px-24 py-16 lg:py-0">
          <p className="font-label text-gold text-[0.65rem] mb-8 tracking-[0.2em]">
            {content.eyebrow}
          </p>

          <h1
            className="font-serif leading-[0.92] mb-8 text-[#1a1a1a]"
            style={{
              fontSize: "clamp(3.5rem, 8vw, 7rem)",
              fontStyle: "italic",
            }}
          >
            {content.title_line1}
            <br />
            <span className="text-brown">{content.title_line2}</span>
            <br />
            <span
              className="text-[#888480]"
              style={{ fontSize: "clamp(1.5rem, 3.5vw, 3rem)" }}
            >
              {content.title_line3}
            </span>
          </h1>

          <p className="text-[#888480] font-light text-sm lg:text-base leading-relaxed max-w-sm mb-10">
            {content.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/galeri"
              className="inline-flex items-center justify-center gap-3 bg-brown text-white font-label px-8 py-4 hover:bg-brown-light transition-colors duration-300 group"
            >
              {content.cta_primary_label}
              <ArrowRight
                size={13}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </Link>
            <Link
              href="/workshoplar"
              className="inline-flex items-center justify-center gap-3 border border-sand text-[#1a1a1a] font-label px-8 py-4 hover:border-sand-dark transition-colors duration-300"
            >
              {content.cta_secondary_label}
            </Link>
          </div>
        </div>

        {/* Right — Visual */}
        <div className="relative min-h-[55vw] lg:min-h-full bg-cream-dark overflow-hidden">
          {content.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={content.image_url} alt={content.title_line1 + " " + content.title_line2} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <>
              {/* Placeholder — admin panelinden gerçek fotoğraf yüklenebilir */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(160deg, #f8f6f4 0%, #ede8e4 40%, #d4b0be 80%, #5c1a2e 100%)",
                }}
              />

              {/* Minimal çiçek motifi */}
              <svg
                className="absolute inset-0 w-full h-full opacity-[0.12]"
                viewBox="0 0 600 700"
                fill="none"
                preserveAspectRatio="xMidYMid slice"
              >
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                  <ellipse
                    key={angle}
                    cx="300"
                    cy="200"
                    rx="55"
                    ry="170"
                    fill="#5c1a2e"
                    transform={`rotate(${angle} 300 350)`}
                  />
                ))}
                <circle cx="300" cy="350" r="45" fill="#5c1a2e" />
              </svg>
            </>
          )}

          {/* Stats card */}
          <div className="absolute bottom-8 left-8 bg-white p-5 lg:p-6 shadow-sm">
            <p className="font-label text-gold text-[0.55rem] mb-2">{content.stat_eyebrow}</p>
            <p
              className="font-serif text-[#1a1a1a] text-3xl lg:text-4xl mb-1"
              style={{ fontStyle: "italic" }}
            >
              {content.stat_value}
            </p>
            <p className="font-label text-[#888480] text-[0.6rem]">
              {content.stat_label}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
