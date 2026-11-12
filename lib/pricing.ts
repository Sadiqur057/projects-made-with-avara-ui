import {
  getProduct,
  saleDiscountFor,
  type Product,
  type Size,
} from "@/lib/catalog";

export const SUBSCRIBE_DISCOUNT = 0.15;
export const SUBSCRIBE_INTERVALS = [30, 45, 60, 90] as const;
export type SubscribeInterval = (typeof SUBSCRIBE_INTERVALS)[number];

export const FREE_SHIPPING_THRESHOLD = 50;

export type ShippingMethod = "standard" | "express";
export const SHIPPING: Record<
  ShippingMethod,
  { label: string; price: number; days: string; etaDays: number }
> = {
  standard: { label: "Standard", price: 6, days: "3–5 business days", etaDays: 4 },
  express: { label: "Express", price: 14, days: "1–2 business days", etaDays: 2 },
};

/** Promo codes → fraction off the merchandise subtotal. */
export const PROMO_CODES: Record<string, { rate: number; label: string }> = {
  AURELLE10: { rate: 0.1, label: "10% off your order" },
  WELCOME15: { rate: 0.15, label: "15% off your first order" },
};

export interface CartLine {
  /** `${slug}:${sizeId}:${interval ?? 0}` */
  key: string;
  slug: string;
  sizeId: string;
  qty: number;
  /** Days between shipments, or null for a one-time purchase. */
  interval: SubscribeInterval | null;
}

export const lineKey = (slug: string, sizeId: string, interval: number | null) =>
  `${slug}:${sizeId}:${interval ?? 0}`;

export const money = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
  }).format(n);

/** Always two decimals — for totals and line items. */
export const money2 = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const cents = (n: number) => Math.round(n * 100) / 100;

export function getSize(product: Product, sizeId: string): Size {
  return product.sizes.find((s) => s.id === sizeId) ?? product.sizes[0];
}

export interface UnitPrice {
  /** List price for the size. */
  list: number;
  /** Price after flash-sale discount only. */
  sale: number;
  /** What the customer actually pays per unit. */
  final: number;
  onSale: boolean;
  subscribed: boolean;
  saleRate: number;
}

export function unitPrice(
  product: Product,
  sizeId: string,
  subscribed: boolean,
): UnitPrice {
  const list = getSize(product, sizeId).price;
  const saleRate = saleDiscountFor(product.slug);
  const sale = cents(list * (1 - saleRate));
  const final = cents(sale * (subscribed ? 1 - SUBSCRIBE_DISCOUNT : 1));
  return { list, sale, final, onSale: saleRate > 0, subscribed, saleRate };
}

export interface PricedLine extends CartLine {
  product: Product;
  size: Size;
  price: UnitPrice;
  total: number;
}

export interface CartTotals {
  lines: PricedLine[];
  count: number;
  /** Sum at list prices, before any discount. */
  listTotal: number;
  /** Sum of line totals (sale + subscription already applied). */
  subtotal: number;
  promoRate: number;
  promoLabel: string | null;
  promoDiscount: number;
  shipping: number;
  freeShipping: boolean;
  /** Amount left to unlock free shipping (0 when already unlocked). */
  toFreeShipping: number;
  total: number;
  hasSubscription: boolean;
}

export function priceCart(
  cart: CartLine[],
  promo: string | null,
  method: ShippingMethod = "standard",
): CartTotals {
  const lines: PricedLine[] = [];
  for (const line of cart) {
    const product = getProduct(line.slug);
    if (!product) continue;
    const size = getSize(product, line.sizeId);
    const price = unitPrice(product, size.id, line.interval !== null);
    lines.push({ ...line, product, size, price, total: cents(price.final * line.qty) });
  }

  const count = lines.reduce((n, l) => n + l.qty, 0);
  const listTotal = cents(lines.reduce((n, l) => n + l.price.list * l.qty, 0));
  const subtotal = cents(lines.reduce((n, l) => n + l.total, 0));

  const code = promo ? PROMO_CODES[promo.toUpperCase()] : undefined;
  const promoRate = code?.rate ?? 0;
  const promoDiscount = cents(subtotal * promoRate);
  const afterPromo = cents(subtotal - promoDiscount);

  const freeShipping = afterPromo >= FREE_SHIPPING_THRESHOLD && method === "standard";
  const shipping =
    lines.length === 0
      ? 0
      : method === "express"
        ? SHIPPING.express.price
        : freeShipping
          ? 0
          : SHIPPING.standard.price;

  return {
    lines,
    count,
    listTotal,
    subtotal,
    promoRate,
    promoLabel: code ? code.label : null,
    promoDiscount,
    shipping,
    freeShipping,
    toFreeShipping: cents(Math.max(0, FREE_SHIPPING_THRESHOLD - afterPromo)),
    total: cents(afterPromo + shipping),
    hasSubscription: lines.some((l) => l.interval !== null),
  };
}
