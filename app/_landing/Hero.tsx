"use client";

import { CreditCard, Landmark, PiggyBank, Wallet } from "lucide-react";
import { SupportHero } from "@/components/custom/blocks/SupportHeroBlock";
import { SEED_STATE, budgetStatus, monthlyTotals, moneyRound } from "@/lib/finance";
import { ProgressBar } from "@/app/dashboard/_components/shared";

const food = SEED_STATE.budgets.find((b) => b.category === "Food")!;
const foodStatus = budgetStatus(food, SEED_STATE.transactions);
const months = monthlyTotals(SEED_STATE.transactions, 6);
const maxExpense = Math.max(...months.map((m) => m.expenses));

export function Hero() {
  return (
    <section id="top" className="relative scroll-mt-24 pt-4">
      <SupportHero
        heading="Know exactly where every dollar goes"
        subtitle="Ledgerly tracks your transactions, keeps category budgets honest and shows your spending trends, all in one calm dashboard."
        cta={{ label: "Open the dashboard", href: "/dashboard" }}
      >
        <SupportHero.Integrations
          className="lg:col-span-4"
          icons={[
            <Landmark key="bank" className="size-6" />,
            <CreditCard key="card" className="size-6" />,
            <Wallet key="wallet" className="size-6" />,
          ]}
          title="Every account"
          text="Log cash, cards and transfers in seconds."
        />
        <SupportHero.Stat
          className="lg:col-span-4"
          tone="accent"
          value={38}
          suffix="%"
          caption="less overspending after three months (sample figure)"
        />
        <SupportHero.Stat
          className="lg:col-span-4"
          value={4.2}
          decimals={1}
          prefix="$"
          suffix="k"
          caption="typical yearly savings uncovered (sample figure)"
        />

        <SupportHero.Card className="flex flex-col justify-between p-5 md:col-span-6 lg:col-span-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">Food budget</p>
              <p className="text-xs text-muted-foreground">November so far</p>
            </div>
            <span className="shrink-0 rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-semibold text-destructive">
              Over by {moneyRound(Math.abs(foodStatus.remaining))}
            </span>
          </div>
          <div>
            <p className="text-3xl font-semibold tabular-nums text-foreground">
              {moneyRound(foodStatus.spent)}{" "}
              <span className="text-sm font-normal text-muted-foreground">/ {moneyRound(food.limit)}</span>
            </p>
            <ProgressBar className="mt-3" ratio={foodStatus.ratio} status={foodStatus.status} label="Sample food budget used" />
          </div>
        </SupportHero.Card>

        <SupportHero.Card className="flex flex-col justify-between p-5 md:col-span-6 lg:col-span-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-foreground">Spending, last 6 months</p>
            <PiggyBank className="size-4 shrink-0 text-primary" aria-hidden />
          </div>
          <div className="flex h-24 items-end gap-2 sm:gap-3" role="img" aria-label="Bar chart of monthly spending over six months">
            {months.map((m, i) => (
              <div key={m.key} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1">
                <div
                  className={i === months.length - 1 ? "w-full rounded-t-md bg-primary" : "w-full rounded-t-md bg-primary/35"}
                  style={{ height: `${Math.max(8, (m.expenses / maxExpense) * 75)}%` }}
                />
                <span className="text-[10px] text-muted-foreground">{m.label}</span>
              </div>
            ))}
          </div>
        </SupportHero.Card>
      </SupportHero>
    </section>
  );
}
