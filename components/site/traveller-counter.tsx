"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function TravellerCounter({
  label,
  hint,
  value,
  min = 0,
  max = 12,
  onChange,
  className,
}: {
  label: string;
  hint?: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  className?: string;
}) {
  const btn =
    "inline-flex size-9 items-center justify-center rounded-full border border-border bg-background transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40 outline-none focus-visible:ring-3 focus-visible:ring-ring/50";
  return (
    <div className={cn("flex items-center justify-between gap-4", className)} role="group" aria-label={label}>
      <div>
        <div className="text-sm font-medium">{label}</div>
        {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
      </div>
      <div className="flex items-center gap-3">
        <button type="button" className={btn} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`Decrease ${label}`}>
          <Minus className="size-4" />
        </button>
        <output className="w-6 text-center text-base font-semibold tabular-nums" aria-live="polite">
          {value}
        </output>
        <button type="button" className={btn} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`Increase ${label}`}>
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  );
}
