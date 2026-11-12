"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BellRing,
  CalendarCheck,
  CalendarPlus,
  CircleCheck,
  Clock,
  CreditCard,
  Crown,
  Flame,
  MapPin,
  RotateCcw,
  Sparkles,
  Ticket,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/custom/blocks/DialogBlock";
import { toast } from "@/components/custom/blocks/sonner-store";
import { classBySlug, planById, planPrice, trainerById } from "@/lib/gym-data";
import {
  BLOCK_MESSAGES,
  CANCEL_CUTOFF_HOURS,
  TRIAL_CLASS_LIMIT,
  cancelBooking,
  cancelMembership,
  canCancel,
  canCheckIn,
  checkIn,
  creditsUsedInMonth,
  displayStatus,
  getAccess,
  pastBookings,
  promoteWaitlist,
  resetDemoData,
  trialClassesUsed,
  upcomingBookings,
  useGymState,
  type Booking,
  type DisplayStatus,
} from "@/lib/gym-store";
import { daysBetween, formatDateLong, formatFullDate, formatTime12, useNow } from "@/lib/time";
import { Badge, Button, Container, LinkButton } from "@/components/site/ui";
import { cn } from "@/lib/utils";

const STATUS: Record<DisplayStatus, { label: string; tone: "muted" | "primary" | "success" | "warning" | "danger" }> = {
  confirmed: { label: "Confirmed", tone: "success" },
  starting_soon: { label: "Starting soon", tone: "primary" },
  waitlisted: { label: "Waitlisted", tone: "warning" },
  checked_in: { label: "Checked in", tone: "primary" },
  attended: { label: "Attended", tone: "success" },
  missed: { label: "Missed", tone: "danger" },
  cancelled: { label: "Cancelled", tone: "muted" },
  expired: { label: "Expired", tone: "muted" },
};

type Tab = "upcoming" | "past" | "cancelled";

function Stat({ icon: Icon, label, value, hint }: { icon: typeof Flame; label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <Icon className="size-5 text-primary" aria-hidden />
      <p className="mt-3 font-display text-4xl font-extrabold leading-none">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground/80">{hint}</p>}
    </div>
  );
}

function BookingRow({ booking, now, onCancel }: { booking: Booking; now: Date; onCancel: (b: Booking) => void }) {
  const gymClass = classBySlug(booking.classSlug)!;
  const trainer = trainerById(gymClass.trainerId);
  const status = displayStatus(booking, now);
  const meta = STATUS[status];
  const isCheckIn = canCheckIn(booking, now);
  const isCancellable = canCancel(booking, now);
  const [open, setOpen] = useState(false);

  return (
    <li className="rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={gymClass.image} alt="" className="size-16 shrink-0 rounded-xl object-cover" loading="lazy" />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/classes/${gymClass.slug}`}
                className="font-display text-2xl font-bold uppercase leading-none hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {gymClass.name}
              </Link>
              <Badge tone={meta.tone}>{meta.label}</Badge>
              {booking.status === "waitlisted" && booking.waitlistPosition && (
                <Badge tone="warning">#{booking.waitlistPosition} in line</Badge>
              )}
            </div>
            <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3.5" aria-hidden />
                {formatDateLong(booking.date)} · {formatTime12(booking.time)}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3.5" aria-hidden />
                {gymClass.room} · {trainer.name}
              </span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground/80">Booking ref {booking.id}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {isCheckIn && (
            <Button
              size="sm"
              onClick={() => {
                if (checkIn(booking.id)) toast.success("Checked in", { description: `Have a great ${gymClass.name} session.` });
              }}
            >
              <CircleCheck className="size-4" aria-hidden /> Check in
            </Button>
          )}
          {booking.status === "waitlisted" && status === "waitlisted" && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                promoteWaitlist(booking.id);
                toast.success("A spot opened up", { description: `You're confirmed for ${gymClass.name}.` });
              }}
            >
              <BellRing className="size-4" aria-hidden /> Simulate spot opening
            </Button>
          )}
          {isCancellable && (
            <Button size="sm" variant="destructive" onClick={() => onCancel(booking)}>
              <X className="size-4" aria-hidden /> {booking.status === "waitlisted" ? "Leave waitlist" : "Cancel"}
            </Button>
          )}
          {(status === "attended" || status === "missed" || status === "cancelled" || status === "expired") && (
            <LinkButton href={`/classes/${gymClass.slug}`} size="sm" variant="outline">
              <RotateCcw className="size-4" aria-hidden /> Book again
            </LinkButton>
          )}
          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="h-9 rounded-full px-3 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {open ? "Hide" : "Tracking"}
          </button>
        </div>
      </div>

      {open && (
        <ol className="mt-5 space-y-3 border-t border-border pt-5" aria-label="Booking history">
          {booking.history.map((e, i) => (
            <li key={`${e.at}-${i}`} className="relative flex gap-3 pl-1 text-sm">
              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" aria-hidden />
              <div>
                <p className="font-medium">{e.label}</p>
                <p className="text-xs text-muted-foreground">{formatFullDate(e.at)} · {new Date(e.at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </li>
  );
}

export function Dashboard() {
  const state = useGymState();
  const nowMs = useNow();
  const [tab, setTab] = useState<Tab>("upcoming");
  const [toCancel, setToCancel] = useState<Booking | null>(null);
  const [confirmEnd, setConfirmEnd] = useState(false);

  if (nowMs === 0) {
    return (
      <Container className="space-y-6 py-12" aria-busy="true">
        <div className="h-40 animate-pulse rounded-3xl bg-card/60" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-card/60" />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-3xl bg-card/60" />
      </Container>
    );
  }

  const now = new Date(nowMs);
  const access = getAccess(state, now);
  const upcoming = upcomingBookings(state, now);
  const past = pastBookings(state, now).filter((b) => b.status !== "cancelled");
  const cancelled = state.bookings.filter((b) => b.status === "cancelled");
  const attended = state.bookings.filter((b) => displayStatus(b, now) === "attended").length;
  const used = creditsUsedInMonth(state, now);
  const membership = state.membership;
  const plan = membership ? planById(membership.planId) : null;

  const list = tab === "upcoming" ? upcoming : tab === "past" ? past : cancelled;
  const counts = { upcoming: upcoming.length, past: past.length, cancelled: cancelled.length };

  const confirmCancel = () => {
    if (!toCancel) return;
    const result = cancelBooking(toCancel.id);
    if (result.ok) {
      toast.success("Booking cancelled", { description: "Your class credit has been returned." });
    } else {
      toast.error("Could not cancel", { description: `Bookings can be cancelled until ${CANCEL_CUTOFF_HOURS} hours before the class.` });
    }
    setToCancel(null);
  };

  const creditLimit = access.kind === "member" ? access.monthlyLimit : access.kind === "trial" ? TRIAL_CLASS_LIMIT : null;
  const creditUsed = access.kind === "trial" ? trialClassesUsed(state) : used;
  const creditPct = creditLimit ? Math.min(100, Math.round((creditUsed / creditLimit) * 100)) : 0;

  return (
    <Container className="space-y-10 py-12">
      {/* Membership summary */}
      <section aria-labelledby="membership-heading" className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 sm:p-8">
          <div aria-hidden className="absolute -right-16 -top-16 size-64 rounded-full bg-primary/15 blur-3xl" />
          <div className="relative">
            {access.kind === "member" && plan && membership ? (
              <>
                <Badge tone="primary">
                  <Crown className="size-3" aria-hidden /> Active member
                </Badge>
                <h2 id="membership-heading" className="mt-3 text-5xl font-extrabold uppercase">
                  {plan.name} plan
                </h2>
                <p className="mt-2 text-muted-foreground">
                  ${planPrice(plan, membership.cycle)}/month, billed {membership.cycle === "annual" ? "annually" : "monthly"}. Renews{" "}
                  {formatFullDate(membership.renewsAt)} ({Math.max(0, daysBetween(now, new Date(membership.renewsAt)))} days).
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <LinkButton href="/membership">Change plan</LinkButton>
                  <Button variant="destructive" onClick={() => setConfirmEnd(true)}>
                    Cancel membership
                  </Button>
                </div>
              </>
            ) : access.kind === "trial" ? (
              <>
                <Badge tone="primary">
                  <Sparkles className="size-3" aria-hidden /> Free trial
                </Badge>
                <h2 id="membership-heading" className="mt-3 text-5xl font-extrabold uppercase">
                  {Math.max(0, daysBetween(now, access.expiresAt))} days left
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Hi {state.trial?.name?.split(" ")[0]}, your trial ends {formatFullDate(access.expiresAt)}. Love it? Lock in a plan before then.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <LinkButton href="/membership/checkout?plan=pro&cycle=annual">Join with Pro</LinkButton>
                  <LinkButton href="/membership" variant="outline">
                    Compare plans
                  </LinkButton>
                </div>
              </>
            ) : (
              <>
                <Badge>{membership?.status === "cancelled" ? "Membership ended" : "No active plan"}</Badge>
                <h2 id="membership-heading" className="mt-3 text-5xl font-extrabold uppercase">
                  {membership?.status === "cancelled" ? "Come back anytime" : "Start training today"}
                </h2>
                <p className="mt-2 max-w-lg text-muted-foreground">
                  {state.trial
                    ? "Your free trial has ended. Join to keep booking classes."
                    : "Start a 7-day free trial or pick a membership to book classes and track your sessions here."}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {!state.trial && <LinkButton href="/#free-trial">Start free trial</LinkButton>}
                  <LinkButton href="/membership" variant={state.trial ? "primary" : "outline"}>
                    See memberships
                  </LinkButton>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <Ticket className="size-4 text-primary" aria-hidden />
            {access.kind === "trial" ? "Trial classes" : "Class credits this month"}
          </h3>
          {access.kind === "none" ? (
            <p className="mt-4 text-sm text-muted-foreground">Credits appear here once you have a trial or membership.</p>
          ) : creditLimit === null ? (
            <>
              <p className="mt-4 font-display text-6xl font-extrabold">∞</p>
              <p className="text-sm text-muted-foreground">Unlimited classes. {used} booked this month.</p>
            </>
          ) : (
            <>
              <p className="mt-4 font-display text-6xl font-extrabold">
                {Math.max(0, creditLimit - creditUsed)}
                <span className="text-2xl text-muted-foreground"> / {creditLimit} left</span>
              </p>
              <div
                role="progressbar"
                aria-label="Class credits used"
                aria-valuemin={0}
                aria-valuemax={creditLimit}
                aria-valuenow={creditUsed}
                className="mt-4 h-2.5 overflow-hidden rounded-full bg-secondary"
              >
                <div className="h-full rounded-full bg-primary transition-[width] duration-500 motion-reduce:transition-none" style={{ width: `${creditPct}%` }} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {creditUsed} used · cancellations return credits instantly.
              </p>
            </>
          )}
        </div>
      </section>

      {/* Stats */}
      <section aria-label="Your stats" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={CalendarCheck} label="Upcoming classes" value={String(upcoming.length)} />
        <Stat icon={Flame} label="Classes attended" value={String(attended)} />
        <Stat icon={BellRing} label="On waitlists" value={String(upcoming.filter((b) => b.status === "waitlisted").length)} />
        <Stat icon={CreditCard} label="Orders" value={String(state.orders.length)} />
      </section>

      {/* Booking tracking */}
      <section id="bookings" aria-labelledby="bookings-heading" className="scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="bookings-heading" className="text-4xl font-extrabold uppercase">
            My bookings
          </h2>
          <LinkButton href="/schedule" size="sm">
            <CalendarPlus className="size-4" aria-hidden /> Book a class
          </LinkButton>
        </div>

        <div role="tablist" aria-label="Booking status" className="mt-6 inline-flex rounded-full border border-border bg-card p-1">
          {(["upcoming", "past", "cancelled"] as const).map((t) => (
            <button
              key={t}
              role="tab"
              type="button"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={cn(
                "h-10 rounded-full px-5 text-sm font-semibold capitalize transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t} <span className="ml-1 opacity-70">{counts[t]}</span>
            </button>
          ))}
        </div>

        <div role="tabpanel" className="mt-6">
          {list.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border p-12 text-center">
              <CalendarPlus className="size-10 text-muted-foreground" aria-hidden />
              <p className="text-lg font-semibold">
                {tab === "upcoming" ? "Nothing booked yet" : tab === "past" ? "No past classes yet" : "No cancelled bookings"}
              </p>
              <p className="max-w-sm text-sm text-muted-foreground">
                {tab === "upcoming"
                  ? access.kind === "none"
                    ? BLOCK_MESSAGES.no_access
                    : "Pick a class from the schedule and it will show up here with live status updates."
                  : "They will appear here once you have some."}
              </p>
              {tab === "upcoming" && <LinkButton href="/schedule">Browse the schedule</LinkButton>}
            </div>
          ) : (
            <ul className="space-y-4">
              {list.map((b) => (
                <BookingRow key={b.id} booking={b} now={now} onCancel={setToCancel} />
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Billing */}
      <section aria-labelledby="billing-heading">
        <h2 id="billing-heading" className="text-4xl font-extrabold uppercase">
          Billing history
        </h2>
        {state.orders.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No orders yet. Your receipts will appear here after checkout.
          </p>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full min-w-[560px] text-left text-sm">
              <caption className="sr-only">Membership orders</caption>
              <thead className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th scope="col" className="p-4">Order</th>
                  <th scope="col" className="p-4">Date</th>
                  <th scope="col" className="p-4">Plan</th>
                  <th scope="col" className="p-4">Card</th>
                  <th scope="col" className="p-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {state.orders.map((o) => (
                  <tr key={o.id} className="border-b border-border last:border-b-0">
                    <th scope="row" className="p-4 font-mono text-xs font-medium">{o.id}</th>
                    <td className="p-4">{formatFullDate(o.createdAt)}</td>
                    <td className="p-4">{planById(o.planId)?.name} · {o.cycle}</td>
                    <td className="p-4">•••• {o.last4}</td>
                    <td className="p-4 text-right font-semibold">${o.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="mt-6 text-right">
          <button
            type="button"
            onClick={() => {
              resetDemoData();
              toast.info("Demo data cleared");
            }}
            className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Reset demo data
          </button>
        </div>
      </section>

      <Dialog open={toCancel !== null} onOpenChange={(open) => !open && setToCancel(null)}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Cancel this booking?</DialogTitle>
            <DialogDescription>
              {toCancel && `${classBySlug(toCancel.classSlug)?.name} · ${formatDateLong(toCancel.date)} at ${formatTime12(toCancel.time)}`}
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Your spot will be released to the next person on the waitlist.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setToCancel(null)}>
              Keep booking
            </Button>
            <Button variant="destructive" onClick={confirmCancel}>
              Yes, cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmEnd} onOpenChange={setConfirmEnd}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Cancel your membership?</DialogTitle>
            <DialogDescription>You will lose access to booking and the gym floor.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmEnd(false)}>
              Keep membership
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                cancelMembership();
                setConfirmEnd(false);
                toast.info("Membership cancelled", { description: "You can rejoin any time." });
              }}
            >
              Cancel membership
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
