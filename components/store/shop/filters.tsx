"use client";

import { CONCERNS, SKIN_TYPE_LABEL, STEP_LABEL, type Concern, type SkinType, type Step } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export interface ShopFilters {
  steps: Step[];
  types: SkinType[];
  concerns: Concern[];
  fragranceFree: boolean;
  onSale: boolean;
  saved: boolean;
}

function Group({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset className="min-w-0 border-0 p-0">
      <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {legend}
      </legend>
      <div className="grid gap-1">{children}</div>
    </fieldset>
  );
}

function Check({
  label,
  checked,
  onChange,
  count,
}: {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  count?: number;
}) {
  return (
    <label
      className={cn(
        "flex min-h-10 cursor-pointer items-center gap-3 rounded-lg px-2 text-sm transition-colors hover:bg-muted",
        checked && "font-medium text-foreground",
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-4 shrink-0 rounded border-input accent-primary"
      />
      <span className="flex-1">{label}</span>
      {count !== undefined && <span className="text-xs tabular-nums text-muted-foreground">{count}</span>}
    </label>
  );
}

function toggle<T>(list: T[], value: T, on: boolean): T[] {
  return on ? [...list.filter((v) => v !== value), value] : list.filter((v) => v !== value);
}

export function FilterPanel({
  filters,
  onChange,
  counts,
}: {
  filters: ShopFilters;
  onChange: (next: ShopFilters) => void;
  counts: {
    step: Record<string, number>;
    type: Record<string, number>;
    concern: Record<string, number>;
  };
}) {
  const steps = Object.keys(STEP_LABEL) as Step[];
  const types = Object.keys(SKIN_TYPE_LABEL) as SkinType[];

  return (
    <div className="grid gap-8">
      <Group legend="Product type">
        {steps.map((s) => (
          <Check
            key={s}
            label={STEP_LABEL[s]}
            count={counts.step[s] ?? 0}
            checked={filters.steps.includes(s)}
            onChange={(on) => onChange({ ...filters, steps: toggle(filters.steps, s, on) })}
          />
        ))}
      </Group>
      <Group legend="Skin type">
        {types.map((t) => (
          <Check
            key={t}
            label={SKIN_TYPE_LABEL[t]}
            count={counts.type[t] ?? 0}
            checked={filters.types.includes(t)}
            onChange={(on) => onChange({ ...filters, types: toggle(filters.types, t, on) })}
          />
        ))}
      </Group>
      <Group legend="Concern">
        {CONCERNS.map((c) => (
          <Check
            key={c.id}
            label={c.name}
            count={counts.concern[c.id] ?? 0}
            checked={filters.concerns.includes(c.id)}
            onChange={(on) => onChange({ ...filters, concerns: toggle(filters.concerns, c.id, on) })}
          />
        ))}
      </Group>
      <Group legend="More">
        <Check
          label="Fragrance-free"
          checked={filters.fragranceFree}
          onChange={(on) => onChange({ ...filters, fragranceFree: on })}
        />
        <Check
          label="On sale"
          checked={filters.onSale}
          onChange={(on) => onChange({ ...filters, onSale: on })}
        />
        <Check
          label="My favourites"
          checked={filters.saved}
          onChange={(on) => onChange({ ...filters, saved: on })}
        />
      </Group>
    </div>
  );
}
