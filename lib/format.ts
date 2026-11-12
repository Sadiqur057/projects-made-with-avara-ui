const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
export const money = (n: number) => usd.format(n);

const dateFmt = new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short", year: "numeric" });
const dateLong = new Intl.DateTimeFormat("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

/** Format an ISO yyyy-mm-dd string as a local calendar date (no timezone shift). */
export function fmtDate(iso: string, long = false) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return (long ? dateLong : dateFmt).format(date);
}

export function fmtTimestamp(ms: number) {
  return new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(ms);
}

export function toIso(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

/** Upcoming departure dates (every Saturday, starting at least `minLeadDays` away). */
export function upcomingDepartures(from: number, count = 8, minLeadDays = 14) {
  const out: string[] = [];
  const cursor = addDays(new Date(from), minLeadDays);
  while (cursor.getDay() !== 6) cursor.setDate(cursor.getDate() + 1);
  for (let i = 0; i < count; i++) {
    out.push(toIso(cursor));
    cursor.setDate(cursor.getDate() + 7);
  }
  return out;
}

export const pluralize = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
