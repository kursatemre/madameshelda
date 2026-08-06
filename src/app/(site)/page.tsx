import { Hero } from "@/components/home/Hero";
import { FeaturedGallery, type FeaturedProduct } from "@/components/home/FeaturedGallery";
import { WorkshopTeaser, type TeaserWorkshop } from "@/components/home/WorkshopTeaser";
import { CtaBanner } from "@/components/home/CtaBanner";
import { getSiteContent } from "@/lib/site-content";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const contentPromise = getSiteContent(["home_hero", "home_featured", "home_workshop_teaser", "home_cta"]);

  let featuredProducts: FeaturedProduct[] = [];
  let teaserWorkshops: TeaserWorkshop[] = [];
  try {
    const supabase = await createClient();
    const [{ data: products }, { data: workshops }] = await Promise.all([
      supabase
        .from("products")
        .select("slug, title, category, images")
        .eq("is_featured", true)
        .eq("is_available", true)
        .order("created_at", { ascending: false })
        .limit(4),
      supabase
        .from("workshops")
        .select("slug, title, description, level, image_url")
        .eq("is_active", true)
        .order("created_at", { ascending: true })
        .limit(3),
    ]);
    if (products) featuredProducts = products;
    if (workshops) teaserWorkshops = workshops;
  } catch {
    // Supabase erişilemiyorsa bileşenler kendi mock verilerine düşer
  }

  const content = await contentPromise;

  return (
    <>
      <Hero content={content.home_hero} />
      <FeaturedGallery content={content.home_featured} products={featuredProducts} />
      <WorkshopTeaser content={content.home_workshop_teaser} workshops={teaserWorkshops} />
      <CtaBanner content={content.home_cta} />
    </>
  );
}
