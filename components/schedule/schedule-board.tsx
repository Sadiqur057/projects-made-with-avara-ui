"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CalendarX, Check, Clock, MapPin } from "lucide-react";
import {
  CATEGORIES,
  classBySlug,
  sessionsOnDay,
  trainerById,
  type CategoryId,
} from "@/lib/gym-data";
import { checkBooking, getAvailability, useGymState } from "@/lib/gym-store";
import { addDays, formatTime12, sessionStart, startOfDay, toISODate, useNow } from "@/lib/time";
import { AccessBanner } from "@/components/site/access-banner";
import { BookSessionDialog, type BookingTarget } from "@/components/site/book-dialog";
import { Badge, Button, Container } from "@/components/site/ui";
import { cn } from "@/lib/utils";

const DAY_FMT = new Intl.DateTimeFormat("en-US", { weekday: "short" });
const MONTH_FMT = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });

export function ScheduleBoard() {
  const state = useGymState();
  const nowMs = useNow();
  const [dayIndex, setDayIndex] = useState(0);
  const [category, setCategory] = useState<CategoryId | "all">("all");
  const [target, setTarget] = useState<BookingTarget | null>(null);

  const now = useMemo(() => (nowMs > 0 ? new Date(nowMs) : null), [nowMs]);
  const days = useMemo(() => {
    if (!now) return [];
    const today = startOfDay(now);
    return Array.from({ length: 14 }, (_, i) => addDays(today, i));
  }, [now]);

  if (!now) {
    return (
      <Container className="space-y-6 py-12" aria-busy="true">
        <div className="h-[76px] animate-pulse rounded-2xl bg-card/60" />
        <div className="h-20 animate-pulse rounded-2xl bg-card/60" />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-card/60" />
        ))}
      </Container>
    );
  }

  const selectedDay = days[dayIndex];
  const iso = toISODate(selectedDay);
  const sessions = sessionsOnDay(selectedDay.getDay()).filter((s) => {
    const c = classBySlug(s.classSlug)!;
    return category === "all" || c.category === category;
  });

  return (
    <Container className="space-y-8 py-12">
      <AccessBanner />

      <div>
        <p className="mb-3 text-sm font-semibold">{MONTH_FMT.format(selectedDay)}</p>
        <div role="tablist" aria-label="Choose a day" className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]">
          {days.map((d, i) => {
            const selected = i === dayIndex;
            return (
              <button
                key={d.toISOString()}
                role="tab"
                type="button"
                aria-selected={selected}
                onClick={() => setDayIndex(i)}
                className={cn(
                  "flex w-16 shrink-0 flex-col items-center gap-1 rounded-2xl border py-3 transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="text-[11px] font-semibold uppercase tracking-wider">{i === 0 ? "Today" : DAY_FMT.format(d)}</span>
                <span className="font-display text-2xl font-bold leading-none">{d.getDate()}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]" role="group" aria-label="Filter by category">
        {(["all", ...CATEGORIES.map((c) => c.id)] as const).map((id) => {
          const label = id === "all" ? "All classes" : CATEGORIES.find((c) => c.id === id)!.label;
          const selected = category === id;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={selected}
              onClick={() => setCategory(id)}
              className={cn(
                "h-10 shrink-0 rounded-full border px-4 text-sm font-semibold transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                selected
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      {sessions.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border p-12 text-center">
          <CalendarX className="size-10 text-muted-foreground" aria-hidden />
          <p className="text-lg font-semibold">No classes match on this day</p>
          <p className="text-sm text-muted-foreground">Try another day or switch back to all classes.</p>
          <Button variant="outline" onClick={() => setCategory("all")}>
            Show all classes
          </Button>
        </div>
      ) : (
        <ul className="space-y-3" aria-label={`Classes on ${iso}`}>
          {sessions.map((s) => {
            const c = classBySlug(s.classSlug)!;
            const trainer = trainerById(c.trainerId);
            const availability = getAvailability(state, s.id, iso);
            const mine = state.bookings.find(
              (b) => b.sessionId === s.id && b.date === iso && b.status !== "cancelled",
            );
            const started = sessionStart(iso, s.time).getTime() <= now.getTime();
            const check = checkBooking(state, s.id, iso, now);
            const outsideWindow = !check.ok && check.reason === "window";

            return (
              <li
                key={s.id}
                className={cn(
                  "grid items-center gap-4 rounded-2xl border border-border bg-card p-4 sm:grid-cols-[110px_1fr_auto] sm:p-5",
                  started && "opacity-50",
                )}
              >
                <div className="flex items-center gap-2 sm:block">
                  <p className="font-display text-3xl font-bold leading-none">{formatTime12(s.time)}</p>
                  <p className="inline-flex items-center gap-1 text-xs text-muted-foreground sm:mt-1">
                    <Clock className="size-3" aria-hidden /> {c.duration} min
                  </p>
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/classes/${c.slug}`} className="font-display text-2xl font-bold uppercase leading-none hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      {c.name}
                    </Link>
                    <Badge>{c.level}</Badge>
                  </div>
                  <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span>with {trainer.name}</span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3.5" aria-hidden /> {c.room}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      availability.full ? "text-destructive" : availability.left <= 3 ? "text-chart-1" : "text-muted-foreground",
                    )}
                  >
                    {availability.full ? "Full · waitlist open" : `${availability.left} spots left`}
                  </span>
                  {mine ? (
                    <Badge tone={mine.status === "waitlisted" ? "warning" : "success"}>
                      <Check className="size-3" aria-hidden />
                      {mine.status === "waitlisted" ? `Waitlist #${mine.waitlistPosition}` : "Booked"}
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      variant={availability.full ? "outline" : "primary"}
                      disabled={started || outsideWindow}
                      onClick={() => setTarget({ sessionId: s.id, date: iso })}
                      aria-label={`${availability.full ? "Join waitlist for" : "Book"} ${c.name} at ${formatTime12(s.time)}`}
                    >
                      {started ? "Started" : outsideWindow ? "Opens soon" : availability.full ? "Join waitlist" : "Book"}
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <BookSessionDialog target={target} onClose={() => setTarget(null)} />
    </Container>
  );
}
