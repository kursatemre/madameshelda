"use client";

import { useState } from "react";
import { Plus, Trash2, Image as ImageIcon, X } from "lucide-react";

type WorkshopImage = {
  id: string;
  url: string;
  caption: string;
};

const defaultImages: WorkshopImage[] = [
  { id: "1", url: "https://images.unsplash.com/photo-1487530811015-780adza5a8c9?w=600", caption: "Atölye ortamı" },
  { id: "2", url: "https://images.unsplash.com/photo-1490750967868-88df5691166a?w=600", caption: "Workshop anı" },
];

export default function AdminWorkshoplarPage() {
  const [images, setImages] = useState<WorkshopImage[]>(defaultImages);
  const [modalOpen, setModalOpen] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newCaption, setNewCaption] = useState("");

  const addImage = () => {
    if (!newUrl.trim()) return;
    setImages((p) => [
      ...p,
      { id: Date.now().toString(), url: newUrl.trim(), caption: newCaption.trim() },
    ]);
    setNewUrl("");
    setNewCaption("");
    setModalOpen(false);
  };

  const deleteImage = (id: string) => {
    if (confirm("Bu görseli silmek istediğinize emin misiniz?")) {
      setImages((p) => p.filter((img) => img.id !== id));
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

      {images.length === 0 ? (
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
                <img
                  src={img.url}
                  alt={img.caption}
                  className="w-full h-full object-cover"
                />
              </div>
              {img.caption && (
                <p className="font-label text-[#888480] text-[0.55rem] mt-1.5 truncate">
                  {img.caption}
                </p>
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
                <label className="font-label text-[#888480] text-[0.55rem] block mb-2">
                  Açıklama (opsiyonel)
                </label>
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
                  disabled={!newUrl.trim()}
                  className="flex-1 bg-brown text-cream font-label text-[0.6rem] py-3 hover:bg-brown-light transition-colors disabled:opacity-50"
                >
                  Ekle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
