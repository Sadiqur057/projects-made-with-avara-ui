import { Compass, Headset, Leaf, ShieldCheck, Users, Wallet } from "lucide-react";
import { WHY_US } from "@/lib/travel-data";

const ICONS = { Compass, ShieldCheck, Wallet, Headset, Leaf, Users } as const;

const STATS = [
  { value: "12,400+", label: "travellers since 2012" },
  { value: "4.8 / 5", label: "average trip rating" },
  { value: "14", label: "destinations, all hosted locally" },
  { value: "94%", label: "book a second trip with us" },
];

export function WhyUs() {
  return (
    <div>
      <dl className="mb-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="flex flex-col bg-card p-6 text-center sm:p-8">
            <dt className="order-2 mt-1 text-sm text-muted-foreground">{s.label}</dt>
            <dd className="font-heading text-3xl font-semibold tabular-nums text-primary sm:text-4xl">
              {s.value}
            </dd>
          </div>
        ))}
      </dl>
      <ul className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {WHY_US.map((item) => {
          const Icon = ICONS[item.icon];
          return (
            <li key={item.title} className="flex gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                <Icon className="size-6" />
              </span>
              <div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-1.5 text-pretty text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
