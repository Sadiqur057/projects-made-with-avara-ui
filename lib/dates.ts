import { classBySlug, sessionById, type Session } from "@/lib/gym-data";

// ---------------------------------------------------------------------------------------------
// Pure date helpers. All dates are LOCAL and travel as "YYYY-MM-DD" / "HH:MM" strings.
// ---------------------------------------------------------------------------------------------
const pad = (n: number) => String(n).padStart(2, "0");

export const toISODate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const parseISODate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const sessionStart = (dateISO: string, time: string) => {
  const [y, m, d] = dateISO.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  return new Date(y, m - 1, d, hh, mm, 0, 0);
};

export const sessionEnd = (dateISO: string, session: Pick<Session, "classSlug" | "time">) => {
  const start = sessionStart(dateISO, session.time);
  const minutes = classBySlug(session.classSlug)?.duration ?? 60;
  return new Date(start.getTime() + minutes * 60_000);
};

export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const addDays = (d: Date, n: number) => {
  const next = new Date(d);
  next.setDate(next.getDate() + n);
  return next;
};

export const daysBetween = (a: Date, b: Date) =>
  Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / 86_400_000);

export const formatTime12 = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${pad(m)} ${suffix}`;
};

const longDate = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" });
const shortDate = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" });
const dayMonth = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

export const formatDateLong = (iso: string) => longDate.format(parseISODate(iso));
export const formatDateShort = (iso: string) => shortDate.format(parseISODate(iso));
export const formatFullDate = (isoOrDate: string | Date) =>
  dayMonth.format(typeof isoOrDate === "string" ? new Date(isoOrDate) : isoOrDate);

export const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** The next occurrence (today included, if it has not started) of a weekly session. */
export const nextOccurrence = (session: Session, now: Date) => {
  for (let i = 0; i < 8; i++) {
    const day = addDays(startOfDay(now), i);
    if (day.getDay() !== session.day) continue;
    const iso = toISODate(day);
    if (sessionStart(iso, session.time).getTime() > now.getTime()) return iso;
  }
  return toISODate(addDays(startOfDay(now), 7));
};

// ---------------------------------------------------------------------------------------------
// Deterministic "how full is this class" — stands in for a real availability API.
// ---------------------------------------------------------------------------------------------
const hash = (str: string) => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

export const baseSpotsTaken = (sessionId: string, dateISO: string) => {
  const session = sessionById(sessionId);
  if (!session) return 0;
  const capacity = classBySlug(session.classSlug)?.capacity ?? 12;
  const h = hash(`${sessionId}@${dateISO}`);
  if (h % 6 === 0) return capacity; // some classes are simply full
  const fill = 0.35 + ((h >>> 3) % 60) / 100; // 35%–94%
  return Math.min(capacity - 1, Math.round(capacity * fill));
};

