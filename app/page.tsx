import { ByCategorySection } from "@/components/store/sections/by-category";
import { FeaturedSection } from "@/components/store/sections/featured";
import { FlashSaleSection } from "@/components/store/sections/flash-sale";
import { HeroSection } from "@/components/store/sections/hero";
import { LookbookSection } from "@/components/store/sections/lookbook";
import { NewArrivalsSection } from "@/components/store/sections/new-arrivals";
import { NewsletterSection } from "@/components/store/sections/newsletter";
import { ShowcaseSection } from "@/components/store/sections/showcase";
import { TestimonialsSection } from "@/components/store/sections/testimonials";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ShowcaseSection />
      <NewArrivalsSection />
      <ByCategorySection />
      <FeaturedSection />
      <FlashSaleSection />
      <LookbookSection />
      <TestimonialsSection />
      <NewsletterSection />
    </>
  );
}
