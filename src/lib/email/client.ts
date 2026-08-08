/**
 * Paylaşılan e-posta gönderim yardımcıları.
 *
 * `RESEND_API_KEY` tanımlı değilse `sendEmail` sessizce atlar (mevcut
 * davranış) — form/route asla e-posta yüzünden başarısız olmaz. Anahtar
 * eklendiğinde hiçbir kod değişikliği gerekmez, sadece gönderim başlar.
 */

type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
};

type SendEmailResult =
  | { sent: true }
  | { sent: false; reason: "no-api-key" | "error"; error?: unknown };

export async function sendEmail({ to, subject, html }: SendEmailInput): Promise<SendEmailResult> {
  if (!process.env.RESEND_API_KEY) {
    return { sent: false, reason: "no-api-key" };
  }
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = process.env.RESEND_FROM_EMAIL ?? "Madame Shelda <noreply@madameshelda.com>";
    const { error } = await resend.emails.send({ from, to, subject, html });
    if (error) {
      console.error("E-posta gönderim hatası:", error);
      return { sent: false, reason: "error", error };
    }
    return { sent: true };
  } catch (error) {
    console.error("E-posta gönderim hatası:", error);
    return { sent: false, reason: "error", error };
  }
}

/** Tüm şablonların ortak markaya uygun sarmalayıcısı. */
export function emailShell({
  heading,
  bodyHtml,
  footer = true,
}: {
  heading?: string;
  bodyHtml: string;
  /** Müşteriye giden e-postalarda marka imzası gösterilir; iç/admin bildirimlerinde kapatılabilir. */
  footer?: boolean;
}): string {
  return `<div style="font-family:'Georgia',serif;color:#1a1a1a;max-width:560px;margin:0 auto;padding:32px">
    ${heading ? `<h2 style="color:#5c1a2e;margin:0 0 4px">${heading}</h2>` : ""}
    ${bodyHtml}
    ${footer ? `<hr style="border:none;border-top:1px solid #f0ede8;margin:24px 0"/>
    <p style="font-size:12px;color:#888480;text-align:center">Madame Shelda Design Art · Soma, Manisa</p>` : ""}
  </div>`;
}

/** Sipariş/ürün satırları için ortak tablo hücresi biçimlendirici. */
export function moneyTR(n: number): string {
  return `₺${n.toLocaleString("tr-TR")}`;
}
