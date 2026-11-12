"use client";

import { useState } from "react";
import { Check, Minus, Sparkles } from "lucide-react";
import { COMPARISON, PLANS, planPrice, type Cycle, type PlanId } from "@/lib/gym-data";
import { getAccess, useGymState } from "@/lib/gym-store";
import { useNow } from "@/lib/time";
import { Badge, Container, LinkButton, SectionHeading } from "@/components/site/ui";
import { cn } from "@/lib/utils";

function Cell({ value }: { value: boolean | string }) {
  if (value === true) {
    return (
      <span className="inline-flex items-center justify-center" role="img" aria-label="Included">
        <Check className="size-5 text-primary" />
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="inline-flex items-center justify-center" role="img" aria-label="Not included">
        <Minus className="size-5 text-muted-foreground/50" />
      </span>
    );
  }
  return <span className="text-sm font-semibold">{value}</span>;
}

const allEqual = (values: Record<PlanId, boolean | string>) => {
  const v = Object.values(values);
  return v.every((x) => x === v[0]);
};

export function MembershipPlans() {
  const state = useGymState();
  const nowMs = useNow();
  const [cycle, setCycle] = useState<Cycle>("annual");
  const [diffOnly, setDiffOnly] = useState(false);
  const [focus, setFocus] = useState<PlanId>("pro");

  const access = nowMs > 0 ? getAccess(state, new Date(nowMs)) : { kind: "none" as const };
  const currentPlan = access.kind === "member" ? access.planId : null;

  return (
    <>
      <Container className="py-12">
        <div className="flex flex-col items-center gap-6">
          <div
            role="radiogroup"
            aria-label="Billing cycle"
            className="inline-flex rounded-full border border-border bg-card p-1"
          >
            {(["monthly", "annual"] as const).map((c) => (
              <button
                key={c}
                type="button"
                role="radio"
                aria-checked={cycle === c}
                onClick={() => setCycle(c)}
                className={cn(
                  "h-10 rounded-full px-5 text-sm font-semibold transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  cycle === c ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {c === "monthly" ? "Monthly" : "Annual"}
                {c === "annual" && <span className="ml-2 text-xs opacity-80">save 20%</span>}
              </button>
            ))}
          </div>

          <ul className="grid w-full gap-6 lg:grid-cols-3">
            {PLANS.map((plan) => {
              const isCurrent = currentPlan === plan.id;
              const price = planPrice(plan, cycle);
              return (
                <li
                  key={plan.id}
                  className={cn(
                    "relative flex flex-col rounded-3xl border bg-card p-7",
                    plan.popular ? "border-primary shadow-[0_0_0_1px_var(--primary)]" : "border-border",
                  )}
                >
                  {plan.popular && (
                    <Badge tone="primary" className="absolute -top-3 left-7 bg-primary text-primary-foreground">
                      <Sparkles className="size-3" aria-hidden /> Most popular
                    </Badge>
                  )}
                  <h2 className="font-display text-4xl font-bold uppercase">{plan.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>
                  <p className="mt-6 flex items-baseline gap-1">
                    <span className="font-display text-6xl font-extrabold">${price}</span>
                    <span className="text-sm text-muted-foreground">/ month</span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {cycle === "annual" ? `Billed $${price * 12} once a year` : "Billed monthly, cancel anytime"}
                  </p>
                  <ul className="mt-6 flex-1 space-y-3 text-sm">
                    {plan.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-3">
                        <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                        {h}
                      </li>
                    ))}
                  </ul>
                  {isCurrent ? (
                    <p className="mt-8 rounded-full border border-primary/40 bg-primary/10 py-3 text-center text-sm font-semibold text-primary">
                      Your current plan
                    </p>
                  ) : (
                    <LinkButton
                      href={`/membership/checkout?plan=${plan.id}&cycle=${cycle}`}
                      variant={plan.popular ? "primary" : "outline"}
                      size="lg"
                      className="mt-8 w-full"
                    >
                      {currentPlan ? "Switch to" : "Choose"} {plan.name}
                    </LinkButton>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </Container>

      <section id="compare" className="scroll-mt-24 border-t border-border bg-card/30 py-20">
        <Container>
          <SectionHeading
            eyebrow="Compare plans"
            title="Everything side by side"
            description="Highlight a plan to see how it stacks up, or hide the rows that are the same on every plan."
          />

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div role="radiogroup" aria-label="Highlight a plan" className="inline-flex rounded-full border border-border bg-card p-1">
              {PLANS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={focus === p.id}
                  onClick={() => setFocus(p.id)}
                  className={cn(
                    "h-9 rounded-full px-4 text-sm font-semibold transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    focus === p.id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {p.name}
                </button>
              ))}
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={diffOnly}
                onChange={(e) => setDiffOnly(e.target.checked)}
                className="size-4 accent-[var(--primary)]"
              />
              Show differences only
            </label>
          </div>

          <div className="mt-6 overflow-x-auto rounded-3xl border border-border bg-card">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <caption className="sr-only">Feature comparison between Starter, Pro and Elite memberships</caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="w-1/3 p-5 text-sm font-semibold text-muted-foreground">
                    Feature
                  </th>
                  {PLANS.map((p) => (
                    <th
                      key={p.id}
                      scope="col"
                      className={cn("p-5 text-center", focus === p.id && "bg-primary/10")}
                    >
                      <p className="font-display text-2xl font-bold uppercase">{p.name}</p>
                      <p className="text-xs font-normal text-muted-foreground">${planPrice(p, cycle)}/mo</p>
                    </th>
                  ))}
                </tr>
              </thead>
              {COMPARISON.map((group) => {
                const rows = group.rows.filter((r) => !diffOnly || !allEqual(r.values));
                if (rows.length === 0) return null;
                return (
                  <tbody key={group.title}>
                    <tr>
                      <th
                        scope="colgroup"
                        colSpan={4}
                        className="bg-secondary/60 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                      >
                        {group.title}
                      </th>
                    </tr>
                    {rows.map((row) => (
                      <tr key={row.label} className="border-b border-border last:border-b-0">
                        <th scope="row" className="p-5 text-sm font-medium">
                          {row.label}
                          {row.hint && <span className="block text-xs font-normal text-muted-foreground">{row.hint}</span>}
                        </th>
                        {PLANS.map((p) => (
                          <td key={p.id} className={cn("p-5 text-center", focus === p.id && "bg-primary/10")}>
                            <Cell value={row.values[p.id]} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                );
              })}
              <tfoot>
                <tr>
                  <td />
                  {PLANS.map((p) => (
                    <td key={p.id} className={cn("p-5 text-center", focus === p.id && "bg-primary/10")}>
                      <LinkButton
                        href={`/membership/checkout?plan=${p.id}&cycle=${cycle}`}
                        size="sm"
                        variant={focus === p.id ? "primary" : "outline"}
                      >
                        Choose {p.name}
                      </LinkButton>
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
        </Container>
      </section>
    </>
  );
}
