"use client";

import Link from "next/link";
import { Droplets } from "lucide-react";
import { ProductDetails, type ProductDetailsTab } from "@/components/custom/blocks/ProductDetailsBlock";
import { ProductCard } from "@/components/store/product-card";
import { BuyBox } from "@/components/store/product/buy-box";
import { ReviewsSection } from "@/components/store/product/reviews-section";
import { SectionHeading } from "@/components/store/section-heading";
import {
  CONCERN_LABEL,
  INGREDIENT_BY_ID,
  PRODUCTS,
  SKIN_TYPE_LABEL,
  STEP_LABEL,
  productImages,
  saleDiscountFor,
  type Product,
} from "@/lib/catalog";
import { recommend } from "@/lib/quiz";
import { actions, useFavorite, useProductReviews, useStore } from "@/lib/store";

function related(product: Product): Product[] {
  return PRODUCTS.filter((p) => p.slug !== product.slug && p.step !== product.step)
    .map((p) => ({
      p,
      score:
        p.concerns.filter((c) => product.concerns.includes(c)).length * 2 +
        p.skinTypes.filter((t) => product.skinTypes.includes(t)).length +
        (p.bestseller ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((x) => x.p);
}

const Spec = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="rounded-2xl border border-border bg-card p-4">
    <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</dt>
    <dd className="mt-1.5 text-sm font-medium text-foreground">{children}</dd>
  </div>
);

export function ProductView({ product }: { product: Product }) {
  const liked = useFavorite(product.slug);
  const { stats } = useProductReviews(product.slug);
  const { quiz } = useStore();
  const inRoutine = quiz ? recommend(quiz).picks.some((p) => p.product.slug === product.slug) : false;
  const sale = saleDiscountFor(product.slug);

  const tabs: ProductDetailsTab[] = [
    {
      id: "details",
      label: "Details",
      content: (
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="max-w-prose leading-relaxed text-foreground/85">{product.description}</p>
            <ul className="mt-5 grid gap-2 text-sm">
              {product.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5">
                  <Droplets className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
          <dl className="grid grid-cols-2 gap-3 content-start">
            <Spec label="Best for">{product.skinTypes.map((t) => SKIN_TYPE_LABEL[t]).join(", ")}</Spec>
            <Spec label="Helps with">{product.concerns.map((c) => CONCERN_LABEL[c]).join(", ")}</Spec>
            <Spec label="Use">
              {{ am: "Morning", pm: "Evening", both: "Morning & evening", weekly: "Once or twice a week" }[product.time]}
            </Spec>
            <Spec label="Good to know">{product.tags.join(" · ")}</Spec>
            {product.keyIngredients.length > 0 && (
              <div className="col-span-2 rounded-2xl border border-border bg-card p-4">
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Key ingredients</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {product.keyIngredients.map((id) => (
                    <Link
                      key={id}
                      href="/#ingredients"
                      className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground hover:opacity-80"
                    >
                      {INGREDIENT_BY_ID[id]?.name}
                    </Link>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </div>
      ),
    },
    {
      id: "how",
      label: "How to use",
      content: (
        <ol className="grid max-w-2xl gap-4">
          {product.howToUse.map((step, i) => (
            <li key={step} className="flex gap-4">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {i + 1}
              </span>
              <p className="pt-1 text-foreground/85">{step}</p>
            </li>
          ))}
        </ol>
      ),
    },
    {
      id: "ingredients",
      label: "Ingredients",
      content: (
        <div className="max-w-3xl">
          <p className="text-sm leading-relaxed text-foreground/85">{product.inci}</p>
          <p className="mt-3 text-xs text-muted-foreground">
            Full INCI list as printed on the pack. Patch test new products on your inner arm before first use.
          </p>
        </div>
      ),
    },
    {
      id: "shipping",
      label: "Shipping & returns",
      content: (
        <div className="grid max-w-3xl gap-3 text-sm leading-relaxed text-foreground/85">
          <p>
            <strong>Standard</strong> (3–5 business days) is free over $50, otherwise $6. <strong>Express</strong> (1–2
            business days) is $14.
          </p>
          <p>
            Not in love? Return unopened products within 30 days for a full refund, or opened ones for store credit.
          </p>
          <p>Subscriptions can be skipped, paused or cancelled before the next shipment, with no fee.</p>
        </div>
      ),
    },
    {
      id: "reviews",
      label: `Reviews (${stats.count})`,
      content: <ReviewsSection product={product} />,
    },
  ];

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-12">
      <nav aria-label="Breadcrumb" className="mx-auto mb-6 max-w-7xl text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/shop" className="hover:text-foreground hover:underline">
              Shop
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/shop?step=${product.step}`} className="hover:text-foreground hover:underline">
              {STEP_LABEL[product.step]}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-foreground">
            {product.name}
          </li>
        </ol>
      </nav>

      <ProductDetails
        title={product.name}
        description={product.tagline}
        badge={STEP_LABEL[product.step].replace(/s$/, "")}
        rating={stats.average}
        reviewsCount={stats.count}
        images={productImages(product.slug)}
        imageAlt={`${product.name}, ${product.tagline}`}
        imageBadge={sale > 0 ? `${Math.round(sale * 100)}% off` : undefined}
        liked={liked}
        onToggleLike={() => actions.toggleFavorite(product.slug)}
        tabs={tabs}
      >
        <BuyBox key={product.slug} product={product} inRoutine={inRoutine} />
      </ProductDetails>

      <section aria-labelledby="pairs-title" className="mx-auto mt-20 max-w-7xl">
        <SectionHeading id="pairs-title" eyebrow="Complete the routine" title="Pairs well with" href="/shop" hrefLabel="Shop all" />
        <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {related(product).map((p) => (
            <li key={p.slug}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
