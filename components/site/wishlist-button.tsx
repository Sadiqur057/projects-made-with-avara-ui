"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/lib/store";

export function WishlistButton({
  slug,
  title,
  className,
  variant = "overlay",
}: {
  slug: string;
  title: string;
  className?: string;
  variant?: "overlay" | "inline";
}) {
  const { has, toggle } = useWishlist();
  const saved = has(slug);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${title} from wishlist` : `Save ${title} to wishlist`}
      className={cn(
        "inline-flex items-center justify-center gap-2 transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-95",
        variant === "overlay"
          ? "size-9 rounded-full bg-background/85 text-foreground shadow-sm backdrop-blur hover:bg-background"
          : "h-10 rounded-full border border-border bg-background px-4 text-sm font-medium hover:bg-muted",
        className,
      )}
    >
      <Heart className={cn("size-4 transition-colors", saved ? "fill-sun text-sun" : "text-current")} />
      {variant === "inline" && <span>{saved ? "Saved" : "Save to wishlist"}</span>}
    </button>
  );
}
