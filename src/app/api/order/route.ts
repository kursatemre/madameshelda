import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ref, full_name, email, phone, address, city, note, items, total, payment_method } = body;

    if (!full_name || !email || !phone || !address || !items?.length) {
      return NextResponse.json({ error: "Zorunlu alanlar eksik." }, { status: 400 });
    }

    const itemsText = items
      .map((i: { title: string; price: number }) => `• ${i.title}: ₺${i.price.toLocaleString("tr-TR")}`)
      .join("\n");

    const message = `Sipariş No: ${ref}

Ürünler:
${itemsText}

Toplam: ₺${total.toLocaleString("tr-TR")}
Ödeme Yöntemi: ${payment_method === "havale" ? "Havale/EFT" : "WhatsApp"}

Teslimat:
${address}
${city}

${note ? `Not: ${note}` : ""}`.trim();

    const supabase = await createServiceClient();

    await supabase.from("contact_requests").insert({
      full_name,
      email,
      phone,
      subject: `Sipariş #${ref}`,
      message,
      status: "pending",
    });

    if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
          from: "Madame Shelda <noreply@madameshelda.com>",
          to: process.env.ADMIN_EMAIL,
          subject: `Yeni Sipariş #${ref} — ₺${total.toLocaleString("tr-TR")}`,
          html: `<h2>Yeni Sipariş #${ref}</h2><p><b>Müşteri:</b> ${full_name} — ${email} — ${phone}</p><p><b>Adres:</b> ${address}, ${city}</p><p><b>Ödeme:</b> ${payment_method}</p><pre>${itemsText}</pre><p><b>Toplam: ₺${total.toLocaleString("tr-TR")}</b></p>`,
        });

        await resend.emails.send({
          from: "Madame Shelda <noreply@madameshelda.com>",
          to: email,
          subject: `Siparişiniz Alındı — #${ref}`,
          html: `<h2>Merhaba ${full_name},</h2><p>Siparişiniz alındı!</p><p><b>Sipariş No:</b> ${ref}</p><pre>${itemsText}</pre><p><b>Toplam: ₺${total.toLocaleString("tr-TR")}</b></p>${payment_method === "havale" ? "<p>Havale bilgileri için lütfen bize ulaşın veya WhatsApp'tan yazın.</p>" : "<p>WhatsApp üzerinden onay bekliyoruz.</p>"}`,
        });
      } catch (emailErr) {
        console.error("Email error:", emailErr);
      }
    }

    return NextResponse.json({ success: true, ref });
  } catch {
    return NextResponse.json({ error: "Beklenmeyen hata." }, { status: 500 });
  }
}
