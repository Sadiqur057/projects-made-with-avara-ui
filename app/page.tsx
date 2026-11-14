import { DishesSection } from "@/components/ember/DishesSection";
import { HeroSection } from "@/components/ember/HeroSection";
import { NewsletterSection } from "@/components/ember/NewsletterSection";
import { ReviewsSection } from "@/components/ember/ReviewsSection";
import { SiteFooter } from "@/components/ember/SiteFooter";
import { SiteNavbar } from "@/components/ember/SiteNavbar";
import { SpecialSection } from "@/components/ember/SpecialSection";
import { StorySection } from "@/components/ember/StorySection";

export default function Home() {
  return (
    <>
      <SiteNavbar />
      <main>
        <HeroSection />
        <DishesSection />
        <StorySection />
        <SpecialSection />
        <ReviewsSection />
        <NewsletterSection />
      </main>
      <SiteFooter />
    </>
  );
}
