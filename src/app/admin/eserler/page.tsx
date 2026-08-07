"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Eye, ToggleLeft, ToggleRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

type EserRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  price: number | null;
  description: string | null;
  dimensions: string | null;
  materials: string | null;
  is_available: boolean;
  is_featured: boolean;
  created_at: string;
};

export default function AdminEserlerPage() {
  const [eserler, setEserler] = useState<EserRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEserler = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      if (!res.ok) throw new Error();
      setEserler(await res.json());
    } catch {
      toast.error("Eserler yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEserler();
  }, [fetchEserler]);

  const toggleField = async (id: string, field: "is_available" | "is_featured", current: boolean) => {
    setEserler((prev) => prev.map((e) => e.id === id ? { ...e, [field]: !current } : e));
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !current }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setEserler((prev) => prev.map((e) => e.id === id ? { ...e, [field]: current } : e));
      toast.error("Güncelleme başarısız.");
    }
  };

  const deleteEser = async (id: string, title: string) => {
    if (!confirm(`"${title}" silinsin mi? Bu işlem geri alınamaz.`)) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Eser silindi.");
      setEserler((prev) => prev.filter((e) => e.id !== id));
    } catch {
      toast.error("Silme başarısız.");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6 lg:mb-8 gap-3">
        <div>
          <p className="font-label text-[#888480] text-[0.6rem] mb-1">Yönetim</p>
          <h1 className="font-serif text-[#1a1a1a] text-2xl sm:text-3xl" style={{ fontStyle: "italic" }}>
            Eserler
          </h1>
        </div>
        <Link
          href="/admin/eserler/yeni"
          className="inline-flex items-center gap-2 bg-brown text-white font-label px-4 sm:px-5 py-3 hover:bg-brown-light transition-colors duration-200 shrink-0"
        >
          <Plus size={14} />
          <span className="hidden sm:inline">Yeni Eser</span>
          <span className="sm:hidden">Ekle</span>
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center font-label text-[#888480] text-[0.65rem]">Yükleniyor…</div>
      ) : eserler.length === 0 ? (
        <div className="py-20 text-center">
          <p className="font-serif text-brown/40 text-xl mb-4" style={{ fontStyle: "italic" }}>
            Henüz eser eklenmedi.
          </p>
          <Link href="/admin/eserler/yeni" className="font-label text-gold text-[0.6rem] hover:text-brown transition-colors">
            İlk eseri ekle →
          </Link>
        </div>
      ) : (
        <>
          {/* Mobil — kart listesi (sm altı) */}
          <div className="sm:hidden space-y-3">
            {eserler.map((eser) => (
              <div key={eser.id} className="bg-white border border-sand p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <p className="font-label text-[#1a1a1a] text-[0.65rem] truncate">{eser.title}</p>
                    <p className="font-label text-[#888480] text-[0.55rem] mt-0.5">/{eser.slug}</p>
                  </div>
                  <span className="font-serif text-brown text-base shrink-0" style={{ fontStyle: "italic" }}>
                    {eser.price != null ? `₺${eser.price.toLocaleString("tr-TR")}` : "—"}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <span className="font-label text-[0.5rem] border border-sand px-2 py-1 text-[#888480]">
                    {eser.category || "—"}
                  </span>
                  <button
                    onClick={() => toggleField(eser.id, "is_available", eser.is_available)}
                    className={`font-label text-[0.5rem] px-2 py-1 transition-colors ${
                      eser.is_available ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
                    }`}
                  >
                    {eser.is_available ? "Aktif" : "Tükendi"}
                  </button>
                  <button
                    onClick={() => toggleField(eser.id, "is_featured", eser.is_featured)}
                    className="inline-flex items-center gap-1 font-label text-[0.5rem] px-2 py-1 border border-sand text-[#888480] transition-colors"
                  >
                    {eser.is_featured
                      ? <ToggleRight size={13} className="text-gold" />
                      : <ToggleLeft size={13} />
                    }
                    Öne Çıkan
                  </button>
                </div>
                <div className="flex items-center justify-end gap-1 pt-2 border-t border-sand">
                  <Link href={`/eser/${eser.slug}`} target="_blank" className="p-2.5 text-[#888480] hover:text-brown transition-colors" title="Önizle">
                    <Eye size={16} />
                  </Link>
                  <Link href={`/admin/eserler/${eser.id}/duzenle`} className="p-2.5 text-[#888480] hover:text-brown transition-colors" title="Düzenle">
                    <Pencil size={16} />
                  </Link>
                  <button onClick={() => deleteEser(eser.id, eser.title)} className="p-2.5 text-[#888480] hover:text-red-500 transition-colors" title="Sil">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Masaüstü — tablo (sm ve üstü) */}
          <div className="hidden sm:block bg-white border border-sand overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-sand bg-cream-dark">
                    <th className="text-left px-5 py-3.5 font-label text-[#888480] text-[0.6rem]">Eser</th>
                    <th className="text-left px-5 py-3.5 font-label text-[#888480] text-[0.6rem]">Kategori</th>
                    <th className="text-left px-5 py-3.5 font-label text-[#888480] text-[0.6rem]">Fiyat</th>
                    <th className="text-center px-5 py-3.5 font-label text-[#888480] text-[0.6rem]">Öne Çıkan</th>
                    <th className="text-center px-5 py-3.5 font-label text-[#888480] text-[0.6rem]">Durum</th>
                    <th className="text-right px-5 py-3.5 font-label text-[#888480] text-[0.6rem]">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand">
                  {eserler.map((eser) => (
                    <tr key={eser.id} className="hover:bg-sand-light/30 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-label text-[#1a1a1a] text-[0.65rem]">{eser.title}</p>
                        <p className="font-label text-[#888480] text-[0.55rem]">/{eser.slug}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-label text-[0.55rem] border border-sand px-2.5 py-1 text-[#888480]">
                          {eser.category || "—"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-serif text-[#1a1a1a] text-base" style={{ fontStyle: "italic" }}>
                          {eser.price != null ? `₺${eser.price.toLocaleString("tr-TR")}` : "—"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => toggleField(eser.id, "is_featured", eser.is_featured)}
                          className="inline-flex items-center justify-center text-[#888480] hover:text-gold transition-colors"
                          title={eser.is_featured ? "Öne çıkarmayı kaldır" : "Öne çıkar"}
                        >
                          {eser.is_featured
                            ? <ToggleRight size={20} className="text-gold" />
                            : <ToggleLeft size={20} />
                          }
                        </button>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => toggleField(eser.id, "is_available", eser.is_available)}
                          className={`font-label text-[0.55rem] px-2.5 py-1 transition-colors ${
                            eser.is_available ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
                          }`}
                        >
                          {eser.is_available ? "Aktif" : "Tükendi"}
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/eser/${eser.slug}`}
                            target="_blank"
                            className="p-1.5 text-[#888480] hover:text-brown transition-colors"
                            title="Önizle"
                          >
                            <Eye size={14} />
                          </Link>
                          <Link
                            href={`/admin/eserler/${eser.id}/duzenle`}
                            className="p-1.5 text-[#888480] hover:text-brown transition-colors"
                            title="Düzenle"
                          >
                            <Pencil size={14} />
                          </Link>
                          <button
                            onClick={() => deleteEser(eser.id, eser.title)}
                            className="p-1.5 text-[#888480] hover:text-red-500 transition-colors"
                            title="Sil"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <p className="font-label text-[#888480] text-[0.55rem] mt-4">
        Toplam {eserler.length} eser
      </p>
    </div>
  );
}
