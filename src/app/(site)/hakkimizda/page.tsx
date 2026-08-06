import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Hakkımızda — Madame Shelda Design Art",
  description: "Madame Shelda'nın hikayesi, felsefesi ve el yapımı çiçek sanatına adanmışlığı.",
};

export default async function HakkimizdaPage() {
  const { about_hero, about_intro, about_values, about_story } = await getSiteContent([
    "about_hero",
    "about_intro",
    "about_values",
    "about_story",
  ]);

  return (
    <>
      {/* Hero */}
      <section className="pt-32 lg:pt-40 min-h-[70vh] flex flex-col lg:flex-row">
        {/* Left */}
        <div className="flex-1 flex flex-col justify-end px-6 lg:px-16 pb-12 lg:pb-20 bg-cream-dark">
          <p className="font-label text-gold text-[0.65rem] mb-6">{about_hero.eyebrow}</p>
          <h1
            className="font-serif text-brown leading-[0.9]"
            style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)", fontStyle: "italic" }}
          >
            {about_hero.title_line1}
            <br />
            <span className="text-gold">{about_hero.title_line2}</span>
          </h1>
        </div>

        {/* Right */}
        <div className="flex-1 lg:max-w-[45%] flex flex-col justify-center px-6 lg:px-16 py-12 lg:py-20 border-t lg:border-t-0 lg:border-l border-sand">
          <p className="text-brown/65 font-light text-base leading-relaxed mb-6">
            {about_intro.paragraph1}
          </p>
          <p className="text-brown/55 font-light text-sm leading-relaxed">
            {about_intro.paragraph2}
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 lg:py-32 px-6 lg:px-12 bg-brown">
        <div className="max-w-7xl mx-auto">
          <p className="font-label text-gold text-[0.65rem] mb-12">
            {about_values.eyebrow}
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
            {about_values.items.map((v, i) => (
              <div key={i} className="border-t border-brown-light/40 pt-8">
                <span className="font-label text-gold/30 text-[0.65rem] block mb-5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3
                  className="font-serif text-cream text-2xl mb-4"
                  style={{ fontStyle: "italic" }}
                >
                  {v.title}
                </h3>
                <p className="text-cream/50 font-light text-sm leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 lg:py-32 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Visual */}
          <div className="relative aspect-4/5 overflow-hidden">
            {about_story.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={about_story.image_url}
                alt={`${about_story.title_line1} ${about_story.title_line2}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <>
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(135deg, #f0e8dc 0%, #d4b896 40%, #a07850 100%)",
                  }}
                />
                <svg
                  className="absolute inset-0 w-full h-full opacity-30"
                  viewBox="0 0 400 500"
                  fill="none"
                  preserveAspectRatio="xMidYMid slice"
                >
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                    <ellipse
                      key={angle}
                      cx="200"
                      cy="120"
                      rx="55"
                      ry="160"
                      fill="#7a5c3e"
                      transform={`rotate(${angle} 200 250)`}
                    />
                  ))}
                  <circle cx="200" cy="250" r="40" fill="#7a5c3e" opacity="0.8" />
                </svg>
              </>
            )}

            {/* Quote card */}
            <div className="absolute bottom-0 left-0 right-0 bg-cream/95 p-6 lg:p-8">
              <p
                className="font-serif text-brown text-lg leading-snug"
                style={{ fontStyle: "italic" }}
              >
                &ldquo;{about_story.quote}&rdquo;
              </p>
              <p className="font-label text-gold text-[0.6rem] mt-3">
                {about_story.quote_attribution}
              </p>
            </div>
          </div>

          {/* Text */}
          <div>
            <p className="font-label text-gold text-[0.65rem] mb-6">
              {about_story.eyebrow}
            </p>
            <h2
              className="font-serif text-brown text-3xl lg:text-4xl mb-8 leading-snug"
              style={{ fontStyle: "italic" }}
            >
              {about_story.title_line1}
              <br />
              {about_story.title_line2}
            </h2>
            <div className="space-y-4 text-brown/60 font-light text-sm leading-relaxed mb-10">
              <p>{about_story.paragraph1}</p>
              <p>{about_story.paragraph2}</p>
            </div>
            <Link
              href="/iletisim"
              className="inline-flex items-center gap-3 bg-brown text-cream font-label px-8 py-4 hover:bg-brown-light transition-colors duration-300 group"
            >
              {about_story.cta_label}
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
