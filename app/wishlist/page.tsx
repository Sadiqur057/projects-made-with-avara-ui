import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { WishlistView } from "@/components/wishlist/wishlist-view";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "The trips you have saved.",
};

export default function WishlistPage() {
  return (
    <>
      <PageHeader eyebrow="Wishlist" title="Trips you are dreaming about" description="Saved on this device. Compare them, share the list or book when you are ready." />
      <div className="mx-auto w-full max-w-7xl px-5 pb-24 sm:px-8">
        <WishlistView />
      </div>
    </>
  );
}
