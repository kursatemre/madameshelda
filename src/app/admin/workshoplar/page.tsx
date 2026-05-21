"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Users } from "lucide-react";

const mockWorkshops = [
  { id: "1", slug: "baslangic-cicek-sanati", title: "Başlangıç Çiçek Sanatı", date: "14 Haz 2025", duration: 3, capacity: 8, filled: 5, price: 1200, level: "Başlangıç", active: true },
  { id: "2", slug: "dev-cicek-duzenlemeleri", title: "Dev Çiçek Düzenlemeleri", date: "21 Haz 2025", duration: 4, capacity: 6, filled: 6, price: 1800, level: "Orta", active: true },
  { id: "3", slug: "dogal-boyama-teknikleri", title: "Doğal Boyama Teknikleri", date: "5 Tem 2025", duration: 5, capacity: 6, filled: 2, price: 2400, level: "İleri", active: true },
  { id: "4", slug: "yaz-cicekleri", title: "Yaz Çiçekleri Koleksiyonu", date: "19 Tem 2025", duration: 3, capacity: 10, filled: 3, price: 1200, level: "Başlangıç", active: false },
];

export default function AdminWorkshoplarPage() {
  const [workshops, setWorkshops] = useState(mockWorkshops);

  const toggleActive = (id: string) => {
    setWorkshops((p) => p.map((w) => w.id === id ? { ...w, active: !w.active } : w));
  };

  const deleteWorkshop = (id: string) => {
    if (confirm("Bu workshopu silmek istediğinize emin misiniz?")) {
      setWorkshops((p) => p.filter((w) => w.id !== id));
    }
  };

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-label text-[#888480] text-[0.6rem] mb-1">Yönetim</p>
          <h1 className="font-serif text-[#1a1a1a] text-3xl" style={{ fontStyle: "italic" }}>
            Workshoplar
          </h1>
        </div>
        <button className="inline-flex items-center gap-2 bg-brown text-white font-label px-5 py-3 hover:bg-brown-light transition-colors duration-200">
          <Plus size={14} />
          Yeni Workshop
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {workshops.map((ws) => {
          const fillPct = Math.round((ws.filled / ws.capacity) * 100);
          const isFull = ws.filled >= ws.capacity;

          return (
            <div key={ws.id} className="bg-white border border-sand p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1.5">
                  <h3 className="font-label text-[#1a1a1a] text-[0.7rem]">{ws.title}</h3>
                  <span className="font-label text-[0.55rem] border border-sand px-2 py-0.5 text-[#888480]">
                    {ws.level}
                  </span>
                  {!ws.active && (
                    <span className="font-label text-[0.55rem] bg-red-50 text-red-500 px-2 py-0.5">Pasif</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-4 text-[#888480]">
                  <span className="font-label text-[0.6rem]">{ws.date}</span>
                  <span className="font-label text-[0.6rem]">{ws.duration} saat</span>
                  <span className="font-label text-[0.6rem]">
                    ₺{ws.price.toLocaleString("tr-TR")}
                  </span>
                </div>
              </div>

              {/* Capacity */}
              <div className="w-36 shrink-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-label text-[#888480] text-[0.55rem] flex items-center gap-1">
                    <Users size={11} /> {ws.filled}/{ws.capacity}
                  </span>
                  <span className={`font-label text-[0.55rem] ${isFull ? "text-red-500" : "text-green-600"}`}>
                    {isFull ? "Doldu" : `${ws.capacity - ws.filled} yer`}
                  </span>
                </div>
                <div className="h-1 bg-sand overflow-hidden">
                  <div
                    className={`h-full transition-all ${isFull ? "bg-red-400" : "bg-gold"}`}
                    style={{ width: `${fillPct}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => toggleActive(ws.id)}
                  className={`font-label text-[0.55rem] px-3 py-1.5 transition-colors ${
                    ws.active ? "bg-green-50 text-green-700" : "bg-sand text-[#888480]"
                  }`}
                >
                  {ws.active ? "Aktif" : "Pasif"}
                </button>
                <button className="p-2 text-[#888480] hover:text-brown transition-colors" title="Düzenle">
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => deleteWorkshop(ws.id)}
                  className="p-2 text-[#888480] hover:text-red-500 transition-colors"
                  title="Sil"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <p className="font-label text-[#888480] text-[0.55rem] mt-4">
        Toplam {workshops.length} workshop · Supabase bağlantısı eklendiğinde veriler buraya yüklenecek.
      </p>
    </div>
  );
}
