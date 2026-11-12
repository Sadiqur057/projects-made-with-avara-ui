import { findCoupon, getProductById, type Coupon, type Product } from "./products";

export interface CartLine {
  /** `${productId}|${color}|${size}` */
  key: string;
  productId: string;
  color: string;
  size: string;
  qty: number;
}

export interface ResolvedLine extends CartLine {
  product: Product;
  unit: number;
  total: number;
  image: string;
}

export type ShippingMethod = "standard" | "express";

export const SHIPPING = {
  standard: { label: "Standard", eta: "3–5 business days", price: 8, days: 5 },
  express: { label: "Express", eta: "1–2 business days", price: 18, days: 2 },
} as const;

export const FREE_SHIPPING_OVER = 120;
export const TAX_RATE = 0.08;

export const money = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: n % 1 ? 2 : 0 }).format(n);

export const lineKey = (productId: string, color: string, size: string) => `${productId}|${color}|${size}`;

export function resolveLines(lines: CartLine[]): ResolvedLine[] {
  const out: ResolvedLine[] = [];
  for (const l of lines) {
    const product = getProductById(l.productId);
    if (!product) continue;
    const color = product.colors.find((c) => c.name === l.color) ?? product.colors[0];
    out.push({
      ...l,
      product,
      unit: product.price,
      total: product.price * l.qty,
      image: product.images[color.image] ?? product.images[0],
    });
  }
  return out;
}

export type CouponCheck = { ok: true; coupon: Coupon } | { ok: false; reason: string };

export function checkCoupon(code: string, subtotal: number): CouponCheck {
  const coupon = findCoupon(code);
  if (!coupon) return { ok: false, reason: "That code isn't valid." };
  if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
    return { ok: false, reason: `Add ${money(coupon.minSubtotal - subtotal)} more to use ${coupon.code}.` };
  }
  return { ok: true, coupon };
}

export interface Totals {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
  couponApplied: Coupon | null;
  couponNote: string | null;
}

export function computeTotals(lines: ResolvedLine[], couponCode: string | null, method: ShippingMethod = "standard"): Totals {
  const subtotal = lines.reduce((s, l) => s + l.total, 0);
  const itemCount = lines.reduce((s, l) => s + l.qty, 0);

  let couponApplied: Coupon | null = null;
  let couponNote: string | null = null;
  if (couponCode) {
    const check = checkCoupon(couponCode, subtotal);
    if (check.ok) couponApplied = check.coupon;
    else couponNote = check.reason;
  }

  let discount = 0;
  if (couponApplied?.kind === "percent") discount = Math.round(subtotal * couponApplied.value) / 100;
  if (couponApplied?.kind === "amount") discount = Math.min(couponApplied.value, subtotal);

  const base = SHIPPING[method].price;
  const freeByThreshold = method === "standard" && subtotal - discount >= FREE_SHIPPING_OVER;
  const freeByCoupon = couponApplied?.kind === "shipping" && method === "standard";
  const shipping = subtotal === 0 || freeByThreshold || freeByCoupon ? 0 : base;

  const taxable = Math.max(0, subtotal - discount);
  const tax = Math.round(taxable * TAX_RATE * 100) / 100;
  const total = Math.round((taxable + shipping + tax) * 100) / 100;

  return { subtotal, discount, shipping, tax, total, itemCount, couponApplied, couponNote };
}

// ---------------------------------------------------------------------------
// Orders & tracking
// ---------------------------------------------------------------------------
export interface OrderItem {
  productId: string;
  name: string;
  color: string;
  size: string;
  qty: number;
  unit: number;
  image: string;
  slug: string;
}

export interface Order {
  id: string;
  placedAt: number;
  items: OrderItem[];
  totals: Omit<Totals, "couponApplied" | "couponNote"> & { couponCode: string | null };
  shippingMethod: ShippingMethod;
  customer: { name: string; email: string; phone: string };
  address: { line1: string; line2?: string; city: string; region: string; postal: string; country: string };
  payment: { method: "card" | "cod"; last4?: string };
}

export const TRACK_STAGES = [
  { key: "placed", title: "Order placed", note: "We've received your order.", at: 0 },
  { key: "confirmed", title: "Payment confirmed", note: "Your payment has cleared.", at: 10 },
  { key: "packed", title: "Packed", note: "Your items are packed and sealed.", at: 25 },
  { key: "shipped", title: "Shipped", note: "Handed to the carrier.", at: 40 },
  { key: "out", title: "Out for delivery", note: "Your courier is on the way.", at: 55 },
  { key: "delivered", title: "Delivered", note: "Enjoy! Left at your door.", at: 70 },
] as const;

/**
 * Demo tracking: stages advance every few seconds after the order is placed, so the
 * tracker can be seen working end-to-end without waiting days.
 */
export function trackingProgress(order: Order, now: number) {
  const elapsed = Math.max(0, (now - order.placedAt) / 1000);
  let current = 0;
  TRACK_STAGES.forEach((s, i) => {
    if (elapsed >= s.at) current = i;
  });
  const done = current === TRACK_STAGES.length - 1;
  return { current, done, elapsed };
}

export function orderId() {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `AVR-${n}`;
}

export const DEMO_ORDER_ID = "AVR-DEMO01";
