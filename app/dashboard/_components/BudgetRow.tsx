"use client";

import type { Budget, Transaction } from "@/lib/finance";
import { budgetStatus, money, moneyRound } from "@/lib/finance";
import { ProgressBar, StatusPill } from "./shared";

/** Compact budget line: used on the overview. The Budgets page has its own card. */
export function BudgetRow({ budget, transactions }: { budget: Budget; transactions: Transaction[] }) {
  const { spent, ratio, status, remaining } = budgetStatus(budget, transactions);
  return (
    <li className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <p className="min-w-0 truncate text-sm font-medium text-foreground">{budget.category}</p>
        <p className="shrink-0 text-sm tabular-nums text-muted-foreground">
          <span className="font-medium text-foreground">{moneyRound(spent)}</span> / {moneyRound(budget.limit)}
        </p>
      </div>
      <ProgressBar ratio={ratio} status={status} label={`${budget.category} budget used`} />
      <div className="flex items-center justify-between gap-2">
        <StatusPill status={status} ratio={ratio} />
        <p className="text-xs tabular-nums text-muted-foreground">
          {remaining >= 0 ? `${money(remaining)} left` : `${money(Math.abs(remaining))} over`}
        </p>
      </div>
    </li>
  );
}
