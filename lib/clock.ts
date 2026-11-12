import { useSyncExternalStore } from "react";

/**
 * One shared 1-second clock. Components read it with `useClock()`, which is
 * null on the server and during hydration so time-based UI never mismatches.
 */
let now = 0;
let timer: ReturnType<typeof setInterval> | undefined;
const subscribers = new Set<() => void>();

function subscribe(callback: () => void) {
  subscribers.add(callback);
  if (!timer) {
    now = Date.now();
    timer = setInterval(() => {
      now = Date.now();
      subscribers.forEach((fn) => fn());
    }, 1000);
  }
  return () => {
    subscribers.delete(callback);
    if (subscribers.size === 0 && timer) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

function getSnapshot() {
  if (now === 0) now = Date.now();
  return now;
}

export function useClock(): number | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}

/** Milliseconds until the next local midnight. */
export function msUntilMidnight(from: number): number {
  const end = new Date(from);
  end.setHours(24, 0, 0, 0);
  return end.getTime() - from;
}

export function splitDuration(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    hours: Math.floor(total / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}
