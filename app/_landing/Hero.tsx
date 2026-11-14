"use client";

import { useRouter } from "next/navigation";
import { SupportHero } from "@/components/custom/blocks/SupportHeroBlock";
import {
  GoogleCalendarIcon,
  MicrosoftIcon,
  SlackIcon,
} from "@/components/custom/blocks/Icons";
import { IMG } from "./images";

export function Hero() {
  const router = useRouter();
  return (
    <SupportHero
      heading="Meeting notes that write themselves"
      subtitle="Notewise joins your calls, transcribes every word, and sends the summary, decisions and action items to your team before everyone has left the room."
      cta={{ label: "Start free", onClick: () => router.push("/register") }}
    >
      <SupportHero.Integrations
        icons={[
          <GoogleCalendarIcon key="c" />,
          <SlackIcon key="s" />,
          <MicrosoftIcon key="m" />,
        ]}
        title="Works where you meet"
        text="Calendar, Slack and Teams, connected in two clicks"
      />

      <SupportHero.Photo
        src={IMG.transcript}
        alt="A teammate reviewing a meeting transcript on a laptop"
        label="Transcript"
        position="58% center"
        className="lg:row-span-2 lg:h-auto"
      />

      <SupportHero.Stat
        value={98}
        suffix="%"
        caption="Transcription accuracy across 40+ languages"
        image={IMG.laptop}
        imageAlt="A laptop showing an AI assistant"
        imagePosition="70% center"
      />
      <SupportHero.Photo
        src={IMG.portrait}
        alt="A product lead smiling during a video call"
        position="center 40%"
      />
      <SupportHero.Stat
        value={4.2}
        decimals={1}
        suffix="h"
        caption="Saved per person, every single week"
        image={IMG.phone}
        imageAlt="A phone showing an AI summary"
        imagePosition="65% center"
      />

      <SupportHero.Team
        title={
          <>
            Every call
            <br />
            summarised
            <br />
            automatically
          </>
        }
        avatars={IMG.avatars}
      />
    </SupportHero>
  );
}
