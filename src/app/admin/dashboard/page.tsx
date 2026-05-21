import { ImageIcon, CalendarDays, ClipboardList, ShoppingBag } from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Toplam Eser", value: "24", icon: ImageIcon, href: "/admin/eserler", change: "+3 bu ay" },
  { label: "Aktif Workshop", value: "4", icon: CalendarDays, href: "/admin/workshoplar", change: "2 yaklaşıyor" },
  { label: "Yeni Başvuru", value: "7", icon: ClipboardList, href: "/admin/basvurular", change: "Bekliyor" },
  { label: "Sipariş Talebi", value: "12", icon: ShoppingBag, href: "/admin/basvurular", change: "Bu hafta" },
];

const recentApplications = [
  { name: "Ayşe Kaya", type: "Workshop", subject: "Dev Çiçek Düzenlemeleri", date: "21 Haz 2025", status: "pending" },
  { name: "Fatma Demir", type: "Sipariş", subject: "Özel Tasarım", date: "20 Haz 2025", status: "confirmed" },
  { name: "Zeynep Arslan", type: "Workshop", subject: "Başlangıç Çiçek Sanatı", date: "19 Haz 2025", status: "pending" },
  { name: "Merve Çelik", type: "Sipariş", subject: "Sonbahar Koleksiyonu", date: "18 Haz 2025", status: "confirmed" },
  { name: "Selin Yıldız", type: "Workshop", subject: "Doğal Boyama", date: "17 Haz 2025", status: "cancelled" },
];

const statusStyle: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-600",
};
const statusLabel: Record<string, string> = {
  pending: "Bekliyor",
  confirmed: "Onaylandı",
  cancelled: "İptal",
};

export default function DashboardPage() {
  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <p className="font-label text-[#888480] text-[0.6rem] mb-1">Madame Shelda</p>
        <h1 className="font-serif text-[#1a1a1a] text-3xl" style={{ fontStyle: "italic" }}>
          Dashboard
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-white border border-sand p-5 hover:border-brown/30 transition-colors duration-200 group"
          >
            <div className="flex items-start justify-between mb-4">
              <s.icon size={18} className="text-gold" />
              <span className="font-label text-[#888480] text-[0.55rem]">{s.change}</span>
            </div>
            <p className="font-serif text-[#1a1a1a] text-3xl mb-1" style={{ fontStyle: "italic" }}>
              {s.value}
            </p>
            <p className="font-label text-[#888480] text-[0.6rem]">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-sand">
        <div className="flex items-center justify-between px-6 py-4 border-b border-sand">
          <h2 className="font-label text-[#1a1a1a] text-[0.65rem]">Son Başvurular</h2>
          <Link href="/admin/basvurular" className="font-label text-gold text-[0.6rem] hover:text-gold-dark transition-colors">
            Tümünü Gör →
          </Link>
        </div>
        <div className="divide-y divide-sand">
          {recentApplications.map((app) => (
            <div key={app.name + app.date} className="flex items-center gap-4 px-6 py-4">
              <div className="w-8 h-8 bg-cream-dark flex items-center justify-center shrink-0">
                <span className="font-serif text-brown text-sm" style={{ fontStyle: "italic" }}>
                  {app.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-label text-[#1a1a1a] text-[0.65rem]">{app.name}</p>
                <p className="font-label text-[#888480] text-[0.55rem] truncate">{app.subject}</p>
              </div>
              <span className="font-label text-[#888480] text-[0.55rem] hidden sm:block shrink-0">{app.date}</span>
              <span className={`font-label text-[0.55rem] px-2.5 py-1 shrink-0 ${statusStyle[app.status]}`}>
                {statusLabel[app.status]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
