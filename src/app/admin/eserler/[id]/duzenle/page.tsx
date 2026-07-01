import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import EserForm from "@/components/admin/EserForm";
import type { ProductCategory, ProductVariant } from "@/data/products";

export default async function DuzenleEserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServiceClient();
  const { data } = await supabase.from("products").select("*").eq("id", id).single();
  if (!data) notFound();

  const variants = (Array.isArray(data.variants) ? data.variants : []) as ProductVariant[];

  return (
    <EserForm
      productId={id}
      initial={{
        title: data.title,
        slug: data.slug,
        category: (data.category as ProductCategory) || "ev",
        price: data.price?.toString() ?? "",
        description: data.description ?? "",
        dimensions: data.dimensions ?? "",
        materials: data.materials ?? "",
        images: (data.images ?? []).map((url: string, i: number) => ({ id: String(i), url })),
        variants: variants.map((v) => ({
          id: v.id ?? String(Math.random()),
          name: v.name,
          hex: v.hex,
          price: v.price?.toString() ?? "",
          available: v.available,
          image: v.image ?? "",
        })),
        is_available: data.is_available,
        is_featured: data.is_featured,
      }}
    />
  );
}
