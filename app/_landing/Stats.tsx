"use client";

import {
  CounterSection,
  type StatItem,
} from "@/components/custom/blocks/CounterSectionBlock";

const STATS: StatItem[] = [
  {
    value: 2.4,
    decimals: 1,
    suffix: "M",
    label: "Meetings captured",
    sublabel: "Transcribed and summarised by teams in 90+ countries",
    tag: "Growing",
    trend: "+38% this year",
    footnote: "vs last year",
  },
  {
    value: 98,
    suffix: "%",
    label: "Transcript accuracy",
    sublabel: "Measured across accents, jargon and crosstalk",
    tag: "Verified",
    trend: "Beats human notes",
    footnote: "blind test",
  },
  {
    value: 4.2,
    decimals: 1,
    suffix: "h",
    label: "Saved per person weekly",
    sublabel: "No more note-taking, recaps or chasing follow-ups",
    tag: "Productivity",
    trend: "68% less admin work",
    footnote: "team survey",
  },
  {
    value: 12,
    suffix: "s",
    label: "To a finished summary",
    sublabel: "Median time from end of call to a shareable recap",
    tag: "Fast",
    trend: "Before you leave",
    footnote: "median",
  },
];

export function Stats() {
  return (
    <section id="stats" className="px-4 py-12 sm:px-6">
      <CounterSection
        className="mx-auto max-w-7xl"
        variant="spotlight-gradient"
        eyebrow="By the numbers"
        heading="Teams get hours back, every week"
        description="Notewise runs in the background of the meetings you already have."
        stats={STATS}
      />
    </section>
  );
}
