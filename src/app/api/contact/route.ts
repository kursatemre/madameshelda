import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/client";
import { contactAdmin, contactReceivedCustomer } from "@/lib/email/templates";
import { contactSchema, firstIssueMessage } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: firstIssueMessage(parsed) }, { status: 400 });
    }
    const { full_name, email, phone, subject, message, product_slug } = parsed.data;

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

    const adminEmail = process.env.ADMIN_EMAIL ?? "admin@madameshelda.com";
    const admin = contactAdmin({ full_name, email, phone, subject, message, product_slug });
    const customer = contactReceivedCustomer({ full_name });

    await Promise.allSettled([
      sendEmail({ to: adminEmail, subject: admin.subject, html: admin.html }),
      sendEmail({ to: email, subject: customer.subject, html: customer.html }),
    ]);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Beklenmeyen hata." }, { status: 500 });
  }
}
