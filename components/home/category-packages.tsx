"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { CATEGORIES, PACKAGES, type Category } from "@/lib/travel-data";
import { PackageCard } from "@/components/site/package-card";
import { cn } from "@/lib/utils";

type Tab = Category | "All";

export function CategoryPackages() {
  const [tab, setTab] = useState<Tab>("All");
  const list = (tab === "All" ? PACKAGES.filter((p) => p.rating >= 4.8 || p.featured) : PACKAGES.filter((p) => p.category === tab)).slice(0, 6);
  const blurb = tab === "All" ? "Our highest-rated trips right now" : CATEGORIES.find((c) => c.id === tab)?.blurb;
  const tabs: Tab[] = ["All", ...CATEGORIES.map((c) => c.id)];

  return (
    <div>
      <div role="tablist" aria-label="Package categories" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
        {tabs.map((t) => (
          <button
            key={t}
            role="tab"
            id={`tab-${t}`}
            aria-selected={tab === t}
            aria-controls="category-panel"
            onClick={() => setTab(t)}
            className={cn(
              "shrink-0 rounded-full border px-5 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              tab === t ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-muted",
            )}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">{blurb}</p>
        <Link
          href={tab === "All" ? "/packages" : `/packages?category=${tab}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View all {tab === "All" ? "packages" : tab.toLowerCase()} <ArrowRight className="size-4" />
        </Link>
      </div>
      <div id="category-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <PackageCard key={p.slug} pkg={p} />
        ))}
      </div>
    </div>
  );
}
