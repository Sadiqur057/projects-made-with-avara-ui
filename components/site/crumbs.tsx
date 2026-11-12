"use client";

import Link from "next/link";
import { BreadcrumbBlock, type BreadcrumbItem } from "@/components/custom/blocks/BreadcrumbBlock";

/** Breadcrumbs wired to next/link. A client wrapper, because a component cannot be passed as a prop from a server component. */
export function Crumbs({ items }: { items: BreadcrumbItem[] }) {
  return <BreadcrumbBlock items={items} linkComponent={Link} color="primary" />;
}
