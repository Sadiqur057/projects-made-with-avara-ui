"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingBag, Star } from "lucide-react";
import Button from "@/components/custom/blocks/Button";
import { getProduct } from "@/lib/store/products";
import { money } from "@/lib/store/pricing";
import { FavouriteButton } from "../product-card";
import { Section } from "../section-heading";
import { ColorPicker, SizePicker } from "../variant-picker";
import { useShop } from "../use-shop";

const product = getProduct("noir-leather-biker")!;

export function FeaturedSection() {
  const { add } = useShop();
  const [color, setColor] = useState(product.colors[0].name);
  const [size, setSize] = useState<string | null>(null);
  const [needsSize, setNeedsSize] = useState(false);

  const submit = () => {
    if (!size) {
      setNeedsSize(true);
      return;
    }
    add(product.id, color, size, 1, { openCart: true });
  };

  return (
    <Section id="featured">
      <div className="grid items-center gap-8 overflow-hidden rounded-[2rem] bg-foreground text-background lg:grid-cols-2">
        <div className="relative aspect-[4/5] lg:aspect-auto lg:h-full lg:min-h-[640px]" style={{ backgroundColor: product.tone }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.images[0]} alt={product.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          <span className="absolute left-5 top-5 rounded-full bg-background px-3 py-1 text-xs font-semibold text-foreground">Featured piece</span>
        </div>

        <div className="p-6 sm:p-10 lg:pr-14">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground/70">Editor&rsquo;s pick · Outerwear</p>
          <h2 className="font-heading mt-3 text-5xl leading-[1.02] sm:text-6xl">{product.name}</h2>
          <div className="mt-4 flex items-center gap-3 text-sm text-background/75">
            <span className="flex items-center gap-1">
              <Star className="size-4 fill-amber-400 text-amber-400" />
              <strong className="text-background">{product.rating}</strong>
            </span>
            <span aria-hidden>·</span>
            <span>{product.reviews} reviews</span>
          </div>
          <p className="mt-5 max-w-md leading-relaxed text-background/75">{product.description}</p>

          <p className="mt-6 flex items-baseline gap-3 text-3xl font-semibold">
            {money(product.price)}
            {product.compareAt && <span className="text-lg font-normal text-background/50 line-through">{money(product.compareAt)}</span>}
          </p>

          <div className="mt-8 space-y-6">
            <ColorPicker onDark colors={product.colors} value={color} onChange={setColor} />
            <SizePicker
              onDark
              sizes={product.sizes}
              value={size}
              onChange={(s) => {
                setSize(s);
                setNeedsSize(false);
              }}
              error={needsSize}
            />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button variant="default" onClick={submit} className="h-12 flex-1 gap-2 rounded-full px-8 text-sm font-semibold sm:flex-none" iconLeft={<ShoppingBag className="size-4" />}>
              Add to bag
            </Button>
            <FavouriteButton productId={product.id} label={product.name} className="size-12 !bg-background/10 text-background hover:!bg-background/20" />
            <Link href={`/product/${product.slug}`} className="px-2 text-sm font-medium text-background underline underline-offset-4 hover:text-background/80">
              Full details
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
