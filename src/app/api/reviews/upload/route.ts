import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Yorum fotoğrafları için PUBLIC (auth gerektirmeyen) yükleme — `/api/admin/upload`
 * ile aynı depoyu (`images` bucket) kullanır ama admin kontrolü yok, bu
 * yüzden dosya boyutu sınırı ekleniyor ve ayrı bir `reviews/` klasörüne yazılır.
 */
export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 });
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Yalnızca görsel dosyası yüklenebilir." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Görsel en fazla 5MB olabilir." }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `reviews/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const bytes = await file.arrayBuffer();
  const supabase = await createServiceClient();

  const { error } = await supabase.storage
    .from("images")
    .upload(path, bytes, { contentType: file.type, upsert: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: { publicUrl } } = supabase.storage.from("images").getPublicUrl(path);

  return NextResponse.json({ url: publicUrl });
}
