import Link from "next/link";
import { Clock, Flame, User } from "lucide-react";
import { categoryById, trainerById, type GymClass } from "@/lib/gym-data";
import { Badge } from "@/components/site/ui";
import { cn } from "@/lib/utils";

export function IntensityMeter({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)} role="img" aria-label={`Intensity ${value} of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={cn("h-3 w-1.5 rounded-full", i <= value ? "bg-primary" : "bg-foreground/15")} />
      ))}
    </span>
  );
}

export function ClassCard({ item, priority = false }: { item: GymClass; priority?: boolean }) {
  const category = categoryById(item.category);
  const trainer = trainerById(item.trainerId);
  return (
    <Link
      href={`/classes/${item.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition-[transform,border-color] hover:-translate-y-1 hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={`${item.name} class`}
          loading={priority ? "eager" : "lazy"}
          className="size-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" aria-hidden />
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge tone="primary" className="bg-background/80 backdrop-blur">
            {category.label}
          </Badge>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-medium text-white">
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" aria-hidden /> {item.duration} min
          </span>
          <span className="inline-flex items-center gap-1">
            <Flame className="size-3.5" aria-hidden /> {item.calories} kcal
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-2xl font-bold uppercase leading-none">{item.name}</h3>
          <Badge>{item.level}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{item.summary}</p>
        <div className="mt-auto flex items-center justify-between pt-2 text-sm">
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <User className="size-4" aria-hidden /> {trainer.name}
          </span>
          <IntensityMeter value={item.intensity} />
        </div>
      </div>
    </Link>
  );
}
