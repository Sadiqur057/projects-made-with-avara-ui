import type { Metadata } from "next";
import { Suspense } from "react";
import { PackagesExplorer } from "@/components/packages/packages-explorer";
import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = {
  title: "Travel packages",
  description: "Filter small-group trips by price, duration, style and destination.",
};

export default function PackagesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Packages"
        title="Every trip, priced up front"
        description="Filter by budget and length, then open a trip for the full day-by-day itinerary."
      />
      <div className="mx-auto w-full max-w-7xl px-5 pb-24 sm:px-8">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-muted" aria-label="Loading trips" />}>
          <PackagesExplorer />
        </Suspense>
      </div>
    </>
  );
}
