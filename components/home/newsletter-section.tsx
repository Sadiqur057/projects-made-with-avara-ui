"use client";

import { Newsletter } from "@/components/custom/blocks/NewsletterBlock";
import { subscribeToNewsletter } from "@/lib/store";
import { REVIEWS } from "@/lib/travel-data";

export function NewsletterSection() {
  const faces = REVIEWS.slice(0, 4).map((r) => ({ src: r.avatar, alt: r.name }));
  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
      <Newsletter variant="portraits" portraits={faces} accent="var(--primary)" className="rounded-3xl">
        <Newsletter.Heading>Get the trips we would book ourselves</Newsletter.Heading>
        <Newsletter.Intro>
          One email a fortnight: new departures, quiet corners and last-minute deals before they go public. No spam, unsubscribe anytime.
        </Newsletter.Intro>
        <Newsletter.Form
          placeholder="you@example.com"
          action="Subscribe"
          successTitle="You are on the list"
          successText="Your first edition lands in your inbox soon."
          onSubscribe={async (email) => {
            await new Promise((r) => setTimeout(r, 600));
            subscribeToNewsletter(email);
          }}
        />
        <Newsletter.Proof avatars={faces.map((f) => f.src)}>Read by 18,000 travellers</Newsletter.Proof>
      </Newsletter>
    </div>
  );
}
