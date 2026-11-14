"use client";

import { Wallet } from "lucide-react";
import { Footer } from "@/components/custom/blocks/FooterBlock";

export function SiteFooter() {
  return (
    <Footer
      variant="wordmark-glow"
      brandName="Ledgerly"
      tagline="A calm personal finance tracker. Log spending, set budgets and see where your money goes."
      wordmark="Ledgerly"
      logo={
        <span className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground">
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Wallet className="size-4" aria-hidden />
          </span>
          Ledgerly
        </span>
      }
      wordmarkFooter={{
        columns: [
          {
            title: "Product",
            children: [
              { title: "Features", link: "#features" },
              { title: "Insights", link: "#insights" },
              { title: "Pricing", link: "#pricing" },
              { title: "FAQ", link: "#faq" },
            ],
          },
          {
            title: "Dashboard",
            children: [
              { title: "Overview", link: "/dashboard" },
              { title: "Transactions", link: "/dashboard/transactions" },
              { title: "Budgets", link: "/dashboard/budgets" },
            ],
          },
        ],
        contact: { email: "hello@ledgerly.example", location: "Remote-first" },
        social: [],
        legal: [
          { title: "Privacy", link: "#faq" },
          { title: "Terms", link: "#" },
        ],
        copyright: "Ledgerly",
        bottomLine: "Demo project. All figures are mock data.",
      }}
    />
  );
}
