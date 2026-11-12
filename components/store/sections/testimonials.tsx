"use client";

import { ReviewsBlock } from "@/components/custom/blocks/ReviewsBlock";
import { testimonials } from "@/lib/store/products";

const reviews = testimonials.map((t) => ({
  id: t.id,
  name: t.name,
  role: t.role,
  avatar: t.avatar,
  rating: t.rating,
  content: t.content,
}));

export function TestimonialsSection() {
  return (
    <ReviewsBlock
      variant="stacked-carousel"
      title="Loved by people who dress with intent"
      subtitle="Real words from verified AVARA customers."
      reviews={reviews}
      autoSlide
      autoSlideInterval={5500}
    />
  );
}
