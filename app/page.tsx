import { CommunityStats } from "@/components/forum/home/community-stats";
import { HeroSection } from "@/components/forum/home/hero-section";
import { PopularCategories } from "@/components/forum/home/popular-categories";
import { TopContributors } from "@/components/forum/home/top-contributors";
import { TrendingSection } from "@/components/forum/home/trending-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PopularCategories />
      <TrendingSection />
      <TopContributors />
      <CommunityStats />
    </>
  );
}
