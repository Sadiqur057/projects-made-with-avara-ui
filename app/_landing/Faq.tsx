"use client";

import { FAQSection } from "@/components/custom/blocks/FAQSectionBlock";
import { FAQ_ITEMS } from "@/components/custom/blocks/faq-section-data";

// Keep the sample photography and layout numbers; replace the copy.
const COPY: { category: string; question: string; answer: string }[] = [
  {
    category: "Getting started",
    question: "How does Notewise join my meetings?",
    answer:
      "Connect your Google or Outlook calendar and Notewise adds a quiet note-taker to the calls you choose. It works with Zoom, Google Meet and Microsoft Teams, and you can also record in person from the mobile app.",
  },
  {
    category: "Accuracy",
    question: "How accurate are the transcripts and summaries?",
    answer:
      "Transcripts average 98% accuracy across 40+ languages, including accents and technical jargon. Summaries link back to the exact moment in the transcript, so you can verify anything in one click.",
  },
  {
    category: "Privacy & security",
    question: "Is my meeting data private and secure?",
    answer:
      "Everything is encrypted in transit and at rest, and your recordings are never used to train models. Business plans add SSO, audit logs, redaction and a choice of data region.",
  },
  {
    category: "Billing",
    question: "Can I change plans or the number of seats later?",
    answer:
      "Yes. Add or remove seats whenever your team changes and we prorate the difference. Switching between monthly and yearly billing is one click, and yearly saves 20%.",
  },
  {
    category: "Integrations",
    question: "Where can I send my notes?",
    answer:
      "Share recaps to Slack or email, push action items to your task tracker, and sync summaries to your CRM. Everything is also searchable and available to the in-app AI assistant.",
  },
];

const ITEMS = FAQ_ITEMS.slice(0, COPY.length).map((item, i) => ({
  ...item,
  id: `faq-${i}`,
  ...COPY[i],
}));

export function Faq() {
  return (
    <FAQSection
      id="faq"
      eyebrow="Common questions"
      title="Answers before you ask"
      description="Everything you need to know about recording, privacy, billing and integrations."
      items={ITEMS}
      defaultActiveId="faq-0"
    />
  );
}
