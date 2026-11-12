import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Confirm your travellers, contact details and deposit.",
};

export default function CheckoutPage() {
  return (
    <>
      <PageHeader eyebrow="Checkout" title="Almost there" description="Confirm who is travelling and secure your places with a 25% deposit." />
      <div className="mx-auto w-full max-w-7xl px-5 pb-24 sm:px-8">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-muted" />}>
          <CheckoutForm />
        </Suspense>
      </div>
    </>
  );
}
