"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingBag, Zap, ShieldCheck, Truck, RefreshCw, CheckCircle, ChevronDown } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import type { Product, ProductVariant } from "@/data/products";
import { toast } from "sonner";

const trustItems = [
  { icon: ShieldCheck, text: "Güvenli ödeme" },
  { icon: Truck, text: "Ücretsiz kargo" },
  { icon: RefreshCw, text: "10 gün iade" },
  { icon: CheckCircle, text: "El yapımı" },
];

export default function EserDetayClient({ product }: { product: Product }) {
  const { add, items } = useCart();
  const router = useRouter();

  const variants = product.variants ?? [];
  const initialVariant = variants.length > 0 ? variants.find((v) => v.available) ?? null : null;
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(initialVariant);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [showVariantImage, setShowVariantImage] = useState(!!initialVariant?.image);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const activePrice = selectedVariant?.price ?? product.price;
  const cartId = selectedVariant ? `${product.id}_${selectedVariant.id}` : product.id;
  const inCart = items.some((i) => i.id === cartId);
  const isAvailable = selectedVariant ? selectedVariant.available : product.available;
  const images = product.images ?? [];

  const displayImage =
    showVariantImage && selectedVariant?.image
      ? selectedVariant.image
      : images[activeImageIdx] || product.bg;
  const isImage = displayImage.startsWith("http") || displayImage.startsWith("/");

  const handleSelectVariant = (v: ProductVariant) => {
    setSelectedVariant(v);
    setShowVariantImage(!!v.image);
  };

  const handleThumbnailClick = (idx: number) => {
    setActiveImageIdx(idx);
    setShowVariantImage(false);
  };

  const addToCart = () => {
    if (inCart) { toast("Zaten sepette"); return; }
    add({
      id: cartId, slug: product.slug, title: product.title,
      price: activePrice, bg: selectedVariant ? selectedVariant.hex : product.bg,
      variantName: selectedVariant?.name, variantHex: selectedVariant?.hex,
    });
    toast.success("Sepete eklendi", { description: selectedVariant ? `${product.title} — ${selectedVariant.name}` : product.title });
  };

  const buyNow = () => {
    if (!inCart) add({
      id: cartId, slug: product.slug, title: product.title,
      price: activePrice, bg: selectedVariant ? selectedVariant.hex : product.bg,
      variantName: selectedVariant?.name, variantHex: selectedVariant?.hex,
    });
    router.push("/odeme");
  };

  return (
    <>
      <div className="pt-14 lg:pt-18 min-h-screen">
        <div className="max-w-6xl mx-auto px-0 lg:px-10">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 px-4 lg:px-0 py-3 lg:py-6">
            <Link href="/galeri" className="flex items-center gap-1.5 font-label text-[#888480] text-[0.6rem] hover:text-gold transition-colors group">
              <ArrowLeft size={11} className="group-hover:-translate-x-0.5 transition-transform" />
              Eserler
            </Link>
            <span className="font-label text-[#888480] text-[0.6rem]">/</span>
            <span className="font-label text-[#888480] text-[0.6rem] truncate max-w-[180px]">{product.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-0 lg:gap-12 lg:items-start">

            {/* ── Sol: Görsel ── */}
            <div className="lg:sticky lg:top-20">
              {/* Ana görsel */}
              <div
                className="w-full aspect-[4/3] lg:aspect-[4/5] relative overflow-hidden"
                style={isImage ? {} : { background: selectedVariant ? selectedVariant.hex : product.bg }}
              >
                {isImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={displayImage} alt={product.title} className="w-full h-full object-cover" />
                ) : (
                  <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 600 500" fill="none" preserveAspectRatio="xMidYMid slice">
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
                      <ellipse key={a} cx="300" cy="150" rx="70" ry="200" fill="#5c1a2e" transform={`rotate(${a} 300 250)`} />
                    ))}
                    <circle cx="300" cy="250" r="55" fill="#5c1a2e" opacity="0.8" />
                  </svg>
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="font-label text-[0.5rem] bg-cream/90 text-brown px-2.5 py-1">
                    {product.category}
                  </span>
                  {product.featured && (
                    <span className="font-label text-[0.5rem] bg-gold text-cream px-2.5 py-1">Öne Çıkan</span>
                  )}
                </div>

                {!isAvailable && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                    <span className="font-label text-brown text-[0.7rem] bg-white px-6 py-3 border border-sand">Tükendi</span>
                  </div>
                )}
              </div>

              {/* Thumbnail gallery */}
              {images.length > 1 && (
                <div className="flex gap-2 px-4 lg:px-0 mt-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleThumbnailClick(idx)}
                      className={`shrink-0 w-14 h-14 overflow-hidden border-2 transition-all ${
                        !showVariantImage && activeImageIdx === idx ? "border-brown" : "border-sand hover:border-brown/40"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Trust strip — sadece desktop */}
              <div className="hidden lg:grid grid-cols-4 gap-2 mt-3">
                {trustItems.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex flex-col items-center gap-1.5 bg-cream-dark px-2 py-2.5 text-center">
                    <Icon size={13} className="text-gold" />
                    <span className="font-label text-[#888480] text-[0.5rem]">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Sağ: Bilgi ── */}
            <div className="px-4 lg:px-0 py-5 lg:py-0 space-y-4">

              {/* Başlık + fiyat */}
              <div>
                <h1 className="font-serif text-brown leading-tight mb-2" style={{ fontSize: "clamp(1.6rem, 5vw, 2.4rem)", fontStyle: "italic" }}>
                  {product.title}
                </h1>
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-[#1a1a1a]" style={{ fontSize: "clamp(1.6rem, 5vw, 2.2rem)", fontStyle: "italic" }}>
                    ₺{activePrice.toLocaleString("tr-TR")}
                  </span>
                  {selectedVariant?.price && selectedVariant.price !== product.price && (
                    <span className="font-label text-[#888480] text-[0.55rem] line-through">
                      ₺{product.price.toLocaleString("tr-TR")}
                    </span>
                  )}
                  <span className="font-label text-[#888480] text-[0.55rem]">kargo dahil değil</span>
                </div>
              </div>

              {/* Renk varyantları — fiyatın hemen altında */}
              {variants.length > 0 && (
                <div className="pb-3 border-b border-sand">
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="font-label text-[#888480] text-[0.55rem]">Renk:</span>
                    {selectedVariant && (
                      <span className="font-label text-[#1a1a1a] text-[0.6rem]">{selectedVariant.name}</span>
                    )}
                  </div>
                  <div className="flex items-end gap-2.5 flex-wrap">
                    {variants.map((v) => {
                      const isSelected = selectedVariant?.id === v.id;
                      return (
                        <div key={v.id} className="flex flex-col items-center gap-1">
                          <button
                            onClick={() => handleSelectVariant(v)}
                            disabled={!v.available}
                            title={v.available ? v.name : `${v.name} — Tükendi`}
                            className={`relative shrink-0 overflow-hidden transition-all duration-200 ${
                              v.image ? "w-12 h-12 rounded" : "w-8 h-8 rounded-full"
                            } border-2 ${
                              !v.available
                                ? "opacity-40 cursor-not-allowed border-sand"
                                : isSelected
                                ? "border-brown scale-105 shadow-md"
                                : "border-sand hover:border-brown/50 hover:scale-105"
                            }`}
                            style={v.image ? {} : { background: v.hex }}
                          >
                            {v.image && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                            )}
                            {!v.available && (
                              <span className="absolute inset-0 flex items-center justify-center bg-white/30">
                                <svg viewBox="0 0 32 32" className="w-full h-full">
                                  <line x1="5" y1="5" x2="27" y2="27" stroke={v.image ? "#1a1a1a" : "white"} strokeWidth="2" strokeLinecap="round" />
                                </svg>
                              </span>
                            )}
                            {isSelected && (
                              <span className="absolute inset-0 flex items-center justify-center">
                                <svg viewBox="0 0 32 32" className={v.image ? "w-5 h-5 drop-shadow" : "w-3.5 h-3.5"}>
                                  <path d="M7 16 L13 22 L25 10" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </span>
                            )}
                          </button>
                          {v.image && (
                            <span className="w-2.5 h-2.5 rounded-full border border-black/10" style={{ background: v.hex }} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* CTA butonları */}
              {isAvailable ? (
                <div className="flex gap-2">
                  <button
                    onClick={buyNow}
                    className="flex-1 flex items-center justify-center gap-2 bg-brown text-cream font-label py-3.5 text-[0.65rem] hover:bg-brown-light transition-colors duration-300"
                  >
                    <Zap size={13} /> Hemen Satın Al
                  </button>
                  <button
                    onClick={addToCart}
                    className={`flex-1 flex items-center justify-center gap-2 font-label py-3.5 text-[0.65rem] border transition-colors duration-300 ${
                      inCart ? "bg-green-50 border-green-200 text-green-700" : "border-sand text-[#1a1a1a] hover:border-brown/40"
                    }`}
                  >
                    <ShoppingBag size={13} />
                    {inCart ? "Sepette ✓" : "Sepete Ekle"}
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-full py-3.5 bg-sand text-center font-label text-[#888480] text-[0.65rem]">
                    {selectedVariant ? `${selectedVariant.name} Rengi Tükendi` : "Bu Eser Tükendi"}
                  </div>
                  <Link href="/iletisim" className="w-full flex items-center justify-center gap-2 border border-sand text-[#1a1a1a] font-label py-3 text-[0.6rem] hover:border-brown/40 transition-colors">
                    Benzer Eser İçin İletişime Geç
                  </Link>
                </div>
              )}

              {/* Trust strip — sadece mobil */}
              <div className="grid grid-cols-4 gap-2 lg:hidden">
                {trustItems.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex flex-col items-center gap-1 bg-cream-dark px-1 py-2 text-center">
                    <Icon size={12} className="text-gold" />
                    <span className="font-label text-[#888480] text-[0.45rem] leading-tight">{text}</span>
                  </div>
                ))}
              </div>

              {/* Açıklama */}
              <p className="text-[#888480] font-light text-sm leading-relaxed border-t border-sand pt-4">
                {product.description}
              </p>

              {/* Detaylar — tıklanabilir */}
              {product.details.length > 0 && (
                <div className="border border-sand">
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 font-label text-[0.6rem] text-[#888480] hover:text-brown transition-colors"
                    onClick={() => setDetailsOpen((v) => !v)}
                  >
                    Ürün Detayları
                    <ChevronDown size={13} className={`transition-transform duration-200 ${detailsOpen ? "rotate-180" : ""}`} />
                  </button>
                  {detailsOpen && (
                    <div className="px-4 pb-4 border-t border-sand">
                      <ul className="space-y-2 pt-3">
                        {product.details.map((d) => (
                          <li key={d} className="flex items-start gap-2 text-[#888480] text-sm font-light">
                            <span className="w-1 h-1 rounded-full bg-gold shrink-0 mt-2" />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <p className="font-label text-[#888480] text-[0.5rem] text-center pb-24 lg:pb-0">
                Ödeme onayından sonra sipariş hazırlığa alınır.{" "}
                <Link href="/iletisim" className="text-gold hover:text-brown transition-colors">Sorularınız için iletişim.</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA — sadece mobil */}
      {isAvailable && (
        <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-sand px-4 py-3 flex gap-2 shadow-lg">
          <button
            onClick={addToCart}
            className={`flex-1 flex items-center justify-center gap-1.5 font-label text-[0.6rem] py-3 border transition-colors ${
              inCart ? "bg-green-50 border-green-200 text-green-700" : "border-sand text-[#1a1a1a]"
            }`}
          >
            <ShoppingBag size={13} />
            {inCart ? "Sepette ✓" : "Sepete Ekle"}
          </button>
          <button
            onClick={buyNow}
            className="flex-1 flex items-center justify-center gap-1.5 bg-brown text-cream font-label text-[0.6rem] py-3 hover:bg-brown-light transition-colors"
          >
            <Zap size={13} /> Hemen Al
          </button>
        </div>
      )}
    </>
  );
}
