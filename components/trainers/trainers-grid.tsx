"use client";

import Link from "next/link";
import { useState } from "react";
import { Award, AtSign } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/custom/blocks/DialogBlock";
import { HalfStars } from "@/components/custom/blocks/HalfStarsBlock";
import { CLASSES, TRAINERS, type Trainer } from "@/lib/gym-data";
import { TrainerCard } from "@/components/site/trainer-card";
import { Container, LinkButton } from "@/components/site/ui";

export function TrainersGrid() {
  const [selected, setSelected] = useState<Trainer | null>(null);
  const taught = selected ? CLASSES.filter((c) => c.trainerId === selected.id) : [];

  return (
    <Container className="py-12">
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {TRAINERS.map((t) => (
          <li key={t.id}>
            <TrainerCard trainer={t} onOpen={() => setSelected(t)} />
          </li>
        ))}
      </ul>

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent size="lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.name}</DialogTitle>
                <DialogDescription>{selected.role}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 sm:grid-cols-[180px_1fr]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selected.image}
                  alt={`Portrait of ${selected.name}`}
                  className="aspect-[4/5] w-full rounded-2xl object-cover"
                />
                <div className="space-y-4 text-sm">
                  <div className="flex flex-wrap items-center gap-3">
                    <HalfStars rating={selected.rating} size={16} showText={false} />
                    <span className="text-muted-foreground">
                      {selected.rating.toFixed(1)} · {selected.reviews} reviews · {selected.years} yrs
                    </span>
                  </div>
                  <p className="leading-relaxed text-muted-foreground">{selected.bio}</p>
                  <p className="border-l-2 border-primary pl-3 italic">&ldquo;{selected.quote}&rdquo;</p>
                  <div>
                    <p className="mb-2 flex items-center gap-1.5 font-semibold">
                      <Award className="size-4 text-primary" aria-hidden /> Certifications
                    </p>
                    <ul className="flex flex-wrap gap-1.5">
                      {selected.certifications.map((c) => (
                        <li key={c} className="rounded-full bg-secondary px-2.5 py-1 text-xs">
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <AtSign className="size-4" aria-hidden /> {selected.instagram}
                  </p>
                </div>
              </div>
              {taught.length > 0 && (
                <div className="mt-2 border-t border-border pt-4">
                  <p className="mb-3 text-sm font-semibold">Classes with {selected.name.split(" ")[0]}</p>
                  <ul className="flex flex-wrap gap-2">
                    {taught.map((c) => (
                      <li key={c.slug}>
                        <Link
                          href={`/classes/${c.slug}`}
                          className="inline-flex h-9 items-center rounded-full border border-border px-4 text-sm font-medium hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {c.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <LinkButton href="/schedule" size="sm" className="mt-4">
                    See schedule
                  </LinkButton>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
}
