import { createClient } from "@/lib/supabase/server";
import { SITE_CONTENT_DEFAULTS, type SiteContent } from "@/lib/site-content-defaults";

export * from "@/lib/site-content-defaults";

/**
 * Server-only: `site_settings`'ten okur, DB değerini default'un üzerine
 * merge eder. Tablo henüz yoksa (migration çalışmamış) veya Supabase'e
 * erişilemiyorsa sessizce default'lara düşer — site asla kırılmaz
 * (workshoplar/page.tsx'teki try/catch kalıbıyla aynı yaklaşım).
 *
 * Client component'lerden import ETMEYİN — `next/headers` zincirini
 * client bundle'a taşır. Tipler/varsayılanlar için `@/lib/site-content-defaults`
 * kullanın (ör. src/app/admin/site-icerigi/page.tsx).
 */

function mergeSection<K extends keyof SiteContent>(key: K, value: unknown): SiteContent[K] {
  const base = SITE_CONTENT_DEFAULTS[key];
  if (!value || typeof value !== "object" || Array.isArray(value)) return base;
  return { ...base, ...(value as Partial<SiteContent[K]>) };
}

export async function getSiteContent<K extends keyof SiteContent>(
  keys: K[]
): Promise<Pick<SiteContent, K>> {
  const result = {} as Pick<SiteContent, K>;
  for (const k of keys) result[k] = SITE_CONTENT_DEFAULTS[k];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("key, value")
      .in("key", keys as string[]);
    if (error) throw error;
    for (const row of data ?? []) {
      if ((keys as string[]).includes(row.key)) {
        result[row.key as K] = mergeSection(row.key as K, row.value);
      }
    }
  } catch {
    // migration çalışmamış / Supabase erişilemiyor — default'lar zaten hazır
  }

  return result;
}

export async function getAllSiteContent(): Promise<SiteContent> {
  const keys = Object.keys(SITE_CONTENT_DEFAULTS) as (keyof SiteContent)[];
  return getSiteContent(keys) as Promise<SiteContent>;
}
