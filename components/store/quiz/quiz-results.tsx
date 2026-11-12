"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, RefreshCw, RotateCcw, ShoppingBag } from "lucide-react";
import { Price } from "@/components/store/price";
import { ProductImage } from "@/components/store/product-image";
import { CONCERN_LABEL, STEP_LABEL } from "@/lib/catalog";
import { SUBSCRIBE_DISCOUNT, money2, unitPrice } from "@/lib/pricing";
import { recommend, skinTitle, type QuizAnswers, type RoutinePick } from "@/lib/quiz";
import { actions } from "@/lib/store";
import { cn } from "@/lib/utils";

function PickCard({ pick, order }: { pick: RoutinePick; order: number }) {
  const { product } = pick;
  const [added, setAdded] = useState(false);
  return (
    <li className="grid grid-cols-[5.5rem_1fr] gap-4 rounded-2xl border border-border bg-card p-3 sm:grid-cols-[7rem_1fr_auto] sm:items-center sm:p-4">
      <Link href={`/shop/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden rounded-xl bg-muted" aria-hidden="true" tabIndex={-1}>
        <ProductImage slug={product.slug} view={1} />
      </Link>
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          <span className="grid size-5 place-items-center rounded-full bg-primary text-[11px] text-primary-foreground">{order}</span>
          {pick.slot} · {STEP_LABEL[product.step].replace(/s$/, "")}
        </p>
        <h3 className="mt-1 font-display text-lg font-medium leading-snug sm:text-xl">
          <Link href={`/shop/${product.slug}`} className="hover:underline">
            {product.name}
          </Link>
        </h3>
        <ul className="mt-1.5 grid gap-0.5 text-sm text-muted-foreground">
          {pick.reasons.map((r) => (
            <li key={r} className="flex items-start gap-1.5">
              <Check className="mt-0.5 size-3.5 shrink-0 text-success" aria-hidden="true" />
              {r}
            </li>
          ))}
        </ul>
        <div className="mt-2 sm:hidden">
          <Price product={product} />
        </div>
      </div>
      <div className="col-span-2 flex items-center justify-between gap-3 sm:col-span-1 sm:flex-col sm:items-end">
        <span className="hidden sm:block">
          <Price product={product} />
        </span>
        <button
          type="button"
          onClick={() => {
            actions.addToCart(product.slug, product.sizes[0].id);
            setAdded(true);
          }}
          className={cn(
            "h-10 rounded-xl px-4 text-sm font-semibold transition-colors",
            added ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground hover:opacity-90",
          )}
        >
          {added ? "Added ✓" : "Add to bag"}
        </button>
      </div>
    </li>
  );
}

function Section({ title, hint, picks, startAt }: { title: string; hint: string; picks: RoutinePick[]; startAt: number }) {
  if (picks.length === 0) return null;
  return (
    <section className="grid gap-3">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-2xl font-medium">{title}</h2>
        <p className="text-sm text-muted-foreground">{hint}</p>
      </div>
      <ol className="grid gap-3">
        {picks.map((p, i) => (
          <PickCard key={`${title}-${p.product.slug}`} pick={p} order={startAt + i} />
        ))}
      </ol>
    </section>
  );
}

export function QuizResults({ answers, onRetake }: { answers: QuizAnswers; onRetake: () => void }) {
  const rec = recommend(answers);
  const [subscribe, setSubscribe] = useState(false);

  const total = rec.picks.reduce((n, p) => n + unitPrice(p.product, p.product.sizes[0].id, subscribe).final, 0);
  const listTotal = rec.picks.reduce((n, p) => n + unitPrice(p.product, p.product.sizes[0].id, false).final, 0);

  const addAll = () => {
    for (const p of rec.picks) {
      actions.addToCart(p.product.slug, p.product.sizes[0].id, 1, subscribe ? 60 : null);
    }
  };

  return (
    <div className="grid gap-10">
      <header className="rounded-3xl bg-secondary p-6 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Your skin profile</p>
        <h1 className="mt-2 font-display text-4xl font-medium tracking-tight sm:text-5xl">{skinTitle(answers)}</h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-foreground/80">{rec.summary}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {answers.concerns.map((c) => (
            <li key={c} className="rounded-full bg-card px-3 py-1 text-xs font-semibold">
              {CONCERN_LABEL[c]}
            </li>
          ))}
          {answers.fragranceFree && <li className="rounded-full bg-card px-3 py-1 text-xs font-semibold">Fragrance-free</li>}
          <li className="rounded-full bg-card px-3 py-1 text-xs font-semibold capitalize">{answers.routine} routine</li>
        </ul>
        <button
          type="button"
          onClick={onRetake}
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Retake the quiz
        </button>
      </header>

      {rec.picks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border px-6 py-14 text-center">
          <h2 className="font-display text-2xl font-medium">We couldn&apos;t match every step</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Those preferences are quite specific. Try loosening one, or browse everything and filter yourself.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button type="button" onClick={onRetake} className="h-11 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground">
              Retake the quiz
            </button>
            <Link href="/shop" className="inline-flex h-11 items-center rounded-xl border border-input px-5 text-sm font-semibold">
              Browse all
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_20rem]">
          <div className="grid gap-10">
            <Section title="Morning" hint="Cleanse, treat, protect" picks={rec.morning} startAt={1} />
            <Section title="Evening" hint="Cleanse, treat, restore" picks={rec.evening} startAt={1} />
            <Section title="Weekly treat" hint="Once or twice a week" picks={rec.weekly} startAt={1} />
          </div>

          <aside className="rounded-3xl border border-border bg-card p-5 sm:p-6 lg:sticky lg:top-6" aria-label="Routine summary">
            <h2 className="font-display text-2xl font-medium">Your routine</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {rec.picks.length} products · smallest sizes
            </p>
            <ul className="mt-4 grid gap-2 text-sm">
              {rec.picks.map((p) => (
                <li key={p.product.slug} className="flex justify-between gap-3">
                  <span className="truncate">{p.product.name}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {money2(unitPrice(p.product, p.product.sizes[0].id, subscribe).final)}
                  </span>
                </li>
              ))}
            </ul>

            <label
              className={cn(
                "mt-5 flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring",
                subscribe ? "border-primary bg-accent/40" : "border-border hover:bg-muted/60",
              )}
            >
              <input
                type="checkbox"
                checked={subscribe}
                onChange={(e) => setSubscribe(e.target.checked)}
                className="mt-0.5 size-4 accent-primary"
              />
              <span>
                <span className="flex items-center gap-1.5 font-semibold">
                  <RefreshCw className="size-3.5 text-primary" aria-hidden="true" />
                  Subscribe &amp; save {Math.round(SUBSCRIBE_DISCOUNT * 100)}%
                </span>
                <span className="text-muted-foreground">Delivered every 60 days. Cancel any time.</span>
              </span>
            </label>

            <div className="mt-5 flex items-baseline justify-between border-t border-border pt-4">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-2xl font-semibold tabular-nums">
                {subscribe && <span className="mr-2 text-base font-normal text-muted-foreground line-through">{money2(listTotal)}</span>}
                {money2(total)}
              </span>
            </div>
            <button
              type="button"
              onClick={addAll}
              className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              <ShoppingBag className="size-4" aria-hidden="true" />
              Add full routine to bag
            </button>
            <Link href="/cart" className="mt-2 flex h-11 items-center justify-center rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground">
              View bag
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
