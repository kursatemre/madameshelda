import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { workshop_id, full_name, email, phone, notes } = body;

    if (!workshop_id || !full_name || !email || !phone) {
      return NextResponse.json({ error: "Zorunlu alanlar eksik." }, { status: 400 });
    }

    const supabase = await createServiceClient();

    // Check capacity
    const { data: workshop, error: workshopError } = await supabase
      .from("workshops")
      .select("id, title, date, capacity, filled, is_active")
      .eq("id", workshop_id)
      .single();

    if (workshopError || !workshop) {
      return NextResponse.json({ error: "Workshop bulunamadı." }, { status: 404 });
    }

    if (!workshop.is_active) {
      return NextResponse.json({ error: "Bu workshop aktif değil." }, { status: 400 });
    }

    if (workshop.filled >= workshop.capacity) {
      return NextResponse.json({ error: "Bu workshop dolmuştur." }, { status: 400 });
    }

    // Check for duplicate registration
    const { data: existing } = await supabase
      .from("registrations")
      .select("id")
      .eq("workshop_id", workshop_id)
      .eq("email", email)
      .neq("status", "cancelled")
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: "Bu e-posta adresi ile zaten kayıt yapılmış." }, { status: 400 });
    }

    // Insert registration
    const { error: insertError } = await supabase.from("registrations").insert({
      workshop_id,
      full_name,
      email,
      phone,
      notes: notes || null,
      status: "pending",
    });

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return NextResponse.json({ error: "Kayıt sırasında hata oluştu." }, { status: 500 });
    }

    // Increment filled count
    await supabase
      .from("workshops")
      .update({ filled: workshop.filled + 1 })
      .eq("id", workshop_id);

    // Send confirmation email to registrant + admin notification
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);

        const dateFormatted = new Date(workshop.date).toLocaleDateString("tr-TR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });

        // Confirmation to registrant
        await resend.emails.send({
          from: "Madame Shelda <noreply@madameshelda.com>",
          to: email,
          subject: `Workshop Başvurunuz Alındı — ${workshop.title}`,
          html: `
            <h2>Başvurunuz alındı!</h2>
            <p>Merhaba ${full_name},</p>
            <p><strong>${workshop.title}</strong> workshopuna başvurunuz başarıyla alınmıştır.</p>
            <p><strong>Tarih:</strong> ${dateFormatted}</p>
            <p>Başvurunuz incelendikten sonra sizinle iletişime geçeceğiz.</p>
            <br/>
            <p>Madame Shelda Design Art</p>
          `,
        });

        // Admin notification
        if (process.env.ADMIN_EMAIL) {
          await resend.emails.send({
            from: "Madame Shelda <noreply@madameshelda.com>",
            to: process.env.ADMIN_EMAIL,
            subject: `Yeni Workshop Başvurusu: ${workshop.title}`,
            html: `
              <h2>Yeni Workshop Başvurusu</h2>
              <p><strong>Workshop:</strong> ${workshop.title} (${dateFormatted})</p>
              <p><strong>Ad Soyad:</strong> ${full_name}</p>
              <p><strong>E-posta:</strong> ${email}</p>
              <p><strong>Telefon:</strong> ${phone}</p>
              ${notes ? `<p><strong>Not:</strong> ${notes}</p>` : ""}
              <p><strong>Doluluk:</strong> ${workshop.filled + 1}/${workshop.capacity}</p>
            `,
          });
        }
      } catch (emailError) {
        console.error("Email send error:", emailError);
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Beklenmeyen hata." }, { status: 500 });
  }
}
