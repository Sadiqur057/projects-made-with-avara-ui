import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ProductDetails } from "@/components/custom/blocks/ProductDetailsBlock";
import { ProductTile } from "@/components/voltix/product-tile";
import { SectionHeading } from "@/components/voltix/section-heading";
import { discountPct, getProduct, products, usd } from "@/lib/products";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return { title: `${product.name} | Voltix`, description: product.description };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = products.filter((p) => p.slug !== product.slug).slice(0, 4);
  const saving = product.originalPrice - product.price;

  return (
    <div className="pt-16">
      <nav
        aria-label="Breadcrumb"
        className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-1.5 px-4 pt-8 text-sm text-muted-foreground sm:px-6"
      >
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="size-3.5" />
        <Link href="/#categories" className="hover:text-foreground">{product.category}</Link>
        <ChevronRight className="size-3.5" />
        <span aria-current="page" className="font-medium text-foreground">{product.name}</span>
      </nav>

      <ProductDetails
        variant="modern-split-gallery"
        title={product.name}
        price={usd(product.price)}
        originalPrice={usd(product.originalPrice)}
        description={product.description}
        badge={product.badge ?? product.category}
        rating={product.rating}
        reviewsCount={product.reviews}
        images={product.images}
        colors={product.colors.map((c) => ({ name: c.name, hex: c.hex, class: "" }))}
        sizes={product.options}
        optionLabel={product.optionLabel}
        optionHelp="Full specs"
        discountLabel={`${discountPct(product)}% OFF`}
        saveLabel={`Save ${usd(saving)} today`}
        stockText={`High demand: only ${product.stock} left in stock for next-day dispatch.`}
        ctaLabel="Add to cart"
        trustLabels={["Free next-day delivery", "30-day returns", "2-year warranty"]}
        specs={product.specs}
        shippingTitle="Free next-day delivery"
        shippingText="Order before 8 pm and it ships the same day in protective packaging, with a tracking link sent to your inbox. Returns are free for 30 days."
        reviewQuote={`"Exactly as described, arrived the next morning and works perfectly." Verified buyer`}
      />

      <section className="mx-auto w-full max-w-7xl px-4 pb-16 pt-4 sm:px-6 sm:pb-24">
        <SectionHeading
          eyebrow="You may also like"
          title="More from Voltix"
          description="Customers who viewed this also looked at these."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((p) => (
            <ProductTile key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
