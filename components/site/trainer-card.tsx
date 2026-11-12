import { Award } from "lucide-react";
import { TiltedCard } from "@/components/custom/blocks/TiltedCardBlock";
import { HalfStars } from "@/components/custom/blocks/HalfStarsBlock";
import type { Trainer } from "@/lib/gym-data";

/**
 * A trainer portrait card. When `onOpen` is given the whole card becomes a button
 * (used on the trainers page to open a profile dialog).
 */
export function TrainerCard({ trainer, onOpen }: { trainer: Trainer; onOpen?: () => void }) {
  const body = (
    <>
      <div className="relative aspect-[4/5] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={trainer.image} alt={`Portrait of ${trainer.name}`} loading="lazy" className="size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 p-5 text-left text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{trainer.role}</p>
          <h3 className="mt-1 font-display text-3xl font-bold uppercase leading-none">{trainer.name}</h3>
        </div>
      </div>
      <div className="flex flex-col gap-3 p-5 text-left">
        <div className="flex items-center justify-between gap-3">
          <HalfStars rating={trainer.rating} size={16} showText={false} />
          <span className="text-xs text-muted-foreground">
            {trainer.rating.toFixed(1)} · {trainer.reviews} reviews
          </span>
        </div>
        <ul className="flex flex-wrap gap-1.5">
          {trainer.specialties.map((s) => (
            <li key={s} className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
              {s}
            </li>
          ))}
        </ul>
        <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Award className="size-3.5 text-primary" aria-hidden /> {trainer.years} years coaching
        </p>
      </div>
    </>
  );

  return (
    <TiltedCard tiltIntensity={8} glareOpacity={0.12} scaleOnHover={1.02} className="h-full" innerClassName="h-full">
      {onOpen ? (
        <button
          type="button"
          onClick={onOpen}
          aria-label={`View ${trainer.name}'s profile`}
          className="block size-full overflow-hidden rounded-3xl border border-border bg-card text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {body}
        </button>
      ) : (
        <div className="size-full overflow-hidden rounded-3xl border border-border bg-card">{body}</div>
      )}
    </TiltedCard>
  );
}
