import type { Metadata } from "next";
import { Suspense } from "react";
import { NewPostForm } from "@/components/forum/new-post-form";

export const metadata: Metadata = {
  title: "New post",
  description: "Start a new discussion in the Commonroom community.",
};

export default function NewPostPage() {
  return (
    <Suspense fallback={<div className="mx-auto h-96 w-full max-w-6xl px-5 py-12 sm:px-8" />}>
      <NewPostForm />
    </Suspense>
  );
}
