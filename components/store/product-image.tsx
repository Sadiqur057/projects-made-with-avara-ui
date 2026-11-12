import { cn } from "@/lib/utils";
import { productImage } from "@/lib/catalog";

/**
 * Product art is SVG, which next/image does not optimise, so a plain <img>
 * is the right tool here. Width/height reserve the 4:5 box to avoid layout shift.
 */
export function ProductImage({
  slug,
  view = 1,
  alt = "",
  className,
  priority = false,
}: {
  slug: string;
  view?: number;
  alt?: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={productImage(slug, view)}
      alt={alt}
      width={800}
      height={1000}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={cn("size-full object-cover", className)}
    />
  );
}
