"use client";

import { CounterSection } from "@/components/custom/blocks/CounterSectionBlock";
import { communityStats } from "@/lib/forum/selectors";
import { useForum } from "@/lib/forum/store";

export function CommunityStats() {
  const { state } = useForum();
  const s = communityStats(state);

  return (
    <section aria-label="Community stats" className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <CounterSection
        variant="halftone-cinema"
        eyebrow="Community stats"
        heading="A community that keeps growing"
        description="Live figures from Commonroom. Create a post or reply and watch the numbers move."
        allowReplay={false}
        stats={[
          {
            value: s.members,
            label: "Members",
            sublabel: "Builders, designers and makers from 90+ countries",
          },
          {
            value: s.discussions,
            label: "Discussions",
            sublabel: "Questions asked, ideas shared and projects shown off",
          },
          {
            value: s.replies,
            label: "Replies",
            sublabel: "Thoughtful answers, from first-hand experience",
          },
          {
            value: s.online,
            label: "Online now",
            sublabel: "People reading and replying at this very moment",
          },
        ]}
      />
    </section>
  );
}
