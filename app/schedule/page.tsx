import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ScheduleVisit } from "@/components/site/ScheduleVisit";

export const metadata = {
  title: "Schedule a visit — Haven & Co. Realty",
  description: "Pick a day and time and tour a home with one of our local agents.",
};

export default function SchedulePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-6 pb-4 pt-14 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Schedule a visit</p>
          <h2 className="text-balance mt-3 text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
            See it in person, with someone who knows the street
          </h2>
          <p className="mt-4 text-muted-foreground">
            Choose a day and time. Your agent confirms within the hour and meets you at the door.
          </p>
        </section>
        <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6">
          <ScheduleVisit />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
