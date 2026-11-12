"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { SaleBadge } from "@/components/store/badges";
import { FavoriteButton } from "@/components/store/favorite-button";
import { Price } from "@/components/store/price";
import { ProductImage } from "@/components/store/product-image";
import { ProductRating } from "@/components/store/rating";
import { STEP_LABEL, saleDiscountFor, type Product } from "@/lib/catalog";
import { actions } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * Catalogue card. The whole card is one link (stretched from the title) and
 * the favourite and quick-add buttons sit above it, so nothing nests a button
 * inside an anchor.
 */
export function ProductCard({
  product,
  priority = false,
  className,
}: {
  product: Product;
  priority?: boolean;
  className?: string;
}) {
  const sale = saleDiscountFor(product.slug);
  const defaultSize = product.sizes[0];

  return (
    <article className={cn("group relative flex h-full flex-col", className)}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
        <ProductImage
          slug={product.slug}
          view={1}
          priority={priority}
          className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-0 motion-reduce:transition-none"
        />
        <ProductImage
          slug={product.slug}
          view={2}
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none"
        />

        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {sale > 0 && <SaleBadge>{Math.round(sale * 100)}% off</SaleBadge>}
          {product.bestseller && sale === 0 && (
            <span className="rounded-full bg-card/90 px-2.5 py-1 text-[11px] font-semibold text-foreground backdrop-blur">
              Bestseller
            </span>
          )}
          {product.isNew && sale === 0 && (
            <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-accent-foreground">
              New
            </span>
          )}
        </div>

        <FavoriteButton slug={product.slug} name={product.name} className="absolute right-3 top-3 z-10" />

        <button
          type="button"
          onClick={() => actions.addToCart(product.slug, defaultSize.id)}
          aria-label={`Add ${product.name}, ${defaultSize.label}, to bag`}
          className="absolute inset-x-3 bottom-3 z-10 flex items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-focus-within:translate-y-0 sm:group-focus-within:opacity-100 motion-reduce:transition-none"
        >
          <Plus className="size-4" aria-hidden="true" />
          Quick add
        </button>
      </div>

      <div className="mt-3 flex flex-1 flex-col gap-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {STEP_LABEL[product.step]}
        </p>
        <h3 className="font-display text-lg font-medium leading-snug text-foreground">
          <Link
            href={`/shop/${product.slug}`}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-2xl focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-ring"
          >
            {product.name}
          </Link>
        </h3>
        <p className="line-clamp-1 text-sm text-muted-foreground">{product.tagline}</p>
        <div className="mt-auto flex flex-col gap-1 pt-2">
          <ProductRating slug={product.slug} size={12} />
          <Price product={product} />
        </div>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-3">
      <div className="aspect-[4/5] animate-pulse rounded-2xl bg-muted motion-reduce:animate-none" />
      <div className="h-3 w-20 animate-pulse rounded bg-muted motion-reduce:animate-none" />
      <div className="h-5 w-3/4 animate-pulse rounded bg-muted motion-reduce:animate-none" />
      <div className="h-4 w-1/2 animate-pulse rounded bg-muted motion-reduce:animate-none" />
    </div>
  );
}
