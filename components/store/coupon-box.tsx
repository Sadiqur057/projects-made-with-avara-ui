"use client";

import { useState } from "react";
import { Check, Tag, X } from "lucide-react";
import Button from "@/components/custom/blocks/Button";
import { coupons } from "@/lib/store/products";
import { useCart } from "@/lib/store/store";
import { useShop } from "./use-shop";

export function CouponBox() {
  const { totals, coupon } = useCart();
  const { redeem, dropCoupon } = useShop();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (value: string) => {
    const res = redeem(value);
    if (res.ok) {
      setCode("");
      setError(null);
    } else {
      setError(res.reason);
    }
  };

  if (coupon && totals.couponApplied) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 px-3.5 py-2.5">
        <div className="flex min-w-0 items-center gap-2.5 text-sm">
          <Check className="size-4 shrink-0 text-primary" />
          <div className="min-w-0">
            <p className="font-semibold tracking-wide">{totals.couponApplied.code}</p>
            <p className="truncate text-xs text-muted-foreground">{totals.couponApplied.description}</p>
          </div>
        </div>
        <button type="button" onClick={dropCoupon} aria-label="Remove coupon" className="grid size-7 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground">
          <X className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(code);
        }}
        className="flex gap-2"
      >
        <label className="relative flex-1">
          <span className="sr-only">Coupon code</span>
          <Tag className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError(null);
            }}
            placeholder="Coupon code"
            autoComplete="off"
            aria-invalid={!!error}
            className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm uppercase tracking-wide outline-none placeholder:normal-case placeholder:tracking-normal focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 aria-[invalid=true]:border-destructive"
          />
        </label>
        <Button type="submit" variant="default" className="h-10 rounded-lg px-4 text-sm">
          Apply
        </Button>
      </form>
      {(error || totals.couponNote) && (
        <p role="alert" className="mt-1.5 text-xs text-destructive">
          {error ?? totals.couponNote}
        </p>
      )}
      <div className="mt-2 flex flex-wrap gap-1.5">
        {coupons.map((c) => (
          <button
            key={c.code}
            type="button"
            onClick={() => submit(c.code)}
            title={c.description}
            className="rounded-full border border-dashed border-border px-2.5 py-1 text-[11px] font-medium tracking-wide text-muted-foreground transition hover:border-primary hover:text-primary"
          >
            {c.code}
          </button>
        ))}
      </div>
    </div>
  );
}
