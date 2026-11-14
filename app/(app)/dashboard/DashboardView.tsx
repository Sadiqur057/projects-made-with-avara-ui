"use client";

import Link from "next/link";
import { Dashboard } from "@/components/custom/blocks/DashboardBlock";
import {
  ACTIVITY,
  AUTHORS,
  COUNTRIES,
  METRICS,
  PAYMENTS,
  SHORTCUTS,
  SIGN_UPS,
  SOURCES,
  TOTALS,
} from "@/lib/dashboard-data";
import { useSession } from "@/lib/session";

export function DashboardView() {
  const session = useSession();
  return (
    <Dashboard
      variant="liquid-glass"
      userName={session?.name ?? "there"}
      totals={TOTALS}
      metrics={METRICS}
      activity={ACTIVITY}
      sources={SOURCES}
      signUps={SIGN_UPS}
      countries={COUNTRIES}
      authors={AUTHORS}
      payments={PAYMENTS}
      shortcuts={SHORTCUTS}
      defaultPeriod="week"
      linkComponent={Link}
      links={{
        activity: "/dashboard#activity",
        traffic: "/dashboard",
        countries: "/dashboard",
        authors: "/dashboard",
        payments: "/dashboard",
      }}
    />
  );
}
