import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { BreadcrumbItem } from "@/components/custom/blocks/BreadcrumbBlock";
import { Crumbs } from "@/components/site/crumbs";

type Variant = "primary" | "outline" | "ghost" | "secondary" | "destructive";
type Size = "sm" | "md" | "lg";

export const buttonClasses = (variant: Variant = "primary", size: Size = "md", className?: string) =>
  cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-[background-color,color,transform,border-color] active:scale-[0.98]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
    size === "sm" && "h-9 px-4 text-sm",
    size === "md" && "h-11 px-6 text-sm",
    size === "lg" && "h-13 px-8 text-base",
    variant === "primary" && "bg-primary text-primary-foreground hover:bg-primary/90",
    variant === "secondary" && "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    variant === "outline" && "border border-border bg-transparent text-foreground hover:bg-foreground/5",
    variant === "ghost" && "text-foreground hover:bg-foreground/5",
    variant === "destructive" && "border border-destructive/40 text-destructive hover:bg-destructive/10",
    className,
  );

export function LinkButton({
  variant,
  size,
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return <Link className={buttonClasses(variant, size, className)} {...props} />;
}

export function Button({
  variant,
  size,
  className,
  type = "button",
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return <button type={type} className={buttonClasses(variant, size, className)} {...props} />;
}

export function Badge({
  children,
  tone = "muted",
  className,
}: {
  children: ReactNode;
  tone?: "muted" | "primary" | "success" | "warning" | "danger";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        tone === "muted" && "bg-secondary text-secondary-foreground",
        tone === "primary" && "bg-primary/15 text-primary",
        tone === "success" && "bg-chart-2/15 text-chart-2",
        tone === "warning" && "bg-chart-1/15 text-chart-1",
        tone === "danger" && "bg-destructive/15 text-destructive",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  action,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
  action?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "items-center text-center sm:flex-col sm:items-center sm:justify-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>}
        <h2 className="text-4xl font-extrabold uppercase leading-[0.95] sm:text-5xl">{title}</h2>
        {description && <p className="mt-4 text-base text-muted-foreground sm:text-lg">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)} {...props} />;
}

export function PageHero({
  eyebrow,
  title,
  description,
  crumbs,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  crumbs?: BreadcrumbItem[];
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-card/40">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-primary/10 blur-3xl"
      />
      <Container className="relative py-12 sm:py-16">
        {crumbs && (
          <div className="mb-6">
            <Crumbs items={crumbs} />
          </div>
        )}
        {eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>}
        <h1 className="max-w-3xl text-5xl font-extrabold uppercase leading-[0.92] sm:text-7xl">{title}</h1>
        {description && <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">{description}</p>}
        {children && <div className="mt-8">{children}</div>}
      </Container>
    </section>
  );
}

/** Accessible text field used by the checkout, contact and trial forms. */
export function Field({
  id,
  label,
  error,
  hint,
  className,
  ...props
}: Omit<ComponentProps<"input">, "id"> & { id: string; label: string; error?: string; hint?: string }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(
          "h-11 rounded-xl border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground/70",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          error ? "border-destructive" : "border-input",
        )}
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
