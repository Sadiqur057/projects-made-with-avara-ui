import { SiteNavbar } from "./_landing/SiteNavbar";
import { Hero } from "./_landing/Hero";
import { Features } from "./_landing/Features";
import { Insights } from "./_landing/Insights";
import { PricingSection } from "./_landing/PricingSection";
import { FaqSection } from "./_landing/FaqSection";
import { SiteFooter } from "./_landing/SiteFooter";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-background">
      <SiteNavbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <Insights />
        <PricingSection />
        <FaqSection />
      </main>
      <SiteFooter />
    </div>
  );
}
