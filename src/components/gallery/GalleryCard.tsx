"use client";

import Link from "next/link";
import { ShoppingBag, Eye } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import type { Product } from "@/data/products";

export function GalleryCard({ product }: { product: Product }) {
  const { add, items } = useCart();
  const variants = product.variants ?? [];

  // Cart key: if product has variants, require user to pick one on detail page
  const inCart = items.some((i) => i.id === product.id || i.id.startsWith(`${product.id}_`));

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.available) return;

    if (variants.length > 0) {
      // Has variants — send to detail page to pick
      return;
    }

    if (inCart) {
      toast("Zaten sepette", { description: product.title });
      return;
    }
    add({ id: product.id, slug: product.slug, title: product.title, price: product.price, bg: product.bg });
    toast.success("Sepete eklendi", { description: product.title });
  };

  const visual = product.images?.[0] ?? product.bg;
  const isImage = visual.startsWith("http") || visual.startsWith("/");

  return (
    <div className="group relative aspect-[2/3] bg-white border border-sand hover:border-gold/40 transition-all duration-300 overflow-hidden">
      {/* Tüm kartı kaplayan tıklanabilir alan (görsel + zemin) */}
      <Link href={`/eser/${product.slug}`} className="absolute inset-0 z-0" aria-label={product.title}>
        <div
          className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.03]"
          style={isImage ? {} : { background: product.bg }}
        >
          {isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={visual} alt={product.title} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <svg className="absolute inset-0 w-full h-full opacity-25" viewBox="0 0 400 280" fill="none" preserveAspectRatio="xMidYMid slice">
              {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
                <ellipse key={a} cx="200" cy="80" rx="28" ry="85" fill="#a07850" transform={`rotate(${a} 200 140)`} />
              ))}
              <circle cx="200" cy="140" r="22" fill="#a07850" />
            </svg>
          )}
        </div>
      </Link>

      {/* Üst rozetler */}
      <div className="absolute top-3 left-3 z-10 flex gap-1.5 pointer-events-none">
        <span className="font-label text-[0.5rem] bg-cream/90 text-brown px-2 py-1">
          {product.category}
        </span>
        {!product.available && (
          <span className="font-label text-[0.5rem] bg-brown text-cream px-2 py-1">Tükendi</span>
        )}
        {product.featured && product.available && (
          <span className="font-label text-[0.5rem] bg-gold text-cream px-2 py-1">Öne Çıkan</span>
        )}
      </div>

      {/* Alt bilgi — isim, fiyat, sepete ekle; görselin üzerinde */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-4 pt-16 bg-gradient-to-t from-black/85 via-black/45 to-transparent pointer-events-none">
        <h3
          className="font-serif text-cream text-lg leading-tight mb-2"
          style={{ fontStyle: "italic" }}
        >
          {product.title}
        </h3>

        {/* Renk swatches */}
        {variants.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mb-3">
            {variants.slice(0, 6).map((v) => (
              <div
                key={v.id}
                className={`w-3.5 h-3.5 rounded-full border border-cream/50 ${!v.available ? "opacity-40" : ""}`}
                style={{ background: v.hex }}
                title={v.name}
              />
            ))}
            {variants.length > 6 && (
              <span className="font-label text-cream/70 text-[0.5rem]">+{variants.length - 6}</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          <p className="font-serif text-cream text-xl" style={{ fontStyle: "italic" }}>
            ₺{product.price.toLocaleString("tr-TR")}
          </p>

          {variants.length > 0 ? (
            // Kart zaten tamamen tıklanabilir (üründe renk seçimi detay sayfasında yapılır) — dekoratif etiket
            <span className="pointer-events-none flex items-center gap-1.5 font-label text-[0.6rem] px-4 py-2.5 bg-cream text-brown">
              <Eye size={12} />
              Renk Seç
            </span>
          ) : (
            <button
              onClick={handleAdd}
              disabled={!product.available}
              className={`pointer-events-auto flex items-center gap-1.5 font-label text-[0.6rem] px-4 py-2.5 transition-all duration-200 ${
                !product.available
                  ? "bg-cream/50 text-brown/40 cursor-not-allowed"
                  : inCart
                  ? "bg-cream text-green-700"
                  : "bg-cream text-brown hover:bg-white"
              }`}
            >
              <ShoppingBag size={12} />
              {!product.available ? "Tükendi" : inCart ? "Sepette" : "Sepete Ekle"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
