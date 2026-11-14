import { House } from "lucide-react";
import { Footer } from "@/components/custom/blocks/FooterBlock";

export function SiteFooter() {
  return (
    <Footer
      variant="wordmark-glow"
      brandName="Haven & Co."
      color="primary"
      logo={
        <span className="inline-flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <House className="size-4" aria-hidden />
          </span>
          <span className="text-xl font-bold tracking-tight text-foreground">Haven & Co.</span>
        </span>
      }
      tagline="A boutique real estate agency helping families, first-time buyers and investors find the right home, from the first tour to the day you get the keys."
      wordmark="Haven & Co."
      wordmarkFooter={{
        columns: [
          {
            title: "Buy",
            children: [
              { title: "Featured listings", link: "/#listings" },
              { title: "Property types", link: "/#types" },
              { title: "How it works", link: "/#how-it-works" },
              { title: "Schedule a visit", link: "/schedule" },
            ],
          },
          {
            title: "Sell",
            children: [
              { title: "Free home valuation", link: "/schedule" },
              { title: "Our marketing plan", link: "/#how-it-works" },
              { title: "Seller guide", link: "/#reviews" },
            ],
          },
          {
            title: "Company",
            children: [
              { title: "Our agents", link: "/schedule" },
              { title: "Client reviews", link: "/#reviews" },
              { title: "Careers", link: "/schedule" },
            ],
          },
        ],
        contact: { email: "hello@havenandco.example", location: "210 Congress Ave, Austin, TX" },
        social: [
          { title: "Instagram", link: "#" },
          { title: "LinkedIn", link: "#" },
          { title: "YouTube", link: "#" },
        ],
        legal: [
          { title: "Privacy", link: "#" },
          { title: "Terms", link: "#" },
          { title: "Fair housing", link: "#" },
        ],
        copyright: "Haven & Co. Realty",
        bottomLine: "Licensed brokerage. Equal housing opportunity.",
        labels: { contact: "Talk to an agent", location: "Visit our office", social: "Follow" },
      }}
    />
  );
}
