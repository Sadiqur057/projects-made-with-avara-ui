"use client";

import Link from "next/link";
import { NavbarBlock } from "@/components/custom/blocks/NavbarBlock";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50">
      <NavbarBlock variant="default" color="primary" logoText="IRONPULSE" linkComponent={Link} />
    </header>
  );
}
