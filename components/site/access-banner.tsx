"use client";

import { Crown, Sparkles, Ticket } from "lucide-react";
import { planById } from "@/lib/gym-data";
import { creditsUsedInMonth, getAccess, trialClassesUsed, TRIAL_CLASS_LIMIT, useGymState } from "@/lib/gym-store";
import { daysBetween, useNow } from "@/lib/time";
import { LinkButton } from "@/components/site/ui";

/** Tells the visitor what they can book right now, and how to unlock more. */
export function AccessBanner() {
  const state = useGymState();
  const nowMs = useNow();
  if (nowMs === 0) {
    return <div className="h-[76px] animate-pulse rounded-2xl border border-border bg-card/50" aria-hidden />;
  }
  const now = new Date(nowMs);
  const access = getAccess(state, now);

  if (access.kind === "member") {
    const plan = planById(access.planId)!;
    const used = creditsUsedInMonth(state, now);
    const left = access.monthlyLimit === null ? null : Math.max(0, access.monthlyLimit - used);
    return (
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-primary/30 bg-primary/10 p-4 text-sm">
        <Crown className="size-5 text-primary" aria-hidden />
        <p className="flex-1">
          <span className="font-semibold">{plan.name} member.</span>{" "}
          {left === null ? "Unlimited classes." : `${left} of ${access.monthlyLimit} class credits left this month.`}{" "}
          Book up to {access.windowDays} days ahead.
        </p>
        <LinkButton href="/dashboard" size="sm" variant="outline">
          My bookings
        </LinkButton>
      </div>
    );
  }

  if (access.kind === "trial") {
    const used = trialClassesUsed(state);
    const daysLeft = Math.max(0, daysBetween(now, access.expiresAt));
    return (
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-primary/30 bg-primary/10 p-4 text-sm">
        <Sparkles className="size-5 text-primary" aria-hidden />
        <p className="flex-1">
          <span className="font-semibold">Free trial.</span> {Math.max(0, TRIAL_CLASS_LIMIT - used)} of{" "}
          {TRIAL_CLASS_LIMIT} classes left · {daysLeft} {daysLeft === 1 ? "day" : "days"} remaining.
        </p>
        <LinkButton href="/membership" size="sm">
          Upgrade
        </LinkButton>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4 text-sm">
      <Ticket className="size-5 text-primary" aria-hidden />
      <p className="flex-1">
        <span className="font-semibold">Ready to book?</span> Start a 7-day free trial or join to reserve your spot.
      </p>
      <div className="flex gap-2">
        <LinkButton href="/#free-trial" size="sm">
          Free trial
        </LinkButton>
        <LinkButton href="/membership" size="sm" variant="outline">
          Memberships
        </LinkButton>
      </div>
    </div>
  );
}
