"use client";

import { useState } from "react";
import { Search, CreditCard } from "lucide-react";

type OrderItem = { title: string; price: number; variantName?: string; variantHex?: string };
type Status = "pending" | "confirmed" | "cancelled";
type OrderResult = {
  ref: string;
  items: OrderItem[];
  total: number;
  status: Status;
  payment_method: string;
  created_at: string;
};

const statusStyle: Record<Status, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-600 border-red-200",
};
const statusLabel: Record<Status, string> = {
  pending: "Bekliyor", confirmed: "Onaylandı", cancelled: "İptal",
};
const statusDesc: Record<Status, string> = {
  pending: "Siparişiniz alındı, en kısa sürede onaylanacak.",
  confirmed: "Siparişiniz onaylandı ve hazırlanıyor.",
  cancelled: "Siparişiniz iptal edildi. Bir yanlışlık olduğunu düşünüyorsanız bize ulaşın.",
};

export default function SiparisTakipPage() {
  const [ref, setRef] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<OrderResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);
    try {
      const res = await fetch("/api/order-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ref, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Sipariş bulunamadı.");
        return;
      }
      setOrder(data.order);
    } catch {
      setError("Bir hata oluştu, lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 lg:px-12">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-serif text-brown text-3xl mb-2" style={{ fontStyle: "italic" }}>
            Sipariş Takip
          </h1>
          <p className="text-[#888480] font-light text-sm">
            Sipariş numaranız ve e-posta adresinizle sipariş durumunuzu sorgulayın.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="border border-sand p-6 sm:p-8 space-y-6">
          <div>
            <label className="font-label text-[#888480] text-[0.55rem] block mb-2">Sipariş No</label>
            <input
              required
              value={ref}
              onChange={(e) => setRef(e.target.value)}
              className="w-full input-underline py-2.5 text-[#1a1a1a] text-sm uppercase"
              placeholder="MS1A2B3C"
            />
          </div>
          <div>
            <label className="font-label text-[#888480] text-[0.55rem] block mb-2">E-posta</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full input-underline py-2.5 text-[#1a1a1a] text-sm"
              placeholder="Siparişte kullandığınız e-posta"
            />
          </div>
          {error && <p className="text-red-500 text-xs font-light">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-brown text-cream font-label py-3.5 text-[0.65rem] hover:bg-brown-light transition-colors duration-300 disabled:opacity-60"
          >
            <Search size={13} />
            {loading ? "Aranıyor..." : "Sipariş Sorgula"}
          </button>
        </form>

        {order && (
          <div className="border border-sand p-6 sm:p-8 mt-6">
            <div className="flex items-center gap-3 flex-wrap mb-4">
              <span className="font-label text-brown text-[0.7rem]">#{order.ref}</span>
              <span className={`font-label text-[0.55rem] px-2.5 py-1 border ${statusStyle[order.status]}`}>
                {statusLabel[order.status]}
              </span>
              <span className="font-label text-[#888480] text-[0.55rem] flex items-center gap-1">
                <CreditCard size={10} /> {order.payment_method === "havale" ? "Havale/EFT" : "WhatsApp"}
              </span>
            </div>
            <p className="text-[#888480] font-light text-sm mb-5">{statusDesc[order.status]}</p>
            <div className="space-y-1.5 border-t border-sand pt-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between gap-3">
                  <span className="font-label text-[0.6rem] text-[#1a1a1a] truncate">
                    {item.title}
                    {item.variantName && <span className="text-[#888480]"> — {item.variantName}</span>}
                  </span>
                  <span className="font-label text-[0.6rem] text-brown shrink-0">
                    ₺{item.price.toLocaleString("tr-TR")}
                  </span>
                </div>
              ))}
              <div className="flex justify-between pt-3 border-t border-sand mt-2">
                <span className="font-label text-[#888480] text-[0.6rem]">Toplam</span>
                <span className="font-serif text-brown text-lg" style={{ fontStyle: "italic" }}>
                  ₺{order.total.toLocaleString("tr-TR")}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
