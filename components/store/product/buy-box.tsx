"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BadgeCheck, Minus, Plus, RefreshCw, RotateCcw, Sparkles, Truck } from "lucide-react";
import { Price } from "@/components/store/price";
import { saleDiscountFor, type Product } from "@/lib/catalog";
import {
  SUBSCRIBE_DISCOUNT,
  SUBSCRIBE_INTERVALS,
  money2,
  unitPrice,
  type SubscribeInterval,
} from "@/lib/pricing";
import { actions } from "@/lib/store";
import { cn } from "@/lib/utils";

const pct = (n: number) => `${Math.round(n * 100)}%`;

export function BuyBox({ product, inRoutine }: { product: Product; inRoutine: boolean }) {
  const router = useRouter();
  const [sizeId, setSizeId] = useState(product.sizes[0].id);
  const [mode, setMode] = useState<"once" | "subscribe">("once");
  const [interval, setIntervalDays] = useState<SubscribeInterval>(60);
  const [qty, setQty] = useState(1);

  const subscribed = mode === "subscribe";
  const price = unitPrice(product, sizeId, subscribed);
  const oneTime = unitPrice(product, sizeId, false);
  const saleRate = saleDiscountFor(product.slug);
  const lowStock = product.stock < 50;
  const chosenInterval = subscribed ? interval : null;

  const add = () => actions.addToCart(product.slug, sizeId, qty, chosenInterval);
  const buyNow = () => {
    actions.addToCart(product.slug, sizeId, qty, chosenInterval);
    router.push("/checkout");
  };

  return (
    <div className="space-y-6">
      {inRoutine && (
        <p className="flex items-center gap-2 rounded-xl bg-accent px-3 py-2 text-sm font-medium text-accent-foreground">
          <Sparkles className="size-4" aria-hidden="true" />
          This is in your quiz routine
        </p>
      )}

      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <Price product={product} sizeId={sizeId} subscribed={subscribed} size="lg" precise />
        {saleRate > 0 && (
          <span className="rounded-full bg-sale px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-sale-foreground">
            Save {pct(saleRate)} today
          </span>
        )}
      </div>

      {lowStock && (
        <p className="text-sm font-medium text-sale" role="status">
          Low stock: only {product.stock} left
        </p>
      )}

      {product.sizes.length > 1 && (
        <fieldset>
          <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Size · {product.sizes.find((s) => s.id === sizeId)?.label}
          </legend>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <label key={s.id} className="cursor-pointer">
                <input
                  type="radio"
                  name="size"
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
                      : "border-border bg-card hover:bg-muted",
                  )}
                >
                  {s.label}
                  <span className="ml-2 text-xs opacity-80 tabular-nums">{money2(unitPrice(product, s.id, subscribed).final)}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {/* Subscribe & save */}
      <fieldset>
        <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Purchase option
        </legend>
        <div className="grid gap-2">
          <label
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring",
              mode === "once" ? "border-primary bg-card ring-1 ring-primary" : "border-border bg-card hover:bg-muted/60",
            )}
          >
            <input
              type="radio"
              name="mode"
              value="once"
              checked={mode === "once"}
              onChange={() => setMode("once")}
              className="size-4 accent-primary"
            />
            <span className="flex-1 text-sm font-semibold">One-time purchase</span>
            <span className="text-sm tabular-nums">{money2(oneTime.final)}</span>
          </label>

          <label
            className={cn(
              "flex cursor-pointer flex-col gap-3 rounded-xl border p-4 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring",
              mode === "subscribe" ? "border-primary bg-card ring-1 ring-primary" : "border-border bg-card hover:bg-muted/60",
            )}
          >
            <span className="flex items-center gap-3">
              <input
                type="radio"
                name="mode"
                value="subscribe"
                checked={mode === "subscribe"}
                onChange={() => setMode("subscribe")}
                className="size-4 accent-primary"
              />
              <span className="flex-1">
                <span className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                  <RefreshCw className="size-4 text-primary" aria-hidden="true" />
                  Subscribe &amp; save {pct(SUBSCRIBE_DISCOUNT)}
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  Skip, pause or cancel any time.
                </span>
              </span>
              <span className="text-sm font-semibold tabular-nums">
                {money2(unitPrice(product, sizeId, true).final)}
              </span>
            </span>

            {mode === "subscribe" && (
              <span className="flex flex-wrap items-center gap-2 pl-7 text-sm">
                <span className="text-muted-foreground">Deliver every</span>
                <select
                  aria-label="Delivery frequency"
                  value={interval}
                  onChange={(e) => setIntervalDays(Number(e.target.value) as SubscribeInterval)}
                  className="h-9 rounded-lg border border-input bg-background px-2 text-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  {SUBSCRIBE_INTERVALS.map((d) => (
                    <option key={d} value={d}>
                      {d} days
                    </option>
                  ))}
                </select>
              </span>
            )}
          </label>
        </div>
      </fieldset>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex items-center justify-between rounded-xl border border-input bg-card p-1 sm:justify-start" role="group" aria-label="Quantity">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            aria-label="Decrease quantity"
            className="grid size-10 place-items-center rounded-lg hover:bg-muted disabled:opacity-40"
          >
            <Minus className="size-4" />
          </button>
          <span className="w-10 text-center text-sm font-semibold tabular-nums" aria-live="polite">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(10, q + 1))}
            disabled={qty >= 10}
            aria-label="Increase quantity"
            className="grid size-10 place-items-center rounded-lg hover:bg-muted disabled:opacity-40"
          >
            <Plus className="size-4" />
          </button>
        </div>
        <button
          type="button"
          onClick={add}
          className="h-12 flex-1 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Add to bag · {money2(price.final * qty)}
        </button>
      </div>
      <button
        type="button"
        onClick={buyNow}
        className="h-12 w-full rounded-xl border border-input bg-background text-sm font-semibold transition-colors hover:bg-muted"
      >
        Buy it now
      </button>

      <ul className="grid gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:grid-cols-3">
        <li className="flex items-start gap-2">
          <Truck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          Free shipping over $50
        </li>
        <li className="flex items-start gap-2">
          <RotateCcw className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          30-day easy returns
        </li>
        <li className="flex items-start gap-2">
          <BadgeCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          Cruelty-free, never tested on animals
        </li>
      </ul>
    </div>
  );
}
