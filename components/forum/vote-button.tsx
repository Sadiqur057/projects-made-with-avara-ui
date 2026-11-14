"use client";

import { ArrowBigUp } from "lucide-react";
import { toggleVote, useForum } from "@/lib/forum/store";
import { formatCount } from "@/lib/forum/selectors";
import { cn } from "@/lib/utils";

interface VoteButtonProps {
  kind: "t" | "r";
  id: string;
  votes: number;
  /** "stacked" is the vertical rail used on thread cards; "pill" is inline. */
  layout?: "stacked" | "pill";
  label: string;
  className?: string;
}

export function VoteButton({ kind, id, votes, layout = "stacked", label, className }: VoteButtonProps) {
  const { state } = useForum();
  const active = Boolean(state.voted[`${kind}:${id}`]);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleVote(kind, id);
      }}
      aria-pressed={active}
      aria-label={`${active ? "Remove upvote from" : "Upvote"} ${label}`}
      data-testid={`vote-${kind}-${id}`}
      className={cn(
        "group inline-flex items-center justify-center font-semibold tabular-nums transition-all outline-none",
        "focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-95",
        layout === "stacked"
          ? "w-12 shrink-0 flex-col gap-0.5 self-start rounded-xl border py-1.5 text-sm"
          : "h-8 gap-1 rounded-full border px-2.5 text-xs",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-primary",
        className,
      )}
    >
      <ArrowBigUp
        className={cn(
          "transition-transform group-hover:-translate-y-0.5",
          layout === "stacked" ? "size-5" : "size-4",
          active && "fill-current",
        )}
        aria-hidden="true"
      />
      <span data-testid={`votes-${kind}-${id}`}>{formatCount(votes)}</span>
    </button>
  );
}
