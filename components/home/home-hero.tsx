"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, Users } from "lucide-react";
import { HeroCarousel, type HeroSlide } from "@/components/custom/blocks/HeroCarouselBlock";
import { DESTINATIONS, DURATION_FILTERS, REVIEWS, getDestination } from "@/lib/travel-data";
import { TravellerCounter } from "@/components/site/traveller-counter";

const pick = (slug: string, heading: string, description: string, position?: string): HeroSlide => {
  const d = getDestination(slug)!;
  return { image: d.image, alt: `${d.name}, ${d.country}`, title: d.name, description, heading, position };
};

const SLIDES: HeroSlide[] = [
  pick("santorini", "Sail into Santorini's golden hour", "Cave suites, caldera sunsets and a private catamaran. 6 days from $1,890.", "50% 60%"),
  pick("kyoto", "Walk Kyoto before the crowds wake", "Tea ceremonies, lantern lanes and temple dawns. 9 days from $2,450."),
  pick("maldives", "Wake up over a glassy lagoon", "Overwater villas and a sandbank dinner. 5 days from $3,450."),
  pick("bali", "Slow mornings between rice terraces", "Yoga, volcano sunrises and clifftop temples. 7 days from $1,290."),
  pick("iceland", "Chase the northern lights", "Ice caves, waterfalls and aurora nights. 7 days from $2,350."),
];

export function HomeHero() {
  return (
    <HeroCarousel
      slides={SLIDES}
      eyebrow="Small-group journeys · Local hosts"
      heading="Travel that feels like you planned it with a friend"
      intro="Hand-built trips to 14 destinations, led by hosts who live there. Book in minutes, change plans free for up to 30 days."
      avatars={REVIEWS.slice(0, 4).map((r) => ({ src: r.avatar, alt: r.name }))}
      avatarsLabel="12,400+ happy travellers"
      cta={{ label: "Explore all trips", href: "/packages" }}
      linkComponent={Link}
      accent="var(--sun)"
    />
  );
}

export function HeroSearch() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState("any");
  const [travellers, setTravellers] = useState(2);
  const [open, setOpen] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination) params.set("destination", destination);
    if (duration !== "any") params.set("duration", duration);
    params.set("travellers", String(travellers));
    router.push(`/packages?${params.toString()}`);
  };

  const field =
    "h-12 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40";

  return (
    <form
      onSubmit={submit}
      role="search"
      aria-label="Search trips"
      className="relative z-20 mx-auto -mt-10 grid w-[calc(100%-2.5rem)] max-w-5xl gap-3 rounded-3xl border border-border bg-card p-4 shadow-xl sm:-mt-12 sm:w-[calc(100%-4rem)] sm:p-5 md:grid-cols-[1.4fr_1fr_1fr_auto] md:items-end"
    >
      <label className="grid gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Where to?
        <select value={destination} onChange={(e) => setDestination(e.target.value)} className={field}>
          <option value="">Any destination</option>
          {DESTINATIONS.map((d) => (
            <option key={d.slug} value={d.slug}>
              {d.name}, {d.country}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Duration
        <select value={duration} onChange={(e) => setDuration(e.target.value)} className={field}>
          {DURATION_FILTERS.map((d) => (
            <option key={d.id} value={d.id}>
              {d.id === "any" ? "Any length" : d.label}
            </option>
          ))}
        </select>
      </label>
      <div className="relative grid gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Travellers
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className={`${field} flex items-center justify-between text-left normal-case tracking-normal text-foreground`}
        >
          <span className="inline-flex items-center gap-2">
            <Users className="size-4 text-muted-foreground" />
            {travellers} {travellers === 1 ? "traveller" : "travellers"}
          </span>
        </button>
        {open && (
          <div className="absolute left-0 right-0 top-full z-30 mt-2 rounded-xl border border-border bg-popover p-4 normal-case tracking-normal text-popover-foreground shadow-lg">
            <TravellerCounter label="Travellers" hint="Adults and children" value={travellers} min={1} max={12} onChange={setTravellers} />
            <button type="button" onClick={() => setOpen(false)} className="mt-3 w-full rounded-lg bg-secondary py-2 text-sm font-medium">
              Done
            </button>
          </div>
        )}
      </div>
      <button
        type="submit"
        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 active:scale-[0.98] md:px-8"
      >
        <Search className="size-4" /> Search
      </button>
    </form>
  );
}
