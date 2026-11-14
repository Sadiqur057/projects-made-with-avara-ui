"use client";

import Link from "next/link";

// Client component that Avara blocks can take as `linkComponent`
// (a server component can't hand `next/link` itself across the boundary).
export const SiteLink = Link;
