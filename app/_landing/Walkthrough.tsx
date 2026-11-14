"use client";

import {
  ScrollAccordionShowcase,
  type AccordionShowcaseItem,
} from "@/components/custom/blocks/ScrollAccordionShowcaseBlock";
import { IMG } from "./images";

const ITEMS: AccordionShowcaseItem[] = [
  {
    id: "connect",
    stepNumber: "01",
    title: "Connect your calendar",
    description:
      "Link Google or Outlook once. Notewise sees which meetings are coming up and asks before it ever joins a call, so nothing is recorded by surprise.",
    tags: ["GOOGLE & OUTLOOK", "OPT-IN PER MEETING", "ZOOM, MEET & TEAMS"],
    image: IMG.steps[0],
    badgeText: "STEP ONE",
  },
  {
    id: "listen",
    stepNumber: "02",
    title: "Notewise joins and listens",
    description:
      "A quiet bot joins the call and transcribes in real time, with speaker labels and timestamps. You stay in the conversation instead of typing.",
    tags: ["LIVE TRANSCRIPT", "SPEAKER LABELS", "40+ LANGUAGES"],
    image: IMG.steps[1],
    badgeText: "STEP TWO",
  },
  {
    id: "review",
    stepNumber: "03",
    title: "Get the summary in seconds",
    description:
      "The moment the call ends you get a clean summary, every decision made, and a checklist of action items with owners and due dates already filled in.",
    tags: ["AI SUMMARY", "DECISION LOG", "ACTION ITEMS"],
    image: IMG.steps[2],
    badgeText: "STEP THREE",
  },
  {
    id: "share",
    stepNumber: "04",
    title: "Share and follow up",
    description:
      "Send the recap to Slack or email with one click, push tasks to your tracker, and ask the assistant anything about last quarter's meetings later.",
    tags: ["SLACK & EMAIL", "ASK THE ASSISTANT", "SEARCH ARCHIVE"],
    image: IMG.steps[3],
    badgeText: "STEP FOUR",
  },
];

export function Walkthrough() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          How it works
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          From &ldquo;let&rsquo;s sync&rdquo; to done in four steps
        </h2>
        <p className="mt-4 text-muted-foreground">
          Scroll through the flow. Each step opens as you reach it.
        </p>
      </div>
      <ScrollAccordionShowcase
        items={ITEMS}
        displayMode="both"
        localStorageKey="notewise-accent"
      />
    </section>
  );
}
