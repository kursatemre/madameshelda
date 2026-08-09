import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { newsletterSchema, firstIssueMessage } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = newsletterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: firstIssueMessage(parsed) }, { status: 400 });
    }
    const { email, source } = parsed.data;

    const supabase = await createServiceClient();
    // E-posta zaten kayıtlıysa sessizce "aktif" yap — hem yeni abonelik hem
    // tekrar katılma isteği aynı başarı mesajını görür, e-posta enumeration'a
    // izin verilmez.
    const { error } = await supabase
      .from("newsletter_subscribers")
      .upsert({ email: email.toLowerCase(), source: source || "footer", is_active: true }, { onConflict: "email" });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Beklenmeyen hata." }, { status: 500 });
  }
}
