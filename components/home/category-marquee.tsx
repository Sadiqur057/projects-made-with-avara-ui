import { MarqueeBlock } from "@/components/custom/blocks/MarqueeBlock";

const WORDS = ["Strength", "HIIT", "Boxing", "Cycling", "Yoga", "Mobility", "Conditioning", "Recovery"];

export function CategoryMarquee() {
  return (
    <section aria-label="What we train" className="border-y border-border bg-primary py-5 text-primary-foreground">
      <MarqueeBlock speed="slow" gap="3rem" aria-hidden>
        {WORDS.map((w) => (
          <span key={w} className="flex items-center gap-12 font-display text-3xl font-extrabold uppercase sm:text-4xl">
            {w}
            <span className="size-2 rounded-full bg-primary-foreground/60" />
          </span>
        ))}
      </MarqueeBlock>
    </section>
  );
}
