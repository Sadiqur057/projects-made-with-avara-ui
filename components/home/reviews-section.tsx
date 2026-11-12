import { ReviewsBlock, type ReviewItem } from "@/components/custom/blocks/ReviewsBlock";
import { REVIEWS } from "@/lib/travel-data";

const reviews: ReviewItem[] = REVIEWS.map((r, i) => ({
  id: String(i + 1),
  name: r.name,
  role: r.trip,
  company: r.location,
  avatar: r.avatar,
  rating: r.rating,
  content: r.quote,
  highlight: r.tag,
  location: r.location.toUpperCase().replace(", ", " · "),
  date: r.date,
  code: `WF-${100 + i * 37}`,
}));

export function ReviewsSection() {
  return <ReviewsBlock variant="testimonial-loom" reviews={reviews} autoSlide />;
}
