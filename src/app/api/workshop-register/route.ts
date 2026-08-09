import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/client";
import { workshopRegistrationAdmin, workshopRegistrationCustomer } from "@/lib/email/templates";
import { workshopRegisterSchema, firstIssueMessage } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = workshopRegisterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: firstIssueMessage(parsed) }, { status: 400 });
    }
    const { workshop_id, full_name, email, phone, notes } = parsed.data;

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
    const newFilled = workshop.filled + 1;
    await supabase
      .from("workshops")
      .update({ filled: newFilled })
      .eq("id", workshop_id);

    const adminEmail = process.env.ADMIN_EMAIL ?? "admin@madameshelda.com";
    const customer = workshopRegistrationCustomer({
      full_name,
      workshopTitle: workshop.title,
      workshopDate: workshop.date,
    });
    const admin = workshopRegistrationAdmin({
      full_name,
      email,
      phone,
      notes,
      workshopTitle: workshop.title,
      workshopDate: workshop.date,
      filled: newFilled,
      capacity: workshop.capacity,
    });

    await Promise.allSettled([
      sendEmail({ to: email, subject: customer.subject, html: customer.html }),
      sendEmail({ to: adminEmail, subject: admin.subject, html: admin.html }),
    ]);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Beklenmeyen hata." }, { status: 500 });
  }
}
