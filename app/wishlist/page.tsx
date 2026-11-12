import type { Metadata } from "next";
import { Crumbs } from "@/components/store/crumbs";
import { WishlistView } from "@/components/store/wishlist-view";

export const metadata: Metadata = { title: "Wishlist", description: "Your saved AVARA pieces." };

export default function WishlistPage() {
  return (
    <>
      <Crumbs items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />
      <WishlistView />
    </>
  );
}
