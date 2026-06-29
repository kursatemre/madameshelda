"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, MapPin } from "lucide-react";

const mockWorkshops: Record<string, {
  title: string;
  description: string;
  content: string;
  duration: string;
  level: string;
  includes: string[];
  bg: string;
}> = {
  "baslangic-cicek-sanati": {
    title: "Başlangıç Çiçek Sanatı",
    description: "Hiçbir deneyim gerekmez — sadece merak ve yaratma isteği yeterli. Renk teorisi, kompozisyon ve malzeme seçimiyle ilk çiçek eserinizi birlikte yaratıyoruz.",
    content: "Workshop boyunca Madame Shelda'nın rehberliğinde çiçeğin yapısını, renk uyumunu ve dengelemenin sanatını keşfedeceksiniz. Günün sonunda tamamen sizin imzanızı taşıyan, eve götürebileceğiniz özgün bir eser yaratmış olacaksınız.",
    duration: "3 saat",
    level: "Başlangıç",
    includes: ["Tüm malzemeler dahil", "Çay & ikram", "Dijital fotoğraflar"],
    bg: "linear-gradient(135deg, #fdf8f3 0%, #f0dde4 60%, #d4b0be 100%)",
  },
  "dev-cicek-duzenlemeleri": {
    title: "Dev Çiçek Düzenlemeleri",
    description: "Bir mekânı tamamen dönüştüren büyük ölçekli çiçek düzenlemelerinin arkasındaki teknik ve estetik kararları öğrenin.",
    content: "Bu workshop; otel lobisi, mağaza vitrini veya etkinlik alanı gibi büyük mekânlar için yapılan impozant düzenlemelerin tasarım mantığını aktarır. Malzeme seçimi, derinlik yaratma ve bütünlük hissi üzerine yoğunlaşıyoruz.",
    duration: "4 saat",
    level: "Orta",
    includes: ["Tüm malzemeler dahil", "Teknik rehber kitapçık", "Çay & ikram"],
    bg: "linear-gradient(135deg, #faf0f3 0%, #e8c99a 50%, #a07850 100%)",
  },
  "dogal-boyama-teknikleri": {
    title: "Doğal Boyama",
    description: "Bitkisel pigmentler ve doğal boyama teknikleriyle çiçeklerinize özgün, geçici olmayan renkler kazandırın.",
    content: "Kimyasal boya yerine doğadan elde edilen pigmentlerle çalışmayı, renklerin nasıl dönüştüğünü ve sabitleneceğini keşfedeceksiniz. İleri seviye bir atölye olup temel çiçek düzenleme deneyimi faydalı olur.",
    duration: "5 saat",
    level: "İleri",
    includes: ["Tüm malzemeler dahil", "Tarif ve teknik notlar", "Çay & ikram"],
    bg: "linear-gradient(135deg, #f5eef0 0%, #c9a070 50%, #5c1a2e 100%)",
  },
};

export default function WorkshopDetayPage({
  params,
}: {
  params: { slug: string };
}) {
  const ws = mockWorkshops[params.slug] ?? mockWorkshops["baslangic-cicek-sanati"];

  return (
    <>
      {/* Hero */}
      <section
        className="relative pt-32 lg:pt-40 pb-16 min-h-[55vh] flex flex-col justify-end"
        style={{ background: ws.bg }}
      >
        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          viewBox="0 0 1200 600"
          fill="none"
          preserveAspectRatio="xMaxYMid slice"
        >
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <ellipse
              key={angle}
              cx="900"
              cy="200"
              rx="80"
              ry="220"
              fill="#5c1a2e"
              transform={`rotate(${angle} 900 300)`}
            />
          ))}
          <circle cx="900" cy="300" r="60" fill="#5c1a2e" />
        </svg>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 pb-4">
          <Link
            href="/workshoplar"
            className="inline-flex items-center gap-2 font-label text-brown/70 hover:text-brown text-[0.6rem] mb-8 transition-colors duration-300 group bg-cream/60 backdrop-blur-sm px-3 py-1.5 w-fit"
          >
            <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
            Workshoplara Dön
          </Link>

          <p className="font-label text-gold text-[0.65rem] mb-4">{ws.level}</p>
          <h1
            className="font-serif text-brown leading-tight"
            style={{ fontSize: "clamp(2rem, 5vw, 4rem)", fontStyle: "italic" }}
          >
            {ws.title}
          </h1>
        </div>
      </section>

      {/* İçerik */}
      <section className="py-16 lg:py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
          {/* Ana içerik */}
          <div className="lg:col-span-2">
            <p className="text-brown/65 font-light text-base leading-relaxed mb-6">
              {ws.description}
            </p>
            <p className="text-[#888480] font-light text-sm leading-relaxed mb-12">
              {ws.content}
            </p>

            <div className="border-t border-sand pt-10">
              <p className="font-label text-gold/70 text-[0.6rem] mb-5">Neler Dahil</p>
              <ul className="space-y-3">
                {ws.includes.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-brown/60 text-sm font-light">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="border border-sand p-6 lg:p-8 sticky top-24 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock size={13} className="text-gold shrink-0" />
                  <span className="font-label text-brown/60 text-[0.6rem]">{ws.duration}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={13} className="text-gold shrink-0" />
                  <span className="font-label text-brown/60 text-[0.6rem]">Soma, Manisa</span>
                </div>
              </div>

              <div className="border-t border-sand pt-6">
                <p className="text-[#888480] font-light text-xs leading-relaxed mb-5">
                  Tarihler ve kontenjanlar için iletişime geçin.
                  Özel grup workshopları da düzenlenebilir.
                </p>
                <Link
                  href="/iletisim"
                  className="w-full flex items-center justify-center gap-2 bg-brown text-cream font-label text-[0.6rem] py-4 hover:bg-brown-light transition-colors duration-300 group"
                >
                  Bilgi Al
                  <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
