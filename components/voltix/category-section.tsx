/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/lib/products";
import { SectionHeading } from "./section-heading";

export function CategorySection() {
  return (
    <section
      id="categories"
      className="mx-auto w-full max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24"
    >
      <SectionHeading
        eyebrow="Shop by category"
        title="Find your next favourite device"
        description="From everyday earbuds to creator-grade laptops. Pick a category and start browsing."
      />

      <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {categories.map((cat) => (
          <li key={cat.name}>
            <Link
              href={cat.href}
              className="group relative block aspect-[4/5] overflow-hidden rounded-3xl border border-border bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <img
                src={cat.image}
                alt=""
                loading="lazy"
                width={800}
                height={1000}
                className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/10 to-transparent" />
              <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2 text-background sm:inset-x-5 sm:bottom-5">
                <div>
                  <h3 className="text-base font-bold leading-tight sm:text-xl">
                    {cat.name}
                  </h3>
                  <p className="mt-0.5 text-xs font-medium opacity-80 sm:text-sm">
                    {cat.count} products
                  </p>
                </div>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-background/90 text-foreground transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground sm:size-10">
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
