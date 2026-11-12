import type { Metadata } from "next";
import { PageHero } from "@/components/site/ui";
import { ClassesBrowser } from "@/components/classes/classes-browser";

export const metadata: Metadata = {
  title: "Classes",
  description: "Strength, HIIT, yoga, boxing and cycling classes for every level at IRONPULSE Gym.",
};

export default function ClassesPage() {
  return (
    <>
      <PageHero
        eyebrow="Classes"
        title="Every class. Every level."
        description="Browse the full timetable of coached sessions. Filter by style or level, then open a class to see times and book."
        crumbs={[{ label: "Home", href: "/" }, { label: "Classes" }]}
      />
      <ClassesBrowser />
    </>
  );
}
