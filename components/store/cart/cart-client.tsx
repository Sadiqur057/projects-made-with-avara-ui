"use client";

import Link from "next/link";
import { Minus, Plus, RefreshCw, ShoppingBag, Trash2 } from "lucide-react";
import {
  FreeShippingMeter,
  PromoField,
  TotalsTable,
} from "@/components/store/cart/order-summary";
import { ProductCard } from "@/components/store/product-card";
import { ProductImage } from "@/components/store/product-image";
import { PRODUCTS } from "@/lib/catalog";
import {
  SUBSCRIBE_DISCOUNT,
  SUBSCRIBE_INTERVALS,
  money2,
  priceCart,
  type PricedLine,
  type SubscribeInterval,
} from "@/lib/pricing";
import { actions, useHydrated, useStore } from "@/lib/store";

function CartLine({ line }: { line: PricedLine }) {
  const { product, size, price } = line;
  const discounted = price.final < price.list;
  return (
    <li className="grid grid-cols-[6rem_1fr] gap-4 border-b border-border py-6 first:pt-0 last:border-b-0 sm:grid-cols-[8rem_1fr]">
      <Link href={`/shop/${product.slug}`} className="block aspect-[4/5] overflow-hidden rounded-2xl bg-muted" aria-hidden="true" tabIndex={-1}>
        <ProductImage slug={product.slug} view={1} />
      </Link>

      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-display text-lg font-medium leading-snug sm:text-xl">
              <Link href={`/shop/${product.slug}`} className="hover:underline">
                {product.name}
              </Link>
            </h2>
            <p className="text-sm text-muted-foreground">{product.tagline}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-semibold tabular-nums">{money2(line.total)}</p>
            {discounted && (
              <p className="text-xs tabular-nums text-muted-foreground line-through">
                <span className="sr-only">Was </span>
                {money2(price.list * line.qty)}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {product.sizes.length > 1 && (
            <label className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Size</span>
              <select
                value={size.id}
                onChange={(e) => actions.setSize(line.key, e.target.value)}
                className="h-9 rounded-lg border border-input bg-background px-2 text-sm"
              >
                {product.sizes.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          )}
          {product.sizes.length === 1 && <span className="text-sm text-muted-foreground">{size.label}</span>}

          <label className="flex items-center gap-2 text-sm">
            <span className="flex items-center gap-1 text-muted-foreground">
              <RefreshCw className="size-3.5" aria-hidden="true" />
              Delivery
            </span>
            <select
              value={line.interval ?? 0}
              onChange={(e) => {
                const v = Number(e.target.value);
                actions.setInterval(line.key, v === 0 ? null : (v as SubscribeInterval));
              }}
              className="h-9 rounded-lg border border-input bg-background px-2 text-sm"
            >
              <option value={0}>One-time</option>
              {SUBSCRIBE_INTERVALS.map((d) => (
                <option key={d} value={d}>
                  Every {d} days · save {Math.round(SUBSCRIBE_DISCOUNT * 100)}%
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3">
          <div className="flex items-center rounded-xl border border-input bg-card p-0.5" role="group" aria-label={`Quantity of ${product.name}`}>
            <button
              type="button"
              onClick={() => actions.setQty(line.key, line.qty - 1)}
              aria-label={line.qty === 1 ? `Remove ${product.name}` : "Decrease quantity"}
              className="grid size-9 place-items-center rounded-lg hover:bg-muted"
            >
              <Minus className="size-4" />
            </button>
            <span className="w-9 text-center text-sm font-semibold tabular-nums" aria-live="polite">
              {line.qty}
            </span>
            <button
              type="button"
              onClick={() => actions.setQty(line.key, line.qty + 1)}
              disabled={line.qty >= 10}
              aria-label="Increase quantity"
              className="grid size-9 place-items-center rounded-lg hover:bg-muted disabled:opacity-40"
            >
              <Plus className="size-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => actions.removeLine(line.key)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-4" aria-hidden="true" />
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}

export function CartClient() {
  const { cart, promo } = useStore();
  const hydrated = useHydrated();
  const totals = priceCart(cart, promo);

  if (!hydrated) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6" aria-busy="true" aria-label="Loading your bag">
        <div className="h-10 w-48 animate-pulse rounded bg-muted motion-reduce:animate-none" />
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_24rem]">
          <div className="h-80 animate-pulse rounded-3xl bg-muted motion-reduce:animate-none" />
          <div className="h-80 animate-pulse rounded-3xl bg-muted motion-reduce:animate-none" />
        </div>
      </div>
    );
  }

  if (totals.lines.length === 0) {
    const suggestions = PRODUCTS.filter((p) => p.bestseller).slice(0, 4);
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid place-items-center rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-secondary text-primary">
            <ShoppingBag className="size-7" aria-hidden="true" />
          </span>
          <h1 className="mt-5 font-display text-4xl font-medium">Your bag is empty</h1>
          <p className="mt-2 max-w-md text-muted-foreground">
            Nothing here yet. Start with our bestsellers, or take the quiz and we&apos;ll build a routine for you.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/shop" className="inline-flex h-12 items-center rounded-xl bg-primary px-7 text-sm font-semibold text-primary-foreground hover:opacity-90">
              Shop all
            </Link>
            <Link href="/quiz" className="inline-flex h-12 items-center rounded-xl border border-input px-7 text-sm font-semibold hover:bg-muted">
              Take the skin quiz
            </Link>
          </div>
        </div>
        <section className="mt-16" aria-labelledby="empty-suggest">
          <h2 id="empty-suggest" className="font-display text-2xl font-medium">
            Most loved
          </h2>
          <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
            {suggestions.map((p) => (
              <li key={p.slug}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="font-display text-4xl font-medium tracking-tight sm:text-5xl">
        Your bag <span className="text-2xl text-muted-foreground tabular-nums">({totals.count})</span>
      </h1>

      <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1fr_24rem]">
        <ul>
          {totals.lines.map((line) => (
            <CartLine key={line.key} line={line} />
          ))}
        </ul>

        <aside className="rounded-3xl border border-border bg-card p-5 sm:p-6 lg:sticky lg:top-6" aria-label="Order summary">
          <h2 className="font-display text-2xl font-medium">Order summary</h2>
          <div className="mt-5 grid gap-5">
            <FreeShippingMeter totals={totals} />
            <PromoField promo={promo} />
            <TotalsTable totals={totals} />
            {totals.hasSubscription && (
              <p className="flex items-start gap-2 rounded-xl bg-muted px-3 py-2.5 text-xs text-muted-foreground">
                <RefreshCw className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                Subscription items ship on the schedule you chose. Skip, pause or cancel before the next shipment.
              </p>
            )}
            <Link
              href="/checkout"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Checkout
            </Link>
            <Link href="/shop" className="text-center text-sm font-medium text-muted-foreground hover:text-foreground">
              Continue shopping
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
