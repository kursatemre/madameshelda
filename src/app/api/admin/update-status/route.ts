import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { sendEmail } from "@/lib/email/client";
import { orderStatusChanged, workshopStatusChanged, type OrderItem } from "@/lib/email/templates";

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  return token === process.env.ADMIN_SECRET_TOKEN;
}

export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { table, id, status } = await request.json();

  if (!["registrations", "contact_requests", "orders"].includes(table)) {
    return NextResponse.json({ error: "Invalid table" }, { status: 400 });
  }
  if (!["pending", "confirmed", "cancelled"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const supabase = await createServiceClient();
  const notifiable = status === "confirmed" || status === "cancelled";

  // Siparişler: güncelledikten sonra satırı geri alıp durum bildirimi gönder.
  if (table === "orders") {
    const { data, error } = await supabase
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("*")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    if (data && notifiable) {
      const { subject, html } = orderStatusChanged({
        ref: data.ref,
        full_name: data.full_name,
        items: (Array.isArray(data.items) ? data.items : []) as OrderItem[],
        total: Number(data.total),
        status,
      });
      await sendEmail({ to: data.email, subject, html });
    }

    return NextResponse.json({ success: true });
  }

  // Workshop başvuruları: workshop başlığı/tarihi için join gerekiyor.
  if (table === "registrations") {
    const { data, error } = await supabase
      .from("registrations")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("*, workshops(title, date)")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const workshop = data?.workshops as { title: string; date: string } | null;
    if (data && workshop && notifiable) {
      const { subject, html } = workshopStatusChanged({
        full_name: data.full_name,
        workshopTitle: workshop.title,
        workshopDate: workshop.date,
        status,
      });
      await sendEmail({ to: data.email, subject, html });
    }

    return NextResponse.json({ success: true });
  }

  // İletişim talepleri: durum yalnızca dahili takip amaçlı, müşteriye bildirim gönderilmez.
  const { error } = await supabase
    .from("contact_requests")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
