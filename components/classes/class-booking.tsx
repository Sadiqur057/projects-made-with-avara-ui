"use client";

import Link from "next/link";
import { BookingCard, useBookingCard } from "@/components/custom/blocks/BookingCardBlock";
import { toast } from "@/components/custom/blocks/sonner-store";
import { SESSIONS, sessionsForClass, type GymClass, type Trainer } from "@/lib/gym-data";
import { BLOCK_MESSAGES, bookSession, getAccess, getAvailability, useGymState } from "@/lib/gym-store";
import { formatDateLong, formatTime12, toISODate, useNow } from "@/lib/time";
import { AccessBanner } from "@/components/site/access-banner";

const WAITLIST_SUFFIX = " · Waitlist";

function DaySlots({ classSlug }: { classSlug: string }) {
  const { day } = useBookingCard("Slots");
  const state = useGymState();

  if (!day) {
    return <p className="text-sm text-muted-foreground">Pick a day to see the times.</p>;
  }
  const iso = toISODate(day);
  const sessions = SESSIONS.filter((s) => s.classSlug === classSlug && s.day === day.getDay()).sort((a, b) =>
    a.time.localeCompare(b.time),
  );
  const slots = sessions.map((s) => {
    const availability = getAvailability(state, s.id, iso);
    const mine = state.bookings.some((b) => b.sessionId === s.id && b.date === iso && b.status !== "cancelled");
    return {
      label: `${formatTime12(s.time)}${availability.full && !mine ? WAITLIST_SUFFIX : ""}`,
      taken: mine,
    };
  });

  return <BookingCard.Slots label="Times (tap one)" slots={slots} />;
}

export function ClassBooking({ gymClass, trainer }: { gymClass: GymClass; trainer: Trainer }) {
  const state = useGymState();
  const nowMs = useNow();
  const access = nowMs > 0 ? getAccess(state, new Date(nowMs)) : { kind: "none" as const };
  const horizon = access.kind === "none" ? 8 : access.windowDays + 1;
  const weekdaysWithClass = new Set(sessionsForClass(gymClass.slug).map((s) => s.day));

  return (
    <div className="space-y-4">
      <AccessBanner />
      <div className="rounded-3xl border border-border bg-card text-card-foreground">
        <BookingCard
          className="flex flex-col gap-5 p-6"
          onBook={async ({ day, slot }) => {
            const iso = toISODate(day);
            const base = slot.replace(WAITLIST_SUFFIX, "");
            const session = SESSIONS.find(
              (s) => s.classSlug === gymClass.slug && s.day === day.getDay() && formatTime12(s.time) === base,
            );
            if (!session) {
              toast.error("That time is no longer available");
              throw new Error("missing session");
            }
            const result = bookSession(session.id, iso, new Date());
            if (!result.ok) {
              toast.error("Could not book that class", { description: BLOCK_MESSAGES[result.reason] });
              throw new Error(result.reason);
            }
            if (result.booking.status === "waitlisted") {
              toast.info(`You're #${result.booking.waitlistPosition} on the waitlist`, {
                description: `${gymClass.name} · ${formatDateLong(iso)} at ${formatTime12(session.time)}`,
              });
            } else {
              toast.success("Class booked", {
                description: `${gymClass.name} · ${formatDateLong(iso)} at ${formatTime12(session.time)}`,
              });
            }
          }}
        >
          <div>
            <h2 className="text-2xl font-bold uppercase">Book this class</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {gymClass.duration} min with {trainer.name} · {gymClass.room}
            </p>
          </div>
          <BookingCard.Days horizon={horizon} unavailable={(d) => !weekdaysWithClass.has(d.getDay())} />
          <DaySlots classSlug={gymClass.slug} />
          <BookingCard.Submit>Book</BookingCard.Submit>
          <p className="text-xs text-muted-foreground">
            Cancel for free until 2 hours before. Track every booking in your{" "}
            <Link href="/dashboard#bookings" className="underline underline-offset-4">
              dashboard
            </Link>
            .
          </p>
          <BookingCard.Confirmation withName={trainer.name} place={gymClass.room} />
        </BookingCard>
      </div>
    </div>
  );
}
