import type { Metadata } from "next";
import { PageHero } from "@/components/site/ui";
import { TrainersGrid } from "@/components/trainers/trainers-grid";

export const metadata: Metadata = {
  title: "Trainers",
  description: "Meet the certified coaches behind IRONPULSE classes.",
};

export default function TrainersPage() {
  return (
    <>
      <PageHero
        eyebrow="Coaches"
        title="Coaches who actually coach"
        description="Six specialists across strength, conditioning, combat, cycling and mobility. Open a profile to see their background and the classes they lead."
        crumbs={[{ label: "Home", href: "/" }, { label: "Trainers" }]}
      />
      <TrainersGrid />
    </>
  );
}
