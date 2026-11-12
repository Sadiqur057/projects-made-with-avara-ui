import type { Metadata } from "next";
import { Crumbs } from "@/components/store/crumbs";
import { CheckoutView } from "@/components/store/checkout-view";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default function CheckoutPage() {
  return (
    <>
      <Crumbs items={[{ label: "Home", href: "/" }, { label: "Checkout" }]} />
      <CheckoutView />
    </>
  );
}
