import { Hero } from "@/components/home/Hero";
import { FeaturedGallery } from "@/components/home/FeaturedGallery";
import { WorkshopTeaser } from "@/components/home/WorkshopTeaser";
import { CtaBanner } from "@/components/home/CtaBanner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedGallery />
      <WorkshopTeaser />
      <CtaBanner />
    </>
  );
}
