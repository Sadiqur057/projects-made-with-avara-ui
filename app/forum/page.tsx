import type { Metadata } from "next";
import { Suspense } from "react";
import { ForumView } from "@/components/forum/forum-view";
import { ThreadCardSkeleton } from "@/components/forum/thread-card";

export const metadata: Metadata = {
  title: "Forum",
  description: "Browse every discussion in the Commonroom community, sorted by hot, new or top.",
};

export default function ForumPage() {
  return (
    // useSearchParams needs a Suspense boundary so the rest of the page can prerender.
    <Suspense
      fallback={
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-5 py-12 sm:px-8">
          <ThreadCardSkeleton />
          <ThreadCardSkeleton />
          <ThreadCardSkeleton />
        </div>
      }
    >
      <ForumView />
    </Suspense>
  );
}
