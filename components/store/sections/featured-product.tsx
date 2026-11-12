"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Eyebrow, SaleBadge } from "@/components/store/badges";
import { FavoriteButton } from "@/components/store/favorite-button";
import { Price } from "@/components/store/price";
import { ProductImage } from "@/components/store/product-image";
import { ProductRating } from "@/components/store/rating";
import { FEATURED_SLUG, INGREDIENT_BY_ID, getProduct, saleDiscountFor } from "@/lib/catalog";
import { actions } from "@/lib/store";
import { cn } from "@/lib/utils";

export function FeaturedProduct() {
  const product = getProduct(FEATURED_SLUG)!;
  const [sizeId, setSizeId] = useState(product.sizes[0].id);
  const sale = saleDiscountFor(product.slug);

  return (
    <section aria-labelledby="featured-title" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="grid items-center gap-10 overflow-hidden rounded-[2rem] bg-secondary p-4 sm:p-8 lg:grid-cols-2 lg:gap-16 lg:p-12">
        <div className="relative">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl bg-card shadow-sm lg:max-w-none">
            <ProductImage slug={product.slug} view={3} alt={`${product.name} on a stone podium`} />
            {sale > 0 && <SaleBadge className="absolute left-4 top-4">{Math.round(sale * 100)}% off</SaleBadge>}
          </div>
          <div className="absolute -bottom-4 right-4 hidden w-40 overflow-hidden rounded-2xl border-4 border-secondary bg-card shadow-lg sm:block lg:right-[-1.5rem]">
            <div className="aspect-[4/5]">
              <ProductImage slug={product.slug} view={2} alt="" />
            </div>
          </div>
        </div>

        <div className="lg:py-4">
          <Eyebrow>Featured · Bestseller</Eyebrow>
          <h2
            id="featured-title"
            className="mt-2 font-display text-4xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-5xl"
          >
            {product.name}
          </h2>
          <p className="mt-3 text-lg text-foreground/80">{product.tagline}</p>
          <ProductRating slug={product.slug} size={16} className="mt-4" />

          <p className="mt-5 max-w-prose text-base leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <ul className="mt-6 grid gap-2.5">
            {product.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2.5 text-sm text-foreground">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-success text-success-foreground">
                  <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                </span>
                {h}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-2">
            {product.keyIngredients.map((id) => (
              <span
                key={id}
                className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground"
              >
                {INGREDIENT_BY_ID[id]?.name}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <fieldset className="flex gap-2">
              <legend className="sr-only">Size</legend>
              {product.sizes.map((s) => (
                <label key={s.id} className="cursor-pointer">
                  <input
                    type="radio"
                    name="featured-size"
                    value={s.id}
                    checked={sizeId === s.id}
                    onChange={() => setSizeId(s.id)}
                    className="peer sr-only"
                  />
                  <span
                    className={cn(
                      "block rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring",
                      sizeId === s.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-foreground hover:bg-muted",
                    )}
                  >
                    {s.label}
                  </span>
                </label>
              ))}
            </fieldset>
            <Price product={product} sizeId={sizeId} size="lg" precise />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => actions.addToCart(product.slug, sizeId)}
              className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-7 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Add to bag
            </button>
            <FavoriteButton slug={product.slug} name={product.name} className="size-12" />
            <Link
              href={`/shop/${product.slug}`}
              className="group inline-flex items-center gap-1.5 px-2 text-sm font-semibold text-foreground underline-offset-4 hover:underline"
            >
              Full details
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
