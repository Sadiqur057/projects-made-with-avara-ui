import type { Metadata } from "next";
import { PageHero } from "@/components/site/ui";
import { Dashboard } from "@/components/dashboard/dashboard";

export const metadata: Metadata = {
  title: "Member dashboard",
  description: "Track your membership, class credits and every booking in one place.",
};

export default function DashboardPage() {
  return (
    <>
      <PageHero
        eyebrow="Member area"
        title="Your dashboard"
        description="Your plan, class credits and every booking with live status."
        crumbs={[{ label: "Home", href: "/" }, { label: "Dashboard" }]}
      />
      <Dashboard />
    </>
  );
}
