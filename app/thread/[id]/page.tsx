import { Suspense } from "react";
import { ThreadView } from "@/components/forum/thread-view";

export const metadata = {
  title: "Discussion",
};

async function Thread({ params }: { params: PageProps<"/thread/[id]">["params"] }) {
  const { id } = await params;
  return <ThreadView id={decodeURIComponent(id)} />;
}

export default function ThreadPage(props: PageProps<"/thread/[id]">) {
  // Threads live in localStorage, so the client resolves them. The route param
  // is read inside Suspense so the page shell can still be prerendered.
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-8" aria-busy="true">
          <div className="h-4 w-48 animate-pulse rounded bg-muted" />
          <div className="mt-6 h-9 w-3/4 animate-pulse rounded bg-muted" />
          <div className="mt-6 h-40 animate-pulse rounded-2xl bg-muted" />
        </div>
      }
    >
      <Thread params={props.params} />
    </Suspense>
  );
}
