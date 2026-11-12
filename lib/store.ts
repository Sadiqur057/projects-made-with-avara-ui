"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

/* -------------------------------------------------------------------------
 * A tiny localStorage-backed external store. Server snapshots are always the
 * empty value, so server HTML and the first client render match, then React
 * swaps in the saved data without a hydration mismatch.
 * ----------------------------------------------------------------------- */
function createLocalStore<T>(key: string, empty: T) {
  let cache: { raw: string | null | undefined; value: T } = { raw: undefined, value: empty };
  const listeners = new Set<() => void>();

  const read = (): T => {
    if (typeof window === "undefined") return empty;
    let raw: string | null = null;
    try {
      raw = window.localStorage.getItem(key);
    } catch {
      return cache.value === undefined ? empty : cache.value;
    }
    if (raw === cache.raw) return cache.value;
    let value = empty;
    try {
      value = raw ? (JSON.parse(raw) as T) : empty;
    } catch {
      value = empty;
    }
    cache = { raw, value };
    return value;
  };

  const write = (value: T) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage unavailable (private mode): keep the value in memory only
      cache = { raw: JSON.stringify(value), value };
    }
    listeners.forEach((l) => l());
  };

  const subscribe = (cb: () => void) => {
    listeners.add(cb);
    const onStorage = (e: StorageEvent) => {
      if (e.key === key || e.key === null) cb();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(cb);
      window.removeEventListener("storage", onStorage);
    };
  };

  return { read, write, subscribe, getServer: () => empty };
}

/* ------------------------------ Wishlist ------------------------------ */
const EMPTY_IDS: string[] = [];
const wishlistStore = createLocalStore<string[]>("wayfare:wishlist", EMPTY_IDS);

export function useWishlist() {
  const ids = useSyncExternalStore(wishlistStore.subscribe, wishlistStore.read, wishlistStore.getServer);
  const has = useCallback((slug: string) => ids.includes(slug), [ids]);
  const toggle = useCallback((slug: string) => {
    const current = wishlistStore.read();
    wishlistStore.write(current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug]);
  }, []);
  const clear = useCallback(() => wishlistStore.write([]), []);
  return { ids, count: ids.length, has, toggle, clear };
}

/* ------------------------------ Bookings ------------------------------ */
export interface Booking {
  ref: string;
  packageSlug: string;
  packageTitle: string;
  destinationName: string;
  image: string;
  days: number;
  /** ISO date (yyyy-mm-dd) */
  departure: string;
  adults: number;
  children: number;
  addons: { insurance: boolean; transfer: boolean };
  total: number;
  deposit: number;
  paymentMethod: "card" | "paypal" | "bank";
  contact: { name: string; email: string; phone: string; notes?: string };
  createdAt: number;
  cancelledAt?: number;
}

const EMPTY_BOOKINGS: Booking[] = [];
const bookingStore = createLocalStore<Booking[]>("wayfare:bookings", EMPTY_BOOKINGS);

export function newBookingRef() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "WF-";
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export function useBookings() {
  const bookings = useSyncExternalStore(bookingStore.subscribe, bookingStore.read, bookingStore.getServer);
  const add = useCallback((b: Booking) => bookingStore.write([b, ...bookingStore.read()]), []);
  const cancel = useCallback(
    (ref: string) =>
      bookingStore.write(
        bookingStore.read().map((b) => (b.ref === ref ? { ...b, cancelledAt: Date.now() } : b)),
      ),
    [],
  );
  const remove = useCallback(
    (ref: string) => bookingStore.write(bookingStore.read().filter((b) => b.ref !== ref)),
    [],
  );
  return { bookings, add, cancel, remove };
}

/* --------------------------- Newsletter signup -------------------------- */
const newsletterStore = createLocalStore<string[]>("wayfare:newsletter", EMPTY_IDS);
export function subscribeToNewsletter(email: string) {
  const current = newsletterStore.read();
  if (!current.includes(email)) newsletterStore.write([...current, email]);
}

/* ------------------------------ Time hooks ------------------------------ */
const noopSubscribe = () => () => {};
/** false on the server and during hydration, true afterwards. */
export function useHydrated() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

/** Current time in ms, refreshed every `interval` ms. `null` until hydrated. */
export function useNow(interval = 1000) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const first = setTimeout(() => setNow(Date.now()), 0);
    const id = setInterval(() => setNow(Date.now()), interval);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [interval]);
  return now;
}

/* ------------------------------ Tracking ------------------------------ */
export const TRACKING_STAGES = [
  { id: "received", label: "Booking received", detail: "We have your request and a host is being assigned." },
  { id: "confirmed", label: "Payment confirmed", detail: "Deposit received and your places are secured." },
  { id: "documents", label: "Vouchers & documents issued", detail: "Hotel vouchers, itinerary and packing list are in your inbox." },
  { id: "ready", label: "Ready to travel", detail: "Final briefing sent. Your host will meet you on arrival." },
  { id: "travelling", label: "Trip in progress", detail: "Enjoy! Your host is on call 24/7." },
  { id: "completed", label: "Trip completed", detail: "Welcome home. We would love to hear how it went." },
] as const;

export type StageId = (typeof TRACKING_STAGES)[number]["id"];

const DAY = 86_400_000;
/** Demo acceleration: early stages advance within a minute so tracking can be seen working. */
const DEMO_CONFIRM_MS = 15_000;
const DEMO_DOCS_MS = 40_000;

export function parseDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).getTime();
}

export function getStatus(b: Booking, now: number): { index: number; cancelled: boolean; at: (number | null)[] } {
  const start = parseDate(b.departure);
  const end = start + b.days * DAY;
  const at: (number | null)[] = [
    b.createdAt,
    b.createdAt + DEMO_CONFIRM_MS,
    b.createdAt + DEMO_DOCS_MS,
    Math.max(b.createdAt + DEMO_DOCS_MS, start - 7 * DAY),
    start,
    end,
  ];
  if (b.cancelledAt) return { index: -1, cancelled: true, at };
  let index = 0;
  at.forEach((t, i) => {
    if (t !== null && now >= t) index = i;
  });
  return { index, cancelled: false, at: at.map((t, i) => (i <= index ? t : null)) };
}

/** Timestamp helper for event handlers (keeps impure calls out of component bodies). */
export const timestamp = () => Date.now();
