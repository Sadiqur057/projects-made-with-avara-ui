import { cn } from "@/lib/utils";

export function SaleBadge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "rounded-full bg-sale px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-sale-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("text-xs font-semibold uppercase tracking-[0.18em] text-primary", className)}>
      {children}
    </p>
  );
}
