/**
 * Client-side store for everything a shopper owns on this device: bag,
 * favourites, their reviews, quiz answers, orders and newsletter status.
 *
 * It is a tiny external store read through `useSyncExternalStore`, so:
 *  - the server and the first client render both see EMPTY (no hydration
 *    mismatch), then the persisted state swaps in;
 *  - every component stays in sync, and so do other tabs (`storage` event).
 *
 * Swap `persist`/`load` for API calls to move this to a real backend.
 */
import { useMemo, useSyncExternalStore } from "react";
import {
  SEED_REVIEWS,
  getProduct,
  type Review,
} from "@/lib/catalog";
import {
  lineKey,
  PROMO_CODES,
  type CartLine,
  type SubscribeInterval,
} from "@/lib/pricing";
import type { Order } from "@/lib/orders";
import type { QuizAnswers } from "@/lib/quiz";
import { toast } from "@/components/custom/blocks/sonner-store";

export interface StoreState {
  cart: CartLine[];
  favorites: string[];
  /** Reviews written on this device. */
  reviews: Review[];
  quiz: QuizAnswers | null;
  orders: Order[];
  newsletter: string | null;
  promo: string | null;
}

const KEY = "aurelle:v1";

const EMPTY: StoreState = {
  cart: [],
  favorites: [],
  reviews: [],
  quiz: null,
  orders: [],
  newsletter: null,
  promo: null,
};

let state: StoreState = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function sanitize(raw: unknown): StoreState {
  if (!raw || typeof raw !== "object") return EMPTY;
  const r = raw as Partial<StoreState>;
  const cart = Array.isArray(r.cart)
    ? r.cart.filter((l): l is CartLine => {
        const p = l && getProduct(l.slug);
        return !!p && p.sizes.some((s) => s.id === l.sizeId) && Number.isFinite(l.qty) && l.qty > 0;
      })
    : [];
  return {
    cart,
    favorites: Array.isArray(r.favorites) ? r.favorites.filter((s) => !!getProduct(s)) : [],
    reviews: Array.isArray(r.reviews) ? r.reviews : [],
    quiz: r.quiz ?? null,
    orders: Array.isArray(r.orders) ? r.orders : [],
    newsletter: typeof r.newsletter === "string" ? r.newsletter : null,
    promo: typeof r.promo === "string" && PROMO_CODES[r.promo] ? r.promo : null,
  };
}

function load(): StoreState {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? sanitize(JSON.parse(raw)) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Private mode or quota: the store keeps working in memory.
  }
}

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  state = load();
}

function emit() {
  listeners.forEach((l) => l());
}

function update(fn: (s: StoreState) => StoreState) {
  ensureLoaded();
  state = fn(state);
  persist();
  emit();
}

let storageBound = false;
function bindStorage() {
  if (storageBound || typeof window === "undefined") return;
  storageBound = true;
  window.addEventListener("storage", (e) => {
    if (e.key !== KEY) return;
    state = load();
    emit();
  });
}

function subscribe(listener: () => void) {
  bindStorage();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): StoreState {
  ensureLoaded();
  return state;
}

function getServerSnapshot(): StoreState {
  return EMPTY;
}

export function useStore(): StoreState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** False on the server and during hydration, true once persisted state is in. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

/* ───────────────────────── derived hooks ───────────────────────── */

export function useFavorite(slug: string): boolean {
  const { favorites } = useStore();
  return favorites.includes(slug);
}

export function useCartCount(): number {
  const { cart } = useStore();
  return cart.reduce((n, l) => n + l.qty, 0);
}

export interface RatingStats {
  average: number;
  count: number;
  /** Index 0 = 1 star … 4 = 5 stars */
  distribution: number[];
}

export function statsFor(reviews: Review[]): RatingStats {
  const distribution = [0, 0, 0, 0, 0];
  let sum = 0;
  for (const r of reviews) {
    distribution[Math.min(4, Math.max(0, Math.round(r.rating) - 1))] += 1;
    sum += r.rating;
  }
  return {
    average: reviews.length ? Math.round((sum / reviews.length) * 10) / 10 : 0,
    count: reviews.length,
    distribution,
  };
}

/** Every review for a product: shipped seed reviews plus ones written here. */
export function useProductReviews(slug: string): { reviews: Review[]; stats: RatingStats } {
  const { reviews: mine } = useStore();
  return useMemo(() => {
    const all = [...mine.filter((r) => r.productSlug === slug), ...SEED_REVIEWS.filter((r) => r.productSlug === slug)].sort(
      (a, b) => b.date.localeCompare(a.date),
    );
    return { reviews: all, stats: statsFor(all) };
  }, [mine, slug]);
}

/** Rating for a product without the review list — for cards. */
export function useProductRating(slug: string): RatingStats {
  return useProductReviews(slug).stats;
}

/** Seed ratings only — safe to compute on the server. */
export function seedStats(slug: string): RatingStats {
  return statsFor(SEED_REVIEWS.filter((r) => r.productSlug === slug));
}

/* ───────────────────────── actions ───────────────────────── */

export const actions = {
  addToCart(slug: string, sizeId: string, qty = 1, interval: SubscribeInterval | null = null) {
    const product = getProduct(slug);
    if (!product) return;
    const key = lineKey(slug, sizeId, interval);
    update((s) => {
      const existing = s.cart.find((l) => l.key === key);
      const cart = existing
        ? s.cart.map((l) => (l.key === key ? { ...l, qty: Math.min(10, l.qty + qty) } : l))
        : [...s.cart, { key, slug, sizeId, qty: Math.min(10, qty), interval }];
      return { ...s, cart };
    });
    const size = product.sizes.find((z) => z.id === sizeId);
    toast.success(`Added to your bag`, {
      description: `${product.name}${size ? ` · ${size.label}` : ""}${interval ? ` · every ${interval} days` : ""}`,
    });
  },

  setQty(key: string, qty: number) {
    update((s) => ({
      ...s,
      cart:
        qty <= 0
          ? s.cart.filter((l) => l.key !== key)
          : s.cart.map((l) => (l.key === key ? { ...l, qty: Math.min(10, qty) } : l)),
    }));
  },

  removeLine(key: string) {
    update((s) => ({ ...s, cart: s.cart.filter((l) => l.key !== key) }));
  },

  /** Switch a line between one-time and subscription, merging if a twin exists. */
  setInterval(key: string, interval: SubscribeInterval | null) {
    update((s) => {
      const line = s.cart.find((l) => l.key === key);
      if (!line) return s;
      const nextKey = lineKey(line.slug, line.sizeId, interval);
      const twin = s.cart.find((l) => l.key === nextKey && l.key !== key);
      const rest = s.cart.filter((l) => l.key !== key && l.key !== nextKey);
      const merged: CartLine = {
        ...line,
        key: nextKey,
        interval,
        qty: Math.min(10, line.qty + (twin?.qty ?? 0)),
      };
      const index = s.cart.findIndex((l) => l.key === key);
      const cart = [...rest];
      cart.splice(Math.min(index, cart.length), 0, merged);
      return { ...s, cart };
    });
  },

  setSize(key: string, sizeId: string) {
    update((s) => {
      const line = s.cart.find((l) => l.key === key);
      if (!line) return s;
      const nextKey = lineKey(line.slug, sizeId, line.interval);
      const twin = s.cart.find((l) => l.key === nextKey && l.key !== key);
      const rest = s.cart.filter((l) => l.key !== key && l.key !== nextKey);
      const merged: CartLine = { ...line, key: nextKey, sizeId, qty: Math.min(10, line.qty + (twin?.qty ?? 0)) };
      const index = s.cart.findIndex((l) => l.key === key);
      const cart = [...rest];
      cart.splice(Math.min(index, cart.length), 0, merged);
      return { ...s, cart };
    });
  },

  clearCart() {
    update((s) => ({ ...s, cart: [] }));
  },

  toggleFavorite(slug: string) {
    const product = getProduct(slug);
    ensureLoaded();
    const has = state.favorites.includes(slug);
    update((s) => ({
      ...s,
      favorites: has ? s.favorites.filter((f) => f !== slug) : [...s.favorites, slug],
    }));
    if (product) {
      toast(has ? "Removed from favourites" : "Saved to favourites", { description: product.name });
    }
  },

  addReview(review: Omit<Review, "id" | "date" | "mine">) {
    const full: Review = {
      ...review,
      id: `mine-${Date.now().toString(36)}`,
      date: new Date().toISOString().slice(0, 10),
      mine: true,
    };
    update((s) => ({ ...s, reviews: [full, ...s.reviews] }));
    toast.success("Thanks for your review", { description: "It now appears on the product page." });
  },

  deleteReview(id: string) {
    update((s) => ({ ...s, reviews: s.reviews.filter((r) => r.id !== id) }));
  },

  saveQuiz(answers: QuizAnswers) {
    update((s) => ({ ...s, quiz: answers }));
  },

  clearQuiz() {
    update((s) => ({ ...s, quiz: null }));
  },

  /** Returns false when the code is not valid. */
  applyPromo(code: string): boolean {
    const normalized = code.trim().toUpperCase();
    if (!PROMO_CODES[normalized]) return false;
    update((s) => ({ ...s, promo: normalized }));
    return true;
  },

  removePromo() {
    update((s) => ({ ...s, promo: null }));
  },

  placeOrder(order: Order) {
    update((s) => ({
      ...s,
      orders: [order, ...s.orders],
      cart: [],
      promo: null,
    }));
  },

  subscribeNewsletter(email: string) {
    update((s) => ({ ...s, newsletter: email }));
  },
};
