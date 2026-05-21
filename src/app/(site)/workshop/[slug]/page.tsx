"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Users } from "lucide-react";
import { WorkshopDrawer } from "@/components/workshop/WorkshopDrawer";

const mockWorkshop = {
  slug: "baslangic-cicek-sanati",
  title: "Başlangıç Çiçek Sanatı",
  description:
    "Çiçek tasarımının temel prensiplerini öğreneceğiniz, kendi eserinizi yaratacağınız keyifli bir atölye günü. Hiçbir deneyim gerekmez — sadece merak ve yaratma isteği yeterli!",
  content:
    "Workshop boyunca renk teorisi, kompozisyon prensipleri ve malzeme seçimi konularında rehberlik alacaksınız. Günün sonunda evine götürebileceğin, tamamen sana özgün bir çiçek eseri yaratmış olacaksın.",
  date: "14 Haziran 2025",
  duration: "3 saat",
  capacity: 8,
  filled: 5,
  level: "Başlangıç",
  price: "₺1.200",
  includes: [
    "Tüm malzemeler dahil",
    "Öğleden sonra çay & ikram",
    "Dijital sertifika",
    "Workshop fotoğrafları",
  ],
  bg: "linear-gradient(135deg, #faf0f3 0%, #e8c99a 40%, #7a2440 100%)",
};

export default function WorkshopDetayPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isFull = mockWorkshop.filled >= mockWorkshop.capacity;
  const remaining = mockWorkshop.capacity - mockWorkshop.filled;

  return (
    <>
      {/* Hero */}
      <section
        className="relative pt-32 lg:pt-40 pb-0 min-h-[50vh] flex flex-col justify-end"
        style={{ background: mockWorkshop.bg }}
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

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 pb-12 lg:pb-16">
          <Link
            href="/workshoplar"
            className="inline-flex items-center gap-2 font-label text-brown/70 hover:text-brown text-[0.6rem] mb-8 transition-colors duration-300 group bg-cream/60 backdrop-blur-sm px-3 py-1.5 w-fit"
          >
            <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
            Workshoplara Dön
          </Link>

          <p className="font-label text-gold text-[0.65rem] mb-4">{mockWorkshop.level}</p>
          <h1
            className="font-serif text-brown leading-tight"
            style={{ fontSize: "clamp(2rem, 5vw, 4rem)", fontStyle: "italic" }}
          >
            {mockWorkshop.title}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Main */}
          <div className="lg:col-span-2">
            <p className="text-brown/65 font-light text-base leading-relaxed mb-6">
              {mockWorkshop.description}
            </p>
            <p className="text-brown/50 font-light text-sm leading-relaxed mb-10">
              {mockWorkshop.content}
            </p>

            <div className="border-t border-sand pt-10">
              <p className="font-label text-gold/70 text-[0.6rem] mb-5">
                Neler Dahil
              </p>
              <ul className="space-y-3">
                {mockWorkshop.includes.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-brown/60 text-sm font-light"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="border border-sand p-6 lg:p-8 sticky top-24">
              <p
                className="font-serif text-brown text-3xl mb-1"
                style={{ fontStyle: "italic" }}
              >
                {mockWorkshop.price}
              </p>
              <p className="font-label text-gold/60 text-[0.55rem] mb-8">
                Katılım ücreti
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { icon: Calendar, text: mockWorkshop.date },
                  { icon: Clock, text: mockWorkshop.duration },
                  {
                    icon: Users,
                    text: isFull
                      ? "Kontenjan doldu"
                      : `${remaining} yer kaldı`,
                  },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <Icon size={13} className="text-gold shrink-0" />
                    <span className="font-label text-brown/60 text-[0.6rem]">
                      {text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Capacity bar */}
              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  <span className="font-label text-brown/40 text-[0.55rem]">Doluluk</span>
                  <span className="font-label text-brown/40 text-[0.55rem]">
                    {mockWorkshop.filled}/{mockWorkshop.capacity}
                  </span>
                </div>
                <div className="h-px bg-sand relative overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full bg-gold"
                    style={{
                      width: `${(mockWorkshop.filled / mockWorkshop.capacity) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <button
                onClick={() => setDrawerOpen(true)}
                disabled={isFull}
                className="w-full bg-brown text-cream font-label py-4 hover:bg-brown-light transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isFull ? "Kontenjan Dolmuştur" : "Başvuru Yap"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky CTA mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-cream/95 backdrop-blur-sm border-t border-sand p-4">
        <button
          onClick={() => setDrawerOpen(true)}
          disabled={isFull}
          className="w-full bg-brown text-cream font-label py-4 hover:bg-brown-light transition-colors duration-300 disabled:opacity-40"
        >
          {isFull ? "Kontenjan Dolmuştur" : "Başvuru Yap"}
        </button>
      </div>

      <WorkshopDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        workshopTitle={mockWorkshop.title}
        workshopId={mockWorkshop.slug}
      />
    </>
  );
}
