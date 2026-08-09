import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://madameshelda.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin", "/api", "/odeme",
        "/giris", "/kayit", "/sifremi-unuttum", "/sifre-sifirla", "/hesabim",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
