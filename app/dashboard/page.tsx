"use client";

import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, OctagonAlert, PiggyBank, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/custom/blocks/CardBlock";
import { ChartBlock } from "@/components/custom/blocks/ChartBlock";
import {
  CURRENT_MONTH,
  budgetStatus,
  formatDate,
  inMonth,
  money,
  monthLabel,
  monthlyTotals,
  spendingByCategory,
  sumBy,
  useFinance,
} from "@/lib/finance";
import { cn } from "@/lib/utils";
import { BudgetRow } from "./_components/BudgetRow";
import { EmptyState, PageHeading, amountText } from "./_components/shared";
import { useDashboardActions } from "./_components/DashboardShell";

const DONUT_COLORS = ["primary", "blue", "amber", "rose", "indigo", "emerald", "zinc"];

function StatCard({
  label,
  value,
  note,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string;
  note: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "default" | "good" | "bad";
}) {
  return (
    <Card variant="default" className="p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4" />
        </span>
      </div>
      <p
        className={cn(
          "mt-3 truncate text-2xl font-semibold tabular-nums tracking-tight sm:text-3xl",
          tone === "bad" ? "text-destructive" : "text-foreground",
        )}
      >
        {value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{note}</p>
    </Card>
  );
}

export default function OverviewPage() {
  const { transactions, budgets } = useFinance();
  const { openAddTransaction } = useDashboardActions();

  const month = inMonth(transactions, CURRENT_MONTH);
  const income = sumBy(month, "income");
  const expenses = sumBy(month, "expense");
  const net = income - expenses;
  const savingsRate = income > 0 ? Math.round((net / income) * 100) : 0;

  const months = monthlyTotals(transactions, 6);
  const prev = months[months.length - 2];
  const delta = prev && prev.expenses > 0 ? Math.round(((expenses - prev.expenses) / prev.expenses) * 100) : null;

  const categories = spendingByCategory(transactions, CURRENT_MONTH);
  const statuses = budgets.map((b) => ({ b, s: budgetStatus(b, transactions) })).sort((a, z) => z.s.ratio - a.s.ratio);
  const overCount = statuses.filter(({ s }) => s.status === "over").length;
  const warnCount = statuses.filter(({ s }) => s.status === "warning").length;
  const recent = [...transactions].sort((a, z) => z.date.localeCompare(a.date)).slice(0, 6);

  return (
    <>
      <PageHeading
        title="Overview"
        description={`${monthLabel(CURRENT_MONTH)} 2026 · here is how your money moved this month.`}
      />

      {(overCount > 0 || warnCount > 0) && (
        <div
          role="alert"
          className={cn(
            "flex items-start gap-3 rounded-xl border p-4 text-sm",
            overCount > 0
              ? "border-destructive/30 bg-destructive/10 text-destructive"
              : "border-warning/40 bg-warning/15 text-warning-foreground",
          )}
        >
          <OctagonAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          <p className="min-w-0">
            <span className="font-semibold">
              {overCount > 0
                ? `${overCount} ${overCount === 1 ? "category is" : "categories are"} over budget`
                : `${warnCount} ${warnCount === 1 ? "category is" : "categories are"} close to its limit`}
            </span>
            {overCount > 0 && warnCount > 0 && <> and {warnCount} more near the limit</>}.{" "}
            <Link href="/dashboard/budgets" className="font-medium underline underline-offset-4">
              Review budgets
            </Link>
          </p>
        </div>
      )}

      <section aria-label="Month summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Net this month" value={money(net)} note={net >= 0 ? "Income minus spending" : "Spending exceeds income"} icon={PiggyBank} tone={net < 0 ? "bad" : "default"} />
        <StatCard label="Income" value={money(income)} note={`${month.filter((t) => t.type === "income").length} deposits`} icon={TrendingUp} />
        <StatCard
          label="Spending"
          value={money(expenses)}
          note={delta === null ? "No data for last month" : `${delta >= 0 ? "Up" : "Down"} ${Math.abs(delta)}% vs ${prev?.label ?? "last month"}`}
          icon={TrendingDown}
        />
        <StatCard label="Savings rate" value={`${savingsRate}%`} note="Share of income kept" icon={savingsRate >= 0 ? ArrowUpRight : ArrowDownRight} tone={savingsRate < 0 ? "bad" : "default"} />
      </section>

      <section aria-label="Charts" className="grid gap-4 lg:grid-cols-5">
        <Card variant="default" className="min-w-0 lg:col-span-3">
          <CardHeader>
            <CardTitle>Monthly spending</CardTitle>
            <CardDescription>Total expenses over the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartBlock data={months.map((m) => ({ label: m.label, value: m.expenses }))} type="bar" valuePrefix="$" height={280} />
          </CardContent>
        </Card>

        <Card variant="default" className="min-w-0 lg:col-span-2">
          <CardHeader>
            <CardTitle>Spending by category</CardTitle>
            <CardDescription>{monthLabel(CURRENT_MONTH)} so far.</CardDescription>
          </CardHeader>
          <CardContent>
            {categories.length > 0 ? (
              <ChartBlock data={categories} type="donut-legend" valuePrefix="$" colors={DONUT_COLORS} centerLabel="top category" hoverLabel="spent" />
            ) : (
              <EmptyState title="No spending yet" text="Add an expense to see your category breakdown." />
            )}
          </CardContent>
        </Card>
      </section>

      <section aria-label="Budgets and transactions" className="grid gap-4 lg:grid-cols-5">
        <Card variant="default" className="min-w-0 lg:col-span-2">
          <CardHeader>
            <CardTitle>Budget progress</CardTitle>
            <CardDescription>Closest to the limit first.</CardDescription>
          </CardHeader>
          <CardContent>
            {statuses.length > 0 ? (
              <ul className="space-y-5">
                {statuses.slice(0, 4).map(({ b }) => (
                  <BudgetRow key={b.id} budget={b} transactions={transactions} />
                ))}
              </ul>
            ) : (
              <EmptyState
                title="No budgets yet"
                text="Create a category budget to track your limits."
                action={
                  <Link href="/dashboard/budgets" className="text-sm font-medium text-primary underline underline-offset-4">
                    Set up budgets
                  </Link>
                }
              />
            )}
            {statuses.length > 4 && (
              <Link href="/dashboard/budgets" className="mt-5 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline">
                See all {statuses.length} budgets
              </Link>
            )}
          </CardContent>
        </Card>

        <Card variant="default" className="min-w-0 lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent transactions</CardTitle>
            <CardDescription>
              Your latest activity.{" "}
              <Link href="/dashboard/transactions" className="font-medium text-primary underline-offset-4 hover:underline">
                View all
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recent.length > 0 ? (
              <ul className="divide-y divide-border">
                {recent.map((t) => (
                  <li key={t.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{t.description}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {t.category} · {formatDate(t.date)}
                      </p>
                    </div>
                    <p className={cn("shrink-0 text-sm font-semibold tabular-nums", t.type === "income" ? "text-success" : "text-foreground")}>
                      {amountText(t.amount, t.type)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                title="No transactions"
                text="Nothing logged yet."
                action={
                  <button type="button" onClick={openAddTransaction} className="text-sm font-medium text-primary underline underline-offset-4">
                    Add your first transaction
                  </button>
                }
              />
            )}
          </CardContent>
        </Card>
      </section>

    </>
  );
}
