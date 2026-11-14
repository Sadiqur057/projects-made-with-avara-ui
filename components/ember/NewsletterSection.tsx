"use client";

import { Newsletter } from "@/components/custom/blocks/NewsletterBlock";
import { FACES, JOINED } from "@/lib/ember";

// Demo only: swap this for a real call to your mailing-list provider.
// Resolve to show the thank-you; throw to stay on the form with an error.
async function subscribe(email: string) {
  await new Promise((resolve) => setTimeout(resolve, 900));
  if (!email.includes("@")) throw new Error("Please enter a valid email address.");
}

export function NewsletterSection() {
  return (
    <section className="bg-background px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-5xl">
        <Newsletter variant="spotlight">
          <Newsletter.Heading>Letters from the hearth</Newsletter.Heading>
          <Newsletter.Intro>
            One short note when the menu turns: new dishes, wine dinners and early access to tables. No spam, leave
            anytime.
          </Newsletter.Intro>
          <Newsletter.Form
            action="Join the list"
            placeholder="you@email.com"
            onSubscribe={subscribe}
            successTitle="You're on the list"
            successText="Look out for the next letter from the kitchen."
          />
          <Newsletter.Proof avatars={FACES}>3,800 guests read the letter</Newsletter.Proof>
          <Newsletter.Ticker items={JOINED} />
        </Newsletter>
      </div>
    </section>
  );
}
