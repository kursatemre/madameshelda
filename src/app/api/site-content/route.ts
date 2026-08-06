import { NextResponse } from "next/server";
import { getAllSiteContent } from "@/lib/site-content";

// Public — site içeriği (iletişim bilgileri, banka/WhatsApp vb.) zaten sitede
// herkese açık gösteriliyor. Bu rota yalnızca client component'lerin
// (ör. ödeme sayfası) sunucu tarafında doğrudan Supabase okuyamadığı
// durumlar için var.
export async function GET() {
  return NextResponse.json(await getAllSiteContent());
}
