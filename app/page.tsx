import { HomeHero } from "@/components/home/hero";
import { CategoryMarquee } from "@/components/home/category-marquee";
import { Facilities } from "@/components/home/facilities";
import { ClassesByCategory } from "@/components/home/classes-by-category";
import { FeaturedTrainers } from "@/components/home/featured-trainers";
import { Plans } from "@/components/home/plans";
import { FreeTrial } from "@/components/home/free-trial";
import { Transformations } from "@/components/home/transformations";
import { Reviews } from "@/components/home/reviews";
import { JoinCta } from "@/components/home/join-cta";

export default function Home() {
  return (
    <>
      <HomeHero />
      <CategoryMarquee />
      <Facilities />
      <ClassesByCategory />
      <FeaturedTrainers />
      <Plans />
      <FreeTrial />
      <Transformations />
      <Reviews />
      <JoinCta />
    </>
  );
}
