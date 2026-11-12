"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { BadgeCheck, CalendarCheck, Check, CreditCard, Lock, TicketPercent } from "lucide-react";
import { Stepper, StepperContent, type Step } from "@/components/custom/blocks/StepperBlock";
import { toast } from "@/components/custom/blocks/sonner-store";
import {
  PLANS,
  PROMO_CODES,
  planById,
  planPrice,
  planTotal,
  type Cycle,
  type PlanId,
} from "@/lib/gym-data";
import { completeCheckout, getAccess, useGymState, type Order } from "@/lib/gym-store";
import { formatFullDate, useNow } from "@/lib/time";
import { Button, Container, Field, LinkButton } from "@/components/site/ui";
import { cn } from "@/lib/utils";

const money = (n: number) => `$${n.toFixed(2)}`;

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
  return digits.length >= 13 && sum % 10 === 0;
};

const formatCard = (v: string) =>
  v
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();

const formatExpiry = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

type Errors = Partial<Record<"name" | "email" | "card" | "expiry" | "cvc" | "terms" | "promo", string>>;

export function CheckoutFlow() {
  const params = useSearchParams();
  const state = useGymState();
  const nowMs = useNow();

  const initialPlan = (planById(params.get("plan") ?? "")?.id ?? "pro") as PlanId;
  const initialCycle: Cycle = params.get("cycle") === "monthly" ? "monthly" : "annual";

  const [step, setStep] = useState(0);
  const [planId, setPlanId] = useState<PlanId>(initialPlan);
  const [cycle, setCycle] = useState<Cycle>(initialCycle);
  const [form, setForm] = useState({ name: "", email: "", phone: "", card: "", expiry: "", cvc: "", promo: "", terms: false });
  const [promoApplied, setPromoApplied] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [paying, setPaying] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  const plan = planById(planId)!;
  const subtotal = planTotal(plan, cycle);
  const promo = promoApplied ? PROMO_CODES[promoApplied] : null;
  const discount = promo ? Math.round(subtotal * promo.percent) / 100 : 0;
  const total = subtotal - discount;

  const access = nowMs > 0 ? getAccess(state, new Date(nowMs)) : { kind: "none" as const };
  const currentPlan = access.kind === "member" ? planById(access.planId) : null;

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const applyPromo = () => {
    const code = form.promo.trim().toUpperCase();
    if (!code) return;
    if (PROMO_CODES[code]) {
      setPromoApplied(code);
      setErrors((e) => ({ ...e, promo: undefined }));
      toast.success(`${code} applied`, { description: PROMO_CODES[code].label });
    } else {
      setPromoApplied(null);
      setErrors((e) => ({ ...e, promo: "That code is not valid. Try PULSE10." }));
    }
  };

  const validate = (target: number): Errors => {
    const next: Errors = {};
    if (target === 1) {
      if (form.name.trim().length < 2) next.name = "Please enter your full name.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email address.";
    }
    if (target === 2) {
      const digits = form.card.replace(/\D/g, "");
      if (!luhn(digits)) next.card = "Enter a valid card number.";
      const m = form.expiry.match(/^(\d{2})\/(\d{2})$/);
      if (!m || Number(m[1]) < 1 || Number(m[1]) > 12) {
        next.expiry = "Use MM/YY.";
      } else {
        const exp = new Date(2000 + Number(m[2]), Number(m[1]), 1).getTime();
        if (exp <= Date.now()) next.expiry = "This card has expired.";
      }
      if (!/^\d{3,4}$/.test(form.cvc)) next.cvc = "3 or 4 digits.";
    }
    if (target === 3 && !form.terms) next.terms = "Please accept the terms to continue.";
    return next;
  };

  const next = () => {
    // Validate the step being left; the plan step has nothing to validate.
    const result = step === 0 ? {} : validate(step);
    setErrors(result);
    if (Object.keys(result).length) return;
    setStep((s) => Math.min(s + 1, 3));
  };

  const pay = async () => {
    const result = validate(3);
    setErrors(result);
    if (Object.keys(result).length) return;
    setPaying(true);
    await new Promise((r) => setTimeout(r, 1400));
    const created = completeCheckout({
      planId,
      cycle,
      name: form.name.trim(),
      email: form.email.trim(),
      cardNumber: form.card,
      promo: promoApplied ?? undefined,
      subtotal,
      discount,
      total,
    });
    setPaying(false);
    setOrder(created);
    toast.success("Payment successful", { description: `Welcome to IRONPULSE ${plan.name}.` });
  };

  const planStep = (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold uppercase">Choose your plan</h2>
        <p className="mt-1 text-sm text-muted-foreground">You can change this later from your dashboard.</p>
      </div>
      <div role="radiogroup" aria-label="Billing cycle" className="inline-flex rounded-full border border-border bg-background p-1">
        {(["monthly", "annual"] as const).map((c) => (
          <button
            key={c}
            type="button"
            role="radio"
            aria-checked={cycle === c}
            onClick={() => setCycle(c)}
            className={cn(
              "h-9 rounded-full px-4 text-sm font-semibold transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              cycle === c ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {c === "monthly" ? "Monthly" : "Annual · save 20%"}
          </button>
        ))}
      </div>
      <div role="radiogroup" aria-label="Plan" className="grid gap-3">
        {PLANS.map((p) => {
          const selected = p.id === planId;
          return (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setPlanId(p.id)}
              className={cn(
                "flex items-center gap-4 rounded-2xl border p-4 text-left transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                selected ? "border-primary bg-primary/10" : "border-border bg-background hover:border-foreground/30",
              )}
            >
              <span
                className={cn(
                  "grid size-6 shrink-0 place-items-center rounded-full border",
                  selected ? "border-primary bg-primary text-primary-foreground" : "border-border",
                )}
              >
                {selected && <Check className="size-3.5" aria-hidden />}
              </span>
              <span className="flex-1">
                <span className="block font-display text-2xl font-bold uppercase leading-none">{p.name}</span>
                <span className="mt-1 block text-sm text-muted-foreground">{p.tagline}</span>
              </span>
              <span className="text-right">
                <span className="block font-display text-3xl font-extrabold leading-none">${planPrice(p, cycle)}</span>
                <span className="text-xs text-muted-foreground">/ month</span>
              </span>
            </button>
          );
        })}
      </div>
      {currentPlan && currentPlan.id !== planId && (
        <p className="rounded-2xl bg-secondary p-4 text-sm text-muted-foreground">
          You are currently on <strong className="text-foreground">{currentPlan.name}</strong>. Checking out will switch
          you to {plan.name}.
        </p>
      )}
    </div>
  );

  const detailsStep = (
    <div className="space-y-5">
      <div>
        <h2 className="text-3xl font-bold uppercase">Your details</h2>
        <p className="mt-1 text-sm text-muted-foreground">We will send your receipt and welcome pass here.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="co-name" label="Full name" autoComplete="name" value={form.name} error={errors.name} onChange={(e) => set("name", e.target.value)} className="sm:col-span-2" />
        <Field id="co-email" label="Email" type="email" autoComplete="email" value={form.email} error={errors.email} onChange={(e) => set("email", e.target.value)} />
        <Field id="co-phone" label="Phone (optional)" type="tel" autoComplete="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
      </div>
    </div>
  );

  const paymentStep = (
    <div className="space-y-5">
      <div>
        <h2 className="text-3xl font-bold uppercase">Payment</h2>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Lock className="size-3.5" aria-hidden /> Demo checkout. Use card 4242 4242 4242 4242, any future date and CVC.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id="co-card"
          label="Card number"
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder="4242 4242 4242 4242"
          value={form.card}
          error={errors.card}
          onChange={(e) => set("card", formatCard(e.target.value))}
          className="sm:col-span-2"
        />
        <Field id="co-exp" label="Expiry" inputMode="numeric" autoComplete="cc-exp" placeholder="MM/YY" value={form.expiry} error={errors.expiry} onChange={(e) => set("expiry", formatExpiry(e.target.value))} />
        <Field id="co-cvc" label="CVC" inputMode="numeric" autoComplete="cc-csc" placeholder="123" maxLength={4} value={form.cvc} error={errors.cvc} onChange={(e) => set("cvc", e.target.value.replace(/\D/g, ""))} />
      </div>
      <div className="flex items-end gap-3">
        <Field
          id="co-promo"
          label="Promo code"
          placeholder="PULSE10"
          value={form.promo}
          error={errors.promo}
          hint={promoApplied ? `${promoApplied} applied · ${PROMO_CODES[promoApplied].label}` : undefined}
          onChange={(e) => set("promo", e.target.value)}
          className="flex-1"
        />
        <Button variant="outline" onClick={applyPromo} className="mb-px">
          <TicketPercent className="size-4" aria-hidden /> Apply
        </Button>
      </div>
    </div>
  );

  const reviewStep = (
    <div className="space-y-5">
      <div>
        <h2 className="text-3xl font-bold uppercase">Review &amp; pay</h2>
        <p className="mt-1 text-sm text-muted-foreground">Check everything looks right before you pay.</p>
      </div>
      <dl className="divide-y divide-border rounded-2xl border border-border bg-background text-sm">
        {[
          ["Plan", `${plan.name} · ${cycle === "annual" ? "Annual" : "Monthly"}`],
          ["Name", form.name],
          ["Email", form.email],
          ["Card", `•••• ${form.card.replace(/\D/g, "").slice(-4)}`],
        ].map(([k, v]) => (
          <div key={k} className="flex items-center justify-between gap-4 px-4 py-3">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="font-medium">{v}</dd>
          </div>
        ))}
      </dl>
      <label className="flex cursor-pointer items-start gap-3 text-sm">
        <input
          type="checkbox"
          checked={form.terms}
          onChange={(e) => set("terms", e.target.checked)}
          aria-invalid={errors.terms ? true : undefined}
          aria-describedby={errors.terms ? "terms-error" : undefined}
          className="mt-0.5 size-4 accent-[var(--primary)]"
        />
        <span>
          I agree to the membership terms and understand my plan renews{" "}
          {cycle === "annual" ? "every year" : "every month"} until I cancel.
        </span>
      </label>
      {errors.terms && (
        <p id="terms-error" role="alert" className="text-xs text-destructive">
          {errors.terms}
        </p>
      )}
    </div>
  );

  const stepDefs: Step[] = [
    { id: "plan", title: "Plan", content: planStep },
    { id: "details", title: "Details", content: detailsStep },
    { id: "payment", title: "Payment", content: paymentStep },
    { id: "review", title: "Review", content: reviewStep },
  ];

  if (order) {
    return (
      <Container className="max-w-2xl py-16">
        <div className="rounded-3xl border border-primary/40 bg-card p-8 text-center sm:p-12">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-primary text-primary-foreground">
            <BadgeCheck className="size-9" aria-hidden />
          </div>
          <h1 className="mt-6 text-5xl font-extrabold uppercase">You&apos;re in, {order.name.split(" ")[0]}!</h1>
          <p className="mt-3 text-muted-foreground">
            Your {planById(order.planId)!.name} membership is active. A receipt is on its way to {order.email}.
          </p>
          <dl className="mx-auto mt-8 max-w-sm divide-y divide-border rounded-2xl border border-border text-left text-sm">
            {[
              ["Order", order.id],
              ["Plan", `${planById(order.planId)!.name} · ${order.cycle}`],
              ["Paid", money(order.total)],
              ["Date", formatFullDate(order.createdAt)],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 px-4 py-3">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <LinkButton href="/schedule" size="lg">
              <CalendarCheck className="size-4" aria-hidden /> Book your first class
            </LinkButton>
            <LinkButton href="/dashboard" size="lg" variant="outline">
              Go to dashboard
            </LinkButton>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-12">
      <div className="mx-auto mb-10 max-w-2xl">
        <Stepper
          steps={stepDefs.map(({ id, title }) => ({ id, title }))}
          currentStep={step}
          onStepChange={(i) => i < step && setStep(i)}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
          <StepperContent steps={stepDefs} currentStep={step} />
          <div className="mt-8 flex items-center justify-between gap-3">
            <Button variant="ghost" disabled={step === 0 || paying} onClick={() => setStep((s) => Math.max(0, s - 1))}>
              Back
            </Button>
            {step < 3 ? (
              <Button onClick={next} size="lg">
                Continue
              </Button>
            ) : (
              <Button onClick={pay} size="lg" disabled={paying} aria-busy={paying}>
                {paying ? (
                  <>
                    <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground motion-reduce:animate-none" />
                    Processing
                  </>
                ) : (
                  <>
                    <CreditCard className="size-4" aria-hidden /> Pay {money(total)}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        <aside aria-label="Order summary" className="h-fit rounded-3xl border border-border bg-card p-6 lg:sticky lg:top-24">
          <h2 className="text-2xl font-bold uppercase">Order summary</h2>
          <div className="mt-5 flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold">{plan.name} membership</p>
              <p className="text-sm text-muted-foreground">{cycle === "annual" ? "Billed annually" : "Billed monthly"}</p>
            </div>
            <p className="font-semibold">{money(subtotal)}</p>
          </div>
          {promo && (
            <div className="mt-3 flex items-center justify-between text-sm text-primary">
              <span>
                {promoApplied} (−{promo.percent}%)
              </span>
              <span>−{money(discount)}</span>
            </div>
          )}
          <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
            <span>Joining fee</span>
            <span>$0.00</span>
          </div>
          <div className="mt-5 flex items-end justify-between border-t border-border pt-5">
            <span className="text-sm text-muted-foreground">Due today</span>
            <span className="font-display text-5xl font-extrabold leading-none">{money(total)}</span>
          </div>
          <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
            {plan.highlights.slice(0, 4).map((h) => (
              <li key={h} className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden /> {h}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-muted-foreground">
            14-day money-back guarantee.{" "}
            <Link href="/contact" className="underline underline-offset-4">
              Need help?
            </Link>
          </p>
        </aside>
      </div>
    </Container>
  );
}
