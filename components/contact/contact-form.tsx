"use client";

import { useState } from "react";
import { CheckCircle2, Clock, Mail, MapPin, Phone } from "lucide-react";
import { toast } from "@/components/custom/blocks/sonner-store";
import { GYM } from "@/lib/gym-data";
import { Button, Container, Field } from "@/components/site/ui";
import { cn } from "@/lib/utils";

const TOPICS = ["Membership", "Classes", "Personal training", "Corporate", "Something else"];

type Errors = Partial<Record<"name" | "email" | "message", string>>;

export function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", topic: TOPICS[0], message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (values.name.trim().length < 2) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = "Enter a valid email address.";
    if (values.message.trim().length < 10) next.message = "Tell us a little more (10+ characters).";
    setErrors(next);
    if (Object.keys(next).length) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 900));
    setSending(false);
    setSent(true);
    toast.success("Message sent", { description: "We reply within one working day." });
  };

  return (
    <Container className="grid gap-10 py-12 lg:grid-cols-[1fr_420px]">
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
        {sent ? (
          <div className="flex flex-col items-center gap-4 py-10 text-center">
            <CheckCircle2 className="size-14 text-primary" aria-hidden />
            <h2 className="text-4xl font-extrabold uppercase">Thanks, {values.name.split(" ")[0]}!</h2>
            <p className="max-w-md text-muted-foreground">
              We got your message about <strong className="text-foreground">{values.topic.toLowerCase()}</strong> and will
              email {values.email} within one working day.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSent(false);
                setValues({ name: "", email: "", topic: TOPICS[0], message: "" });
              }}
            >
              Send another message
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="space-y-5">
            <h2 className="text-3xl font-bold uppercase">Send us a message</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="c-name" label="Name" autoComplete="name" value={values.name} error={errors.name} onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))} />
              <Field id="c-email" label="Email" type="email" autoComplete="email" value={values.email} error={errors.email} onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))} />
            </div>
            <fieldset>
              <legend className="mb-2 text-sm font-medium">What is this about?</legend>
              <div className="flex flex-wrap gap-2">
                {TOPICS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={values.topic === t}
                    onClick={() => setValues((v) => ({ ...v, topic: t }))}
                    className={cn(
                      "h-10 rounded-full border px-4 text-sm font-semibold transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      values.topic === t
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="c-message" className="text-sm font-medium">
                Message
              </label>
              <textarea
                id="c-message"
                rows={6}
                value={values.message}
                aria-invalid={errors.message ? true : undefined}
                aria-describedby={errors.message ? "c-message-error" : undefined}
                onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
                className={cn(
                  "rounded-xl border bg-background p-4 text-sm placeholder:text-muted-foreground/70",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  errors.message ? "border-destructive" : "border-input",
                )}
                placeholder="How can we help?"
              />
              {errors.message && (
                <p id="c-message-error" role="alert" className="text-xs text-destructive">
                  {errors.message}
                </p>
              )}
            </div>
            <Button type="submit" size="lg" disabled={sending} aria-busy={sending}>
              {sending ? "Sending…" : "Send message"}
            </Button>
          </form>
        )}
      </div>

      <aside className="space-y-6" aria-label="Gym details">
        <div className="rounded-3xl border border-border bg-card p-6">
          <h2 className="text-2xl font-bold uppercase">Visit us</h2>
          <ul className="mt-4 space-y-4 text-sm">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <span>
                {GYM.address.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <a href={`tel:${GYM.phone.replace(/[^+\d]/g, "")}`} className="hover:text-primary">
                {GYM.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <a href={`mailto:${GYM.email}`} className="hover:text-primary">
                {GYM.email}
              </a>
            </li>
          </ul>
        </div>
        <div className="rounded-3xl border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 text-2xl font-bold uppercase">
            <Clock className="size-5 text-primary" aria-hidden /> Opening hours
          </h2>
          <dl className="mt-4 divide-y divide-border text-sm">
            {GYM.hours.map((h) => (
              <div key={h.days} className="flex justify-between py-2.5">
                <dt className="text-muted-foreground">{h.days}</dt>
                <dd className="font-medium">{h.time}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-xs text-muted-foreground">Pro and Elite members have 24/7 access.</p>
        </div>
        <div className="overflow-hidden rounded-3xl border border-border bg-card" aria-hidden>
          <div className="relative grid h-48 place-items-center bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] bg-[size:28px_28px]">
            <div className="grid size-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg">
              <MapPin className="size-6" />
            </div>
          </div>
        </div>
      </aside>
    </Container>
  );
}
