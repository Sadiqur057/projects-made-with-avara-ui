"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { CreditCard, Loader2, Lock, MapPin, ShieldCheck, Truck } from "lucide-react";
import { Stepper, StepperContent, type Step } from "@/components/custom/blocks/StepperBlock";
import {
  PromoField,
  SummaryLines,
  TotalsTable,
} from "@/components/store/cart/order-summary";
import { SHIPPING, money2, priceCart, type ShippingMethod } from "@/lib/pricing";
import { buildOrder } from "@/lib/orders";
import { actions, useHydrated, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface Form {
  email: string;
  name: string;
  line1: string;
  line2: string;
  city: string;
  region: string;
  postal: string;
  country: string;
  method: ShippingMethod;
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvc: string;
}

type Errors = Partial<Record<keyof Form, string>>;

const EMPTY: Form = {
  email: "",
  name: "",
  line1: "",
  line2: "",
  city: "",
  region: "",
  postal: "",
  country: "United States",
  method: "standard",
  cardNumber: "",
  cardName: "",
  expiry: "",
  cvc: "",
};

const COUNTRIES = ["United States", "Canada", "United Kingdom", "Australia", "Germany", "France"];

const luhn = (digits: string) => {
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = Number(digits[i]);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
};

const formatCard = (v: string) =>
  v
    .replace(/\D/g, "")
    .slice(0, 19)
    .replace(/(.{4})/g, "$1 ")
    .trim();

const formatExpiry = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

function validateDetails(f: Form): Errors {
  const e: Errors = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = "Enter a valid email address.";
  if (f.name.trim().length < 2) e.name = "Enter your full name.";
  if (f.line1.trim().length < 3) e.line1 = "Enter your street address.";
  if (!f.city.trim()) e.city = "Enter your city.";
  if (!f.region.trim()) e.region = "Enter your state or region.";
  if (f.postal.trim().length < 3) e.postal = "Enter your postal code.";
  return e;
}

function validatePayment(f: Form): Errors {
  const e: Errors = {};
  const digits = f.cardNumber.replace(/\s/g, "");
  if (digits.length < 13 || !luhn(digits)) e.cardNumber = "That card number doesn't look right.";
  if (f.cardName.trim().length < 2) e.cardName = "Enter the name on the card.";
  const m = /^(\d{2})\/(\d{2})$/.exec(f.expiry);
  if (!m || Number(m[1]) < 1 || Number(m[1]) > 12) {
    e.expiry = "Use MM/YY.";
  } else {
    const now = new Date();
    const year = 2000 + Number(m[2]);
    if (year < now.getFullYear() || (year === now.getFullYear() && Number(m[1]) < now.getMonth() + 1)) {
      e.expiry = "This card has expired.";
    }
  }
  if (!/^\d{3,4}$/.test(f.cvc)) e.cvc = "Enter the 3 or 4 digit code.";
  return e;
}

function Field({
  id,
  label,
  error,
  hint,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  className?: string;
  children: (props: { id: string; "aria-invalid": boolean; "aria-describedby"?: string; className: string }) => React.ReactNode;
}) {
  const describedBy = error ? `${id}-err` : hint ? `${id}-hint` : undefined;
  return (
    <div className={cn("grid gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children({
        id,
        "aria-invalid": !!error,
        "aria-describedby": describedBy,
        className: cn(
          "h-11 w-full rounded-xl border bg-background px-3.5 text-sm placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring",
          error ? "border-destructive" : "border-input",
        ),
      })}
      {error ? (
        <p id={`${id}-err`} role="alert" className="text-sm text-destructive">
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

export function CheckoutClient() {
  const router = useRouter();
  const { cart, promo, newsletter } = useStore();
  const hydrated = useHydrated();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [placing, setPlacing] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const totals = priceCart(cart, promo, form.method);
  // Prefill the email once from the newsletter signup, without an effect.
  const email = form.email || newsletter || "";

  const set = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const focusFirstError = (e: Errors) => {
    const first = Object.keys(e)[0];
    if (first) requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>(`#f-${first}`)?.focus());
  };

  const next = () => {
    const current = { ...form, email };
    if (step === 0) {
      const e = validateDetails(current);
      setErrors(e);
      if (Object.keys(e).length) return focusFirstError(e);
      setForm(current);
    }
    setStep((s) => Math.min(2, s + 1));
  };

  const placeOrder = async () => {
    const e = validatePayment(form);
    setErrors(e);
    if (Object.keys(e).length) return focusFirstError(e);

    setPlacing(true);
    setPayError(null);
    // Simulated payment: nothing is charged and card details are never stored.
    await new Promise((r) => setTimeout(r, 1100));
    const digits = form.cardNumber.replace(/\s/g, "");
    if (digits === "4000000000000002") {
      setPlacing(false);
      setPayError("Your card was declined. Please try a different card.");
      return;
    }

    const order = buildOrder({
      email,
      name: form.name.trim(),
      address: {
        line1: form.line1.trim(),
        line2: form.line2.trim() || undefined,
        city: form.city.trim(),
        region: form.region.trim(),
        postal: form.postal.trim(),
        country: form.country,
      },
      items: totals.lines.map((l) => ({
        slug: l.slug,
        name: l.product.name,
        sizeLabel: l.size.label,
        qty: l.qty,
        unitPrice: l.price.final,
        interval: l.interval,
      })),
      subtotal: totals.subtotal,
      promoDiscount: totals.promoDiscount,
      promoCode: promo,
      shipping: totals.shipping,
      total: totals.total,
      method: form.method,
    });
    actions.placeOrder(order);
    router.push(`/track?order=${order.id}&placed=1`);
  };

  if (!hydrated) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6" aria-busy="true" aria-label="Loading checkout">
        <div className="h-10 w-56 animate-pulse rounded bg-muted motion-reduce:animate-none" />
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_26rem]">
          <div className="h-96 animate-pulse rounded-3xl bg-muted motion-reduce:animate-none" />
          <div className="h-96 animate-pulse rounded-3xl bg-muted motion-reduce:animate-none" />
        </div>
      </div>
    );
  }

  if (totals.lines.length === 0) {
    return (
      <div className="mx-auto grid w-full max-w-xl place-items-center px-4 py-24 text-center">
        <h1 className="font-display text-4xl font-medium">Nothing to check out</h1>
        <p className="mt-3 text-muted-foreground">Add something to your bag first.</p>
        <Link href="/shop" className="mt-6 inline-flex h-12 items-center rounded-xl bg-primary px-7 text-sm font-semibold text-primary-foreground hover:opacity-90">
          Shop all
        </Link>
      </div>
    );
  }

  const steps: Step[] = [
    {
      id: "details",
      title: "Details",
      description: "Contact & address",
      icon: MapPin,
      content: (
        <div className="grid gap-5">
          <h2 className="font-display text-2xl font-medium">Where should we send it?</h2>
          <Field id="f-email" label="Email" error={errors.email} hint="For your receipt and tracking updates.">
            {(p) => <input {...p} type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => set("email", e.target.value)} />}
          </Field>
          <Field id="f-name" label="Full name" error={errors.name}>
            {(p) => <input {...p} autoComplete="name" value={form.name} onChange={(e) => set("name", e.target.value)} />}
          </Field>
          <Field id="f-line1" label="Address" error={errors.line1}>
            {(p) => <input {...p} autoComplete="address-line1" value={form.line1} onChange={(e) => set("line1", e.target.value)} />}
          </Field>
          <Field id="f-line2" label="Apartment, suite, etc. (optional)">
            {(p) => <input {...p} autoComplete="address-line2" value={form.line2} onChange={(e) => set("line2", e.target.value)} />}
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="f-city" label="City" error={errors.city}>
              {(p) => <input {...p} autoComplete="address-level2" value={form.city} onChange={(e) => set("city", e.target.value)} />}
            </Field>
            <Field id="f-region" label="State / region" error={errors.region}>
              {(p) => <input {...p} autoComplete="address-level1" value={form.region} onChange={(e) => set("region", e.target.value)} />}
            </Field>
            <Field id="f-postal" label="Postal code" error={errors.postal}>
              {(p) => <input {...p} autoComplete="postal-code" value={form.postal} onChange={(e) => set("postal", e.target.value)} />}
            </Field>
            <Field id="f-country" label="Country">
              {(p) => (
                <select {...p} autoComplete="country-name" value={form.country} onChange={(e) => set("country", e.target.value)}>
                  {COUNTRIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              )}
            </Field>
          </div>
        </div>
      ),
    },
    {
      id: "delivery",
      title: "Delivery",
      description: "Pick a speed",
      icon: Truck,
      content: (
        <div className="grid gap-5">
          <h2 className="font-display text-2xl font-medium">How fast do you want it?</h2>
          <fieldset className="grid gap-3">
            <legend className="sr-only">Delivery method</legend>
            {(Object.keys(SHIPPING) as ShippingMethod[]).map((m) => {
              const t = priceCart(cart, promo, m);
              const selected = form.method === m;
              return (
                <label
                  key={m}
                  className={cn(
                    "flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring",
                    selected ? "border-primary bg-card ring-1 ring-primary" : "border-border bg-card hover:bg-muted/60",
                  )}
                >
                  <input type="radio" name="method" checked={selected} onChange={() => set("method", m)} className="size-4 accent-primary" />
                  <span className="flex-1">
                    <span className="block font-semibold">{SHIPPING[m].label}</span>
                    <span className="text-sm text-muted-foreground">{SHIPPING[m].days}</span>
                  </span>
                  <span className="font-semibold tabular-nums">{t.shipping === 0 ? "Free" : money2(t.shipping)}</span>
                </label>
              );
            })}
          </fieldset>
          {totals.hasSubscription && (
            <p className="rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground">
              Your subscription items ship now and then repeat on the schedule you chose. You&apos;ll get a reminder before every shipment.
            </p>
          )}
        </div>
      ),
    },
    {
      id: "payment",
      title: "Payment",
      description: "Secure & simple",
      icon: CreditCard,
      content: (
        <div className="grid gap-5">
          <h2 className="font-display text-2xl font-medium">Payment</h2>
          <p className="flex items-start gap-2 rounded-xl bg-accent px-4 py-3 text-sm text-accent-foreground">
            <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>
              <strong>Demo checkout.</strong> Nothing is charged, and card details are never stored or sent anywhere. Use the
              test card <button type="button" className="font-semibold underline" onClick={() => setForm((f) => ({ ...f, cardNumber: "4242 4242 4242 4242", cardName: f.cardName || f.name, expiry: "12/34", cvc: "123" }))}>4242 4242 4242 4242</button>
              {" "}(any future date, any CVC). <code>4000 0000 0000 0002</code> simulates a decline.
            </span>
          </p>
          {payError && (
            <p role="alert" className="rounded-xl border border-destructive bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
              {payError}
            </p>
          )}
          <Field id="f-cardNumber" label="Card number" error={errors.cardNumber}>
            {(p) => (
              <input
                {...p}
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="1234 5678 9012 3456"
                value={form.cardNumber}
                onChange={(e) => set("cardNumber", formatCard(e.target.value))}
              />
            )}
          </Field>
          <Field id="f-cardName" label="Name on card" error={errors.cardName}>
            {(p) => <input {...p} autoComplete="cc-name" value={form.cardName} onChange={(e) => set("cardName", e.target.value)} />}
          </Field>
          <div className="grid grid-cols-2 gap-5">
            <Field id="f-expiry" label="Expiry" error={errors.expiry}>
              {(p) => (
                <input {...p} inputMode="numeric" autoComplete="cc-exp" placeholder="MM/YY" value={form.expiry} onChange={(e) => set("expiry", formatExpiry(e.target.value))} />
              )}
            </Field>
            <Field id="f-cvc" label="CVC" error={errors.cvc}>
              {(p) => (
                <input {...p} inputMode="numeric" autoComplete="cc-csc" placeholder="123" maxLength={4} value={form.cvc} onChange={(e) => set("cvc", e.target.value.replace(/\D/g, ""))} />
              )}
            </Field>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="font-display text-4xl font-medium tracking-tight sm:text-5xl">Checkout</h1>

      <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1fr_26rem]">
        <div ref={formRef}>
          <Stepper
            steps={steps}
            currentStep={step}
            onStepChange={(i) => {
              if (i < step) setStep(i);
            }}
            aria-label="Checkout progress"
          />

          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              if (step < 2) next();
              else void placeOrder();
            }}
            className="mt-10 rounded-3xl border border-border bg-card p-5 sm:p-8"
          >
            <StepperContent steps={steps} currentStep={step} />

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  disabled={placing}
                  className="h-12 rounded-xl px-4 text-sm font-semibold text-muted-foreground hover:text-foreground disabled:opacity-50"
                >
                  ← Back
                </button>
              ) : (
                <Link href="/cart" className="inline-flex h-12 items-center rounded-xl px-4 text-sm font-semibold text-muted-foreground hover:text-foreground">
                  ← Back to bag
                </Link>
              )}
              <button
                type="submit"
                disabled={placing}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-70"
              >
                {placing ? (
                  <>
                    <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                    Placing order…
                  </>
                ) : step < 2 ? (
                  "Continue"
                ) : (
                  <>
                    <Lock className="size-4" aria-hidden="true" />
                    Place order · {money2(totals.total)}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <aside className="rounded-3xl border border-border bg-card p-5 sm:p-6 lg:sticky lg:top-6" aria-label="Order summary">
          <h2 className="font-display text-2xl font-medium">In your bag</h2>
          <div className="mt-5 grid gap-5">
            <SummaryLines totals={totals} />
            <PromoField promo={promo} />
            <TotalsTable totals={totals} method={form.method} />
          </div>
        </aside>
      </div>
    </div>
  );
}
