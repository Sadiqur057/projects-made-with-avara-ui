"use client";

import Link from "next/link";
import { NavbarBlock } from "@/components/custom/blocks/NavbarBlock";

/**
 * Glass navbar from Avara UI, fixed to the top so it keeps blurring whatever
 * scrolls beneath it. `next/link` keeps navigation client-side.
 */
export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <NavbarBlock
        variant="glass"
        color="primary"
        logoText="Voltix"
        linkComponent={Link}
      />
    </header>
  );
}
