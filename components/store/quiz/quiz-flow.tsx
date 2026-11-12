"use client";

import { useId, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  Wizard,
  WizardContainer,
  WizardDescription,
  WizardProgress,
  WizardStep,
  WizardTitle,
} from "@/components/custom/blocks/WizardBlock";
import { useWizard } from "@/components/custom/blocks/wizard-context";
import { CONCERNS, type Concern } from "@/lib/catalog";
import {
  DEFAULT_ANSWERS,
  MAX_CONCERNS,
  ROUTINE_OPTIONS,
  SENSITIVITY_OPTIONS,
  SKIN_FEEL_OPTIONS,
  type QuizAnswers,
  type QuizOption,
} from "@/lib/quiz";
import { cn } from "@/lib/utils";

const optionClass =
  "flex min-h-14 cursor-pointer flex-col justify-center rounded-2xl border bg-card px-4 py-3 transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring";

function Counter() {
  const { currentStep, totalSteps } = useWizard();
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
      Question {Math.min(currentStep + 1, totalSteps || 5)} of {totalSteps || 5}
    </p>
  );
}

function BackButton() {
  const { currentStep, prevStep } = useWizard();
  if (currentStep === 0) return <span />;
  return (
    <button
      type="button"
      onClick={prevStep}
      className="inline-flex h-11 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
    >
      <ArrowLeft className="size-4" aria-hidden="true" />
      Back
    </button>
  );
}

/** Single-choice question that moves on a beat after you pick. */
function ChoiceStep<T extends string>({
  index,
  title,
  description,
  name,
  options,
  value,
  onSelect,
}: {
  index: number;
  title: string;
  description: string;
  name: string;
  options: QuizOption<T>[];
  value: T | null;
  onSelect: (v: T) => void;
}) {
  const { nextStep, currentStep } = useWizard();
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const active = currentStep === index;

  const pick = (v: T) => {
    onSelect(v);
    clearTimeout(timer.current);
    timer.current = setTimeout(nextStep, 320);
  };

  return (
    <WizardStep index={index}>
      <Counter />
      <WizardTitle className="text-2xl sm:text-4xl">{title}</WizardTitle>
      <WizardDescription className="mt-0 text-base sm:text-lg">{description}</WizardDescription>
      <fieldset disabled={!active} className="grid gap-2.5 sm:grid-cols-2">
        <legend className="sr-only">{title}</legend>
        {options.map((o) => (
          <label key={o.value} className="relative">
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => pick(o.value)}
              tabIndex={active ? 0 : -1}
              className="peer sr-only"
            />
            <span className={cn(optionClass, value === o.value ? "border-primary ring-1 ring-primary" : "border-border hover:bg-muted/60")}>
              <span className="font-semibold text-foreground">{o.label}</span>
              <span className="text-sm text-muted-foreground">{o.hint}</span>
            </span>
          </label>
        ))}
      </fieldset>
      <div className="flex items-center justify-between">
        <BackButton />
      </div>
    </WizardStep>
  );
}

function ConcernStep({
  index,
  value,
  onChange,
}: {
  index: number;
  value: Concern[];
  onChange: (v: Concern[]) => void;
}) {
  const { nextStep, currentStep } = useWizard();
  const active = currentStep === index;
  const full = value.length >= MAX_CONCERNS;

  const toggle = (c: Concern, on: boolean) => {
    if (on) {
      if (!full) onChange([...value, c]);
    } else {
      onChange(value.filter((v) => v !== c));
    }
  };

  return (
    <WizardStep index={index}>
      <Counter />
      <WizardTitle className="text-2xl sm:text-4xl">What would you most like to improve?</WizardTitle>
      <WizardDescription className="mt-0 text-base sm:text-lg">
        Choose up to {MAX_CONCERNS}. {value.length}/{MAX_CONCERNS} selected.
      </WizardDescription>
      <fieldset disabled={!active} className="flex flex-wrap gap-2.5">
        <legend className="sr-only">Concerns</legend>
        {CONCERNS.map((c) => {
          const checked = value.includes(c.id);
          const blocked = full && !checked;
          return (
            <label key={c.id} className={cn("relative", blocked && "opacity-50")}>
              <input
                type="checkbox"
                checked={checked}
                disabled={blocked}
                onChange={(e) => toggle(c.id, e.target.checked)}
                tabIndex={active ? 0 : -1}
                className="peer sr-only"
              />
              <span
                className={cn(
                  "inline-flex cursor-pointer items-center rounded-full border px-4 py-2.5 text-sm font-medium transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring",
                  checked ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-muted",
                  blocked && "cursor-not-allowed",
                )}
              >
                {c.name}
              </span>
            </label>
          );
        })}
      </fieldset>
      <div className="flex items-center justify-between">
        <BackButton />
        <button
          type="button"
          onClick={nextStep}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          {value.length === 0 ? "Skip" : "Continue"}
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    </WizardStep>
  );
}

function FragranceStep({
  index,
  value,
  onChange,
}: {
  index: number;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  const { nextStep, currentStep } = useWizard();
  const active = currentStep === index;
  const name = useId();
  const opts = [
    { v: false, label: "No preference", hint: "Show me everything that fits" },
    { v: true, label: "Fragrance-free only", hint: "Skip anything with added scent" },
  ];

  return (
    <WizardStep index={index}>
      <Counter />
      <WizardTitle className="text-2xl sm:text-4xl">Any preferences?</WizardTitle>
      <WizardDescription className="mt-0 text-base sm:text-lg">One last thing before we build your routine.</WizardDescription>
      <fieldset disabled={!active} className="grid gap-2.5 sm:grid-cols-2">
        <legend className="sr-only">Fragrance preference</legend>
        {opts.map((o) => (
          <label key={String(o.v)} className="relative">
            <input
              type="radio"
              name={name}
              checked={value === o.v}
              onChange={() => onChange(o.v)}
              tabIndex={active ? 0 : -1}
              className="peer sr-only"
            />
            <span className={cn(optionClass, value === o.v ? "border-primary ring-1 ring-primary" : "border-border hover:bg-muted/60")}>
              <span className="font-semibold text-foreground">{o.label}</span>
              <span className="text-sm text-muted-foreground">{o.hint}</span>
            </span>
          </label>
        ))}
      </fieldset>
      <div className="flex items-center justify-between">
        <BackButton />
        <button
          type="button"
          onClick={nextStep}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          See my routine
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    </WizardStep>
  );
}

export function QuizFlow({ onComplete }: { onComplete: (answers: QuizAnswers) => void }) {
  const [answers, setAnswers] = useState<{
    skinType: QuizAnswers["skinType"] | null;
    sensitivity: QuizAnswers["sensitivity"] | null;
    concerns: Concern[];
    routine: QuizAnswers["routine"] | null;
    fragranceFree: boolean;
  }>({ skinType: null, sensitivity: null, concerns: [], routine: null, fragranceFree: false });

  const finish = () =>
    onComplete({
      skinType: answers.skinType ?? DEFAULT_ANSWERS.skinType,
      sensitivity: answers.sensitivity ?? DEFAULT_ANSWERS.sensitivity,
      concerns: answers.concerns,
      routine: answers.routine ?? DEFAULT_ANSWERS.routine,
      fragranceFree: answers.fragranceFree,
    });

  return (
    <Wizard onComplete={finish} className="overflow-hidden rounded-3xl border border-border bg-background">
      <WizardProgress className="h-1.5 bg-muted" />
      <WizardContainer stepCount={5} className="h-[40rem] sm:h-[34rem]">
        <ChoiceStep
          index={0}
          name="skin-feel"
          title="By midday, how does your bare skin feel?"
          description="Think about a day with no makeup or SPF touch-ups."
          options={SKIN_FEEL_OPTIONS}
          value={answers.skinType}
          onSelect={(v) => setAnswers((a) => ({ ...a, skinType: v }))}
        />
        <ChoiceStep
          index={1}
          name="sensitivity"
          title="Does your skin react to new products?"
          description="Stinging, redness or itching all count."
          options={SENSITIVITY_OPTIONS}
          value={answers.sensitivity}
          onSelect={(v) => setAnswers((a) => ({ ...a, sensitivity: v }))}
        />
        <ConcernStep index={2} value={answers.concerns} onChange={(v) => setAnswers((a) => ({ ...a, concerns: v }))} />
        <ChoiceStep
          index={3}
          name="routine"
          title="How much time do you want to spend?"
          description="We'll size the routine to match."
          options={ROUTINE_OPTIONS}
          value={answers.routine}
          onSelect={(v) => setAnswers((a) => ({ ...a, routine: v }))}
        />
        <FragranceStep index={4} value={answers.fragranceFree} onChange={(v) => setAnswers((a) => ({ ...a, fragranceFree: v }))} />
      </WizardContainer>
    </Wizard>
  );
}
