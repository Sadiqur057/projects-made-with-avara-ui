/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProductCard } from "@/components/custom/blocks/ProductCardBlock";
import { discountPct, usd, type Product } from "@/lib/products";

/**
 * Avara's ProductCard, wired to Voltix data. The photo links to the product
 * page and "Quick View" opens it too, so the whole card is reachable by mouse
 * and keyboard without nesting a link around its buttons.
 */
export function ProductTile({ product }: { product: Product }) {
  const router = useRouter();
  const href = `/products/${product.slug}`;
  const pct = discountPct(product);

  return (
    <ProductCard
      interactive
      title={product.name}
      subtitle={product.category}
      price={usd(product.price)}
      originalPrice={usd(product.originalPrice)}
      rating={product.rating}
      reviewsCount={product.reviews}
      badge={product.badge ?? `-${pct}%`}
      badgeVariant={product.badge === "New" ? "indigo" : product.badge === "Best Seller" ? "amber" : "rose"}
      image={
        <Link href={href} aria-label={`View ${product.name}`} className="block size-full">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            width={800}
            height={600}
            className="size-full object-cover"
          />
        </Link>
      }
      onQuickView={() => router.push(href)}
      onAddToCart={() => {}}
      onFavoriteToggle={() => {}}
    />
  );
}
