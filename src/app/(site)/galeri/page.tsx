import { FilterBar } from "@/components/gallery/FilterBar";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { ShieldCheck, Truck, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eserler — Madame Shelda Design Art",
  description: "El yapımı çiçek tasarımlarını keşfedin. Her eser özgün, her sipariş özel.",
};

export default function GaleriPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>;
}) {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-10 lg:pt-40 lg:pb-12 px-6 lg:px-12 border-b border-sand">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <p className="font-label text-gold text-[0.65rem] mb-4">— El Yapımı Eserler</p>
              <h1
                className="font-serif text-brown leading-tight"
                style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", fontStyle: "italic" }}
              >
                Eserlerimiz
              </h1>
            </div>
            {/* Güven rozetleri */}
            <div className="flex flex-wrap gap-5 lg:gap-6 pb-1">
              {[
                { icon: Sparkles, text: "100% El Yapımı" },
                { icon: Truck, text: "Ücretsiz Kargo" },
                { icon: ShieldCheck, text: "Güvenli Ödeme" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-[#888480]">
                  <Icon size={13} className="text-gold" />
                  <span className="font-label text-[0.6rem]">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="py-10 lg:py-14">
        <FilterBar />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-8">
          <GalleryGrid searchParams={searchParams} />
        </div>
      </section>
    </>
  );
}
