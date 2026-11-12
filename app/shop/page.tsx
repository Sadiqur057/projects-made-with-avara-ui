import type { Metadata } from "next";
import { Suspense } from "react";
import { Crumbs } from "@/components/store/crumbs";
import { ShopView } from "@/components/store/shop-view";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse every AVARA piece: dresses, outerwear, tops, knitwear, tailoring and accessories.",
};

export default function ShopPage() {
  return (
    <>
      <Crumbs items={[{ label: "Home", href: "/" }, { label: "Shop" }]} />
      <Suspense fallback={<div className="mx-auto h-[60vh] max-w-7xl px-4 py-12 sm:px-6" aria-busy="true" />}>
        <ShopView />
      </Suspense>
    </>
  );
}
