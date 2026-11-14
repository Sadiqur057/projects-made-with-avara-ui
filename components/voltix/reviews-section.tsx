import { ReviewsBlock, type ReviewItem } from "@/components/custom/blocks/ReviewsBlock";

const portrait = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`;

const reviews: ReviewItem[] = [
  {
    id: "1",
    name: "Maya Okafor",
    role: "Podcast producer",
    company: "Hollow Reed Audio",
    avatar: portrait("1494790108377-be9c29b29330"),
    rating: 5,
    content:
      "The Volt Pro X1 headphones are the best noise cancelling I have used on a train. They arrived the next morning and the sound is honestly studio quality.",
  },
  {
    id: "2",
    name: "Daniel Reyes",
    role: "Photographer",
    company: "Northlight Studio",
    avatar: portrait("1507003211169-0a1dd7228f2d"),
    rating: 5,
    content:
      "I replaced my whole travel kit with Voltix gear. The Lens M3 is lighter than my old body, the autofocus never hunts and the 2-year warranty sealed the deal.",
  },
  {
    id: "3",
    name: "Priya Nair",
    role: "Product designer",
    company: "Paperplane Labs",
    avatar: portrait("1438761681033-6461ffad8d80"),
    rating: 5,
    content:
      "I was nervous about ordering a laptop online. The Aero 14 showed up sealed, set up in minutes, and support answered my question in under five.",
  },
  {
    id: "4",
    name: "Tom Becker",
    role: "Café owner",
    company: "Brewline Coffee",
    avatar: portrait("1500648767791-00dcc994a43e"),
    rating: 4.5,
    content:
      "Fitted out the whole shop with Orbit speakers. Setup was painless, the pair sounds huge, and Voltix matched a cheaper price without any fuss.",
  },
  {
    id: "5",
    name: "Sofia Marchetti",
    role: "Marathon coach",
    company: "Stride Club",
    avatar: portrait("1534528741775-53994a69daeb"),
    rating: 5,
    content:
      "My whole running club now wears the Pulse Watch S2. A week of battery, accurate GPS, and returns were trivial when one size was wrong.",
  },
];

export function ReviewsSection() {
  return (
    <section id="reviews" className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24">
      <ReviewsBlock
        variant="logo-carousel"
        title="Loved by creators, coaches and everyday users"
        subtitle="Real reviews from people who bought, tried and kept their gear from Voltix."
        reviews={reviews}
      />
    </section>
  );
}
