import type { Metadata } from "next";
import { QuizClient } from "@/components/store/quiz/quiz-client";

export const metadata: Metadata = {
  title: "Skin-type quiz",
  description: "Answer five questions and get a personalised skincare routine for your skin type and concerns.",
};

export default function QuizPage() {
  return <QuizClient />;
}
