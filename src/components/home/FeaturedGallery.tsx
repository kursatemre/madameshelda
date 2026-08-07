import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GalleryCard } from "@/components/gallery/GalleryCard";
import { products as mockProducts } from "@/data/products";
import type { Product } from "@/data/products";
import type { HomeFeaturedContent } from "@/lib/site-content";

// Gerçek "Öne Çıkan" ürün yoksa (henüz işaretlenmemiş) gösterilecek örnek düzen.
const mockFeatured: Product[] = mockProducts.slice(0, 4);

export function FeaturedGallery({
  content, products,
}: {
  content: HomeFeaturedContent;
  products: Product[];
}) {
  const items = (products.length > 0 ? products : mockFeatured).slice(0, 4);

  return (
    <section className="py-20 lg:py-32 px-6 lg:px-12 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 lg:mb-16 gap-6">
        <div>
          <p className="font-label text-gold text-[0.65rem] mb-4">
            {content.eyebrow}
          </p>
          <h2
            className="font-serif text-[#1a1a1a] leading-tight"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontStyle: "italic",
            }}
          >
            {content.title_line1}
            <br />
            <span className="text-brown">{content.title_line2}</span>
          </h2>
        </div>
        <Link
          href="/galeri"
          className="inline-flex items-center gap-3 font-label text-brown/70 hover:text-gold transition-colors duration-300 group self-start lg:self-auto"
        >
          Tüm Galeri
          <ArrowRight
            size={14}
            className="group-hover:translate-x-1 transition-transform duration-300"
          />
        </Link>
      </div>

      {/* Ürün kartları — her kart aynı boyutta, tam görsel + isim/fiyat/sepete ekle her zaman görünür */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((product) => (
          <GalleryCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
