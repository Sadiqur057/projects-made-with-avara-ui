"use client";

import { HalfStars } from "@/components/custom/blocks/HalfStarsBlock";
import { useProductRating } from "@/lib/store";
import { cn } from "@/lib/utils";

/** Static star rating with the review count, read live from the store. */
export function ProductRating({
  slug,
  size = 14,
  className,
  showCount = true,
}: {
  slug: string;
  size?: number;
  className?: string;
  showCount?: boolean;
}) {
  const { average, count } = useProductRating(slug);
  if (count === 0) {
    return <span className={cn("text-xs text-muted-foreground", className)}>No reviews yet</span>;
  }
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <HalfStars
        rating={average}
        size={size}
        showText={false}
        allowHalf
        role="img"
        aria-label={`Rated ${average.toFixed(1)} out of 5`}
        className="gap-0"
      />
      <span className="text-xs font-semibold text-foreground tabular-nums">{average.toFixed(1)}</span>
      {showCount && <span className="text-xs text-muted-foreground tabular-nums">({count})</span>}
    </div>
  );
}
