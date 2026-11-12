"use client";

import { MasonryGrid } from "@/components/custom/blocks/MasonryGridBlock";
import { FACILITIES, type Facility } from "@/lib/gym-data";
import { Container, SectionHeading } from "@/components/site/ui";
import { cn } from "@/lib/utils";

const ASPECT: Record<Facility["ratio"], string> = {
  tall: "aspect-[3/4]",
  wide: "aspect-[4/3]",
  square: "aspect-square",
};

export function Facilities() {
  return (
    <section id="facilities" className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="The facility"
          title={
            <>
              12,000 sq ft built
              <br />
              for training
            </>
          }
          description="Every zone has one job: help you work harder and recover better. Calibrated plates, power-metered bikes and a recovery area that is open when you are."
        />
        <div className="mt-12">
          <MasonryGrid
            items={FACILITIES}
            columnsClassName="columns-1 sm:columns-2 lg:columns-3 xl:columns-4"
            gapClassName="gap-4"
            renderItem={(f) => (
              <figure
                className={cn(
                  "group relative mb-4 overflow-hidden rounded-3xl border border-border bg-muted",
                  ASPECT[f.ratio],
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={f.image}
                  alt={f.title}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" aria-hidden />
                <figcaption className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="font-display text-2xl font-bold uppercase leading-none">{f.title}</p>
                  <p className="mt-1 text-sm text-white/80">{f.detail}</p>
                </figcaption>
              </figure>
            )}
          />
        </div>
      </Container>
    </section>
  );
}
