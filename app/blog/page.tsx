import type { Metadata } from "next";
import { BlogList } from "@/components/blog/blog-list";
import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = {
  title: "Travel journal",
  description: "Guides, practical tips and stories from Wayfare hosts.",
};

export default function BlogPage() {
  return (
    <>
      <PageHeader eyebrow="Travel journal" title="Guides and stories from the road" description="Practical advice and honest stories from the hosts who run our trips." />
      <div className="mx-auto w-full max-w-7xl px-5 pb-24 sm:px-8">
        <BlogList />
      </div>
    </>
  );
}
