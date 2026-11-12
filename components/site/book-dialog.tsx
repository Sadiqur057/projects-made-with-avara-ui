"use client";

import { useRouter } from "next/navigation";
import { CalendarCheck, Clock, MapPin, User, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/custom/blocks/DialogBlock";
import { toast } from "@/components/custom/blocks/sonner-store";
import { classBySlug, sessionById, trainerById } from "@/lib/gym-data";
import {
  BLOCK_MESSAGES,
  bookSession,
  checkBooking,
  getAvailability,
  useGymState,
} from "@/lib/gym-store";
import { formatDateLong, formatTime12, useNow } from "@/lib/time";
import { Button, LinkButton } from "@/components/site/ui";

export interface BookingTarget {
  sessionId: string;
  date: string;
}

export function BookSessionDialog({
  target,
  onClose,
}: {
  target: BookingTarget | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const state = useGymState();
  const nowMs = useNow();
  const session = target ? sessionById(target.sessionId) : null;
  const gymClass = session ? classBySlug(session.classSlug) : null;
  const trainer = gymClass ? trainerById(gymClass.trainerId) : null;
  const ready = nowMs > 0;
  const now = new Date(nowMs || 0);

  const check = target && ready ? checkBooking(state, target.sessionId, target.date, now) : null;
  const availability = target ? getAvailability(state, target.sessionId, target.date) : null;
  const waitlist = check?.ok ? check.waitlist : availability?.full;

  const confirm = () => {
    if (!target || !gymClass) return;
    const result = bookSession(target.sessionId, target.date, new Date());
    if (!result.ok) {
      toast.error("Could not book that class", { description: BLOCK_MESSAGES[result.reason] });
      return;
    }
    if (result.booking.status === "waitlisted") {
      toast.info(`You're #${result.booking.waitlistPosition} on the waitlist`, {
        description: `${gymClass.name} · we'll confirm you if a spot opens.`,
        action: { label: "View", onClick: () => router.push("/dashboard#bookings") },
      });
    } else {
      toast.success("Class booked", {
        description: `${gymClass.name} · ${formatDateLong(target.date)} at ${formatTime12(result.booking.time)}`,
        action: { label: "View", onClick: () => router.push("/dashboard#bookings") },
      });
    }
    onClose();
  };

  return (
    <Dialog open={target !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="md">
        {target && session && gymClass && trainer && (
          <>
            <DialogHeader>
              <DialogTitle>{waitlist ? "Join the waitlist" : "Confirm your booking"}</DialogTitle>
              <DialogDescription>
                {gymClass.name} · {formatDateLong(target.date)}
              </DialogDescription>
            </DialogHeader>

            <dl className="grid grid-cols-2 gap-3 py-2 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-primary" aria-hidden />
                <div>
                  <dt className="sr-only">Time</dt>
                  <dd>
                    {formatTime12(session.time)} · {gymClass.duration} min
                  </dd>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-primary" aria-hidden />
                <div>
                  <dt className="sr-only">Room</dt>
                  <dd>{gymClass.room}</dd>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="size-4 text-primary" aria-hidden />
                <div>
                  <dt className="sr-only">Coach</dt>
                  <dd>{trainer.name}</dd>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="size-4 text-primary" aria-hidden />
                <div>
                  <dt className="sr-only">Spots</dt>
                  <dd>
                    {availability?.full
                      ? "Class full"
                      : `${availability?.left} of ${availability?.capacity} spots left`}
                  </dd>
                </div>
              </div>
            </dl>

            {check && !check.ok && (
              <div
                role="alert"
                className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-foreground"
              >
                <p className="font-semibold">{BLOCK_MESSAGES[check.reason]}</p>
                {(check.reason === "no_access" || check.reason === "trial_expired" || check.reason === "trial_limit") && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {check.reason === "no_access" && (
                      <LinkButton href="/#free-trial" size="sm" onClick={onClose}>
                        Start free trial
                      </LinkButton>
                    )}
                    <LinkButton href="/membership" size="sm" variant="outline" onClick={onClose}>
                      See memberships
                    </LinkButton>
                  </div>
                )}
              </div>
            )}

            {check?.ok && waitlist && (
              <p className="rounded-2xl bg-secondary p-4 text-sm text-muted-foreground">
                This class is full. Join the waitlist and we will confirm your spot automatically if someone
                cancels. It does not use a class credit until you are confirmed.
              </p>
            )}
            {check?.ok && !waitlist && (
              <p className="flex items-start gap-2 text-sm text-muted-foreground">
                <CalendarCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                Free cancellation until 2 hours before the class starts.
              </p>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Not now
              </Button>
              <Button onClick={confirm} disabled={!check?.ok}>
                {waitlist ? "Join waitlist" : "Confirm booking"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
