"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  PricingPlansPro,
  type PlansProItem,
} from "@/components/custom/blocks/Pricing";

// Prices are per seat, per month. Yearly is the discounted monthly rate.
const PLANS: PlansProItem[] = [
  {
    id: "starter",
    title: "Starter",
    subtitle: "individuals",
    monthlyPrice: 9,
    yearlyPrice: 7,
    monthlyPeriod: "Month",
    yearlyPeriod: "Month, billed yearly",
    features: [
      "10 recorded meetings a month",
      "AI summaries & action items",
      "30-day searchable history",
    ],
  },
  {
    id: "team",
    title: "Team",
    subtitle: "growing teams",
    monthlyPrice: 18,
    yearlyPrice: 14,
    monthlyPeriod: "Month",
    yearlyPeriod: "Month, billed yearly",
    features: [
      "Unlimited meetings",
      "Slack, email & CRM sharing",
      "Unlimited history & AI assistant",
    ],
  },
  {
    id: "business",
    title: "Business",
    subtitle: "whole companies",
    monthlyPrice: 32,
    yearlyPrice: 26,
    monthlyPeriod: "Month",
    yearlyPeriod: "Month, billed yearly",
    features: [
      "SSO, roles & audit logs",
      "Custom templates & redaction",
      "Priority support & SLA",
    ],
  },
];

export function Pricing() {
  const router = useRouter();
  const [choice, setChoice] = useState<string>("");

  return (
    <section id="pricing" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <PricingPlansPro
          variant="plans-pro"
          badgeText="Pricing"
          title="Pick a plan, size your team"
          subtitle="Choose monthly or yearly billing, select a plan, then set how many people need seats. Cancel any time."
          plans={PLANS}
          defaultSelectedPlanId="team"
          defaultUsers={5}
          minUsers={1}
          maxUsers={200}
          usersLabel="Team size"
          usersSubtext="Seats billed per active member"
          discountBadge="SAVE 20%"
          orderButtonText="Start free trial"
          counting={false}
          onOrder={({ plan, billingCycle, users, totalPrice }) => {
            const summary = `${plan.title} · ${billingCycle} · ${users} seat${users === 1 ? "" : "s"} · $${totalPrice.toFixed(2)}/mo`;
            setChoice(summary);
            try {
              window.localStorage.setItem(
                "notewise.plan",
                JSON.stringify({ plan: plan.id, billingCycle, users, totalPrice }),
              );
            } catch {
              /* storage blocked: the choice just isn't remembered */
            }
            router.push("/register");
          }}
        />
        <p className="sr-only" aria-live="polite">
          {choice && `Selected ${choice}`}
        </p>
      </div>
    </section>
  );
}
