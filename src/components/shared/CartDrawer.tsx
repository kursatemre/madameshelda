"use client";

import { useCart } from "@/contexts/CartContext";
import { X, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import Link from "next/link";

export function CartDrawer() {
  const { items, remove, total, count, isOpen, setIsOpen } = useCart();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 flex flex-col transition-transform duration-400 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-sand">
          <div className="flex items-center gap-2.5">
            <ShoppingBag size={16} className="text-brown" />
            <h2 className="font-label text-[#1a1a1a] text-[0.7rem]">
              Sepet {count > 0 && `(${count})`}
            </h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-[#888480] hover:text-brown transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-8 text-center">
              <ShoppingBag size={36} className="text-sand-dark" />
              <p className="font-serif text-brown/40 text-xl" style={{ fontStyle: "italic" }}>
                Sepetiniz boş
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="font-label text-gold text-[0.6rem] hover:text-brown transition-colors"
              >
                Alışverişe Devam Et →
              </button>
            </div>
          ) : (
            <div className="divide-y divide-sand">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 px-6 py-4">
                  {/* Mini visual */}
                  <div
                    className="w-16 h-16 shrink-0"
                    style={{ background: item.bg }}
                  >
                    <svg viewBox="0 0 64 64" className="w-full h-full opacity-30">
                      {[0, 60, 120, 180, 240, 300].map((a) => (
                        <ellipse key={a} cx="32" cy="32" rx="8" ry="22" fill="#5c1a2e" transform={`rotate(${a} 32 32)`} />
                      ))}
                      <circle cx="32" cy="32" r="7" fill="#5c1a2e" />
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-label text-[#1a1a1a] text-[0.65rem] mb-0.5 truncate">
                      {item.title}
                    </p>
                    {item.variantName && (
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="w-3 h-3 rounded-full border border-black/10" style={{ background: item.variantHex }} />
                        <span className="font-label text-[#888480] text-[0.5rem]">{item.variantName}</span>
                      </div>
                    )}
                    <p className="font-serif text-brown text-lg" style={{ fontStyle: "italic" }}>
                      ₺{item.price.toLocaleString("tr-TR")}
                    </p>
                  </div>

                  <button
                    onClick={() => remove(item.id)}
                    className="shrink-0 p-1 text-[#888480] hover:text-red-500 transition-colors self-start mt-0.5"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-sand px-6 py-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-label text-[#888480] text-[0.6rem]">Toplam</span>
              <span className="font-serif text-[#1a1a1a] text-2xl" style={{ fontStyle: "italic" }}>
                ₺{total.toLocaleString("tr-TR")}
              </span>
            </div>
            <p className="font-label text-[#888480] text-[0.55rem]">
              Kargo ücretsiz · Teslimat 2–3 hafta
            </p>
            <Link
              href="/odeme"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full bg-brown text-cream font-label py-4 hover:bg-brown-light transition-colors duration-300 group"
            >
              Ödemeye Geç
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
