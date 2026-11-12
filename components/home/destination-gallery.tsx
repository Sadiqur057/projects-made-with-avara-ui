import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DESTINATIONS, packagesFor } from "@/lib/travel-data";
import { cn } from "@/lib/utils";
import { money } from "@/lib/format";

const SHOWN = ["santorini", "kyoto", "bali", "maldives", "iceland", "peru", "tanzania"];
/** Grid placement for a bento-style gallery on large screens. */
const SPAN = [
  "md:col-span-2 md:row-span-2",
  "",
  "",
  "md:col-span-2",
  "",
  "",
  "md:col-span-2",
];

export function DestinationGallery() {
  const items = SHOWN.map((s) => DESTINATIONS.find((d) => d.slug === s)!);
  return (
    <ul className="grid auto-rows-[15rem] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:auto-rows-[13rem]">
      {items.map((d, i) => {
        const from = Math.min(...packagesFor(d.slug).map((p) => p.price));
        return (
          <li key={d.slug} className={cn("group relative overflow-hidden rounded-2xl", SPAN[i])}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={d.image}
              alt={`${d.name}, ${d.country}`}
              loading="lazy"
              className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-white">
              <div>
                <p className="text-xs uppercase tracking-widest text-white/80">{d.country}</p>
                <h3 className="text-2xl font-semibold">
                  <Link href={`/packages?destination=${d.slug}`} className="after:absolute after:inset-0">
                    {d.name}
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-white/80">from {money(from)}</p>
              </div>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur transition group-hover:bg-white group-hover:text-black">
                <ArrowUpRight className="size-5" />
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
