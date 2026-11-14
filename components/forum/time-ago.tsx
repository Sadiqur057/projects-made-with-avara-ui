"use client";

import { shortDate, timeAgo } from "@/lib/forum/format";
import { useHydrated } from "@/lib/forum/store";

/**
 * Relative time ("3 hours ago") depends on the clock, so it is only shown after
 * hydration. Until then a fixed UTC date renders, which keeps server and client markup identical.
 */
export function TimeAgo({ iso, className }: { iso: string; className?: string }) {
  const hydrated = useHydrated();
  return (
    <time dateTime={iso} title={new Date(iso).toUTCString()} className={className}>
      {hydrated ? timeAgo(iso) : shortDate(iso)}
    </time>
  );
}
