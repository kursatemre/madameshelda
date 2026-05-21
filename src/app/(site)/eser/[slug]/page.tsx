"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { OrderDrawer } from "@/components/shared/OrderDrawer";

const mockProduct = {
  slug: "sonbahar-koleksiyonu",
  title: "Sonbahar Koleksiyonu",
  category: "Özel Sipariş",
  price: "₺4.800",
  description:
    "Sonbaharın zengin renk paleti ilhamıyla tasarlanan bu eser; akçaağaç yapraklarının kızıl-altın tonları, kuru lavanta dalları ve büyük solmuş pembe peonies'lerden oluşuyor. Salon veya giriş holü için ideal bir büyük format çalışma.",
  details: [
    "Boyut: 80×120 cm (yaklaşık)",
    "Malzeme: Kurutulmuş çiçekler, doğal lifler",
    "Çerçeve: Ahşap (meşe)",
    "Teslimat: 2–3 hafta",
  ],
  bg: "linear-gradient(135deg, #f5eef0 0%, #d4b0be 50%, #5c1a2e 100%)",
};

export default function EserDetayPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <div className="pt-16 lg:pt-20 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[90vh]">
          {/* Image */}
          <div
            className="relative lg:sticky lg:top-20 lg:self-start min-h-[55vw] sm:min-h-[45vw] lg:min-h-screen"
            style={{ background: mockProduct.bg }}
          >
            <svg
              className="absolute inset-0 w-full h-full opacity-30"
              viewBox="0 0 600 700"
              fill="none"
              preserveAspectRatio="xMidYMid slice"
            >
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <ellipse
                  key={angle}
                  cx="300"
                  cy="180"
                  rx="70"
                  ry="210"
                  fill="#5c1a2e"
                  transform={`rotate(${angle} 300 350)`}
                />
              ))}
              <circle cx="300" cy="350" r="55" fill="#5c1a2e" opacity="0.8" />
            </svg>

            {/* Category tag */}
            <div className="absolute top-6 left-6">
              <span className="font-label text-[0.55rem] bg-cream/90 text-brown px-3 py-1.5">
                {mockProduct.category}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="px-6 py-12 lg:px-16 lg:py-20 pb-28 lg:pb-20 flex flex-col">
            <Link
              href="/galeri"
              className="inline-flex items-center gap-2 font-label text-brown/40 hover:text-gold text-[0.6rem] mb-10 transition-colors duration-300 group"
            >
              <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
              Galerige Dön
            </Link>

            <p className="font-label text-gold text-[0.65rem] mb-4">
              {mockProduct.category}
            </p>

            <h1
              className="font-serif text-brown leading-tight mb-4"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontStyle: "italic" }}
            >
              {mockProduct.title}
            </h1>

            <p
              className="font-serif text-gold text-3xl mb-8"
              style={{ fontStyle: "italic" }}
            >
              {mockProduct.price}
            </p>

            <p className="text-brown/60 font-light text-sm leading-relaxed mb-10 border-t border-sand pt-8">
              {mockProduct.description}
            </p>

            {/* Details */}
            <div className="mb-10">
              <p className="font-label text-brown/40 text-[0.55rem] mb-4">
                Detaylar
              </p>
              <ul className="space-y-2.5">
                {mockProduct.details.map((d) => (
                  <li
                    key={d}
                    className="flex items-center gap-3 text-brown/55 text-sm font-light"
                  >
                    <span className="w-1 h-1 rounded-full bg-gold shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto">
              <button
                onClick={() => setDrawerOpen(true)}
                className="w-full bg-brown text-cream font-label py-4 hover:bg-brown-light transition-colors duration-300"
              >
                Sipariş İçin İletişime Geç
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky CTA on mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-cream border-t border-sand p-4">
        <button
          onClick={() => setDrawerOpen(true)}
          className="w-full bg-brown text-cream font-label py-4 hover:bg-brown-light transition-colors duration-300"
        >
          Sipariş İçin İletişime Geç
        </button>
      </div>

      <OrderDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        productTitle={mockProduct.title}
      />
    </>
  );
}
