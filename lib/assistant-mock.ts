import type {
  ChatThread,
  Message,
  SendPayload,
} from "@/components/custom/blocks/Ai-chat";

// Mock answers for the Notewise assistant. There is no model behind this:
// the reply is picked by keyword, then a fixed fallback.

type Rule = { match: RegExp; reply: string };

const RULES: Rule[] = [
  {
    match: /\b(hi|hello|hey|help)\b/i,
    reply:
      "Hi! I can summarise any meeting, pull out action items and decisions, or search across your whole archive. Try asking, \"What did we decide in the Q4 roadmap sync?\"",
  },
  {
    match: /action|todo|to-do|follow.?up|task/i,
    reply:
      "Here are the open action items from this week's meetings:\n\n1. Raj Patel: hand off the final designs (due Fri)\n2. Mei Tanaka: update the launch brief (due Fri)\n3. Marcus Chen: send pricing revisions to legal (due Mon)\n\nWant me to post these to #product on Slack?",
  },
  {
    match: /decid|decision|agreed|approve/i,
    reply:
      "Decisions from the Q4 roadmap sync:\n\n• Launch date is locked for the 14th.\n• Yearly billing becomes the default on the pricing page.\n• The mobile app moves to the next quarter.\n\nI can link each one to the moment it was discussed.",
  },
  {
    match: /summar|recap|tl;?dr|overview/i,
    reply:
      "Summary of your last meeting, Q4 roadmap sync (42 min):\n\nThe team confirmed the 14th as the launch date. Design will hand off by Friday, and legal still needs to review the new pricing copy. Two risks were raised: a tight QA window and the mobile app scope. Next sync is Thursday at 10:00.",
  },
  {
    match: /deadline|due|when|date|schedule|calendar/i,
    reply:
      "Upcoming dates I found in your meetings:\n\n• Fri: design handoff and launch brief update\n• Mon: pricing revisions to legal\n• The 14th: launch\n• Thu 10:00: next roadmap sync\n\nI can add any of these to your calendar.",
  },
  {
    match: /who|owner|assigned|responsib/i,
    reply:
      "Ownership from the latest meetings: Raj owns the design handoff, Mei owns the launch brief, Marcus owns the pricing revisions, and Ayesha owns the launch checklist overall.",
  },
  {
    match: /price|pricing|plan|cost|seat|billing/i,
    reply:
      "On pricing: Notewise has Starter, Team and Business plans, billed per seat. Yearly billing saves about 20%, and you can change your seat count at any time with the difference prorated. You can size a plan in the Pricing section on the home page.",
  },
  {
    match: /search|find|where|mention|talk(ed)? about/i,
    reply:
      "I found 4 meetings that mention that topic in the last 30 days. The most relevant is the Q4 roadmap sync at 18:42, where the team agreed to review it again after launch. Want the full transcript excerpt?",
  },
  {
    match: /thank|thanks|great|awesome/i,
    reply: "Happy to help! Ask me anything else about your meetings whenever you like.",
  },
];

const FALLBACKS = [
  "I looked through your recent meetings. Nothing matches that exactly, but I can summarise a meeting, list action items, or find decisions. Which would you like?",
  "That's a good question. I'd start with the most recent meeting that touched on it. Want a summary, the action items, or the transcript excerpt?",
  "I can help with that. Tell me which meeting you mean, or ask me to search across all of them.",
];

let fallbackIndex = 0;

export function getMockReply({ content }: SendPayload): string {
  const text = content.trim();
  if (!text) return "I received your file. What would you like to know about it?";
  for (const rule of RULES) {
    if (rule.match.test(text)) return rule.reply;
  }
  const reply = FALLBACKS[fallbackIndex % FALLBACKS.length];
  fallbackIndex += 1;
  return reply;
}

export const ASSISTANT_HISTORY: ChatThread[] = [
  { id: "t1", title: "Q4 roadmap sync", date: "Today" },
  { id: "t2", title: "Customer discovery #14", date: "Yesterday" },
  { id: "t3", title: "Weekly standup recap", date: "Previous 7 Days" },
];

export const ASSISTANT_INITIAL_MESSAGES: Message[] = [
  {
    id: "m1",
    role: "ai",
    content:
      "Hi! I've read your Q4 roadmap sync. Ask me for a summary, the action items, or the decisions that were made.",
    time: "09:30",
  },
];
