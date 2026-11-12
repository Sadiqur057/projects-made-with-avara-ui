"use client";

import { useState } from "react";
import { Clock, ListChecks, Sparkles } from "lucide-react";
import { QuizFlow } from "@/components/store/quiz/quiz-flow";
import { QuizResults } from "@/components/store/quiz/quiz-results";
import type { QuizAnswers } from "@/lib/quiz";
import { actions, useHydrated, useStore } from "@/lib/store";

export function QuizClient() {
  const { quiz } = useStore();
  const hydrated = useHydrated();
  const [started, setStarted] = useState(false);
  const [retaking, setRetaking] = useState(false);

  const complete = (answers: QuizAnswers) => {
    actions.saveQuiz(answers);
    setRetaking(false);
    setStarted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showResults = hydrated && quiz && !retaking;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      {!hydrated ? (
        <div className="h-96 animate-pulse rounded-3xl bg-muted motion-reduce:animate-none" aria-busy="true" aria-label="Loading quiz" />
      ) : showResults ? (
        <QuizResults
          answers={quiz}
          onRetake={() => {
            setRetaking(true);
            setStarted(true);
          }}
        />
      ) : started ? (
        <div>
          <h1 className="sr-only">Skin-type quiz</h1>
          <QuizFlow onComplete={complete} />
        </div>
      ) : (
        <section className="grid items-center gap-10 rounded-3xl bg-secondary p-6 sm:p-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Skin-type quiz</p>
            <h1 className="mt-2 font-display text-4xl font-medium leading-[1.05] tracking-tight sm:text-6xl">
              Find the routine that fits your skin
            </h1>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-foreground/80">
              Five quick questions about how your skin feels and what you&apos;d like to change. We&apos;ll build a
              routine from our range, with a reason for every pick.
            </p>
            <button
              type="button"
              onClick={() => setStarted(true)}
              className="mt-8 inline-flex h-13 items-center rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground hover:opacity-90"
            >
              Start the quiz
            </button>
          </div>
          <ul className="grid gap-4">
            {[
              { icon: Clock, title: "Two minutes", text: "Five questions, no sign-up needed." },
              { icon: ListChecks, title: "A real routine", text: "Morning, evening and weekly steps, in order." },
              { icon: Sparkles, title: "Reasons, not guesses", text: "See exactly why each product made the list." },
            ].map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4 rounded-2xl bg-card p-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="text-sm text-muted-foreground">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
