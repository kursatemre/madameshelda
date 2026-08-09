import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { cartSyncSchema } from "@/lib/validation";
import type { Database } from "@/types/database";

/**
 * Sepeti (ve varsa e-postayı) sunucuda `cart_sessions`'a yazar — terk
 * edilmiş sepet hatırlatma maili için tek veri kaynağı. Public, ama sadece
 * upsert; okuma/silme yok. Hata sessizce yutulur — bu endpoint asla
 * kullanıcı deneyimini bozmamalı (CartContext fire-and-forget çağırır).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = cartSyncSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });
    const { session_id, items, subtotal, email } = parsed.data;

    const patch: Database["public"]["Tables"]["cart_sessions"]["Insert"] = {
      session_id,
      last_activity_at: new Date().toISOString(),
    };
    if (items !== undefined) patch.items = items;
    if (subtotal !== undefined) patch.subtotal = subtotal;
    if (email !== undefined) patch.email = email.toLowerCase();

    const supabase = await createServiceClient();
    const { error } = await supabase.from("cart_sessions").upsert(patch, { onConflict: "session_id" });
    if (error) return NextResponse.json({ ok: false }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
