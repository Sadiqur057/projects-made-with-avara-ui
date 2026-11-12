import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Activity, Check, ChevronRight, Clock, MapPin, Star, Sun, Users, X } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookingWidget } from "@/components/packages/booking-widget";
import { PackageCard } from "@/components/site/package-card";
import { WishlistButton } from "@/components/site/wishlist-button";
import { PACKAGES, getDestination, getPackage, packageImage } from "@/lib/travel-data";

export function generateStaticParams() {
  return PACKAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/packages/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const pkg = getPackage(slug);
  return pkg ? { title: pkg.title, description: pkg.summary } : {};
}

export default async function PackagePage({ params }: PageProps<"/packages/[slug]">) {
  const { slug } = await params;
  const pkg = getPackage(slug);
  if (!pkg) notFound();
  const dest = getDestination(pkg.destination)!;
  const related = PACKAGES.filter((p) => p.slug !== pkg.slug && (p.category === pkg.category || p.destination === pkg.destination)).slice(0, 3);

  const facts = [
    { icon: Clock, label: "Duration", value: `${pkg.days} days` },
    { icon: Users, label: "Group size", value: `Max ${pkg.maxGroup}` },
    { icon: Activity, label: "Pace", value: pkg.pace },
    { icon: Sun, label: "Best time", value: dest.bestTime },
  ];

  return (
    <article>
      <div className="relative isolate flex min-h-[26rem] items-end overflow-hidden bg-foreground sm:min-h-[32rem]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={packageImage(pkg)} alt={`${dest.name}, ${dest.country}`} className="absolute inset-0 -z-10 size-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/20 to-black/30" />
        <div className="mx-auto w-full max-w-7xl px-5 pb-10 pt-36 text-white sm:px-8">
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-sm text-white/80">
            <Link href="/packages" className="hover:underline">Packages</Link>
            <ChevronRight className="size-3.5" />
            <Link href={`/packages?destination=${dest.slug}`} className="hover:underline">{dest.name}</Link>
          </nav>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full bg-white/20 px-3 py-1 backdrop-blur">{pkg.category}</span>
            <span className="inline-flex items-center gap-1.5"><MapPin className="size-4" /> {dest.name}, {dest.country}</span>
            <span className="inline-flex items-center gap-1.5"><Star className="size-4 fill-sun text-sun" /> {pkg.rating} · {pkg.reviews} reviews</span>
          </div>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-semibold sm:text-6xl">{pkg.title}</h1>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_24rem] lg:gap-14 lg:py-16">
        <div className="min-w-0">
          <dl className="grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-4">
            {facts.map((f) => (
              <div key={f.label} className="flex items-start gap-3">
                <f.icon className="mt-0.5 size-5 text-primary" />
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">{f.label}</dt>
                  <dd className="text-sm font-medium">{f.value}</dd>
                </div>
              </div>
            ))}
          </dl>

          <section className="mt-12" aria-labelledby="overview">
            <h2 id="overview" className="text-2xl font-semibold sm:text-3xl">Overview</h2>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">{pkg.summary}</p>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">{dest.description}</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {pkg.highlights.map((h) => (
                <li key={h} className="flex items-start gap-3 rounded-xl bg-secondary/70 px-4 py-3 text-sm font-medium">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" /> {h}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-14" aria-labelledby="itinerary">
            <div className="flex items-end justify-between gap-4">
              <h2 id="itinerary" className="text-2xl font-semibold sm:text-3xl">Day-by-day itinerary</h2>
              <span className="text-sm text-muted-foreground">{pkg.days} days · {pkg.itinerary.length} stops</span>
            </div>
            <Accordion multiple defaultValue={[pkg.itinerary[0].day]} className="mt-6 gap-3">
              {pkg.itinerary.map((stop, i) => (
                <AccordionItem key={stop.day} value={stop.day} className="rounded-2xl border border-border bg-card px-5 not-last:border-b">
                  <AccordionTrigger className="items-center gap-4 py-4 hover:no-underline">
                    <span className="flex items-center gap-4">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{i + 1}</span>
                      <span>
                        <span className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">{stop.day}</span>
                        <span className="text-base font-semibold">{stop.title}</span>
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pb-4 pl-14 text-sm leading-relaxed text-muted-foreground">
                      <p>{stop.description}</p>
                      {stop.meals && <p className="mt-3 font-medium text-foreground">Meals: <span className="font-normal text-muted-foreground">{stop.meals}</span></p>}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <section className="mt-14 grid gap-8 sm:grid-cols-2" aria-label="What is included">
            <div>
              <h2 className="text-2xl font-semibold">Included</h2>
              <ul className="mt-4 grid gap-3">
                {pkg.included.map((x) => (
                  <li key={x} className="flex items-start gap-3 text-sm"><Check className="mt-0.5 size-4 shrink-0 text-primary" /> {x}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Not included</h2>
              <ul className="mt-4 grid gap-3">
                {pkg.excluded.map((x) => (
                  <li key={x} className="flex items-start gap-3 text-sm text-muted-foreground"><X className="mt-0.5 size-4 shrink-0" /> {x}</li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Book this trip">
          <Suspense fallback={<div className="h-[40rem] animate-pulse rounded-3xl bg-muted" />}>
            <BookingWidget pkg={pkg} />
          </Suspense>
          <div className="mt-4 flex justify-center">
            <WishlistButton slug={pkg.slug} title={pkg.title} variant="inline" />
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-5 pb-24 sm:px-8" aria-labelledby="related">
          <h2 id="related" className="mb-8 text-2xl font-semibold sm:text-3xl">You might also like</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <PackageCard key={p.slug} pkg={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
