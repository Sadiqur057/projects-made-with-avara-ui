import { CTASection } from "@/components/custom/blocks/CtaSectionBlock";
import { IMG } from "@/lib/gym-data";

const images = [
  IMG.barbell,
  IMG.yoga,
  IMG.cycle,
  IMG.boxing,
  IMG.hiit,
  IMG.womanLift,
  IMG.ropes,
  IMG.rack,
  IMG.cardio,
  IMG.dumbbells,
  IMG.group,
  IMG.stretch,
];

export function JoinCta() {
  return (
    <CTASection
      variant="offer-showcase"
      badge="Join this month"
      heading="Your first month starts at $29"
      subheading="No joining fee, no lock-in. Full floor access, coached classes and a coach who knows your name."
      price={29}
      compareAtPrice={49}
      period="first month"
      savingsText="Save 40%"
      ctaText="Join IRONPULSE"
      ctaHref="/membership"
      footnote="Cancel anytime · 14-day money-back"
      images={images}
    />
  );
}
