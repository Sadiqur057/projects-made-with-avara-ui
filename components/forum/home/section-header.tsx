import type { ReactNode } from "react";

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
        <h2 className="mt-2 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
        {description && <p className="mt-2 text-pretty text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}
