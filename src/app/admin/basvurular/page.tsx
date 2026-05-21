"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Mail, Phone } from "lucide-react";

type Status = "pending" | "confirmed" | "cancelled";

const mockData = {
  workshop: [
    { id: "1", full_name: "Ayşe Kaya", email: "ayse@email.com", phone: "0532 111 22 33", workshop: "Dev Çiçek Düzenlemeleri", date: "21 Haz 2025", status: "pending" as Status, notes: "" },
    { id: "2", full_name: "Zeynep Arslan", email: "zeynep@email.com", phone: "0541 222 33 44", workshop: "Başlangıç Çiçek Sanatı", date: "14 Haz 2025", status: "pending" as Status, notes: "Çocuğumu getirebilir miyim?" },
    { id: "3", full_name: "Selin Yıldız", email: "selin@email.com", phone: "0553 333 44 55", workshop: "Doğal Boyama", date: "5 Tem 2025", status: "confirmed" as Status, notes: "" },
    { id: "4", full_name: "Hande Öztürk", email: "hande@email.com", phone: "0555 444 55 66", workshop: "Başlangıç Çiçek Sanatı", date: "14 Haz 2025", status: "cancelled" as Status, notes: "" },
  ],
  orders: [
    { id: "1", full_name: "Fatma Demir", email: "fatma@email.com", phone: "0542 555 66 77", subject: "Özel Tasarım", message: "Oturma odam için büyük bir çalışma istiyorum, krem ve bordo tonlarında.", date: "20 Haz 2025", status: "pending" as Status },
    { id: "2", full_name: "Merve Çelik", email: "merve@email.com", phone: "0544 666 77 88", subject: "Sonbahar Koleksiyonu", message: "Bu eserin bir benzerini istiyorum.", date: "18 Haz 2025", status: "confirmed" as Status },
    { id: "3", full_name: "Neslihan Ak", email: "neslihan@email.com", phone: "0546 777 88 99", subject: "Ofis Tasarımı", message: "Resepsiyon alanı için minimalist bir düzenleme.", date: "15 Haz 2025", status: "pending" as Status },
  ],
};

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
  const [workshopData, setWorkshopData] = useState(mockData.workshop);
  const [orderData, setOrderData] = useState(mockData.orders);

  const updateStatus = (id: string, status: Status) => {
    if (tab === "workshop") {
      setWorkshopData((p) => p.map((r) => r.id === id ? { ...r, status } : r));
    } else {
      setOrderData((p) => p.map((r) => r.id === id ? { ...r, status } : r));
    }
  };

  const currentData = tab === "workshop" ? workshopData : orderData;

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <p className="font-label text-[#888480] text-[0.6rem] mb-1">Yönetim</p>
        <h1 className="font-serif text-[#1a1a1a] text-3xl" style={{ fontStyle: "italic" }}>
          Başvurular
        </h1>
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
            {t === "workshop" ? `Workshop Başvuruları (${workshopData.filter(r => r.status === "pending").length})` : `Sipariş Talepleri (${orderData.filter(r => r.status === "pending").length})`}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {currentData.map((item) => (
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
                  {tab === "workshop"
                    ? (item as typeof workshopData[0]).workshop + " · " + (item as typeof workshopData[0]).date
                    : (item as typeof orderData[0]).subject}
                </p>

                <div className="flex flex-wrap gap-4 mb-3">
                  <a href={`mailto:${item.email}`} className="flex items-center gap-1.5 font-label text-[#888480] text-[0.6rem] hover:text-brown transition-colors">
                    <Mail size={11} /> {item.email}
                  </a>
                  <a href={`tel:${item.phone}`} className="flex items-center gap-1.5 font-label text-[#888480] text-[0.6rem] hover:text-brown transition-colors">
                    <Phone size={11} /> {item.phone}
                  </a>
                </div>

                {"message" in item && item.message && (
                  <p className="text-[#888480] text-xs font-light italic border-l-2 border-sand pl-3">
                    &ldquo;{item.message}&rdquo;
                  </p>
                )}
                {"notes" in item && item.notes && (
                  <p className="text-[#888480] text-xs font-light italic border-l-2 border-sand pl-3">
                    &ldquo;{item.notes}&rdquo;
                  </p>
                )}
              </div>

              {/* Actions */}
              {item.status === "pending" && (
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => updateStatus(item.id, "confirmed")}
                    className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 font-label text-[0.6rem] px-3 py-2 hover:bg-green-100 transition-colors"
                  >
                    <CheckCircle size={12} /> Onayla
                  </button>
                  <button
                    onClick={() => updateStatus(item.id, "cancelled")}
                    className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 font-label text-[0.6rem] px-3 py-2 hover:bg-red-100 transition-colors"
                  >
                    <XCircle size={12} /> İptal
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
