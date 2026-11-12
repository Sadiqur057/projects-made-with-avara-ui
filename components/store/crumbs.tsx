"use client";

import Link from "next/link";
import { BreadcrumbBlock, type BreadcrumbItem } from "@/components/custom/blocks/BreadcrumbBlock";

export function Crumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6">
      <BreadcrumbBlock items={items} variant="slash" color="primary" linkComponent={Link} />
    </nav>
  );
}
