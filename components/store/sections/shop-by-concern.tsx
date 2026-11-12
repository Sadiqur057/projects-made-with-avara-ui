import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProductImage } from "@/components/store/product-image";
import { SectionHeading } from "@/components/store/section-heading";
import { CONCERNS, PRODUCTS, type ConcernInfo } from "@/lib/catalog";
import { cn } from "@/lib/utils";

// Background washes cycle through the theme's quiet colours, never raw hues.
const WASH = ["bg-secondary", "bg-accent", "bg-muted", "bg-secondary", "bg-accent", "bg-muted", "bg-secondary"];

function ConcernCard({ concern, index }: { concern: ConcernInfo; index: number }) {
  const matches = PRODUCTS.filter((p) => p.concerns.includes(concern.id));
  const feature = index === 0;
  return (
    <Link
      href={`/shop?concern=${concern.id}`}
      className={cn(
        "group relative flex min-h-48 flex-col justify-between overflow-hidden rounded-3xl p-5 transition-shadow hover:shadow-lg sm:p-6",
        WASH[index % WASH.length],
        feature && "col-span-2 min-h-56 md:row-span-1",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-2xl font-medium leading-tight text-foreground sm:text-[1.65rem]">
            {concern.name}
          </h3>
          <p className="mt-1.5 max-w-[22ch] text-sm leading-snug text-foreground/70">{concern.blurb}</p>
        </div>
        <span
          aria-hidden="true"
          className="grid size-9 shrink-0 place-items-center rounded-full bg-card/80 text-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        >
          <ArrowUpRight className="size-4" />
        </span>
      </div>

      <div className="mt-6 flex items-end justify-between">
        <div className="flex -space-x-4" aria-hidden="true">
          {matches.slice(0, feature ? 4 : 3).map((p) => (
            <span
              key={p.slug}
              className="size-14 overflow-hidden rounded-full border-2 border-card bg-card shadow-sm sm:size-16"
            >
              <ProductImage slug={p.slug} view={1} className="object-top scale-125" />
            </span>
          ))}
        </div>
        <span className="text-xs font-semibold text-foreground/70">
          {matches.length} {matches.length === 1 ? "product" : "products"}
        </span>
      </div>
    </Link>
  );
}

export function ShopByConcern() {
  return (
    <section aria-labelledby="concern-title" className="bg-muted/60">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <SectionHeading
          id="concern-title"
          eyebrow="Shop by concern"
          title="Start with what you'd like to change"
          description="Pick the thing on your mind and we'll show the formulas that help."
          href="/quiz"
          hrefLabel="Or take the quiz"
        />
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {CONCERNS.map((c, i) => (
            <ConcernCard key={c.id} concern={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
