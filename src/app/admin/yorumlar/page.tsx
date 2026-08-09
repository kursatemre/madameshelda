"use client";

import { useState, useEffect, useCallback } from "react";
import { CheckCircle, Trash2, RefreshCw, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { StarRating } from "@/components/shared/StarRating";

interface Review {
  id: string;
  customer_name: string;
  email: string;
  rating: number;
  comment: string;
  images: string[];
  is_approved: boolean;
  created_at: string;
  products: { title: string; slug: string } | null;
}

export default function AdminYorumlarPage() {
  const [tab, setTab] = useState<"pending" | "approved">("pending");
  const [data, setData] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reviews");
      if (res.ok) setData(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const approve = async (id: string) => {
    const res = await fetch("/api/admin/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_approved: true }),
    });
    if (!res.ok) return toast.error("Onaylanamadı.");
    setData((p) => p.map((r) => (r.id === id ? { ...r, is_approved: true } : r)));
    toast.success("Yorum onaylandı.");
  };

  const remove = async (id: string) => {
    if (!confirm("Bu yorumu silmek istediğinize emin misiniz?")) return;
    const res = await fetch(`/api/admin/reviews?id=${id}`, { method: "DELETE" });
    if (!res.ok) return toast.error("Silinemedi.");
    setData((p) => p.filter((r) => r.id !== id));
    toast.success("Yorum silindi.");
  };

  const filtered = data.filter((r) => (tab === "pending" ? !r.is_approved : r.is_approved));

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
      <div className="flex items-start justify-between mb-6 lg:mb-8 gap-3">
        <div>
          <p className="font-label text-[#888480] text-[0.6rem] mb-1">Yönetim</p>
          <h1 className="font-serif text-[#1a1a1a] text-2xl sm:text-3xl" style={{ fontStyle: "italic" }}>
            Yorumlar
          </h1>
        </div>
        <button onClick={fetchData} className="p-2 text-[#888480] hover:text-brown transition-colors" title="Yenile">
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="flex gap-1 mb-6 border-b border-sand overflow-x-auto">
        {(["pending", "approved"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`font-label text-[0.65rem] px-3 sm:px-5 py-3 transition-colors duration-200 -mb-px border-b-2 whitespace-nowrap shrink-0 ${
              tab === t ? "border-brown text-brown" : "border-transparent text-[#888480] hover:text-[#1a1a1a]"
            }`}
          >
            {t === "pending"
              ? `Bekleyen (${data.filter((r) => !r.is_approved).length})`
              : `Onaylı (${data.filter((r) => r.is_approved).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-16 text-center font-label text-[#888480] text-[0.6rem]">Yükleniyor...</div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center">
          <MessageSquare size={24} className="mx-auto text-[#c9c4bd] mb-3" />
          <p className="font-label text-[#888480] text-[0.6rem]">
            {tab === "pending" ? "Bekleyen yorum yok." : "Onaylı yorum yok."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div key={r.id} className="bg-white border border-sand p-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <span className="font-label text-brown text-[0.65rem]">{r.products?.title ?? "Ürün silinmiş"}</span>
                    <StarRating value={r.rating} readOnly size={13} />
                    <span className="font-label text-[#888480] text-[0.55rem]">
                      {new Date(r.created_at).toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" })}
                    </span>
                  </div>
                  <p className="font-label text-[#1a1a1a] text-[0.7rem] mb-1">{r.customer_name}</p>
                  <p className="text-[#888480] text-xs font-light mb-2">{r.email}</p>
                  <p className="text-[#1a1a1a] text-sm font-light leading-relaxed">{r.comment}</p>
                  {r.images.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {r.images.map((url) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={url} src={url} alt="" className="w-16 h-16 object-cover border border-sand" />
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex sm:flex-col gap-2 shrink-0">
                  {!r.is_approved && (
                    <button
                      onClick={() => approve(r.id)}
                      className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 font-label text-[0.6rem] px-3 py-2 hover:bg-green-100 transition-colors"
                    >
                      <CheckCircle size={12} /> Onayla
                    </button>
                  )}
                  <button
                    onClick={() => remove(r.id)}
                    className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 font-label text-[0.6rem] px-3 py-2 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={12} /> Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
