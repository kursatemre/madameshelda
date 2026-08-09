import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://madameshelda.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/galeri`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/workshoplar`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/hakkimizda`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/iletisim`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/kvkk`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/gizlilik-politikasi`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/mesafeli-satis-sozlesmesi`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/iptal-iade`, changeFrequency: "yearly", priority: 0.2 },
  ];

  let productPages: MetadataRoute.Sitemap = [];
  let workshopPages: MetadataRoute.Sitemap = [];

  try {
    const supabase = await createClient();
    const [{ data: products }, { data: workshops }] = await Promise.all([
      supabase.from("products").select("slug, updated_at").eq("is_available", true),
      supabase.from("workshops").select("slug, updated_at").eq("is_active", true),
    ]);

    if (products) {
      productPages = products.map((p) => ({
        url: `${SITE_URL}/eser/${p.slug}`,
        lastModified: p.updated_at ?? undefined,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    }
    if (workshops) {
      workshopPages = workshops.map((w) => ({
        url: `${SITE_URL}/workshop/${w.slug}`,
        lastModified: w.updated_at ?? undefined,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));
    }
  } catch {
    // Supabase erişilemiyorsa yalnızca statik sayfalarla devam edilir
  }

  return [...staticPages, ...productPages, ...workshopPages];
}
