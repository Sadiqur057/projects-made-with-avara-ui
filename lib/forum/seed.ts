import type { Category, ForumState, Reply, Thread, User } from "./types";

export const CATEGORIES: Category[] = [
  {
    id: "general",
    name: "General",
    emoji: "💬",
    description: "Open conversation about anything the community cares about.",
    baseThreads: 2410,
  },
  {
    id: "design",
    name: "Design",
    emoji: "🎨",
    description: "UI, UX, systems, typography and visual craft.",
    baseThreads: 1860,
  },
  {
    id: "dev",
    name: "Development",
    emoji: "💻",
    description: "Frameworks, tooling, architecture and code reviews.",
    baseThreads: 3275,
  },
  {
    id: "career",
    name: "Career & Growth",
    emoji: "🚀",
    description: "Hiring, freelancing, leadership and levelling up.",
    baseThreads: 940,
  },
  {
    id: "showcase",
    name: "Showcase",
    emoji: "✨",
    description: "Share what you built and get honest, kind feedback.",
    baseThreads: 1120,
  },
  {
    id: "help",
    name: "Help & Support",
    emoji: "🛟",
    description: "Stuck? Ask a question and the community will dig in.",
    baseThreads: 2085,
  },
];

export const USERS: User[] = [
  {
    username: "maya_chen",
    name: "Maya Chen",
    headline: "Principal product designer",
    bio: "Design systems nerd. I write about tokens, motion and the boring parts that make interfaces feel inevitable.",
    location: "Lisbon, Portugal",
    joined: "2023-02-11",
    baseReputation: 4120,
    badges: ["Top contributor", "Design guild"],
  },
  {
    username: "dev_arjun",
    name: "Arjun Patel",
    headline: "Staff engineer",
    bio: "Distributed systems by day, accessibility advocate by night. Happy to review your pull request.",
    location: "Bengaluru, India",
    joined: "2022-09-03",
    baseReputation: 5260,
    badges: ["Top contributor", "Code reviewer"],
  },
  {
    username: "sofia_r",
    name: "Sofia Ramirez",
    headline: "Frontend lead",
    bio: "React, CSS and a lot of opinions about forms. Building a component library nobody asked for.",
    location: "Mexico City, Mexico",
    joined: "2023-05-20",
    baseReputation: 3380,
    badges: ["Helpful", "Frontend guild"],
  },
  {
    username: "tom_baker",
    name: "Tom Baker",
    headline: "Indie hacker",
    bio: "Shipping small products on weekends. Currently on side project number seven.",
    location: "Manchester, UK",
    joined: "2023-08-14",
    baseReputation: 1890,
    badges: ["Maker"],
  },
  {
    username: "lena_k",
    name: "Lena Kowalski",
    headline: "UX researcher",
    bio: "I ask people why, and then I ask again. Usability testing, interviews and synthesis.",
    location: "Warsaw, Poland",
    joined: "2024-01-09",
    baseReputation: 2470,
    badges: ["Research guild"],
  },
  {
    username: "noah_w",
    name: "Noah Williams",
    headline: "Junior developer",
    bio: "Learning in public. Eight months into my first dev job and loving it.",
    location: "Toronto, Canada",
    joined: "2024-04-22",
    baseReputation: 640,
    badges: ["Rising star"],
  },
  {
    username: "priya_s",
    name: "Priya Sharma",
    headline: "Engineering manager",
    bio: "Helping teams ship calmly. Career ladders, feedback and one-on-ones that are worth having.",
    location: "Singapore",
    joined: "2022-12-01",
    baseReputation: 2960,
    badges: ["Mentor", "Helpful"],
  },
  {
    username: "omar_h",
    name: "Omar Hassan",
    headline: "Community moderator",
    bio: "Keeping the lights on and the threads kind. Message me if something looks off.",
    location: "Cairo, Egypt",
    joined: "2022-06-18",
    baseReputation: 3050,
    badges: ["Moderator", "Founding member"],
  },
  {
    username: "demo_user",
    name: "Demo User",
    headline: "Curious newcomer",
    bio: "This is you. Everything you post, reply to and upvote in this demo is saved to your browser's localStorage.",
    location: "Somewhere online",
    joined: "2026-11-01",
    baseReputation: 25,
    badges: ["New member"],
  },
];

const MIN = 60_000;

interface ThreadSeed {
  id: string;
  category: Thread["category"];
  author: string;
  minsAgo: number;
  votes: number;
  views: number;
  title: string;
  body: string;
  tags: string[];
  pinned?: boolean;
}

const THREADS: ThreadSeed[] = [
  {
    id: "welcome-read-first",
    category: "general",
    author: "omar_h",
    minsAgo: 60 * 24 * 21,
    votes: 214,
    views: 9840,
    pinned: true,
    title: "Welcome to the community: read this first",
    body: "Hi everyone, and welcome!\n\nThis is a place for people who build, design and ship digital products. A few ground rules: be kind, assume good intent, search before you ask, and credit the people who help you.\n\nIntroduce yourself below and tell us what you're working on right now.",
    tags: ["rules", "welcome"],
  },
  {
    id: "design-tokens-at-scale",
    category: "design",
    author: "maya_chen",
    minsAgo: 60 * 5 + 12,
    votes: 342,
    views: 5120,
    title: "How are you structuring design tokens for a multi-brand system?",
    body: "We're moving from a single theme to four brands that share one component library. Right now every token is a flat list of 600+ values and it's collapsing under its own weight.\n\nI'm leaning toward three layers: primitives, semantic aliases and component-level overrides. Has anyone done this at scale? What broke for you, and how do you keep designers and engineers speaking the same language?",
    tags: ["design-systems", "tokens", "theming"],
  },
  {
    id: "server-components-mental-model",
    category: "dev",
    author: "dev_arjun",
    minsAgo: 60 * 9,
    votes: 298,
    views: 7410,
    title: "A mental model for server vs client components that finally clicked for me",
    body: "I kept asking \"which one should this be?\" until I flipped the question: start on the server and only pull a component to the client when it needs state, effects or browser APIs.\n\nThe boundary then becomes a deliberate seam, not an accident. Pushing `use client` down to the smallest interactive leaf cut our bundle by 38%.\n\nHow do you decide where to draw the line?",
    tags: ["react", "nextjs", "performance"],
  },
  {
    id: "first-dev-job-lessons",
    category: "career",
    author: "noah_w",
    minsAgo: 60 * 22,
    votes: 187,
    views: 3380,
    title: "Eight months into my first dev job: what I wish I'd known",
    body: "Nobody told me that most of the job is reading code, not writing it. Also: asking a question after 20 minutes of honest effort is a strength, not a weakness.\n\nSharing my notes below. Seniors, what would you add for people just starting out?",
    tags: ["career", "juniors", "advice"],
  },
  {
    id: "built-habit-tracker",
    category: "showcase",
    author: "tom_baker",
    minsAgo: 60 * 30,
    votes: 156,
    views: 2210,
    title: "I built a habit tracker in a weekend and 400 people signed up",
    body: "It started as a way to stop doomscrolling. It's a tiny PWA with streaks, a calm interface and zero accounts: everything lives on-device.\n\nWould love feedback on the onboarding. I suspect I'm losing people on step two.",
    tags: ["side-project", "pwa", "feedback"],
  },
  {
    id: "accessible-forms-checklist",
    category: "dev",
    author: "sofia_r",
    minsAgo: 60 * 36,
    votes: 241,
    views: 4630,
    title: "The accessible forms checklist I give every new teammate",
    body: "1. Every input has a visible label, not just a placeholder.\n2. Errors are announced and tied to the field with aria-describedby.\n3. Focus moves to the first invalid field on submit.\n4. Never rely on colour alone.\n5. Test with the keyboard before you test with the mouse.\n\nWhat would you add to the list?",
    tags: ["accessibility", "forms", "a11y"],
  },
  {
    id: "user-interviews-small-teams",
    category: "design",
    author: "lena_k",
    minsAgo: 60 * 48,
    votes: 133,
    views: 1980,
    title: "Running user interviews when you have no research budget",
    body: "You don't need a lab. Five conversations with the right people will teach you more than a 500-response survey.\n\nMy cheap setup: a screener in a form, a shared doc for notes, and a rule that nobody on the team is allowed to pitch during a session. What's your scrappiest research trick?",
    tags: ["research", "ux", "interviews"],
  },
  {
    id: "hydration-mismatch-localstorage",
    category: "help",
    author: "noah_w",
    minsAgo: 60 * 52,
    votes: 74,
    views: 2890,
    title: "Hydration mismatch when I read from localStorage: how do I fix it?",
    body: "I read a saved value from localStorage in my component and React logs a hydration warning, because the server rendered something different from the client.\n\nI tried wrapping it in a useEffect but now I get a flash of the wrong content. What's the clean way to do this?",
    tags: ["react", "hydration", "localstorage"],
  },
  {
    id: "negotiating-freelance-rates",
    category: "career",
    author: "priya_s",
    minsAgo: 60 * 60,
    votes: 168,
    views: 2740,
    title: "How do you raise your freelance rate without losing clients?",
    body: "I've been charging the same hourly rate for three years and my work has improved dramatically. I'm nervous about the conversation.\n\nHere's the framework I coach people through: give notice, anchor on outcomes not hours, and offer an easy path for clients who can't stretch. Curious what's worked for you.",
    tags: ["freelance", "pricing", "career"],
  },
  {
    id: "motion-reduced-preferences",
    category: "design",
    author: "maya_chen",
    minsAgo: 60 * 70,
    votes: 119,
    views: 1730,
    title: "Respecting prefers-reduced-motion without making the product feel dead",
    body: "Reduced motion doesn't mean no motion. Swap large travelling movements for gentle fades, keep state changes visible, and never remove the feedback that tells people something happened.\n\nShare your favourite before/after examples.",
    tags: ["motion", "accessibility", "design-systems"],
  },
  {
    id: "monorepo-or-not",
    category: "dev",
    author: "dev_arjun",
    minsAgo: 60 * 84,
    votes: 205,
    views: 4120,
    title: "Monorepo or multiple repos for a team of twelve?",
    body: "We have a web app, a mobile app, a design system and three internal services. CI is already slow and ownership is blurry.\n\nWe're considering a monorepo with remote caching. Anyone been through this migration, and what do you wish you'd known?",
    tags: ["architecture", "monorepo", "tooling"],
  },
  {
    id: "coffee-shop-coding-playlist",
    category: "general",
    author: "tom_baker",
    minsAgo: 60 * 96,
    votes: 88,
    views: 1260,
    title: "What are you listening to while you work?",
    body: "Lo-fi is wearing thin for me. Looking for focus music that isn't a genre I've overplayed. Instrumental, ideally.\n\nDrop your playlists and albums below.",
    tags: ["offtopic", "focus"],
  },
  {
    id: "portfolio-review-thread",
    category: "showcase",
    author: "sofia_r",
    minsAgo: 60 * 110,
    votes: 97,
    views: 1540,
    title: "Monthly portfolio review: post yours and get notes",
    body: "Rules: give feedback before you ask for it, be specific, and lead with what's working.\n\nI'll start by reviewing the first five links posted here. Include a line about the role you're aiming for.",
    tags: ["portfolio", "feedback", "monthly"],
  },
  {
    id: "css-container-queries",
    category: "help",
    author: "sofia_r",
    minsAgo: 60 * 130,
    votes: 65,
    views: 1190,
    title: "Container queries vs media queries: when should I use which?",
    body: "I understand the syntax, but I can't decide when container queries are worth the extra thought. Is there a rule of thumb for reusable components versus page layout?",
    tags: ["css", "responsive"],
  },
  {
    id: "burnout-and-boundaries",
    category: "general",
    author: "priya_s",
    minsAgo: 60 * 150,
    votes: 176,
    views: 3010,
    title: "Burnout, boundaries and the work we love",
    body: "Three teammates have told me this quarter that they're running on empty. We say we care about sustainable pace, but our calendars say otherwise.\n\nWhat concrete boundaries have helped you? I'd especially love practices that work for remote teams.",
    tags: ["wellbeing", "remote", "management"],
  },
];

interface ReplySeed {
  thread: string;
  author: string;
  minsAgo: number;
  votes: number;
  body: string;
  replyTo?: string;
}

const REPLIES: ReplySeed[] = [
  // Design tokens
  {
    thread: "design-tokens-at-scale",
    author: "sofia_r",
    minsAgo: 60 * 4 + 40,
    votes: 76,
    body: "Three layers worked for us too. The key was naming semantic tokens by intent (surface-raised, text-muted) and never by value. Brand teams then only touch primitives, and components never reference them directly.",
  },
  {
    thread: "design-tokens-at-scale",
    author: "dev_arjun",
    minsAgo: 60 * 4 + 5,
    votes: 52,
    replyTo: "sofia_r",
    body: "Agreed. We also generate CSS variables from a single JSON source so designers and engineers can't drift. A tiny build step beats a long wiki page.",
  },
  {
    thread: "design-tokens-at-scale",
    author: "lena_k",
    minsAgo: 60 * 3,
    votes: 31,
    body: "One thing nobody mentions: run a quick usability pass on the token *names*. If your own team can't guess what `surface-2` means, nobody can.",
  },
  {
    thread: "design-tokens-at-scale",
    author: "maya_chen",
    minsAgo: 60 * 2 + 20,
    votes: 24,
    replyTo: "lena_k",
    body: "Great point, Lena. We're renaming a few of ours this week. Thanks everyone: I'll write up what we end up shipping.",
  },
  // Server components
  {
    thread: "server-components-mental-model",
    author: "sofia_r",
    minsAgo: 60 * 8 + 15,
    votes: 64,
    body: "Pushing the client boundary down to the leaf is the whole trick. A search box can be a client component while the page around it stays on the server.",
  },
  {
    thread: "server-components-mental-model",
    author: "noah_w",
    minsAgo: 60 * 7,
    votes: 18,
    body: "This helps a lot, thank you. Is there a quick way to see how much JavaScript a route actually ships?",
  },
  {
    thread: "server-components-mental-model",
    author: "dev_arjun",
    minsAgo: 60 * 6 + 30,
    votes: 40,
    replyTo: "noah_w",
    body: "Run a production build and read the route table it prints, then open the bundle analyzer for the details. It's the fastest feedback loop I know.",
  },
  // First dev job
  {
    thread: "first-dev-job-lessons",
    author: "priya_s",
    minsAgo: 60 * 20,
    votes: 58,
    body: "Add: write down what you learned every Friday. It's the easiest evidence for your first performance review, and it makes the progress visible on slow weeks.",
  },
  {
    thread: "first-dev-job-lessons",
    author: "dev_arjun",
    minsAgo: 60 * 18,
    votes: 44,
    body: "And read the pull requests of the people you admire. You'll learn more about taste and trade-offs from review comments than from any tutorial.",
  },
  // Habit tracker
  {
    thread: "built-habit-tracker",
    author: "maya_chen",
    minsAgo: 60 * 28,
    votes: 35,
    body: "Congrats! Step two probably asks for too much up front. Try letting people complete one habit before asking them to name or schedule anything.",
  },
  {
    thread: "built-habit-tracker",
    author: "lena_k",
    minsAgo: 60 * 26,
    votes: 22,
    body: "If you can, sit with three new users and watch them go through it silently. You'll see the exact moment they hesitate.",
  },
  // Accessible forms
  {
    thread: "accessible-forms-checklist",
    author: "dev_arjun",
    minsAgo: 60 * 34,
    votes: 51,
    body: "Add: don't disable the submit button as validation. Let people press it and tell them clearly what's wrong.",
  },
  {
    thread: "accessible-forms-checklist",
    author: "omar_h",
    minsAgo: 60 * 33,
    votes: 27,
    body: "Pinning this to our resources page. Thanks, Sofia!",
  },
  // Hydration
  {
    thread: "hydration-mismatch-localstorage",
    author: "sofia_r",
    minsAgo: 60 * 50,
    votes: 48,
    body: "Subscribe to the store with useSyncExternalStore and give it a server snapshot. React renders the server value during hydration, then swaps in the real value without a warning.",
  },
  {
    thread: "hydration-mismatch-localstorage",
    author: "dev_arjun",
    minsAgo: 60 * 49,
    votes: 19,
    replyTo: "sofia_r",
    body: "+1. And render a skeleton until the client value is ready if the content differs a lot between server and client.",
  },
  // Monorepo
  {
    thread: "monorepo-or-not",
    author: "priya_s",
    minsAgo: 60 * 82,
    votes: 33,
    body: "We moved at about your size. Biggest win was atomic changes across the design system and apps. Biggest cost was investing in CI caching early.",
  },
  // Freelance
  {
    thread: "negotiating-freelance-rates",
    author: "tom_baker",
    minsAgo: 60 * 58,
    votes: 29,
    body: "Giving 60 days' notice and a short list of the outcomes I delivered made the conversation feel like good news instead of a demand.",
  },
  // Burnout
  {
    thread: "burnout-and-boundaries",
    author: "omar_h",
    minsAgo: 60 * 148,
    votes: 38,
    body: "No-meeting afternoons and a team agreement that messages sent after hours don't need an answer. Simple, but it changed how we work.",
  },
  // Welcome
  {
    thread: "welcome-read-first",
    author: "noah_w",
    minsAgo: 60 * 24 * 20,
    votes: 12,
    body: "Hi all! Noah here, a junior developer from Toronto. Excited to learn from everyone.",
  },
];

function iso(base: number, minsAgo: number) {
  return new Date(base - minsAgo * MIN).toISOString();
}

export function seedState(base: number): ForumState {
  const threads: Thread[] = THREADS.map((t) => ({
    id: t.id,
    title: t.title,
    body: t.body,
    category: t.category,
    author: t.author,
    createdAt: iso(base, t.minsAgo),
    votes: t.votes,
    views: t.views,
    tags: t.tags,
    pinned: t.pinned,
  }));
  const replies: Reply[] = REPLIES.map((r, i) => ({
    id: `r-seed-${i + 1}`,
    threadId: r.thread,
    author: r.author,
    body: r.body,
    createdAt: iso(base, r.minsAgo),
    votes: r.votes,
    replyTo: r.replyTo,
  }));
  return { version: 1, users: USERS, threads, replies, voted: {} };
}

/** Fixed timestamp so server and first client render agree. */
export const SERVER_BASE = Date.parse("2026-11-14T09:00:00Z");
