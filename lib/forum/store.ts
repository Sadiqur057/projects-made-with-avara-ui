"use client";

import { useSyncExternalStore } from "react";
import { SERVER_BASE, seedState } from "./seed";
import { CURRENT_USER, type CategoryId, type ForumState, type Reply, type Thread } from "./types";

/**
 * A tiny external store backed by localStorage.
 *
 * - On the server (and during hydration) everyone sees the same seeded snapshot.
 * - On the client the saved state is loaded lazily, then kept in sync across tabs.
 */
const STORAGE_KEY = "forumly:v1";

const SERVER_STATE: ForumState = seedState(SERVER_BASE);

let state: ForumState = SERVER_STATE;
let loaded = false;
const listeners = new Set<() => void>();

function persist(next: ForumState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage can be full or blocked; the in-memory state still works.
  }
}

function readStorage(): ForumState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ForumState;
    return parsed?.version === 1 && Array.isArray(parsed.threads) ? parsed : null;
  } catch {
    return null;
  }
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  const saved = readStorage();
  if (saved) {
    state = saved;
  } else {
    state = seedState(Date.now());
    persist(state);
  }
}

function emit() {
  listeners.forEach((l) => l());
}

function commit(next: ForumState) {
  state = next;
  persist(next);
  emit();
}

function onStorage(e: StorageEvent) {
  if (e.key !== STORAGE_KEY) return;
  const saved = readStorage();
  if (saved) {
    state = saved;
    emit();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  load();
  return state;
}

function getServerSnapshot() {
  return SERVER_STATE;
}

const noopSubscribe = () => () => {};

/** Current forum data and whether the client has loaded it from localStorage. */
export function useForum() {
  const data = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ready = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  return { state: data, ready };
}

/** True once the component is running in the browser after hydration. */
export function useHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

// ---------- actions ----------

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function uid() {
  return Math.random().toString(36).slice(2, 7);
}

export function createThread(input: {
  title: string;
  body: string;
  category: CategoryId;
  tags: string[];
}): string {
  load();
  const id = `${slugify(input.title) || "thread"}-${uid()}`;
  const thread: Thread = {
    id,
    title: input.title.trim(),
    body: input.body.trim(),
    category: input.category,
    author: CURRENT_USER,
    createdAt: new Date().toISOString(),
    votes: 1,
    views: 1,
    tags: input.tags,
  };
  // Authors implicitly upvote their own post, like most forums.
  commit({
    ...state,
    threads: [thread, ...state.threads],
    voted: { ...state.voted, [`t:${id}`]: true },
  });
  return id;
}

export function addReply(input: { threadId: string; body: string; replyTo?: string }): string {
  load();
  const id = `r-${Date.now().toString(36)}-${uid()}`;
  const reply: Reply = {
    id,
    threadId: input.threadId,
    author: CURRENT_USER,
    body: input.body.trim(),
    createdAt: new Date().toISOString(),
    votes: 0,
    replyTo: input.replyTo,
  };
  commit({ ...state, replies: [...state.replies, reply] });
  return id;
}

export function toggleVote(kind: "t" | "r", id: string) {
  load();
  const key = `${kind}:${id}`;
  const has = Boolean(state.voted[key]);
  const delta = has ? -1 : 1;
  const voted = { ...state.voted };
  if (has) delete voted[key];
  else voted[key] = true;
  if (kind === "t") {
    commit({
      ...state,
      voted,
      threads: state.threads.map((t) => (t.id === id ? { ...t, votes: t.votes + delta } : t)),
    });
  } else {
    commit({
      ...state,
      voted,
      replies: state.replies.map((r) => (r.id === id ? { ...r, votes: r.votes + delta } : r)),
    });
  }
}

export function incrementViews(threadId: string) {
  load();
  commit({
    ...state,
    threads: state.threads.map((t) => (t.id === threadId ? { ...t, views: t.views + 1 } : t)),
  });
}

/** Wipe everything the visitor did and restore the seeded demo data. */
export function resetDemo() {
  loaded = true;
  commit(seedState(Date.now()));
}
