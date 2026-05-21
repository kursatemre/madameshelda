import { FilterBar } from "@/components/gallery/FilterBar";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galeri — Madame Shelda Design Art",
  description: "El yapımı çiçek tasarımlarının galerisini keşfedin.",
};

export default function GaleriPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>;
}) {
  return (
    <>
      {/* Page Header */}
      <section className="pt-32 pb-12 lg:pt-40 lg:pb-16 px-6 lg:px-12 border-b border-sand">
        <div className="max-w-7xl mx-auto">
          <p className="font-label text-gold text-[0.65rem] mb-4">— Galeri</p>
          <h1
            className="font-serif text-brown leading-tight"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              fontStyle: "italic",
            }}
          >
            Eserlerimiz
          </h1>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="py-10 lg:py-16">
        <FilterBar />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-10">
          <GalleryGrid searchParams={searchParams} />
        </div>
      </section>
    </>
  );
}
