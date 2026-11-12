import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, Clock, Flame, MapPin, Users } from "lucide-react";
import {
  CLASSES,
  categoryById,
  classBySlug,
  sessionsForClass,
  trainerById,
} from "@/lib/gym-data";
import { WEEKDAYS, formatTime12 } from "@/lib/dates";
import { ClassBooking } from "@/components/classes/class-booking";
import { ClassCard, IntensityMeter } from "@/components/site/class-card";
import { Badge, Container, LinkButton } from "@/components/site/ui";
import { Crumbs } from "@/components/site/crumbs";
import { HalfStars } from "@/components/custom/blocks/HalfStarsBlock";

export function generateStaticParams() {
  return CLASSES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/classes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = classBySlug(slug);
  if (!item) return {};
  return { title: item.name, description: item.summary };
}

export default async function ClassDetailPage({ params }: PageProps<"/classes/[slug]">) {
  const { slug } = await params;
  const item = classBySlug(slug);
  if (!item) notFound();

  const trainer = trainerById(item.trainerId);
  const category = categoryById(item.category);
  const weekly = sessionsForClass(item.slug);
  const related = CLASSES.filter((c) => c.category === item.category && c.slug !== item.slug).slice(0, 3);
  const byDay = WEEKDAYS.map((name, day) => ({
    name,
    times: weekly.filter((s) => s.day === day).map((s) => formatTime12(s.time)),
  })).filter((d) => d.times.length > 0);

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-border">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.image} alt="" className="absolute inset-0 -z-20 size-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/85 to-background/30" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-background to-transparent" aria-hidden />
        <Container className="py-14 sm:py-24">
          <Crumbs items={[{ label: "Home", href: "/" }, { label: "Classes", href: "/classes" }, { label: item.name }]} />
          <div className="mt-8 flex flex-wrap gap-2">
            <Badge tone="primary">{category.label}</Badge>
            <Badge>{item.level}</Badge>
          </div>
          <h1 className="mt-4 max-w-2xl text-6xl font-extrabold uppercase leading-[0.9] sm:text-8xl">{item.name}</h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">{item.summary}</p>
          <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-primary" aria-hidden />
              <dt className="sr-only">Duration</dt>
              <dd>{item.duration} minutes</dd>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="size-4 text-primary" aria-hidden />
              <dt className="sr-only">Calories</dt>
              <dd>{item.calories} kcal</dd>
            </div>
            <div className="flex items-center gap-2">
              <Users className="size-4 text-primary" aria-hidden />
              <dt className="sr-only">Class size</dt>
              <dd>Max {item.capacity} people</dd>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" aria-hidden />
              <dt className="sr-only">Room</dt>
              <dd>{item.room}</dd>
            </div>
            <div className="flex items-center gap-2">
              <dt className="text-muted-foreground">Intensity</dt>
              <dd>
                <IntensityMeter value={item.intensity} />
              </dd>
            </div>
          </dl>
        </Container>
      </section>

      <Container className="grid gap-12 py-14 lg:grid-cols-[1fr_420px]">
        <div className="space-y-12">
          <section aria-labelledby="about">
            <h2 id="about" className="text-3xl font-bold uppercase">
              About this class
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{item.description}</p>
          </section>

          <section aria-labelledby="benefits">
            <h2 id="benefits" className="text-3xl font-bold uppercase">
              What you get
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {item.benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 text-sm">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-3" aria-hidden />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="bring">
            <h2 id="bring" className="text-3xl font-bold uppercase">
              What to bring
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {item.bring.map((b) => (
                <li key={b} className="rounded-full border border-border bg-card px-4 py-2 text-sm">
                  {b}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="weekly">
            <h2 id="weekly" className="text-3xl font-bold uppercase">
              Weekly times
            </h2>
            <ul className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card">
              {byDay.map((d) => (
                <li key={d.name} className="flex items-center justify-between gap-4 px-5 py-3 text-sm">
                  <span className="font-semibold">{d.name}</span>
                  <span className="text-muted-foreground">{d.times.join("  ·  ")}</span>
                </li>
              ))}
            </ul>
            <LinkButton href="/schedule" variant="outline" className="mt-4">
              See the full schedule
            </LinkButton>
          </section>

          <section aria-labelledby="coach">
            <h2 id="coach" className="text-3xl font-bold uppercase">
              Your coach
            </h2>
            <div className="mt-4 flex flex-col gap-5 rounded-3xl border border-border bg-card p-5 sm:flex-row sm:items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={trainer.image} alt={`Portrait of ${trainer.name}`} className="size-28 rounded-2xl object-cover" loading="lazy" />
              <div className="flex-1">
                <p className="font-display text-3xl font-bold uppercase leading-none">{trainer.name}</p>
                <p className="mt-1 text-sm text-primary">{trainer.role}</p>
                <HalfStars rating={trainer.rating} size={16} showText={false} className="mt-2" />
                <p className="mt-3 text-sm text-muted-foreground">&ldquo;{trainer.quote}&rdquo;</p>
              </div>
              <LinkButton href="/trainers" variant="outline" size="sm">
                All trainers
              </LinkButton>
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Book this class">
          <ClassBooking gymClass={item} trainer={trainer} />
        </aside>
      </Container>

      {related.length > 0 && (
        <section className="border-t border-border bg-card/30 py-16">
          <Container>
            <h2 className="text-4xl font-extrabold uppercase">More {category.label}</h2>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((c) => (
                <li key={c.slug}>
                  <ClassCard item={c} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}
    </>
  );
}
