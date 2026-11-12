"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import Button from "@/components/custom/blocks/Button";
import { categoryName, getProductById, type Product } from "@/lib/store/products";
import { clearWishlist, toggleWishlist, useShopState } from "@/lib/store/store";
import { cn } from "@/lib/utils";
import { Price } from "./product-card";
import { useShop } from "./use-shop";

function WishRow({ product }: { product: Product }) {
  const { add } = useShop();
  const [color, setColor] = useState(product.colors[0].name);
  const [size, setSize] = useState<string>(product.sizes.length === 1 ? product.sizes[0] : "");
  const [error, setError] = useState(false);

  return (
    <li className="flex gap-4 rounded-3xl border border-border bg-card p-3 sm:gap-6 sm:p-4">
      <Link href={`/product/${product.slug}`} className="aspect-[3/4] w-28 shrink-0 overflow-hidden rounded-2xl sm:w-40" style={{ backgroundColor: product.tone }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.images[0]} alt={product.name} loading="lazy" className="h-full w-full object-cover" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col py-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">{categoryName(product.category)}</p>
            <Link href={`/product/${product.slug}`} className="block truncate text-lg font-medium underline-offset-4 hover:underline">
              {product.name}
            </Link>
            <Price product={product} className="mt-1" />
          </div>
          <button type="button" aria-label={`Remove ${product.name} from wishlist`} onClick={() => toggleWishlist(product.id)} className="grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-destructive">
            <Trash2 className="size-4" />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
          {product.colors.length > 1 && (
            <div className="flex items-center gap-2" role="radiogroup" aria-label="Colour">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  role="radio"
                  aria-checked={c.name === color}
                  aria-label={c.name}
                  title={c.name}
                  onClick={() => setColor(c.name)}
                  className={cn("size-6 rounded-full ring-1 ring-border ring-offset-2 ring-offset-card transition", c.name === color && "ring-2 ring-foreground")}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-1.5" role="radiogroup" aria-label="Size">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={s === size}
                onClick={() => {
                  setSize(s);
                  setError(false);
                }}
                className={cn("h-8 min-w-9 rounded-md border px-2 text-xs font-medium transition", s === size ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground", error && s !== size && "border-destructive/60")}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        {error && (
          <p role="alert" className="mt-2 text-xs text-destructive">
            Choose a size to add this to your bag.
          </p>
        )}

        <div className="mt-auto pt-4">
          <Button
            variant="default"
            className="h-10 gap-2 rounded-full px-5 text-sm"
            iconLeft={<ShoppingBag className="size-4" />}
            onClick={() => {
              if (!size) {
                setError(true);
                return;
              }
              add(product.id, color, size, 1, { openCart: true });
            }}
          >
            Move to bag
          </Button>
        </div>
      </div>
    </li>
  );
}

export function WishlistView() {
  const { wishlist } = useShopState();
  const items = wishlist.map(getProductById).filter((p): p is Product => !!p);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-24 pt-6 sm:px-6">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-8 pt-4">
        <div>
          <h1 className="font-heading text-5xl sm:text-7xl">Wishlist</h1>
          <p className="mt-3 text-muted-foreground" aria-live="polite">
            {items.length} saved {items.length === 1 ? "piece" : "pieces"}
          </p>
        </div>
        {items.length > 0 && (
          <button type="button" onClick={clearWishlist} className="text-sm text-muted-foreground underline underline-offset-4 transition hover:text-foreground">
            Clear wishlist
          </button>
        )}
      </header>

      {items.length === 0 ? (
        <div className="flex flex-col items-center py-24 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-muted">
            <Heart className="size-7 text-muted-foreground" />
          </span>
          <p className="font-heading mt-6 text-4xl">Nothing saved yet</p>
          <p className="mt-2 max-w-sm text-muted-foreground">Tap the heart on anything you love and it&rsquo;ll wait for you here, on this device.</p>
          <Link href="/shop" className="mt-8 inline-flex h-11 items-center rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
            Explore the shop
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {items.map((p) => (
            <WishRow key={p.id} product={p} />
          ))}
        </ul>
      )}
    </div>
  );
}
