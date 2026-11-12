import type { Metadata } from "next";
import { PageHero } from "@/components/site/ui";
import { ScheduleBoard } from "@/components/schedule/schedule-board";

export const metadata: Metadata = {
  title: "Class schedule",
  description: "Live timetable for the next two weeks with spots left, waitlists and one-tap booking.",
};

export default function SchedulePage() {
  return (
    <>
      <PageHero
        eyebrow="Schedule"
        title="Book your next session"
        description="Pick a day, filter by style and reserve a spot. Full classes open a waitlist that promotes you automatically."
        crumbs={[{ label: "Home", href: "/" }, { label: "Schedule" }]}
      />
      <ScheduleBoard />
    </>
  );
}
