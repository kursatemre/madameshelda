import Link from "next/link";
import { GalleryCard } from "./GalleryCard";

const allProducts = [
  { id: "1", slug: "sonbahar-koleksiyonu", title: "Sonbahar Koleksiyonu", category: "ozel", price: "₺4.800", bg: "linear-gradient(135deg, #f5eef0 0%, #d4b0be 50%, #5c1a2e 100%)" },
  { id: "2", slug: "beyaz-peonies", title: "Beyaz Peonies", category: "ev", price: "₺2.400", bg: "linear-gradient(160deg, #fdf8f3 0%, #f5eef0 40%, #f0dde4 100%)" },
  { id: "3", slug: "altin-nisan", title: "Altın Nisan", category: "magaza", price: "₺3.600", bg: "linear-gradient(135deg, #faf0f3 0%, #e8c99a 60%, #7a2440 100%)" },
  { id: "4", slug: "ofis-serisi", title: "Ofis Serisi", category: "ofis", price: "₺1.800", bg: "linear-gradient(180deg, #f5eef0 0%, #d4b0be 100%)" },
  { id: "5", slug: "bahar-esintisi", title: "Bahar Esintisi", category: "ev", price: "₺2.100", bg: "linear-gradient(135deg, #faf0f3 0%, #f0dde4 100%)" },
  { id: "6", slug: "lila-romansi", title: "Lila Romansi", category: "ozel", price: "₺5.200", bg: "linear-gradient(160deg, #f0dde4 0%, #7a2440 100%)" },
  { id: "7", slug: "modern-ofis", title: "Modern Ofis", category: "ofis", price: "₺2.800", bg: "linear-gradient(135deg, #fdf8f3 0%, #d4b0be 100%)" },
  { id: "8", slug: "mağaza-cephesi", title: "Mağaza Cephesi", category: "magaza", price: "₺6.500", bg: "linear-gradient(160deg, #e8c99a 0%, #5c1a2e 100%)" },
  { id: "9", slug: "gunes-cicekleri", title: "Güneş Çiçekleri", category: "ev", price: "₺1.950", bg: "linear-gradient(135deg, #f5eef0 0%, #e8c99a 100%)" },
];

export async function GalleryGrid({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>;
}) {
  const params = await searchParams;
  const aktifKategori = params.kategori ?? "";

  const filtered = aktifKategori
    ? allProducts.filter((p) => p.category === aktifKategori)
    : allProducts;

  if (filtered.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="font-serif text-brown/40 text-2xl" style={{ fontStyle: "italic" }}>
          Bu kategoride henüz eser yok.
        </p>
      </div>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
      {filtered.map((product, i) => (
        <div key={product.id} className="break-inside-avoid">
          <GalleryCard product={product} index={i} />
        </div>
      ))}
    </div>
  );
}
