import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/site/ui";
import { CheckoutFlow } from "@/components/membership/checkout-flow";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Join IRONPULSE Gym in four quick steps.",
};

export default function CheckoutPage() {
  return (
    <>
      <PageHero
        eyebrow="Checkout"
        title="Join IRONPULSE"
        crumbs={[{ label: "Home", href: "/" }, { label: "Membership", href: "/membership" }, { label: "Checkout" }]}
      />
      <Suspense fallback={<div className="mx-auto h-96 max-w-7xl animate-pulse rounded-3xl bg-card/50" aria-busy="true" />}>
        <CheckoutFlow />
      </Suspense>
    </>
  );
}
