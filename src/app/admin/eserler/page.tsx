"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import Link from "next/link";

const mockEserler = [
  { id: "1", slug: "sonbahar-koleksiyonu", title: "Sonbahar Koleksiyonu", category: "ozel", price: 4800, featured: true, active: true },
  { id: "2", slug: "beyaz-peonies", title: "Beyaz Peonies", category: "ev", price: 2400, featured: false, active: true },
  { id: "3", slug: "altin-nisan", title: "Altın Nisan", category: "magaza", price: 3600, featured: false, active: true },
  { id: "4", slug: "ofis-serisi", title: "Ofis Serisi", category: "ofis", price: 1800, featured: false, active: false },
  { id: "5", slug: "bahar-esintisi", title: "Bahar Esintisi", category: "ev", price: 2100, featured: true, active: true },
  { id: "6", slug: "lila-romansi", title: "Lila Romansi", category: "ozel", price: 5200, featured: false, active: true },
];

const categoryLabels: Record<string, string> = {
  ev: "Ev", magaza: "Mağaza", ofis: "Ofis", ozel: "Özel Sipariş",
};

export default function AdminEserlerPage() {
  const [eserler, setEserler] = useState(mockEserler);

  const toggleActive = (id: string) => {
    setEserler((p) => p.map((e) => e.id === id ? { ...e, active: !e.active } : e));
  };

  const deleteEser = (id: string) => {
    if (confirm("Bu eseri silmek istediğinize emin misiniz?")) {
      setEserler((p) => p.filter((e) => e.id !== id));
    }
  };

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-label text-[#888480] text-[0.6rem] mb-1">Yönetim</p>
          <h1 className="font-serif text-[#1a1a1a] text-3xl" style={{ fontStyle: "italic" }}>
            Eserler
          </h1>
        </div>
        <button className="inline-flex items-center gap-2 bg-brown text-white font-label px-5 py-3 hover:bg-brown-light transition-colors duration-200">
          <Plus size={14} />
          Yeni Eser
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-sand overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-sand bg-cream-dark">
                <th className="text-left px-5 py-3.5 font-label text-[#888480] text-[0.6rem]">Eser</th>
                <th className="text-left px-5 py-3.5 font-label text-[#888480] text-[0.6rem]">Kategori</th>
                <th className="text-left px-5 py-3.5 font-label text-[#888480] text-[0.6rem]">Fiyat</th>
                <th className="text-left px-5 py-3.5 font-label text-[#888480] text-[0.6rem]">Öne Çıkan</th>
                <th className="text-left px-5 py-3.5 font-label text-[#888480] text-[0.6rem]">Durum</th>
                <th className="text-right px-5 py-3.5 font-label text-[#888480] text-[0.6rem]">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand">
              {eserler.map((eser) => (
                <tr key={eser.id} className="hover:bg-sand-light/50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-label text-[#1a1a1a] text-[0.65rem]">{eser.title}</p>
                    <p className="font-label text-[#888480] text-[0.55rem]">/{eser.slug}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-label text-[0.55rem] border border-sand px-2.5 py-1 text-[#888480]">
                      {categoryLabels[eser.category]}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-serif text-[#1a1a1a] text-base" style={{ fontStyle: "italic" }}>
                      ₺{eser.price.toLocaleString("tr-TR")}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`font-label text-[0.55rem] px-2.5 py-1 ${eser.featured ? "bg-gold/10 text-gold-dark" : "text-[#888480]"}`}>
                      {eser.featured ? "Evet" : "—"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => toggleActive(eser.id)}
                      className={`font-label text-[0.55rem] px-2.5 py-1 transition-colors ${
                        eser.active
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {eser.active ? "Aktif" : "Pasif"}
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
                      <button className="p-1.5 text-[#888480] hover:text-brown transition-colors" title="Düzenle">
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => deleteEser(eser.id)}
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

      <p className="font-label text-[#888480] text-[0.55rem] mt-4">
        Toplam {eserler.length} eser · Supabase bağlantısı eklendiğinde veriler buraya yüklenecek.
      </p>
    </div>
  );
}
