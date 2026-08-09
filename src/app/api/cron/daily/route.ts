import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/client";
import { abandonedCartReminder, reviewRequest } from "@/lib/email/templates";
import type { OrderItem } from "@/lib/email/templates";

type ServiceClient = Awaited<ReturnType<typeof createServiceClient>>;

// Bu eşikten daha yeni etkileşimi olan sepetler henüz "terk edilmiş" sayılmaz.
const CART_INACTIVITY_HOURS = 2;
// Sipariş onaylandıktan bu kadar gün sonra "yorum yap" hatırlatması gider —
// el yapımı eserin teslim edilmesi için yeterli süre tanır.
const REVIEW_REQUEST_DAYS = 7;
const BATCH_LIMIT = 50;

async function checkAbandonedCarts(supabase: ServiceClient, siteUrl: string) {
  const threshold = new Date(Date.now() - CART_INACTIVITY_HOURS * 60 * 60 * 1000).toISOString();
  const { data: rows } = await supabase
    .from("cart_sessions")
    .select("id, email, items, subtotal")
    .not("email", "is", null)
    .is("converted_at", null)
    .is("reminder_sent_at", null)
    .lt("last_activity_at", threshold)
    .limit(BATCH_LIMIT);

  let sent = 0;
  for (const row of rows ?? []) {
    const items = Array.isArray(row.items) ? (row.items as unknown as OrderItem[]) : [];
    if (items.length === 0 || !row.email) continue;

    const { subject, html } = abandonedCartReminder({ items, subtotal: row.subtotal, siteUrl });
    await sendEmail({ to: row.email, subject, html });
    await supabase.from("cart_sessions").update({ reminder_sent_at: new Date().toISOString() }).eq("id", row.id);
    sent++;
  }
  return { checked: rows?.length ?? 0, sent };
}

async function checkReviewReminders(supabase: ServiceClient, siteUrl: string) {
  const threshold = new Date(Date.now() - REVIEW_REQUEST_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const { data: rows } = await supabase
    .from("orders")
    .select("id, full_name, email, items")
    .eq("status", "confirmed")
    .is("review_reminder_sent_at", null)
    .lt("updated_at", threshold)
    .limit(BATCH_LIMIT);

  let sent = 0;
  for (const row of rows ?? []) {
    const items = Array.isArray(row.items) ? (row.items as unknown as OrderItem[]) : [];
    if (items.length === 0) continue;

    const { subject, html } = reviewRequest({ full_name: row.full_name, items, siteUrl });
    await sendEmail({ to: row.email, subject, html });
    await supabase.from("orders").update({ review_reminder_sent_at: new Date().toISOString() }).eq("id", row.id);
    sent++;
  }
  return { checked: rows?.length ?? 0, sent };
}

// Vercel Cron bu yola yalnızca GET isteği atar (bkz. vercel.json). Hem terk
// edilmiş sepet hem yorum hatırlatması tek bir günlük cron altında toplanır
// — Vercel Hobby planının cron job sayısı sınırına takılmamak için.
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

  try {
    const supabase = await createServiceClient();
    // İki kontrol de birbirinden bağımsız — biri migration eksikliğinden
    // (ör. review_reminder_sent_at kolonu yoksa) hata verirse diğerini
    // engellemesin diye ayrı ayrı try/catch içinde çalıştırılır.
    let abandonedCart = { checked: 0, sent: 0 };
    let reviewReminder = { checked: 0, sent: 0 };
    try {
      abandonedCart = await checkAbandonedCarts(supabase, siteUrl);
    } catch {}
    try {
      reviewReminder = await checkReviewReminders(supabase, siteUrl);
    } catch {}

    return NextResponse.json({ ok: true, abandonedCart, reviewReminder });
  } catch {
    return NextResponse.json({ error: "Beklenmeyen hata." }, { status: 500 });
  }
}
