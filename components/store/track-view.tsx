"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useSyncExternalStore } from "react";
import { CheckCircle2, ClipboardCheck, CreditCard, MapPin, Navigation, Package, PackageSearch, Truck } from "lucide-react";
import Button from "@/components/custom/blocks/Button";
import { InputBlock } from "@/components/custom/blocks/InputBlock";
import { TimelineBlock, type TimelineItemType } from "@/components/custom/blocks/TimelineBlock";
import { DEMO_ORDER_ID, SHIPPING, TRACK_STAGES, money, trackingProgress, type Order } from "@/lib/store/pricing";
import { ensureDemoOrder, findOrder, useHydrated, useShopState } from "@/lib/store/store";

const ICONS = [ClipboardCheck, CreditCard, Package, Truck, Navigation, CheckCircle2];

// One shared clock, ticking once a second while something is subscribed.
const clockListeners = new Set<() => void>();
let clockTimer: ReturnType<typeof setInterval> | null = null;
function subscribeClock(cb: () => void) {
  clockListeners.add(cb);
  if (!clockTimer) clockTimer = setInterval(() => clockListeners.forEach((l) => l()), 1000);
  return () => {
    clockListeners.delete(cb);
    if (clockListeners.size === 0 && clockTimer) {
      clearInterval(clockTimer);
      clockTimer = null;
    }
  };
}
const readClock = () => Math.floor(Date.now() / 1000) * 1000;
const useNow = () => useSyncExternalStore(subscribeClock, readClock, () => 0);

const fmtTime = (t: number) => new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", second: "2-digit" }).format(t);
const fmtDay = (t: number) => new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(t);

function OrderStatus({ order, justPlaced }: { order: Order; justPlaced: boolean }) {
  const now = useNow();
  const { current, done } = trackingProgress(order, now || order.placedAt);
  const stage = TRACK_STAGES[current];

  // Rebuilt only when the stage changes, so the timeline's entrance animation doesn't replay every second.
  const items: TimelineItemType[] = useMemo(
    () =>
      TRACK_STAGES.map((s, i) => ({
        id: s.key,
        title: s.title,
        date: i <= current ? fmtTime(order.placedAt + s.at * 1000) : "Pending",
        description: s.note,
        icon: ICONS[i],
        status: i < current || (i === current && done) ? "completed" : i === current ? "current" : "upcoming",
      })),
    [current, done, order.placedAt],
  );

  const eta = order.placedAt + SHIPPING[order.shippingMethod].days * 86_400_000;
  const pct = Math.round(((current + (done ? 1 : 0.5)) / TRACK_STAGES.length) * 100);

  return (
    <div className="space-y-8">
      {justPlaced && (
        <div role="status" className="flex items-start gap-3 rounded-3xl border border-primary/30 bg-primary/5 p-5">
          <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-primary" />
          <div>
            <p className="font-heading text-3xl">Thank you, {order.customer.name.split(" ")[0]}!</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Order <strong className="text-foreground">{order.id}</strong> is confirmed. We&rsquo;ve emailed a receipt to {order.customer.email}. Keep this order number to track it later.
            </p>
          </div>
        </div>
      )}

      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Order {order.id}</p>
            <h2 className="font-heading mt-2 text-4xl sm:text-5xl">{stage.title}</h2>
            <p className="mt-1 text-muted-foreground">{stage.note}</p>
          </div>
          <div className="rounded-2xl bg-muted px-4 py-3 text-sm">
            <p className="text-xs text-muted-foreground">{done ? "Delivered" : "Estimated delivery"}</p>
            <p className="font-semibold">{done ? fmtTime(order.placedAt + TRACK_STAGES[5].at * 1000) : fmtDay(eta)}</p>
          </div>
        </div>
        <div className="mt-6" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Order progress">
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-[width] duration-700" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>Placed {fmtTime(order.placedAt)}</span>
            <span>{pct}%</span>
          </p>
        </div>
        {!done && <p className="mt-4 text-xs text-muted-foreground">Demo mode: tracking advances every few seconds so you can see every stage. Real orders move at carrier speed.</p>}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
          <h3 className="font-heading text-3xl">Tracking history</h3>
          <TimelineBlock items={items} color="primary" variant="default" layout="left" className="mt-4" />
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-card p-6">
            <h3 className="font-heading text-3xl">Items</h3>
            <ul className="mt-4 divide-y divide-border">
              {order.items.map((i) => (
                <li key={`${i.productId}${i.color}${i.size}`} className="flex gap-3 py-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={i.image} alt="" className="h-20 w-16 shrink-0 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <Link href={`/product/${i.slug}`} className="block truncate text-sm font-medium underline-offset-4 hover:underline">
                      {i.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {i.color} · {i.size} · Qty {i.qty}
                    </p>
                  </div>
                  <p className="text-sm font-semibold tabular-nums">{money(i.unit * i.qty)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-3 space-y-1.5 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="tabular-nums">{money(order.totals.subtotal)}</dd>
              </div>
              {order.totals.discount > 0 && (
                <div className="flex justify-between text-primary">
                  <dt>Discount {order.totals.couponCode && `(${order.totals.couponCode})`}</dt>
                  <dd className="tabular-nums">−{money(order.totals.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping ({SHIPPING[order.shippingMethod].label})</dt>
                <dd className="tabular-nums">{order.totals.shipping === 0 ? "Free" : money(order.totals.shipping)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Tax</dt>
                <dd className="tabular-nums">{money(order.totals.tax)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
                <dt>Total</dt>
                <dd className="tabular-nums">{money(order.totals.total)}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 text-sm">
            <h3 className="font-heading text-3xl">Delivery &amp; payment</h3>
            <p className="mt-4 flex gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>
                {order.customer.name}
                <br />
                {order.address.line1}
                {order.address.line2 && `, ${order.address.line2}`}
                <br />
                {order.address.city}, {order.address.region} {order.address.postal}
                <br />
                {order.address.country}
              </span>
            </p>
            <p className="mt-3 flex gap-2.5">
              <CreditCard className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>{order.payment.method === "card" ? `Card ending ${order.payment.last4}` : "Cash on delivery"}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TrackView() {
  const router = useRouter();
  const params = useSearchParams();
  const hydrated = useHydrated();
  const { orders } = useShopState();

  const id = params.get("id") ?? "";
  const justPlaced = params.get("placed") === "1";

  const [idInput, setIdInput] = useState(id);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const order = hydrated && id ? findOrder(id) : undefined;
  const notFound = hydrated && !!id && !order;

  const lookup = (e: React.FormEvent) => {
    e.preventDefault();
    const found = findOrder(idInput);
    if (!idInput.trim()) return setError("Enter your order number, e.g. AVR-123456");
    if (!found) return setError("We couldn't find that order on this device. Check the number, or try the demo order.");
    if (email.trim() && found.customer.email.toLowerCase() !== email.trim().toLowerCase()) return setError("That email doesn't match this order.");
    setError(null);
    router.push(`/track?id=${found.id}`);
  };

  const openDemo = () => {
    ensureDemoOrder();
    setIdInput(DEMO_ORDER_ID);
    setError(null);
    router.push(`/track?id=${DEMO_ORDER_ID}`);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-24 pt-6 sm:px-6">
      <header className="border-b border-border pb-8 pt-4">
        <h1 className="font-heading text-5xl sm:text-7xl">Track your order</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">Enter the order number from your confirmation to see where your parcel is right now.</p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[22rem_1fr]">
        <div className="space-y-6">
          <form onSubmit={lookup} className="space-y-4 rounded-3xl border border-border bg-card p-6" noValidate>
            <InputBlock label="Order number" placeholder="AVR-123456" autoComplete="off" value={idInput} onChange={(e) => setIdInput(e.target.value.toUpperCase())} leftIcon={<PackageSearch className="size-4" />} />
            <InputBlock label="Email (optional)" type="email" placeholder="you@email.com" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <Button type="submit" variant="default" className="h-11 w-full rounded-full text-sm font-semibold">
              Track order
            </Button>
            <button type="button" onClick={openDemo} className="h-11 w-full rounded-full border border-border text-sm font-medium transition hover:bg-muted">
              Try the demo order
            </button>
          </form>

          {hydrated && orders.length > 0 && (
            <div className="rounded-3xl border border-border bg-card p-6">
              <h2 className="font-heading text-3xl">Your orders</h2>
              <ul className="mt-3 space-y-1">
                {orders.map((o) => (
                  <li key={o.id}>
                    <Link href={`/track?id=${o.id}`} className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition hover:bg-muted ${o.id === id ? "bg-muted font-semibold" : ""}`}>
                      <span>{o.id}</span>
                      <span className="tabular-nums text-muted-foreground">{money(o.totals.total)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div>
          {order ? (
            <OrderStatus key={order.id} order={order} justPlaced={justPlaced} />
          ) : (
            <div className="flex min-h-[24rem] flex-col items-center justify-center rounded-3xl border border-dashed border-border p-10 text-center">
              <span className="grid size-16 place-items-center rounded-full bg-muted">
                <PackageSearch className="size-7 text-muted-foreground" />
              </span>
              <p className="font-heading mt-5 text-4xl">{notFound ? "Order not found" : "Where's my order?"}</p>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                {notFound ? `We couldn't find ${id} on this device. Orders you place here are saved in your browser.` : "Look up an order on the left, or open the demo order to watch a parcel move through every stage."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
