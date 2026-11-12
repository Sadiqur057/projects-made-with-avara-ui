"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { CalendarDays, Flame, ShieldCheck } from "lucide-react";
import { TravellerCounter } from "@/components/site/traveller-counter";
import { WishlistButton } from "@/components/site/wishlist-button";
import { buttonVariants } from "@/components/ui/button";
import { Countdown } from "@/components/site/countdown";
import { dealPrice, type TravelPackage } from "@/lib/travel-data";
import { CHILD_RATE, INSURANCE_PER_PERSON, MAX_TRAVELLERS, TRANSFER_PER_PERSON, quote } from "@/lib/pricing";
import { addDays, fmtDate, money, toIso, upcomingDepartures } from "@/lib/format";
import { useNow } from "@/lib/store";
import { cn } from "@/lib/utils";

export function BookingWidget({ pkg }: { pkg: TravelPackage }) {
  const params = useSearchParams();
  const wantsDeal = params.get("deal") === "1";
  const now = useNow(3_600_000);

  const initialTravellers = Math.min(MAX_TRAVELLERS, Math.max(1, Number(params.get("travellers")) || 2));
  const [adults, setAdults] = useState(initialTravellers);
  const [children, setChildren] = useState(0);
  const [insurance, setInsurance] = useState(false);
  const [transfer, setTransfer] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);

  const dealDate = pkg.deal && now !== null ? toIso(addDays(new Date(now), pkg.deal.departsInDays)) : null;
  const regular = now === null ? [] : upcomingDepartures(now, 6, 21).filter((d) => d !== dealDate);
  const options = dealDate ? [dealDate, ...regular.slice(0, 5)] : regular;
  const selected = picked ?? (wantsDeal && dealDate ? dealDate : options[0] ?? null);
  const isDeal = !!dealDate && selected === dealDate;

  const people = adults + children;
  const q = quote({ pkg, adults, children, deal: isDeal, insurance, transfer });

  const setAdultCount = (n: number) => {
    setAdults(n);
    if (n + children > MAX_TRAVELLERS) setChildren(MAX_TRAVELLERS - n);
  };

  const checkoutHref =
    selected === null
      ? "#"
      : `/checkout?${new URLSearchParams({
          package: pkg.slug,
          date: selected,
          adults: String(adults),
          children: String(children),
          insurance: insurance ? "1" : "0",
          transfer: transfer ? "1" : "0",
          deal: isDeal ? "1" : "0",
        }).toString()}`;

  return (
    <div className="grid gap-6 rounded-3xl border border-border bg-card p-6 shadow-lg">
      <div className="flex items-end justify-between gap-3">
        <div>
          <span className="text-xs uppercase tracking-wider text-muted-foreground">{isDeal ? "Deal price" : "From"}</span>
          <div className="flex items-baseline gap-2">
            {isDeal && <span className="text-base text-muted-foreground line-through tabular-nums">{money(pkg.price)}</span>}
            <span className="text-3xl font-semibold tabular-nums">{money(isDeal ? dealPrice(pkg) : pkg.price)}</span>
            <span className="text-sm text-muted-foreground">/adult</span>
          </div>
        </div>
        <WishlistButton slug={pkg.slug} title={pkg.title} variant="overlay" className="border border-border" />
      </div>

      <fieldset className="grid gap-3">
        <legend className="mb-1 inline-flex items-center gap-2 text-sm font-medium">
          <CalendarDays className="size-4" /> Choose a departure
        </legend>
        {options.length === 0 ? (
          <div className="h-24 animate-pulse rounded-xl bg-muted" aria-label="Loading departures" />
        ) : (
          <div role="radiogroup" aria-label="Departure date" className="grid grid-cols-2 gap-2">
            {options.map((d) => {
              const active = selected === d;
              const deal = d === dealDate;
              return (
                <button
                  key={d}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setPicked(d)}
                  className={cn(
                    "relative rounded-xl border px-3 py-2.5 text-left text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                    active ? "border-primary bg-primary/10" : "border-border hover:bg-muted",
                  )}
                >
                  <span className="block font-medium">{fmtDate(d, true).replace(/, \d{4}$/, "")}</span>
                  <span className="text-xs text-muted-foreground">
                    {deal ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-sun">
                        <Flame className="size-3" /> {pkg.deal!.discount}% off · {pkg.deal!.seatsLeft} left
                      </span>
                    ) : (
                      `Returns ${fmtDate(toIso(addDays(new Date(d + "T00:00:00"), pkg.days - 1))).replace(/, \d{4}$/, "")}`
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        )}
        {isDeal && (
          <div className="flex items-center justify-between gap-2 rounded-xl bg-accent px-3 py-2 text-accent-foreground">
            <span className="text-xs font-medium">Deal ends in</span>
            <Countdown tone="bg-background/60" className="scale-90" />
          </div>
        )}
      </fieldset>

      <div className="grid gap-4 border-t border-border pt-5">
        <TravellerCounter label="Adults" hint="Age 12+" value={adults} min={1} max={MAX_TRAVELLERS} onChange={setAdultCount} />
        <TravellerCounter
          label="Children"
          hint={`Age 2–11 · ${Math.round(CHILD_RATE * 100)}% of adult price`}
          value={children}
          min={0}
          max={MAX_TRAVELLERS - adults}
          onChange={setChildren}
        />
        {people >= pkg.maxGroup && <p className="text-xs text-sun">Groups of {pkg.maxGroup}+ are placed on shared departures with limited availability.</p>}
      </div>

      <div className="grid gap-3 border-t border-border pt-5 text-sm">
        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" checked={insurance} onChange={(e) => setInsurance(e.target.checked)} className="mt-0.5 size-4 accent-[var(--primary)]" />
          <span className="flex-1">
            <span className="flex items-center gap-1.5 font-medium"><ShieldCheck className="size-4 text-primary" /> Travel insurance</span>
            <span className="text-xs text-muted-foreground">Medical and cancellation cover · {money(INSURANCE_PER_PERSON)}/person</span>
          </span>
        </label>
        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" checked={transfer} onChange={(e) => setTransfer(e.target.checked)} className="mt-0.5 size-4 accent-[var(--primary)]" />
          <span className="flex-1">
            <span className="font-medium">Extra airport transfer</span>
            <span className="block text-xs text-muted-foreground">Out-of-hours or a second airport · {money(TRANSFER_PER_PERSON)}/person</span>
          </span>
        </label>
      </div>

      <dl className="grid gap-2 border-t border-border pt-5 text-sm" aria-label="Price summary">
        <div className="flex justify-between"><dt className="text-muted-foreground">{adults} × adult at {money(q.unit)}</dt><dd className="tabular-nums">{money(q.adultsTotal)}</dd></div>
        {children > 0 && <div className="flex justify-between"><dt className="text-muted-foreground">{children} × child at {money(Math.round(q.unit * CHILD_RATE))}</dt><dd className="tabular-nums">{money(q.childrenTotal)}</dd></div>}
        {insurance && <div className="flex justify-between"><dt className="text-muted-foreground">Insurance</dt><dd className="tabular-nums">{money(q.insuranceTotal)}</dd></div>}
        {transfer && <div className="flex justify-between"><dt className="text-muted-foreground">Extra transfer</dt><dd className="tabular-nums">{money(q.transferTotal)}</dd></div>}
        {q.saved > 0 && <div className="flex justify-between font-medium text-sun"><dt>Last-minute saving</dt><dd className="tabular-nums">−{money(q.saved)}</dd></div>}
        <div className="mt-1 flex items-baseline justify-between border-t border-border pt-3 text-base font-semibold"><dt>Total</dt><dd className="text-2xl tabular-nums">{money(q.total)}</dd></div>
        <p className="text-xs text-muted-foreground">Pay {money(q.deposit)} today to secure {people === 1 ? "your place" : `${people} places`}. Balance due 45 days before departure.</p>
      </dl>

      <Link
        href={checkoutHref}
        aria-disabled={selected === null}
        className={cn(buttonVariants({ size: "lg" }), "h-12 rounded-full text-base", selected === null && "pointer-events-none opacity-50")}
      >
        Continue to checkout
      </Link>
    </div>
  );
}
