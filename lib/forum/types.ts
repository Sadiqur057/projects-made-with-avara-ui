export type CategoryId =
  | "general"
  | "design"
  | "dev"
  | "career"
  | "showcase"
  | "help";

export interface Category {
  id: CategoryId;
  name: string;
  emoji: string;
  description: string;
  /** Threads that exist "off-screen" so the numbers feel like a real community. */
  baseThreads: number;
}

export interface User {
  username: string;
  name: string;
  headline: string;
  bio: string;
  location: string;
  /** ISO date the member joined. */
  joined: string;
  /** Reputation earned before this demo's data. */
  baseReputation: number;
  badges: string[];
}

export interface Thread {
  id: string;
  title: string;
  body: string;
  category: CategoryId;
  author: string;
  /** ISO timestamp. */
  createdAt: string;
  votes: number;
  views: number;
  tags: string[];
  pinned?: boolean;
}

export interface Reply {
  id: string;
  threadId: string;
  author: string;
  body: string;
  createdAt: string;
  votes: number;
  /** Username this reply responds to, if it was written as a direct reply. */
  replyTo?: string;
}

export interface ForumState {
  version: 1;
  users: User[];
  threads: Thread[];
  replies: Reply[];
  /** What the current visitor has upvoted: "t:<threadId>" or "r:<replyId>". */
  voted: Record<string, true>;
}

export type SortKey = "hot" | "new" | "top";

export const CURRENT_USER = "demo_user";
