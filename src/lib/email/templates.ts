import { emailShell, moneyTR } from "./client";

export type OrderItem = { title: string; price: number; variantName?: string; variantHex?: string };

function itemsTableHtml(items: OrderItem[], total: number): string {
  const rows = items
    .map(
      (i) =>
        `<tr><td style="padding:6px 0;border-bottom:1px solid #f0ede8">${i.title}${
          i.variantName ? ` <span style="color:#888480">(${i.variantName})</span>` : ""
        }</td><td style="text-align:right;padding:6px 0;border-bottom:1px solid #f0ede8">${moneyTR(i.price)}</td></tr>`
    )
    .join("");
  return `<table width="100%" style="margin:20px 0;font-size:14px"><tbody>${rows}</tbody>
    <tfoot><tr><td style="padding-top:12px;font-weight:bold">Toplam</td><td style="text-align:right;padding-top:12px;color:#5c1a2e;font-size:18px">${moneyTR(total)}</td></tr></tfoot>
  </table>`;
}

const paymentLabel = (method: string) => (method === "havale" ? "Havale/EFT" : "WhatsApp");

/* ────────────────────────────── Sipariş ────────────────────────────── */

export function orderReceivedAdmin(o: {
  ref: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  note?: string | null;
  items: OrderItem[];
  total: number;
  payment_method: string;
}) {
  return {
    subject: `🛍 Yeni Sipariş #${o.ref} — ${moneyTR(o.total)}`,
    html: emailShell({
      footer: false,
      bodyHtml: `<h2 style="color:#5c1a2e;margin-bottom:4px">Yeni Sipariş #${o.ref}</h2>
        <p style="color:#888480;font-size:13px;margin-top:0">${new Date().toLocaleString("tr-TR")}</p>
        ${itemsTableHtml(o.items, o.total)}
        <table style="font-size:13px;width:100%"><tbody>
          <tr><td style="color:#888480;width:100px">Müşteri</td><td>${o.full_name}</td></tr>
          <tr><td style="color:#888480">E-posta</td><td><a href="mailto:${o.email}">${o.email}</a></td></tr>
          <tr><td style="color:#888480">Telefon</td><td><a href="tel:${o.phone}">${o.phone}</a></td></tr>
          <tr><td style="color:#888480">Adres</td><td>${o.address}, ${o.city}</td></tr>
          <tr><td style="color:#888480">Ödeme</td><td>${paymentLabel(o.payment_method)}</td></tr>
          ${o.note ? `<tr><td style="color:#888480">Not</td><td>${o.note}</td></tr>` : ""}
        </tbody></table>`,
    }),
  };
}

export function orderReceivedCustomer(o: {
  ref: string;
  full_name: string;
  items: OrderItem[];
  total: number;
  payment_method: string;
}) {
  return {
    subject: `Siparişiniz Alındı — #${o.ref}`,
    html: emailShell({
      heading: `Merhaba ${o.full_name},`,
      bodyHtml: `<p>Siparişiniz başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz.</p>
        <p style="font-size:13px;color:#888480">Sipariş No: <strong style="color:#1a1a1a">${o.ref}</strong></p>
        ${itemsTableHtml(o.items, o.total)}
        ${
          o.payment_method === "havale"
            ? `<div style="background:#fdf8f3;padding:16px;margin-top:20px;font-size:13px"><p style="margin:0 0 8px;font-weight:bold">Havale Bilgileri</p><p style="margin:0;color:#888480">Bankamız ve IBAN bilgileri için WhatsApp üzerinden bize ulaşabilirsiniz.</p></div>`
            : `<p style="font-size:13px;color:#888480">WhatsApp üzerinden sipariş onayı bekliyoruz.</p>`
        }`,
    }),
  };
}

export function orderStatusChanged(o: {
  ref: string;
  full_name: string;
  items: OrderItem[];
  total: number;
  status: "confirmed" | "cancelled";
}) {
  const confirmed = o.status === "confirmed";
  return {
    subject: confirmed ? `Siparişiniz Onaylandı — #${o.ref}` : `Siparişiniz İptal Edildi — #${o.ref}`,
    html: emailShell({
      heading: `Merhaba ${o.full_name},`,
      bodyHtml: `<p>${
        confirmed
          ? `<strong style="color:#5c1a2e">#${o.ref}</strong> numaralı siparişiniz onaylandı ve hazırlanmaya başlandı.`
          : `<strong style="color:#5c1a2e">#${o.ref}</strong> numaralı siparişiniz iptal edildi. Bir yanlışlık olduğunu düşünüyorsanız bize ulaşabilirsiniz.`
      }</p>
      ${itemsTableHtml(o.items, o.total)}`,
    }),
  };
}

/* ────────────────────────────── Workshop ────────────────────────────── */

function formatWorkshopDate(date: string) {
  return new Date(date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

export function workshopRegistrationCustomer(w: { full_name: string; workshopTitle: string; workshopDate: string }) {
  return {
    subject: `Workshop Başvurunuz Alındı — ${w.workshopTitle}`,
    html: emailShell({
      heading: "Başvurunuz alındı!",
      bodyHtml: `<p>Merhaba ${w.full_name},</p>
        <p><strong>${w.workshopTitle}</strong> workshopuna başvurunuz başarıyla alınmıştır.</p>
        <p><strong>Tarih:</strong> ${formatWorkshopDate(w.workshopDate)}</p>
        <p>Başvurunuz incelendikten sonra sizinle iletişime geçeceğiz.</p>`,
    }),
  };
}

export function workshopRegistrationAdmin(w: {
  full_name: string;
  email: string;
  phone: string;
  notes?: string | null;
  workshopTitle: string;
  workshopDate: string;
  filled: number;
  capacity: number;
}) {
  return {
    subject: `Yeni Workshop Başvurusu: ${w.workshopTitle}`,
    html: emailShell({
      footer: false,
      bodyHtml: `<h2 style="color:#5c1a2e;margin-bottom:4px">Yeni Workshop Başvurusu</h2>
        <table style="font-size:13px;width:100%;margin-top:12px"><tbody>
          <tr><td style="color:#888480;width:100px">Workshop</td><td>${w.workshopTitle} (${formatWorkshopDate(w.workshopDate)})</td></tr>
          <tr><td style="color:#888480">Ad Soyad</td><td>${w.full_name}</td></tr>
          <tr><td style="color:#888480">E-posta</td><td><a href="mailto:${w.email}">${w.email}</a></td></tr>
          <tr><td style="color:#888480">Telefon</td><td><a href="tel:${w.phone}">${w.phone}</a></td></tr>
          ${w.notes ? `<tr><td style="color:#888480">Not</td><td>${w.notes}</td></tr>` : ""}
          <tr><td style="color:#888480">Doluluk</td><td>${w.filled}/${w.capacity}</td></tr>
        </tbody></table>`,
    }),
  };
}

export function workshopStatusChanged(w: {
  full_name: string;
  workshopTitle: string;
  workshopDate: string;
  status: "confirmed" | "cancelled";
}) {
  const confirmed = w.status === "confirmed";
  return {
    subject: confirmed
      ? `Workshop Başvurunuz Onaylandı — ${w.workshopTitle}`
      : `Workshop Başvurunuz İptal Edildi — ${w.workshopTitle}`,
    html: emailShell({
      heading: `Merhaba ${w.full_name},`,
      bodyHtml: `<p>${
        confirmed
          ? `<strong style="color:#5c1a2e">${w.workshopTitle}</strong> workshopuna katılımınız onaylandı. Sizi ${formatWorkshopDate(w.workshopDate)} tarihinde atölyemizde ağırlamaktan mutluluk duyacağız.`
          : `<strong style="color:#5c1a2e">${w.workshopTitle}</strong> (${formatWorkshopDate(w.workshopDate)}) workshopuna başvurunuz iptal edildi. Bir yanlışlık olduğunu düşünüyorsanız bize ulaşabilirsiniz.`
      }</p>`,
    }),
  };
}

/* ────────────────────────────── İletişim ────────────────────────────── */

export function contactAdmin(c: {
  full_name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  product_slug?: string | null;
}) {
  return {
    subject: `Yeni Sipariş Talebi: ${c.subject}`,
    html: emailShell({
      footer: false,
      bodyHtml: `<h2 style="color:#5c1a2e;margin-bottom:4px">Yeni İletişim Talebi</h2>
        <table style="font-size:13px;width:100%;margin-top:12px"><tbody>
          <tr><td style="color:#888480;width:100px">Ad Soyad</td><td>${c.full_name}</td></tr>
          <tr><td style="color:#888480">E-posta</td><td><a href="mailto:${c.email}">${c.email}</a></td></tr>
          ${c.phone ? `<tr><td style="color:#888480">Telefon</td><td><a href="tel:${c.phone}">${c.phone}</a></td></tr>` : ""}
          <tr><td style="color:#888480">Konu</td><td>${c.subject}</td></tr>
          ${c.product_slug ? `<tr><td style="color:#888480">Eser</td><td>${c.product_slug}</td></tr>` : ""}
        </tbody></table>
        <p style="color:#888480;margin-bottom:6px">Mesaj:</p>
        <p style="background:#fdf8f3;padding:12px;margin:0">${c.message}</p>`,
    }),
  };
}

export function contactReceivedCustomer(c: { full_name: string }) {
  return {
    subject: "Mesajınız Alındı — Madame Shelda",
    html: emailShell({
      heading: `Merhaba ${c.full_name},`,
      bodyHtml: `<p>Mesajınız bize ulaştı. En kısa sürede sizinle iletişime geçeceğiz.</p>`,
    }),
  };
}
