import Link from "next/link";
import { ArrowRight, Check, Clock, MapPin, Star, Users } from "lucide-react";
import { FEATURED, getDestination, packageImage } from "@/lib/travel-data";
import { money } from "@/lib/format";
import { buttonVariants } from "@/components/ui/button";
import { WishlistButton } from "@/components/site/wishlist-button";
import { cn } from "@/lib/utils";

export function FeaturedTour() {
  const p = FEATURED;
  const d = getDestination(p.destination)!;
  return (
    <div className="grid overflow-hidden rounded-3xl border border-border bg-card lg:grid-cols-2">
      <div className="relative min-h-80 lg:min-h-[34rem]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={packageImage(p)} alt={`${d.name} at sunset`} loading="lazy" className="absolute inset-0 size-full object-cover" />
        <span className="absolute left-5 top-5 rounded-full bg-sun px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sun-foreground">
          Tour of the season
        </span>
        <WishlistButton slug={p.slug} title={p.title} className="absolute right-5 top-5" />
      </div>
      <div className="flex flex-col justify-center gap-6 p-7 sm:p-10 lg:p-12">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><MapPin className="size-4" /> {d.name}, {d.country}</span>
          <span className="inline-flex items-center gap-1.5"><Clock className="size-4" /> {p.days} days</span>
          <span className="inline-flex items-center gap-1.5"><Users className="size-4" /> max {p.maxGroup}</span>
          <span className="inline-flex items-center gap-1.5 font-medium text-foreground"><Star className="size-4 fill-sun text-sun" /> {p.rating} ({p.reviews})</span>
        </div>
        <h3 className="text-balance text-3xl font-semibold sm:text-4xl">{p.title}</h3>
        <p className="text-pretty text-muted-foreground">{p.summary}</p>
        <ul className="grid gap-2.5 sm:grid-cols-2">
          {p.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2 text-sm">
              <Check className="mt-0.5 size-4 shrink-0 text-primary" /> {h}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-center gap-5 border-t border-border pt-6">
          <div>
            <span className="text-xs text-muted-foreground">From</span>
            <div className="text-3xl font-semibold tabular-nums">{money(p.price)}<span className="text-sm font-normal text-muted-foreground"> /person</span></div>
          </div>
          <Link href={`/packages/${p.slug}`} className={cn(buttonVariants({ size: "lg" }), "h-11 rounded-full px-6 text-base")}>
            See the itinerary <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
