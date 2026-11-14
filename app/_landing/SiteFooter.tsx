"use client";

import { Command } from "lucide-react";
import { Footer } from "@/components/custom/blocks/FooterBlock";

export function SiteFooter() {
  return (
    <Footer
      variant="wordmark-glow"
      brandName="Notewise"
      wordmark="Notewise"
      logo={
        <span className="flex select-none items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Command className="size-4" />
          </span>
          <span className="text-xl font-extrabold tracking-tight">Notewise</span>
        </span>
      }
      tagline="AI meeting notes for busy teams. Notewise records, transcribes and summarises every call, so nothing falls through the cracks."
      wordmarkFooter={{
        copyright: "Notewise",
        bottomLine: "Built for teams that hate taking notes.",
        columns: [
          {
            title: "Product",
            children: [
              { title: "Features", link: "/#features" },
              { title: "How it works", link: "/#how-it-works" },
              { title: "Pricing", link: "/#pricing" },
              { title: "FAQ", link: "/#faq" },
            ],
          },
          {
            title: "Account",
            children: [
              { title: "Log in", link: "/login" },
              { title: "Create account", link: "/register" },
              { title: "Dashboard", link: "/dashboard" },
              { title: "AI assistant", link: "/assistant" },
            ],
          },
        ],
        contact: { email: "hello@notewise.app", location: "Remote-first team" },
        social: [
          { title: "LinkedIn", link: "#" },
          { title: "YouTube", link: "#" },
          { title: "X", link: "#" },
        ],
        legal: [
          { title: "Privacy", link: "#" },
          { title: "Terms", link: "#" },
        ],
      }}
    />
  );
}
