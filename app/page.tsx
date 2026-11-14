import { SiteLink } from "@/components/site/SiteLink";
import { HeroCarousel } from "@/components/custom/blocks/HeroCarouselBlock";
import { CounterSection } from "@/components/custom/blocks/CounterSectionBlock";
import { ReviewsBlock, type ReviewItem } from "@/components/custom/blocks/ReviewsBlock";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PropertyTypes } from "@/components/site/PropertyTypes";
import { FeaturedListings } from "@/components/site/FeaturedListings";
import { HowItWorks } from "@/components/site/HowItWorks";
import { PORTRAITS, img } from "@/lib/properties";

const SLIDES = [
  {
    image: img("1613490493576-7fde63acd811", 2000),
    alt: "A modern villa with a pool at dusk",
    title: "Harborview Modern Villa",
    description: "5 bed · 4 bath · Austin, TX — $1,285,000",
    heading: (
      <>
        Find the home
        <br />
        that fits your life
      </>
    ),
  },
  {
    image: img("1568605114967-8130f3a36994", 2000),
    alt: "A welcoming family house with a front lawn",
    title: "Oakline Family Residence",
    description: "4 bed · 3 bath · Denver, CO — $689,000",
    heading: (
      <>
        Room for family,
        <br />
        and for Sunday dinners
      </>
    ),
  },
  {
    image: img("1545324418-cc1a3fa10c00", 2000),
    alt: "A city apartment building at golden hour",
    title: "Skyline Corner Loft",
    description: "2 bed · 2 bath · Chicago, IL — $425,000",
    heading: (
      <>
        City views,
        <br />
        a short walk from everything
      </>
    ),
  },
];

const AVATARS = [
  { src: PORTRAITS.a, alt: "Client Priya", name: "Priya S.", designation: "First-time buyer" },
  { src: PORTRAITS.b, alt: "Client Daniel", name: "Daniel R.", designation: "Relocating family" },
  { src: PORTRAITS.c, alt: "Client Amara", name: "Amara O.", designation: "Investor" },
  { src: PORTRAITS.d, alt: "Client Marcus", name: "Marcus L.", designation: "Seller" },
  { src: PORTRAITS.e, alt: "Client Tom", name: "Tom H.", designation: "Downsizer" },
];

const STATS = [
  {
    value: 2400,
    suffix: "+",
    label: "/HOMES SOLD",
    sublabel: "Families and investors who found their place with us",
    tag: "Since 2009",
  },
  {
    value: 1.8,
    prefix: "$",
    suffix: "B",
    decimals: 1,
    label: "/SALES VOLUME",
    sublabel: "Closed across 14 neighbourhoods and growing",
    tag: "+22% YoY",
  },
  {
    value: 21,
    suffix: " days",
    label: "/AVERAGE TIME TO OFFER",
    sublabel: "Well under the local market average of 46 days",
    tag: "Faster",
  },
  {
    value: 4.9,
    decimals: 1,
    suffix: "★",
    label: "/CLIENT RATING",
    sublabel: "From 860 verified reviews on Google and Zillow",
    tag: "Top rated",
  },
];

const REVIEWS: ReviewItem[] = [
  {
    id: "1",
    name: "Priya Shah",
    role: "First-time buyer, Denver",
    avatar: img("1494790108377-be9c29b29330", 800),
    rating: 5,
    content:
      "I had no idea where to start. Amelia walked me through every step, and we made an offer on our third tour. We got the keys in 38 days.",
  },
  {
    id: "2",
    name: "Daniel Reyes",
    role: "Relocated from Seattle",
    avatar: img("1507003211169-0a1dd7228f2d", 800),
    rating: 5,
    content:
      "Moving across the country felt impossible. They toured homes on video for us, flagged a roof issue early and saved us from a bad purchase.",
  },
  {
    id: "3",
    name: "Amara Okafor",
    role: "Property investor, Austin",
    avatar: img("1438761681033-6461ffad8d80", 800),
    rating: 5,
    content:
      "Their comparable-sales research was sharper than anything I've seen from a big brokerage. Three purchases in, I wouldn't use anyone else.",
  },
  {
    id: "4",
    name: "Marcus Lindqvist",
    role: "Sold a family home, Raleigh",
    avatar: img("1500648767791-00dcc994a43e", 800),
    rating: 5,
    content:
      "Our house sold in eleven days, $22,000 over asking. The staging advice alone paid for itself ten times over.",
  },
  {
    id: "5",
    name: "Tom Harlan",
    role: "Downsized, Portland",
    avatar: img("1472099645785-5658abf4ff4e", 800),
    rating: 5,
    content:
      "Selling after thirty years was emotional. They were patient, honest and found us a lovely flat near the grandchildren.",
  },
  {
    id: "6",
    name: "Sofia Marin",
    role: "Bought a townhome, Raleigh",
    avatar: img("1534528741775-53994a69daeb", 800),
    rating: 5,
    content:
      "Transparent from day one. No pressure, no surprise fees, and they negotiated a repair credit I would never have asked for myself.",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <HeroCarousel
          
          eyebrow="Boutique real estate agency · Austin, Denver, Chicago"
          heading={
            <>
              Find the home
              <br />
              that fits your life
            </>
          }
          slides={SLIDES}
          intro="Hand-picked listings, local agents who answer the phone, and a team that stays with you from the first tour to the day you get the keys."
          avatars={AVATARS}
          avatarsLabel="2,400+ happy homeowners"
          cta={{ label: "Schedule a visit", href: "/schedule" }}
          linkComponent={SiteLink}
          interval={6000}
          reveal="immediate"
        />

        <PropertyTypes />
        <FeaturedListings />
        <HowItWorks />

        <section aria-label="Haven & Co. in numbers" className="mx-auto max-w-7xl px-6 lg:px-12">
          <CounterSection
            variant="minimal-slash"
            eyebrow="Haven & Co. in numbers"
            heading="Results that speak for the street"
            description="Fifteen years of local knowledge, measured in homes sold and clients who came back."
            stats={STATS}
          />
        </section>

        <section id="reviews" className="scroll-mt-24">
          <ReviewsBlock
            variant="stacked-carousel"
            title="Loved by buyers and sellers"
            subtitle="Real words from clients who trusted us with the biggest purchase of their lives."
            reviews={REVIEWS}
          />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
