import Link from "next/link";
import { Footer } from "@/components/custom/blocks/FooterBlock";
import { categories } from "@/lib/store/products";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "New arrivals", href: "/shop?sort=newest" },
      { label: "Sale", href: "/shop?sale=1" },
      ...categories.slice(0, 4).map((c) => ({ label: c.name, href: `/shop?category=${c.id}` })),
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Track your order", href: "/track" },
      { label: "Wishlist", href: "/wishlist" },
      { label: "Checkout", href: "/checkout" },
      { label: "Shipping & returns", href: "/track" },
    ],
  },
  {
    title: "Coupons",
    links: [
      { label: "WELCOME10 · 10% off", href: "/shop" },
      { label: "FASHION20 · 20% over $150", href: "/shop" },
      { label: "FREESHIP · free shipping", href: "/shop" },
    ],
  },
];

export function SiteFooter() {
  return (
    <div className="mt-auto border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <p className="font-heading text-4xl tracking-[0.04em]">AVARA</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Considered clothing for people who dress with intent. Designed in small runs, shipped worldwide.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{col.title}</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="underline-offset-4 transition hover:text-primary hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <Footer
        variant="editorial-card"
        brandName="AVARA"
        color="primary"
        editorialCta={{ buttonText: "JOIN THE LIST", buttonHref: "/#newsletter", copyright: "AVARA © 2026", rightsText: "All rights reserved", socialLinks: [{ label: "INSTAGRAM", href: "#" }, { label: "PINTEREST", href: "#" }, { label: "TIKTOK", href: "#" }] }}
      />
    </div>
  );
}
