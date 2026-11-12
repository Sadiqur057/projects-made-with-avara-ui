"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, Truck } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerOverlay, DrawerTitle } from "@/components/custom/blocks/Drawer";
import { FREE_SHIPPING_OVER, money, type ResolvedLine } from "@/lib/store/pricing";
import { setQty, useCart, useUi } from "@/lib/store/store";
import { CouponBox } from "./coupon-box";
import { useShop } from "./use-shop";

export function QtyStepper({ line, size = "md" }: { line: ResolvedLine; size?: "sm" | "md" }) {
  const dim = size === "sm" ? "size-7" : "size-8";
  return (
    <div className="inline-flex items-center rounded-full border border-border bg-background">
      <button type="button" aria-label={`Decrease quantity of ${line.product.name}`} onClick={() => setQty(line.key, line.qty - 1)} className={`${dim} grid place-items-center rounded-full text-muted-foreground transition hover:text-foreground`}>
        <Minus className="size-3.5" />
      </button>
      <span className="w-6 text-center text-sm font-medium tabular-nums" aria-live="polite">
        {line.qty}
      </span>
      <button type="button" aria-label={`Increase quantity of ${line.product.name}`} disabled={line.qty >= 10} onClick={() => setQty(line.key, line.qty + 1)} className={`${dim} grid place-items-center rounded-full text-muted-foreground transition hover:text-foreground disabled:opacity-40`}>
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}

export function CartDrawer() {
  const { cartOpen, setCartOpen } = useUi();
  const { lines, totals } = useCart();
  const { remove } = useShop();
  const remaining = Math.max(0, FREE_SHIPPING_OVER - (totals.subtotal - totals.discount));
  const progress = Math.min(100, ((totals.subtotal - totals.discount) / FREE_SHIPPING_OVER) * 100);

  return (
    <Drawer open={cartOpen} onOpenChange={setCartOpen} side="right">
      <DrawerOverlay />
      <DrawerContent className="w-[440px] max-w-[92vw] rounded-none sm:rounded-l-2xl">
        <DrawerHeader className="pr-16">
          <DrawerTitle className="font-heading text-2xl">
            Your bag <span className="text-muted-foreground">({totals.itemCount})</span>
          </DrawerTitle>
        </DrawerHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-muted">
              <ShoppingBag className="size-7 text-muted-foreground" />
            </span>
            <div>
              <p className="font-heading text-2xl">Your bag is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">Add a few pieces and they&rsquo;ll appear here.</p>
            </div>
            <Link href="/shop" onClick={() => setCartOpen(false)} className="inline-flex h-10 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
              Start shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="border-b border-border px-6 py-3">
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <Truck className="size-4 text-primary" />
                {remaining > 0 ? (
                  <span>
                    You&rsquo;re <strong className="text-foreground">{money(remaining)}</strong> away from free standard shipping
                  </span>
                ) : (
                  <span className="font-medium text-foreground">You&rsquo;ve unlocked free standard shipping</span>
                )}
              </p>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label="Progress towards free shipping">
                <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <ul className="flex-1 divide-y divide-border overflow-y-auto px-6">
              {lines.map((l) => (
                <li key={l.key} className="flex gap-4 py-4">
                  <Link href={`/product/${l.product.slug}`} onClick={() => setCartOpen(false)} className="h-28 w-[5.25rem] shrink-0 overflow-hidden rounded-lg" style={{ backgroundColor: l.product.tone }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={l.image} alt={l.product.name} className="h-full w-full object-cover" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link href={`/product/${l.product.slug}`} onClick={() => setCartOpen(false)} className="block truncate text-sm font-medium hover:underline underline-offset-4">
                          {l.product.name}
                        </Link>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {l.color} · {l.size}
                        </p>
                      </div>
                      <p className="text-sm font-semibold tabular-nums">{money(l.total)}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <QtyStepper line={l} size="sm" />
                      <button type="button" onClick={() => remove(l.key)} aria-label={`Remove ${l.product.name}`} className="grid size-8 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-destructive">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="space-y-4 border-t border-border bg-muted/40 px-6 py-5">
              <CouponBox />
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="tabular-nums">{money(totals.subtotal)}</dd>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-primary">
                    <dt>Discount ({totals.couponApplied?.code})</dt>
                    <dd className="tabular-nums">−{money(totals.discount)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd className="tabular-nums">{totals.shipping === 0 ? "Free" : money(totals.shipping)}</dd>
                </div>
                <div className="flex justify-between pt-1 text-base font-semibold">
                  <dt>Estimated total</dt>
                  <dd className="tabular-nums">{money(totals.total)}</dd>
                </div>
              </dl>
              <Link href="/checkout" onClick={() => setCartOpen(false)} className="flex h-12 w-full items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 active:scale-[0.99]">
                Checkout · {money(totals.total)}
              </Link>
            </div>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
