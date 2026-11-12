import type { Metadata } from "next";
import { CartClient } from "@/components/store/cart/cart-client";

export const metadata: Metadata = { title: "Your bag" };

export default function CartPage() {
  return <CartClient />;
}
