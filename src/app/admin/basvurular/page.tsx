"use client";

import { useState, useEffect, useCallback } from "react";
import { CheckCircle, XCircle, Mail, Phone, RefreshCw } from "lucide-react";

type Status = "pending" | "confirmed" | "cancelled";

interface Registration {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  notes: string | null;
  status: Status;
  created_at: string;
  workshops: { id: string; title: string; date: string } | null;
}

interface ContactRequest {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  product_slug: string | null;
  status: Status;
  created_at: string;
}

const statusStyle: Record<Status, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-600 border-red-200",
};
const statusLabel: Record<Status, string> = {
  pending: "Bekliyor", confirmed: "Onaylandı", cancelled: "İptal",
};

export default function AdminBasvurularPage() {
  const [tab, setTab] = useState<"workshop" | "orders">("workshop");
  const [workshopData, setWorkshopData] = useState<Registration[]>([]);
  const [orderData, setOrderData] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [regRes, orderRes] = await Promise.all([
        fetch("/api/admin/registrations"),
        fetch("/api/admin/orders"),
      ]);
      if (regRes.ok) setWorkshopData(await regRes.json());
      if (orderRes.ok) setOrderData(await orderRes.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const updateStatus = async (id: string, status: Status, table: "registrations" | "contact_requests") => {
    const res = await fetch("/api/admin/update-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table, id, status }),
    });
    if (!res.ok) return;
    if (table === "registrations") {
      setWorkshopData((p) => p.map((r) => r.id === id ? { ...r, status } : r));
    } else {
      setOrderData((p) => p.map((r) => r.id === id ? { ...r, status } : r));
    }
  };

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="font-label text-[#888480] text-[0.6rem] mb-1">Yönetim</p>
          <h1 className="font-serif text-[#1a1a1a] text-3xl" style={{ fontStyle: "italic" }}>
            Başvurular
          </h1>
        </div>
        <button onClick={fetchData} className="p-2 text-[#888480] hover:text-brown transition-colors" title="Yenile">
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-sand">
        {(["workshop", "orders"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`font-label text-[0.65rem] px-5 py-3 transition-colors duration-200 -mb-px border-b-2 ${
              tab === t
                ? "border-brown text-brown"
                : "border-transparent text-[#888480] hover:text-[#1a1a1a]"
            }`}
          >
            {t === "workshop"
              ? `Workshop Başvuruları (${workshopData.filter(r => r.status === "pending").length})`
              : `Sipariş Talepleri (${orderData.filter(r => r.status === "pending").length})`}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="py-16 text-center font-label text-[#888480] text-[0.6rem]">Yükleniyor...</div>
      ) : (
        <div className="space-y-3">
          {tab === "workshop" ? (
            workshopData.length === 0 ? (
              <p className="py-16 text-center font-label text-[#888480] text-[0.6rem]">Başvuru bulunamadı.</p>
            ) : workshopData.map((item) => (
              <div key={item.id} className="bg-white border border-sand p-5">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-label text-[#1a1a1a] text-[0.7rem]">{item.full_name}</h3>
                      <span className={`font-label text-[0.55rem] px-2.5 py-1 border ${statusStyle[item.status]}`}>
                        {statusLabel[item.status]}
                      </span>
                    </div>
                    <p className="font-label text-brown text-[0.65rem] mb-2">
                      {item.workshops?.title ?? "—"} · {item.workshops?.date ? new Date(item.workshops.date).toLocaleDateString("tr-TR") : "—"}
                    </p>
                    <div className="flex flex-wrap gap-4 mb-3">
                      <a href={`mailto:${item.email}`} className="flex items-center gap-1.5 font-label text-[#888480] text-[0.6rem] hover:text-brown transition-colors">
                        <Mail size={11} /> {item.email}
                      </a>
                      <a href={`tel:${item.phone}`} className="flex items-center gap-1.5 font-label text-[#888480] text-[0.6rem] hover:text-brown transition-colors">
                        <Phone size={11} /> {item.phone}
                      </a>
                    </div>
                    {item.notes && (
                      <p className="text-[#888480] text-xs font-light italic border-l-2 border-sand pl-3">
                        &ldquo;{item.notes}&rdquo;
                      </p>
                    )}
                  </div>
                  {item.status === "pending" && (
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => updateStatus(item.id, "confirmed", "registrations")}
                        className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 font-label text-[0.6rem] px-3 py-2 hover:bg-green-100 transition-colors"
                      >
                        <CheckCircle size={12} /> Onayla
                      </button>
                      <button
                        onClick={() => updateStatus(item.id, "cancelled", "registrations")}
                        className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 font-label text-[0.6rem] px-3 py-2 hover:bg-red-100 transition-colors"
                      >
                        <XCircle size={12} /> İptal
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            orderData.length === 0 ? (
              <p className="py-16 text-center font-label text-[#888480] text-[0.6rem]">Sipariş talebi bulunamadı.</p>
            ) : orderData.map((item) => (
              <div key={item.id} className="bg-white border border-sand p-5">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-label text-[#1a1a1a] text-[0.7rem]">{item.full_name}</h3>
                      <span className={`font-label text-[0.55rem] px-2.5 py-1 border ${statusStyle[item.status]}`}>
                        {statusLabel[item.status]}
                      </span>
                    </div>
                    <p className="font-label text-brown text-[0.65rem] mb-2">{item.subject}</p>
                    <div className="flex flex-wrap gap-4 mb-3">
                      <a href={`mailto:${item.email}`} className="flex items-center gap-1.5 font-label text-[#888480] text-[0.6rem] hover:text-brown transition-colors">
                        <Mail size={11} /> {item.email}
                      </a>
                      {item.phone && (
                        <a href={`tel:${item.phone}`} className="flex items-center gap-1.5 font-label text-[#888480] text-[0.6rem] hover:text-brown transition-colors">
                          <Phone size={11} /> {item.phone}
                        </a>
                      )}
                    </div>
                    <p className="text-[#888480] text-xs font-light italic border-l-2 border-sand pl-3">
                      &ldquo;{item.message}&rdquo;
                    </p>
                  </div>
                  {item.status === "pending" && (
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => updateStatus(item.id, "confirmed", "contact_requests")}
                        className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 font-label text-[0.6rem] px-3 py-2 hover:bg-green-100 transition-colors"
                      >
                        <CheckCircle size={12} /> Onayla
                      </button>
                      <button
                        onClick={() => updateStatus(item.id, "cancelled", "contact_requests")}
                        className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 font-label text-[0.6rem] px-3 py-2 hover:bg-red-100 transition-colors"
                      >
                        <XCircle size={12} /> İptal
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
