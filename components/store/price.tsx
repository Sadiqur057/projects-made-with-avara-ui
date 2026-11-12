import { cn } from "@/lib/utils";
import { money, money2, unitPrice } from "@/lib/pricing";
import type { Product } from "@/lib/catalog";

/** Current price, with the struck-through list price when discounted. */
export function Price({
  product,
  sizeId,
  subscribed = false,
  className,
  size = "md",
  precise = false,
}: {
  product: Product;
  sizeId?: string;
  subscribed?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  precise?: boolean;
}) {
  const s = sizeId ?? product.sizes[0].id;
  const p = unitPrice(product, s, subscribed);
  const fmt = precise ? money2 : money;
  const from = !sizeId && product.sizes.length > 1;
  const discounted = p.final < p.list;

  return (
    <span className={cn("inline-flex flex-wrap items-baseline gap-x-2 tabular-nums", className)}>
      {from && <span className="text-xs text-muted-foreground">From</span>}
      <span
        className={cn(
          "font-semibold",
          size === "lg" ? "text-3xl" : size === "md" ? "text-base" : "text-sm",
          discounted ? "text-sale" : "text-foreground",
        )}
      >
        {fmt(p.final)}
      </span>
      {discounted && (
        <span className={cn("text-muted-foreground line-through", size === "lg" ? "text-lg" : "text-xs")}>
          <span className="sr-only">Was </span>
          {fmt(p.list)}
        </span>
      )}
    </span>
  );
}
