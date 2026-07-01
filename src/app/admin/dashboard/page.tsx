import { ImageIcon, CalendarDays, ShoppingBag, TrendingUp, Clock, CheckCircle, XCircle, Users } from "lucide-react";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";

const statusStyle: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-600",
};
const statusLabel: Record<string, string> = {
  pending: "Bekliyor", confirmed: "Onaylandı", cancelled: "İptal",
};

export default async function DashboardPage() {
  const supabase = await createServiceClient();

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [
    { count: totalProducts },
    { count: availableProducts },
    { count: activeWorkshops },
    { count: totalWorkshops },
    { count: pendingOrders },
    { count: confirmedOrders },
    { count: cancelledOrders },
    { count: pendingRegistrations },
    { count: confirmedRegistrations },
    { count: totalRegistrations },
    { data: allConfirmedOrders },
    { data: monthConfirmedOrders },
    { data: recentOrders },
    { data: recentRegistrations },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("products").select("*", { count: "exact", head: true }).eq("is_available", true),
    supabase.from("workshops").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("workshops").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "confirmed"),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "cancelled"),
    supabase.from("registrations").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("registrations").select("*", { count: "exact", head: true }).eq("status", "confirmed"),
    supabase.from("registrations").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("total").eq("status", "confirmed"),
    supabase.from("orders").select("total").eq("status", "confirmed").gte("created_at", monthStart.toISOString()),
    supabase.from("orders").select("id, ref, full_name, total, payment_method, status, created_at").order("created_at", { ascending: false }).limit(5),
    supabase.from("registrations").select("id, full_name, status, created_at, workshops(title)").order("created_at", { ascending: false }).limit(3),
  ]);

  const totalRevenue = allConfirmedOrders?.reduce((s, o) => s + (Number(o.total) || 0), 0) ?? 0;
  const monthRevenue = monthConfirmedOrders?.reduce((s, o) => s + (Number(o.total) || 0), 0) ?? 0;
  const totalOrders = (pendingOrders ?? 0) + (confirmedOrders ?? 0) + (cancelledOrders ?? 0);

  const fmt = (n: number) =>
    n >= 1000 ? `₺${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}B` : `₺${n.toLocaleString("tr-TR")}`;

  return (
    <div className="p-8 max-w-6xl space-y-8">
      <div>
        <p className="font-label text-[#888480] text-[0.6rem] mb-1">Madame Shelda</p>
        <h1 className="font-serif text-[#1a1a1a] text-3xl" style={{ fontStyle: "italic" }}>Dashboard</h1>
      </div>

      {/* ── KPI Kartları ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <Link href="/admin/eserler" className="bg-white border border-sand p-5 hover:border-brown/30 transition-colors group">
          <div className="flex items-start justify-between mb-4">
            <ImageIcon size={18} className="text-gold" />
            <span className="font-label text-[#888480] text-[0.5rem]">{availableProducts ?? 0} / {totalProducts ?? 0} aktif</span>
          </div>
          <p className="font-serif text-[#1a1a1a] text-3xl mb-1" style={{ fontStyle: "italic" }}>{availableProducts ?? 0}</p>
          <p className="font-label text-[#888480] text-[0.6rem]">Satıştaki Eser</p>
        </Link>

        <Link href="/admin/workshoplar" className="bg-white border border-sand p-5 hover:border-brown/30 transition-colors group">
          <div className="flex items-start justify-between mb-4">
            <CalendarDays size={18} className="text-gold" />
            <span className="font-label text-[#888480] text-[0.5rem]">{activeWorkshops ?? 0} / {totalWorkshops ?? 0} aktif</span>
          </div>
          <p className="font-serif text-[#1a1a1a] text-3xl mb-1" style={{ fontStyle: "italic" }}>{activeWorkshops ?? 0}</p>
          <p className="font-label text-[#888480] text-[0.6rem]">Aktif Workshop</p>
        </Link>

        <Link href="/admin/basvurular" className="bg-white border border-sand p-5 hover:border-brown/30 transition-colors group">
          <div className="flex items-start justify-between mb-4">
            <ShoppingBag size={18} className="text-gold" />
            <span className={`font-label text-[0.5rem] px-1.5 py-0.5 ${(pendingOrders ?? 0) > 0 ? "bg-amber-50 text-amber-700" : "text-[#888480]"}`}>
              {(pendingOrders ?? 0) > 0 ? `${pendingOrders} bekliyor` : "hepsi işlendi"}
            </span>
          </div>
          <p className="font-serif text-[#1a1a1a] text-3xl mb-1" style={{ fontStyle: "italic" }}>{totalOrders}</p>
          <p className="font-label text-[#888480] text-[0.6rem]">Toplam Sipariş</p>
        </Link>

        <div className="bg-brown p-5">
          <div className="flex items-start justify-between mb-4">
            <TrendingUp size={18} className="text-cream/60" />
            <span className="font-label text-cream/40 text-[0.5rem]">bu ay</span>
          </div>
          <p className="font-serif text-cream text-3xl mb-0.5" style={{ fontStyle: "italic" }}>{fmt(monthRevenue)}</p>
          <p className="font-label text-cream/50 text-[0.6rem]">Aylık Ciro</p>
          <p className="font-label text-cream/30 text-[0.5rem] mt-2">Toplam: {fmt(totalRevenue)}</p>
        </div>
      </div>

      {/* ── Orta: Sipariş Dağılımı + Workshop Kayıtları ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Sipariş dağılımı */}
        <div className="bg-white border border-sand p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-label text-[#1a1a1a] text-[0.65rem]">Sipariş Durumu</h2>
            <Link href="/admin/basvurular" className="font-label text-gold text-[0.55rem] hover:text-brown transition-colors">Tümünü Gör →</Link>
          </div>
          <div className="space-y-3">
            {[
              { label: "Bekliyor", count: pendingOrders ?? 0, icon: Clock, color: "text-amber-600", bar: "bg-amber-400" },
              { label: "Onaylandı", count: confirmedOrders ?? 0, icon: CheckCircle, color: "text-green-600", bar: "bg-green-400" },
              { label: "İptal", count: cancelledOrders ?? 0, icon: XCircle, color: "text-red-500", bar: "bg-red-300" },
            ].map(({ label, count, icon: Icon, color, bar }) => (
              <div key={label} className="flex items-center gap-3">
                <Icon size={13} className={`${color} shrink-0`} />
                <span className="font-label text-[#888480] text-[0.6rem] w-20 shrink-0">{label}</span>
                <div className="flex-1 h-1.5 bg-sand rounded-full overflow-hidden">
                  <div
                    className={`h-full ${bar} rounded-full transition-all duration-500`}
                    style={{ width: totalOrders > 0 ? `${(count / totalOrders) * 100}%` : "0%" }}
                  />
                </div>
                <span className="font-label text-[#1a1a1a] text-[0.65rem] w-6 text-right shrink-0">{count}</span>
              </div>
            ))}
            {totalOrders === 0 && (
              <p className="text-center font-label text-[#888480] text-[0.6rem] py-4">Henüz sipariş yok.</p>
            )}
          </div>
          {totalOrders > 0 && (
            <div className="mt-5 pt-4 border-t border-sand flex items-center justify-between">
              <span className="font-label text-[#888480] text-[0.55rem]">Onay oranı</span>
              <span className="font-label text-green-600 text-[0.65rem]">
                %{totalOrders > 0 ? Math.round(((confirmedOrders ?? 0) / totalOrders) * 100) : 0}
              </span>
            </div>
          )}
        </div>

        {/* Workshop kayıtları */}
        <div className="bg-white border border-sand p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-label text-[#1a1a1a] text-[0.65rem]">Workshop Başvuruları</h2>
            <Link href="/admin/basvurular" className="font-label text-gold text-[0.55rem] hover:text-brown transition-colors">Tümünü Gör →</Link>
          </div>
          <div className="space-y-3">
            {[
              { label: "Bekliyor", count: pendingRegistrations ?? 0, icon: Clock, color: "text-amber-600", bar: "bg-amber-400" },
              { label: "Onaylandı", count: confirmedRegistrations ?? 0, icon: CheckCircle, color: "text-green-600", bar: "bg-green-400" },
            ].map(({ label, count, icon: Icon, color, bar }) => (
              <div key={label} className="flex items-center gap-3">
                <Icon size={13} className={`${color} shrink-0`} />
                <span className="font-label text-[#888480] text-[0.6rem] w-20 shrink-0">{label}</span>
                <div className="flex-1 h-1.5 bg-sand rounded-full overflow-hidden">
                  <div
                    className={`h-full ${bar} rounded-full transition-all duration-500`}
                    style={{ width: (totalRegistrations ?? 0) > 0 ? `${(count / (totalRegistrations ?? 1)) * 100}%` : "0%" }}
                  />
                </div>
                <span className="font-label text-[#1a1a1a] text-[0.65rem] w-6 text-right shrink-0">{count}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-sand grid grid-cols-2 gap-4">
            <div>
              <p className="font-serif text-[#1a1a1a] text-2xl" style={{ fontStyle: "italic" }}>{totalRegistrations ?? 0}</p>
              <p className="font-label text-[#888480] text-[0.55rem]">Toplam Başvuru</p>
            </div>
            <div>
              <p className="font-serif text-[#1a1a1a] text-2xl" style={{ fontStyle: "italic" }}>
                %{(totalRegistrations ?? 0) > 0 ? Math.round(((confirmedRegistrations ?? 0) / (totalRegistrations ?? 1)) * 100) : 0}
              </p>
              <p className="font-label text-[#888480] text-[0.55rem]">Onay Oranı</p>
            </div>
          </div>
          {(totalRegistrations ?? 0) === 0 && (
            <p className="text-center font-label text-[#888480] text-[0.6rem] py-4">Henüz başvuru yok.</p>
          )}
        </div>
      </div>

      {/* ── Son Siparişler ── */}
      <div className="bg-white border border-sand">
        <div className="flex items-center justify-between px-6 py-4 border-b border-sand">
          <h2 className="font-label text-[#1a1a1a] text-[0.65rem]">Son Siparişler</h2>
          <Link href="/admin/basvurular" className="font-label text-gold text-[0.6rem] hover:text-brown transition-colors">
            Tümünü Gör →
          </Link>
        </div>
        <div className="divide-y divide-sand">
          {(recentOrders ?? []).length === 0 ? (
            <p className="px-6 py-8 font-label text-[#888480] text-[0.6rem] text-center">Henüz sipariş yok.</p>
          ) : (recentOrders ?? []).map((order) => (
            <div key={order.id} className="flex items-center gap-4 px-6 py-4">
              <div className="w-8 h-8 bg-cream flex items-center justify-center shrink-0 border border-sand">
                <ShoppingBag size={12} className="text-brown" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-label text-[#1a1a1a] text-[0.65rem]">{order.full_name}</p>
                <p className="font-label text-[#888480] text-[0.55rem]">#{order.ref} · {order.payment_method === "havale" ? "Havale/EFT" : "WhatsApp"}</p>
              </div>
              <span className="font-serif text-brown text-base shrink-0" style={{ fontStyle: "italic" }}>
                ₺{Number(order.total).toLocaleString("tr-TR")}
              </span>
              <span className="font-label text-[#888480] text-[0.55rem] hidden sm:block shrink-0">
                {new Date(order.created_at).toLocaleDateString("tr-TR")}
              </span>
              <span className={`font-label text-[0.55rem] px-2.5 py-1 shrink-0 ${statusStyle[order.status]}`}>
                {statusLabel[order.status]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Son Workshop Başvuruları ── */}
      {(recentRegistrations ?? []).length > 0 && (
        <div className="bg-white border border-sand">
          <div className="flex items-center justify-between px-6 py-4 border-b border-sand">
            <h2 className="font-label text-[#1a1a1a] text-[0.65rem]">Son Workshop Başvuruları</h2>
            <Link href="/admin/basvurular" className="font-label text-gold text-[0.6rem] hover:text-brown transition-colors">
              Tümünü Gör →
            </Link>
          </div>
          <div className="divide-y divide-sand">
            {(recentRegistrations ?? []).map((r) => (
              <div key={r.id} className="flex items-center gap-4 px-6 py-4">
                <div className="w-8 h-8 bg-cream flex items-center justify-center shrink-0 border border-sand">
                  <Users size={12} className="text-brown" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-label text-[#1a1a1a] text-[0.65rem]">{r.full_name}</p>
                  <p className="font-label text-[#888480] text-[0.55rem] truncate">
                    {(r.workshops as { title?: string } | null)?.title ?? "—"}
                  </p>
                </div>
                <span className="font-label text-[#888480] text-[0.55rem] hidden sm:block shrink-0">
                  {new Date(r.created_at).toLocaleDateString("tr-TR")}
                </span>
                <span className={`font-label text-[0.55rem] px-2.5 py-1 shrink-0 ${statusStyle[r.status]}`}>
                  {statusLabel[r.status]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
