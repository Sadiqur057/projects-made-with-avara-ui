import {
  BadgeCheck,
  Headset,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { SectionHeading } from "./section-heading";

const reasons = [
  {
    icon: BadgeCheck,
    title: "100% genuine",
    text: "Every item ships sealed from the brand or an authorised distributor, with a full manufacturer warranty.",
  },
  {
    icon: Truck,
    title: "Free next-day delivery",
    text: "Order before 8 pm and it lands tomorrow. Tracked end to end, with no minimum spend.",
  },
  {
    icon: ShieldCheck,
    title: "2-year warranty",
    text: "We double the standard cover on everything we sell. If it fails, we fix or replace it.",
  },
  {
    icon: RotateCcw,
    title: "30-day returns",
    text: "Not for you? Send it back within 30 days for a full refund, no awkward questions.",
  },
  {
    icon: Headset,
    title: "Real tech support",
    text: "Talk to people who use the gear. Setup help and troubleshooting, seven days a week.",
  },
  {
    icon: PackageCheck,
    title: "Price match",
    text: "Found it cheaper elsewhere? Show us and we will match it before you check out.",
  },
];

const stats = [
  { value: "250K+", label: "Happy customers" },
  { value: "4.8/5", label: "Average rating" },
  { value: "24h", label: "Average dispatch" },
  { value: "12 yrs", label: "Selling electronics" },
];

export function WhyChooseUs() {
  return (
    <section
      id="why-voltix"
      className="mx-auto w-full max-w-7xl scroll-mt-20 px-4 pb-8 pt-4 sm:px-6 sm:pb-12"
    >
      <SectionHeading
        eyebrow="Why choose Voltix"
        title="Tech shopping without the guesswork"
        description="We built Voltix to take the risk out of buying electronics online."
        align="center"
      />

      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reasons.map(({ icon: Icon, title, text }) => (
          <li
            key={title}
            className="group rounded-3xl border border-border bg-card p-6 transition-colors duration-300 hover:border-primary/40 hover:bg-primary/[0.03]"
          >
            <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
              <Icon className="size-6" />
            </span>
            <h3 className="mt-5 text-lg font-bold text-foreground">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
          </li>
        ))}
      </ul>

      <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card px-6 py-8 text-center">
            <dt className="order-2 mt-1 text-sm text-muted-foreground">{s.label}</dt>
            <dd className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              {s.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
