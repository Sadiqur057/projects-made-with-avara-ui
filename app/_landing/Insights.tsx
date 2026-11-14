"use client";

import Link from "next/link";
import { ArrowRight, Lightbulb, TrendingDown, TriangleAlert } from "lucide-react";
import { Card } from "@/components/custom/blocks/CardBlock";
import { ChartBlock } from "@/components/custom/blocks/ChartBlock";
import {
  CURRENT_MONTH,
  SEED_STATE,
  budgetStatus,
  inMonth,
  money,
  monthlyTotals,
  spendingByCategory,
  sumBy,
} from "@/lib/finance";

const DONUT_COLORS = ["primary", "blue", "amber", "rose", "indigo", "emerald", "zinc"];
const tx = SEED_STATE.transactions;
const months = monthlyTotals(tx, 6);
const categories = spendingByCategory(tx, CURRENT_MONTH);
const month = inMonth(tx, CURRENT_MONTH);
const income = sumBy(month, "income");
const expenses = sumBy(month, "expense");
const over = SEED_STATE.budgets
  .map((b) => ({ b, s: budgetStatus(b, tx) }))
  .filter(({ s }) => s.status === "over")
  .sort((a, z) => z.s.ratio - a.s.ratio)[0];
const topCategory = categories[0];

type Insight = { icon: React.ComponentType<{ className?: string }>; title: string; text: string };

const INSIGHTS: Insight[] = [];
if (over) {
  INSIGHTS.push({
    icon: TriangleAlert,
    title: `${over.b.category} is ${money(Math.abs(over.s.remaining))} over budget`,
    text: "Spot overspending the day it happens, not at month end.",
  });
}
if (topCategory) {
  INSIGHTS.push({
    icon: Lightbulb,
    title: `${topCategory.label} is your biggest category`,
    text: `${Math.round((topCategory.value / expenses) * 100)}% of this month's spending so far.`,
  });
}
INSIGHTS.push({
  icon: TrendingDown,
  title: `You have kept ${Math.round(((income - expenses) / income) * 100)}% of your income`,
  text: "Savings rate updates with every transaction you log.",
});

export function Insights() {
  return (
    <section id="insights" className="scroll-mt-24 bg-muted/40 py-20 sm:py-28">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-16">
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Spending insights</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Charts that answer &ldquo;where did it all go?&rdquo;
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Ledgerly turns raw transactions into a clear picture: what you spend, where it concentrates and how it moves
            month to month.
          </p>
          <ul className="mt-8 space-y-5">
            {INSIGHTS.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">{title}</p>
                  <p className="text-sm text-muted-foreground">{text}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link
            href="/dashboard"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
          >
            Explore the live dashboard <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>

        <div className="min-w-0 space-y-4">
          <Card variant="default" className="p-5">
            <p className="text-sm font-semibold text-foreground">Monthly spending</p>
            <p className="mb-4 text-xs text-muted-foreground">Sample data · last 6 months</p>
            <ChartBlock
              data={months.map((m) => ({ label: m.label, value: m.expenses }))}
              type="bar"
              valuePrefix="$"
              height={200}
            />
          </Card>
          <Card variant="default" className="p-5">
            <p className="text-sm font-semibold text-foreground">Spending by category</p>
            <p className="mb-4 text-xs text-muted-foreground">Sample data · this month</p>
            <ChartBlock data={categories} type="donut-legend" valuePrefix="$" colors={DONUT_COLORS} centerLabel="top category" hoverLabel="spent" />
          </Card>
        </div>
      </div>
    </section>
  );
}
