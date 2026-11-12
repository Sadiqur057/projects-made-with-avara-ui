import Link from "next/link";
import { Clock, MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { WishlistButton } from "@/components/site/wishlist-button";
import { getDestination, packageImage, type TravelPackage } from "@/lib/travel-data";
import { money } from "@/lib/format";
import { cn } from "@/lib/utils";

export function PackageCard({
  pkg,
  className,
  priority = false,
}: {
  pkg: TravelPackage;
  className?: string;
  priority?: boolean;
}) {
  const dest = getDestination(pkg.destination);
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={packageImage(pkg)}
          alt={`${pkg.title} — ${dest?.name}`}
          loading={priority ? "eager" : "lazy"}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge className="bg-background/90 text-foreground backdrop-blur">{pkg.category}</Badge>
          {pkg.deal && <Badge className="bg-sun text-sun-foreground">-{pkg.deal.discount}%</Badge>}
        </div>
        <WishlistButton slug={pkg.slug} title={pkg.title} className="absolute right-3 top-3 z-10" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5" /> {dest?.name}, {dest?.country}
          </span>
          <span className="inline-flex items-center gap-1 font-medium text-foreground">
            <Star className="size-3.5 fill-sun text-sun" /> {pkg.rating}
            <span className="font-normal text-muted-foreground">({pkg.reviews})</span>
          </span>
        </div>
        <h3 className="text-lg font-semibold leading-snug">
          <Link href={`/packages/${pkg.slug}`} className="after:absolute after:inset-0 after:z-0 focus-visible:outline-none">
            {pkg.title}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{pkg.summary}</p>
        <div className="mt-auto flex items-end justify-between pt-2">
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="size-4" /> {pkg.days} days
          </span>
          <div className="text-right">
            <span className="block text-xs text-muted-foreground">from</span>
            <span className="text-xl font-semibold tabular-nums">{money(pkg.price)}</span>
            <span className="text-xs text-muted-foreground"> /person</span>
          </div>
        </div>
      </div>
    </article>
  );
}
