import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductCardSkeleton } from "@/components/store/product-card";
import { ShopClient } from "@/components/store/shop/shop-client";

export const metadata: Metadata = {
  title: "Shop all skincare",
  description: "Cleansers, serums, moisturizers and sun care. Filter by skin type and concern.",
};

function ShopFallback() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14" aria-busy="true">
      <div className="h-10 w-64 animate-pulse rounded bg-muted motion-reduce:animate-none" />
      <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <li key={i}>
            <ProductCardSkeleton />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ShopPage() {
  // useSearchParams needs a Suspense boundary so the rest of the page can prerender.
  return (
    <Suspense fallback={<ShopFallback />}>
      <ShopClient />
    </Suspense>
  );
}
