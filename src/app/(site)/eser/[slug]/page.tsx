import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { mapDBProduct, getProduct } from "@/data/products";
import EserDetayClient from "@/components/eser/EserDetayClient";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("products").select("title, description, images").eq("slug", slug).single();
    if (data) {
      const image = data.images?.[0];
      return {
        title: `${data.title} — Madame Shelda`,
        description: data.description ?? undefined,
        openGraph: image ? { images: [{ url: image, width: 1200, height: 1200 }] } : undefined,
      };
    }
  } catch {}
  const product = getProduct(slug);
  if (!product) return {};
  return { title: `${product.title} — Madame Shelda`, description: product.description };
}

export default async function EserDetayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let product = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .single();
    if (data) product = mapDBProduct(data);
  } catch {}

  if (!product) product = getProduct(slug) ?? null;
  if (!product) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images && product.images.length > 0 ? product.images : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "TRY",
      price: product.price,
      availability: product.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <EserDetayClient product={product} />
    </>
  );
}
