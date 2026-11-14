import { Footer } from "@/components/custom/blocks/FooterBlock";

export function SiteFooter() {
  return (
    <Footer
      variant="architectural-liquid"
      brandName="Commonroom"
      blueprintWordmark="COMMONROOM"
      color="primary"
      architecturalLiquid={{
        heroTitle: "WHERE BUILDERS THINK OUT LOUD",
        subscribeText:
          "A short weekly digest of the best threads, sent on Fridays. No spam, unsubscribe any time.",
        addressLines: ["Everywhere, remotely.", "Open 24 / 7 across every timezone"],
        directionHref: "/forum",
        businessEmail: "partners@commonroom.example",
        inquiryEmail: "hello@commonroom.example",
        navColumns: [
          {
            title: "Community",
            links: [
              { label: "Forum home", href: "/forum" },
              { label: "Newest posts", href: "/forum?sort=new" },
              { label: "Start a discussion", href: "/new" },
            ],
          },
          {
            title: "Categories",
            links: [
              { label: "Development", href: "/forum?category=dev" },
              { label: "Design", href: "/forum?category=design" },
              { label: "Career & Growth", href: "/forum?category=career" },
            ],
          },
          {
            title: "Members",
            links: [
              { label: "Your profile", href: "/u/demo_user" },
              { label: "Top contributors", href: "/#contributors-heading" },
              { label: "Home", href: "/" },
            ],
          },
        ],
        socials: [
          { label: "GitHub", href: "https://github.com" },
          { label: "Discord", href: "https://discord.com" },
          { label: "YouTube", href: "https://youtube.com" },
          { label: "LinkedIn", href: "https://linkedin.com" },
        ],
        legalLinks: [
          { label: "Guidelines", href: "/forum" },
          { label: "Privacy", href: "/" },
          { label: "Terms", href: "/" },
        ],
        copyrightText: "©2026 COMMONROOM. A DEMO COMMUNITY. DATA IS STORED IN YOUR BROWSER ONLY.",
      }}
    />
  );
}
