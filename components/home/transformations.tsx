import { TRANSFORMATIONS } from "@/lib/gym-data";
import { Container, SectionHeading } from "@/components/site/ui";

export function Transformations() {
  return (
    <section id="transformations" className="border-t border-border bg-card/30 py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Transformations"
          title="Real members. Real numbers."
          description="Results from members who stuck with a program. Individual results vary, but consistency never hurts."
        />
        <ul className="mt-12 grid gap-6 lg:grid-cols-3">
          {TRANSFORMATIONS.map((t) => (
            <li key={t.id} className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card">
              <div className="flex items-center gap-4 p-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.image} alt={`${t.name}, gym member`} loading="lazy" className="size-16 rounded-2xl object-cover" />
                <div>
                  <p className="font-display text-2xl font-bold uppercase leading-none">{t.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{t.program}</p>
                </div>
                <span className="ml-auto rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                  {t.weeks} wks
                </span>
              </div>
              <dl className="grid grid-cols-3 border-y border-border">
                {t.stats.map((s) => (
                  <div key={s.label} className="border-r border-border p-4 text-center last:border-r-0">
                    <dd className="font-display text-3xl font-extrabold text-primary">{s.value}</dd>
                    <dt className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</dt>
                  </div>
                ))}
              </dl>
              <blockquote className="flex-1 p-5 text-sm text-muted-foreground">&ldquo;{t.quote}&rdquo;</blockquote>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
