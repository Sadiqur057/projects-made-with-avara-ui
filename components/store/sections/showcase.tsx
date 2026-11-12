"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { products } from "@/lib/store/products";
import { money } from "@/lib/store/pricing";
import { Section, SectionHeading } from "../section-heading";

// The arc carousel positions its cards from a running clock, so it only renders in the browser.
const Gallery = dynamic(() => import("@/components/custom/blocks/GalleryBlock").then((m) => m.Gallery), {
  ssr: false,
  loading: () => <div className="h-[420px]" aria-hidden />,
});

const items = products
  .filter((p) => p.featured || p.badge === "Bestseller")
  .slice(0, 8)
  .map((p) => ({
    id: p.id,
    image: { src: p.images[0], alt: p.name },
    title: p.name,
    subtitle: money(p.price),
    link: `/product/${p.slug}`,
  }));

export function ShowcaseSection() {
  const router = useRouter();
  return (
    <section aria-labelledby="showcase-title" className="overflow-hidden py-16 sm:py-24">
      <Section className="py-0 sm:py-0">
        <SectionHeading eyebrow="Showcase" title={<span id="showcase-title">Pieces people keep coming back for</span>} action={{ label: "Shop all", href: "/shop" }} />
      </Section>
      <div
        className="relative mt-4 h-[360px] overflow-hidden sm:h-[420px]"
        onClickCapture={(e) => {
          const a = (e.target as HTMLElement).closest("a[href^='/product/']");
          if (a) {
            e.preventDefault();
            router.push(a.getAttribute("href")!);
          }
        }}
      >
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
          <Gallery variant="arc-carousel" arcItems={items} color="primary" cardSize={230} autoScrollSpeed={0.15} />
        </div>
      </div>
      <p className="mt-2 text-center text-xs text-muted-foreground">Drag to explore · click a piece to view it</p>
    </section>
  );
}
