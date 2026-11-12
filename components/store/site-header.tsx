"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  NavbarBlock,
  type EcommerceNavConfig,
  type MegaCategory,
  type MegaMenuProduct,
} from "@/components/custom/blocks/NavbarBlock";
import {
  CONCERNS,
  PRODUCTS,
  STEP_LABEL,
  CONCERN_LABEL,
  productImage,
  saleDiscountFor,
  type Product,
  type Step,
} from "@/lib/catalog";
import { money, money2, priceCart, unitPrice } from "@/lib/pricing";
import { seedStats, useStore } from "@/lib/store";

function megaProduct(p: Product): MegaMenuProduct {
  const price = unitPrice(p, p.sizes[0].id, false);
  const sale = saleDiscountFor(p.slug);
  return {
    id: p.slug,
    name: p.name,
    subtitle: `${p.sizes[0].label} · ${STEP_LABEL[p.step]}`,
    price: money(price.final),
    originalPrice: sale > 0 ? money(price.list) : undefined,
    tag: sale > 0 ? `-${Math.round(sale * 100)}%` : p.bestseller ? "Bestseller" : p.isNew ? "New" : undefined,
    rating: seedStats(p.slug).average || 4.8,
    image: productImage(p.slug, 1),
    href: `/shop/${p.slug}`,
  };
}

const byStep = (...steps: Step[]) => PRODUCTS.filter((p) => steps.includes(p.step));

const stepLinks = (steps: Step[]) =>
  steps.map((s) => ({ name: STEP_LABEL[s], href: `/shop?step=${s}` }));

const SKIN_LINKS = [
  { name: "Oily", href: "/shop?type=oily" },
  { name: "Dry", href: "/shop?type=dry" },
  { name: "Combination", href: "/shop?type=combination" },
  { name: "Sensitive", href: "/shop?type=sensitive" },
];

const CATEGORIES: MegaCategory[] = [
  {
    id: "cleanse",
    name: "Cleanse & tone",
    productsTitle: "Cleanse & tone",
    productsSubtitle: "The first step: gentle, never stripping",
    viewAllHref: "/shop?step=cleanser",
    products: byStep("cleanser", "toner").slice(0, 4).map(megaProduct),
    column1Title: "Shop by step",
    column1Links: stepLinks(["cleanser", "toner"]),
    column2Title: "Shop by skin type",
    column2Links: SKIN_LINKS,
    promo: {
      tag: "2-minute quiz",
      title: "Not sure where to start?",
      subtitle: "Answer five questions and get a routine built for your skin.",
      cta: "Take the skin quiz",
      image: productImage("cloud-cleanse-gel-cleanser", 3),
      href: "/quiz",
    },
  },
  {
    id: "treat",
    name: "Treat",
    productsTitle: "Serums & treatments",
    productsSubtitle: "Targeted formulas for the concerns you care about",
    viewAllHref: "/shop?step=serum",
    products: byStep("serum").slice(0, 4).map(megaProduct),
    column1Title: "Shop by step",
    column1Links: stepLinks(["serum", "eye", "mask", "oil"]),
    column2Title: "Shop by concern",
    column2Links: CONCERNS.slice(0, 4).map((c) => ({ name: c.name, href: `/shop?concern=${c.id}` })),
    promo: {
      tag: "Bestseller",
      title: "Bright Side Vitamin C",
      subtitle: "15% vitamin C for a visibly brighter, more even glow.",
      cta: "Shop the serum",
      image: productImage("bright-side-vitamin-c-serum", 3),
      href: "/shop/bright-side-vitamin-c-serum",
    },
  },
  {
    id: "protect",
    name: "Moisturize & protect",
    productsTitle: "Moisturize & protect",
    productsSubtitle: "Lock it in, then shield it from the sun",
    viewAllHref: "/shop?step=moisturizer",
    products: byStep("moisturizer", "sunscreen").slice(0, 4).map(megaProduct),
    column1Title: "Shop by step",
    column1Links: stepLinks(["moisturizer", "sunscreen"]),
    column2Title: "Shop by skin type",
    column2Links: SKIN_LINKS,
    promo: {
      tag: "Daily essential",
      title: "Invisible Shield SPF 50",
      subtitle: "No white cast, no grease. The step that protects the rest.",
      cta: "Shop sun care",
      image: productImage("invisible-shield-spf-50", 3),
      href: "/shop/invisible-shield-spf-50",
    },
  },
  {
    id: "concern",
    name: "By concern",
    productsTitle: "Our bestsellers",
    productsSubtitle: "Most loved by our community",
    viewAllHref: "/shop?sort=best",
    products: PRODUCTS.filter((p) => p.bestseller).slice(0, 4).map(megaProduct),
    column1Title: "Concerns",
    column1Links: CONCERNS.slice(0, 4).map((c) => ({ name: c.name, href: `/shop?concern=${c.id}` })),
    column2Title: "More concerns",
    column2Links: CONCERNS.slice(4).map((c) => ({ name: c.name, href: `/shop?concern=${c.id}` })),
    promo: {
      tag: "Limited time",
      title: "Flash sale: 25% off",
      subtitle: "Four favourites, today only. Ends at midnight.",
      cta: "See the deals",
      image: productImage("dew-drop-hyaluronic-serum", 3),
      href: "/#flash-sale",
    },
  },
];

const SEARCH_CATALOG = PRODUCTS.map((p) => ({
  title: p.name,
  path: `/shop/${p.slug}`,
  subtitle: `${STEP_LABEL[p.step]} · ${p.concerns.map((c) => CONCERN_LABEL[c]).join(", ")}`,
}));

/**
 * Sticky store header. It slides away while you read down the page and returns
 * the moment you scroll up, so it never eats a quarter of the viewport.
 */
export function SiteHeader() {
  const { cart, favorites, promo } = useStore();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 6) return;
      setHidden(y > 240 && y > last);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const config = useMemo<EcommerceNavConfig>(() => {
    const priced = priceCart(cart, promo);
    return {
      announcement: "Free shipping over $50 · Samples with every order",
      homeHref: "/",
      dealsHref: "/#flash-sale",
      dealsLabel: "Flash sale",
      categories: CATEGORIES,
      staticLinks: [
        { name: "Skin quiz", href: "/quiz" },
        { name: "Track order", href: "/track" },
      ],
      searchPlaceholder: "Search serums, cleansers, dry skin…",
      searchCatalog: SEARCH_CATALOG,
      cart: {
        count: priced.count,
        subtotal: money2(priced.subtotal),
        items: priced.lines.map((l) => ({
          name: l.product.name,
          variant: `${l.size.label}${l.interval ? ` · every ${l.interval} days` : ""}`,
          qty: l.qty,
          price: money2(l.total),
          image: productImage(l.slug, 1),
        })),
        href: "/cart",
        checkoutHref: "/checkout",
      },
      wishlist: { count: favorites.length, href: "/shop?saved=1" },
      account: { href: "/track", label: "Track order" },
    };
  }, [cart, favorites, promo]);

  return (
    <header
      className={
        "sticky top-0 z-50 transition-transform duration-300 motion-reduce:transition-none " +
        (hidden ? "-translate-y-full focus-within:translate-y-0" : "")
      }
    >
      <NavbarBlock
        variant="ecommerce-mega-nav"
        color="primary"
        logoText="Aurelle"
        linkComponent={Link}
        ecommerce={config}
      />
    </header>
  );
}
