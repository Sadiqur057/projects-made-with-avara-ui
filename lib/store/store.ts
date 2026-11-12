"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
  DEMO_ORDER_ID,
  SHIPPING,
  checkCoupon,
  computeTotals,
  lineKey,
  orderId,
  resolveLines,
  type CartLine,
  type CouponCheck,
  type Order,
  type ShippingMethod,
} from "./pricing";
import { getProductById } from "./products";

// ---------------------------------------------------------------------------
// A tiny external store, persisted to localStorage.
// Server snapshot is always EMPTY so hydration matches; the client reads
// localStorage lazily on first access and stays in sync across tabs.
// ---------------------------------------------------------------------------

interface ShopState {
  cart: CartLine[];
  wishlist: string[];
  coupon: string | null;
  orders: Order[];
}

const EMPTY: ShopState = { cart: [], wishlist: [], coupon: null, orders: [] };
const STORAGE_KEY = "avara:shop:v1";

let state: ShopState = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function read(): ShopState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<ShopState>;
    return {
      cart: Array.isArray(parsed.cart) ? parsed.cart : [],
      wishlist: Array.isArray(parsed.wishlist) ? parsed.wishlist : [],
      coupon: typeof parsed.coupon === "string" ? parsed.coupon : null,
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
    };
  } catch {
    return EMPTY;
  }
}

function commit(next: ShopState) {
  state = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* storage full or blocked — keep working in memory */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    state = read();
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): ShopState {
  if (!loaded) {
    loaded = true;
    state = read();
  }
  return state;
}

const getServerSnapshot = () => EMPTY;

// --- UI state (not persisted) ---------------------------------------------
interface UiState {
  cartOpen: boolean;
  searchOpen: boolean;
  menuOpen: boolean;
}
let ui: UiState = { cartOpen: false, searchOpen: false, menuOpen: false };
const uiListeners = new Set<() => void>();
const UI_SERVER: UiState = ui;
function setUi(patch: Partial<UiState>) {
  ui = { ...ui, ...patch };
  uiListeners.forEach((l) => l());
}
const subscribeUi = (l: () => void) => {
  uiListeners.add(l);
  return () => {
    uiListeners.delete(l);
  };
};

export function useUi() {
  const snap = useSyncExternalStore(subscribeUi, () => ui, () => UI_SERVER);
  return {
    ...snap,
    setCartOpen: useCallback((cartOpen: boolean) => setUi({ cartOpen }), []),
    setSearchOpen: useCallback((searchOpen: boolean) => setUi({ searchOpen }), []),
    setMenuOpen: useCallback((menuOpen: boolean) => setUi({ menuOpen }), []),
  };
}

// --- Actions ---------------------------------------------------------------
export function addToCart(productId: string, color: string, size: string, qty = 1) {
  const s = getSnapshot();
  const key = lineKey(productId, color, size);
  const existing = s.cart.find((l) => l.key === key);
  const cart = existing
    ? s.cart.map((l) => (l.key === key ? { ...l, qty: Math.min(10, l.qty + qty) } : l))
    : [...s.cart, { key, productId, color, size, qty: Math.min(10, qty) }];
  commit({ ...s, cart });
}

export function setQty(key: string, qty: number) {
  const s = getSnapshot();
  const cart =
    qty <= 0 ? s.cart.filter((l) => l.key !== key) : s.cart.map((l) => (l.key === key ? { ...l, qty: Math.min(10, qty) } : l));
  commit({ ...s, cart });
}

export function removeLine(key: string) {
  const s = getSnapshot();
  commit({ ...s, cart: s.cart.filter((l) => l.key !== key) });
}

export function toggleWishlist(productId: string): boolean {
  const s = getSnapshot();
  const has = s.wishlist.includes(productId);
  commit({ ...s, wishlist: has ? s.wishlist.filter((id) => id !== productId) : [...s.wishlist, productId] });
  return !has;
}

export function clearWishlist() {
  commit({ ...getSnapshot(), wishlist: [] });
}

export function applyCoupon(code: string): CouponCheck {
  const s = getSnapshot();
  const subtotal = resolveLines(s.cart).reduce((n, l) => n + l.total, 0);
  if (!code.trim()) return { ok: false, reason: "Enter a code first." };
  const check = checkCoupon(code, subtotal);
  if (check.ok) commit({ ...s, coupon: check.coupon.code });
  return check;
}

export function removeCoupon() {
  commit({ ...getSnapshot(), coupon: null });
}

export interface CheckoutInput {
  customer: Order["customer"];
  address: Order["address"];
  shippingMethod: ShippingMethod;
  payment: Order["payment"];
}

export function placeOrder(input: CheckoutInput): Order | null {
  const s = getSnapshot();
  const lines = resolveLines(s.cart);
  if (lines.length === 0) return null;
  const t = computeTotals(lines, s.coupon, input.shippingMethod);
  const order: Order = {
    id: orderId(),
    // Order time is captured at the moment of the click, never during render.
    placedAt: Date.now(),
    items: lines.map((l) => ({
      productId: l.productId,
      name: l.product.name,
      color: l.color,
      size: l.size,
      qty: l.qty,
      unit: l.unit,
      image: l.image,
      slug: l.product.slug,
    })),
    totals: {
      subtotal: t.subtotal,
      discount: t.discount,
      shipping: t.shipping,
      tax: t.tax,
      total: t.total,
      itemCount: t.itemCount,
      couponCode: t.couponApplied?.code ?? null,
    },
    shippingMethod: input.shippingMethod,
    customer: input.customer,
    address: input.address,
    payment: input.payment,
  };
  commit({ ...s, cart: [], coupon: null, orders: [order, ...s.orders] });
  return order;
}

/** Creates (once) a sample order so the tracker can be tried without buying anything. */
export function ensureDemoOrder(): Order {
  const s = getSnapshot();
  const existing = s.orders.find((o) => o.id === DEMO_ORDER_ID);
  if (existing) return existing;
  const picks = ["p05", "p09"].map((id) => getProductById(id)!).filter(Boolean);
  const items = picks.map((p) => ({
    productId: p.id,
    name: p.name,
    color: p.colors[0].name,
    size: "M",
    qty: 1,
    unit: p.price,
    image: p.images[0],
    slug: p.slug,
  }));
  const subtotal = items.reduce((n, i) => n + i.unit * i.qty, 0);
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const order: Order = {
    id: DEMO_ORDER_ID,
    // Pretend it was placed 20 seconds ago so the tracker is already mid-flight.
    placedAt: Date.now() - 20_000,
    items,
    totals: { subtotal, discount: 0, shipping: 0, tax, total: subtotal + tax, itemCount: items.length, couponCode: null },
    shippingMethod: "standard",
    customer: { name: "Demo Customer", email: "demo@avara.store", phone: "+1 555 0100" },
    address: { line1: "12 Atelier Lane", city: "Brooklyn", region: "NY", postal: "11201", country: "United States" },
    payment: { method: "card", last4: "4242" },
  };
  commit({ ...s, orders: [order, ...s.orders] });
  return order;
}

export function findOrder(id: string): Order | undefined {
  const needle = id.trim().toUpperCase();
  return getSnapshot().orders.find((o) => o.id.toUpperCase() === needle);
}

// --- Hooks -----------------------------------------------------------------
export function useShopState() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** True once the client has read persisted state; false during SSR / hydration. */
export function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function useCart(method: ShippingMethod = "standard") {
  const { cart, coupon } = useShopState();
  return useMemo(() => {
    const lines = resolveLines(cart);
    return { lines, totals: computeTotals(lines, coupon, method), coupon };
  }, [cart, coupon, method]);
}

export function useWishlist() {
  const { wishlist } = useShopState();
  return wishlist;
}

export { SHIPPING };
