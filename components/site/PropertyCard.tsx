import Link from "next/link";
import { ArrowUpRight, Bath, BedDouble, MapPin, Ruler } from "lucide-react";
import { money, type Property } from "@/lib/properties";

export function PropertyCard({ property }: { property: Property }) {
  return (
    <Link
      href={`/properties/${property.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 focus-visible:outline-2 focus-visible:outline-ring"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={property.images[0]}
          alt={`${property.title}, ${property.type.toLowerCase()} in ${property.city}`}
          loading="lazy"
          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur">
          {property.badge}
        </span>
        <span className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-primary text-primary-foreground opacity-0 transition-opacity group-hover:opacity-100">
          <ArrowUpRight className="size-4" aria-hidden />
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-2xl font-semibold tracking-tight text-foreground">{money(property.price)}</p>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{property.type}</p>
        </div>
        <h3 className="text-lg font-semibold leading-snug text-foreground">{property.title}</h3>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" aria-hidden />
          {property.address}, {property.city}
        </p>
        <ul className="mt-auto flex items-center gap-5 border-t border-border pt-4 text-sm text-foreground">
          <li className="flex items-center gap-1.5">
            <BedDouble className="size-4 text-muted-foreground" aria-hidden />
            {property.beds} bd
          </li>
          <li className="flex items-center gap-1.5">
            <Bath className="size-4 text-muted-foreground" aria-hidden />
            {property.baths} ba
          </li>
          <li className="flex items-center gap-1.5">
            <Ruler className="size-4 text-muted-foreground" aria-hidden />
            {property.sqft.toLocaleString("en-US")} sqft
          </li>
        </ul>
      </div>
    </Link>
  );
}
