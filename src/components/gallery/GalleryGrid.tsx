import { GalleryCard } from "./GalleryCard";
import { createClient } from "@/lib/supabase/server";
import { mapDBProduct, products as mockProducts } from "@/data/products";
import type { Product } from "@/data/products";

export async function GalleryGrid({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>;
}) {
  const params = await searchParams;
  const aktifKategori = params.kategori ?? "";

  let allProducts: Product[] = mockProducts;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("is_available", true)
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false });

    if (data && data.length > 0) {
      allProducts = data.map(mapDBProduct);
    }
  } catch {
    // fall back to mock data if Supabase not configured
  }

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {filtered.map((product) => (
        <GalleryCard key={product.id} product={product} />
      ))}
    </div>
  );
}
