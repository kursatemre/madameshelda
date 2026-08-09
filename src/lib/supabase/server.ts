import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}

/**
 * Service-role client — bilinçli olarak `@supabase/ssr`'in cookie/oturum
 * farkındalığı OLMADAN, düz `@supabase/supabase-js` ile kurulur.
 *
 * Önceki hali `createServerClient` + cookie adapter kullanıyordu; bu, o anki
 * istekte aktif bir Supabase Auth oturumu (ör. giriş yapmış bir müşteri)
 * varsa, "service" client'ın sessizce o kullanıcının oturum JWT'sini
 * kullanmasına yol açıyordu — yani sorgu `service_role` değil o kullanıcının
 * `authenticated` rolüyle çalışıyordu ve RLS politikası olmayan tablolarda
 * (coupons, orders'a insert vb.) ya sessizce boş sonuç dönüyor ya da
 * "new row violates row-level security policy" hatası veriyordu. Bu, misafir
 * isteklerinde (Supabase oturumu hiç yok) fark edilmiyordu — üye girişi
 * eklenince ortaya çıktı. Bu fonksiyon artık çağıranın oturumundan tamamen
 * bağımsız, her zaman saf service_role yetkisiyle çalışır.
 */
export function createServiceClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
