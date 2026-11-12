"use client";

import { Gift, Leaf, Truck } from "lucide-react";
import { Newsletter } from "@/components/custom/blocks/NewsletterBlock";
import { toast } from "@/components/custom/blocks/sonner-store";
import { actions, useStore } from "@/lib/store";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function NewsletterCta() {
  const { newsletter } = useStore();

  const subscribe = async (email: string) => {
    if (!EMAIL.test(email.trim())) {
      toast.error("That email doesn't look right", { description: "Check it and try again." });
      throw new Error("invalid email");
    }
    actions.subscribeNewsletter(email.trim());
    actions.applyPromo("WELCOME15");
  };

  return (
    <Newsletter variant="spotlight">
      <Newsletter.Heading>Skin notes, and 15% off your first order</Newsletter.Heading>
      <Newsletter.Intro>
        Two emails a month: routines that work, ingredients explained, early access to launches. Unsubscribe in one click.
      </Newsletter.Intro>
      <Newsletter.Form
        action="Get 15% off"
        placeholder="you@example.com"
        onSubscribe={subscribe}
        successTitle="You're on the list"
        successText="WELCOME15 is already applied to your bag, so you'll see 15% off at checkout."
      />
      <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <li className="flex items-center gap-2">
          <Gift className="size-4 text-primary" aria-hidden="true" />
          15% welcome code
        </li>
        <li className="flex items-center gap-2">
          <Leaf className="size-4 text-primary" aria-hidden="true" />
          No spam, ever
        </li>
        <li className="flex items-center gap-2">
          <Truck className="size-4 text-primary" aria-hidden="true" />
          Free shipping over $50
        </li>
      </ul>
      {newsletter && (
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Subscribed as {newsletter}
        </p>
      )}
    </Newsletter>
  );
}
