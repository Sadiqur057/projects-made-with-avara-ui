"use client";

import { useCallback } from "react";
import { useToast } from "@/components/custom/blocks/toast-context";
import { getProductById } from "@/lib/store/products";
import { addToCart, applyCoupon, removeCoupon, removeLine, toggleWishlist, useUi } from "@/lib/store/store";

/** Store actions wired up with toast feedback. */
export function useShop() {
  const { toast } = useToast();
  const { setCartOpen } = useUi();

  const add = useCallback(
    (productId: string, color: string, size: string, qty = 1, opts: { openCart?: boolean } = {}) => {
      const p = getProductById(productId);
      addToCart(productId, color, size, qty);
      if (opts.openCart) {
        // The bag drawer is the confirmation; a toast on top of it would just cover the totals.
        setCartOpen(true);
        return;
      }
      toast({
        type: "success",
        title: "Added to bag",
        description: p ? `${p.name} · ${color} · ${size}` : undefined,
        duration: 3000,
        action: { label: "View bag", onClick: () => setCartOpen(true) },
      });
    },
    [toast, setCartOpen],
  );

  const toggleFavourite = useCallback(
    (productId: string) => {
      const p = getProductById(productId);
      const nowSaved = toggleWishlist(productId);
      toast({
        type: nowSaved ? "success" : "info",
        title: nowSaved ? "Saved to wishlist" : "Removed from wishlist",
        description: p?.name,
        duration: 2500,
      });
      return nowSaved;
    },
    [toast],
  );

  const remove = useCallback(
    (key: string) => {
      removeLine(key);
      toast({ type: "info", title: "Removed from bag", duration: 2000 });
    },
    [toast],
  );

  const redeem = useCallback(
    (code: string) => {
      const res = applyCoupon(code);
      if (res.ok) toast({ type: "success", title: `${res.coupon.code} applied`, description: res.coupon.description, duration: 3000 });
      return res;
    },
    [toast],
  );

  const dropCoupon = useCallback(() => {
    removeCoupon();
    toast({ type: "info", title: "Coupon removed", duration: 2000 });
  }, [toast]);

  return { add, toggleFavourite, remove, redeem, dropCoupon };
}
