"use client";

import Link from "next/link";
import { PricingCards, type PricingData } from "@/components/custom/blocks/Pricing";
import { PLANS, type Cycle } from "@/lib/gym-data";
import { Container, LinkButton, SectionHeading } from "@/components/site/ui";

const ICON: Record<string, string> = { starter: "Zap", pro: "Rocket", elite: "Building" };

const tab = (id: Cycle, label: string): PricingData["tabs"][number] => ({
  id,
  label,
  plans: PLANS.map((p) => ({
    id: p.id,
    title: p.name,
    subtitle: p.tagline,
    price: `$${id === "annual" ? p.annualMonthly : p.monthly}`,
    period: id === "annual" ? "mo, billed yearly" : "mo",
    buttonText: `Choose ${p.name}`,
    popular: !!p.popular,
    icon: ICON[p.id],
    features: p.highlights,
    href: `/membership/checkout?plan=${p.id}&cycle=${id}`,
  })),
});

const data: PricingData = { tabs: [tab("monthly", "Monthly"), tab("annual", "Annual · save 20%")] };

export function Plans() {
  return (
    <section id="plans" className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Membership"
          title="Simple plans. No joining fee."
          description="Pause, upgrade or cancel whenever you need. Every plan includes full access to the floor and our app."
        />
        <div className="mt-6">
          <PricingCards data={data} variant="elegant" color="primary" counting={false} linkComponent={Link} />
        </div>
        <div className="mt-6 text-center">
          <LinkButton href="/membership#compare" variant="ghost">
            Compare every feature
          </LinkButton>
        </div>
      </Container>
    </section>
  );
}
