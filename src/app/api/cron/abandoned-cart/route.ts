import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/client";
import { abandonedCartReminder } from "@/lib/email/templates";
import type { OrderItem } from "@/lib/email/templates";

// Bu eşikten daha yeni etkileşimi olan sepetler henüz "terk edilmiş" sayılmaz.
const INACTIVITY_HOURS = 2;
const BATCH_LIMIT = 50;

// Vercel Cron bu yola yalnızca GET isteği atar (bkz. vercel.json).
export async function GET(request: Request) {
  // CRON_SECRET tanımlıysa doğrulanır; henüz eklenmediyse (RESEND_API_KEY
  // ile aynı "opsiyonel, sonra eklenebilir" deseni) route yine çalışır.
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://madameshelda.com";
  const threshold = new Date(Date.now() - INACTIVITY_HOURS * 60 * 60 * 1000).toISOString();

  try {
    const supabase = await createServiceClient();
    const { data: rows, error } = await supabase
      .from("cart_sessions")
      .select("id, email, items, subtotal")
      .not("email", "is", null)
      .is("converted_at", null)
      .is("reminder_sent_at", null)
      .lt("last_activity_at", threshold)
      .limit(BATCH_LIMIT);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    let sent = 0;
    for (const row of rows ?? []) {
      const items = Array.isArray(row.items) ? (row.items as unknown as OrderItem[]) : [];
      if (items.length === 0 || !row.email) continue;

      const { subject, html } = abandonedCartReminder({ items, subtotal: row.subtotal, siteUrl });
      await sendEmail({ to: row.email, subject, html });
      await supabase.from("cart_sessions").update({ reminder_sent_at: new Date().toISOString() }).eq("id", row.id);
      sent++;
    }

    return NextResponse.json({ ok: true, checked: rows?.length ?? 0, sent });
  } catch {
    return NextResponse.json({ error: "Beklenmeyen hata." }, { status: 500 });
  }
}
