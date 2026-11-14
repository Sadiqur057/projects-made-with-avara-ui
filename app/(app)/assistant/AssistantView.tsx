"use client";

import { useSession } from "@/lib/session";
import AIChat from "@/components/custom/blocks/Ai-chat";
import {
  ASSISTANT_HISTORY,
  ASSISTANT_INITIAL_MESSAGES,
  getMockReply,
} from "@/lib/assistant-mock";

const MODELS = [
  { id: "fast", name: "Notewise Fast", description: "Quick answers from your notes" },
  { id: "deep", name: "Notewise Deep", description: "Thorough, cross-meeting analysis", pro: true },
];

export function AssistantView() {
  const session = useSession();
  return (
    <div className="flex h-[calc(100dvh-57px)] min-h-0 flex-col">
      <AIChat
        variant="default"
        color="primary"
        chatHistory={ASSISTANT_HISTORY}
        initialMessages={ASSISTANT_INITIAL_MESSAGES}
        models={MODELS}
        getReply={getMockReply}
        storageKey="notewise.assistant"
        userName={session?.name}
        className="h-full"
      />
    </div>
  );
}
