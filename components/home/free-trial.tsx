"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarCheck, Check, Gift, Timer } from "lucide-react";
import { toast } from "@/components/custom/blocks/sonner-store";
import { ensureOffer, getAccess, startTrial, TRIAL_CLASS_LIMIT, TRIAL_DAYS, useGymState } from "@/lib/gym-store";
import { useNowSecond } from "@/lib/time";
import { Button, Container, Field, LinkButton } from "@/components/site/ui";
import { cn } from "@/lib/utils";

const pad = (n: number) => String(n).padStart(2, "0");

function Countdown({ endsAt, nowMs }: { endsAt: string | null; nowMs: number }) {
  const ready = !!endsAt && nowMs > 0;
  const remaining = ready ? Math.max(0, new Date(endsAt!).getTime() - nowMs) : 0;
  const total = Math.floor(remaining / 1000);
  const parts = [
    { label: "Days", value: Math.floor(total / 86400) },
    { label: "Hours", value: Math.floor((total % 86400) / 3600) },
    { label: "Minutes", value: Math.floor((total % 3600) / 60) },
    { label: "Seconds", value: total % 60 },
  ];
  return (
    <div role="timer" aria-label="Time left on this offer" className="grid grid-cols-4 gap-3">
      {parts.map((p) => (
        <div key={p.label} className="rounded-2xl border border-border bg-background/60 px-2 py-4 text-center backdrop-blur">
          <div className="font-display text-4xl font-extrabold tabular-nums sm:text-5xl" aria-hidden={!ready}>
            {ready ? pad(p.value) : "--"}
          </div>
          <div className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{p.label}</div>
        </div>
      ))}
    </div>
  );
}

export function FreeTrial() {
  const state = useGymState();
  const nowMs = useNowSecond();
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [values, setValues] = useState({ name: "", email: "" });

  useEffect(() => {
    ensureOffer(new Date());
  }, []);

  const access = nowMs > 0 ? getAccess(state, new Date(nowMs)) : { kind: "none" as const };
  const isMember = access.kind === "member";
  const hasTrial = access.kind === "trial";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (values.name.trim().length < 2) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = "Enter a valid email address.";
    setErrors(next);
    if (Object.keys(next).length) return;
    startTrial({ name: values.name.trim(), email: values.email.trim() });
    toast.success("Your free week starts now", {
      description: `You can book up to ${TRIAL_CLASS_LIMIT} classes. Pick one from the schedule.`,
    });
  };

  return (
    <section id="free-trial" className="relative isolate overflow-hidden border-y border-border py-20 sm:py-28">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_80%_20%,color-mix(in_oklab,var(--primary)_22%,transparent),transparent_70%)]"
      />
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            <Gift className="size-3.5" aria-hidden /> Limited offer
          </p>
          <h2 className="text-5xl font-extrabold uppercase leading-[0.92] sm:text-6xl">
            Try IRONPULSE
            <br />
            free for {TRIAL_DAYS} days
          </h2>
          <p className="mt-5 max-w-lg text-lg text-muted-foreground">
            Unlimited floor access and up to {TRIAL_CLASS_LIMIT} coached classes. No card needed, no pressure.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            {["Full gym floor and locker access", `Book ${TRIAL_CLASS_LIMIT} classes of your choice`, "Meet a coach for a free movement check"].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="grid size-5 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Check className="size-3" aria-hidden />
                </span>
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <p className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Timer className="size-4 text-primary" aria-hidden /> Offer ends in
            </p>
            <Countdown endsAt={state.offerEndsAt} nowMs={nowMs} />
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          {isMember ? (
            <div className="space-y-4 text-center">
              <CalendarCheck className="mx-auto size-10 text-primary" aria-hidden />
              <h3 className="text-3xl font-bold uppercase">You are already a member</h3>
              <p className="text-muted-foreground">No trial needed. Pick your next class.</p>
              <LinkButton href="/schedule">Open schedule</LinkButton>
            </div>
          ) : hasTrial ? (
            <div className="space-y-4 text-center">
              <div className="mx-auto grid size-14 place-items-center rounded-full bg-primary text-primary-foreground">
                <Check className="size-7" aria-hidden />
              </div>
              <h3 className="text-3xl font-bold uppercase">Your trial is live</h3>
              <p className="text-muted-foreground">
                {state.trial?.name?.split(" ")[0]}, you have {TRIAL_CLASS_LIMIT} classes to use before it ends. Book your first one now.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <LinkButton href="/schedule">Book a class</LinkButton>
                <LinkButton href="/dashboard" variant="outline">
                  View dashboard
                </LinkButton>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="space-y-5">
              <div>
                <h3 className="text-3xl font-bold uppercase">Claim your free week</h3>
                <p className="mt-1 text-sm text-muted-foreground">Takes 20 seconds. We will email your pass.</p>
              </div>
              <Field
                id="trial-name"
                label="Full name"
                autoComplete="name"
                placeholder="Alex Morgan"
                value={values.name}
                error={errors.name}
                onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
              />
              <Field
                id="trial-email"
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={values.email}
                error={errors.email}
                onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
              />
              <Button type="submit" size="lg" className={cn("w-full")}>
                Start my free trial
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                By continuing you agree to our{" "}
                <Link href="/contact" className="underline underline-offset-4">
                  terms
                </Link>
                . One trial per person.
              </p>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}
