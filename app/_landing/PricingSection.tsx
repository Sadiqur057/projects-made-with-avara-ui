"use client";

import { PricingCards, type PricingData, type Plan } from "@/components/custom/blocks/Pricing";

const plan = (p: Omit<Plan, "features"> & { features?: string[] }, features: string[]): Plan => ({ ...p, features });

const STARTER = ["Unlimited transactions", "3 category budgets", "Monthly bar chart", "Data stays in your browser"];
const PLUS = ["Everything in Starter", "Unlimited category budgets", "Overspend alerts", "CSV export"];
const FAMILY = ["Everything in Plus", "Up to 5 members", "Shared budgets", "Priority support"];

const data: PricingData = {
  tabs: [
    {
      id: "monthly",
      label: "Monthly",
      plans: [
        plan(
          { id: "starter", title: "Starter", subtitle: "For getting your bearings.", price: "$0", period: "mo", buttonText: "Start free", popular: false, icon: "Rocket" },
          STARTER,
        ),
        plan(
          { id: "plus", title: "Plus", subtitle: "For people serious about saving.", price: "$6", period: "mo", buttonText: "Go Plus", popular: true, icon: "Zap" },
          PLUS,
        ),
        plan(
          { id: "family", title: "Family", subtitle: "Shared money, one clear view.", price: "$12", period: "mo", buttonText: "Start Family", popular: false, icon: "Users" },
          FAMILY,
        ),
      ],
    },
    {
      id: "annually",
      label: "Annually (save 20%)",
      plans: [
        plan(
          { id: "starter-annual", title: "Starter", subtitle: "For getting your bearings.", price: "$0", period: "yr", buttonText: "Start free", popular: false, icon: "Rocket" },
          STARTER,
        ),
        plan(
          { id: "plus-annual", title: "Plus", subtitle: "For people serious about saving.", price: "$58", period: "yr", buttonText: "Go Plus", popular: true, icon: "Zap" },
          PLUS,
        ),
        plan(
          { id: "family-annual", title: "Family", subtitle: "Shared money, one clear view.", price: "$115", period: "yr", buttonText: "Start Family", popular: false, icon: "Users" },
          FAMILY,
        ),
      ],
    },
  ],
};

export function PricingSection() {
  return (
    <section id="pricing" className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28">
      <PricingCards
        data={data}
        variant="default"
        color="primary"
        badgeText="Pricing"
        title="Simple pricing that pays for itself"
        subtitle="Start free. Upgrade when you want unlimited budgets and shared accounts. This demo has no real checkout."
      />
    </section>
  );
}
