"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Copy, MessageCircle, CheckCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

type PaymentMethod = "havale" | "whatsapp";

type FormData = {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  note: string;
};

const BANK = {
  name: "Ziraat Bankası",
  iban: "TR00 0000 0000 0000 0000 0000 00",
  account: "Madame Shelda",
};

const WHATSAPP = "905001234567";

export default function OdemePage() {
  const { items, total, clear } = useCart();
  const [payment, setPayment] = useState<PaymentMethod>("havale");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderRef, setOrderRef] = useState("");
  const [form, setForm] = useState<FormData>({
    full_name: "", email: "", phone: "", address: "", city: "", note: "",
  });

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);

    const ref = "MS" + Date.now().toString(36).toUpperCase();
    const itemsList = items.map((i) => `• ${i.title}: ₺${i.price.toLocaleString("tr-TR")}`).join("\n");

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ref,
          ...form,
          items,
          total,
          payment_method: payment,
        }),
      });

      if (!res.ok) throw new Error();

      if (payment === "whatsapp") {
        const msg = encodeURIComponent(
          `Merhaba, sipariş vermek istiyorum.\n\nSipariş No: ${ref}\n\n${itemsList}\n\nToplam: ₺${total.toLocaleString("tr-TR")}\n\nAd: ${form.full_name}\nTel: ${form.phone}`
        );
        window.open(`https://wa.me/${WHATSAPP}?text=${msg}`, "_blank");
      }

      setOrderRef(ref);
      setSuccess(true);
      clear();
    } catch {
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <p className="font-serif text-brown/40 text-2xl mb-4" style={{ fontStyle: "italic" }}>
            Sepetiniz boş.
          </p>
          <Link href="/galeri" className="font-label text-gold text-[0.6rem] hover:text-brown transition-colors">
            ← Eserlere Dön
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-6 lg:px-12">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={28} className="text-green-600" />
            </div>
            <h1 className="font-serif text-brown text-3xl mb-2" style={{ fontStyle: "italic" }}>
              Siparişiniz Alındı!
            </h1>
            <p className="font-label text-[#888480] text-[0.6rem]">Sipariş No: {orderRef}</p>
          </div>

          {payment === "havale" ? (
            <div className="border border-sand p-6 mb-6 space-y-4">
              <p className="font-label text-[#1a1a1a] text-[0.65rem] mb-1">Havale / EFT Bilgileri</p>
              <p className="text-[#888480] font-light text-sm">
                Aşağıdaki hesaba <strong>₺{total.toLocaleString("tr-TR")}</strong> tutarında havale yapın.
                Açıklamaya sipariş numaranızı yazmayı unutmayın.
              </p>

              {[
                { label: "Banka", value: BANK.name },
                { label: "Hesap Sahibi", value: BANK.account },
                { label: "IBAN", value: BANK.iban },
                { label: "Açıklama", value: orderRef },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-sand last:border-0">
                  <span className="font-label text-[#888480] text-[0.55rem]">{label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-label text-[#1a1a1a] text-[0.65rem]">{value}</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(value)}
                      className="text-[#888480] hover:text-gold transition-colors"
                    >
                      <Copy size={11} />
                    </button>
                  </div>
                </div>
              ))}

              <p className="text-[#888480] font-light text-xs mt-2">
                Havale yaptıktan sonra dekontunuzu WhatsApp üzerinden bize gönderin.
              </p>

              <a
                href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Merhaba, ${orderRef} numaralı siparişimin dekontunu gönderiyorum.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-600 text-white font-label text-[0.6rem] py-3.5 hover:bg-green-700 transition-colors mt-4"
              >
                <MessageCircle size={13} />
                WhatsApp&apos;tan Dekont Gönder
              </a>
            </div>
          ) : (
            <div className="border border-sand p-6 mb-6 text-center">
              <p className="text-[#888480] font-light text-sm mb-4">
                WhatsApp penceresi açıldı. Siparişiniz detaylarıyla birlikte gönderilmeyi bekliyor.
              </p>
              <p className="font-label text-[#888480] text-[0.55rem]">
                Pencere açılmadıysa aşağıdan tekrar deneyin.
              </p>
              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 text-white font-label text-[0.6rem] px-6 py-3 mt-4 hover:bg-green-700 transition-colors"
              >
                <MessageCircle size={13} />
                WhatsApp&apos;ı Aç
              </a>
            </div>
          )}

          <div className="text-center space-y-3">
            <p className="font-label text-[#888480] text-[0.55rem]">
              Onay ve teslimat bilgileri {form.email} adresine gönderilecek.
            </p>
            <Link href="/galeri" className="inline-block font-label text-gold text-[0.6rem] hover:text-brown transition-colors">
              Alışverişe Devam Et →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Back */}
        <Link href="/galeri" className="inline-flex items-center gap-1.5 font-label text-[#888480] text-[0.6rem] hover:text-gold transition-colors mb-8 group">
          <ArrowLeft size={11} className="group-hover:-translate-x-0.5 transition-transform" />
          Eserlere Dön
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 lg:gap-14">
          {/* Sol — Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h1 className="font-serif text-brown text-2xl mb-1" style={{ fontStyle: "italic" }}>
                Ödeme
              </h1>
              <div className="flex items-center gap-1.5 mt-2">
                <ShieldCheck size={12} className="text-gold" />
                <span className="font-label text-[#888480] text-[0.55rem]">Güvenli sipariş</span>
              </div>
            </div>

            {/* Kişisel bilgiler */}
            <div>
              <p className="font-label text-[#888480] text-[0.6rem] mb-5 pb-3 border-b border-sand">
                01 — Bilgileriniz
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { field: "full_name" as const, label: "Ad Soyad", type: "text", required: true, colSpan: true },
                  { field: "email" as const, label: "E-posta", type: "email", required: true },
                  { field: "phone" as const, label: "Telefon", type: "tel", required: true },
                ].map(({ field, label, type, required, colSpan }) => (
                  <div key={field} className={colSpan ? "sm:col-span-2" : ""}>
                    <label className="font-label text-[#888480] text-[0.55rem] block mb-2">
                      {label} {required && <span className="text-gold">*</span>}
                    </label>
                    <input
                      type={type}
                      required={required}
                      value={form[field]}
                      onChange={set(field)}
                      className="w-full input-underline py-2.5 text-[#1a1a1a] text-sm"
                      placeholder={label}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Teslimat adresi */}
            <div>
              <p className="font-label text-[#888480] text-[0.6rem] mb-5 pb-3 border-b border-sand">
                02 — Teslimat Adresi
              </p>
              <div className="space-y-6">
                <div>
                  <label className="font-label text-[#888480] text-[0.55rem] block mb-2">
                    Adres <span className="text-gold">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.address}
                    onChange={set("address")}
                    className="w-full input-underline py-2.5 text-[#1a1a1a] text-sm"
                    placeholder="Mahalle, sokak, bina, daire"
                  />
                </div>
                <div>
                  <label className="font-label text-[#888480] text-[0.55rem] block mb-2">
                    İl / İlçe <span className="text-gold">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={set("city")}
                    className="w-full input-underline py-2.5 text-[#1a1a1a] text-sm"
                    placeholder="İstanbul, Ankara..."
                  />
                </div>
                <div>
                  <label className="font-label text-[#888480] text-[0.55rem] block mb-2">Not (opsiyonel)</label>
                  <textarea
                    rows={2}
                    value={form.note}
                    onChange={set("note")}
                    className="w-full input-underline py-2.5 text-[#1a1a1a] text-sm resize-none"
                    placeholder="Özel istekleriniz..."
                  />
                </div>
              </div>
            </div>

            {/* Ödeme yöntemi */}
            <div>
              <p className="font-label text-[#888480] text-[0.6rem] mb-5 pb-3 border-b border-sand">
                03 — Ödeme Yöntemi
              </p>
              <div className="space-y-3">
                {[
                  {
                    id: "havale" as PaymentMethod,
                    label: "Havale / EFT",
                    desc: "Sipariş onayı sonrası banka bilgileri paylaşılır.",
                  },
                  {
                    id: "whatsapp" as PaymentMethod,
                    label: "WhatsApp ile Sipariş",
                    desc: "Siparişiniz WhatsApp üzerinden onaylanır.",
                  },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-start gap-4 p-4 border cursor-pointer transition-colors duration-200 ${
                      payment === opt.id ? "border-brown bg-brown/[0.03]" : "border-sand hover:border-brown/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={opt.id}
                      checked={payment === opt.id}
                      onChange={() => setPayment(opt.id)}
                      className="mt-0.5 accent-brown"
                    />
                    <div>
                      <p className="font-label text-[#1a1a1a] text-[0.65rem] mb-0.5">{opt.label}</p>
                      <p className="text-[#888480] font-light text-xs">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brown text-cream font-label py-4 text-[0.7rem] hover:bg-brown-light transition-colors duration-300 disabled:opacity-60"
            >
              {loading ? "İşleniyor..." : "Siparişi Tamamla"}
            </button>
          </form>

          {/* Sağ — Özet */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="border border-sand p-6">
              <p className="font-label text-[#1a1a1a] text-[0.65rem] mb-5 pb-3 border-b border-sand">
                Sipariş Özeti
              </p>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-14 h-14 shrink-0" style={{ background: item.bg }}>
                      <svg viewBox="0 0 56 56" className="w-full h-full opacity-25">
                        {[0, 60, 120, 180, 240, 300].map((a) => (
                          <ellipse key={a} cx="28" cy="28" rx="7" ry="19" fill="#5c1a2e" transform={`rotate(${a} 28 28)`} />
                        ))}
                        <circle cx="28" cy="28" r="6" fill="#5c1a2e" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-label text-[#1a1a1a] text-[0.6rem] mb-1 truncate">{item.title}</p>
                      <p className="font-serif text-brown text-lg" style={{ fontStyle: "italic" }}>
                        ₺{item.price.toLocaleString("tr-TR")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-sand pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="font-label text-[#888480] text-[0.6rem]">Ara Toplam</span>
                  <span className="font-label text-[#888480] text-[0.6rem]">₺{total.toLocaleString("tr-TR")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-label text-[#888480] text-[0.6rem]">Kargo</span>
                  <span className="font-label text-green-600 text-[0.6rem]">Ücretsiz</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-sand mt-2">
                  <span className="font-label text-[#1a1a1a] text-[0.65rem]">Toplam</span>
                  <span className="font-serif text-[#1a1a1a] text-xl" style={{ fontStyle: "italic" }}>
                    ₺{total.toLocaleString("tr-TR")}
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-sand flex items-start gap-2">
                <ShieldCheck size={12} className="text-gold shrink-0 mt-0.5" />
                <p className="font-label text-[#888480] text-[0.55rem] leading-relaxed">
                  Bilgileriniz güvende. Ödeme işlemi 256-bit SSL şifreleme ile korunur.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
