"use client";

import Link from "next/link";
import { HeroBlock } from "@/components/custom/blocks/HeroBlock";

const img = (id: string, w: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

/** Doctor-portal hero look from Avara UI, filled with Voltix copy and photos. */
export function HeroSection() {
  return (
    <div className="pt-16">
      <HeroBlock
        variant="doctor"
        linkComponent={Link}
        titlePrefix="Next-level tech,"
        titleSuffix="made easy."
        subtitle="Headphones, phones, laptops and smart-home gear from the brands you trust. Genuine products, honest prices and free next-day delivery on every order."
        primaryActionLabel="Shop Now"
        primaryActionHref="/#featured"
        secondaryActionLabel="See Flash Sale"
        secondaryActionHref="/#flash-sale"
        ratingText="100%"
        badgeTags={["Genuine & warrantied products", "Customer satisfaction"]}
        featurePillText="98%"
        petImage={img("1618366712010-f4ae9c647dcb", 900)}
        secondaryPetImage={img("1523275335684-37898b6baf30", 800)}
        mainImage={img("1593642632823-8f785ba67e45", 800)}
      />
    </div>
  );
}
