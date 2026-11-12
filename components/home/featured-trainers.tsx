import { ArrowRight } from "lucide-react";
import { TRAINERS } from "@/lib/gym-data";
import { TrainerCard } from "@/components/site/trainer-card";
import { Container, LinkButton, SectionHeading } from "@/components/site/ui";

export function FeaturedTrainers() {
  const featured = TRAINERS.slice(0, 4);
  return (
    <section id="trainers" className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Coaches"
          title="Meet your coaches"
          description="Certified, experienced and obsessed with helping you progress. Every coach knows your name by week two."
          action={
            <LinkButton href="/trainers" variant="outline">
              All trainers <ArrowRight className="size-4" aria-hidden />
            </LinkButton>
          }
        />
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((t) => (
            <li key={t.id}>
              <TrainerCard trainer={t} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
