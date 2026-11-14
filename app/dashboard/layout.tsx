import type { Metadata } from "next";
import { DashboardShell } from "./_components/DashboardShell";

export const metadata: Metadata = {
  title: "Dashboard — Ledgerly",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
