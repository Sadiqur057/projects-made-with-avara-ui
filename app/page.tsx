import { SiteNavbar } from "./_landing/SiteNavbar";
import { Hero } from "./_landing/Hero";
import { Features } from "./_landing/Features";
import { Walkthrough } from "./_landing/Walkthrough";
import { Stats } from "./_landing/Stats";
import { Pricing } from "./_landing/Pricing";
import { Faq } from "./_landing/Faq";
import { SiteFooter } from "./_landing/SiteFooter";

export default function Home() {
  return (
    <>
      <SiteNavbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <Walkthrough />
        <Stats />
        <Pricing />
        <Faq />
      </main>
      <SiteFooter />
    </>
  );
}
