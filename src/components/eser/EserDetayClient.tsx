"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingBag, Zap, ShieldCheck, Truck, RefreshCw, CheckCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { categoryLabels } from "@/data/products";
import type { Product } from "@/data/products";
import { toast } from "sonner";

const trustItems = [
  { icon: ShieldCheck, text: "Güvenli ödeme" },
  { icon: Truck, text: "Ücretsiz kargo" },
  { icon: RefreshCw, text: "10 gün iade garantisi" },
  { icon: CheckCircle, text: "El yapımı, özgün eser" },
];

export default function EserDetayClient({ product }: { product: Product }) {
  const { add, items } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);

  const inCart = items.some((i) => i.id === product.id);

  const handleAddToCart = () => {
    if (inCart) {
      toast("Zaten sepette", { description: product.title });
      return;
    }
    add({ id: product.id, slug: product.slug, title: product.title, price: product.price, bg: product.bg });
    setAdded(true);
    toast.success("Sepete eklendi", { description: product.title });
  };

  const handleBuyNow = () => {
    if (!inCart) {
      add({ id: product.id, slug: product.slug, title: product.title, price: product.price, bg: product.bg });
    }
    router.push("/odeme");
  };

  const visual = product.images?.[0] ?? product.bg;
  const isImage = visual.startsWith("http") || visual.startsWith("/");

  return (
    <>
      <div className="pt-16 lg:pt-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8">
            <Link href="/galeri" className="flex items-center gap-1.5 font-label text-[#888480] text-[0.6rem] hover:text-gold transition-colors group">
              <ArrowLeft size={11} className="group-hover:-translate-x-0.5 transition-transform" />
              Eserler
            </Link>
            <span className="font-label text-[#888480] text-[0.6rem]">/</span>
            <span className="font-label text-[#888480] text-[0.6rem]">{product.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Sol — Görsel */}
            <div className="relative">
              <div
                className="w-full aspect-[4/5] relative overflow-hidden"
                style={isImage ? {} : { background: visual }}
              >
                {isImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={visual} alt={product.title} className="w-full h-full object-cover" />
                ) : (
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
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="font-label text-[0.55rem] bg-cream/90 text-brown px-3 py-1.5">
                    {categoryLabels[product.category]}
                  </span>
                  {product.featured && (
                    <span className="font-label text-[0.55rem] bg-gold text-cream px-3 py-1.5">
                      Öne Çıkan
                    </span>
                  )}
                </div>

                {!product.available && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                    <span className="font-label text-brown text-[0.7rem] bg-white px-6 py-3 border border-sand">
                      Tükendi
                    </span>
                  </div>
                )}
              </div>

              {/* Trust mini strip */}
              <div className="grid grid-cols-2 gap-2 mt-3">
                {trustItems.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 bg-cream-dark px-3 py-2.5">
                    <Icon size={12} className="text-gold shrink-0" />
                    <span className="font-label text-[#888480] text-[0.55rem]">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sağ — Bilgi */}
            <div className="flex flex-col lg:sticky lg:top-24 lg:self-start">
              <p className="font-label text-gold text-[0.6rem] mb-2">
                {categoryLabels[product.category]}
              </p>

              <h1
                className="font-serif text-brown leading-tight mb-4"
                style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontStyle: "italic" }}
              >
                {product.title}
              </h1>

              {/* Fiyat */}
              <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-sand">
                <span
                  className="font-serif text-[#1a1a1a]"
                  style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", fontStyle: "italic" }}
                >
                  ₺{product.price.toLocaleString("tr-TR")}
                </span>
                <span className="font-label text-[#888480] text-[0.6rem]">Kargo dahil değil</span>
              </div>

              <p className="text-[#888480] font-light text-sm leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Ürün detayları */}
              <div className="mb-8">
                <p className="font-label text-[#888480] text-[0.55rem] mb-3">Detaylar</p>
                <ul className="space-y-2">
                  {product.details.map((d) => (
                    <li key={d} className="flex items-start gap-2.5 text-[#888480] text-sm font-light">
                      <span className="w-1 h-1 rounded-full bg-gold shrink-0 mt-2" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              {product.available ? (
                <div className="space-y-3">
                  <button
                    onClick={handleBuyNow}
                    className="w-full flex items-center justify-center gap-2.5 bg-brown text-cream font-label py-4 text-[0.7rem] hover:bg-brown-light transition-colors duration-300"
                  >
                    <Zap size={14} />
                    Hemen Satın Al
                  </button>
                  <button
                    onClick={handleAddToCart}
                    className={`w-full flex items-center justify-center gap-2.5 font-label py-4 text-[0.7rem] border transition-colors duration-300 ${
                      inCart || added
                        ? "bg-green-50 border-green-200 text-green-700"
                        : "border-sand text-[#1a1a1a] hover:border-brown/40"
                    }`}
                  >
                    <ShoppingBag size={14} />
                    {inCart || added ? "Sepete Eklendi ✓" : "Sepete Ekle"}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-full py-4 bg-sand text-center font-label text-[#888480] text-[0.7rem]">
                    Bu Eser Tükendi
                  </div>
                  <Link
                    href="/iletisim"
                    className="w-full flex items-center justify-center gap-2 border border-sand text-[#1a1a1a] font-label py-3.5 text-[0.65rem] hover:border-brown/40 transition-colors"
                  >
                    Benzer Eser İçin İletişime Geç
                  </Link>
                </div>
              )}

              <p className="font-label text-[#888480] text-[0.55rem] text-center mt-4">
                Ödeme onayından sonra sipariş hazırlık sürecine alınır.
                <br />
                Sorularınız için{" "}
                <Link href="/iletisim" className="text-gold hover:text-brown transition-colors">
                  iletişime geçin
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      {product.available && (
        <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-sand p-4 flex gap-3">
          <button
            onClick={handleAddToCart}
            className={`flex-1 flex items-center justify-center gap-1.5 font-label text-[0.6rem] py-3.5 border transition-colors ${
              inCart || added ? "bg-green-50 border-green-200 text-green-700" : "border-sand text-[#1a1a1a]"
            }`}
          >
            <ShoppingBag size={13} />
            {inCart || added ? "Sepette ✓" : "Sepete Ekle"}
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 flex items-center justify-center gap-1.5 bg-brown text-cream font-label text-[0.6rem] py-3.5 hover:bg-brown-light transition-colors"
          >
            <Zap size={13} />
            Hemen Al
          </button>
        </div>
      )}
    </>
  );
}
