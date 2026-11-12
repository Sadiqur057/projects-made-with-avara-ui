"use client";

import { Heart } from "lucide-react";
import { actions, useFavorite } from "@/lib/store";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  slug,
  name,
  className,
}: {
  slug: string;
  name: string;
  className?: string;
}) {
  const liked = useFavorite(slug);
  return (
    <button
      type="button"
      aria-pressed={liked}
      aria-label={liked ? `Remove ${name} from favourites` : `Save ${name} to favourites`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        actions.toggleFavorite(slug);
      }}
      className={cn(
        "grid size-9 place-items-center rounded-full border border-border bg-card/90 text-foreground backdrop-blur transition-colors hover:text-sale",
        className,
      )}
    >
      <Heart className={cn("size-4 transition-transform", liked && "fill-sale text-sale scale-110")} />
    </button>
  );
}
