"use client";

import Link from "next/link";
import { HoneycombHero } from "@/components/custom/blocks/HoneycombHeroBlock";
import { IMG } from "@/lib/gym-data";

const images = [
  { src: IMG.barbell, alt: "Athlete setting up under a loaded barbell", tone: "oklch(0.22 0.05 130)" },
  { src: IMG.hiit, alt: "Members training together in a HIIT class", tone: "oklch(0.2 0.04 160)" },
  { src: IMG.cycle, alt: "Indoor cycling studio with lit bikes", tone: "oklch(0.2 0.05 250)" },
  { src: IMG.boxing, alt: "Boxing gloves on a heavy bag", tone: "oklch(0.2 0.06 25)" },
  { src: IMG.yoga, alt: "Yoga class holding a warrior pose", tone: "oklch(0.22 0.04 180)" },
  { src: IMG.womanLift, alt: "Member lifting dumbbells with focus", tone: "oklch(0.21 0.05 140)" },
  { src: IMG.ropes, alt: "Battle ropes conditioning set", tone: "oklch(0.2 0.04 90)" },
  { src: IMG.rack, alt: "Squat rack in the strength lab", tone: "oklch(0.2 0.03 260)" },
];

export function HomeHero() {
  return (
    <HoneycombHero
      title="Train harder. Recover smarter."
      titleAccent="IRONPULSE"
      subtitle="40+ coached classes a week, a serious strength floor and a recovery zone that actually gets used. Come try it free for 7 days."
      primaryActionLabel={"Start free\ntrial"}
      primaryActionHref="#free-trial"
      images={images}
      interval={5000}
      linkComponent={Link}
      socialLinks={[
        { label: "Instagram", href: "https://instagram.com" },
        { label: "YouTube", href: "https://youtube.com" },
        { label: "TikTok", href: "https://tiktok.com" },
      ]}
    />
  );
}
