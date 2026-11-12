import type { Metadata } from "next";
import { Container, PageHero, SectionHeading } from "@/components/site/ui";
import { MembershipPlans } from "@/components/membership/membership-plans";

export const metadata: Metadata = {
  title: "Membership plans",
  description: "Compare Starter, Pro and Elite memberships and join IRONPULSE Gym online.",
};

const FAQ = [
  { q: "Is there a joining fee?", a: "No. The price you see is the price you pay. Annual plans are billed once up front and save 20%." },
  { q: "Can I cancel or pause?", a: "Yes. Cancel any time from your dashboard. Pro and Elite members can also pause for a set number of months a year." },
  { q: "What happens if I miss a class?", a: "Cancel up to 2 hours before for free. Late cancellations and no-shows still use a class credit on capped plans." },
  { q: "Can I switch plans?", a: "Upgrade or downgrade whenever you like. Your new plan starts immediately after checkout." },
];

export default function MembershipPage() {
  return (
    <>
      <PageHero
        eyebrow="Membership"
        title="One gym. Three ways to train."
        description="No joining fee, no contracts. Choose billing, compare the details and check out in under two minutes."
        crumbs={[{ label: "Home", href: "/" }, { label: "Membership" }]}
      />
      <MembershipPlans />
      <section className="py-20">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="FAQ" title="Questions, answered" />
          <div className="mt-8 divide-y divide-border rounded-3xl border border-border bg-card">
            {FAQ.map((f) => (
              <details key={f.q} className="group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {f.q}
                  <span aria-hidden className="text-primary transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
