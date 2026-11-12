import type { Metadata } from "next";
import { PageHero } from "@/components/site/ui";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Questions about memberships, classes or personal training? Talk to the IRONPULSE team.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to a human"
        description="Questions about memberships, classes or personal training? Drop us a line or come in for a tour."
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />
      <ContactForm />
    </>
  );
}
