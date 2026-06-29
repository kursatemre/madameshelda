import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { full_name, email, phone, subject, message, product_slug } = body;

    if (!full_name || !email || !subject || !message) {
      return NextResponse.json({ error: "Zorunlu alanlar eksik." }, { status: 400 });
    }

    const supabase = await createServiceClient();

    const { error } = await supabase.from("contact_requests").insert({
      full_name,
      email,
      phone: phone || null,
      subject,
      message,
      product_slug: product_slug || null,
      status: "pending",
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Kayıt sırasında hata oluştu." }, { status: 500 });
    }

    // Send email notification via Resend if configured
    if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
          from: "Madame Shelda <noreply@madameshelda.com>",
          to: process.env.ADMIN_EMAIL,
          subject: `Yeni Sipariş Talebi: ${subject}`,
          html: `
            <h2>Yeni Sipariş Talebi</h2>
            <p><strong>Ad Soyad:</strong> ${full_name}</p>
            <p><strong>E-posta:</strong> ${email}</p>
            ${phone ? `<p><strong>Telefon:</strong> ${phone}</p>` : ""}
            <p><strong>Konu:</strong> ${subject}</p>
            ${product_slug ? `<p><strong>Eser:</strong> ${product_slug}</p>` : ""}
            <p><strong>Mesaj:</strong></p>
            <p style="background:#f5f5f5;padding:12px;border-radius:4px;">${message}</p>
          `,
        });
      } catch (emailError) {
        console.error("Email send error:", emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Beklenmeyen hata." }, { status: 500 });
  }
}
