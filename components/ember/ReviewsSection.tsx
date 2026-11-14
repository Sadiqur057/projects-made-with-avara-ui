"use client";

import { ReviewsBlock } from "@/components/custom/blocks/ReviewsBlock";
import { REVIEWS } from "@/lib/ember";

export function ReviewsSection() {
  return (
    <div id="reviews">
      <ReviewsBlock
        variant="logo-carousel"
        title="Words from the table"
        subtitle="Critics, writers and regulars on an evening at Ember & Oak."
        reviews={REVIEWS}
      />
    </div>
  );
}
