"use client";

import { TwoColumnFAQSection } from "@/components/custom/blocks/FAQSectionBlock";
import type { FAQItem } from "@/components/custom/blocks/faq-section-data";

// The two-column layout shows no photo, so the canvas fields are left empty.
const base = { image: "", location: "", coordinates: "", height: 0, maxWidth: 0, clipCut: "0" };

const ITEMS: FAQItem[] = [
  {
    id: "private",
    category: "Privacy",
    question: "Where is my financial data stored?",
    answer:
      "Only in your own browser. Ledgerly keeps transactions and budgets in local storage, so nothing is uploaded and nobody else can see it. Clearing site data removes it.",
  },
  {
    id: "bank",
    category: "Accounts",
    question: "Do I need to connect my bank?",
    answer: "No. You add transactions yourself, which keeps you aware of every purchase. Bank sync is not part of this demo.",
  },
  {
    id: "budgets",
    category: "Budgets",
    question: "How do category budgets and warnings work?",
    answer:
      "Pick a category and a monthly limit. The progress bar fills as you log spending, turns amber at 85% of the limit and red with an overspend warning once you pass it.",
  },
  {
    id: "delete",
    category: "Transactions",
    question: "Can I delete or fix a transaction?",
    answer:
      "Yes. Delete any row from the Transactions page and every chart and budget updates immediately. Add it again with the right amount if needed.",
  },
  {
    id: "income",
    category: "Transactions",
    question: "Can I track income as well as spending?",
    answer:
      "Yes. Mark a transaction as income and your net savings and savings rate update. Income is excluded from budgets and the spending charts.",
  },
  {
    id: "plans",
    category: "Plans",
    question: "What do I get on the paid plans?",
    answer:
      "Plus adds unlimited budgets, alerts and CSV export. Family adds shared budgets for up to five people. The demo itself is free to explore.",
  },
].map((item) => ({ ...base, ...item }));

export function FaqSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 sm:pb-28">
      <TwoColumnFAQSection
        id="faq"
        title="Questions people ask before they start."
        description="Short answers about privacy, budgets and how the tracker works. Can't find yours? Send us a note."
        items={ITEMS}
        supportEmail="hello@ledgerly.example"
        defaultActiveId="private"
        className="scroll-mt-24"
      />
    </section>
  );
}
