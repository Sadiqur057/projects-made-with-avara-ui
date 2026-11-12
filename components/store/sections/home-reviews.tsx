"use client";

import { ReviewsBlock, type ReviewItem } from "@/components/custom/blocks/ReviewsBlock";
import { SEED_REVIEWS, getProduct } from "@/lib/catalog";
import { useStore } from "@/lib/store";

const shortName = (name: string) => name.split(" ").slice(0, 2).join(" ");

export function HomeReviews() {
  const { reviews: mine } = useStore();

  // Best and freshest reviews first; ones written on this device join the wall.
  const all = [...mine, ...SEED_REVIEWS]
    .filter((r) => r.rating >= 4)
    .sort((a, b) => b.rating - a.rating || b.date.localeCompare(a.date))
    .slice(0, 12);

  const items: ReviewItem[] = all.map((r) => ({
    id: r.id,
    name: r.name,
    role: r.skin,
    rating: r.rating,
    content: r.body,
    badge: shortName(getProduct(r.productSlug)?.name ?? "Aurelle"),
  }));

  return (
    <ReviewsBlock
      variant="up-down-vertical-marquee"
      eyebrow="Customer reviews"
      title="Loved by real skin"
      subtitle="Honest words from people with oily, dry, sensitive and everything-in-between skin."
      reviews={items}
      marqueeSpeed={90}
      className="py-16 sm:py-24"
    />
  );
}
