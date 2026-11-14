"use client";

import { useState } from "react";
import { OctagonAlert, Pencil, Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/custom/blocks/CardBlock";
import {
  EXPENSE_CATEGORIES,
  budgetStatus,
  deleteBudget,
  money,
  moneyRound,
  useFinance,
  type Budget,
} from "@/lib/finance";
import { cn } from "@/lib/utils";
import { BudgetDialog, type BudgetDraft } from "../_components/BudgetDialog";
import { EmptyState, PageHeading, ProgressBar, StatusPill, primaryBtnCls } from "../_components/shared";

const iconBtn =
  "grid size-8 place-items-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60";

export default function BudgetsPage() {
  const { transactions, budgets } = useFinance();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [draft, setDraft] = useState<BudgetDraft | null>(null);
  const [announce, setAnnounce] = useState("");

  const rows = budgets
    .map((b) => ({ b, s: budgetStatus(b, transactions) }))
    .sort((a, z) => z.s.ratio - a.s.ratio);

  const totalLimit = budgets.reduce((a, b) => a + b.limit, 0);
  const totalSpent = rows.reduce((a, { s }) => a + s.spent, 0);
  const overRows = rows.filter(({ s }) => s.status === "over");
  const taken = budgets.map((b) => b.category);
  const allTaken = EXPENSE_CATEGORIES.every((c) => taken.includes(c));

  const openNew = () => {
    setDraft(null);
    setDialogOpen(true);
  };
  const openEdit = (b: Budget) => {
    setDraft({ category: b.category, limit: b.limit });
    setDialogOpen(true);
  };

  return (
    <>
      <PageHeading
        title="Budgets"
        description="Monthly limits per category. Bars turn amber near the limit and red once you overspend."
        action={
          <button
            type="button"
            onClick={openNew}
            disabled={allTaken}
            title={allTaken ? "Every category already has a budget" : undefined}
            className={primaryBtnCls}
          >
            <Plus className="size-4" aria-hidden /> Add budget
          </button>
        }
      />

      {overRows.length > 0 && (
        <div role="alert" className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <OctagonAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          <p className="min-w-0">
            <span className="font-semibold">
              Overspending in {overRows.map(({ b }) => b.category).join(", ")}.
            </span>{" "}
            You are {money(overRows.reduce((a, { s }) => a + Math.abs(s.remaining), 0))} past {overRows.length === 1 ? "that limit" : "those limits"} this month.
          </p>
        </div>
      )}

      {rows.length > 0 && (
        <Card variant="default" className="p-5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total budgeted spending</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
                {moneyRound(totalSpent)} <span className="text-base font-normal text-muted-foreground">of {moneyRound(totalLimit)}</span>
              </p>
            </div>
            <p className="text-sm tabular-nums text-muted-foreground">
              {totalLimit - totalSpent >= 0 ? `${money(totalLimit - totalSpent)} left in total` : `${money(totalSpent - totalLimit)} over in total`}
            </p>
          </div>
          <ProgressBar
            className="mt-4"
            ratio={totalLimit ? totalSpent / totalLimit : 0}
            status={totalSpent > totalLimit ? "over" : totalSpent / totalLimit >= 0.85 ? "warning" : "ok"}
            label="Total budget used"
          />
        </Card>
      )}

      {rows.length === 0 ? (
        <EmptyState
          title="No budgets yet"
          text="Add a monthly limit for a category like Food or Shopping to start tracking."
          action={
            <button type="button" onClick={openNew} className={primaryBtnCls}>
              <Plus className="size-4" aria-hidden /> Add your first budget
            </button>
          }
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map(({ b, s }) => (
            <li key={b.id} data-testid="budget-card" data-status={s.status} className="min-w-0">
              <Card
                variant="default"
                className={cn("h-full p-5", s.status === "over" && "border-destructive/50 ring-1 ring-destructive/20")}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-foreground">{b.category}</h3>
                    <p className="text-xs text-muted-foreground">Monthly limit {moneyRound(b.limit)}</p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button type="button" className={iconBtn} aria-label={`Edit ${b.category} budget`} onClick={() => openEdit(b)}>
                      <Pencil className="size-4" aria-hidden />
                    </button>
                    <button
                      type="button"
                      className={cn(iconBtn, "hover:bg-destructive/10 hover:text-destructive")}
                      aria-label={`Delete ${b.category} budget`}
                      onClick={() => {
                        deleteBudget(b.id);
                        setAnnounce(`Deleted ${b.category} budget`);
                      }}
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </button>
                  </div>
                </div>

                <p className="mt-4 text-2xl font-semibold tabular-nums text-foreground">{money(s.spent)}</p>
                <ProgressBar className="mt-3" ratio={s.ratio} status={s.status} label={`${b.category} budget used`} />

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <StatusPill status={s.status} ratio={s.ratio} />
                  <p className={cn("text-xs font-medium tabular-nums", s.status === "over" ? "text-destructive" : "text-muted-foreground")}>
                    {s.remaining >= 0 ? `${money(s.remaining)} left` : `Over by ${money(Math.abs(s.remaining))}`}
                  </p>
                </div>

                {s.status === "over" && (
                  <p className="mt-3 rounded-lg bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
                    Overspend warning: you have passed your {b.category} limit this month.
                  </p>
                )}
              </Card>
            </li>
          ))}
        </ul>
      )}

      <BudgetDialog open={dialogOpen} draft={draft} takenCategories={taken} onOpenChange={setDialogOpen} />
      <p role="status" aria-live="polite" className="sr-only">
        {announce}
      </p>
    </>
  );
}
