import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  action,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  action?: { label: string; href: string };
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-4", className)}>
      <div>
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{eyebrow}</p>}
        <h2 className="font-heading mt-2 text-4xl leading-[1.05] sm:text-5xl">{title}</h2>
      </div>
      {action && (
        <Link href={action.href} className="group inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline">
          {action.label}
          <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

export function Section({ id, className, children }: { id?: string; className?: string; children: React.ReactNode }) {
  return (
    <section id={id} className={cn("mx-auto w-full max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-24", className)}>
      {children}
    </section>
  );
}
