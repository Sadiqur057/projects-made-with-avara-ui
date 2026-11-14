"use client";

import { Flame } from "lucide-react";
import { Footer } from "@/components/custom/blocks/FooterBlock";
import { RESTAURANT } from "@/lib/ember";

export function SiteFooter() {
  return (
    <div id="visit">
      <Footer
        variant="snapshot"
        color="primary"
        brandName={RESTAURANT.name}
        logo={
          <span className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Flame className="size-4" aria-hidden />
            </span>
            <span className="font-heading text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              {RESTAURANT.name}
            </span>
          </span>
        }
        sections={[
          {
            title: "Explore",
            links: [
              { label: "Signature dishes", href: "/#dishes" },
              { label: "Our story", href: "/#story" },
              { label: "Chef's special", href: "/#special" },
              { label: "Guest reviews", href: "/#reviews" },
            ],
          },
          {
            title: "Dine with us",
            links: [
              { label: "Reserve a table", href: "/reserve", badge: "New" },
              { label: "Private dining", href: "/reserve" },
              { label: "Gift cards", href: "/reserve" },
              { label: "Allergens & dietary", href: "/reserve" },
            ],
          },
          {
            title: "Contact",
            links: [
              { label: RESTAURANT.phone, href: RESTAURANT.phoneHref },
              { label: RESTAURANT.email, href: `mailto:${RESTAURANT.email}` },
              { label: "Press enquiries", href: `mailto:${RESTAURANT.email}` },
              { label: "Careers", href: `mailto:${RESTAURANT.email}` },
            ],
          },
        ]}
        tagline="Wood-fired fine dining in Brooklyn."
        socialLinks={[
          { network: "instagram", href: "https://instagram.com", label: "Ember & Oak on Instagram" },
          { network: "facebook", href: "https://facebook.com", label: "Ember & Oak on Facebook" },
          { network: "x", href: "https://x.com", label: "Ember & Oak on X" },
        ]}
        snapshot={{
          headingLines: ["Come hungry.", "Stay for the fire."],
          description:
            "Find us on a quiet corner of Brooklyn. Tables are set for dinner Tuesday to Sunday; walk-ins are welcome at the bar, and everything else is best reserved ahead.",
          taglineLines: ["Live oak fire.", "Seasonal tasting menus.", "Cellar of 420 labels."],
          cards: [
            {
              dotColor: "bg-emerald-500",
              tag: "KITCHEN",
              meta: "Since 2014",
              title: "Wood-Fire Cooking",
              lines: ["Oak and cherrywood only,", "twelve local farms,", "a menu that follows the season."],
              footerLabel: "NOW SERVING",
              footerValue: "Autumn menu",
            },
            {
              dotColor: "bg-amber-500",
              tag: "RESERVATIONS",
              meta: "Tables of 1–8",
              title: "Book Ahead",
              lines: ["Reserve up to 60 days out,", "larger parties via private dining,", "walk-ins welcome at the bar."],
              footerLabel: "PHONE",
              footerValue: RESTAURANT.phone,
            },
            {
              dotColor: "bg-primary",
              tag: "FIND US",
              meta: "Brooklyn",
              title: "Ember & Oak",
              lines: [...RESTAURANT.address, RESTAURANT.phone],
              footerLabel: "HOURS",
              footerValue: "Tue–Sun, from 5:30 pm",
              stickerText: "see you soon!",
            },
            {
              dotColor: "bg-rose-500",
              tag: "PRIVATE DINING",
              meta: "Up to 24",
              title: "The Oak Room",
              lines: ["A candlelit room beside the hearth,", "set menus for celebrations", "and company dinners."],
              footerLabel: "ENQUIRIES",
              footerValue: RESTAURANT.email,
            },
            {
              dotColor: "bg-violet-500",
              tag: "CELLAR",
              meta: "420 labels",
              title: "Sommelier's List",
              lines: ["Small growers and old vintages,", "an oak-barrel cocktail bar,", "pairings for every course."],
              footerLabel: "PAIRING",
              footerValue: "Optional",
            },
            {
              dotColor: "bg-primary",
              tag: "OPENING HOURS",
              meta: "Dinner",
              title: "Dinner Service",
              lines: ["Tue–Thu  5:30–10 pm", "Fri–Sat  5:30–11 pm", "Sunday  5–9 pm"],
              footerLabel: "MONDAY",
              footerValue: "Closed",
            },
          ],
          address: [...RESTAURANT.address, RESTAURANT.phone],
          hours: "Tue–Sun, from 5:30 pm",
          stickerText: "see you soon!",
          legalLinks: [
            { label: "Privacy", href: "#" },
            { label: "Terms", href: "#" },
            { label: "Allergens", href: "#" },
          ],
        }}
      />
    </div>
  );
}
