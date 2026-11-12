"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Heart, Search, SlidersHorizontal, X } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerTitle,
} from "@/components/custom/blocks/Drawer";
import { ProductCard, ProductCardSkeleton } from "@/components/store/product-card";
import { FilterPanel, type ShopFilters } from "@/components/store/shop/filters";
import {
  CONCERN_LABEL,
  PRODUCTS,
  SEED_REVIEWS,
  SKIN_TYPE_LABEL,
  STEP_LABEL,
  saleDiscountFor,
  type Concern,
  type Product,
  type SkinType,
  type Step,
} from "@/lib/catalog";
import { unitPrice } from "@/lib/pricing";
import { statsFor, useHydrated, useStore } from "@/lib/store";

const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "best", label: "Bestselling" },
  { id: "rating", label: "Top rated" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
] as const;
type SortId = (typeof SORTS)[number]["id"];

const isStep = (v: string): v is Step => v in STEP_LABEL;
const isType = (v: string): v is SkinType => v in SKIN_TYPE_LABEL;
const isConcern = (v: string): v is Concern => v in CONCERN_LABEL;

/** Facet counts over the whole catalogue (they do not change with filters). */
const COUNTS = (() => {
  const step: Record<string, number> = {};
  const type: Record<string, number> = {};
  const concern: Record<string, number> = {};
  for (const p of PRODUCTS) {
    step[p.step] = (step[p.step] ?? 0) + 1;
    p.skinTypes.forEach((t) => (type[t] = (type[t] ?? 0) + 1));
    p.concerns.forEach((c) => (concern[c] = (concern[c] ?? 0) + 1));
  }
  return { step, type, concern };
})();

export function ShopClient() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const { favorites, reviews: mine } = useStore();
  const hydrated = useHydrated();
  const [drawer, setDrawer] = useState(false);

  const filters: ShopFilters = {
    steps: params.getAll("step").filter(isStep),
    types: params.getAll("type").filter(isType),
    concerns: params.getAll("concern").filter(isConcern),
    fragranceFree: params.get("fragrance") === "1",
    onSale: params.get("sale") === "1",
    saved: params.get("saved") === "1",
  };
  const q = params.get("q") ?? "";
  const sortParam = params.get("sort");
  const sort: SortId = SORTS.some((s) => s.id === sortParam) ? (sortParam as SortId) : "featured";

  const write = (next: ShopFilters, nextQ = q, nextSort: SortId = sort) => {
    const sp = new URLSearchParams();
    next.steps.forEach((v) => sp.append("step", v));
    next.types.forEach((v) => sp.append("type", v));
    next.concerns.forEach((v) => sp.append("concern", v));
    if (next.fragranceFree) sp.set("fragrance", "1");
    if (next.onSale) sp.set("sale", "1");
    if (next.saved) sp.set("saved", "1");
    if (nextQ.trim()) sp.set("q", nextQ);
    if (nextSort !== "featured") sp.set("sort", nextSort);
    const qs = sp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const ratingOf: Record<string, number> = {};
  for (const p of PRODUCTS) {
    ratingOf[p.slug] = statsFor([
      ...mine.filter((r) => r.productSlug === p.slug),
      ...SEED_REVIEWS.filter((r) => r.productSlug === p.slug),
    ]).average;
  }

  const results = (() => {
    const term = q.trim().toLowerCase();
    const matches = (p: Product) => {
      if (filters.steps.length && !filters.steps.includes(p.step)) return false;
      if (filters.types.length && !filters.types.some((t) => p.skinTypes.includes(t))) return false;
      if (filters.concerns.length && !filters.concerns.some((c) => p.concerns.includes(c))) return false;
      if (filters.fragranceFree && !p.fragranceFree) return false;
      if (filters.onSale && saleDiscountFor(p.slug) === 0) return false;
      if (filters.saved && !favorites.includes(p.slug)) return false;
      if (term) {
        const hay = [
          p.name,
          p.tagline,
          STEP_LABEL[p.step],
          ...p.concerns.map((c) => CONCERN_LABEL[c]),
          ...p.skinTypes.map((t) => SKIN_TYPE_LABEL[t]),
          ...p.tags,
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(term)) return false;
      }
      return true;
    };
    const list = PRODUCTS.filter(matches);
    const price = (p: Product) => unitPrice(p, p.sizes[0].id, false).final;
    switch (sort) {
      case "best":
        return [...list].sort((a, b) => Number(b.bestseller) - Number(a.bestseller) || ratingOf[b.slug] - ratingOf[a.slug]);
      case "rating":
        return [...list].sort((a, b) => ratingOf[b.slug] - ratingOf[a.slug]);
      case "price-asc":
        return [...list].sort((a, b) => price(a) - price(b));
      case "price-desc":
        return [...list].sort((a, b) => price(b) - price(a));
      default:
        return list;
    }
  })();

  const chips: { key: string; label: string; remove: () => void }[] = [
    ...filters.steps.map((s) => ({ key: `s-${s}`, label: STEP_LABEL[s], remove: () => write({ ...filters, steps: filters.steps.filter((v) => v !== s) }) })),
    ...filters.types.map((t) => ({ key: `t-${t}`, label: `${SKIN_TYPE_LABEL[t]} skin`, remove: () => write({ ...filters, types: filters.types.filter((v) => v !== t) }) })),
    ...filters.concerns.map((c) => ({ key: `c-${c}`, label: CONCERN_LABEL[c], remove: () => write({ ...filters, concerns: filters.concerns.filter((v) => v !== c) }) })),
    ...(filters.fragranceFree ? [{ key: "ff", label: "Fragrance-free", remove: () => write({ ...filters, fragranceFree: false }) }] : []),
    ...(filters.onSale ? [{ key: "sale", label: "On sale", remove: () => write({ ...filters, onSale: false }) }] : []),
    ...(filters.saved ? [{ key: "saved", label: "My favourites", remove: () => write({ ...filters, saved: false }) }] : []),
    ...(q.trim() ? [{ key: "q", label: `“${q.trim()}”`, remove: () => write(filters, "") }] : []),
  ];

  const clearAll = () =>
    write({ steps: [], types: [], concerns: [], fragranceFree: false, onSale: false, saved: false }, "", sort);

  const panel = <FilterPanel filters={filters} onChange={(f) => write(f)} counts={COUNTS} />;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Shop</p>
        <h1 className="mt-2 font-display text-4xl font-medium tracking-tight sm:text-5xl">
          {filters.saved ? "Your favourites" : "All skincare"}
        </h1>
        <p className="mt-3 text-muted-foreground">
          Filter by what your skin needs, or{" "}
          <Link href="/quiz" className="font-medium text-primary underline underline-offset-4">
            take the two-minute quiz
          </Link>{" "}
          and we&apos;ll do it for you.
        </p>
      </header>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            value={q}
            onChange={(e) => write(filters, e.target.value)}
            placeholder="Search by name, concern or skin type"
            aria-label="Search products"
            className="h-11 w-full rounded-xl border border-input bg-card pl-10 pr-4 text-sm placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring"
          />
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setDrawer(true)}
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-input bg-card px-4 text-sm font-medium lg:hidden"
          >
            <SlidersHorizontal className="size-4" aria-hidden="true" />
            Filters{chips.length > 0 && ` (${chips.length})`}
          </button>
          <label className="flex-1 sm:flex-none">
            <span className="sr-only">Sort by</span>
            <select
              value={sort}
              onChange={(e) => write(filters, q, e.target.value as SortId)}
              className="h-11 w-full rounded-xl border border-input bg-card px-3 text-sm focus-visible:outline-2 focus-visible:outline-ring sm:w-52"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[15rem_1fr]">
        <aside className="hidden lg:block" aria-label="Filters">
          <div className="sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto pr-2">{panel}</div>
        </aside>

        <section aria-label="Products">
          <div className="flex flex-wrap items-center gap-2">
            <p className="mr-2 text-sm text-muted-foreground" role="status" aria-live="polite">
              {results.length} {results.length === 1 ? "product" : "products"}
            </p>
            {chips.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={c.remove}
                aria-label={`Remove filter ${c.label}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground hover:bg-muted"
              >
                {c.label}
                <X className="size-3" aria-hidden="true" />
              </button>
            ))}
            {chips.length > 1 && (
              <button type="button" onClick={clearAll} className="text-xs font-semibold text-primary underline underline-offset-4">
                Clear all
              </button>
            )}
          </div>

          {!hydrated ? (
            <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => (
                <li key={i}>
                  <ProductCardSkeleton />
                </li>
              ))}
            </ul>
          ) : results.length === 0 ? (
            <div className="mt-6 grid place-items-center rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center">
              <span className="grid size-14 place-items-center rounded-full bg-secondary text-primary">
                {filters.saved && favorites.length === 0 ? <Heart className="size-6" aria-hidden="true" /> : <Search className="size-6" aria-hidden="true" />}
              </span>
              <h2 className="mt-4 font-display text-2xl font-medium">
                {filters.saved && favorites.length === 0 ? "No favourites yet" : "Nothing matches those filters"}
              </h2>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                {filters.saved && favorites.length === 0
                  ? "Tap the heart on any product to save it here for later."
                  : "Try removing a filter, or let the quiz point you to the right products."}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {chips.length > 0 && (
                  <button type="button" onClick={clearAll} className="h-11 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground hover:opacity-90">
                    Clear filters
                  </button>
                )}
                <Link href="/quiz" className="inline-flex h-11 items-center rounded-xl border border-input px-5 text-sm font-semibold hover:bg-muted">
                  Take the skin quiz
                </Link>
              </div>
            </div>
          ) : (
            <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
              {results.map((p, i) => (
                <li key={p.slug}>
                  <ProductCard product={p} priority={i < 3} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <Drawer open={drawer} onOpenChange={setDrawer} side="left">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Filters</DrawerTitle>
            <DrawerDescription>
              {results.length} {results.length === 1 ? "product" : "products"} match
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto p-6">{panel}</div>
          <DrawerFooter>
            <button type="button" onClick={clearAll} className="h-11 rounded-xl border border-input bg-background px-5 text-sm font-semibold hover:bg-muted">
              Clear all
            </button>
            <button type="button" onClick={() => setDrawer(false)} className="h-11 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground hover:opacity-90">
              Show {results.length}
            </button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
