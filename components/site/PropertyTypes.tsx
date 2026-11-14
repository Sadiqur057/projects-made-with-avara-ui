import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PROPERTY_TYPES } from "@/lib/properties";

export function PropertyTypes() {
  return (
    <section id="types" className="scroll-mt-24 bg-background px-6 py-24 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Property types</p>
            <h2 className="text-balance mt-3 text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
              Whatever home you imagine, we know where it is
            </h2>
          </div>
          <p className="max-w-sm text-muted-foreground">
            From a first flat to a family house or a waterfront villa, browse the kind of place that fits your life.
          </p>
        </div>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PROPERTY_TYPES.map((type) => (
            <li key={type.name}>
              <Link
                href="/#listings"
                className="group relative block aspect-[3/4] overflow-hidden rounded-3xl bg-muted focus-visible:outline-2 focus-visible:outline-ring"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={type.image}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 text-white">
                  <div>
                    <h3 className="text-2xl font-medium">{type.name}</h3>
                    <p className="mt-1 text-sm text-white/80">{type.count} available</p>
                  </div>
                  <span className="grid size-10 place-items-center rounded-full bg-white/20 backdrop-blur transition-colors group-hover:bg-white group-hover:text-black">
                    <ArrowUpRight className="size-5" aria-hidden />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
