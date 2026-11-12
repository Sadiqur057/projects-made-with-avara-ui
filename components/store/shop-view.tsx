"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { SelectBlock } from "@/components/custom/blocks/SelectBlock";
import { ToggleGroup, ToggleGroupItem } from "@/components/custom/blocks/ToggleGroupBlock";
import { categories, products, type CategoryId, type Product } from "@/lib/store/products";
import { ProductCard } from "./product-card";

const SORTS = [
  { label: "Featured", value: "featured" },
  { label: "Newest", value: "newest" },
  { label: "Best selling", value: "popular" },
  { label: "Top rated", value: "rating" },
  { label: "Price: low to high", value: "price-asc" },
  { label: "Price: high to low", value: "price-desc" },
];

const PRICE_BANDS = [
  { label: "Any price", value: "all" },
  { label: "Under $50", value: "0-50" },
  { label: "$50 – $150", value: "50-150" },
  { label: "$150 – $300", value: "150-300" },
  { label: "$300 +", value: "300-9999" },
];

function sortProducts(list: Product[], sort: string) {
  const out = [...list];
  switch (sort) {
    case "newest":
      return out.sort((a, b) => b.released - a.released);
    case "popular":
      return out.sort((a, b) => b.sold - a.sold);
    case "rating":
      return out.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    case "price-asc":
      return out.sort((a, b) => a.price - b.price);
    case "price-desc":
      return out.sort((a, b) => b.price - a.price);
    default:
      return out.sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || b.sold - a.sold);
  }
}

export function ShopView() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const category = (params.get("category") as CategoryId | null) ?? "all";
  const sort = params.get("sort") ?? "featured";
  const price = params.get("price") ?? "all";
  const sale = params.get("sale") === "1";
  const q = params.get("q") ?? "";

  // Local text so typing never lags behind the URL; re-synced when the URL changes elsewhere.
  const [text, setText] = useState(q);
  const [syncedQ, setSyncedQ] = useState(q);
  if (q !== syncedQ) {
    setSyncedQ(q);
    setText(q);
  }

  const set = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v === null || v === "" || v === "all" || (k === "sort" && v === "featured")) next.delete(k);
      else next.set(k, v);
    }
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const results = useMemo(() => {
    const [min, max] = price === "all" ? [0, Infinity] : price.split("-").map(Number);
    const needle = q.trim().toLowerCase();
    const list = products.filter(
      (p) =>
        (category === "all" || p.category === category) &&
        p.price >= min &&
        p.price <= max &&
        (!sale || !!p.compareAt) &&
        (!needle || `${p.name} ${p.blurb} ${p.category}`.toLowerCase().includes(needle)),
    );
    return sortProducts(list, sort);
  }, [category, price, sale, q, sort]);

  // Push the search text to the URL once the user pauses typing.
  useEffect(() => {
    if (text === q) return;
    const t = setTimeout(() => set({ q: text }), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const hasFilters = category !== "all" || price !== "all" || sale || q !== "";
  const heading = sale ? "Sale" : category === "all" ? "All pieces" : (categories.find((c) => c.id === category)?.name ?? "Shop");

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-20 pt-6 sm:px-6">
      <header className="border-b border-border pb-8 pt-4">
        <h1 className="font-heading text-5xl sm:text-7xl">{heading}</h1>
        <p className="mt-3 text-muted-foreground" aria-live="polite">
          {results.length} {results.length === 1 ? "piece" : "pieces"}
          {q && <> for &ldquo;{q}&rdquo;</>}
        </p>
      </header>

      <div className="sticky top-[6.5rem] z-20 -mx-4 space-y-4 border-b border-border bg-background/90 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 lg:top-[7.25rem]">
        <div className="flex flex-wrap items-center gap-3">
          <div className="-mx-1 max-w-full flex-1 overflow-x-auto px-1">
            <ToggleGroup type="single" variant="segmented" size="sm" value={category} onValueChange={(v) => v && set({ category: v })} aria-label="Category">
              <ToggleGroupItem value="all">All</ToggleGroupItem>
              {categories.map((c) => (
                <ToggleGroupItem key={c.id} value={c.id}>
                  {c.name}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="relative min-w-[200px] flex-1 sm:max-w-xs">
            <span className="sr-only">Search the shop</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={text}
              onChange={(e) => {
                setText(e.target.value);
              }}
              placeholder="Search"
              className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
            />
          </label>
          <div className="w-44">
            <SelectBlock options={PRICE_BANDS} value={price} onChange={(v) => set({ price: v })} inputSize="sm" placeholder="Price" icon={<SlidersHorizontal className="size-4" />} />
          </div>
          <div className="w-48">
            <SelectBlock options={SORTS} value={sort} onChange={(v) => set({ sort: v })} inputSize="sm" placeholder="Sort by" />
          </div>
          <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-input px-3 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/5">
            <input type="checkbox" checked={sale} onChange={(e) => set({ sale: e.target.checked ? "1" : null })} className="size-4 accent-[var(--primary)]" />
            On sale
          </label>
          {hasFilters && (
            <button type="button" onClick={() => router.replace(pathname, { scroll: false })} className="inline-flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm text-muted-foreground transition hover:text-foreground">
              <X className="size-4" /> Clear all
            </button>
          )}
        </div>
      </div>

      {results.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-heading text-4xl">Nothing matches those filters</p>
          <p className="mt-2 text-muted-foreground">Try widening your price range or clearing a filter.</p>
          <Link href="/shop" className="mt-6 inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
            Reset filters
          </Link>
        </div>
      ) : (
        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {results.map((p, i) => (
            <li key={p.id}>
              <ProductCard product={p} priority={i < 4} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
