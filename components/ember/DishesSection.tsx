import { DISHES } from "@/lib/ember";
import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-xl"}>
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">{eyebrow}</p>
      <h2 className="mt-4 font-heading text-4xl font-medium leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      {intro && <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">{intro}</p>}
    </div>
  );
}

export function DishesSection() {
  return (
    <section id="dishes" className="bg-background px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading
            eyebrow="Signature dishes"
            title="Cooked over fire, plated with patience"
            intro="Six plates that have stayed on the menu through every season, each finished on the oak hearth in the middle of our kitchen."
          />
        </Reveal>

        <ul className="mt-16 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {DISHES.map((dish, i) => (
            <li key={dish.name} className={i % 3 === 1 ? "lg:mt-12" : undefined}>
              <Reveal delay={(i % 3) * 90}>
                <article className="group">
                  <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={dish.image}
                      alt={dish.name}
                      loading="lazy"
                      className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-background/80 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-md">
                      {dish.tag}
                    </span>
                  </div>
                  <div className="mt-5 flex items-baseline justify-between gap-4">
                    <h3 className="font-heading text-2xl font-semibold leading-tight">{dish.name}</h3>
                    <p className="shrink-0 font-heading text-2xl text-primary">{dish.price}</p>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{dish.description}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
