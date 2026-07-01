"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Eye, X, Check, ToggleLeft, ToggleRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { categoryLabels, toSlug } from "@/data/products";
import type { ProductCategory } from "@/data/products";

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

const emptyForm = {
  title: "",
  slug: "",
  category: "ev" as ProductCategory,
  price: "",
  description: "",
  dimensions: "",
  materials: "",
  is_available: true,
  is_featured: false,
};

export default function AdminEserlerPage() {
  const [eserler, setEserler] = useState<EserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<EserRow | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

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

  useEffect(() => { fetchEserler(); }, [fetchEserler]);

  const openAdd = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (eser: EserRow) => {
    setEditTarget(eser);
    setForm({
      title: eser.title,
      slug: eser.slug,
      category: eser.category as ProductCategory,
      price: eser.price?.toString() ?? "",
      description: eser.description ?? "",
      dimensions: eser.dimensions ?? "",
      materials: eser.materials ?? "",
      is_available: eser.is_available,
      is_featured: eser.is_featured,
    });
    setModalOpen(true);
  };

  const handleTitleChange = (title: string) => {
    setForm((f) => ({ ...f, title, slug: editTarget ? f.slug : toSlug(title) }));
  };

  const saveEser = async () => {
    if (!form.title || !form.slug || !form.category) {
      toast.error("Başlık, slug ve kategori zorunludur.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        slug: form.slug,
        category: form.category,
        price: form.price ? parseFloat(form.price) : null,
        description: form.description || null,
        dimensions: form.dimensions || null,
        materials: form.materials || null,
        is_available: form.is_available,
        is_featured: form.is_featured,
      };

      const url = editTarget ? `/api/admin/products/${editTarget.id}` : "/api/admin/products";
      const method = editTarget ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Hata");
      }
      toast.success(editTarget ? "Eser güncellendi." : "Eser eklendi.");
      setModalOpen(false);
      fetchEserler();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

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
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-label text-[#888480] text-[0.6rem] mb-1">Yönetim</p>
          <h1 className="font-serif text-[#1a1a1a] text-3xl" style={{ fontStyle: "italic" }}>
            Eserler
          </h1>
        </div>
        <Link
          href="/admin/eserler/yeni"
          className="inline-flex items-center gap-2 bg-brown text-white font-label px-5 py-3 hover:bg-brown-light transition-colors duration-200"
        >
          <Plus size={14} />
          Yeni Eser
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center font-label text-[#888480] text-[0.65rem]">Yükleniyor…</div>
      ) : eserler.length === 0 ? (
        <div className="py-20 text-center">
          <p className="font-serif text-brown/40 text-xl mb-4" style={{ fontStyle: "italic" }}>
            Henüz eser eklenmedi.
          </p>
          <button onClick={openAdd} className="font-label text-gold text-[0.6rem] hover:text-brown transition-colors">
            İlk eseri ekle →
          </button>
        </div>
      ) : (
        <div className="bg-white border border-sand overflow-hidden">
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
                        {categoryLabels[eser.category as ProductCategory] ?? eser.category}
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
      )}

      <p className="font-label text-[#888480] text-[0.55rem] mt-4">
        Toplam {eserler.length} eser
      </p>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-sand">
              <h2 className="font-label text-[#1a1a1a] text-[0.7rem]">
                {editTarget ? "Eseri Düzenle" : "Yeni Eser Ekle"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-[#888480] hover:text-brown transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="font-label text-[#888480] text-[0.55rem] block mb-2">
                  Başlık <span className="text-gold">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full input-underline py-2.5 text-[#1a1a1a] text-sm"
                  placeholder="Sonbahar Koleksiyonu"
                  autoFocus
                />
              </div>

              <div>
                <label className="font-label text-[#888480] text-[0.55rem] block mb-2">
                  Slug <span className="text-gold">*</span>
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  className="w-full input-underline py-2.5 text-[#1a1a1a] text-sm"
                  placeholder="sonbahar-koleksiyonu"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-label text-[#888480] text-[0.55rem] block mb-2">
                    Kategori <span className="text-gold">*</span>
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as ProductCategory }))}
                    className="w-full input-underline py-2.5 text-[#1a1a1a] text-sm bg-transparent"
                  >
                    <option value="ev">Ev & Yaşam</option>
                    <option value="magaza">Mağaza</option>
                    <option value="ofis">Ofis</option>
                    <option value="ozel">Özel Sipariş</option>
                  </select>
                </div>
                <div>
                  <label className="font-label text-[#888480] text-[0.55rem] block mb-2">Fiyat (₺)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    className="w-full input-underline py-2.5 text-[#1a1a1a] text-sm"
                    placeholder="2400"
                  />
                </div>
              </div>

              <div>
                <label className="font-label text-[#888480] text-[0.55rem] block mb-2">Açıklama</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full input-underline py-2.5 text-[#1a1a1a] text-sm resize-none"
                  rows={3}
                  placeholder="Eser açıklaması…"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-label text-[#888480] text-[0.55rem] block mb-2">Boyutlar</label>
                  <input
                    type="text"
                    value={form.dimensions}
                    onChange={(e) => setForm((f) => ({ ...f, dimensions: e.target.value }))}
                    className="w-full input-underline py-2.5 text-[#1a1a1a] text-sm"
                    placeholder="50×70 cm"
                  />
                </div>
                <div>
                  <label className="font-label text-[#888480] text-[0.55rem] block mb-2">Malzeme</label>
                  <input
                    type="text"
                    value={form.materials}
                    onChange={(e) => setForm((f) => ({ ...f, materials: e.target.value }))}
                    className="w-full input-underline py-2.5 text-[#1a1a1a] text-sm"
                    placeholder="Kurutulmuş çiçekler"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, is_available: !f.is_available }))}
                    className={`w-10 h-5 rounded-full transition-colors relative ${form.is_available ? "bg-green-500" : "bg-gray-200"}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.is_available ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                  <span className="font-label text-[#888480] text-[0.6rem]">Aktif (Satışta)</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, is_featured: !f.is_featured }))}
                    className={`w-10 h-5 rounded-full transition-colors relative ${form.is_featured ? "bg-gold" : "bg-gray-200"}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.is_featured ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                  <span className="font-label text-[#888480] text-[0.6rem]">Öne Çıkan</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2 border-t border-sand">
                <button
                  onClick={() => setModalOpen(false)}
                  className="flex-1 border border-sand font-label text-[#888480] text-[0.6rem] py-3 hover:border-brown/40 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={saveEser}
                  disabled={saving || !form.title || !form.slug}
                  className="flex-1 bg-brown text-cream font-label text-[0.6rem] py-3 hover:bg-brown-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    "Kaydediliyor…"
                  ) : (
                    <><Check size={12} /> {editTarget ? "Güncelle" : "Ekle"}</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
