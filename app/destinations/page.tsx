import type { Metadata } from "next";
import { Suspense } from "react";
import { DestinationsBrowser } from "@/components/destinations/destinations-browser";
import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = {
  title: "Destinations",
  description: "Fourteen destinations across Asia, Europe, Africa and the Americas, each with a local Wayfare host.",
};

export default function DestinationsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Destinations"
        title="Where do you want to wake up?"
        description="Fourteen places, each with a resident host. Filter by region, then open a destination to see its trips."
      />
      <div className="mx-auto w-full max-w-7xl px-5 pb-24 sm:px-8">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-muted" />}>
          <DestinationsBrowser />
        </Suspense>
      </div>
    </>
  );
}
