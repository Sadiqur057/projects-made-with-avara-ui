"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import {
  Table,
  TableBadge,
  TableBody,
  TableCell,
  TableContent,
  TableEmpty,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  TableRowAction,
  TableRowActions,
} from "@/components/custom/blocks/TableBlock";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  deleteTransaction,
  formatDate,
  formatDateShort,
  monthLabel,
  money,
  sumBy,
  useFinance,
} from "@/lib/finance";
import { cn } from "@/lib/utils";
import { useDashboardActions } from "../_components/DashboardShell";
import { PageHeading, amountText, inputCls, primaryBtnCls } from "../_components/shared";

const ALL = "all";
const PAGE_SIZE = 25;

export default function TransactionsPage() {
  const { transactions } = useFinance();
  const { openAddTransaction } = useDashboardActions();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<string>(ALL);
  const [category, setCategory] = useState<string>(ALL);
  const [month, setMonth] = useState<string>(ALL);
  const [announce, setAnnounce] = useState("");
  const [limit, setLimit] = useState(PAGE_SIZE);

  const months = useMemo(
    () => [...new Set(transactions.map((t) => t.date.slice(0, 7)))].sort().reverse(),
    [transactions],
  );

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return transactions
      .filter((t) => (type === ALL || t.type === type) && (category === ALL || t.category === category))
      .filter((t) => month === ALL || t.date.startsWith(month))
      .filter((t) => !q || t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q))
      .sort((a, z) => z.date.localeCompare(a.date));
  }, [transactions, query, type, category, month]);

  const filtered = query || type !== ALL || category !== ALL || month !== ALL;
  const income = sumBy(rows, "income");
  const expenses = sumBy(rows, "expense");

  function clearFilters() {
    setQuery("");
    setType(ALL);
    setCategory(ALL);
    setMonth(ALL);
    setLimit(PAGE_SIZE);
  }

  return (
    <>
      <PageHeading
        title="Transactions"
        description="Every deposit and expense. Add new ones or remove mistakes."
        action={
          <button type="button" onClick={openAddTransaction} className={primaryBtnCls}>
            <Plus className="size-4" aria-hidden /> Add transaction
          </button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))]">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            type="search"
            aria-label="Search transactions"
            placeholder="Search description or category"
            className={cn(inputCls, "pl-9")}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setLimit(PAGE_SIZE);
            }}
          />
        </div>
        <select aria-label="Filter by type" className={inputCls} value={type} onChange={(e) => {
              setType(e.target.value);
              setLimit(PAGE_SIZE);
            }}>
          <option value={ALL}>All types</option>
          <option value="expense">Expenses</option>
          <option value="income">Income</option>
        </select>
        <select aria-label="Filter by category" className={inputCls} value={category} onChange={(e) => {
              setCategory(e.target.value);
              setLimit(PAGE_SIZE);
            }}>
          <option value={ALL}>All categories</option>
          {[...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES].map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select aria-label="Filter by month" className={inputCls} value={month} onChange={(e) => {
              setMonth(e.target.value);
              setLimit(PAGE_SIZE);
            }}>
          <option value={ALL}>All months</option>
          {months.map((m) => (
            <option key={m} value={m}>
              {monthLabel(m)} {m.slice(0, 4)}
            </option>
          ))}
        </select>
      </div>

      <Table variant="default" color="primary">
        <TableHeading_ shown={Math.min(limit, rows.length)} total={rows.length} />
        <TableContent>
          <TableHeader>
            <TableRow isHeader>
              <TableHead className="px-2 md:px-4">Date</TableHead>
              <TableHead className="px-2 md:px-4">
                <span className="md:hidden">Details</span>
                <span className="hidden md:inline">Description</span>
              </TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead align="right" className="px-2 md:px-4">Amount</TableHead>
              <TableHead align="right" className="relative px-1.5 md:px-4">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableEmpty
                colSpan={5}
                title={filtered ? "No matching transactions" : "No transactions yet"}
                description={filtered ? "Try a different search or clear the filters." : "Add your first transaction to get started."}
                action={
                  filtered ? (
                    <button type="button" onClick={clearFilters} className="text-sm font-medium text-primary underline underline-offset-4">
                      Clear filters
                    </button>
                  ) : (
                    <button type="button" onClick={openAddTransaction} className={primaryBtnCls}>
                      Add transaction
                    </button>
                  )
                }
              />
            ) : (
              rows.slice(0, limit).map((t) => (
                <TableRow key={t.id} data-testid="tx-row">
                  <TableCell className="whitespace-nowrap px-2 text-muted-foreground md:px-4">
                    <span className="md:hidden">{formatDateShort(t.date)}</span>
                    <span className="hidden md:inline">{formatDate(t.date)}</span>
                  </TableCell>
                  <TableCell className="w-full max-w-0 px-2 font-medium text-foreground md:w-auto md:max-w-[16rem] md:px-4">
                    <span className="block truncate">{t.description}</span>
                    <span className="block truncate text-xs font-normal text-muted-foreground md:hidden">{t.category}</span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <TableBadge tone={t.type === "income" ? "success" : "neutral"} dot={false}>
                      {t.category}
                    </TableBadge>
                  </TableCell>
                  <TableCell
                    align="right"
                    className={cn("whitespace-nowrap px-2 font-semibold tabular-nums md:px-4", t.type === "income" ? "text-success" : "text-foreground")}
                  >
                    {amountText(t.amount, t.type)}
                  </TableCell>
                  <TableCell align="right" className="px-1.5 md:px-4">
                    <TableRowActions alwaysVisible>
                      <TableRowAction
                        label={`Delete ${t.description}`}
                        tone="danger"
                        onClick={() => {
                          deleteTransaction(t.id);
                          setAnnounce(`Deleted ${t.description}`);
                        }}
                      >
                        <Trash2 />
                      </TableRowAction>
                    </TableRowActions>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </TableContent>
        {rows.length > limit && (
          <div className="border-t border-border p-3 text-center">
            <button
              type="button"
              onClick={() => setLimit((n) => n + PAGE_SIZE)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
            >
              Show {Math.min(PAGE_SIZE, rows.length - limit)} more
            </button>
          </div>
        )}
        <TableFooter>
          <div className="flex w-full flex-col gap-1 text-sm sm:flex-row sm:items-center sm:justify-between">
            <span className="text-muted-foreground">
              {rows.length} {rows.length === 1 ? "transaction" : "transactions"}
              {filtered ? " (filtered)" : ""}
            </span>
            <span className="tabular-nums text-muted-foreground">
              Income <span className="font-semibold text-success">{money(income)}</span> · Spent{" "}
              <span className="font-semibold text-foreground">{money(expenses)}</span>
            </span>
          </div>
        </TableFooter>
      </Table>

      <p role="status" aria-live="polite" className="sr-only">
        {announce}
      </p>
    </>
  );
}

function TableHeading_({ shown, total }: { shown: number; total: number }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
      <h2 className="text-sm font-semibold text-foreground">All transactions</h2>
      <span className="text-xs text-muted-foreground">{shown} of {total} shown</span>
    </div>
  );
}
