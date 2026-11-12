"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Heart, Star, X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Product details, "modern split gallery" layout: a slider with floating
 * arrows on the left, the buy box and a tabbed info section on the right.
 *
 * Adapted from the Avara UI block: the sneaker-specific copy is gone and the
 * pieces a store needs are slots — `children` is the buy box (options,
 * subscribe & save, add to bag) and `tabs` hold specs, ingredients, reviews.
 */

export interface ProductDetailsTab {
  id: string;
  label: string;
  content: ReactNode;
}

export interface ProductDetailsProps {
  title: string;
  description?: string;
  /** Small pill above the title, e.g. "Serum". */
  badge?: string;
  rating: number;
  reviewsCount: number;
  images: string[];
  imageAlt?: string;
  /** Pill on the main image, e.g. "25% OFF". */
  imageBadge?: string;
  liked?: boolean;
  onToggleLike?: () => void;
  /** The buy box. */
  children: ReactNode;
  tabs?: ProductDetailsTab[];
  className?: string;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex shrink-0" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "size-4",
            i < Math.round(rating) ? "fill-primary text-primary" : "text-border",
          )}
        />
      ))}
    </div>
  );
}

export function ProductDetails({
  title,
  description,
  badge,
  rating,
  reviewsCount,
  images,
  imageAlt,
  imageBadge,
  liked = false,
  onToggleLike,
  children,
  tabs = [],
  className,
}: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? "");
  const tabsRef = useRef<HTMLDivElement>(null);
  const modalCloseRef = useRef<HTMLButtonElement>(null);

  const count = images.length;
  const go = (delta: number) => setSelectedImage((i) => (i + delta + count) % count);
  const alt = imageAlt ?? title;

  useEffect(() => {
    if (!isModalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false);
      if (e.key === "ArrowLeft") setSelectedImage((i) => (i - 1 + count) % count);
      if (e.key === "ArrowRight") setSelectedImage((i) => (i + 1) % count);
    };
    window.addEventListener("keydown", onKey);
    modalCloseRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isModalOpen, count]);

  const openReviews = () => {
    if (!tabs.some((t) => t.id === "reviews")) return;
    setActiveTab("reviews");
    tabsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const active = tabs.find((t) => t.id === activeTab) ?? tabs[0];

  return (
    <section className={cn("w-full bg-background text-foreground transition-colors", className)}>
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="aspect-[4/5] sm:aspect-square lg:aspect-[4/5] w-full rounded-3xl overflow-hidden border border-border relative bg-muted">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                aria-label="Expand image"
                className="group absolute inset-0 z-0 cursor-zoom-in"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images[selectedImage]}
                  alt={`${alt} — view ${selectedImage + 1} of ${count}`}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
                />
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-foreground/10 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="px-4 py-2 rounded-full bg-card/90 text-foreground backdrop-blur-md text-xs font-semibold flex items-center gap-2">
                    <ZoomIn className="size-4" /> Click to expand
                  </span>
                </span>
              </button>

              {imageBadge && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-sale text-sale-foreground text-xs font-extrabold uppercase tracking-wider z-20 pointer-events-none">
                  {imageBadge}
                </span>
              )}

              {onToggleLike && (
                <button
                  type="button"
                  onClick={onToggleLike}
                  aria-pressed={liked}
                  aria-label={liked ? "Remove from favourites" : "Save to favourites"}
                  className="absolute top-4 right-4 p-3 rounded-full bg-card/85 backdrop-blur-md border border-border text-foreground hover:text-sale transition-colors z-20"
                >
                  <Heart className={cn("size-5", liked && "fill-sale text-sale")} />
                </button>
              )}

              {count > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-card/90 border border-border text-foreground hover:scale-110 transition-transform backdrop-blur-md z-20"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-card/90 border border-border text-foreground hover:scale-110 transition-transform backdrop-blur-md z-20"
                    aria-label="Next image"
                  >
                    <ChevronRight className="size-5" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {images.map((_, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        aria-label={`Show image ${idx + 1}`}
                        aria-current={selectedImage === idx}
                        className={cn(
                          "h-2 rounded-full transition-all",
                          selectedImage === idx ? "w-6 bg-primary" : "w-2 bg-foreground/30",
                        )}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {count > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, idx) => (
                  <button
                    type="button"
                    key={img}
                    onClick={() => setSelectedImage(idx)}
                    aria-label={`Show image ${idx + 1}`}
                    aria-current={selectedImage === idx}
                    className={cn(
                      "aspect-[4/5] overflow-hidden rounded-xl border-2 transition-all",
                      selectedImage === idx
                        ? "border-primary"
                        : "border-border opacity-70 hover:opacity-100",
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="size-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Buy box */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {badge && (
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary border border-border text-secondary-foreground text-[11px] font-semibold shrink-0 whitespace-nowrap">
                    {badge}
                  </span>
                )}
                <button
                  type="button"
                  onClick={openReviews}
                  className="flex items-center gap-2 rounded-md -m-1 p-1 hover:bg-muted transition-colors"
                  aria-label={
                    reviewsCount
                      ? `Rated ${rating.toFixed(1)} out of 5 from ${reviewsCount} reviews. Jump to reviews`
                      : "No reviews yet. Jump to reviews"
                  }
                >
                  <Stars rating={rating} />
                  <span className="text-xs font-semibold text-foreground shrink-0">
                    {reviewsCount ? rating.toFixed(1) : "New"}
                  </span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap underline underline-offset-4 decoration-border">
                    {reviewsCount ? `${reviewsCount.toLocaleString()} review${reviewsCount === 1 ? "" : "s"}` : "Be the first to review"}
                  </span>
                </button>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
                {title}
              </h1>
              {description && (
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              )}
            </div>

            {children}
          </div>
        </div>

        {/* Tabs */}
        {tabs.length > 0 && active && (
          <div ref={tabsRef} className="border-t border-border pt-8 space-y-6 scroll-mt-24">
            <div role="tablist" aria-label="Product information" className="flex gap-5 sm:gap-8 border-b border-border overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  type="button"
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-selected={active.id === tab.id}
                  aria-controls={`panel-${tab.id}`}
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "shrink-0 text-xs font-semibold uppercase tracking-wider pb-3 -mb-px border-b-2 transition-colors",
                    active.id === tab.id
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div role="tabpanel" id={`panel-${active.id}`} aria-labelledby={`tab-${active.id}`}>
              {active.content}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-foreground/80 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} gallery`}
          onClick={() => setIsModalOpen(false)}
        >
          <button
            type="button"
            ref={modalCloseRef}
            onClick={() => setIsModalOpen(false)}
            aria-label="Close gallery"
            className="absolute top-4 right-4 p-3 rounded-full bg-card/90 border border-border text-foreground hover:scale-110 transition-transform z-50"
          >
            <X className="size-5" />
          </button>
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <div className="w-[min(88vw,520px)] aspect-[4/5] max-h-[80vh] rounded-3xl overflow-hidden border border-border bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={images[selectedImage]} alt={`${alt} — view ${selectedImage + 1}`} className="size-full object-cover" />
            </div>
            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous image"
                  className="absolute left-2 sm:-left-16 top-1/2 -translate-y-1/2 p-3 rounded-full bg-card/90 border border-border text-foreground hover:scale-110 transition-transform"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next image"
                  className="absolute right-2 sm:-right-16 top-1/2 -translate-y-1/2 p-3 rounded-full bg-card/90 border border-border text-foreground hover:scale-110 transition-transform"
                >
                  <ChevronRight className="size-5" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default ProductDetails;
