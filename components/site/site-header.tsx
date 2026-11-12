"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { NavbarBlock, type NavLink } from "@/components/custom/blocks/NavbarBlock";
import { useWishlist } from "@/lib/store";
import { BRAND } from "@/lib/travel-data";

const LINKS: NavLink[] = [
  {
    name: "Destinations",
    href: "/destinations",
    children: [
      { name: "All destinations", href: "/destinations" },
      { name: "Asia", href: "/destinations?region=Asia" },
      { name: "Europe", href: "/destinations?region=Europe" },
      { name: "Africa", href: "/destinations?region=Africa" },
      { name: "Americas", href: "/destinations?region=Americas" },
    ],
  },
  { name: "Packages", href: "/packages" },
  { name: "Deals", href: "/#deals" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

function WishlistLink() {
  const { count } = useWishlist();
  return (
    <Link
      href="/wishlist"
      aria-label={`Wishlist, ${count} saved`}
      className="relative inline-flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
    >
      <Heart className="size-5" />
      {count > 0 && (
        <span className="absolute right-0.5 top-0.5 flex min-w-4 items-center justify-center rounded-full bg-sun px-1 text-[10px] font-bold leading-4 text-sun-foreground">
          {count}
        </span>
      )}
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header>
      <NavbarBlock
        variant="floating"
        color="primary"
        logoText={BRAND.name}
        links={LINKS}
        slot={<WishlistLink />}
        secondaryAction={{ label: "My trips", href: "/my-trips" }}
        primaryAction={{ label: "Plan a trip", href: "/packages" }}
        linkComponent={Link}
      />
    </header>
  );
}
