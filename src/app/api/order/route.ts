import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ref, full_name, email, phone, address, city, note, items, total, payment_method } = body;

    if (!full_name || !email || !phone || !address || !items?.length) {
      return NextResponse.json({ error: "Zorunlu alanlar eksik." }, { status: 400 });
    }

    const supabase = await createServiceClient();

    const { error } = await supabase.from("orders").insert({
      ref,
      full_name,
      email,
      phone,
      address,
      city,
      note: note || null,
      items,
      total,
      payment_method,
      status: "pending",
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        const from = process.env.RESEND_FROM_EMAIL ?? "Madame Shelda <noreply@madameshelda.com>";
        const adminEmail = process.env.ADMIN_EMAIL ?? "admin@madameshelda.com";

        const itemsHtml = items
          .map((i: { title: string; variantName?: string; price: number }) =>
            `<tr><td style="padding:6px 0;border-bottom:1px solid #f0ede8">${i.title}${i.variantName ? ` <span style="color:#888480">(${i.variantName})</span>` : ""}</td><td style="text-align:right;padding:6px 0;border-bottom:1px solid #f0ede8">₺${i.price.toLocaleString("tr-TR")}</td></tr>`
          )
          .join("");

        const baseStyle = `font-family:'Georgia',serif;color:#1a1a1a;`;

        await Promise.allSettled([
          resend.emails.send({
            from,
            to: adminEmail,
            subject: `🛍 Yeni Sipariş #${ref} — ₺${total.toLocaleString("tr-TR")}`,
            html: `<div style="${baseStyle}max-width:560px;margin:0 auto;padding:32px">
              <h2 style="color:#5c1a2e;margin-bottom:4px">Yeni Sipariş #${ref}</h2>
              <p style="color:#888480;font-size:13px;margin-top:0">${new Date().toLocaleString("tr-TR")}</p>
              <table width="100%" style="margin:20px 0"><tbody>${itemsHtml}</tbody>
                <tfoot><tr><td style="padding-top:12px;font-weight:bold">Toplam</td><td style="text-align:right;padding-top:12px;color:#5c1a2e;font-size:18px">₺${total.toLocaleString("tr-TR")}</td></tr></tfoot>
              </table>
              <hr style="border:none;border-top:1px solid #f0ede8;margin:20px 0"/>
              <table style="font-size:13px;width:100%"><tbody>
                <tr><td style="color:#888480;width:100px">Müşteri</td><td>${full_name}</td></tr>
                <tr><td style="color:#888480">E-posta</td><td><a href="mailto:${email}">${email}</a></td></tr>
                <tr><td style="color:#888480">Telefon</td><td><a href="tel:${phone}">${phone}</a></td></tr>
                <tr><td style="color:#888480">Adres</td><td>${address}, ${city}</td></tr>
                <tr><td style="color:#888480">Ödeme</td><td>${payment_method === "havale" ? "Havale/EFT" : "WhatsApp"}</td></tr>
                ${note ? `<tr><td style="color:#888480">Not</td><td>${note}</td></tr>` : ""}
              </tbody></table>
            </div>`,
          }),
          resend.emails.send({
            from,
            to: email,
            subject: `Siparişiniz Alındı — #${ref}`,
            html: `<div style="${baseStyle}max-width:560px;margin:0 auto;padding:32px">
              <h2 style="color:#5c1a2e">Merhaba ${full_name},</h2>
              <p>Siparişiniz başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz.</p>
              <p style="font-size:13px;color:#888480">Sipariş No: <strong style="color:#1a1a1a">${ref}</strong></p>
              <table width="100%" style="margin:20px 0;font-size:14px"><tbody>${itemsHtml}</tbody>
                <tfoot><tr><td style="padding-top:12px;font-weight:bold">Toplam</td><td style="text-align:right;padding-top:12px;color:#5c1a2e;font-size:18px">₺${total.toLocaleString("tr-TR")}</td></tr></tfoot>
              </table>
              ${payment_method === "havale" ? `<div style="background:#fdf8f3;padding:16px;margin-top:20px;font-size:13px"><p style="margin:0 0 8px;font-weight:bold">Havale Bilgileri</p><p style="margin:0;color:#888480">Bankamız ve IBAN bilgileri için WhatsApp üzerinden bize ulaşabilirsiniz.</p></div>` : `<p style="font-size:13px;color:#888480">WhatsApp üzerinden sipariş onayı bekliyoruz.</p>`}
              <hr style="border:none;border-top:1px solid #f0ede8;margin:24px 0"/>
              <p style="font-size:12px;color:#888480;text-align:center">Madame Shelda Design Art · Soma, Manisa</p>
            </div>`,
          }),
        ]);
      } catch (emailErr) {
        console.error("Email error:", emailErr);
      }
    }

    return NextResponse.json({ success: true, ref });
  } catch {
    return NextResponse.json({ error: "Beklenmeyen hata." }, { status: 500 });
  }
}
