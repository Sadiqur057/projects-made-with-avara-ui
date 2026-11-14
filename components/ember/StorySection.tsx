import { PHOTO, STATS, unsplash } from "@/lib/ember";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./DishesSection";

export function StorySection() {
  return (
    <section id="story" className="border-y border-border bg-secondary/40 px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2 lg:gap-24">
        <Reveal className="relative">
          <div className="grid grid-cols-5 gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={unsplash(PHOTO.diningRoom, 1000)}
              alt="The Ember & Oak dining room"
              loading="lazy"
              className="col-span-3 aspect-[3/4] w-full rounded-2xl border border-border object-cover"
            />
            <div className="col-span-2 flex flex-col gap-4 pt-12">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={unsplash(PHOTO.knife, 700)}
                alt="A cook preparing fresh herbs with a knife"
                loading="lazy"
                className="aspect-square w-full rounded-2xl border border-border object-cover"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={unsplash(PHOTO.bar, 700)}
                alt="The bar at Ember & Oak"
                loading="lazy"
                className="aspect-[4/5] w-full rounded-2xl border border-border object-cover"
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <SectionHeading
            align="left"
            eyebrow="Our story"
            title="One hearth, one rule: cook with what the season gives"
          />
          <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            <p>
              Ember &amp; Oak began in 2014 with a salvaged oak table, a hand-built hearth and a simple idea: fire is the
              oldest way to cook, and still the most honest. Chef Elias Moreau learned it in the farmhouse kitchens of his
              grandparents&rsquo; village, and brought it to a Brooklyn corner with a tiny menu and eleven seats.
            </p>
            <p>
              Today the room seats forty-eight, but the rule has not changed. We burn only oak and cherrywood, buy from
              twelve farms within a hundred miles, and let the menu change when the weather does.
            </p>
          </div>

          <figure className="mt-8 border-l-2 border-primary pl-6">
            <blockquote className="font-heading text-2xl italic leading-snug text-foreground sm:text-3xl">
              &ldquo;Fire doesn&rsquo;t hide anything. That is why we love it.&rdquo;
            </blockquote>
            <figcaption className="mt-3 text-sm text-muted-foreground">Chef Elias Moreau, founder</figcaption>
          </figure>

          <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-8">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-heading text-4xl font-semibold text-primary sm:text-5xl">{stat.value}</dd>
                <p className="mt-1 text-xs leading-snug text-muted-foreground sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
