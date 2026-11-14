"use client";

import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/custom/blocks/DialogBlock";
import { EXPENSE_CATEGORIES, upsertBudget, type ExpenseCategory } from "@/lib/finance";
import { Field, inputCls, primaryBtnCls, secondaryBtnCls } from "./shared";

export interface BudgetDraft {
  category: ExpenseCategory;
  limit?: number;
}

function BudgetForm({
  draft,
  takenCategories,
  onDone,
}: {
  draft: BudgetDraft | null;
  takenCategories: ExpenseCategory[];
  onDone: () => void;
}) {
  const editing = draft?.limit !== undefined;
  const available = editing ? EXPENSE_CATEGORIES : EXPENSE_CATEGORIES.filter((c) => !takenCategories.includes(c));
  const [category, setCategory] = useState<ExpenseCategory>(draft?.category ?? available[0] ?? "Food");
  const [limit, setLimit] = useState(draft?.limit ? String(draft.limit) : "");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(limit);
    if (!limit || !Number.isFinite(value) || value <= 0) {
      setError("Enter a monthly limit greater than 0.");
      return;
    }
    upsertBudget(category, Math.round(value));
    onDone();
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4" aria-label={editing ? "Edit budget" : "Add budget"}>
      <Field label="Category" htmlFor="budget-category">
        <select
          id="budget-category"
          className={inputCls}
          value={category}
          disabled={editing}
          onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
        >
          {available.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Monthly limit (USD)" htmlFor="budget-limit" error={error}>
        <input
          id="budget-limit"
          className={inputCls}
          type="number"
          inputMode="numeric"
          min="1"
          step="1"
          value={limit}
          onChange={(e) => {
            setLimit(e.target.value);
            setError("");
          }}
          placeholder="e.g. 400"
        />
      </Field>
      <DialogFooter>
        <div className="flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row">
          <DialogClose className={secondaryBtnCls}>Cancel</DialogClose>
          <button type="submit" className={primaryBtnCls}>
            {editing ? "Save budget" : "Create budget"}
          </button>
        </div>
      </DialogFooter>
    </form>
  );
}

export function BudgetDialog({
  open,
  draft,
  takenCategories,
  onOpenChange,
}: {
  open: boolean;
  draft: BudgetDraft | null;
  takenCategories: ExpenseCategory[];
  onOpenChange: (open: boolean) => void;
}) {
  const editing = draft?.limit !== undefined;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? `Edit ${draft?.category} budget` : "Add category budget"}</DialogTitle>
          <DialogDescription>Set a monthly spending limit. You&apos;ll be warned as you approach and pass it.</DialogDescription>
        </DialogHeader>
        {open && (
          <BudgetForm
            key={draft ? `${draft.category}-${draft.limit ?? "new"}` : "new"}
            draft={draft}
            takenCategories={takenCategories}
            onDone={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
