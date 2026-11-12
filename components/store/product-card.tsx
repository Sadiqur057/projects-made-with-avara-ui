"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { categoryName, type Product } from "@/lib/store/products";
import { money } from "@/lib/store/pricing";
import { useWishlist } from "@/lib/store/store";
import { useShop } from "./use-shop";

export function Price({ product, className }: { product: Pick<Product, "price" | "compareAt">; className?: string }) {
  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      <span className="font-semibold text-foreground">{money(product.price)}</span>
      {product.compareAt && <span className="text-sm text-muted-foreground line-through">{money(product.compareAt)}</span>}
    </span>
  );
}

export function FavouriteButton({ productId, className, label }: { productId: string; className?: string; label?: string }) {
  const wishlist = useWishlist();
  const { toggleFavourite } = useShop();
  const saved = wishlist.includes(productId);
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${label ?? "item"} from wishlist` : `Save ${label ?? "item"} to wishlist`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavourite(productId);
      }}
      className={cn(
        "grid size-9 place-items-center rounded-full bg-background/90 text-foreground shadow-sm backdrop-blur transition hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        className,
      )}
    >
      <Heart className={cn("size-4 transition-colors", saved && "fill-primary text-primary")} />
    </button>
  );
}

const BADGE_STYLES: Record<string, string> = {
  New: "bg-foreground text-background",
  Sale: "bg-primary text-primary-foreground",
  Bestseller: "bg-background text-foreground ring-1 ring-border",
};

export function ProductCard({ product, className, priority }: { product: Product; className?: string; priority?: boolean }) {
  const { add } = useShop();
  const off = product.compareAt ? Math.round((1 - product.price / product.compareAt) * 100) : 0;
  const quickSizes = product.sizes;

  return (
    <article className={cn("group/card relative flex flex-col", className)}>
      <div className="relative">
        <Link href={`/product/${product.slug}`} className="relative block overflow-hidden rounded-2xl bg-muted" aria-label={product.name}>
          <div className="aspect-[3/4]" style={{ backgroundColor: product.tone }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.images[0]}
              alt={product.name}
              loading={priority ? "eager" : "lazy"}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-[1.05]"
            />
          </div>
          {product.badge && (
            <span className={cn("absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide", BADGE_STYLES[product.badge])}>
              {product.badge === "Sale" && off ? `−${off}%` : product.badge}
            </span>
          )}
        </Link>

        <FavouriteButton productId={product.id} label={product.name} className="absolute right-3 top-3" />

        {/* Quick add — pointer devices only; touch users use the product page. */}
        <div className="pointer-events-none absolute inset-x-3 bottom-3 hidden translate-y-2 opacity-0 transition duration-300 group-focus-within/card:pointer-events-auto group-focus-within/card:translate-y-0 group-focus-within/card:opacity-100 group-hover/card:pointer-events-auto group-hover/card:translate-y-0 group-hover/card:opacity-100 [@media(hover:hover)]:block">
          <div className="rounded-xl bg-background/95 p-2 shadow-lg ring-1 ring-border backdrop-blur">
            <p className="px-1 pb-1.5 text-[11px] font-medium text-muted-foreground">Quick add · pick a size</p>
            <div className="flex flex-wrap gap-1">
              {quickSizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => add(product.id, product.colors[0].name, s)}
                  className="min-w-9 rounded-md border border-border px-2 py-1 text-xs font-medium transition hover:border-foreground hover:bg-foreground hover:text-background focus-visible:outline-2 focus-visible:outline-primary"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{categoryName(product.category)}</p>
          <h3 className="truncate text-[15px] font-medium leading-snug">
            <Link href={`/product/${product.slug}`} className="hover:underline underline-offset-4">
              {product.name}
            </Link>
          </h3>
        </div>
        <Price product={product} className="shrink-0 text-sm" />
      </div>

      {product.colors.length > 1 && (
        <div className="mt-2 flex items-center gap-1.5" aria-label={`${product.colors.length} colours`}>
          {product.colors.map((c) => (
            <span key={c.name} title={c.name} className="size-3.5 rounded-full ring-1 ring-border ring-offset-1 ring-offset-background" style={{ backgroundColor: c.hex }} />
          ))}
        </div>
      )}
    </article>
  );
}
