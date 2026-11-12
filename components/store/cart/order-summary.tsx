"use client";

import { useState } from "react";
import { Tag, Truck, X } from "lucide-react";
import { ProductImage } from "@/components/store/product-image";
import {
  FREE_SHIPPING_THRESHOLD,
  PROMO_CODES,
  SHIPPING,
  money2,
  type CartTotals,
  type ShippingMethod,
} from "@/lib/pricing";
import { actions } from "@/lib/store";

export function FreeShippingMeter({ totals, method = "standard" }: { totals: CartTotals; method?: ShippingMethod }) {
  if (totals.lines.length === 0 || method === "express") return null;
  const progress = Math.min(1, (FREE_SHIPPING_THRESHOLD - totals.toFreeShipping) / FREE_SHIPPING_THRESHOLD);
  return (
    <div>
      <p className="flex items-center gap-2 text-sm">
        <Truck className="size-4 text-primary" aria-hidden="true" />
        {totals.freeShipping ? (
          <span className="font-medium">You&apos;ve unlocked free shipping</span>
        ) : (
          <span>
            You&apos;re <strong className="tabular-nums">{money2(totals.toFreeShipping)}</strong> away from free shipping
          </span>
        )}
      </p>
      <div
        role="progressbar"
        aria-label="Progress to free shipping"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-500 motion-reduce:transition-none"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}

export function PromoField({ promo }: { promo: string | null }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (promo) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl bg-accent px-3 py-2.5 text-sm text-accent-foreground">
        <span className="flex items-center gap-2 font-medium">
          <Tag className="size-4" aria-hidden="true" />
          {promo} · {PROMO_CODES[promo]?.label}
        </span>
        <button
          type="button"
          onClick={() => actions.removePromo()}
          aria-label={`Remove code ${promo}`}
          className="grid size-7 place-items-center rounded-full hover:bg-background/50"
        >
          <X className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (!code.trim()) {
          setError("Enter a code first.");
          return;
        }
        if (actions.applyPromo(code)) {
          setCode("");
          setError(null);
        } else {
          setError("That code isn't valid. Try AURELLE10.");
        }
      }}
    >
      <label htmlFor="promo" className="sr-only">
        Promo code
      </label>
      <div className="flex gap-2">
        <input
          id="promo"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError(null);
          }}
          placeholder="Promo code"
          autoCapitalize="characters"
          aria-invalid={!!error}
          aria-describedby={error ? "promo-error" : undefined}
          className="h-11 min-w-0 flex-1 rounded-xl border border-input bg-background px-3.5 text-sm uppercase placeholder:normal-case placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring"
        />
        <button type="submit" className="h-11 rounded-xl border border-input px-4 text-sm font-semibold hover:bg-muted">
          Apply
        </button>
      </div>
      {error && (
        <p id="promo-error" role="alert" className="mt-1.5 text-sm text-destructive">
          {error}
        </p>
      )}
    </form>
  );
}

export function TotalsTable({ totals, method = "standard" }: { totals: CartTotals; method?: ShippingMethod }) {
  const savings = totals.listTotal - totals.subtotal;
  return (
    <dl className="grid gap-2.5 text-sm">
      <div className="flex justify-between gap-4">
        <dt className="text-muted-foreground">Subtotal</dt>
        <dd className="tabular-nums">{money2(totals.listTotal)}</dd>
      </div>
      {savings > 0.005 && (
        <div className="flex justify-between gap-4 text-success">
          <dt>Sale &amp; subscription savings</dt>
          <dd className="tabular-nums">−{money2(savings)}</dd>
        </div>
      )}
      {totals.promoDiscount > 0 && (
        <div className="flex justify-between gap-4 text-success">
          <dt>Promo code</dt>
          <dd className="tabular-nums">−{money2(totals.promoDiscount)}</dd>
        </div>
      )}
      <div className="flex justify-between gap-4">
        <dt className="text-muted-foreground">Shipping ({SHIPPING[method].label.toLowerCase()})</dt>
        <dd className="tabular-nums">{totals.shipping === 0 ? "Free" : money2(totals.shipping)}</dd>
      </div>
      <div className="flex items-baseline justify-between gap-4 border-t border-border pt-4">
        <dt className="font-semibold">Total</dt>
        <dd className="text-2xl font-semibold tabular-nums">{money2(totals.total)}</dd>
      </div>
    </dl>
  );
}

/** Compact, read-only list of what's being bought. */
export function SummaryLines({ totals }: { totals: CartTotals }) {
  return (
    <ul className="grid gap-4">
      {totals.lines.map((l) => (
        <li key={l.key} className="flex gap-3">
          <span className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
            <ProductImage slug={l.slug} view={1} />
            <span className="absolute -right-0 -top-0 grid min-w-5 place-items-center rounded-bl-lg bg-foreground px-1 text-[11px] font-semibold tabular-nums text-background">
              {l.qty}
            </span>
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{l.product.name}</p>
            <p className="text-xs text-muted-foreground">
              {l.size.label}
              {l.interval ? ` · every ${l.interval} days` : ""}
            </p>
          </div>
          <p className="text-sm font-medium tabular-nums">{money2(l.total)}</p>
        </li>
      ))}
    </ul>
  );
}
