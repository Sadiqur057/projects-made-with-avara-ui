"use client";

import { CTASection } from "@/components/custom/blocks/CtaSectionBlock";
import { OFFER_IMAGES } from "@/lib/ember";

export function SpecialSection() {
  return (
    <section id="special">
      <CTASection
        variant="offer-showcase"
        color="primary"
        badge="Chef's special · Tuesday to Thursday"
        heading="The Chef's Autumn Tasting"
        subheading="Five courses from Chef Elias, cooked over oak, with a matched glass of wine for every plate. Available Tuesday to Thursday until the end of December."
        price={128}
        compareAtPrice={165}
        period="per guest"
        savingsText="Save $37"
        ctaText="Reserve the tasting"
        ctaHref="/reserve"
        footnote="Parties of 2–6 · Booked in advance · Dietary needs welcome"
        images={OFFER_IMAGES}
      />
    </section>
  );
}
