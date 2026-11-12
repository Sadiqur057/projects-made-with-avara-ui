import type { Metadata } from "next";
import { Suspense } from "react";
import { TrackClient } from "@/components/store/track/track-client";

export const metadata: Metadata = {
  title: "Track your order",
  description: "Follow your Aurelle order from our studio to your door.",
};

export default function TrackPage() {
  // useSearchParams needs a Suspense boundary so the page shell can prerender.
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6" aria-busy="true">
          <div className="h-96 animate-pulse rounded-3xl bg-muted motion-reduce:animate-none" />
        </div>
      }
    >
      <TrackClient />
    </Suspense>
  );
}
