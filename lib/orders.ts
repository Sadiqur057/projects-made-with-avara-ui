import type { SubscribeInterval, ShippingMethod } from "@/lib/pricing";
import { SHIPPING } from "@/lib/pricing";

export interface OrderItem {
  slug: string;
  name: string;
  sizeLabel: string;
  qty: number;
  unitPrice: number;
  interval: SubscribeInterval | null;
}

export interface OrderAddress {
  line1: string;
  line2?: string;
  city: string;
  region: string;
  postal: string;
  country: string;
}

export interface Order {
  id: string;
  /** Epoch ms */
  createdAt: number;
  email: string;
  name: string;
  address: OrderAddress;
  items: OrderItem[];
  subtotal: number;
  promoDiscount: number;
  promoCode: string | null;
  shipping: number;
  total: number;
  method: ShippingMethod;
}

export const DEMO_ORDER_ID = "AUR-DEMO01";
export const DEMO_ORDER_EMAIL = "demo@aurelle.test";

export function newOrderId(): string {
  // Unambiguous alphabet: no 0/O or 1/I.
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  for (const b of bytes) out += chars[b % chars.length];
  return `AUR-${out}`;
}

/**
 * This store has no carrier integration, so tracking is simulated: stages
 * advance on a short timetable (in minutes) so the flow can be seen end to
 * end. The estimated delivery date shown to the customer is the real one.
 */
export interface TrackingStage {
  id: "placed" | "packed" | "shipped" | "out" | "delivered";
  title: string;
  description: string;
  /** Minutes after the order is placed (demo timetable). */
  atMinutes: number;
}

export const TRACKING_STAGES: TrackingStage[] = [
  { id: "placed", title: "Order confirmed", description: "We have your order and a receipt is on its way to your inbox.", atMinutes: 0 },
  { id: "packed", title: "Packed at the studio", description: "Your products were checked, wrapped and boxed by hand.", atMinutes: 2 },
  { id: "shipped", title: "Handed to the carrier", description: "On its way. Your tracking number is live.", atMinutes: 5 },
  { id: "out", title: "Out for delivery", description: "Your courier is nearby and will arrive today.", atMinutes: 9 },
  { id: "delivered", title: "Delivered", description: "Your parcel was delivered. Enjoy.", atMinutes: 13 },
];

export interface TrackingState {
  /** Index of the latest reached stage. */
  current: number;
  /** Whole minutes until the next stage, or null once delivered. */
  nextInMinutes: number | null;
  delivered: boolean;
  stages: (TrackingStage & { reached: boolean; at: number })[];
  eta: Date;
}

export function trackingFor(order: Order, now: number): TrackingState {
  const speed = order.method === "express" ? 0.65 : 1;
  const stages = TRACKING_STAGES.map((s) => {
    const at = order.createdAt + s.atMinutes * speed * 60000;
    return { ...s, at, reached: now >= at };
  });
  let current = 0;
  stages.forEach((s, i) => {
    if (s.reached) current = i;
  });
  const delivered = current === stages.length - 1;
  const next = delivered ? null : stages[current + 1];
  const nextInMinutes = next
    ? Math.max(1, Math.ceil((next.at - now) / 60000))
    : null;

  const eta = new Date(order.createdAt);
  eta.setDate(eta.getDate() + SHIPPING[order.method].etaDays);

  return { current, nextInMinutes, delivered, stages, eta };
}

/** A sample order that is always mid-journey, so tracking can be tried without buying. */
export function demoOrder(now: number): Order {
  return {
    id: DEMO_ORDER_ID,
    createdAt: now - 6 * 60000,
    email: DEMO_ORDER_EMAIL,
    name: "Demo Customer",
    address: {
      line1: "22 Alder Lane",
      city: "Portland",
      region: "OR",
      postal: "97205",
      country: "United States",
    },
    items: [
      { slug: "bright-side-vitamin-c-serum", name: "Bright Side Vitamin C Serum", sizeLabel: "30 ml", qty: 1, unitPrice: 62.9, interval: 30 },
      { slug: "invisible-shield-spf-50", name: "Invisible Shield SPF 50", sizeLabel: "50 ml", qty: 2, unitPrice: 30, interval: null },
    ],
    subtotal: 122.9,
    promoDiscount: 0,
    promoCode: null,
    shipping: 0,
    total: 122.9,
    method: "standard",
  };
}

/** Builds a new order from a priced cart. Call from event handlers, not render. */
export function buildOrder(input: {
  email: string;
  name: string;
  address: OrderAddress;
  items: OrderItem[];
  subtotal: number;
  promoDiscount: number;
  promoCode: string | null;
  shipping: number;
  total: number;
  method: ShippingMethod;
}): Order {
  return {
    id: newOrderId(),
    createdAt: Date.now(),
    ...input,
    email: input.email.trim().toLowerCase(),
  };
}
