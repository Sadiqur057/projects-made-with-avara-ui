"use client";

import Link from "next/link";
import { NavbarBlock } from "@/components/custom/blocks/NavbarBlock";

export function SiteNavbar() {
  return (
    <header className="sticky top-0 z-50">
      <NavbarBlock variant="glass" color="primary" logoText="Ember & Oak" linkComponent={Link} />
    </header>
  );
}
