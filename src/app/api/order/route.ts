import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/client";
import { orderReceivedAdmin, orderReceivedCustomer } from "@/lib/email/templates";
import { orderSchema, firstIssueMessage } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: firstIssueMessage(parsed) }, { status: 400 });
    }
    const { ref, full_name, email, phone, address, city, note, items, total, payment_method } = parsed.data;

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

    const adminEmail = process.env.ADMIN_EMAIL ?? "admin@madameshelda.com";
    const admin = orderReceivedAdmin({ ref, full_name, email, phone, address, city, note, items, total, payment_method });
    const customer = orderReceivedCustomer({ ref, full_name, items, total, payment_method });

    await Promise.allSettled([
      sendEmail({ to: adminEmail, subject: admin.subject, html: admin.html }),
      sendEmail({ to: email, subject: customer.subject, html: customer.html }),
    ]);

    return NextResponse.json({ success: true, ref });
  } catch {
    return NextResponse.json({ error: "Beklenmeyen hata." }, { status: 500 });
  }
}
