"use client";

import { useSyncExternalStore } from "react";
import {
  classBySlug,
  planById,
  sessionById,
  type Cycle,
  type PlanId,
} from "@/lib/gym-data";
import {
  addDays,
  baseSpotsTaken,
  daysBetween,
  parseISODate,
  sessionEnd,
  sessionStart,
  startOfDay,
  toISODate,
} from "@/lib/time";

// ---------------------------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------------------------
export type BookingStatus = "confirmed" | "waitlisted" | "cancelled" | "checked_in";

export interface BookingEvent {
  label: string;
  at: string; // ISO timestamp
}

export interface Booking {
  id: string;
  sessionId: string;
  classSlug: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  status: BookingStatus;
  createdAt: string;
  waitlistPosition?: number;
  history: BookingEvent[];
}

export interface Membership {
  planId: PlanId;
  cycle: Cycle;
  startedAt: string;
  renewsAt: string;
  orderId: string;
  status: "active" | "cancelled";
}

export interface Trial {
  name: string;
  email: string;
  startedAt: string;
  expiresAt: string;
}

export interface Order {
  id: string;
  planId: PlanId;
  cycle: Cycle;
  subtotal: number;
  discount: number;
  total: number;
  promo?: string;
  createdAt: string;
  name: string;
  email: string;
  last4: string;
}

export interface GymState {
  v: 1;
  bookings: Booking[];
  membership: Membership | null;
  trial: Trial | null;
  orders: Order[];
  offerEndsAt: string | null;
}

export const EMPTY_STATE: GymState = {
  v: 1,
  bookings: [],
  membership: null,
  trial: null,
  orders: [],
  offerEndsAt: null,
};

// ---------------------------------------------------------------------------------------------
// External store backed by localStorage
// ---------------------------------------------------------------------------------------------
const KEY = "ironpulse:v1";
let state: GymState = EMPTY_STATE;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as GymState;
      if (parsed && parsed.v === 1) state = { ...EMPTY_STATE, ...parsed };
    }
  } catch {
    /* storage unavailable or corrupt — start fresh */
  }
}

function commit(next: GymState) {
  state = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore quota / privacy-mode errors; state still lives in memory */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      loaded = false;
      listeners.forEach((l) => l());
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  if (!loaded) load();
  return state;
}

const getServerSnapshot = () => EMPTY_STATE;

export const useGymState = () => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

// ---------------------------------------------------------------------------------------------
// Rules
// ---------------------------------------------------------------------------------------------
export const CANCEL_CUTOFF_HOURS = 2;
export const TRIAL_DAYS = 7;
export const TRIAL_CLASS_LIMIT = 3;
export const BOOKING_WINDOW_DAYS: Record<PlanId | "trial", number> = {
  starter: 3,
  pro: 7,
  elite: 14,
  trial: 3,
};

export type AccessInfo =
  | { kind: "member"; planId: PlanId; windowDays: number; monthlyLimit: number | null }
  | { kind: "trial"; windowDays: number; expiresAt: Date; classLimit: number }
  | { kind: "none" };

export function getAccess(s: GymState, now: Date): AccessInfo {
  if (s.membership && s.membership.status === "active") {
    const plan = planById(s.membership.planId)!;
    return {
      kind: "member",
      planId: plan.id,
      windowDays: BOOKING_WINDOW_DAYS[plan.id],
      monthlyLimit: plan.classLimit,
    };
  }
  if (s.trial) {
    const expiresAt = new Date(s.trial.expiresAt);
    if (expiresAt.getTime() > now.getTime()) {
      return { kind: "trial", windowDays: BOOKING_WINDOW_DAYS.trial, expiresAt, classLimit: TRIAL_CLASS_LIMIT };
    }
  }
  return { kind: "none" };
}

const isActiveBooking = (b: Booking) => b.status === "confirmed" || b.status === "checked_in";

/** Classes counted against the allowance: confirmed or attended bookings in the same calendar month. */
export function creditsUsedInMonth(s: GymState, ref: Date) {
  return s.bookings.filter((b) => {
    if (!isActiveBooking(b)) return false;
    const d = parseISODate(b.date);
    return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
  }).length;
}

export function trialClassesUsed(s: GymState) {
  if (!s.trial) return 0;
  return s.bookings.filter((b) => isActiveBooking(b) && b.createdAt >= s.trial!.startedAt).length;
}

export type BlockReason =
  | "no_access"
  | "past"
  | "window"
  | "monthly_limit"
  | "trial_limit"
  | "duplicate"
  | "conflict"
  | "trial_expired";

export const BLOCK_MESSAGES: Record<BlockReason, string> = {
  no_access: "Start a free trial or join to book classes.",
  past: "This class has already started.",
  window: "This class is outside your booking window.",
  monthly_limit: "You have used all class credits for that month.",
  trial_limit: "Your trial includes 3 classes. Join to keep booking.",
  duplicate: "You already have this class booked.",
  conflict: "You have another class at the same time.",
  trial_expired: "Your free trial has ended. Join to keep booking.",
};

export interface Availability {
  capacity: number;
  taken: number;
  left: number;
  full: boolean;
}

export function getAvailability(s: GymState, sessionId: string, dateISO: string): Availability {
  const session = sessionById(sessionId);
  const capacity = classBySlug(session?.classSlug ?? "")?.capacity ?? 12;
  const mine = s.bookings.filter(
    (b) => b.sessionId === sessionId && b.date === dateISO && isActiveBooking(b),
  ).length;
  const taken = Math.min(capacity, baseSpotsTaken(sessionId, dateISO) + mine);
  return { capacity, taken, left: capacity - taken, full: taken >= capacity };
}

export function checkBooking(
  s: GymState,
  sessionId: string,
  dateISO: string,
  now: Date,
): { ok: true; waitlist: boolean } | { ok: false; reason: BlockReason } {
  const session = sessionById(sessionId);
  if (!session) return { ok: false, reason: "past" };
  const access = getAccess(s, now);
  if (access.kind === "none") {
    return { ok: false, reason: s.trial ? "trial_expired" : "no_access" };
  }
  const start = sessionStart(dateISO, session.time);
  if (start.getTime() <= now.getTime()) return { ok: false, reason: "past" };
  if (daysBetween(now, start) > access.windowDays) return { ok: false, reason: "window" };

  const existing = s.bookings.find(
    (b) => b.sessionId === sessionId && b.date === dateISO && b.status !== "cancelled",
  );
  if (existing) return { ok: false, reason: "duplicate" };

  const clash = s.bookings.some(
    (b) => isActiveBooking(b) && b.date === dateISO && b.time === session.time,
  );
  if (clash) return { ok: false, reason: "conflict" };

  if (access.kind === "member" && access.monthlyLimit !== null) {
    if (creditsUsedInMonth(s, parseISODate(dateISO)) >= access.monthlyLimit) {
      return { ok: false, reason: "monthly_limit" };
    }
  }
  if (access.kind === "trial" && trialClassesUsed(s) >= access.classLimit) {
    return { ok: false, reason: "trial_limit" };
  }

  return { ok: true, waitlist: getAvailability(s, sessionId, dateISO).full };
}

export type DisplayStatus =
  | "confirmed"
  | "starting_soon"
  | "waitlisted"
  | "checked_in"
  | "attended"
  | "missed"
  | "cancelled"
  | "expired";

export function displayStatus(b: Booking, now: Date): DisplayStatus {
  const session = sessionById(b.sessionId);
  const end = session ? sessionEnd(b.date, session) : sessionEnd(b.date, { classSlug: b.classSlug, time: b.time });
  const start = sessionStart(b.date, b.time);
  const over = end.getTime() < now.getTime();
  switch (b.status) {
    case "cancelled":
      return "cancelled";
    case "checked_in":
      return over ? "attended" : "checked_in";
    case "waitlisted":
      return over || start.getTime() < now.getTime() ? "expired" : "waitlisted";
    case "confirmed":
      if (over) return "missed";
      if (start.getTime() - now.getTime() < 60 * 60_000) return "starting_soon";
      return "confirmed";
  }
}

export const canCheckIn = (b: Booking, now: Date) => {
  if (b.status !== "confirmed") return false;
  const start = sessionStart(b.date, b.time).getTime();
  const end = sessionEnd(b.date, { classSlug: b.classSlug, time: b.time }).getTime();
  return now.getTime() >= start - 30 * 60_000 && now.getTime() <= end;
};

export const canCancel = (b: Booking, now: Date) => {
  if (b.status !== "confirmed" && b.status !== "waitlisted") return false;
  const start = sessionStart(b.date, b.time).getTime();
  return start - now.getTime() >= (b.status === "waitlisted" ? 0 : CANCEL_CUTOFF_HOURS * 3_600_000);
};

// ---------------------------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------------------------
const uid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

export type BookResult =
  | { ok: true; booking: Booking }
  | { ok: false; reason: BlockReason };

export function bookSession(sessionId: string, dateISO: string, now = new Date()): BookResult {
  const s = getSnapshot();
  const check = checkBooking(s, sessionId, dateISO, now);
  if (!check.ok) return check;
  const session = sessionById(sessionId)!;
  const at = now.toISOString();

  let waitlistPosition: number | undefined;
  if (check.waitlist) {
    const ahead = s.bookings.filter(
      (b) => b.sessionId === sessionId && b.date === dateISO && b.status === "waitlisted",
    ).length;
    // Stand-ins for other members already on the list.
    waitlistPosition = ahead + 1 + (baseSpotsTaken(sessionId, dateISO) % 3);
  }

  const booking: Booking = {
    id: uid("BK"),
    sessionId,
    classSlug: session.classSlug,
    date: dateISO,
    time: session.time,
    status: check.waitlist ? "waitlisted" : "confirmed",
    createdAt: at,
    waitlistPosition,
    history: [
      {
        label: check.waitlist ? `Joined waitlist (#${waitlistPosition})` : "Booking confirmed",
        at,
      },
    ],
  };
  commit({ ...s, bookings: [booking, ...s.bookings] });
  return { ok: true, booking };
}

export type CancelResult = { ok: true } | { ok: false; reason: "too_late" | "not_found" };

export function cancelBooking(id: string, now = new Date()): CancelResult {
  const s = getSnapshot();
  const b = s.bookings.find((x) => x.id === id);
  if (!b) return { ok: false, reason: "not_found" };
  if (!canCancel(b, now)) return { ok: false, reason: "too_late" };
  const at = now.toISOString();
  commit({
    ...s,
    bookings: s.bookings.map((x) =>
      x.id === id
        ? { ...x, status: "cancelled", history: [...x.history, { label: "Cancelled by you", at }] }
        : x,
    ),
  });
  return { ok: true };
}

export function checkIn(id: string, now = new Date()): boolean {
  const s = getSnapshot();
  const b = s.bookings.find((x) => x.id === id);
  if (!b || !canCheckIn(b, now)) return false;
  const at = now.toISOString();
  commit({
    ...s,
    bookings: s.bookings.map((x) =>
      x.id === id
        ? { ...x, status: "checked_in", history: [...x.history, { label: "Checked in at the front desk", at }] }
        : x,
    ),
  });
  return true;
}

/** Simulates the gym promoting a waitlisted booking once a spot opens. */
export function promoteWaitlist(id: string, now = new Date()): boolean {
  const s = getSnapshot();
  const b = s.bookings.find((x) => x.id === id);
  if (!b || b.status !== "waitlisted") return false;
  const at = now.toISOString();
  commit({
    ...s,
    bookings: s.bookings.map((x) =>
      x.id === id
        ? {
            ...x,
            status: "confirmed",
            waitlistPosition: undefined,
            history: [...x.history, { label: "A spot opened. You are in!", at }],
          }
        : x,
    ),
  });
  return true;
}

export function startTrial(input: { name: string; email: string }, now = new Date()): Trial {
  const s = getSnapshot();
  const trial: Trial = {
    name: input.name,
    email: input.email,
    startedAt: now.toISOString(),
    expiresAt: addDays(now, TRIAL_DAYS).toISOString(),
  };
  commit({ ...s, trial });
  return trial;
}

export interface CheckoutInput {
  planId: PlanId;
  cycle: Cycle;
  name: string;
  email: string;
  cardNumber: string;
  promo?: string;
  subtotal: number;
  discount: number;
  total: number;
}

export function completeCheckout(input: CheckoutInput, now = new Date()): Order {
  const s = getSnapshot();
  const order: Order = {
    id: uid("ORD"),
    planId: input.planId,
    cycle: input.cycle,
    subtotal: input.subtotal,
    discount: input.discount,
    total: input.total,
    promo: input.promo,
    createdAt: now.toISOString(),
    name: input.name,
    email: input.email,
    last4: input.cardNumber.replace(/\D/g, "").slice(-4),
  };
  const renewsAt = input.cycle === "annual" ? addDays(now, 365) : addDays(now, 30);
  commit({
    ...s,
    orders: [order, ...s.orders],
    membership: {
      planId: input.planId,
      cycle: input.cycle,
      startedAt: now.toISOString(),
      renewsAt: renewsAt.toISOString(),
      orderId: order.id,
      status: "active",
    },
  });
  return order;
}

export function cancelMembership() {
  const s = getSnapshot();
  if (!s.membership) return;
  commit({ ...s, membership: { ...s.membership, status: "cancelled" } });
}

/** Keeps the free-trial offer timer running: a 48-hour window that refreshes once it lapses. */
export function ensureOffer(now = new Date()) {
  const s = getSnapshot();
  if (s.offerEndsAt && new Date(s.offerEndsAt).getTime() > now.getTime()) return;
  commit({ ...s, offerEndsAt: new Date(now.getTime() + 48 * 3_600_000).toISOString() });
}

export function resetDemoData() {
  commit({ ...EMPTY_STATE });
}

// ---------------------------------------------------------------------------------------------
// Selectors
// ---------------------------------------------------------------------------------------------
export function upcomingBookings(s: GymState, now: Date) {
  return s.bookings
    .filter((b) => {
      const d = displayStatus(b, now);
      return d === "confirmed" || d === "starting_soon" || d === "waitlisted" || d === "checked_in";
    })
    .sort((a, b) => sessionStart(a.date, a.time).getTime() - sessionStart(b.date, b.time).getTime());
}

export function pastBookings(s: GymState, now: Date) {
  const upcoming = new Set(upcomingBookings(s, now).map((b) => b.id));
  return s.bookings
    .filter((b) => !upcoming.has(b.id))
    .sort((a, b) => sessionStart(b.date, b.time).getTime() - sessionStart(a.date, a.time).getTime());
}

export { startOfDay, toISODate };
