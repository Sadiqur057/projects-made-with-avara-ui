"use client";

import { useMemo, useState } from "react";
import { Search, SearchX } from "lucide-react";
import { CATEGORIES, CLASSES, type CategoryId, type Level } from "@/lib/gym-data";
import { ClassCard } from "@/components/site/class-card";
import { Button, Container } from "@/components/site/ui";
import { cn } from "@/lib/utils";

const LEVELS: ("Any level" | Level)[] = ["Any level", "Beginner", "All levels", "Intermediate", "Advanced"];

function Chip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "h-10 shrink-0 rounded-full border px-4 text-sm font-semibold transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

export function ClassesBrowser() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryId | "all">("all");
  const [level, setLevel] = useState<(typeof LEVELS)[number]>("Any level");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CLASSES.filter(
      (c) =>
        (category === "all" || c.category === category) &&
        (level === "Any level" || c.level === level) &&
        (!q || `${c.name} ${c.summary} ${c.category}`.toLowerCase().includes(q)),
    );
  }, [query, category, level]);

  const reset = () => {
    setQuery("");
    setCategory("all");
    setLevel("Any level");
  };

  return (
    <Container className="py-12">
      <div className="space-y-5">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <label htmlFor="class-search" className="sr-only">
            Search classes
          </label>
          <input
            id="class-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search classes, e.g. boxing"
            className="h-12 w-full rounded-full border border-input bg-card pl-11 pr-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]" role="group" aria-label="Filter by category">
          <Chip selected={category === "all"} onClick={() => setCategory("all")}>
            All
          </Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c.id} selected={category === c.id} onClick={() => setCategory(c.id)}>
              {c.label}
            </Chip>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]" role="group" aria-label="Filter by level">
          {LEVELS.map((l) => (
            <Chip key={l} selected={level === l} onClick={() => setLevel(l)}>
              {l}
            </Chip>
          ))}
        </div>
      </div>

      <p className="mt-8 text-sm text-muted-foreground" aria-live="polite">
        {results.length} {results.length === 1 ? "class" : "classes"}
      </p>

      {results.length > 0 ? (
        <ul className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((item) => (
            <li key={item.slug}>
              <ClassCard item={item} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 flex flex-col items-center gap-4 rounded-3xl border border-dashed border-border p-12 text-center">
          <SearchX className="size-10 text-muted-foreground" aria-hidden />
          <p className="text-lg font-semibold">No classes match those filters</p>
          <p className="text-sm text-muted-foreground">Try a different level or clear the search.</p>
          <Button variant="outline" onClick={reset}>
            Reset filters
          </Button>
        </div>
      )}
    </Container>
  );
}
