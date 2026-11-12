import { cn } from "@/lib/utils";

/** Heading block for inner pages. Clears the floating navbar. */
export function PageHeader({
  eyebrow,
  title,
  description,
  className,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-5 pb-8 pt-32 sm:px-8 sm:pt-36", className)}>
      {eyebrow && <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-primary">{eyebrow}</p>}
      <h1 className="max-w-3xl text-balance text-4xl font-semibold sm:text-5xl">{title}</h1>
      {description && <p className="mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">{description}</p>}
      {children}
    </div>
  );
}

export function Section({
  id,
  eyebrow,
  title,
  description,
  action,
  tone = "light",
  className,
  children,
}: {
  id?: string;
  tone?: "light" | "dark";
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("mx-auto w-full max-w-7xl scroll-mt-24 px-5 py-16 sm:px-8 sm:py-24", className)}>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          {eyebrow && <p className={cn("mb-3 text-sm font-medium uppercase tracking-[0.18em]", tone === "dark" ? "text-sun" : "text-primary")}>{eyebrow}</p>}
          <h2 className="max-w-2xl text-balance text-3xl font-semibold sm:text-4xl">{title}</h2>
          {description && <p className={cn("mt-3 max-w-xl text-pretty", tone === "dark" ? "text-white/75" : "text-muted-foreground")}>{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
