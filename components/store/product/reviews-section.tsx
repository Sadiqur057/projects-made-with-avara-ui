"use client";

import { useId, useState } from "react";
import { PenLine, Star, Trash2 } from "lucide-react";
import { HalfStars } from "@/components/custom/blocks/HalfStarsBlock";
import { SKIN_TYPE_LABEL, type Product, type Review } from "@/lib/catalog";
import { actions, useProductReviews } from "@/lib/store";
import { cn } from "@/lib/utils";

const SORTS = [
  { id: "newest", label: "Newest" },
  { id: "high", label: "Highest rated" },
  { id: "low", label: "Lowest rated" },
] as const;
type SortId = (typeof SORTS)[number]["id"];

const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

function RatingInput({
  value,
  onChange,
  invalid,
  describedBy,
}: {
  value: number;
  onChange: (n: number) => void;
  invalid: boolean;
  describedBy?: string;
}) {
  const name = useId();
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <fieldset aria-describedby={describedBy}>
      <legend className="mb-2 text-sm font-medium">
        Your rating <span aria-hidden="true">*</span>
      </legend>
      <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} className="cursor-pointer" onMouseEnter={() => setHover(n)}>
            <input
              type="radio"
              name={name}
              value={n}
              checked={value === n}
              onChange={() => onChange(n)}
              className="peer sr-only"
              aria-label={`${n} star${n === 1 ? "" : "s"}`}
            />
            <Star
              className={cn(
                "size-8 rounded transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring",
                n <= shown ? "fill-primary text-primary" : invalid ? "text-destructive" : "text-border",
              )}
              aria-hidden="true"
            />
          </label>
        ))}
        <span className="ml-2 text-sm text-muted-foreground" aria-hidden="true">
          {["", "Not for me", "It was okay", "Pretty good", "Really good", "Love it"][shown]}
        </span>
      </div>
    </fieldset>
  );
}

function ReviewForm({ product, onDone }: { product: Product; onDone: () => void }) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [name, setName] = useState("");
  const [skin, setSkin] = useState("Combination skin");
  const [errors, setErrors] = useState<{ rating?: string; body?: string; name?: string }>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (rating === 0) next.rating = "Choose a star rating.";
    if (body.trim().length < 10) next.body = "Tell us a little more (at least 10 characters).";
    if (!name.trim()) next.name = "Add a name to show with your review.";
    setErrors(next);
    if (Object.keys(next).length) return;
    actions.addReview({
      productSlug: product.slug,
      name: name.trim(),
      skin,
      rating,
      title: title.trim() || "My review",
      body: body.trim(),
    });
    onDone();
  };

  const field =
    "w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring";

  return (
    <form onSubmit={submit} noValidate className="grid gap-5 rounded-2xl border border-border bg-card p-5 sm:p-6">
      <h3 className="font-display text-xl font-medium">Review {product.name}</h3>

      <RatingInput value={rating} onChange={setRating} invalid={!!errors.rating} describedBy={errors.rating ? "err-rating" : undefined} />
      {errors.rating && (
        <p id="err-rating" role="alert" className="-mt-3 text-sm text-destructive">
          {errors.rating}
        </p>
      )}

      <div className="grid gap-1.5">
        <label htmlFor="rv-title" className="text-sm font-medium">
          Headline
        </label>
        <input id="rv-title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80} placeholder="Sum it up in a few words" className={cn(field, "border-input")} />
      </div>

      <div className="grid gap-1.5">
        <label htmlFor="rv-body" className="text-sm font-medium">
          Your review <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="rv-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          maxLength={800}
          aria-invalid={!!errors.body}
          aria-describedby={errors.body ? "err-body" : undefined}
          placeholder="What did you like? How did your skin respond?"
          className={cn(field, errors.body ? "border-destructive" : "border-input")}
        />
        {errors.body && (
          <p id="err-body" role="alert" className="text-sm text-destructive">
            {errors.body}
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <label htmlFor="rv-name" className="text-sm font-medium">
            Name <span aria-hidden="true">*</span>
          </label>
          <input
            id="rv-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={40}
            autoComplete="given-name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "err-name" : undefined}
            placeholder="First name and initial"
            className={cn(field, errors.name ? "border-destructive" : "border-input")}
          />
          {errors.name && (
            <p id="err-name" role="alert" className="text-sm text-destructive">
              {errors.name}
            </p>
          )}
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="rv-skin" className="text-sm font-medium">
            Your skin
          </label>
          <select id="rv-skin" value={skin} onChange={(e) => setSkin(e.target.value)} className={cn(field, "border-input")}>
            {Object.values(SKIN_TYPE_LABEL).map((l) => (
              <option key={l}>{`${l} skin`}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="h-11 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground hover:opacity-90">
          Submit review
        </button>
        <button type="button" onClick={onDone} className="h-11 rounded-xl px-4 text-sm font-semibold text-muted-foreground hover:text-foreground">
          Cancel
        </button>
      </div>
    </form>
  );
}

function ReviewItem({ review }: { review: Review }) {
  return (
    <article className="grid gap-2 border-b border-border py-6 last:border-b-0">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <HalfStars
          rating={review.rating}
          size={16}
          showText={false}
          allowHalf={false}
          role="img"
          aria-label={`Rated ${review.rating} out of 5`}
          className="gap-0"
        />
        <h4 className="font-semibold">{review.title}</h4>
      </div>
      <p className="text-sm leading-relaxed text-foreground/85">{review.body}</p>
      <div className="flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{review.name}</span>
        <span>{review.skin}</span>
        <time dateTime={review.date}>{dateFmt.format(new Date(`${review.date}T00:00:00Z`))}</time>
        {review.mine && (
          <>
            <span className="rounded-full bg-accent px-2 py-0.5 font-semibold text-accent-foreground">Your review</span>
            <button
              type="button"
              onClick={() => actions.deleteReview(review.id)}
              className="inline-flex items-center gap-1 font-medium text-destructive hover:underline"
            >
              <Trash2 className="size-3" aria-hidden="true" />
              Delete
            </button>
          </>
        )}
      </div>
    </article>
  );
}

export function ReviewsSection({ product }: { product: Product }) {
  const { reviews, stats } = useProductReviews(product.slug);
  const [sort, setSort] = useState<SortId>("newest");
  const [writing, setWriting] = useState(false);
  const [visible, setVisible] = useState(5);

  const sorted = [...reviews].sort((a, b) =>
    sort === "high" ? b.rating - a.rating : sort === "low" ? a.rating - b.rating : b.date.localeCompare(a.date),
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[18rem_1fr]">
      <div className="space-y-5">
        <div>
          <p className="font-display text-6xl font-medium tabular-nums leading-none">
            {stats.count ? stats.average.toFixed(1) : "–"}
          </p>
          <HalfStars
            rating={stats.average}
            size={20}
            showText={false}
            role="img"
            aria-label={`Average rating ${stats.average.toFixed(1)} out of 5`}
            className="mt-3 gap-0"
          />
          <p className="mt-1 text-sm text-muted-foreground">
            {stats.count} review{stats.count === 1 ? "" : "s"}
          </p>
        </div>

        {stats.count > 0 && (
          <ul className="grid gap-1.5" aria-label="Rating breakdown">
            {[5, 4, 3, 2, 1].map((n) => {
              const c = stats.distribution[n - 1];
              return (
                <li key={n} className="flex items-center gap-2 text-xs">
                  <span className="w-8 tabular-nums text-muted-foreground">{n} ★</span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                    <span className="block h-full rounded-full bg-primary" style={{ width: `${(c / stats.count) * 100}%` }} />
                  </span>
                  <span className="w-5 text-right tabular-nums text-muted-foreground">{c}</span>
                </li>
              );
            })}
          </ul>
        )}

        {!writing && (
          <button
            type="button"
            onClick={() => setWriting(true)}
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-input bg-background px-5 text-sm font-semibold hover:bg-muted"
          >
            <PenLine className="size-4" aria-hidden="true" />
            Write a review
          </button>
        )}
      </div>

      <div>
        {writing && (
          <div className="mb-8">
            <ReviewForm product={product} onDone={() => setWriting(false)} />
          </div>
        )}

        {reviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border px-6 py-12 text-center">
            <h3 className="font-display text-xl font-medium">No reviews yet</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              Be the first to share how {product.name} worked for your skin.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
              <h3 className="text-sm font-semibold">
                {reviews.length} review{reviews.length === 1 ? "" : "s"}
              </h3>
              <label className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Sort</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortId)}
                  className="h-9 rounded-lg border border-input bg-background px-2 text-sm"
                >
                  {SORTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div>
              {sorted.slice(0, visible).map((r) => (
                <ReviewItem key={r.id} review={r} />
              ))}
            </div>
            {sorted.length > visible && (
              <button
                type="button"
                onClick={() => setVisible((v) => v + 5)}
                className="mt-2 h-11 rounded-xl border border-input px-5 text-sm font-semibold hover:bg-muted"
              >
                Show more reviews
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
