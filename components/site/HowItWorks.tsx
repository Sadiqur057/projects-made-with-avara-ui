import Link from "next/link";
import { CalendarCheck, ClipboardList, Handshake, KeyRound } from "lucide-react";

const STEPS = [
  {
    icon: ClipboardList,
    title: "Tell us what you need",
    text: "Share your budget, neighbourhoods and must-haves in a 15-minute call. We turn it into a short, honest shortlist.",
  },
  {
    icon: CalendarCheck,
    title: "Tour with an agent",
    text: "Pick a time that suits you. We open the doors, answer the awkward questions and point out what photos hide.",
  },
  {
    icon: Handshake,
    title: "Make a confident offer",
    text: "We pull comparable sales, negotiate on your behalf and keep the paperwork moving until the seller says yes.",
  },
  {
    icon: KeyRound,
    title: "Collect your keys",
    text: "From inspection to closing day, we coordinate lenders, lawyers and movers so handover day is the easy part.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 bg-background px-6 py-24 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">How it works</p>
          <h2 className="text-balance mt-3 text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
            Four steps from browsing to your front door
          </h2>
        </div>

        <ol className="relative mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div
            aria-hidden
            className="pointer-events-none absolute left-[12%] right-[12%] top-9 hidden border-t-2 border-dashed border-border lg:block"
          />
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="relative flex flex-col rounded-3xl border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="flex items-center justify-between">
                <span className="grid size-[4.5rem] place-items-center rounded-2xl bg-primary text-primary-foreground">
                  <step.icon className="size-7" aria-hidden />
                </span>
                <span className="text-5xl font-semibold tabular-nums text-foreground/10" aria-hidden>
                  0{index + 1}
                </span>
              </div>
              <h3 className="mt-6 text-xl font-medium text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 text-center">
          <Link
            href="/schedule"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03] active:scale-95"
          >
            Start with a free call
          </Link>
        </div>
      </div>
    </section>
  );
}
