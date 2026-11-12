"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CalendarDays, Check, CircleDot, Mail, Phone, Search, Ticket, Trash2, Users, XCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { TRACKING_STAGES, getStatus, parseDate, useBookings, useHydrated, useNow, type Booking } from "@/lib/store";
import { fmtDate, fmtTimestamp, money } from "@/lib/format";
import { cn } from "@/lib/utils";

const DAY = 86_400_000;

function Tracker({ booking, now }: { booking: Booking; now: number }) {
  const status = getStatus(booking, now);
  if (status.cancelled) {
    return (
      <div className="flex items-start gap-3 rounded-xl bg-destructive/10 p-4 text-sm text-destructive" role="status">
        <XCircle className="mt-0.5 size-5 shrink-0" />
        <div>
          <p className="font-semibold">Booking cancelled</p>
          <p className="opacity-80">Cancelled on {fmtTimestamp(booking.cancelledAt!)}. Any refund is processed within 5 working days.</p>
        </div>
      </div>
    );
  }
  const pct = (status.index / (TRACKING_STAGES.length - 1)) * 100;
  return (
    <div>
      <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct)} aria-label="Booking progress">
        <div className="h-full rounded-full bg-primary transition-[width] duration-700" style={{ width: `${Math.max(pct, 4)}%` }} />
      </div>
      <ol className="grid gap-0">
        {TRACKING_STAGES.map((s, i) => {
          const done = i < status.index;
          const current = i === status.index;
          const at = status.at[i];
          return (
            <li key={s.id} className="relative flex gap-4 pb-5 last:pb-0" aria-current={current ? "step" : undefined}>
              {i < TRACKING_STAGES.length - 1 && (
                <span aria-hidden className={cn("absolute left-[13px] top-7 h-[calc(100%-1.75rem)] w-0.5", done ? "bg-primary" : "bg-border")} />
              )}
              <span
                className={cn(
                  "relative z-10 mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border-2",
                  done && "border-primary bg-primary text-primary-foreground",
                  current && "border-primary bg-background text-primary",
                  !done && !current && "border-border bg-background text-muted-foreground",
                )}
              >
                {done ? <Check className="size-4" /> : <CircleDot className={cn("size-4", current && "animate-pulse")} />}
              </span>
              <div className={cn(!done && !current && "opacity-50")}>
                <p className="text-sm font-semibold">
                  {s.label}
                  {current && <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">Now</span>}
                </p>
                <p className="text-sm text-muted-foreground">{s.detail}</p>
                {at !== null && <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">{fmtTimestamp(at)}</p>}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function BookingCard({ booking, now, highlighted, onCancel, onRemove }: { booking: Booking; now: number; highlighted: boolean; onCancel: () => void; onRemove: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const [confirming, setConfirming] = useState(false);
  const status = getStatus(booking, now);
  const start = parseDate(booking.departure);
  const daysAway = Math.ceil((start - now) / DAY);
  const canCancel = !status.cancelled && now < start;

  useEffect(() => {
    if (highlighted) ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [highlighted]);

  const stageLabel = status.cancelled ? "Cancelled" : TRACKING_STAGES[status.index].label;

  return (
    <article
      ref={ref}
      id={booking.ref}
      className={cn("scroll-mt-28 overflow-hidden rounded-3xl border bg-card transition-shadow", highlighted ? "border-primary shadow-lg ring-3 ring-primary/20" : "border-border")}
    >
      <div className="grid md:grid-cols-[18rem_1fr]">
        <div className="relative min-h-52">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={booking.image} alt={booking.destinationName} loading="lazy" className={cn("absolute inset-0 size-full object-cover", status.cancelled && "grayscale")} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <p className="font-mono text-xs opacity-80">{booking.ref}</p>
            <p className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>{booking.destinationName}</p>
          </div>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-2">
          <div className="grid content-start gap-4">
            <div>
              <h2 className="text-xl font-semibold">{booking.packageTitle}</h2>
              <p className="mt-1 inline-flex items-center gap-2 text-sm">
                <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", status.cancelled ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary")}>{stageLabel}</span>
                {!status.cancelled && daysAway > 0 && <span className="text-muted-foreground">Departs in {daysAway} {daysAway === 1 ? "day" : "days"}</span>}
              </p>
            </div>
            <dl className="grid gap-2.5 text-sm">
              <div className="flex items-center gap-3"><CalendarDays className="size-4 text-muted-foreground" /><dt className="sr-only">Dates</dt><dd>{fmtDate(booking.departure, true)} · {booking.days} days</dd></div>
              <div className="flex items-center gap-3"><Users className="size-4 text-muted-foreground" /><dt className="sr-only">Travellers</dt><dd>{booking.adults} {booking.adults === 1 ? "adult" : "adults"}{booking.children > 0 ? `, ${booking.children} ${booking.children === 1 ? "child" : "children"}` : ""}</dd></div>
              <div className="flex items-center gap-3"><Mail className="size-4 text-muted-foreground" /><dt className="sr-only">Email</dt><dd>{booking.contact.email}</dd></div>
              <div className="flex items-center gap-3"><Phone className="size-4 text-muted-foreground" /><dt className="sr-only">Phone</dt><dd>{booking.contact.phone}</dd></div>
              <div className="flex items-center gap-3"><Ticket className="size-4 text-muted-foreground" /><dt className="sr-only">Total</dt><dd>{money(booking.total)} total · {money(booking.deposit)} paid</dd></div>
            </dl>
            <div className="flex flex-wrap gap-2 pt-1">
              <Link href={`/packages/${booking.packageSlug}`} className={cn(buttonVariants({ variant: "outline" }), "h-9 rounded-full px-4")}>View itinerary</Link>
              {canCancel && !confirming && (
                <button type="button" onClick={() => setConfirming(true)} className={cn(buttonVariants({ variant: "ghost" }), "h-9 rounded-full px-4 text-destructive hover:text-destructive")}>Cancel booking</button>
              )}
              {status.cancelled && (
                <button type="button" onClick={onRemove} className={cn(buttonVariants({ variant: "ghost" }), "h-9 rounded-full px-4")}><Trash2 className="size-4" /> Remove</button>
              )}
            </div>
            {confirming && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm" role="alertdialog" aria-label="Confirm cancellation">
                <p className="font-medium">Cancel {booking.ref}?</p>
                <p className="mt-1 text-muted-foreground">This cannot be undone. Refund terms follow our cancellation policy.</p>
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={() => { onCancel(); setConfirming(false); }} className={cn(buttonVariants({ variant: "destructive" }), "h-9 rounded-full px-4")}>Yes, cancel trip</button>
                  <button type="button" onClick={() => setConfirming(false)} className={cn(buttonVariants({ variant: "outline" }), "h-9 rounded-full px-4")}>Keep booking</button>
                </div>
              </div>
            )}
          </div>
          <div>
            <h3 className="mb-4 font-sans text-sm font-semibold uppercase tracking-wider text-muted-foreground">Booking tracker</h3>
            <Tracker booking={booking} now={now} />
          </div>
        </div>
      </div>
    </article>
  );
}

export function TripsView() {
  const params = useSearchParams();
  const { bookings, cancel, remove } = useBookings();
  const hydrated = useHydrated();
  const now = useNow(1000);
  const [highlight, setHighlight] = useState<string | null>(params.get("ref"));
  const [lookupRef, setLookupRef] = useState(params.get("ref") ?? "");
  const [lookupEmail, setLookupEmail] = useState("");
  const [lookupError, setLookupError] = useState("");

  const lookup = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = lookupRef.trim().toUpperCase();
    const email = lookupEmail.trim().toLowerCase();
    const found = bookings.find((b) => b.ref === ref && b.contact.email.toLowerCase() === email);
    if (found) {
      setLookupError("");
      setHighlight(found.ref);
    } else {
      setHighlight(null);
      setLookupError("We could not find a booking with that reference and email. Check the confirmation email, or note that this demo only searches bookings made on this device.");
    }
  };

  const input = "h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40";

  return (
    <div className="grid gap-12">
      <section id="track" aria-labelledby="track-title" className="scroll-mt-28 rounded-3xl border border-border bg-card p-6 sm:p-8">
        <h2 id="track-title" className="text-2xl font-semibold">Track a booking</h2>
        <p className="mt-1 text-sm text-muted-foreground">Enter the reference from your confirmation email (starts with WF-) and the email you booked with.</p>
        <form onSubmit={lookup} className="mt-5 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <label className="grid gap-1.5 text-sm font-medium">
            Booking reference
            <input value={lookupRef} onChange={(e) => setLookupRef(e.target.value)} placeholder="WF-AB12CD" className={cn(input, "font-mono uppercase")} required />
          </label>
          <label className="grid gap-1.5 text-sm font-medium">
            Email
            <input type="email" value={lookupEmail} onChange={(e) => setLookupEmail(e.target.value)} placeholder="you@example.com" className={input} required />
          </label>
          <button type="submit" className={cn(buttonVariants({ size: "lg" }), "h-11 self-end rounded-lg px-6")}><Search className="size-4" /> Find</button>
        </form>
        {lookupError && <p role="alert" className="mt-3 text-sm text-destructive">{lookupError}</p>}
      </section>

      <section aria-labelledby="trips-title">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 id="trips-title" className="text-2xl font-semibold">Your bookings</h2>
          {hydrated && bookings.length > 0 && <span className="text-sm text-muted-foreground">{bookings.length} {bookings.length === 1 ? "booking" : "bookings"}</span>}
        </div>
        {!hydrated || now === null ? (
          <div className="h-64 animate-pulse rounded-3xl bg-muted" aria-label="Loading bookings" />
        ) : bookings.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border px-6 py-16 text-center">
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-secondary text-primary"><Ticket className="size-6" /></span>
            <h3 className="mt-5 text-xl font-semibold">No trips booked yet</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">When you book, your trip appears here with a live tracker from confirmation through to your return.</p>
            <Link href="/packages" className={cn(buttonVariants({ size: "lg" }), "mt-6 h-11 rounded-full px-6")}>Find a trip</Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((b) => (
              <BookingCard key={b.ref} booking={b} now={now} highlighted={highlight === b.ref} onCancel={() => cancel(b.ref)} onRemove={() => remove(b.ref)} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
