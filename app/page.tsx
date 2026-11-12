import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HomeHero, HeroSearch } from "@/components/home/home-hero";
import { DestinationGallery } from "@/components/home/destination-gallery";
import { CategoryPackages } from "@/components/home/category-packages";
import { FeaturedTour } from "@/components/home/featured-tour";
import { DealsGrid } from "@/components/home/deals-section";
import { WhyUs } from "@/components/home/why-us";
import { ReviewsSection } from "@/components/home/reviews-section";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { Section } from "@/components/site/page-header";

const seeAll = (href: string, label: string) => (
  <Link href={href} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
    {label} <ArrowRight className="size-4" />
  </Link>
);

export default function Home() {
  return (
    <>
      <HomeHero />
      <HeroSearch />

      <Section
        eyebrow="Destinations"
        title="Fourteen places worth the journey"
        description="From volcano sunrises to desert camps. Pick a destination and see the trips we run there."
        action={seeAll("/destinations", "All destinations")}
      >
        <DestinationGallery />
      </Section>

      <Section
        eyebrow="Packages"
        title="Find a trip that fits how you travel"
        description="Beach, adventure, culture, luxury or wildlife. Every package is hosted, small-group and fully priced."
      >
        <CategoryPackages />
      </Section>

      <Section className="pt-0 sm:pt-0" eyebrow="Featured tour" title="Our tour of the season">
        <FeaturedTour />
      </Section>

      <div id="deals" className="scroll-mt-0 bg-[color-mix(in_oklab,var(--primary)_55%,black)] text-white">
        <Section
          tone="dark"
          eyebrow="Last-minute deals"
          title="Leaving soon, priced lower"
          description="Unsold places on departures within the next two weeks. When the timer ends, the price goes back up."
        >
          <DealsGrid />
        </Section>
      </div>

      <Section eyebrow="Why Wayfare" title="Trips that are easy to book and hard to forget">
        <WhyUs />
      </Section>

      <section aria-labelledby="reviews-heading" className="bg-secondary/60 py-16 sm:py-24">
        <div className="mx-auto mb-4 w-full max-w-7xl px-5 sm:px-8">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-primary">Traveller reviews</p>
          <h2 id="reviews-heading" className="max-w-2xl text-balance text-3xl font-semibold sm:text-4xl">
            Postcards from people who went
          </h2>
        </div>
        <ReviewsSection />
      </section>

      <NewsletterSection />
    </>
  );
}
