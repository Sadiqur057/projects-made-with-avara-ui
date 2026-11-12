"use client";

// Avara UI "product-details" — color-sync-gallery variant, adapted for the AVARA
// storefront: the stage image follows the selected colour, hovering magnifies it,
// and the buy box is wired to real cart / wishlist state instead of demo data.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Heart, Minus, Plus, RotateCcw, Ruler, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "./Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./DialogBlock";
import { HalfStars } from "./HalfStarsBlock";
import { ColorPicker, SizePicker } from "@/components/store/variant-picker";
import { useShop } from "@/components/store/use-shop";
import { categoryName, testimonials, type Product } from "@/lib/store/products";
import { money } from "@/lib/store/pricing";
import { useWishlist } from "@/lib/store/store";

type Tab = "details" | "shipping" | "reviews";

const SIZE_CHART = [
  ["XS", "82–86", "62–66", "88–92"],
  ["S", "86–90", "66–70", "92–96"],
  ["M", "90–96", "70–76", "96–102"],
  ["L", "96–102", "76–82", "102–108"],
  ["XL", "102–110", "82–90", "108–116"],
];

function SizeGuide() {
  return (
    <Dialog>
      <DialogTrigger className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary underline-offset-4 hover:underline">
        <Ruler className="size-3.5" /> Size guide
      </DialogTrigger>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">Size guide</DialogTitle>
        </DialogHeader>
        <p className="mt-2 text-sm text-muted-foreground">Body measurements in cm. If you&rsquo;re between sizes, we recommend sizing up for a relaxed fit.</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                <th className="py-2 pr-4 font-medium">Size</th>
                <th className="py-2 pr-4 font-medium">Chest</th>
                <th className="py-2 pr-4 font-medium">Waist</th>
                <th className="py-2 font-medium">Hip</th>
              </tr>
            </thead>
            <tbody>
              {SIZE_CHART.map((r) => (
                <tr key={r[0]} className="border-b border-border/60 last:border-0">
                  {r.map((c, i) => (
                    <td key={i} className={cn("py-2.5 pr-4", i === 0 && "font-semibold")}>
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ProductDetails({ product, className }: { product: Product; className?: string }) {
  const router = useRouter();
  const { add, toggleFavourite } = useShop();
  const wishlist = useWishlist();
  const saved = wishlist.includes(product.id);

  const [colorName, setColorName] = useState(product.colors[0].name);
  const [imageIdx, setImageIdx] = useState(product.colors[0].image);
  const [size, setSize] = useState<string | null>(product.sizes.length === 1 ? product.sizes[0] : null);
  const [needsSize, setNeedsSize] = useState(false);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<Tab>("details");
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);

  const off = product.compareAt ? Math.round((1 - product.price / product.compareAt) * 100) : 0;

  const pickColor = (name: string) => {
    setColorName(name);
    const c = product.colors.find((x) => x.name === name);
    if (c) setImageIdx(c.image);
  };

  const pickImage = (i: number) => {
    setImageIdx(i);
    const c = product.colors.find((x) => x.image === i);
    if (c) setColorName(c.name);
  };

  const validate = () => {
    if (!size) {
      setNeedsSize(true);
      return false;
    }
    return true;
  };

  const addToBag = () => {
    if (!validate()) return;
    add(product.id, colorName, size!, qty, { openCart: true });
  };

  const buyNow = () => {
    if (!validate()) return;
    add(product.id, colorName, size!, qty);
    router.push("/checkout");
  };

  return (
    <div className={cn("mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12", className)}>
      {/* Header: name and live price */}
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-end">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary">
              {categoryName(product.category)}
            </span>
            <HalfStars rating={product.rating} size={15} />
            <span className="text-xs font-semibold">{product.rating}</span>
            <a href="#reviews" onClick={() => setTab("reviews")} className="text-xs text-muted-foreground underline-offset-4 hover:underline">
              ({product.reviews.toLocaleString()} reviews)
            </a>
          </div>
          <h1 className="font-heading text-4xl leading-[1.02] sm:text-6xl">{product.name}</h1>
          <p className="text-muted-foreground">{product.blurb}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="sm:text-right">
            {product.compareAt && <span className="block text-sm text-muted-foreground line-through">{money(product.compareAt)}</span>}
            <span className="text-3xl font-semibold tabular-nums sm:text-4xl">{money(product.price)}</span>
          </div>
          {off > 0 && <span className="rounded-2xl bg-primary px-3 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground">Save {off}%</span>}
        </div>
      </div>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-12 lg:gap-12">
        {/* Stage */}
        <div className="lg:col-span-7">
          <div className="flex gap-3">
            {product.images.length > 1 && (
              <div className="flex w-16 shrink-0 flex-col gap-2 sm:w-20">
                {product.images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    aria-label={`View image ${i + 1}`}
                    aria-current={imageIdx === i}
                    onClick={() => pickImage(i)}
                    className={cn("aspect-[3/4] overflow-hidden rounded-xl border-2 transition", imageIdx === i ? "border-foreground" : "border-transparent opacity-70 hover:opacity-100")}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            <div
              className="group relative aspect-[4/5] flex-1 cursor-zoom-in overflow-hidden rounded-3xl border border-border"
              style={{ backgroundColor: product.tone }}
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
              }}
              onMouseLeave={() => setZoom(null)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={product.images[imageIdx]}
                src={product.images[imageIdx]}
                alt={`${product.name} in ${colorName}`}
                className="h-full w-full animate-in fade-in object-cover duration-500"
                style={zoom ? { transform: "scale(2)", transformOrigin: `${zoom.x}% ${zoom.y}%`, transition: "transform-origin 80ms linear" } : { transition: "transform 300ms ease" }}
              />
              {product.badge && <span className="absolute left-4 top-4 rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-background">{product.badge}</span>}
              <button
                type="button"
                aria-pressed={saved}
                aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
                onClick={() => toggleFavourite(product.id)}
                className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-background/90 shadow-sm backdrop-blur transition hover:scale-110"
              >
                <Heart className={cn("size-5", saved && "fill-primary text-primary")} />
              </button>
            </div>
          </div>
        </div>

        {/* Buy box */}
        <div className="space-y-7 lg:col-span-5">
          <p className="leading-relaxed text-muted-foreground">{product.description}</p>

          <div className="flex items-center gap-2.5 rounded-2xl border border-border bg-card p-4 text-sm">
            <span className="size-2 shrink-0 animate-pulse rounded-full bg-emerald-500" />
            <span className="font-semibold">In stock</span>
            <span className="text-muted-foreground">· ships within 24 hours</span>
          </div>

          <ColorPicker colors={product.colors} value={colorName} onChange={pickColor} />

          <div className="space-y-3">
            <SizePicker
              sizes={product.sizes}
              value={size}
              onChange={(s) => {
                setSize(s);
                setNeedsSize(false);
              }}
              error={needsSize}
            />
            <SizeGuide />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex items-center justify-between rounded-full border border-border bg-card p-1 sm:min-w-[9.5rem]">
              <button type="button" aria-label="Decrease quantity" disabled={qty <= 1} onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid size-10 place-items-center rounded-full transition hover:bg-muted disabled:opacity-40">
                <Minus className="size-4" />
              </button>
              <span className="w-8 text-center text-sm font-semibold tabular-nums" aria-live="polite">
                {qty}
              </span>
              <button type="button" aria-label="Increase quantity" disabled={qty >= 10} onClick={() => setQty((q) => Math.min(10, q + 1))} className="grid size-10 place-items-center rounded-full transition hover:bg-muted disabled:opacity-40">
                <Plus className="size-4" />
              </button>
            </div>
            <Button variant="default" onClick={addToBag} className="h-12 flex-1 gap-2 rounded-full text-sm font-semibold" iconLeft={<ShoppingBag className="size-4" />}>
              Add to bag · {money(product.price * qty)}
            </Button>
          </div>
          <Button variant="outline" onClick={buyNow} className="h-12 w-full rounded-full text-sm font-semibold">
            Buy it now
          </Button>

          <ul className="grid grid-cols-3 gap-2.5 border-t border-border pt-6 text-center text-xs text-muted-foreground">
            {[
              { icon: Truck, title: "Free shipping", sub: "Over $120" },
              { icon: RotateCcw, title: "30-day returns", sub: "Free exchanges" },
              { icon: ShieldCheck, title: "Secure checkout", sub: "Encrypted" },
            ].map((b) => (
              <li key={b.title} className="rounded-2xl border border-border bg-card p-3">
                <b.icon className="mx-auto mb-1.5 size-4 text-primary" />
                <p className="font-semibold text-foreground">{b.title}</p>
                <p>{b.sub}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tabs */}
      <div id="reviews" className="mt-14 scroll-mt-28 border-t border-border pt-8">
        <div role="tablist" aria-label="Product information" className="flex gap-2 overflow-x-auto">
          {(["details", "shipping", "reviews"] as const).map((t) => (
            <button
              key={t}
              role="tab"
              id={`tab-${t}`}
              aria-selected={tab === t}
              aria-controls={`panel-${t}`}
              onClick={() => setTab(t)}
              className={cn("shrink-0 rounded-full border px-5 py-2 text-xs font-bold uppercase tracking-wider transition", tab === t ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground")}
            >
              {t === "shipping" ? "Shipping & returns" : t}
            </button>
          ))}
        </div>

        <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="mt-6">
          {tab === "details" && (
            <div className="grid gap-4 md:grid-cols-2">
              <ul className="space-y-3 rounded-3xl border border-border bg-card p-6 text-sm">
                {product.details.map((d) => (
                  <li key={d} className="flex gap-3">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                    {d}
                  </li>
                ))}
              </ul>
              <div className="rounded-3xl border border-border bg-card p-6 text-sm">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">Fabric &amp; care</p>
                <p className="mt-3 leading-relaxed text-muted-foreground">{product.fabric}</p>
              </div>
            </div>
          )}
          {tab === "shipping" && (
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { icon: Truck, title: "Standard", text: "3–5 business days, $8. Free on orders over $120." },
                { icon: Truck, title: "Express", text: "1–2 business days, $18. Order before 2pm for same-day dispatch." },
                { icon: RotateCcw, title: "Returns", text: "Free returns and exchanges within 30 days on unworn items with tags." },
              ].map((s) => (
                <div key={s.title} className="rounded-3xl border border-border bg-card p-6 text-sm">
                  <s.icon className="size-5 text-primary" />
                  <p className="mt-3 font-semibold">{s.title}</p>
                  <p className="mt-1 leading-relaxed text-muted-foreground">{s.text}</p>
                </div>
              ))}
            </div>
          )}
          {tab === "reviews" && (
            <div className="grid gap-4 md:grid-cols-2">
              {testimonials.slice(0, 4).map((r) => (
                <figure key={r.id} className="rounded-3xl border border-border bg-card p-6 text-sm">
                  <HalfStars rating={r.rating} size={14} />
                  <blockquote className="mt-3 leading-relaxed">{r.content}</blockquote>
                  <figcaption className="mt-4 text-xs font-semibold text-muted-foreground">{r.name} · Verified buyer</figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="mt-10 text-sm text-muted-foreground">
        <Link href="/shop" className="underline underline-offset-4 hover:text-foreground">
          ← Back to the shop
        </Link>
      </p>
    </div>
  );
}

export default ProductDetails;
