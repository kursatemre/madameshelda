import Link from "next/link";
import { ArrowRight } from "lucide-react";

const workshops = [
  {
    slug: "baslangic-cicek-sanati",
    title: "Başlangıç Çiçek Sanatı",
    description: "İlk kez mı? Hiçbir deneyim gerekmez.",
    level: "Başlangıç",
    bg: "linear-gradient(135deg, #fdf8f3 0%, #f0dde4 100%)",
  },
  {
    slug: "dev-cicek-duzenlemeleri",
    title: "Dev Düzenlemeler",
    description: "Mekânı dönüştüren büyük ölçekli tasarımlar.",
    level: "Orta",
    bg: "linear-gradient(135deg, #faf0f3 0%, #e8c99a 100%)",
  },
  {
    slug: "dogal-boyama-teknikleri",
    title: "Doğal Boyama",
    description: "Bitkisel pigmentlerle rengin diliyle konuşun.",
    level: "İleri",
    bg: "linear-gradient(135deg, #f5eef0 0%, #c9a070 100%)",
  },
];

export function WorkshopTeaser() {
  return (
    <section className="bg-cream-dark py-20 lg:py-32 border-t border-sand">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 lg:mb-16 gap-6">
          <div>
            <p className="font-label text-gold text-[0.65rem] mb-4">— Workshoplar</p>
            <h2
              className="font-serif text-[#1a1a1a] leading-tight"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontStyle: "italic" }}
            >
              Atölyede bir gün
              <br />
              <span className="text-brown">birlikte geçirelim</span>
            </h2>
          </div>
          <Link
            href="/workshoplar"
            className="inline-flex items-center gap-3 font-label text-[#888480] hover:text-brown transition-colors duration-300 group self-start lg:self-auto"
          >
            Tüm Workshoplar
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>

        {/* Kartlar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {workshops.map((ws, i) => (
            <Link
              key={ws.slug}
              href={`/workshop/${ws.slug}`}
              className="group flex flex-col overflow-hidden border border-sand hover:border-gold/40 bg-white transition-all duration-300"
            >
              {/* Görsel */}
              <div
                className="h-40 relative overflow-hidden"
                style={{ background: ws.bg }}
              >
                <svg
                  className="absolute inset-0 w-full h-full opacity-20"
                  viewBox="0 0 400 200"
                  fill="none"
                  preserveAspectRatio="xMidYMid slice"
                >
                  {[0, 60, 120, 180, 240, 300].map((angle) => (
                    <ellipse
                      key={angle}
                      cx="200"
                      cy="100"
                      rx="30"
                      ry="90"
                      fill="#5c1a2e"
                      transform={`rotate(${angle} 200 100)`}
                    />
                  ))}
                  <circle cx="200" cy="100" r="25" fill="#5c1a2e" />
                </svg>
                <span className="absolute bottom-3 right-3 font-label text-cream/30 text-[0.55rem]">
                  0{i + 1}
                </span>
              </div>

              {/* İçerik */}
              <div className="p-6 flex flex-col flex-1">
                <span className="font-label text-gold/60 text-[0.55rem] mb-2">{ws.level}</span>
                <h3
                  className="font-serif text-[#1a1a1a] text-xl mb-2 group-hover:text-brown transition-colors duration-300"
                  style={{ fontStyle: "italic" }}
                >
                  {ws.title}
                </h3>
                <p className="text-[#888480] font-light text-sm leading-relaxed flex-1">
                  {ws.description}
                </p>
                <div className="flex items-center justify-end mt-5 pt-4 border-t border-sand">
                  <span className="font-label text-gold text-[0.6rem] flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-300">
                    İncele <ArrowRight size={11} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
