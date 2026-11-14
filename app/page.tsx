import { HeroSection } from "@/components/voltix/hero-section";
import { CategorySection } from "@/components/voltix/category-section";
import { FeaturedProducts } from "@/components/voltix/featured-products";
import { FlashSale } from "@/components/voltix/flash-sale";
import { WhyChooseUs } from "@/components/voltix/why-choose-us";
import { ReviewsSection } from "@/components/voltix/reviews-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <FeaturedProducts />
      <FlashSale />
      <WhyChooseUs />
      <ReviewsSection />
    </>
  );
}
