"use client";

import Link from "next/link";
import { ShoppingBag, Eye } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import type { Product } from "@/data/products";
import { categoryLabels } from "@/data/products";

export function GalleryCard({ product }: { product: Product }) {
  const { add, items } = useCart();
  const inCart = items.some((i) => i.id === product.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product.available) return;
    if (inCart) {
      toast("Zaten sepette", { description: product.title });
      return;
    }
    add({ id: product.id, slug: product.slug, title: product.title, price: product.price, bg: product.bg });
    toast.success("Sepete eklendi", { description: product.title });
  };

  return (
    <div className="group flex flex-col bg-white border border-sand hover:border-gold/40 transition-all duration-300 overflow-hidden">
      {/* Görsel */}
      <Link href={`/eser/${product.slug}`} className="block relative overflow-hidden">
        <div
          className="h-56 relative transition-transform duration-500 group-hover:scale-[1.03]"
          style={{ background: product.bg }}
        >
          <svg
            className="absolute inset-0 w-full h-full opacity-25"
            viewBox="0 0 400 280"
            fill="none"
            preserveAspectRatio="xMidYMid slice"
          >
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
              <ellipse key={a} cx="200" cy="80" rx="28" ry="85" fill="#a07850" transform={`rotate(${a} 200 140)`} />
            ))}
            <circle cx="200" cy="140" r="22" fill="#a07850" />
          </svg>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            <span className="font-label text-[0.5rem] bg-cream/90 text-brown px-2 py-1">
              {categoryLabels[product.category]}
            </span>
            {!product.available && (
              <span className="font-label text-[0.5rem] bg-brown text-cream px-2 py-1">
                Tükendi
              </span>
            )}
            {product.featured && product.available && (
              <span className="font-label text-[0.5rem] bg-gold text-cream px-2 py-1">
                Öne Çıkan
              </span>
            )}
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-brown/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="flex items-center gap-2 font-label text-cream text-[0.6rem] border border-cream/40 px-4 py-2">
              <Eye size={12} /> İncele
            </span>
          </div>
        </div>
      </Link>

      {/* Bilgi */}
      <div className="p-4 flex flex-col gap-3">
        <div>
          <Link href={`/eser/${product.slug}`}>
            <h3
              className="font-serif text-[#1a1a1a] text-lg leading-tight hover:text-brown transition-colors duration-200"
              style={{ fontStyle: "italic" }}
            >
              {product.title}
            </h3>
          </Link>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div>
            <p className="font-label text-gold/60 text-[0.5rem] mb-0.5">Fiyat</p>
            <p className="font-serif text-brown text-xl" style={{ fontStyle: "italic" }}>
              ₺{product.price.toLocaleString("tr-TR")}
            </p>
          </div>

          <button
            onClick={handleAdd}
            disabled={!product.available}
            className={`flex items-center gap-1.5 font-label text-[0.6rem] px-4 py-2.5 transition-all duration-200 ${
              !product.available
                ? "bg-sand text-[#888480] cursor-not-allowed"
                : inCart
                ? "bg-green-50 text-green-700"
                : "bg-brown text-cream hover:bg-brown-light"
            }`}
          >
            <ShoppingBag size={12} />
            {!product.available ? "Tükendi" : inCart ? "Sepette" : "Sepete Ekle"}
          </button>
        </div>
      </div>
    </div>
  );
}
