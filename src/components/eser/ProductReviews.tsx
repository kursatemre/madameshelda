"use client";

import { useState, useRef } from "react";
import { MessageSquare, Loader2, X, Camera } from "lucide-react";
import { toast } from "sonner";
import { StarRating } from "@/components/shared/StarRating";

export type ReviewDisplay = {
  id: string;
  customer_name: string;
  rating: number;
  comment: string;
  images: string[];
  created_at: string;
};

export function ProductReviews({
  productId, reviews, averageRating, reviewCount,
}: {
  productId: string;
  reviews: ReviewDisplay[];
  averageRating: number;
  reviewCount: number;
}) {
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || images.length >= 3) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/reviews/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Yükleme başarısız.");
      setImages((p) => [...p, json.url]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Yükleme başarısız.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, customer_name: name, email, rating, comment, images }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Bir hata oluştu.");
      setSubmitted(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="yorumlar" className="max-w-6xl mx-auto px-4 lg:px-10 py-12 lg:py-16 border-t border-sand">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <p className="font-label text-gold text-[0.6rem] mb-2">— Değerlendirmeler</p>
          <div className="flex items-center gap-3">
            {reviewCount > 0 ? (
              <>
                <StarRating value={averageRating} readOnly size={18} />
                <span className="font-serif text-brown text-xl" style={{ fontStyle: "italic" }}>
                  {averageRating.toFixed(1)}
                </span>
                <span className="font-label text-[#888480] text-[0.6rem]">
                  ({reviewCount} değerlendirme)
                </span>
              </>
            ) : (
              <span className="font-label text-[#888480] text-[0.6rem]">Henüz değerlendirme yok</span>
            )}
          </div>
        </div>
        {!formOpen && !submitted && (
          <button
            onClick={() => setFormOpen(true)}
            className="flex items-center gap-2 border border-brown text-brown font-label text-[0.6rem] px-5 py-3 hover:bg-brown hover:text-cream transition-colors duration-300"
          >
            <MessageSquare size={13} /> Yorum Yaz
          </button>
        )}
      </div>

      {formOpen && !submitted && (
        <form onSubmit={handleSubmit} className="border border-sand p-6 mb-8 space-y-5 max-w-xl">
          <div>
            <label className="font-label text-[#888480] text-[0.55rem] block mb-2">Puanınız</label>
            <StarRating value={rating} onChange={setRating} size={22} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="font-label text-[#888480] text-[0.55rem] block mb-2">Ad Soyad</label>
              <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full input-underline py-2.5 text-[#1a1a1a] text-sm" />
            </div>
            <div>
              <label className="font-label text-[#888480] text-[0.55rem] block mb-2">E-posta</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full input-underline py-2.5 text-[#1a1a1a] text-sm" />
              <p className="text-[#888480] text-[0.65rem] font-light mt-1">Yayınlanmaz, yalnızca bizim içindir.</p>
            </div>
          </div>
          <div>
            <label className="font-label text-[#888480] text-[0.55rem] block mb-2">Yorumunuz</label>
            <textarea required rows={4} value={comment} onChange={(e) => setComment(e.target.value)} className="w-full input-underline py-2.5 text-[#1a1a1a] text-sm resize-none" placeholder="Bu eseri nasıl buldunuz?" />
          </div>
          <div>
            <label className="font-label text-[#888480] text-[0.55rem] block mb-2">Fotoğraf (opsiyonel, en fazla 3)</label>
            <div className="flex items-center gap-2 flex-wrap">
              {images.map((url) => (
                <div key={url} className="relative w-16 h-16">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="w-full h-full object-cover border border-sand" />
                  <button
                    type="button"
                    onClick={() => setImages((p) => p.filter((u) => u !== url))}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-brown text-cream rounded-full flex items-center justify-center"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
              {images.length < 3 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-16 h-16 border border-dashed border-sand flex items-center justify-center text-[#888480] hover:border-brown/40 transition-colors disabled:opacity-50"
                >
                  {uploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                </button>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting || uploading}
              className="flex-1 bg-brown text-cream font-label py-3.5 text-[0.65rem] hover:bg-brown-light transition-colors duration-300 disabled:opacity-60"
            >
              {submitting ? "Gönderiliyor..." : "Yorumu Gönder"}
            </button>
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="font-label text-[#888480] text-[0.6rem] px-4 hover:text-brown transition-colors"
            >
              Vazgeç
            </button>
          </div>
        </form>
      )}

      {submitted && (
        <div className="border border-green-200 bg-green-50 p-6 mb-8 max-w-xl">
          <p className="font-label text-green-700 text-[0.65rem] mb-1">Teşekkürler!</p>
          <p className="text-green-700/80 text-sm font-light">
            Yorumunuz alındı. İncelendikten sonra bu sayfada yayınlanacak.
          </p>
        </div>
      )}

      {reviews.length === 0 ? (
        <p className="text-[#888480] font-light text-sm">
          Bu eser için henüz bir değerlendirme yok — ilk yorumu siz yazın.
        </p>
      ) : (
        <div className="space-y-6 max-w-3xl">
          {reviews.map((r) => (
            <div key={r.id} className="border-b border-sand pb-6 last:border-0">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <StarRating value={r.rating} readOnly size={13} />
                <span className="font-label text-[#1a1a1a] text-[0.65rem]">{r.customer_name}</span>
                <span className="font-label text-[#888480] text-[0.55rem]">
                  {new Date(r.created_at).toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" })}
                </span>
              </div>
              <p className="text-[#1a1a1a] font-light text-sm leading-relaxed">{r.comment}</p>
              {r.images.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {r.images.map((url) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={url} src={url} alt="" className="w-20 h-20 object-cover border border-sand" />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
