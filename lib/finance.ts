import { useSyncExternalStore } from "react";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

export const EXPENSE_CATEGORIES = [
  "Housing",
  "Food",
  "Transport",
  "Utilities",
  "Entertainment",
  "Shopping",
  "Health",
] as const;

export const INCOME_CATEGORIES = ["Salary", "Freelance", "Other income"] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];
export type Category = ExpenseCategory | (typeof INCOME_CATEGORIES)[number];
export type TxType = "income" | "expense";

export interface Transaction {
  id: string;
  /** ISO date, yyyy-mm-dd */
  date: string;
  description: string;
  category: Category;
  /** Always positive; `type` carries the sign. */
  amount: number;
  type: TxType;
}

export interface Budget {
  id: string;
  category: ExpenseCategory;
  limit: number;
}

export interface FinanceState {
  transactions: Transaction[];
  budgets: Budget[];
}

/** The demo's "today". Mock data is anchored here so server and client agree. */
export const TODAY = "2026-11-14";
export const CURRENT_MONTH = TODAY.slice(0, 7);

/* ------------------------------------------------------------------ */
/* Mock data                                                          */
/* ------------------------------------------------------------------ */

function rng(seed: number) {
  // mulberry32: tiny deterministic PRNG so the seed data never changes.
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Template = [day: number, description: string, category: Category, amount: number, type?: TxType];

const MONTHLY_TEMPLATE: Template[] = [
  [1, "Salary — Northwind Studio", "Salary", 5200, "income"],
  [2, "Rent", "Housing", 1450],
  [3, "Grocery run", "Food", 92],
  [4, "Electric & water", "Utilities", 118],
  [5, "Internet", "Utilities", 60],
  [6, "Metro card", "Transport", 70],
  [7, "Dinner out", "Food", 64],
  [8, "Streaming bundle", "Entertainment", 28],
  [9, "Grocery run", "Food", 88],
  [12, "Clothing", "Shopping", 96],
  [14, "Ride share", "Transport", 42],
  [16, "Grocery run", "Food", 104],
  [17, "Pharmacy", "Health", 34],
  [19, "Coffee & brunch", "Food", 38],
  [21, "Concert tickets", "Entertainment", 72],
  [23, "Grocery run", "Food", 86],
  [25, "Online order", "Shopping", 64],
];

const PAST_MONTHS = ["2026-06", "2026-07", "2026-08", "2026-09", "2026-10"];
/** Spending level per month, so the monthly bar chart has a shape. */
const MONTH_LEVEL = [0.78, 0.92, 0.68, 1.02, 0.86];

function buildPastTransactions(): Transaction[] {
  const out: Transaction[] = [];
  PAST_MONTHS.forEach((month, mi) => {
    const rand = rng(1000 + mi * 77);
    MONTHLY_TEMPLATE.forEach(([day, description, category, amount, type], i) => {
      const fixed = category === "Salary" || category === "Housing" || description === "Internet";
      const factor = fixed ? 1 : (0.85 + rand() * 0.3) * (MONTH_LEVEL[mi] ?? 1);
      out.push({
        id: `seed-${month}-${i}`,
        date: `${month}-${String(day).padStart(2, "0")}`,
        description,
        category,
        amount: Math.round(amount * factor),
        type: type ?? "expense",
      });
    });
    if (rand() > 0.35) {
      out.push({
        id: `seed-${month}-freelance`,
        date: `${month}-15`,
        description: "Freelance — logo project",
        category: "Freelance",
        amount: Math.round(380 + rand() * 520),
        type: "income",
      });
    }
  });
  return out;
}

const CURRENT_TRANSACTIONS: Transaction[] = (
  [
    [1, "Salary — Northwind Studio", "Salary", 5200, "income"],
    [2, "Rent", "Housing", 1450],
    [3, "Grocery run", "Food", 96],
    [4, "Electric & water", "Utilities", 128],
    [5, "Internet", "Utilities", 60],
    [6, "Metro card", "Transport", 70],
    [7, "Dinner out", "Food", 78],
    [8, "Streaming bundle", "Entertainment", 28],
    [9, "Grocery run", "Food", 104],
    [10, "Birthday dinner", "Food", 142],
    [10, "Noise-cancelling headphones", "Shopping", 189],
    [11, "Ride share", "Transport", 58],
    [12, "Grocery run", "Food", 118],
    [12, "Freelance — brand sprint", "Freelance", 640, "income"],
    [13, "Coffee & brunch", "Food", 42],
    [13, "Concert tickets", "Entertainment", 120],
    [14, "Pharmacy", "Health", 34],
  ] as Template[]
).map(([day, description, category, amount, type], i) => ({
  id: `seed-${CURRENT_MONTH}-${i}`,
  date: `${CURRENT_MONTH}-${String(day).padStart(2, "0")}`,
  description,
  category,
  amount,
  type: type ?? "expense",
}));

export const SEED_STATE: FinanceState = {
  transactions: [...buildPastTransactions(), ...CURRENT_TRANSACTIONS],
  budgets: [
    { id: "b-housing", category: "Housing", limit: 1500 },
    { id: "b-food", category: "Food", limit: 450 },
    { id: "b-transport", category: "Transport", limit: 150 },
    { id: "b-utilities", category: "Utilities", limit: 250 },
    { id: "b-entertainment", category: "Entertainment", limit: 200 },
    { id: "b-shopping", category: "Shopping", limit: 150 },
    { id: "b-health", category: "Health", limit: 100 },
  ],
};

/* ------------------------------------------------------------------ */
/* Store (external, localStorage-backed)                              */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "ledgerly.finance.v1";
let state: FinanceState = SEED_STATE;
let hydrated = false;
const listeners = new Set<() => void>();

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as FinanceState;
      if (Array.isArray(parsed.transactions) && Array.isArray(parsed.budgets)) {
        state = parsed;
      }
    }
  } catch {
    /* storage blocked or corrupt: keep the seed data */
  }
}

function commit(next: FinanceState) {
  state = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore: the in-memory state still works */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  hydrate();
  listeners.add(listener);
  // Hydration may have swapped in saved data after the first render.
  listener();
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => state;
const getServerSnapshot = () => SEED_STATE;

export function useFinance(): FinanceState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

let counter = 0;
const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${(counter++).toString(36)}`;

export function addTransaction(tx: Omit<Transaction, "id">) {
  commit({ ...state, transactions: [{ ...tx, id: uid("tx") }, ...state.transactions] });
}

export function deleteTransaction(id: string) {
  commit({ ...state, transactions: state.transactions.filter((t) => t.id !== id) });
}

/** Creates a budget, or updates the limit if the category already has one. */
export function upsertBudget(category: ExpenseCategory, limit: number) {
  const existing = state.budgets.find((b) => b.category === category);
  commit({
    ...state,
    budgets: existing
      ? state.budgets.map((b) => (b.id === existing.id ? { ...b, limit } : b))
      : [...state.budgets, { id: uid("b"), category, limit }],
  });
}

export function deleteBudget(id: string) {
  commit({ ...state, budgets: state.budgets.filter((b) => b.id !== id) });
}

export function resetDemoData() {
  commit(SEED_STATE);
}

/* ------------------------------------------------------------------ */
/* Selectors & formatting                                             */
/* ------------------------------------------------------------------ */

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const usd0 = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export const money = (n: number) => usd.format(n);
export const moneyRound = (n: number) => usd0.format(n);

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function monthLabel(key: string) {
  return MONTH_LABELS[Number(key.slice(5, 7)) - 1] ?? key;
}

export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTH_LABELS[(m ?? 1) - 1]} ${d}, ${y}`;
}

export function formatDateShort(iso: string) {
  const [, m, d] = iso.split("-").map(Number);
  return `${MONTH_LABELS[(m ?? 1) - 1]} ${d}`;
}

export function inMonth(txs: Transaction[], month: string) {
  return txs.filter((t) => t.date.startsWith(month));
}

export function sumBy(txs: Transaction[], type: TxType) {
  return txs.filter((t) => t.type === type).reduce((acc, t) => acc + t.amount, 0);
}

export function spendingByCategory(txs: Transaction[], month: string) {
  const totals = new Map<Category, number>();
  for (const t of inMonth(txs, month)) {
    if (t.type !== "expense") continue;
    totals.set(t.category, (totals.get(t.category) ?? 0) + t.amount);
  }
  return [...totals.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

/** Expense and income totals for the last `count` months ending at CURRENT_MONTH. */
export function monthlyTotals(txs: Transaction[], count = 6) {
  const [y, m] = CURRENT_MONTH.split("-").map(Number) as [number, number];
  const keys: string[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(y, m - 1 - i, 1));
    keys.push(`${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`);
  }
  return keys.map((key) => {
    const list = inMonth(txs, key);
    return { key, label: monthLabel(key), expenses: sumBy(list, "expense"), income: sumBy(list, "income") };
  });
}

export type BudgetState = "ok" | "warning" | "over";

export const WARNING_THRESHOLD = 0.85;

export function budgetStatus(budget: Budget, txs: Transaction[], month = CURRENT_MONTH) {
  const spent = inMonth(txs, month)
    .filter((t) => t.type === "expense" && t.category === budget.category)
    .reduce((acc, t) => acc + t.amount, 0);
  const ratio = budget.limit > 0 ? spent / budget.limit : 0;
  const status: BudgetState = ratio > 1 ? "over" : ratio >= WARNING_THRESHOLD ? "warning" : "ok";
  return { spent, remaining: budget.limit - spent, ratio, status };
}
