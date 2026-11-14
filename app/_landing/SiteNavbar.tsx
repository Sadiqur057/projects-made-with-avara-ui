"use client";

import Link from "next/link";
import { NavbarBlock } from "@/components/custom/blocks/NavbarBlock";

const NAV_LINKS = [
  { name: "Features", href: "#features" },
  { name: "Insights", href: "#insights" },
  { name: "Pricing", href: "#pricing" },
  { name: "FAQ", href: "#faq" },
];

export function SiteNavbar() {
  return (
    <NavbarBlock
      variant="spotlight"
      color="primary"
      logoText="Ledgerly"
      links={NAV_LINKS}
      cta={{ label: "Open dashboard", href: "/dashboard" }}
      linkComponent={Link}
    />
  );
}
