import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/account/ProfileForm";
import { LogoutButton } from "@/components/account/LogoutButton";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Hesabım — Madame Shelda" };

type OrderItem = { title: string; price: number; variantName?: string; variantHex?: string };
type Status = "pending" | "confirmed" | "cancelled";
type OrderRow = {
  id: string;
  ref: string;
  items: OrderItem[];
  total: number;
  status: Status;
  created_at: string;
};

const statusStyle: Record<Status, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-600 border-red-200",
};
const statusLabel: Record<Status, string> = {
  pending: "Bekliyor", confirmed: "Onaylandı", cancelled: "İptal",
};

export default async function HesabimPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/giris?redirect=/hesabim");

  let orders: OrderRow[] = [];
  try {
    const supabase = await createServiceClient();
    const cols = "id, ref, items, total, status, created_at";
    // İki ayrı sorgu (tek bir .or() string'i yerine) — kullanıcının e-postası
    // hiçbir şekilde filtre string'ine enjekte edilmiyor.
    const [byUserId, byEmail] = await Promise.all([
      supabase.from("orders").select(cols).eq("user_id", user.id),
      user.email
        ? supabase.from("orders").select(cols).is("user_id", null).eq("email", user.email)
        : Promise.resolve({ data: [] as OrderRow[] }),
    ]);
    orders = [...(byUserId.data ?? []), ...(byEmail.data ?? [])].sort(
      (a, b) => b.created_at.localeCompare(a.created_at)
    ) as OrderRow[];
  } catch {
    // orders.user_id kolonu henüz yoksa (migration çalışmamışsa) sessizce
    // boş liste gösterilir — sayfa asla kırılmaz.
  }

  const fullName = (user.user_metadata?.full_name as string) || "";

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start justify-between gap-4 mb-10">
          <div>
            <p className="font-label text-[#888480] text-[0.6rem] mb-1">Hesabım</p>
            <h1 className="font-serif text-brown text-3xl" style={{ fontStyle: "italic" }}>
              {fullName ? `Merhaba, ${fullName.split(" ")[0]}` : "Merhaba"}
            </h1>
          </div>
          <LogoutButton />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 lg:gap-14">
          {/* Sipariş geçmişi */}
          <div>
            <p className="font-label text-[#1a1a1a] text-[0.65rem] mb-5 pb-3 border-b border-sand">
              Sipariş Geçmişi
            </p>
            {orders.length === 0 ? (
              <p className="text-[#888480] font-light text-sm py-8 text-center">
                Henüz siparişiniz yok.
              </p>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="border border-sand p-5">
                    <div className="flex items-center gap-3 flex-wrap mb-3">
                      <span className="font-label text-brown text-[0.65rem]">#{order.ref}</span>
                      <span className={`font-label text-[0.55rem] px-2.5 py-1 border ${statusStyle[order.status]}`}>
                        {statusLabel[order.status]}
                      </span>
                      <span className="font-label text-[#888480] text-[0.55rem]">
                        {new Date(order.created_at).toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" })}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between gap-3">
                          <span className="font-label text-[0.6rem] text-[#1a1a1a] truncate">
                            {item.title}
                            {item.variantName && <span className="text-[#888480]"> — {item.variantName}</span>}
                          </span>
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
                ))}
              </div>
            )}
          </div>

          {/* Profil */}
          <div>
            <p className="font-label text-[#1a1a1a] text-[0.65rem] mb-5 pb-3 border-b border-sand">
              Profil Bilgileri
            </p>
            <ProfileForm
              email={user.email ?? ""}
              fullName={fullName}
              phone={(user.user_metadata?.phone as string) || ""}
              address={(user.user_metadata?.address as string) || ""}
              city={(user.user_metadata?.city as string) || ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
