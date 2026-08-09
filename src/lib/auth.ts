/**
 * Server-only DAL — o anki isteğin gerçek Supabase Auth oturumunu doğrular.
 * `createClient()` (@/lib/supabase/server) `next/headers` kullandığı için
 * bu dosya client component'lerden import EDİLEMEZ (build hatası verir) —
 * `@/lib/site-content` ile aynı kalıp.
 */
import { createClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
