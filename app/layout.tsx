import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/custom/blocks/SonnerBlock";
import { SiteFooter } from "@/components/forum/site-footer";
import { SiteHeader } from "@/components/forum/site-header";
import { THEME_INIT_SCRIPT } from "@/components/forum/theme-toggle";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Commonroom · The community forum for builders",
    template: "%s · Commonroom",
  },
  description:
    "Commonroom is a community forum for people who design, build and ship digital products. Ask questions, share work and learn together.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
