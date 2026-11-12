"use client";

import { useSyncExternalStore } from "react";

// Pure helpers live in ./dates so server components can import them; re-exported here for client code.
export * from "@/lib/dates";

// ---------------------------------------------------------------------------------------------
// Clocks. The server snapshot is 0, so nothing time-dependent renders until the client mounts —
// that keeps prerendering deterministic.
// ---------------------------------------------------------------------------------------------
function createClock(intervalMs: number) {
  let value = 0;
  let timer: ReturnType<typeof setInterval> | null = null;
  const listeners = new Set<() => void>();
  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      if (!timer) {
        value = Date.now();
        timer = setInterval(() => {
          value = Date.now();
          listeners.forEach((l) => l());
        }, intervalMs);
      }
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0 && timer) {
          clearInterval(timer);
          timer = null;
        }
      };
    },
    getSnapshot() {
      if (value === 0) value = Date.now();
      return value;
    },
    getServerSnapshot() {
      return 0;
    },
  };
}

const secondClock = createClock(1000);
const minuteClock = createClock(30_000);

/** Epoch ms, ticking every second. 0 until the client has mounted. */
export const useNowSecond = () =>
  useSyncExternalStore(secondClock.subscribe, secondClock.getSnapshot, secondClock.getServerSnapshot);

/** Epoch ms, ticking every 30s. 0 until the client has mounted. */
export const useNow = () =>
  useSyncExternalStore(minuteClock.subscribe, minuteClock.getSnapshot, minuteClock.getServerSnapshot);

const noopSubscribe = () => () => {};
export const useHydrated = () =>
  useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
