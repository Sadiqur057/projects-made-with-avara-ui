"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Banknote, CreditCard, Lock, MapPin, ShieldCheck, Truck, User } from "lucide-react";
import Button from "@/components/custom/blocks/Button";
import { InputBlock } from "@/components/custom/blocks/InputBlock";
import { Stepper } from "@/components/custom/blocks/StepperBlock";
import { SHIPPING, money, type ShippingMethod } from "@/lib/store/pricing";
import { placeOrder, useCart, useHydrated } from "@/lib/store/store";
import { cn } from "@/lib/utils";
import { CouponBox } from "./coupon-box";
import { QtyStepper } from "./cart-drawer";

const STEPS = [
  { id: "info", title: "Information", icon: User },
  { id: "delivery", title: "Delivery", icon: Truck },
  { id: "payment", title: "Payment", icon: CreditCard },
];

type Errors = Record<string, string>;

interface Form {
  name: string;
  email: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  region: string;
  postal: string;
  country: string;
  method: ShippingMethod;
  pay: "card" | "cod";
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
}

const INITIAL: Form = {
  name: "",
  email: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  region: "",
  postal: "",
  country: "United States",
  method: "standard",
  pay: "card",
  cardName: "",
  cardNumber: "",
  expiry: "",
  cvc: "",
};

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

function validate(step: number, f: Form): Errors {
  const e: Errors = {};
  if (step === 0) {
    if (f.name.trim().length < 2) e.name = "Enter your full name";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Enter a valid email address";
    if (f.phone.replace(/\D/g, "").length < 7) e.phone = "Enter a phone number for the courier";
    if (!f.line1.trim()) e.line1 = "Enter your street address";
    if (!f.city.trim()) e.city = "Enter your city";
    if (!f.region.trim()) e.region = "Enter your state or region";
    if (f.postal.trim().length < 3) e.postal = "Enter your postal code";
  }
  if (step === 2 && f.pay === "card") {
    const digits = f.cardNumber.replace(/\s/g, "");
    if (f.cardName.trim().length < 2) e.cardName = "Enter the name on the card";
    if (digits.length < 13 || !luhn(digits)) e.cardNumber = "Enter a valid card number (try 4242 4242 4242 4242)";
    const m = /^(\d{2})\s*\/\s*(\d{2})$/.exec(f.expiry);
    if (!m || Number(m[1]) < 1 || Number(m[1]) > 12) e.expiry = "Use MM/YY";
    else {
      const now = new Date();
      const exp = new Date(2000 + Number(m[2]), Number(m[1]), 0, 23, 59, 59);
      if (exp < now) e.expiry = "This card has expired";
    }
    if (!/^\d{3,4}$/.test(f.cvc)) e.cvc = "3 or 4 digits";
  }
  return e;
}

export function CheckoutView() {
  const router = useRouter();
  const hydrated = useHydrated();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [placing, setPlacing] = useState(false);
  const { lines, totals } = useCart(form.method);

  const field = <K extends keyof Form>(key: K) => ({
    name: key,
    value: form[key] as string,
    error: errors[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      if (errors[key]) setErrors((er) => ({ ...er, [key]: "" }));
    },
  });

  const next = () => {
    const e = validate(step, form);
    setErrors(e);
    if (Object.keys(e).length === 0) setStep((s) => Math.min(2, s + 1));
  };

  const submit = async () => {
    const e = validate(2, form);
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setPlacing(true);
    // Simulated payment processing.
    await new Promise((r) => setTimeout(r, 900));
    const order = placeOrder({
      customer: { name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() },
      address: { line1: form.line1.trim(), line2: form.line2.trim() || undefined, city: form.city.trim(), region: form.region.trim(), postal: form.postal.trim(), country: form.country },
      shippingMethod: form.method,
      payment: form.pay === "card" ? { method: "card", last4: form.cardNumber.replace(/\s/g, "").slice(-4) } : { method: "cod" },
    });
    // The route stays mounted in the background after navigating away, so reset it (and drop the card details).
    setPlacing(false);
    if (order) {
      setForm(INITIAL);
      setStep(0);
      router.push(`/track?id=${order.id}&placed=1`);
    }
  };

  if (!hydrated) return <div className="mx-auto min-h-[60vh] max-w-6xl px-4 py-12 sm:px-6" aria-busy="true" />;

  if (lines.length === 0 && !placing) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-20 text-center">
        <p className="font-heading text-5xl">Your bag is empty</p>
        <p className="mt-3 text-muted-foreground">Add something you love and come back to check out.</p>
        <Link href="/shop" className="mt-8 inline-flex h-11 items-center rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 pb-24 pt-6 sm:px-6 lg:grid-cols-[1fr_26rem] lg:gap-14">
      <div>
        <h1 className="font-heading text-5xl sm:text-6xl">Checkout</h1>
        <div className="mb-10 mt-8 px-2">
          <Stepper steps={STEPS} currentStep={step} onStepChange={(i) => i < step && setStep(i)} />
        </div>

        {step === 0 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              next();
            }}
            className="space-y-8"
            noValidate
          >
            <fieldset className="space-y-4">
              <legend className="mb-2 flex items-center gap-2 text-lg font-semibold">
                <User className="size-5 text-primary" /> Contact
              </legend>
              <InputBlock label="Full name" autoComplete="name" {...field("name")} />
              <div className="grid gap-4 sm:grid-cols-2">
                <InputBlock label="Email" type="email" autoComplete="email" {...field("email")} />
                <InputBlock label="Phone" type="text" inputMode="tel" autoComplete="tel" {...field("phone")} />
              </div>
            </fieldset>
            <fieldset className="space-y-4">
              <legend className="mb-2 flex items-center gap-2 text-lg font-semibold">
                <MapPin className="size-5 text-primary" /> Shipping address
              </legend>
              <InputBlock label="Address" autoComplete="address-line1" {...field("line1")} />
              <InputBlock label="Apartment, suite, etc. (optional)" autoComplete="address-line2" {...field("line2")} />
              <div className="grid gap-4 sm:grid-cols-2">
                <InputBlock label="City" autoComplete="address-level2" {...field("city")} />
                <InputBlock label="State / region" autoComplete="address-level1" {...field("region")} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <InputBlock label="Postal code" autoComplete="postal-code" {...field("postal")} />
                <InputBlock label="Country" autoComplete="country-name" {...field("country")} />
              </div>
            </fieldset>
            <Button type="submit" variant="default" className="h-12 rounded-full px-8 text-sm font-semibold">
              Continue to delivery
            </Button>
          </form>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <fieldset>
              <legend className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Truck className="size-5 text-primary" /> Delivery method
              </legend>
              <div className="space-y-3" role="radiogroup" aria-label="Delivery method">
                {(Object.keys(SHIPPING) as ShippingMethod[]).map((m) => {
                  const s = SHIPPING[m];
                  const selected = form.method === m;
                  const free = m === "standard" && (totals.subtotal - totals.discount >= 120 || totals.couponApplied?.kind === "shipping");
                  return (
                    <button
                      key={m}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setForm((f) => ({ ...f, method: m }))}
                      className={cn("flex w-full items-center justify-between gap-4 rounded-2xl border p-4 text-left transition", selected ? "border-foreground bg-card ring-1 ring-foreground" : "border-border hover:border-foreground/50")}
                    >
                      <span className="flex items-center gap-3">
                        <span className={cn("grid size-5 place-items-center rounded-full border-2", selected ? "border-foreground" : "border-border")}>{selected && <span className="size-2.5 rounded-full bg-foreground" />}</span>
                        <span>
                          <span className="block font-medium">{s.label}</span>
                          <span className="block text-sm text-muted-foreground">{s.eta}</span>
                        </span>
                      </span>
                      <span className="font-semibold tabular-nums">{free ? "Free" : money(s.price)}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <div className="rounded-2xl bg-muted/60 p-4 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Shipping to</p>
              <p>
                {form.name} · {form.line1}
                {form.line2 && `, ${form.line2}`}, {form.city}, {form.region} {form.postal}, {form.country}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => setStep(0)} className="h-12 rounded-full px-6 text-sm">
                Back
              </Button>
              <Button variant="default" onClick={next} className="h-12 rounded-full px-8 text-sm font-semibold">
                Continue to payment
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <fieldset>
              <legend className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <CreditCard className="size-5 text-primary" /> Payment
              </legend>
              <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Payment method">
                {(
                  [
                    { id: "card", label: "Credit / debit card", icon: CreditCard },
                    { id: "cod", label: "Cash on delivery", icon: Banknote },
                  ] as const
                ).map((p) => {
                  const selected = form.pay === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setForm((f) => ({ ...f, pay: p.id }))}
                      className={cn("flex items-center gap-3 rounded-2xl border p-4 text-left transition", selected ? "border-foreground bg-card ring-1 ring-foreground" : "border-border hover:border-foreground/50")}
                    >
                      <p.icon className="size-5 text-primary" />
                      <span className="font-medium">{p.label}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {form.pay === "card" ? (
              <div className="space-y-4 rounded-3xl border border-border bg-card p-5">
                <p className="flex items-start gap-2 rounded-xl bg-primary/5 p-3 text-xs text-muted-foreground">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                  Demo store: no payment is taken. Use test card <strong className="text-foreground">4242 4242 4242 4242</strong>, any future date and any CVC.
                </p>
                <InputBlock label="Name on card" autoComplete="cc-name" {...field("cardName")} />
                <InputBlock
                  label="Card number"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="1234 5678 9012 3456"
                  leftIcon={<CreditCard className="size-4" />}
                  maxLength={19}
                  {...field("cardNumber")}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
                    setForm((f) => ({ ...f, cardNumber: v }));
                    if (errors.cardNumber) setErrors((er) => ({ ...er, cardNumber: "" }));
                  }}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <InputBlock
                    label="Expiry (MM/YY)"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="08/29"
                    maxLength={5}
                    {...field("expiry")}
                    onChange={(e) => {
                      let v = e.target.value.replace(/[^\d]/g, "").slice(0, 4);
                      if (v.length > 2) v = `${v.slice(0, 2)}/${v.slice(2)}`;
                      setForm((f) => ({ ...f, expiry: v }));
                      if (errors.expiry) setErrors((er) => ({ ...er, expiry: "" }));
                    }}
                  />
                  <InputBlock label="CVC" inputMode="numeric" autoComplete="cc-csc" placeholder="123" maxLength={4} {...field("cvc")} />
                </div>
              </div>
            ) : (
              <p className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
                Pay in cash when your order arrives. Please have the exact amount ready: <strong className="text-foreground">{money(totals.total)}</strong>.
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="h-12 rounded-full px-6 text-sm" disabled={placing}>
                Back
              </Button>
              <Button variant="default" onClick={submit} loading={placing} className="h-12 flex-1 gap-2 rounded-full px-8 text-sm font-semibold sm:flex-none" iconLeft={<Lock className="size-4" />}>
                Place order · {money(totals.total)}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Order summary */}
      <aside aria-label="Order summary" className="h-fit rounded-3xl border border-border bg-card p-5 sm:p-6 lg:sticky lg:top-36">
        <h2 className="font-heading text-3xl">Order summary</h2>
        <ul className="mt-5 divide-y divide-border">
          {lines.map((l) => (
            <li key={l.key} className="flex gap-3 py-3">
              <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg" style={{ backgroundColor: l.product.tone }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={l.image} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{l.product.name}</p>
                <p className="text-xs text-muted-foreground">
                  {l.color} · {l.size}
                </p>
                <div className="mt-2">
                  <QtyStepper line={l} size="sm" />
                </div>
              </div>
              <p className="text-sm font-semibold tabular-nums">{money(l.total)}</p>
            </li>
          ))}
        </ul>

        <div className="mt-4 border-t border-border pt-4">
          <CouponBox />
        </div>

        <dl className="mt-5 space-y-2 border-t border-border pt-5 text-sm">
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
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Estimated tax (8%)</dt>
            <dd className="tabular-nums">{money(totals.tax)}</dd>
          </div>
          <div className="flex justify-between border-t border-border pt-3 text-lg font-semibold">
            <dt>Total</dt>
            <dd className="tabular-nums">{money(totals.total)}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}
