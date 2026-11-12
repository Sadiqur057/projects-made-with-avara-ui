import { Bestsellers } from "@/components/store/sections/bestsellers";
import { FeaturedProduct } from "@/components/store/sections/featured-product";
import { FlashSale } from "@/components/store/sections/flash-sale";
import { Hero } from "@/components/store/sections/hero";
import { HomeReviews } from "@/components/store/sections/home-reviews";
import { IngredientsSpotlight } from "@/components/store/sections/ingredients-spotlight";
import { NewsletterCta } from "@/components/store/sections/newsletter-cta";
import { ShopByConcern } from "@/components/store/sections/shop-by-concern";

export default function Home() {
  return (
    <>
      <Hero />
      <Bestsellers />
      <ShopByConcern />
      <FeaturedProduct />
      <IngredientsSpotlight />
      <FlashSale />
      <HomeReviews />
      <NewsletterCta />
    </>
  );
}
