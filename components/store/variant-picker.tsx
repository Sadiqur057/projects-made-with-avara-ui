"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/store/products";

export function ColorPicker({
  colors,
  value,
  onChange,
  onDark,
}: {
  colors: Product["colors"];
  value: string;
  onChange: (name: string) => void;
  onDark?: boolean;
}) {
  return (
    <fieldset>
      <legend className={cn("flex w-full items-center justify-between text-xs font-semibold uppercase tracking-[0.14em]", onDark ? "text-background/60" : "text-muted-foreground")}>
        <span>
          Colour: <span className={onDark ? "text-background" : "text-foreground"}>{value}</span>
        </span>
      </legend>
      <div className="mt-3 flex flex-wrap gap-2.5" role="radiogroup" aria-label="Colour">
        {colors.map((c) => {
          const selected = c.name === value;
          const light = /^#(f|e|d)/i.test(c.hex);
          return (
            <button
              key={c.name}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={c.name}
              title={c.name}
              onClick={() => onChange(c.name)}
              className={cn(
                "grid size-10 place-items-center rounded-full ring-1 ring-offset-2 transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary",
                onDark ? "ring-background/30 ring-offset-foreground" : "ring-border ring-offset-background",
                selected ? (onDark ? "ring-2 ring-background" : "ring-2 ring-foreground") : onDark ? "hover:ring-background/60" : "hover:ring-foreground/50",
              )}
              style={{ backgroundColor: c.hex }}
            >
              {selected && <Check className={cn("size-4", light ? "text-foreground" : "text-white")} />}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function SizePicker({
  sizes,
  value,
  onChange,
  error,
  onDark,
}: {
  sizes: string[];
  value: string | null;
  onChange: (size: string) => void;
  error?: boolean;
  onDark?: boolean;
}) {
  return (
    <fieldset>
      <legend className={cn("flex w-full items-center justify-between text-xs font-semibold uppercase tracking-[0.14em]", onDark ? "text-background/60" : "text-muted-foreground")}>
        <span>
          Size{value ? <>: <span className={onDark ? "text-background" : "text-foreground"}>{value}</span></> : null}
        </span>
        {error && (
          <span role="alert" className="normal-case tracking-normal text-destructive">
            Please choose a size
          </span>
        )}
      </legend>
      <div className="mt-3 grid grid-cols-5 gap-2" role="radiogroup" aria-label="Size">
        {sizes.map((s) => {
          const selected = s === value;
          return (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(s)}
              className={cn(
                "h-11 rounded-lg border text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                selected
                  ? onDark
                    ? "border-background bg-background text-foreground"
                    : "border-foreground bg-foreground text-background"
                  : onDark
                    ? "border-background/25 text-background hover:border-background"
                    : "border-border bg-card hover:border-foreground",
                error && !selected && "border-destructive/60",
              )}
            >
              {s}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
