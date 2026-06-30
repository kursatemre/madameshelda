import { GalleryCard } from "./GalleryCard";
import { products } from "@/data/products";

export async function GalleryGrid({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>;
}) {
  const params = await searchParams;
  const aktifKategori = params.kategori ?? "";

  const filtered = aktifKategori
    ? products.filter((p) => p.category === aktifKategori)
    : products;

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {filtered.map((product) => (
        <GalleryCard key={product.id} product={product} />
      ))}
    </div>
  );
}
