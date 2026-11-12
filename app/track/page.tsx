import type { Metadata } from "next";
import { Suspense } from "react";
import { Crumbs } from "@/components/store/crumbs";
import { TrackView } from "@/components/store/track-view";

export const metadata: Metadata = { title: "Track your order", description: "Follow your AVARA order from warehouse to doorstep." };

export default function TrackPage() {
  return (
    <>
      <Crumbs items={[{ label: "Home", href: "/" }, { label: "Track order" }]} />
      <Suspense fallback={<div className="mx-auto min-h-[60vh] max-w-6xl px-4 py-12 sm:px-6" aria-busy="true" />}>
        <TrackView />
      </Suspense>
    </>
  );
}
