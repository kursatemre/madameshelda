import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CtaBanner() {
  return (
    <section className="relative py-24 lg:py-36 px-6 lg:px-12 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          className="absolute right-0 top-0 h-full w-1/2 opacity-[0.06]"
          viewBox="0 0 500 600"
          fill="none"
          preserveAspectRatio="xMaxYMid slice"
        >
          {[0, 40, 80, 120, 160, 200, 240, 280].map((angle) => (
            <ellipse
              key={angle}
              cx="400"
              cy="200"
              rx="70"
              ry="200"
              fill="#a07850"
              transform={`rotate(${angle} 400 300)`}
            />
          ))}
          <circle cx="400" cy="300" r="50" fill="#a07850" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="max-w-2xl">
          <p className="font-label text-gold text-[0.65rem] mb-6">
            — Özel Sipariş
          </p>

          <h2
            className="font-serif text-brown leading-[0.95] mb-8"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              fontStyle: "italic",
            }}
          >
            Hayalinizdeki
            <br />
            çiçeği birlikte
            <br />
            <span className="text-gold">tasarlayalım.</span>
          </h2>

          <p className="text-brown/60 font-light text-sm lg:text-base leading-relaxed mb-10 max-w-lg">
            Eviniz, ofisiniz veya özel gününüz için tamamen size özel,
            benzersiz bir çiçek tasarımı. Boyut, renk ve stil tercihlerinizi
            dinliyoruz.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/iletisim"
              className="inline-flex items-center gap-3 bg-brown text-cream font-label px-8 py-4 hover:bg-brown-light transition-colors duration-300 group w-fit"
            >
              Hemen İletişime Geç
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </Link>
            <Link
              href="/galeri"
              className="inline-flex items-center gap-3 border border-sand text-brown font-label px-8 py-4 hover:border-brown/40 transition-colors duration-300 w-fit"
            >
              İlham Al
            </Link>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-20 lg:mt-24 pt-10 border-t border-sand grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { value: "8+", label: "Yıl Deneyim" },
            { value: "500+", label: "Mutlu Müşteri" },
            { value: "120+", label: "Tamamlanan Eser" },
            { value: "40+", label: "Workshop" },
          ].map((stat) => (
            <div key={stat.label}>
              <p
                className="font-serif text-brown text-3xl lg:text-4xl mb-1.5"
                style={{ fontStyle: "italic" }}
              >
                {stat.value}
              </p>
              <p className="font-label text-gold text-[0.6rem]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
