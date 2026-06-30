"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Image as ImageIcon, X } from "lucide-react";
import { toast } from "sonner";

type WorkshopImage = {
  id: string;
  url: string;
  caption: string;
  sort_order: number;
};

export default function AdminWorkshoplarPage() {
  const [images, setImages] = useState<WorkshopImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newCaption, setNewCaption] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/workshop-images");
      if (!res.ok) throw new Error();
      setImages(await res.json());
    } catch {
      toast.error("Görseller yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  const addImage = async () => {
    if (!newUrl.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/workshop-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: newUrl.trim(), caption: newCaption.trim(), sort_order: images.length }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Hata");
      }
      const added = await res.json();
      setImages((p) => [...p, added]);
      setNewUrl("");
      setNewCaption("");
      setModalOpen(false);
      toast.success("Görsel eklendi.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Görsel eklenemedi.");
    } finally {
      setSaving(false);
    }
  };

  const deleteImage = async (id: string) => {
    if (!confirm("Bu görseli silmek istediğinize emin misiniz?")) return;
    setImages((p) => p.filter((img) => img.id !== id));
    try {
      const res = await fetch("/api/admin/workshop-images", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error();
      toast.success("Görsel silindi.");
    } catch {
      toast.error("Silme başarısız.");
      fetchImages();
    }
  };

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-label text-[#888480] text-[0.6rem] mb-1">Yönetim</p>
          <h1 className="font-serif text-[#1a1a1a] text-3xl" style={{ fontStyle: "italic" }}>
            Workshop Görselleri
          </h1>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 bg-brown text-white font-label px-5 py-3 hover:bg-brown-light transition-colors duration-200"
        >
          <Plus size={14} />
          Görsel Ekle
        </button>
      </div>

      <p className="font-label text-[#888480] text-[0.6rem] mb-6">
        Bu görseller workshop sayfalarında atölye atmosferini yansıtır.
      </p>

      {loading ? (
        <div className="py-20 text-center font-label text-[#888480] text-[0.65rem]">Yükleniyor…</div>
      ) : images.length === 0 ? (
        <div className="border border-dashed border-sand py-20 flex flex-col items-center gap-4 text-center">
          <ImageIcon size={32} className="text-sand-dark" />
          <p className="font-label text-[#888480] text-[0.65rem]">Henüz görsel eklenmedi.</p>
          <button
            onClick={() => setModalOpen(true)}
            className="font-label text-gold text-[0.6rem] hover:text-brown transition-colors"
          >
            İlk görseli ekle →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className="group relative">
              <div className="aspect-square bg-sand overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
              </div>
              {img.caption && (
                <p className="font-label text-[#888480] text-[0.55rem] mt-1.5 truncate">{img.caption}</p>
              )}
              <button
                onClick={() => deleteImage(img.id)}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={11} />
              </button>
            </div>
          ))}

          <button
            onClick={() => setModalOpen(true)}
            className="aspect-square border border-dashed border-sand flex flex-col items-center justify-center gap-2 hover:border-brown/40 transition-colors"
          >
            <Plus size={20} className="text-[#888480]" />
            <span className="font-label text-[#888480] text-[0.55rem]">Ekle</span>
          </button>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-label text-[#1a1a1a] text-[0.7rem]">Görsel Ekle</h2>
              <button onClick={() => setModalOpen(false)} className="text-[#888480] hover:text-brown transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="font-label text-[#888480] text-[0.55rem] block mb-2">
                  Görsel URL <span className="text-gold">*</span>
                </label>
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full input-underline py-2.5 text-[#1a1a1a] text-sm"
                  placeholder="https://..."
                  autoFocus
                />
              </div>
              <div>
                <label className="font-label text-[#888480] text-[0.55rem] block mb-2">Açıklama (opsiyonel)</label>
                <input
                  type="text"
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  className="w-full input-underline py-2.5 text-[#1a1a1a] text-sm"
                  placeholder="Atölye ortamı..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setModalOpen(false)}
                  className="flex-1 border border-sand font-label text-[#888480] text-[0.6rem] py-3 hover:border-brown/40 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={addImage}
                  disabled={!newUrl.trim() || saving}
                  className="flex-1 bg-brown text-cream font-label text-[0.6rem] py-3 hover:bg-brown-light transition-colors disabled:opacity-50"
                >
                  {saving ? "Ekleniyor…" : "Ekle"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
