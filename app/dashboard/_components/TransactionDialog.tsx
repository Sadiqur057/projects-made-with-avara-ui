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
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  TODAY,
  addTransaction,
  type Category,
  type TxType,
} from "@/lib/finance";
import { cn } from "@/lib/utils";
import { Field, inputCls, primaryBtnCls, secondaryBtnCls } from "./shared";

function TransactionForm({ onDone }: { onDone: () => void }) {
  const [type, setType] = useState<TxType>("expense");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("Food");
  const [date, setDate] = useState(TODAY);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories: readonly Category[] = type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  function switchType(next: TxType) {
    setType(next);
    setCategory(next === "expense" ? "Food" : "Salary");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    const value = Number(amount);
    if (!description.trim()) next.description = "Add a short description.";
    if (!amount || !Number.isFinite(value) || value <= 0) next.amount = "Enter an amount greater than 0.";
    if (!date) next.date = "Pick a date.";
    setErrors(next);
    if (Object.keys(next).length) return;
    addTransaction({
      type,
      description: description.trim(),
      amount: Math.round(value * 100) / 100,
      category,
      date,
    });
    onDone();
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4" aria-label="Add transaction">
      <div role="radiogroup" aria-label="Transaction type" className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
        {(["expense", "income"] as const).map((t) => (
          <button
            key={t}
            type="button"
            role="radio"
            aria-checked={type === t}
            onClick={() => switchType(t)}
            className={cn(
              "h-9 rounded-md text-sm font-medium capitalize transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
              type === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <Field label="Description" htmlFor="tx-description" error={errors.description}>
        <input
          id="tx-description"
          className={inputCls}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={type === "expense" ? "e.g. Grocery run" : "e.g. Freelance payment"}
          maxLength={60}
          autoComplete="off"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Amount (USD)" htmlFor="tx-amount" error={errors.amount}>
          <input
            id="tx-amount"
            className={inputCls}
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
          />
        </Field>
        <Field label="Date" htmlFor="tx-date" error={errors.date}>
          <input id="tx-date" className={inputCls} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
      </div>

      <Field label="Category" htmlFor="tx-category">
        <select
          id="tx-category"
          className={inputCls}
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>

      <DialogFooter>
        <div className="flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row">
          <DialogClose className={secondaryBtnCls}>Cancel</DialogClose>
          <button type="submit" className={primaryBtnCls}>
            Add transaction
          </button>
        </div>
      </DialogFooter>
    </form>
  );
}

export function TransactionDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add transaction</DialogTitle>
          <DialogDescription>Log an expense or income. It updates your charts and budgets right away.</DialogDescription>
        </DialogHeader>
        {open && <TransactionForm onDone={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}
