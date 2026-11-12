"use client";

import Link from "next/link";
import { WordmarkFooter } from "@/components/custom/blocks/FooterBlock";
import { ThemeToggle } from "@/components/store/theme-toggle";

export function SiteFooter() {
  return (
    <div className="relative">
      <WordmarkFooter
        linkComponent={Link}
        logoHref="/"
        logo={
          <span className="font-display text-2xl font-semibold tracking-tight text-foreground">
            Aurelle
          </span>
        }
        tagline="Skincare that listens to your skin. Honest formulas, fair prices and a routine that fits real life."
        columns={[
          {
            title: "Shop",
            children: [
              { title: "All products", link: "/shop" },
              { title: "Bestsellers", link: "/shop?sort=best" },
              { title: "Serums", link: "/shop?step=serum" },
              { title: "Sun care", link: "/shop?step=sunscreen" },
              { title: "Flash sale", link: "/#flash-sale" },
            ],
          },
          {
            title: "Help",
            children: [
              { title: "Skin-type quiz", link: "/quiz" },
              { title: "Track your order", link: "/track" },
              { title: "Your bag", link: "/cart" },
              { title: "Favourites", link: "/shop?saved=1" },
            ],
          },
        ]}
        contact={{
          email: "hello@aurelle.test",
          location: "Studio 4, 22 Alder Lane, Portland, OR",
        }}
        labels={{ contact: "Say hello", location: "Our studio", social: "Follow" }}
        social={[
          { title: "Instagram", link: "https://instagram.com" },
          { title: "TikTok", link: "https://tiktok.com" },
          { title: "YouTube", link: "https://youtube.com" },
        ]}
        legal={[
          { title: "Privacy", link: "/" },
          { title: "Terms", link: "/" },
          { title: "Shipping & returns", link: "/" },
        ]}
        copyright="Aurelle Skin Co."
        bottomLine="Demo store — no payments are taken."
        wordmark="AURELLE"
      />
      <div className="absolute bottom-4 right-4 z-20 sm:bottom-6 sm:right-8">
        <ThemeToggle />
      </div>
    </div>
  );
}
