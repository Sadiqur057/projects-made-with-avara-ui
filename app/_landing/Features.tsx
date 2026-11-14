import { BarChart3, BellRing, CalendarRange, Lock, ReceiptText, Target } from "lucide-react";
import { Card } from "@/components/custom/blocks/CardBlock";

const FEATURES = [
  {
    icon: ReceiptText,
    title: "Add and delete transactions",
    text: "Log an expense or deposit in a few keystrokes, search and filter your history, and remove mistakes instantly.",
  },
  {
    icon: Target,
    title: "Category budgets",
    text: "Set a monthly limit for Food, Housing, Shopping and more. A progress bar shows how much is left.",
  },
  {
    icon: BellRing,
    title: "Overspend warnings",
    text: "Bars turn amber as you near a limit and red the moment you pass it, with a clear banner on the dashboard.",
  },
  {
    icon: BarChart3,
    title: "Spending chart",
    text: "A category breakdown shows which habits take the biggest share of your month, with hover for exact values.",
  },
  {
    icon: CalendarRange,
    title: "Monthly bar chart",
    text: "See six months of spending side by side and spot the month that got away from you.",
  },
  {
    icon: Lock,
    title: "Private by default",
    text: "Your numbers never leave the browser. Nothing to sign up for, nothing synced to a server.",
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">Features</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Everything you need to stay on budget, nothing you don&apos;t
        </h2>
        <p className="mt-4 text-base text-muted-foreground">
          Ledgerly keeps the essentials sharp: track, budget, and understand your spending.
        </p>
      </div>
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <li key={title} className="min-w-0">
            <Card variant="default" className="h-full p-6">
              <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
