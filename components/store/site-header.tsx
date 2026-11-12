"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDeferredValue, useMemo, useState } from "react";
import { ArrowRight, Heart, Menu, PackageSearch, Search, ShoppingBag, Truck } from "lucide-react";
import { MarqueeBlock } from "@/components/custom/blocks/MarqueeBlock";
import { Dialog, DialogContent } from "@/components/custom/blocks/DialogBlock";
import { Drawer, DrawerContent, DrawerHeader, DrawerOverlay, DrawerTitle } from "@/components/custom/blocks/Drawer";
import { cn } from "@/lib/utils";
import { categories, categoryName, products } from "@/lib/store/products";
import { money } from "@/lib/store/pricing";
import { useCart, useUi, useWishlist } from "@/lib/store/store";

const NAV = [
  { label: "Shop", href: "/shop" },
  { label: "New in", href: "/shop?sort=newest" },
  { label: "Sale", href: "/shop?sale=1" },
  { label: "Lookbook", href: "/#lookbook" },
  { label: "Track order", href: "/track" },
];

function Count({ n }: { n: number }) {
  if (n <= 0) return null;
  return (
    <span className="absolute -right-0.5 -top-0.5 grid min-w-[1.1rem] place-items-center rounded-full bg-primary px-1 text-[10px] font-bold leading-[1.1rem] text-primary-foreground" aria-hidden>
      {n > 9 ? "9+" : n}
    </span>
  );
}

function SearchDialog() {
  const { searchOpen, setSearchOpen } = useUi();
  const [q, setQ] = useState("");
  const deferred = useDeferredValue(q);
  const results = useMemo(() => {
    const needle = deferred.trim().toLowerCase();
    if (!needle) return products.filter((p) => p.featured).slice(0, 5);
    return products
      .filter((p) => `${p.name} ${categoryName(p.category)} ${p.blurb}`.toLowerCase().includes(needle))
      .slice(0, 6);
  }, [deferred]);

  return (
    <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
      <DialogContent size="lg" className="p-0">
        <div className="border-b border-border p-4 pr-14">
          <label className="relative block">
            <span className="sr-only">Search products</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search dresses, coats, tees…"
              className="h-12 w-full rounded-xl bg-muted pl-11 pr-4 text-base outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/40"
            />
          </label>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-2">
          <p className="px-3 pb-1 pt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">{q.trim() ? `${results.length} result${results.length === 1 ? "" : "s"}` : "Popular right now"}</p>
          {results.length === 0 && <p className="px-3 py-8 text-center text-sm text-muted-foreground">Nothing matches &ldquo;{q}&rdquo;. Try &ldquo;coat&rdquo; or &ldquo;dress&rdquo;.</p>}
          <ul>
            {results.map((p) => (
              <li key={p.id}>
                <Link href={`/product/${p.slug}`} onClick={() => setSearchOpen(false)} className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.images[0]} alt="" className="size-14 rounded-lg object-cover" style={{ backgroundColor: p.tone }} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{p.name}</span>
                    <span className="block text-xs text-muted-foreground">{categoryName(p.category)}</span>
                  </span>
                  <span className="text-sm font-semibold tabular-nums">{money(p.price)}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href={q.trim() ? `/shop?q=${encodeURIComponent(q.trim())}` : "/shop"} onClick={() => setSearchOpen(false)} className="mt-1 flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-primary transition hover:bg-primary/5">
            {q.trim() ? `See all results for “${q.trim()}”` : "Browse the full collection"}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MobileMenu() {
  const { menuOpen, setMenuOpen } = useUi();
  return (
    <Drawer open={menuOpen} onOpenChange={setMenuOpen} side="left">
      <DrawerOverlay />
      <DrawerContent className="w-[360px] rounded-none sm:rounded-r-2xl">
        <DrawerHeader>
          <DrawerTitle className="font-heading text-3xl tracking-tight">AVARA</DrawerTitle>
        </DrawerHeader>
        <nav aria-label="Mobile" className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {NAV.map((n) => (
              <li key={n.label}>
                <Link href={n.href} onClick={() => setMenuOpen(false)} className="flex items-center justify-between rounded-xl px-4 py-3 text-lg font-medium transition hover:bg-muted">
                  {n.label}
                  <ArrowRight className="size-4 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Categories</p>
          <ul className="mt-2 grid grid-cols-2 gap-2 px-1">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`/shop?category=${c.id}`} onClick={() => setMenuOpen(false)} className="block rounded-xl border border-border px-3 py-2.5 text-sm transition hover:border-primary hover:text-primary">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/wishlist" onClick={() => setMenuOpen(false)} className="mt-6 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-muted">
            <Heart className="size-4" /> Wishlist
          </Link>
        </nav>
      </DrawerContent>
    </Drawer>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const { totals } = useCart();
  const wishlist = useWishlist();
  const { setCartOpen, setSearchOpen, setMenuOpen } = useUi();
  const [megaOpen, setMegaOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="bg-foreground text-background">
        <MarqueeBlock speed={40} gap="3rem" className="py-2 text-xs font-medium tracking-wide">
          <span className="flex items-center gap-2"><Truck className="size-3.5" /> Free standard shipping over $120</span>
          <span>Use <strong>WELCOME10</strong> for 10% off your first order</span>
          <span>Flash sale: up to 25% off, ends tonight</span>
          <span>30-day easy returns</span>
        </MarqueeBlock>
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:h-[4.5rem]">
        <button type="button" aria-label="Open menu" onClick={() => setMenuOpen(true)} className="-ml-2 grid size-10 place-items-center rounded-full transition hover:bg-muted lg:hidden">
          <Menu className="size-5" />
        </button>

        <Link href="/" className="font-heading text-[1.75rem] leading-none tracking-[0.04em]" aria-label="AVARA home">
          AVARA
        </Link>

        <nav aria-label="Primary" className="ml-8 hidden items-center gap-1 lg:flex" onMouseLeave={() => setMegaOpen(false)}>
          {NAV.map((n) => {
            const active = n.href === "/shop" ? pathname === "/shop" : pathname === n.href.split("?")[0] && n.href.indexOf("?") === -1 && n.href.indexOf("#") === -1;
            return (
              <div key={n.label} onMouseEnter={() => setMegaOpen(n.label === "Shop")} className="relative">
                <Link
                  href={n.href}
                  aria-current={active ? "page" : undefined}
                  onFocus={() => setMegaOpen(n.label === "Shop")}
                  className={cn("rounded-full px-3.5 py-2 text-sm font-medium transition hover:bg-muted", active && "bg-muted", n.label === "Sale" && "text-primary")}
                >
                  {n.label}
                </Link>
              </div>
            );
          })}
          {/* Mega panel */}
          <div className={cn("absolute inset-x-0 top-full border-b border-border bg-background shadow-[0_30px_50px_-30px_rgb(0_0_0/0.25)] transition duration-200", megaOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0")}>
            <div className="mx-auto grid max-w-7xl grid-cols-6 gap-4 px-6 py-6">
              {categories.map((c) => (
                <Link key={c.id} href={`/shop?category=${c.id}`} onClick={() => setMegaOpen(false)} tabIndex={megaOpen ? 0 : -1} className="group">
                  <div className="aspect-[4/5] overflow-hidden rounded-xl bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.image} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                  <p className="mt-2 text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.blurb}</p>
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
          <button type="button" aria-label="Search" onClick={() => setSearchOpen(true)} className="grid size-10 place-items-center rounded-full transition hover:bg-muted">
            <Search className="size-5" />
          </button>
          <Link href="/track" aria-label="Track order" className="hidden size-10 place-items-center rounded-full transition hover:bg-muted sm:grid">
            <PackageSearch className="size-5" />
          </Link>
          <Link href="/wishlist" aria-label={`Wishlist, ${wishlist.length} items`} className="relative grid size-10 place-items-center rounded-full transition hover:bg-muted">
            <Heart className="size-5" />
            <Count n={wishlist.length} />
          </Link>
          <button type="button" aria-label={`Open bag, ${totals.itemCount} items`} onClick={() => setCartOpen(true)} className="relative grid size-10 place-items-center rounded-full transition hover:bg-muted">
            <ShoppingBag className="size-5" />
            <Count n={totals.itemCount} />
          </button>
        </div>
      </div>

      <SearchDialog />
      <MobileMenu />
    </header>
  );
}
