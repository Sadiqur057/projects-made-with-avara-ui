"use client";

import { useSyncExternalStore } from "react";

/**
 * Mock auth session, kept in localStorage. There is no backend: any email that
 * passes the form's own validation signs in.
 */
export type Session = { name: string; email: string };

const KEY = "notewise.session";
const EVENT = "notewise:session";

function read(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

/** `undefined` while still on the server, `null` when signed out. */
export function useSession(): Session | null | undefined {
  const raw = useSyncExternalStore(subscribe, read, () => undefined);
  if (raw === undefined) return undefined;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export function signIn(session: Session) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(session));
  } catch {
    /* storage blocked: the session just won't survive a reload */
  }
  window.dispatchEvent(new Event(EVENT));
}

export function signOut() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(EVENT));
}

export function nameFromEmail(email: string) {
  const local = email.split("@")[0] ?? "there";
  const words = local.split(/[._-]+/).filter(Boolean);
  return (
    words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") ||
    "there"
  );
}
