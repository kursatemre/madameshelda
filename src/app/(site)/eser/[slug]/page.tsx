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
    const { data } = await supabase.from("products").select("title, description").eq("slug", slug).single();
    if (data) {
      return { title: `${data.title} — Madame Shelda`, description: data.description ?? undefined };
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

  return <EserDetayClient product={product} />;
}
