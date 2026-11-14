"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { NavbarBlock } from "@/components/custom/blocks/NavbarBlock";

/**
 * next/link for page routes. In-page anchors ("/#pricing") are plain anchors,
 * so the browser scrolls to the section natively and updates the hash without a router transition.
 */
function NavLink({ href, ...props }: ComponentProps<typeof Link>) {
  if (typeof href === "string" && href.startsWith("/#")) {
    // Link-only props are not valid on a DOM anchor.
    const rest = { ...props } as Record<string, unknown>;
    delete rest.prefetch;
    delete rest.replace;
    delete rest.scroll;
    delete rest.shallow;
    return <a href={href} {...(rest as ComponentProps<"a">)} />;
  }
  return <Link href={href} {...props} />;
}

export function SiteNavbar() {
  return (
    <NavbarBlock
      variant="spotlight"
      color="primary"
      logoText="Notewise"
      linkComponent={NavLink}
    />
  );
}
