"use client";

import { Bike, Dumbbell, Flame, Flower2, Swords } from "lucide-react";
import { ReviewsBlock, type ReviewItem } from "@/components/custom/blocks/ReviewsBlock";
import { REVIEWS } from "@/lib/gym-data";

const PROGRAM_ICON: Record<string, React.ReactNode> = {
  Strength: <Dumbbell className="size-5" />,
  HIIT: <Flame className="size-5" />,
  Combat: <Swords className="size-5" />,
  Yoga: <Flower2 className="size-5" />,
  Cycling: <Bike className="size-5" />,
};

const reviews: ReviewItem[] = REVIEWS.map((r) => ({
  id: r.id,
  name: r.name,
  role: r.role,
  avatar: r.avatar,
  rating: r.rating,
  content: r.content,
  company: r.program,
  logo: PROGRAM_ICON[r.program],
}));

export function Reviews() {
  return (
    <section id="reviews" className="py-16 sm:py-24">
      <ReviewsBlock
        variant="logo-carousel"
        title="Loved by people who train here"
        subtitle="Hundreds of members, five programs and one very loud group chat. Here is what they say."
        reviews={reviews}
      />
    </section>
  );
}
