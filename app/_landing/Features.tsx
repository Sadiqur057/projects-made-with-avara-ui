"use client";

import {
  AudioLines,
  Bell,
  Bookmark,
  CalendarCheck,
  Clock,
  FileText,
  Globe,
  Highlighter,
  Languages,
  Link2,
  ListChecks,
  Lock,
  Mail,
  MessageSquareQuote,
  Mic,
  PieChart,
  Search,
  Share2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Tag,
  Users,
  Video,
  Webhook,
  Wand2,
  Timer,
  FolderOpen,
  KeyRound,
  Puzzle,
  BarChart3,
  Repeat,
} from "lucide-react";
import { PlatformGrid } from "@/components/custom/blocks/PlatformGridBlock";

export function Features() {
  return (
    <section id="features" className="px-4 py-20 sm:px-6">
      <PlatformGrid
        eyebrow="Everything in one place"
        heading={
          <>
            Every meeting, captured
            <br />
            and put to work
          </>
        }
        intro="From the first word to the follow-up email, Notewise handles the busywork so your team can stay in the conversation."
        className="mx-auto max-w-6xl overflow-hidden rounded-[28px] border border-border pb-10"
      >
        <PlatformGrid.Tile icon={<Mic />} label="Live transcript" />
        <PlatformGrid.Tile icon={<Users />} label="Speaker labels" />
        <PlatformGrid.Tile icon={<Sparkles />} label="AI summaries" />
        <PlatformGrid.Tile icon={<ListChecks />} label="Action items" />
        <PlatformGrid.Tile icon={<Bookmark />} label="Decision log" />
        <PlatformGrid.Tile icon={<Search />} label="Smart search" />
        <PlatformGrid.Tile icon={<Languages />} label="40+ languages" />
        <PlatformGrid.Tile icon={<CalendarCheck />} label="Calendar sync" />

        <PlatformGrid.Tile icon={<Share2 />} label="Slack digest" />
        <PlatformGrid.Tile icon={<Mail />} label="Email recap" />

        <PlatformGrid.Feature icon={<AudioLines />} label="Live transcript">
          <PlatformGrid.Mock>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[9px] font-semibold">Q4 roadmap sync</span>
              <PlatformGrid.Pill>● Recording</PlatformGrid.Pill>
            </div>
            <p className="text-[7px] leading-snug text-foreground/60">
              <b className="text-foreground">Ana:</b> Let&rsquo;s lock the launch for the 14th.
            </p>
            <p className="text-[7px] leading-snug text-foreground/60">
              <b className="text-foreground">Raj:</b> Design can hand off by Friday.
            </p>
            <div className="flex items-center justify-between pt-0.5">
              <PlatformGrid.Pill tone="soft">00:24:18</PlatformGrid.Pill>
              <PlatformGrid.Pill tone="accent">Live</PlatformGrid.Pill>
            </div>
          </PlatformGrid.Mock>
        </PlatformGrid.Feature>

        <PlatformGrid.Feature icon={<ListChecks />} label="Action items">
          <PlatformGrid.Mock>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[9px] font-semibold">3 follow-ups found</span>
              <PlatformGrid.Pill tone="soft">Auto</PlatformGrid.Pill>
            </div>
            <p className="truncate text-[7px] text-foreground/60">☐ Raj — design handoff, Fri</p>
            <p className="truncate text-[7px] text-foreground/60">☐ Mei — update the launch brief</p>
            <div className="flex items-center justify-between pt-0.5">
              <PlatformGrid.Pill tone="soft">2 owners</PlatformGrid.Pill>
              <PlatformGrid.Pill tone="accent">Send to Slack</PlatformGrid.Pill>
            </div>
          </PlatformGrid.Mock>
        </PlatformGrid.Feature>

        <PlatformGrid.Tile icon={<FolderOpen />} label="Shared folders" />
        <PlatformGrid.Tile icon={<Highlighter />} label="Highlights" />
        <PlatformGrid.Tile icon={<Clock />} label="Timestamps" />
        <PlatformGrid.Tile icon={<Tag />} label="Topic tags" />
        <PlatformGrid.Tile icon={<Wand2 />} label="Follow-up drafts" />
        <PlatformGrid.Tile icon={<FileText />} label="Custom templates" />
        <PlatformGrid.Tile icon={<Users />} label="Team workspaces" />
        <PlatformGrid.Tile icon={<KeyRound />} label="Role permissions" />

        <PlatformGrid.Feature icon={<Sparkles />} label="AI summary">
          <PlatformGrid.Mock>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[9px] font-semibold">Summary</span>
              <PlatformGrid.Pill>1 min read</PlatformGrid.Pill>
            </div>
            <p className="text-[7px] leading-snug text-foreground/60">
              Team agreed to ship on the 14th. Pricing page copy still needs legal review.
            </p>
            <div className="flex flex-wrap gap-1">
              <PlatformGrid.Pill tone="soft">launch</PlatformGrid.Pill>
              <PlatformGrid.Pill tone="soft">pricing</PlatformGrid.Pill>
            </div>
          </PlatformGrid.Mock>
        </PlatformGrid.Feature>

        <PlatformGrid.Feature icon={<Search />} label="Search every meeting">
          <PlatformGrid.Mock>
            <p className="text-[8px] italic leading-snug text-foreground/70">
              &ldquo;What did we decide about the pricing page?&rdquo;
            </p>
            <div className="flex flex-wrap gap-1">
              <PlatformGrid.Pill tone="soft">4 meetings</PlatformGrid.Pill>
              <PlatformGrid.Pill tone="soft">Last week</PlatformGrid.Pill>
            </div>
            <div className="flex items-center justify-between pt-0.5">
              <PlatformGrid.Pill>Answer ready</PlatformGrid.Pill>
              <PlatformGrid.Pill tone="accent">Open →</PlatformGrid.Pill>
            </div>
          </PlatformGrid.Mock>
        </PlatformGrid.Feature>

        <PlatformGrid.Tile icon={<ShieldCheck />} label="SOC 2 ready" />
        <PlatformGrid.Tile icon={<Smartphone />} label="Mobile app" />
        <PlatformGrid.Tile icon={<Video />} label="Zoom & Meet bots" />
        <PlatformGrid.Tile icon={<Puzzle />} label="Integrations" />
        <PlatformGrid.Tile icon={<Webhook />} label="Webhooks" />
        <PlatformGrid.Tile icon={<Bell />} label="Keyword alerts" />
        <PlatformGrid.Tile icon={<Lock />} label="Redaction" />
        <PlatformGrid.Tile icon={<Globe />} label="Data residency" />
        <PlatformGrid.Tile icon={<PieChart />} label="Talk-time stats" />
        <PlatformGrid.Tile icon={<BarChart3 />} label="Meeting analytics" />
        <PlatformGrid.Tile icon={<MessageSquareQuote />} label="Quote pull-outs" />
        <PlatformGrid.Tile icon={<Link2 />} label="Share links" />
        <PlatformGrid.Tile icon={<Timer />} label="Time-saved report" />
        <PlatformGrid.Tile icon={<Repeat />} label="Recurring series" />
      </PlatformGrid>
    </section>
  );
}
