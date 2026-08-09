"use client";

import { useState, useEffect, useCallback } from "react";
import { Trash2, Download, RefreshCw, Mail } from "lucide-react";
import { toast } from "sonner";

interface Subscriber {
  id: string;
  email: string;
  source: string | null;
  is_active: boolean;
  created_at: string;
}

export default function AdminBultenPage() {
  const [data, setData] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/newsletter");
      if (res.ok) setData(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const remove = async (id: string) => {
    if (!confirm("Bu aboneyi silmek istediğinize emin misiniz?")) return;
    const res = await fetch(`/api/admin/newsletter?id=${id}`, { method: "DELETE" });
    if (!res.ok) return toast.error("Silinemedi.");
    setData((p) => p.filter((s) => s.id !== id));
    toast.success("Abone silindi.");
  };

  const exportCsv = () => {
    const rows = [["E-posta", "Kaynak", "Aktif", "Kayıt Tarihi"], ...data.map((s) => [
      s.email, s.source ?? "", s.is_active ? "Evet" : "Hayır",
      new Date(s.created_at).toLocaleDateString("tr-TR"),
    ])];
    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bulten-aboneleri-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
      <div className="flex items-start justify-between mb-6 lg:mb-8 gap-3">
        <div>
          <p className="font-label text-[#888480] text-[0.6rem] mb-1">Yönetim</p>
          <h1 className="font-serif text-[#1a1a1a] text-2xl sm:text-3xl" style={{ fontStyle: "italic" }}>
            Bülten Aboneleri
          </h1>
          <p className="font-label text-[#888480] text-[0.6rem] mt-2 normal-case">
            {data.length} kayıtlı e-posta adresi
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={exportCsv}
            disabled={data.length === 0}
            className="flex items-center gap-1.5 border border-sand font-label text-[0.6rem] px-3 py-2.5 text-[#1a1a1a] hover:border-brown transition-colors disabled:opacity-40"
          >
            <Download size={13} /> CSV İndir
          </button>
          <button onClick={fetchData} className="p-2.5 text-[#888480] hover:text-brown transition-colors" title="Yenile">
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center font-label text-[#888480] text-[0.6rem]">Yükleniyor...</div>
      ) : data.length === 0 ? (
        <div className="py-16 text-center">
          <Mail size={24} className="mx-auto text-[#c9c4bd] mb-3" />
          <p className="font-label text-[#888480] text-[0.6rem]">Henüz abone yok.</p>
        </div>
      ) : (
        <div className="bg-white border border-sand divide-y divide-sand">
          {data.map((s) => (
            <div key={s.id} className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="min-w-0">
                <p className="font-label text-[#1a1a1a] text-[0.7rem] truncate">{s.email}</p>
                <p className="font-label text-[#888480] text-[0.55rem] mt-1">
                  {new Date(s.created_at).toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" })}
                  {s.source && ` · ${s.source}`}
                  {!s.is_active && " · Pasif"}
                </p>
              </div>
              <button
                onClick={() => remove(s.id)}
                className="p-2 text-[#888480] hover:text-red-600 transition-colors shrink-0"
                title="Sil"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
