"use client";

import { useState, useEffect, useCallback } from "react";
import { CheckCircle, XCircle, Mail, Phone, RefreshCw, MapPin, CreditCard } from "lucide-react";

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

interface OrderItem {
  title: string;
  price: number;
  variantName?: string;
  variantHex?: string;
}

interface Order {
  id: string;
  ref: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  note: string | null;
  items: OrderItem[];
  total: number;
  payment_method: "havale" | "whatsapp";
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
  const [tab, setTab] = useState<"workshop" | "orders">("orders");
  const [workshopData, setWorkshopData] = useState<Registration[]>([]);
  const [orderData, setOrderData] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

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

  const updateStatus = async (id: string, status: Status, table: "registrations" | "orders") => {
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
        {(["orders", "workshop"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`font-label text-[0.65rem] px-5 py-3 transition-colors duration-200 -mb-px border-b-2 ${
              tab === t
                ? "border-brown text-brown"
                : "border-transparent text-[#888480] hover:text-[#1a1a1a]"
            }`}
          >
            {t === "orders"
              ? `Siparişler (${orderData.filter(r => r.status === "pending").length} bekliyor)`
              : `Workshop Başvuruları (${workshopData.filter(r => r.status === "pending").length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-16 text-center font-label text-[#888480] text-[0.6rem]">Yükleniyor...</div>
      ) : (
        <div className="space-y-3">
          {tab === "orders" ? (
            orderData.length === 0 ? (
              <p className="py-16 text-center font-label text-[#888480] text-[0.6rem]">Henüz sipariş yok.</p>
            ) : orderData.map((order) => {
              const isExpanded = expandedOrder === order.id;
              return (
                <div key={order.id} className="bg-white border border-sand">
                  {/* Ana bilgiler — her zaman görünür */}
                  <div className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="flex-1 min-w-0 space-y-3">
                        {/* Üst satır: ref, durum, tarih */}
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-label text-brown text-[0.65rem]">#{order.ref}</span>
                          <span className={`font-label text-[0.55rem] px-2.5 py-1 border ${statusStyle[order.status]}`}>
                            {statusLabel[order.status]}
                          </span>
                          <span className="font-label text-[#888480] text-[0.55rem]">
                            {new Date(order.created_at).toLocaleString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </span>
                          <span className="font-label text-[#888480] text-[0.55rem] flex items-center gap-1">
                            <CreditCard size={10} /> {order.payment_method === "havale" ? "Havale/EFT" : "WhatsApp"}
                          </span>
                        </div>

                        {/* Müşteri adı */}
                        <p className="font-label text-[#1a1a1a] text-[0.7rem]">{order.full_name}</p>

                        {/* Ürün listesi — renk varyantı dahil */}
                        <div className="space-y-1.5">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2 min-w-0">
                                {item.variantHex && (
                                  <span
                                    className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/10 shadow-sm"
                                    style={{ background: item.variantHex }}
                                    title={item.variantName}
                                  />
                                )}
                                <span className="font-label text-[0.6rem] text-[#1a1a1a] truncate">
                                  {item.title}
                                  {item.variantName && (
                                    <span className="text-[#888480]"> — {item.variantName}</span>
                                  )}
                                </span>
                              </div>
                              <span className="font-label text-[0.6rem] text-brown shrink-0">
                                ₺{item.price.toLocaleString("tr-TR")}
                              </span>
                            </div>
                          ))}
                          <div className="flex justify-between pt-2 border-t border-sand mt-1">
                            <span className="font-label text-[#888480] text-[0.6rem]">Toplam</span>
                            <span className="font-serif text-brown text-lg" style={{ fontStyle: "italic" }}>
                              ₺{order.total.toLocaleString("tr-TR")}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Sağ: butonlar */}
                      {order.status === "pending" && (
                        <div className="flex sm:flex-col gap-2 shrink-0">
                          <button
                            onClick={() => updateStatus(order.id, "confirmed", "orders")}
                            className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 font-label text-[0.6rem] px-3 py-2 hover:bg-green-100 transition-colors"
                          >
                            <CheckCircle size={12} /> Onayla
                          </button>
                          <button
                            onClick={() => updateStatus(order.id, "cancelled", "orders")}
                            className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 font-label text-[0.6rem] px-3 py-2 hover:bg-red-100 transition-colors"
                          >
                            <XCircle size={12} /> İptal
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Müşteri detayı — tıklayınca açılır */}
                    <button
                      onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      className="mt-3 font-label text-[#888480] text-[0.55rem] hover:text-brown transition-colors"
                    >
                      {isExpanded ? "▲ İletişim bilgilerini gizle" : "▼ İletişim & adres bilgileri"}
                    </button>
                  </div>

                  {/* Açılır: müşteri iletişim bilgileri */}
                  {isExpanded && (
                    <div className="border-t border-sand px-5 py-4 bg-cream/30 flex flex-wrap gap-6">
                      <a href={`mailto:${order.email}`} className="flex items-center gap-2 font-label text-[0.6rem] text-[#1a1a1a] hover:text-brown transition-colors">
                        <Mail size={11} className="text-gold" /> {order.email}
                      </a>
                      <a href={`tel:${order.phone}`} className="flex items-center gap-2 font-label text-[0.6rem] text-[#1a1a1a] hover:text-brown transition-colors">
                        <Phone size={11} className="text-gold" /> {order.phone}
                      </a>
                      <div className="flex items-start gap-2 font-label text-[0.6rem] text-[#888480]">
                        <MapPin size={11} className="text-gold shrink-0 mt-0.5" /> {order.address}, {order.city}
                      </div>
                      {order.note && (
                        <p className="w-full text-[#888480] text-xs font-light italic border-l-2 border-sand pl-3">
                          &ldquo;{order.note}&rdquo;
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
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
          )}
        </div>
      )}
    </div>
  );
}
