"use client";

import { useId, useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { PACKAGES } from "@/lib/travel-data";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const input =
  "h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-3 aria-[invalid=true]:ring-destructive/20";

function Field({ label, error, children }: { label: string; error?: string; children: (p: { id: string; "aria-invalid": boolean; "aria-describedby"?: string }) => React.ReactNode }) {
  const id = useId();
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      {children({ id, "aria-invalid": !!error, "aria-describedby": error ? `${id}-err` : undefined })}
      {error && <p id={`${id}-err`} role="alert" className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", topic: "plan", trip: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: "" }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (values.name.trim().length < 2) er.name = "Please tell us your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email)) er.email = "Enter a valid email address.";
    if (values.message.trim().length < 15) er.message = "A few more words, please (at least 15 characters).";
    setErrors(er);
    if (Object.keys(er).length) {
      requestAnimationFrame(() => document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    setSending(false);
    setSentTo(values.email);
  };

  if (sentTo) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-border bg-card p-10 text-center" role="status">
        <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary"><CheckCircle2 className="size-8" /></span>
        <h2 className="mt-5 text-2xl font-semibold">Message sent</h2>
        <p className="mt-2 max-w-sm text-muted-foreground">Thanks, {values.name.split(" ")[0]}. A planner will reply to <strong className="text-foreground">{sentTo}</strong> within one working day.</p>
        <button
          type="button"
          onClick={() => { setSentTo(null); setValues({ name: "", email: "", topic: "plan", trip: "", message: "" }); }}
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "mt-6 h-10 rounded-full px-5")}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-5 rounded-3xl border border-border bg-card p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" error={errors.name}>{(p) => <input {...p} className={input} value={values.name} onChange={set("name")} autoComplete="name" />}</Field>
        <Field label="Email" error={errors.email}>{(p) => <input {...p} type="email" className={input} value={values.email} onChange={set("email")} autoComplete="email" />}</Field>
        <Field label="I would like to">
          {(p) => (
            <select {...p} className={input} value={values.topic} onChange={set("topic")}>
              <option value="plan">Plan a trip</option>
              <option value="custom">Request a private or custom trip</option>
              <option value="booking">Ask about an existing booking</option>
              <option value="other">Something else</option>
            </select>
          )}
        </Field>
        <Field label="Trip you are interested in">
          {(p) => (
            <select {...p} className={input} value={values.trip} onChange={set("trip")}>
              <option value="">Not sure yet</option>
              {PACKAGES.map((pkg) => <option key={pkg.slug} value={pkg.slug}>{pkg.title}</option>)}
            </select>
          )}
        </Field>
      </div>
      <Field label="How can we help?" error={errors.message}>
        {(p) => <textarea {...p} rows={6} className={cn(input, "h-auto py-3")} value={values.message} onChange={set("message")} placeholder="Dates, group size, what you love doing…" />}
      </Field>
      <button type="submit" disabled={sending} className={cn(buttonVariants({ size: "lg" }), "h-12 rounded-full text-base sm:w-fit sm:px-8")}>
        <Send className="size-4" /> {sending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
