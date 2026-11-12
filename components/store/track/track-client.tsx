"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Box, CheckCircle2, PackageCheck, PartyPopper, Search, Truck, ClipboardCheck, RefreshCw } from "lucide-react";
import { Stepper, type Step } from "@/components/custom/blocks/StepperBlock";
import { useClock } from "@/lib/clock";
import {
  DEMO_ORDER_EMAIL,
  DEMO_ORDER_ID,
  demoOrder,
  trackingFor,
  type Order,
} from "@/lib/orders";
import { SHIPPING, money2 } from "@/lib/pricing";
import { useHydrated, useStore } from "@/lib/store";
import { ProductImage } from "@/components/store/product-image";
import { cn } from "@/lib/utils";

const STAGE_ICONS = [ClipboardCheck, Box, PackageCheck, Truck, CheckCircle2];

const timeFmt = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });
const dayFmt = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" });
const dateTimeFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

const HEADLINE = [
  "We've got your order",
  "Your order is being packed",
  "Your order is on its way",
  "Out for delivery today",
  "Delivered",
];

function TrackingView({ order, placed }: { order: Order; placed: boolean }) {
  const now = useClock();
  if (now === null) {
    return <div className="h-96 animate-pulse rounded-3xl bg-muted motion-reduce:animate-none" aria-busy="true" aria-label="Loading tracking" />;
  }

  const t = trackingFor(order, now);
  const steps: Step[] = t.stages.map((s, i) => ({
    id: s.id,
    title: s.title.replace("Handed to the carrier", "Shipped").replace("Packed at the studio", "Packed").replace("Order confirmed", "Confirmed"),
    description: s.reached ? timeFmt.format(s.at) : "Pending",
    icon: STAGE_ICONS[i],
  }));
  const subscription = order.items.filter((i) => i.interval);

  return (
    <div className="grid gap-8">
      {placed && (
        <div role="status" className="flex items-start gap-3 rounded-2xl bg-accent px-5 py-4 text-accent-foreground">
          <PartyPopper className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">Thank you, {order.name.split(" ")[0]}! Your order is confirmed.</p>
            <p className="text-sm opacity-90">
              Keep your order number handy: <strong>{order.id}</strong>. This is a demo store, so no payment was taken and no email is sent.
            </p>
          </div>
        </div>
      )}

      <section className="rounded-3xl bg-secondary p-6 sm:p-10" aria-labelledby="status-title">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Order {order.id}</p>
        <h1 id="status-title" className="mt-2 font-display text-4xl font-medium tracking-tight sm:text-5xl">
          {HEADLINE[t.current]}
        </h1>
        <p className="mt-3 text-foreground/80">
          {t.delivered ? (
            <>Delivered to {order.address.city}. We hope you love it.</>
          ) : (
            <>
              Estimated delivery <strong>{dayFmt.format(t.eta)}</strong> · {SHIPPING[order.method].label.toLowerCase()} shipping
            </>
          )}
        </p>
        {t.nextInMinutes !== null && (
          <p className="mt-1 text-sm text-muted-foreground" aria-live="polite">
            Demo timetable: next update in about {t.nextInMinutes} min.
          </p>
        )}

        <div className="mt-10 px-1 sm:px-4">
          <Stepper steps={steps} currentStep={t.current} aria-label={`Delivery progress: ${steps[t.current].title}`} />
        </div>
      </section>

      <div className="grid items-start gap-8 lg:grid-cols-[1fr_22rem]">
        <section aria-labelledby="activity-title" className="rounded-3xl border border-border bg-card p-5 sm:p-8">
          <h2 id="activity-title" className="font-display text-2xl font-medium">
            Activity
          </h2>
          <ol className="mt-5 grid gap-0">
            {[...t.stages]
              .map((s, i) => ({ s, i }))
              .reverse()
              .map(({ s, i }) => (
                <li key={s.id} className={cn("relative flex gap-4 pb-6 last:pb-0", !s.reached && "opacity-45")}>
                  <span className="relative flex flex-col items-center">
                    <span
                      className={cn(
                        "grid size-8 shrink-0 place-items-center rounded-full border-2",
                        s.reached ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card",
                      )}
                    >
                      {(() => {
                        const Icon = STAGE_ICONS[i];
                        return <Icon className="size-4" aria-hidden="true" />;
                      })()}
                    </span>
                    {i > 0 && <span className="absolute top-8 h-[calc(100%-1rem)] w-px bg-border" aria-hidden="true" />}
                  </span>
                  <div className="pt-0.5">
                    <p className="font-semibold">{s.title}</p>
                    <p className="text-sm text-muted-foreground">{s.description}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {s.reached ? dateTimeFmt.format(s.at) : "Not yet"}
                    </p>
                  </div>
                </li>
              ))}
          </ol>
        </section>

        <aside className="grid gap-4" aria-label="Order details">
          <section className="rounded-3xl border border-border bg-card p-5 sm:p-6">
            <h2 className="font-display text-xl font-medium">Items</h2>
            <ul className="mt-4 grid gap-4">
              {order.items.map((i) => (
                <li key={`${i.slug}-${i.sizeLabel}-${i.interval}`} className="flex gap-3">
                  <span className="size-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                    <ProductImage slug={i.slug} view={1} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{i.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {i.sizeLabel} · Qty {i.qty}
                      {i.interval ? ` · every ${i.interval} days` : ""}
                    </p>
                  </div>
                  <p className="text-sm tabular-nums">{money2(i.unitPrice * i.qty)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-5 grid gap-1.5 border-t border-border pt-4 text-sm">
              {order.promoDiscount > 0 && (
                <div className="flex justify-between text-success">
                  <dt>Promo {order.promoCode}</dt>
                  <dd className="tabular-nums">−{money2(order.promoDiscount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd className="tabular-nums">{order.shipping === 0 ? "Free" : money2(order.shipping)}</dd>
              </div>
              <div className="flex justify-between text-base font-semibold">
                <dt>Total</dt>
                <dd className="tabular-nums">{money2(order.total)}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-3xl border border-border bg-card p-5 text-sm sm:p-6">
            <h2 className="font-display text-xl font-medium">Shipping to</h2>
            <address className="mt-3 not-italic leading-relaxed text-muted-foreground">
              {order.name}
              <br />
              {order.address.line1}
              {order.address.line2 && <><br />{order.address.line2}</>}
              <br />
              {order.address.city}, {order.address.region} {order.address.postal}
              <br />
              {order.address.country}
            </address>
          </section>

          {subscription.length > 0 && (
            <section className="rounded-3xl bg-accent p-5 text-sm text-accent-foreground sm:p-6">
              <h2 className="flex items-center gap-2 font-semibold">
                <RefreshCw className="size-4" aria-hidden="true" />
                Subscribe &amp; save
              </h2>
              <ul className="mt-2 grid gap-1">
                {subscription.map((i) => {
                  const next = new Date(order.createdAt);
                  next.setDate(next.getDate() + (i.interval ?? 0));
                  return (
                    <li key={i.slug}>
                      {i.name}: next shipment around {dayFmt.format(next)}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}

function LookupForm({
  defaultId,
  onFound,
  orders,
}: {
  defaultId: string;
  onFound: (o: Order) => void;
  orders: Order[];
}) {
  const [id, setId] = useState(defaultId);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const find = (e: React.FormEvent) => {
    e.preventDefault();
    const nid = id.trim().toUpperCase();
    const nmail = email.trim().toLowerCase();
    if (!nid || !nmail) {
      setError("Enter both your order number and the email used at checkout.");
      return;
    }
    const stored = orders.find((o) => o.id === nid && o.email === nmail);
    if (stored) return onFound(stored);
    if (nid === DEMO_ORDER_ID && nmail === DEMO_ORDER_EMAIL) return onFound(demoOrder(Date.now()));
    setError("We couldn't find an order with that number and email. Check them and try again.");
  };

  return (
    <form onSubmit={find} noValidate className="grid gap-5 rounded-3xl border border-border bg-card p-6 sm:p-8">
      <div className="grid gap-1.5">
        <label htmlFor="t-id" className="text-sm font-medium">
          Order number
        </label>
        <input
          id="t-id"
          value={id}
          onChange={(e) => {
            setId(e.target.value);
            setError(null);
          }}
          placeholder="AUR-XXXXXX"
          autoCapitalize="characters"
          aria-invalid={!!error}
          aria-describedby={error ? "t-err" : undefined}
          className="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm uppercase placeholder:normal-case placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring"
        />
      </div>
      <div className="grid gap-1.5">
        <label htmlFor="t-email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="t-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(null);
          }}
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={!!error}
          aria-describedby={error ? "t-err" : undefined}
          className="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring"
        />
      </div>
      {error && (
        <p id="t-err" role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-7 text-sm font-semibold text-primary-foreground hover:opacity-90">
          <Search className="size-4" aria-hidden="true" />
          Track order
        </button>
        <button
          type="button"
          onClick={() => {
            setId(DEMO_ORDER_ID);
            setEmail(DEMO_ORDER_EMAIL);
            setError(null);
          }}
          className="h-12 rounded-xl px-4 text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          Fill in the demo order
        </button>
      </div>
    </form>
  );
}

export function TrackClient() {
  const params = useSearchParams();
  const { orders } = useStore();
  const hydrated = useHydrated();
  const [picked, setPicked] = useState<Order | null>(null);

  const paramId = (params.get("order") ?? "").toUpperCase();
  const placed = params.get("placed") === "1";
  const fromParam = hydrated ? orders.find((o) => o.id === paramId) : undefined;
  const active = picked ?? fromParam ?? null;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      {!hydrated ? (
        <div className="h-96 animate-pulse rounded-3xl bg-muted motion-reduce:animate-none" aria-busy="true" aria-label="Loading" />
      ) : active ? (
        <>
          <TrackingView order={active} placed={placed && active.id === paramId} />
          <button
            type="button"
            onClick={() => setPicked(null)}
            className={cn("mt-8 text-sm font-semibold text-primary underline-offset-4 hover:underline", !picked && "hidden")}
          >
            ← Track a different order
          </button>
        </>
      ) : (
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Order tracking</p>
            <h1 className="mt-2 font-display text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl">Where&apos;s my order?</h1>
            <p className="mt-3 max-w-md text-muted-foreground">
              Enter your order number and the email you used at checkout. You&apos;ll find the number on your confirmation.
            </p>
            {paramId && (
              <p role="status" className="mt-4 rounded-xl bg-muted px-4 py-3 text-sm">
                We couldn&apos;t find <strong>{paramId}</strong> on this device. Enter your email below to look it up.
              </p>
            )}

            {orders.length > 0 && (
              <section className="mt-8" aria-labelledby="recent-title">
                <h2 id="recent-title" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Recent orders on this device
                </h2>
                <ul className="mt-3 grid gap-2">
                  {orders.map((o) => (
                    <li key={o.id}>
                      <button
                        type="button"
                        onClick={() => setPicked(o)}
                        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-left hover:bg-muted"
                      >
                        <span>
                          <span className="block font-semibold">{o.id}</span>
                          <span className="text-xs text-muted-foreground">
                            {dateTimeFmt.format(o.createdAt)} · {o.items.reduce((n, i) => n + i.qty, 0)} items
                          </span>
                        </span>
                        <span className="font-semibold tabular-nums">{money2(o.total)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <div>
            <LookupForm defaultId={paramId} onFound={setPicked} orders={orders} />
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Haven&apos;t ordered yet?{" "}
              <Link href="/shop" className="font-semibold text-primary underline-offset-4 hover:underline">
                Start shopping
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
