"use client";

import { Newsletter } from "@/components/custom/blocks/NewsletterBlock";
import { newsletterFaces } from "@/lib/store/products";

export function NewsletterSection() {
  return (
    <div id="newsletter" className="scroll-mt-24">
      <Newsletter variant="portraits" portraits={newsletterFaces.map((src, i) => ({ src, alt: `Subscriber ${i + 1}` }))}>
        <Newsletter.Heading>
          First to the drop. <span className="font-heading italic text-primary">Always.</span>
        </Newsletter.Heading>
        <Newsletter.Intro>Join 24,000 readers for early access to new arrivals, restocks and flash sales, plus 10% off your first order with WELCOME10.</Newsletter.Intro>
        <Newsletter.Form
          placeholder="you@email.com"
          action="Join the list"
          successTitle="You're on the list"
          successText="Check your inbox. Use WELCOME10 at checkout for 10% off."
          onSubscribe={async (email) => {
            if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("Please enter a valid email address");
            await new Promise((r) => setTimeout(r, 700));
          }}
        />
        <Newsletter.Proof avatars={newsletterFaces}>Loved by 24,000+ readers</Newsletter.Proof>
      </Newsletter>
    </div>
  );
}
