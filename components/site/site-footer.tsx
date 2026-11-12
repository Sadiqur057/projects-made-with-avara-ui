import { Compass } from "lucide-react";
import { Footer } from "@/components/custom/blocks/FooterBlock";
import { BRAND } from "@/lib/travel-data";

export function SiteFooter() {
  return (
    <Footer
      variant="wordmark-glow"
      color="primary"
      brandName={BRAND.name}
      logo={
        <span className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Compass className="size-4" />
          </span>
          {BRAND.name}
        </span>
      }
      wordmark={BRAND.name}
      tagline={BRAND.tagline}
      copyrightText={BRAND.name}
      wordmarkFooter={{
        tagline: BRAND.tagline,
        copyright: BRAND.name,
        bottomLine: "Small-group travel with local hosts since 2012.",
        labels: { contact: "Talk to a planner", location: "Visit our studio", social: "Follow along" },
        columns: [
          {
            title: "Explore",
            children: [
              { title: "Destinations", link: "/destinations" },
              { title: "All packages", link: "/packages" },
              { title: "Last-minute deals", link: "/#deals" },
              { title: "Wishlist", link: "/wishlist" },
            ],
          },
          {
            title: "Your trip",
            children: [
              { title: "My trips", link: "/my-trips" },
              { title: "Track a booking", link: "/my-trips#track" },
              { title: "Booking checkout", link: "/packages" },
            ],
          },
          {
            title: "Company",
            children: [
              { title: "Travel journal", link: "/blog" },
              { title: "Contact", link: "/contact" },
              { title: "FAQs", link: "/contact#faq" },
            ],
          },
        ],
        contact: { email: BRAND.email, location: BRAND.address },
        social: [
          { title: "Instagram", link: "#" },
          { title: "YouTube", link: "#" },
          { title: "Pinterest", link: "#" },
        ],
        legal: [
          { title: "Terms", link: "/contact#faq" },
          { title: "Privacy", link: "/contact#faq" },
        ],
      }}
    />
  );
}
