import { PROPERTIES } from "@/lib/properties";
import { PropertyCard } from "./PropertyCard";

export function FeaturedListings() {
  return (
    <section id="listings" className="scroll-mt-24 bg-secondary/60 px-6 py-24 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Featured listings</p>
          <h2 className="text-balance mt-3 text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
            Hand-picked homes, ready to tour
          </h2>
          <p className="mt-4 text-muted-foreground">
            Every listing is visited by one of our agents, photographed in daylight and checked for clear title.
          </p>
        </div>
        <ul className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {PROPERTIES.map((property) => (
            <li key={property.slug} className="flex">
              <div className="flex w-full">
                <PropertyCard property={property} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
