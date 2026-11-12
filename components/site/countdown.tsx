"use client";

import { useNow } from "@/lib/store";
import { cn } from "@/lib/utils";

const HOUR = 3_600_000;
const DAY = 24 * HOUR;
/** Each deal runs on a repeating 3-day window, staggered per deal so they do not all end together. */
const WINDOW = 3 * DAY;

export function dealEndsAt(now: number, offset: number) {
  const shifted = now + offset * HOUR * 5;
  return Math.ceil(shifted / WINDOW) * WINDOW - offset * HOUR * 5;
}

function Unit({ value, label, tone }: { value: string; label: string; tone: string }) {
  return (
    <div className={cn("flex min-w-12 flex-col items-center rounded-lg px-2 py-1.5", tone)}>
      <span className="text-lg font-semibold leading-none tabular-nums">{value}</span>
      <span className="mt-1 text-[10px] uppercase tracking-wider opacity-70">{label}</span>
    </div>
  );
}

export function Countdown({ offset = 0, tone = "bg-foreground/5", className }: { offset?: number; tone?: string; className?: string }) {
  const now = useNow(1000);
  const left = now === null ? null : Math.max(0, dealEndsAt(now, offset) - now);
  const pad = (n: number) => String(n).padStart(2, "0");
  const d = left === null ? "--" : pad(Math.floor(left / DAY));
  const h = left === null ? "--" : pad(Math.floor((left % DAY) / HOUR));
  const m = left === null ? "--" : pad(Math.floor((left % HOUR) / 60_000));
  const s = left === null ? "--" : pad(Math.floor((left % 60_000) / 1000));
  return (
    <div className={cn("flex items-center gap-1.5", className)} role="timer" aria-label="Time left on this deal">
      <Unit value={d} label="days" tone={tone} />
      <Unit value={h} label="hrs" tone={tone} />
      <Unit value={m} label="min" tone={tone} />
      <Unit value={s} label="sec" tone={tone} />
    </div>
  );
}
