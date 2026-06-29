import { ImageIcon, CalendarDays, ClipboardList, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";

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

export default async function DashboardPage() {
  const supabase = await createServiceClient();

  const [
    { count: productCount },
    { count: workshopCount },
    { count: pendingRegistrations },
    { count: pendingOrders },
    { data: recentRegistrations },
    { data: recentOrders },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("workshops").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("registrations").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("contact_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("registrations").select("id, full_name, status, created_at, workshops(title)").order("created_at", { ascending: false }).limit(3),
    supabase.from("contact_requests").select("id, full_name, subject, status, created_at").order("created_at", { ascending: false }).limit(3),
  ]);

  const stats = [
    { label: "Toplam Eser", value: String(productCount ?? 0), icon: ImageIcon, href: "/admin/eserler", change: "aktif eserler" },
    { label: "Aktif Workshop", value: String(workshopCount ?? 0), icon: CalendarDays, href: "/admin/workshoplar", change: "aktif" },
    { label: "Yeni Başvuru", value: String(pendingRegistrations ?? 0), icon: ClipboardList, href: "/admin/basvurular", change: "Bekliyor" },
    { label: "Sipariş Talebi", value: String(pendingOrders ?? 0), icon: ShoppingBag, href: "/admin/basvurular", change: "Bekliyor" },
  ];

  type RecentItem = {
    id: string;
    name: string;
    type: string;
    subject: string;
    date: string;
    status: string;
  };

  const recentActivity: RecentItem[] = [
    ...(recentRegistrations ?? []).map((r) => ({
      id: r.id,
      name: r.full_name,
      type: "Workshop",
      subject: (r.workshops as { title?: string } | null)?.title ?? "—",
      date: new Date(r.created_at).toLocaleDateString("tr-TR"),
      status: r.status,
    })),
    ...(recentOrders ?? []).map((r) => ({
      id: r.id,
      name: r.full_name,
      type: "Sipariş",
      subject: r.subject,
      date: new Date(r.created_at).toLocaleDateString("tr-TR"),
      status: r.status,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="p-8 max-w-6xl">
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
          {recentActivity.length === 0 ? (
            <p className="px-6 py-8 font-label text-[#888480] text-[0.6rem] text-center">
              Henüz başvuru yok.
            </p>
          ) : (
            recentActivity.map((app) => (
              <div key={app.id} className="flex items-center gap-4 px-6 py-4">
                <div className="w-8 h-8 bg-[#f5f1ef] flex items-center justify-center shrink-0">
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}
