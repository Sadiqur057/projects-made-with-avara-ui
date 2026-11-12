"use client";

import Link from "next/link";
import { BreatheHero } from "@/components/custom/blocks/BreatheHeroBlock";
import { getProduct, productImage } from "@/lib/catalog";

// Five packs, centre card is the hero product. Order = left to right.
const CARD_SLUGS = [
  "milk-bath-cream-cleanser",
  "dew-drop-hyaluronic-serum",
  "bright-side-vitamin-c-serum",
  "barrier-butter-ceramide-cream",
  "invisible-shield-spf-50",
] as const;

const CARDS = CARD_SLUGS.map((slug) => {
  const p = getProduct(slug)!;
  return {
    id: slug,
    image: productImage(slug, 1),
    caption: p.name,
    color: p.tint,
    alt: `${p.name} — ${p.tagline}`,
    href: `/shop/${slug}`,
  };
});

export function Hero() {
  return (
    <BreatheHero
      internalScroll={false}
      titleStyle="serif"
      title="Skincare that listens"
      titleAccent="to your skin."
      description="Honest formulas, fair prices and a routine built around your skin type. Start with our two-minute quiz and we'll point you to what actually works."
      badgeText="New · Glow Reset Enzyme Mask is here"
      badgeHighlight="Just landed"
      badgeHref="/shop/glow-reset-enzyme-mask"
      buttonLabel="Take the skin quiz"
      buttonHref="/quiz"
      secondaryButtonLabel="Shop bestsellers"
      secondaryButtonHref="/shop?sort=best"
      features={["Fragrance-free options", "Vegan formulas", "Free shipping over $50"]}
      cards={CARDS}
      captions="hover"
      scrollMode="grow"
      hoverMode="zoom"
      linkComponent={Link}
    />
  );
}
