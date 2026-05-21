import Link from "next/link";
import { ArrowRight, Calendar, Clock, Users } from "lucide-react";

const workshops = [
  {
    id: "1",
    slug: "baslangic-cicek-sanati",
    title: "Başlangıç Çiçek Sanatı",
    date: "14 Haziran 2025",
    duration: "3 saat",
    capacity: 8,
    level: "Başlangıç",
    price: "₺1.200",
  },
  {
    id: "2",
    slug: "dev-cicek-duzenlemeleri",
    title: "Dev Çiçek Düzenlemeleri",
    date: "21 Haziran 2025",
    duration: "4 saat",
    capacity: 6,
    level: "Orta",
    price: "₺1.800",
  },
  {
    id: "3",
    slug: "dogal-boyama-teknikleri",
    title: "Doğal Boyama Teknikleri",
    date: "5 Temmuz 2025",
    duration: "5 saat",
    capacity: 6,
    level: "İleri",
    price: "₺2.400",
  },
];

export function WorkshopTeaser() {
  return (
    <section className="bg-brown py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 lg:mb-16 gap-6">
          <div>
            <p className="font-label text-gold text-[0.65rem] mb-4">
              — Workshoplar
            </p>
            <h2
              className="font-serif text-cream leading-tight"
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontStyle: "italic",
              }}
            >
              Sanatı birlikte
              <br />
              <span className="text-gold-light">keşfedin</span>
            </h2>
          </div>
          <Link
            href="/workshoplar"
            className="inline-flex items-center gap-3 font-label text-cream/50 hover:text-gold transition-colors duration-300 group self-start lg:self-auto"
          >
            Tüm Workshoplar
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform duration-300"
            />
          </Link>
        </div>

        {/* Workshop Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {workshops.map((ws, i) => (
            <Link
              key={ws.id}
              href={`/workshop/${ws.slug}`}
              className="group border border-brown-light hover:border-gold/50 p-6 lg:p-8 transition-all duration-400 relative overflow-hidden"
            >
              {/* Number */}
              <span className="font-label text-gold/20 text-[0.6rem] mb-6 block">
                0{i + 1}
              </span>

              {/* Title */}
              <h3
                className="font-serif text-cream text-xl lg:text-2xl mb-6 group-hover:text-gold-light transition-colors duration-300"
                style={{ fontStyle: "italic" }}
              >
                {ws.title}
              </h3>

              {/* Meta */}
              <div className="space-y-2.5 mb-8">
                <div className="flex items-center gap-2.5 text-cream/40">
                  <Calendar size={12} />
                  <span className="font-label text-[0.6rem]">{ws.date}</span>
                </div>
                <div className="flex items-center gap-2.5 text-cream/40">
                  <Clock size={12} />
                  <span className="font-label text-[0.6rem]">{ws.duration}</span>
                </div>
                <div className="flex items-center gap-2.5 text-cream/40">
                  <Users size={12} />
                  <span className="font-label text-[0.6rem]">
                    Maks. {ws.capacity} kişi
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-brown-light/40">
                <div>
                  <span className="font-label text-gold/60 text-[0.55rem] block mb-0.5">
                    Seviye
                  </span>
                  <span className="font-label text-cream/50 text-[0.6rem]">
                    {ws.level}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-label text-gold/60 text-[0.55rem] block mb-0.5">
                    Katılım
                  </span>
                  <span
                    className="font-serif text-cream text-lg"
                    style={{ fontStyle: "italic" }}
                  >
                    {ws.price}
                  </span>
                </div>
              </div>

              {/* Hover arrow */}
              <div className="absolute bottom-6 right-6 lg:bottom-8 lg:right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowRight size={16} className="text-gold" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
