"use client";

import { Footer } from "@/components/custom/blocks/FooterBlock";
import { GYM } from "@/lib/gym-data";

export function SiteFooter() {
  return (
    <Footer
      variant="architectural-liquid"
      color="primary"
      brandName="IRONPULSE"
      blueprintWordmark="IRONPULSE"
      heroTitle="TRAIN HARDER. RECOVER SMARTER."
      architecturalLiquid={{
        subscribeText: "Get weekly training tips and new class drops in your inbox.",
        addressLines: [...GYM.address],
        directionHref: "/contact",
        businessEmail: GYM.email,
        inquiryEmail: GYM.email,
        navColumns: [
          {
            title: "Train",
            links: [
              { label: "Classes", href: "/classes" },
              { label: "Schedule", href: "/schedule" },
              { label: "Trainers", href: "/trainers" },
            ],
          },
          {
            title: "Join",
            links: [
              { label: "Membership", href: "/membership" },
              { label: "Checkout", href: "/membership/checkout" },
              { label: "Free trial", href: "/#free-trial" },
            ],
          },
          {
            title: "Member",
            links: [
              { label: "Dashboard", href: "/dashboard" },
              { label: "My bookings", href: "/dashboard#bookings" },
              { label: "Contact", href: "/contact" },
            ],
          },
        ],
        socials: [
          { label: "Instagram", href: "https://instagram.com" },
          { label: "YouTube", href: "https://youtube.com" },
          { label: "TikTok", href: "https://tiktok.com" },
        ],
        legalLinks: [
          { label: "Privacy", href: "/contact" },
          { label: "Terms", href: "/contact" },
        ],
        copyrightText: "© IRONPULSE GYM. ALL RIGHTS RESERVED.",
      }}
    />
  );
}
