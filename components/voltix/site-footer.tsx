import { Footer } from "@/components/custom/blocks/FooterBlock";

const sections = [
  {
    title: "Shop",
    links: [
      { label: "Headphones", href: "/products/volt-pro-x1-headphones" },
      { label: "Smartphones", href: "/products/nova-12-5g-smartphone" },
      { label: "Laptops", href: "/products/aero-14-ultrabook" },
      { label: "Wearables", href: "/products/pulse-watch-s2" },
    ],
  },
  {
    title: "Deals",
    links: [
      { label: "Flash sale", href: "/#flash-sale" },
      { label: "Featured picks", href: "/#featured" },
      { label: "All categories", href: "/#categories" },
      { label: "Price match", href: "/#why-voltix" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Delivery & returns", href: "/#why-voltix" },
      { label: "Warranty", href: "/#why-voltix" },
      { label: "Track an order", href: "#" },
      { label: "Contact us", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Voltix", href: "/" },
      { label: "Customer reviews", href: "/#reviews" },
      { label: "Careers", href: "#" },
      { label: "Privacy policy", href: "#" },
    ],
  },
];

export function SiteFooter() {
  return (
    <Footer
      variant="quantum-particle-beam"
      color="primary"
      brandName="Voltix"
      tagline="Genuine consumer electronics, fair prices and free next-day delivery."
      copyrightText="© 2026 Voltix Electronics. All rights reserved."
      sections={sections}
      socialLinks={[
        { network: "x", href: "#" },
        { network: "instagram", href: "#" },
        { network: "youtube", href: "#" },
        { network: "facebook", href: "#" },
      ]}
    />
  );
}
