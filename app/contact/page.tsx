import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ContactForm } from "@/components/contact/contact-form";
import { PageHeader } from "@/components/site/page-header";
import { BRAND, FAQS } from "@/lib/travel-data";

export const metadata: Metadata = {
  title: "Contact",
  description: "Talk to a Wayfare trip planner.",
};

const INFO = [
  { icon: Mail, label: "Email", value: BRAND.email, href: `mailto:${BRAND.email}` },
  { icon: Phone, label: "Phone", value: BRAND.phone, href: `tel:${BRAND.phone.replace(/[^+\d]/g, "")}` },
  { icon: MapPin, label: "Studio", value: BRAND.address },
  { icon: Clock, label: "Hours", value: BRAND.hours },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader eyebrow="Contact" title="Talk to someone who has been there" description="Tell us roughly when, who with and what you love. A planner replies within one working day." />
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 pb-16 sm:px-8 lg:grid-cols-[1fr_22rem] lg:gap-14">
        <ContactForm />
        <ul className="grid content-start gap-4">
          {INFO.map((i) => (
            <li key={i.label} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary"><i.icon className="size-5" /></span>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{i.label}</p>
                {i.href ? <a href={i.href} className="font-medium hover:underline">{i.value}</a> : <p className="font-medium">{i.value}</p>}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <section id="faq" className="mx-auto w-full max-w-3xl scroll-mt-24 px-5 pb-24 pt-8 sm:px-8" aria-labelledby="faq-title">
        <h2 id="faq-title" className="text-3xl font-semibold">Frequently asked questions</h2>
        <Accordion className="mt-6">
          {FAQS.map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger className="py-4 text-base">{f.q}</AccordionTrigger>
              <AccordionContent>
                <p className="pb-4 text-muted-foreground">{f.a}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </>
  );
}
