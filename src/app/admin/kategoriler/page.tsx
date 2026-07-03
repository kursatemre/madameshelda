"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, RefreshCw, Tag } from "lucide-react";
import { toast } from "sonner";

type Category = { id: string; name: string; slug: string; sort_order: number };

function toSlug(str: string) {
  return str
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function KategorilerPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      if (res.ok) setCategories(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const handleNameChange = (v: string) => {
    setNewName(v);
    setNewSlug(toSlug(v));
  };

  const handleAdd = async () => {
    if (!newName.trim() || !newSlug.trim()) {
      toast.error("Ad zorunludur.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), slug: newSlug.trim(), sort_order: categories.length }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      const created = await res.json();
      setCategories((c) => [...c, created]);
      setNewName("");
      setNewSlug("");
      toast.success("Kategori eklendi.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" kategorisini silmek istediğinizden emin misiniz?`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error);
      setCategories((c) => c.filter((cat) => cat.id !== id));
      toast.success("Kategori silindi.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Hata oluştu.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="font-label text-[#888480] text-[0.6rem] mb-1">Yönetim</p>
          <h1 className="font-serif text-[#1a1a1a] text-3xl" style={{ fontStyle: "italic" }}>
            Kategoriler
          </h1>
        </div>
        <button
          onClick={fetchCategories}
          className="p-2 text-[#888480] hover:text-brown transition-colors"
          title="Yenile"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Yeni kategori formu */}
      <div className="bg-white border border-sand p-6 mb-6">
        <h2 className="font-label text-[0.6rem] text-[#888480] mb-5 pb-3 border-b border-sand uppercase tracking-widest">
          Yeni Kategori Ekle
        </h2>
        <div className="space-y-4">
          <div>
            <label className="font-label text-[#888480] text-[0.55rem] block mb-2">
              Kategori Adı <span className="text-gold">*</span>
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => handleNameChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="w-full input-underline py-2.5 text-[#1a1a1a]"
              placeholder="Ev & Yaşam"
            />
          </div>
          <div>
            <label className="font-label text-[#888480] text-[0.55rem] block mb-2">
              URL (Slug) <span className="text-[#888480] normal-case ml-1">— otomatik oluşturulur</span>
            </label>
            <input
              type="text"
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
              className="w-full input-underline py-2.5 text-[#888480] font-mono text-sm"
              placeholder="ev-yasam"
            />
          </div>
          <button
            onClick={handleAdd}
            disabled={saving || !newName.trim()}
            className="flex items-center gap-2 bg-brown text-cream font-label text-[0.6rem] px-6 py-2.5 hover:bg-brown-light transition-colors disabled:opacity-50"
          >
            <Plus size={12} />
            {saving ? "Ekleniyor…" : "Kategori Ekle"}
          </button>
        </div>
      </div>

      {/* Mevcut kategoriler */}
      <div className="bg-white border border-sand">
        <div className="px-6 py-4 border-b border-sand">
          <h2 className="font-label text-[0.6rem] text-[#888480] uppercase tracking-widest">
            Mevcut Kategoriler ({categories.length})
          </h2>
        </div>

        {loading ? (
          <div className="py-12 text-center font-label text-[#888480] text-[0.6rem]">Yükleniyor…</div>
        ) : categories.length === 0 ? (
          <div className="py-12 flex flex-col items-center gap-3 text-center">
            <Tag size={24} className="text-sand-dark" />
            <p className="font-label text-[#888480] text-[0.6rem]">Henüz kategori eklenmedi.</p>
          </div>
        ) : (
          <div className="divide-y divide-sand">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center gap-4 px-6 py-4">
                <div className="flex-1 min-w-0">
                  <p className="font-label text-[#1a1a1a] text-[0.65rem]">{cat.name}</p>
                  <p className="font-label text-[#888480] text-[0.55rem] mt-0.5 font-mono">{cat.slug}</p>
                </div>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  disabled={deletingId === cat.id}
                  className="p-2 text-[#888480] hover:text-red-500 transition-colors disabled:opacity-40"
                  title="Sil"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="font-label text-[#888480] text-[0.5rem] mt-4 text-center">
        Kategori adı ürünlerde olduğu gibi görüntülenir. Silmeden önce bu kategorideki ürünleri güncelleyin.
      </p>
    </div>
  );
}
