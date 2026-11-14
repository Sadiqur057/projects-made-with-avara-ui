import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { products } from "@/lib/products";
import { ProductTile } from "./product-tile";
import { SectionHeading } from "./section-heading";

const FEATURED = [
  "volt-pro-x1-headphones",
  "nova-12-5g-smartphone",
  "aero-14-ultrabook",
  "buds-air-pro",
];

export function FeaturedProducts() {
  const featured = FEATURED.map((slug) => products.find((p) => p.slug === slug)!);

  return (
    <section
      id="featured"
      className="scroll-mt-20 border-y border-border bg-muted/40"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <SectionHeading
          eyebrow="Featured products"
          title="Top picks this week"
          description="Hand-selected by our team and loved by thousands of customers."
          action={
            <Link
              href="/products/volt-pro-x1-headphones"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              View best seller <ArrowRight className="size-4" />
            </Link>
          }
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductTile key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
