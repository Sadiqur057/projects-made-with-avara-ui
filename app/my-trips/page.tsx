import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/site/page-header";
import { TripsView } from "@/components/trips/trips-view";

export const metadata: Metadata = {
  title: "My trips",
  description: "Your bookings and live booking tracker.",
};

export default function MyTripsPage() {
  return (
    <>
      <PageHeader
        eyebrow="My trips"
        title="Your bookings, tracked"
        description="Follow each booking from confirmation to your return. In this demo the early stages advance within a minute so you can watch the tracker move."
      />
      <div className="mx-auto w-full max-w-7xl px-5 pb-24 sm:px-8">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-muted" />}>
          <TripsView />
        </Suspense>
      </div>
    </>
  );
}
