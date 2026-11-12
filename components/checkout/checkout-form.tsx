"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useId, useState } from "react";
import { CheckCircle2, CreditCard, Landmark, Lock, ShieldCheck, Wallet } from "lucide-react";
import { TravellerCounter } from "@/components/site/traveller-counter";
import { buttonVariants } from "@/components/ui/button";
import { getDestination, getPackage, packageImage } from "@/lib/travel-data";
import { CHILD_RATE, INSURANCE_PER_PERSON, MAX_TRAVELLERS, TRANSFER_PER_PERSON, quote } from "@/lib/pricing";
import { fmtDate, money } from "@/lib/format";
import { newBookingRef, timestamp, useBookings, type Booking } from "@/lib/store";
import { cn } from "@/lib/utils";

const inputClass =
  "h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-3 aria-[invalid=true]:ring-destructive/20";

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: (props: { id: string; "aria-invalid": boolean; "aria-describedby"?: string }) => React.ReactNode;
}) {
  const id = useId();
  const describedBy = error ? `${id}-err` : hint ? `${id}-hint` : undefined;
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children({ id, "aria-invalid": !!error, "aria-describedby": describedBy })}
      {error ? (
        <p id={`${id}-err`} className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

type Method = Booking["paymentMethod"];
const METHODS: { id: Method; label: string; icon: typeof CreditCard; hint: string }[] = [
  { id: "card", label: "Credit or debit card", icon: CreditCard, hint: "Visa, Mastercard, Amex" },
  { id: "paypal", label: "PayPal", icon: Wallet, hint: "Pay with your PayPal balance" },
  { id: "bank", label: "Bank transfer", icon: Landmark, hint: "Details sent by email, 3 days to pay" },
];

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

export function CheckoutForm() {
  const params = useSearchParams();
  const { add } = useBookings();

  const pkg = getPackage(params.get("package") ?? "");
  const date = params.get("date") ?? "";
  const dateValid = /^\d{4}-\d{2}-\d{2}$/.test(date);

  const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, Math.round(n) || lo));
  const [adults, setAdults] = useState(clamp(Number(params.get("adults")), 1, MAX_TRAVELLERS));
  const [children, setChildren] = useState(clamp(Number(params.get("children")), 0, MAX_TRAVELLERS - 1));
  const [insurance, setInsurance] = useState(params.get("insurance") === "1");
  const [transfer, setTransfer] = useState(params.get("transfer") === "1");
  const deal = params.get("deal") === "1" && !!pkg?.deal;

  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "", cardName: "", cardNumber: "", expiry: "", cvc: "" });
  const [method, setMethod] = useState<Method>("card");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<Booking | null>(null);

  if (!pkg || !dateValid) {
    return (
      <div className="rounded-3xl border border-dashed border-border px-6 py-16 text-center">
        <h2 className="text-2xl font-semibold">Pick a trip to check out</h2>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">Choose a package, departure date and travellers first, then continue to checkout.</p>
        <Link href="/packages" className={cn(buttonVariants({ size: "lg" }), "mt-6 h-11 rounded-full px-6")}>Browse packages</Link>
      </div>
    );
  }

  const dest = getDestination(pkg.destination)!;
  const q = quote({ pkg, adults, children, deal, insurance, transfer });
  const people = adults + children;

  if (confirmed) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-8 text-center shadow-lg sm:p-12">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="size-9" />
        </span>
        <h2 className="mt-6 text-3xl font-semibold">You are going to {dest.name}!</h2>
        <p className="mt-3 text-muted-foreground">
          A confirmation is on its way to <strong className="text-foreground">{confirmed.contact.email}</strong>.
        </p>
        <div className="mx-auto mt-8 grid max-w-sm gap-3 rounded-2xl bg-secondary/70 p-5 text-left text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Booking reference</span><strong className="font-mono">{confirmed.ref}</strong></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Trip</span><strong>{confirmed.packageTitle}</strong></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Departure</span><strong>{fmtDate(confirmed.departure)}</strong></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Travellers</span><strong>{confirmed.adults + confirmed.children}</strong></div>
          <div className="flex justify-between border-t border-border pt-3"><span className="text-muted-foreground">Paid today</span><strong>{money(confirmed.deposit)}</strong></div>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={`/my-trips?ref=${confirmed.ref}`} className={cn(buttonVariants({ size: "lg" }), "h-11 rounded-full px-6")}>Track this booking</Link>
          <Link href="/packages" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 rounded-full px-6")}>Keep exploring</Link>
        </div>
      </div>
    );
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: "" }));
  };

  const validate = () => {
    const er: Record<string, string> = {};
    if (form.name.trim().split(/\s+/).length < 2) er.name = "Enter your first and last name as on your passport.";
    if (!emailOk(form.email)) er.email = "Enter a valid email address.";
    if (form.phone.replace(/\D/g, "").length < 7) er.phone = "Enter a phone number we can reach you on.";
    if (method === "card") {
      if (!form.cardName.trim()) er.cardName = "Enter the name on the card.";
      if (form.cardNumber.replace(/\s/g, "").length < 13) er.cardNumber = "Enter a valid card number.";
      if (!/^(0[1-9]|1[0-2])\s?\/\s?\d{2}$/.test(form.expiry)) er.expiry = "Use MM / YY.";
      if (!/^\d{3,4}$/.test(form.cvc)) er.cvc = "3 or 4 digits.";
    }
    if (!agree) er.agree = "Please accept the booking terms to continue.";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      requestAnimationFrame(() => document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900)); // simulated payment processing
    const booking: Booking = {
      ref: newBookingRef(),
      packageSlug: pkg.slug,
      packageTitle: pkg.title,
      destinationName: dest.name,
      image: packageImage(pkg),
      days: pkg.days,
      departure: date,
      adults,
      children,
      addons: { insurance, transfer },
      total: q.total,
      deposit: q.deposit,
      paymentMethod: method,
      // card details are intentionally never stored
      contact: { name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), notes: form.notes.trim() || undefined },
      createdAt: timestamp(),
    };
    add(booking);
    setSubmitting(false);
    setConfirmed(booking);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <form onSubmit={submit} noValidate className="grid items-start gap-8 lg:grid-cols-[1fr_24rem] lg:gap-12">
      <div className="grid gap-8">
        <section className="rounded-2xl border border-border bg-card p-6" aria-labelledby="co-travellers">
          <h2 id="co-travellers" className="text-xl font-semibold">1. Travellers & extras</h2>
          <div className="mt-5 grid gap-4">
            <TravellerCounter label="Adults" hint="Age 12+" value={adults} min={1} max={MAX_TRAVELLERS} onChange={(n) => { setAdults(n); if (n + children > MAX_TRAVELLERS) setChildren(MAX_TRAVELLERS - n); }} />
            <TravellerCounter label="Children" hint={`Age 2–11 · ${Math.round(CHILD_RATE * 100)}% of adult price`} value={children} min={0} max={MAX_TRAVELLERS - adults} onChange={setChildren} />
          </div>
          <div className="mt-6 grid gap-3 border-t border-border pt-5 text-sm">
            <label className="flex cursor-pointer items-start gap-3">
              <input type="checkbox" checked={insurance} onChange={(e) => setInsurance(e.target.checked)} className="mt-0.5 size-4 accent-[var(--primary)]" />
              <span><span className="font-medium">Travel insurance</span> · {money(INSURANCE_PER_PERSON)}/person<span className="block text-xs text-muted-foreground">Medical, cancellation and baggage cover.</span></span>
            </label>
            <label className="flex cursor-pointer items-start gap-3">
              <input type="checkbox" checked={transfer} onChange={(e) => setTransfer(e.target.checked)} className="mt-0.5 size-4 accent-[var(--primary)]" />
              <span><span className="font-medium">Extra airport transfer</span> · {money(TRANSFER_PER_PERSON)}/person<span className="block text-xs text-muted-foreground">For out-of-hours arrivals or a second airport.</span></span>
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6" aria-labelledby="co-contact">
          <h2 id="co-contact" className="text-xl font-semibold">2. Lead traveller</h2>
          <p className="mt-1 text-sm text-muted-foreground">We send your confirmation and vouchers here.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Full name" error={errors.name} hint="As shown on your passport">
                {(p) => <input {...p} className={inputClass} value={form.name} onChange={set("name")} autoComplete="name" placeholder="Alex Morgan" />}
              </Field>
            </div>
            <Field label="Email" error={errors.email}>
              {(p) => <input {...p} type="email" className={inputClass} value={form.email} onChange={set("email")} autoComplete="email" placeholder="alex@example.com" />}
            </Field>
            <Field label="Phone" error={errors.phone}>
              {(p) => <input {...p} type="tel" className={inputClass} value={form.phone} onChange={set("phone")} autoComplete="tel" placeholder="+1 415 555 0100" />}
            </Field>
            <div className="sm:col-span-2">
              <Field label="Special requests (optional)" hint="Dietary needs, accessibility, celebrations">
                {(p) => <textarea {...p} rows={3} className={cn(inputClass, "h-auto py-2.5")} value={form.notes} onChange={set("notes")} />}
              </Field>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6" aria-labelledby="co-pay">
          <h2 id="co-pay" className="text-xl font-semibold">3. Payment</h2>
          <div role="radiogroup" aria-label="Payment method" className="mt-5 grid gap-3">
            {METHODS.map((m) => (
              <button
                key={m.id}
                type="button"
                role="radio"
                aria-checked={method === m.id}
                onClick={() => setMethod(m.id)}
                className={cn(
                  "flex items-center gap-4 rounded-xl border px-4 py-3 text-left transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  method === m.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted",
                )}
              >
                <m.icon className="size-5 text-primary" />
                <span className="flex-1">
                  <span className="block text-sm font-medium">{m.label}</span>
                  <span className="text-xs text-muted-foreground">{m.hint}</span>
                </span>
                <span className={cn("size-4 rounded-full border-2", method === m.id ? "border-primary bg-primary shadow-[inset_0_0_0_3px_var(--card)]" : "border-border")} />
              </button>
            ))}
          </div>

          {method === "card" && (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Name on card" error={errors.cardName}>
                  {(p) => <input {...p} className={inputClass} value={form.cardName} onChange={set("cardName")} autoComplete="cc-name" />}
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Card number" error={errors.cardNumber}>
                  {(p) => (
                    <input
                      {...p}
                      inputMode="numeric"
                      className={cn(inputClass, "font-mono")}
                      value={form.cardNumber}
                      autoComplete="cc-number"
                      placeholder="4242 4242 4242 4242"
                      onChange={(e) => setForm((f) => ({ ...f, cardNumber: e.target.value.replace(/[^\d]/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim() }))}
                    />
                  )}
                </Field>
              </div>
              <Field label="Expiry" error={errors.expiry}>
                {(p) => <input {...p} inputMode="numeric" className={cn(inputClass, "font-mono")} value={form.expiry} onChange={set("expiry")} autoComplete="cc-exp" placeholder="MM / YY" maxLength={7} />}
              </Field>
              <Field label="CVC" error={errors.cvc}>
                {(p) => <input {...p} inputMode="numeric" className={cn(inputClass, "font-mono")} value={form.cvc} onChange={set("cvc")} autoComplete="cc-csc" placeholder="123" maxLength={4} />}
              </Field>
            </div>
          )}
          {method === "paypal" && <p className="mt-5 rounded-xl bg-secondary/70 p-4 text-sm text-muted-foreground">You will be asked to approve the {money(q.deposit)} deposit in PayPal after you confirm.</p>}
          {method === "bank" && <p className="mt-5 rounded-xl bg-secondary/70 p-4 text-sm text-muted-foreground">We will email our bank details. Your places are held for 3 days while we wait for the {money(q.deposit)} deposit.</p>}
          <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"><Lock className="size-3.5" /> Demo checkout: no payment is taken and card details are never stored.</p>
        </section>

        <div className="grid gap-4">
          <label className="flex cursor-pointer items-start gap-3 text-sm">
            <input type="checkbox" checked={agree} onChange={(e) => { setAgree(e.target.checked); if (e.target.checked) setErrors((er) => ({ ...er, agree: "" })); }} aria-invalid={!!errors.agree} className="mt-0.5 size-4 accent-[var(--primary)]" />
            <span>I have read the <Link href="/contact#faq" className="font-medium text-primary underline-offset-2 hover:underline">booking terms and cancellation policy</Link>.</span>
          </label>
          {errors.agree && <p className="text-xs text-destructive" role="alert">{errors.agree}</p>}
          <button
            type="submit"
            disabled={submitting}
            className={cn(buttonVariants({ size: "lg" }), "h-12 rounded-full text-base lg:hidden")}
          >
            {submitting ? "Processing…" : `Pay ${money(q.deposit)} deposit`}
          </button>
        </div>
      </div>

      <aside className="rounded-3xl border border-border bg-card p-5 shadow-lg lg:sticky lg:top-24" aria-label="Order summary">
        <div className="flex gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={packageImage(pkg)} alt="" className="size-20 shrink-0 rounded-xl object-cover" />
          <div>
            <h2 className="text-lg font-semibold leading-snug">{pkg.title}</h2>
            <p className="text-sm text-muted-foreground">{dest.name} · {pkg.days} days</p>
            <p className="mt-1 text-sm font-medium">{fmtDate(date, true)}</p>
          </div>
        </div>
        <dl className="mt-5 grid gap-2 border-t border-border pt-5 text-sm">
          <div className="flex justify-between"><dt className="text-muted-foreground">{adults} × adult at {money(q.unit)}</dt><dd className="tabular-nums">{money(q.adultsTotal)}</dd></div>
          {children > 0 && <div className="flex justify-between"><dt className="text-muted-foreground">{children} × child at {money(Math.round(q.unit * CHILD_RATE))}</dt><dd className="tabular-nums">{money(q.childrenTotal)}</dd></div>}
          {insurance && <div className="flex justify-between"><dt className="text-muted-foreground">Insurance × {people}</dt><dd className="tabular-nums">{money(q.insuranceTotal)}</dd></div>}
          {transfer && <div className="flex justify-between"><dt className="text-muted-foreground">Extra transfer × {people}</dt><dd className="tabular-nums">{money(q.transferTotal)}</dd></div>}
          {q.saved > 0 && <div className="flex justify-between font-medium text-sun"><dt>Last-minute saving</dt><dd className="tabular-nums">−{money(q.saved)}</dd></div>}
          <div className="mt-2 flex items-baseline justify-between border-t border-border pt-3"><dt className="font-semibold">Trip total</dt><dd className="text-xl font-semibold tabular-nums">{money(q.total)}</dd></div>
          <div className="flex justify-between rounded-xl bg-secondary/70 px-3 py-2 font-medium"><dt>Due today (25%)</dt><dd className="tabular-nums">{money(q.deposit)}</dd></div>
          <div className="flex justify-between text-xs text-muted-foreground"><dt>Balance due 45 days before departure</dt><dd className="tabular-nums">{money(q.total - q.deposit)}</dd></div>
        </dl>
        <button type="submit" disabled={submitting} className={cn(buttonVariants({ size: "lg" }), "mt-5 hidden h-12 w-full rounded-full text-base lg:inline-flex")}>
          {submitting ? "Processing…" : `Pay ${money(q.deposit)} deposit`}
        </button>
        <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" /> Free changes up to 30 days before departure. Full refund if you cancel 45+ days out.</p>
        <Link href={`/packages/${pkg.slug}`} className="mt-3 inline-block text-xs font-medium text-primary hover:underline">← Change dates or trip</Link>
      </aside>
    </form>
  );
}
