import type { Metadata } from "next";
import { Calendar, Clock, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Workshoplar — Madame Shelda Design Art",
  description: "Çiçek sanatını birlikte keşfedelim. Tüm seviyelere uygun workshoplar.",
};

const workshops = [
  {
    id: "1",
    slug: "baslangic-cicek-sanati",
    title: "Başlangıç Çiçek Sanatı",
    description: "Çiçek tasarımının temel prensiplerini öğreneceğiniz, kendi eserinizi yaratacağınız keyifli bir atölye günü.",
    date: "14 Haziran 2025",
    duration: "3 saat",
    capacity: 8,
    filled: 5,
    level: "Başlangıç",
    price: "₺1.200",
    accent: "#d4b896",
  },
  {
    id: "2",
    slug: "dev-cicek-duzenlemeleri",
    title: "Dev Çiçek Düzenlemeleri",
    description: "Büyük boyutlu, etkileyici çiçek düzenlemelerinin sırlarını keşfedeceksiniz. Mekan tasarımı odaklı.",
    date: "21 Haziran 2025",
    duration: "4 saat",
    capacity: 6,
    filled: 6,
    level: "Orta",
    price: "₺1.800",
    accent: "#a07850",
  },
  {
    id: "3",
    slug: "dogal-boyama-teknikleri",
    title: "Doğal Boyama Teknikleri",
    description: "Bitkisel boyalarla çiçeklerinizi özgün renklere dönüştürün. İleri seviye teknikler.",
    date: "5 Temmuz 2025",
    duration: "5 saat",
    capacity: 6,
    filled: 2,
    level: "İleri",
    price: "₺2.400",
    accent: "#7a5c3e",
  },
  {
    id: "4",
    slug: "yaz-cicekleri",
    title: "Yaz Çiçekleri Koleksiyonu",
    description: "Yaz mevsiminin en güzel çiçekleriyle ev dekorasyonunuza doğallık katın.",
    date: "19 Temmuz 2025",
    duration: "3 saat",
    capacity: 10,
    filled: 3,
    level: "Başlangıç",
    price: "₺1.200",
    accent: "#c9b49a",
  },
];

export default function WorkshoplarPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-12 lg:pt-40 lg:pb-16 px-6 lg:px-12 bg-brown">
        <div className="max-w-7xl mx-auto">
          <p className="font-label text-gold text-[0.65rem] mb-4">— Workshoplar</p>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <h1
              className="font-serif text-cream leading-tight"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", fontStyle: "italic" }}
            >
              Sanatı birlikte
              <br />
              öğrenelim
            </h1>
            <p className="text-cream/50 font-light text-sm max-w-xs lg:text-right">
              Her seviyeye uygun workshoplarımızla çiçek sanatının büyüleyici
              dünyasına adım atın.
            </p>
          </div>
        </div>
      </section>

      {/* Workshops List */}
      <section className="py-16 lg:py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto space-y-5">
          {workshops.map((ws, i) => {
            const isFull = ws.filled >= ws.capacity;
            const fillPercent = Math.round((ws.filled / ws.capacity) * 100);

            return (
              <div
                key={ws.id}
                className="group border border-sand hover:border-gold/40 transition-all duration-300"
              >
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-0">
                  <div className="p-6 lg:p-10">
                    <div className="flex flex-wrap items-center gap-3 mb-5">
                      <span className="font-label text-gold/60 text-[0.55rem]">
                        0{i + 1}
                      </span>
                      <span className="font-label text-[0.55rem] border border-sand px-3 py-1">
                        {ws.level}
                      </span>
                      {isFull && (
                        <span className="font-label text-[0.55rem] bg-brown text-cream px-3 py-1">
                          Kontenjan Doldu
                        </span>
                      )}
                    </div>

                    <h2
                      className="font-serif text-brown text-2xl lg:text-3xl mb-3 group-hover:text-gold transition-colors duration-300"
                      style={{ fontStyle: "italic" }}
                    >
                      {ws.title}
                    </h2>
                    <p className="text-brown/55 font-light text-sm leading-relaxed mb-6 max-w-lg">
                      {ws.description}
                    </p>

                    <div className="flex flex-wrap gap-6">
                      <div className="flex items-center gap-2 text-brown/50">
                        <Calendar size={13} />
                        <span className="font-label text-[0.6rem]">{ws.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-brown/50">
                        <Clock size={13} />
                        <span className="font-label text-[0.6rem]">{ws.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-brown/50">
                        <Users size={13} />
                        <span className="font-label text-[0.6rem]">
                          {ws.filled}/{ws.capacity} kişi
                        </span>
                      </div>
                    </div>

                    {/* Capacity bar */}
                    <div className="mt-5 max-w-xs">
                      <div className="h-px bg-sand relative overflow-hidden">
                        <div
                          className="absolute left-0 top-0 h-full bg-gold transition-all duration-500"
                          style={{ width: `${fillPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Price + CTA */}
                  <div className="lg:w-56 border-t lg:border-t-0 lg:border-l border-sand p-6 lg:p-10 flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4">
                    <div className="text-right">
                      <p className="font-label text-gold/60 text-[0.55rem] mb-1">
                        Katılım Ücreti
                      </p>
                      <p
                        className="font-serif text-brown text-3xl"
                        style={{ fontStyle: "italic" }}
                      >
                        {ws.price}
                      </p>
                    </div>
                    <Link
                      href={`/workshop/${ws.slug}`}
                      className={`inline-flex items-center gap-2 font-label text-[0.6rem] px-6 py-3 transition-all duration-300 group/btn ${
                        isFull
                          ? "bg-sand/50 text-brown/40 cursor-not-allowed"
                          : "bg-brown text-cream hover:bg-brown-light"
                      }`}
                    >
                      {isFull ? "Doldu" : "Başvur"}
                      {!isFull && (
                        <ArrowRight
                          size={12}
                          className="group-hover/btn:translate-x-0.5 transition-transform"
                        />
                      )}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
