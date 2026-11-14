import { CATEGORIES } from "./seed";
import type { Category, ForumState, SortKey, Thread, User } from "./types";

export function getCategory(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function getUser(state: ForumState, username: string): User | undefined {
  return state.users.find((u) => u.username === username);
}

export function replyCount(state: ForumState, threadId: string): number {
  let n = 0;
  for (const r of state.replies) if (r.threadId === threadId) n++;
  return n;
}

/** Reddit-style "hot": votes decayed by age in hours. */
function hotScore(t: Thread, now: number): number {
  const hours = Math.max(0, (now - Date.parse(t.createdAt)) / 3_600_000);
  return t.votes / Math.pow(hours + 2, 1.35);
}

export function sortThreads(threads: Thread[], sort: SortKey): Thread[] {
  const list = [...threads];
  const now = Math.max(...list.map((t) => Date.parse(t.createdAt)), 0) + 3_600_000;
  switch (sort) {
    case "new":
      return list.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    case "top":
      return list.sort((a, b) => b.votes - a.votes);
    default:
      return list.sort((a, b) => hotScore(b, now) - hotScore(a, now));
  }
}

export function filterThreads(
  state: ForumState,
  opts: { category?: string; q?: string },
): Thread[] {
  const q = opts.q?.trim().toLowerCase();
  return state.threads.filter((t) => {
    if (opts.category && opts.category !== "all" && t.category !== opts.category) {
      return false;
    }
    if (!q) return true;
    const author = getUser(state, t.author);
    return (
      t.title.toLowerCase().includes(q) ||
      t.body.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
      author?.name.toLowerCase().includes(q) === true ||
      t.author.toLowerCase().includes(q)
    );
  });
}

export interface UserStats {
  threads: number;
  replies: number;
  upvotesReceived: number;
  reputation: number;
}

export function userStats(state: ForumState, username: string): UserStats {
  const user = getUser(state, username);
  let threads = 0;
  let replies = 0;
  let upvotes = 0;
  for (const t of state.threads) {
    if (t.author === username) {
      threads++;
      upvotes += t.votes;
    }
  }
  for (const r of state.replies) {
    if (r.author === username) {
      replies++;
      upvotes += r.votes;
    }
  }
  return {
    threads,
    replies,
    upvotesReceived: upvotes,
    reputation: (user?.baseReputation ?? 0) + upvotes * 3 + threads * 10 + replies * 4,
  };
}

export function topContributors(state: ForumState, limit = 5) {
  return state.users
    .map((user) => ({ user, stats: userStats(state, user.username) }))
    .sort((a, b) => b.stats.reputation - a.stats.reputation)
    .slice(0, limit);
}

export function categoryThreadCount(state: ForumState, id: string): number {
  const base = getCategory(id)?.baseThreads ?? 0;
  const local = state.threads.filter((t) => t.category === id).length;
  return base + local;
}

const BASE_MEMBERS = 24_816;
const BASE_REPLIES = 61_204;
const BASE_ONLINE = 1_284;

export function communityStats(state: ForumState) {
  const baseThreads = CATEGORIES.reduce((n, c) => n + c.baseThreads, 0);
  return {
    members: BASE_MEMBERS + state.users.length,
    discussions: baseThreads + state.threads.length,
    replies: BASE_REPLIES + state.replies.length,
    online: BASE_ONLINE,
  };
}

export function trendingThreads(state: ForumState, limit = 5): Thread[] {
  return sortThreads(
    state.threads.filter((t) => !t.pinned),
    "hot",
  ).slice(0, limit);
}

export function formatCount(n: number): string {
  if (n >= 10_000) return `${(n / 1000).toFixed(n >= 100_000 ? 0 : 1).replace(/\.0$/, "")}k`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
}
