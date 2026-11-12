import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { ToastProvider } from "@/components/custom/blocks/ToastBlock";
import { CartDrawer } from "@/components/store/cart-drawer";
import { SiteFooter } from "@/components/store/site-footer";
import { SiteHeader } from "@/components/store/site-header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "AVARA — Considered fashion",
    template: "%s · AVARA",
  },
  description: "AVARA is a fashion store for considered, small-run clothing. Shop dresses, outerwear, knitwear and tailoring with free shipping over $120.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${geistSans.variable} ${geistMono.variable} ${instrument.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <ToastProvider position="bottom-right" variant="default">
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-foreground focus:px-4 focus:py-2 focus:text-background">
            Skip to content
          </a>
          <SiteHeader />
          <CartDrawer />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </ToastProvider>
      </body>
    </html>
  );
}
