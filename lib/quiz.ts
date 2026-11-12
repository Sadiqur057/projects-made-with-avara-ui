import {
  CONCERN_LABEL,
  PRODUCTS,
  STEP_SINGULAR,
  type Concern,
  type Product,
  type SkinType,
  type Step,
} from "@/lib/catalog";

export type BaseSkinType = Exclude<SkinType, "sensitive">;
export type Sensitivity = "rarely" | "sometimes" | "often";
export type RoutineSize = "minimal" | "regular" | "full";

export interface QuizAnswers {
  skinType: BaseSkinType;
  sensitivity: Sensitivity;
  concerns: Concern[];
  routine: RoutineSize;
  fragranceFree: boolean;
}

export const MAX_CONCERNS = 3;

export interface QuizOption<T extends string> {
  value: T;
  label: string;
  hint: string;
}

export const SKIN_FEEL_OPTIONS: QuizOption<BaseSkinType>[] = [
  { value: "oily", label: "Shiny all over", hint: "Oil on the cheeks, forehead, nose and chin" },
  { value: "combination", label: "Shiny in the T-zone", hint: "Oily forehead, nose and chin; cheeks are fine or dry" },
  { value: "dry", label: "Tight, rough or flaky", hint: "Skin feels thirsty soon after washing" },
  { value: "normal", label: "Comfortable and balanced", hint: "Neither shiny nor tight by midday" },
];

export const SENSITIVITY_OPTIONS: QuizOption<Sensitivity>[] = [
  { value: "rarely", label: "Rarely", hint: "It takes most products in stride" },
  { value: "sometimes", label: "Sometimes", hint: "A little pink or stingy with new actives" },
  { value: "often", label: "Often", hint: "It flushes, stings or itches easily" },
];

export const ROUTINE_OPTIONS: QuizOption<RoutineSize>[] = [
  { value: "minimal", label: "Keep it simple", hint: "3 steps · about 2 minutes" },
  { value: "regular", label: "A solid routine", hint: "4 steps · about 5 minutes" },
  { value: "full", label: "I love a ritual", hint: "6–7 steps · up to 10 minutes" },
];

export const DEFAULT_ANSWERS: QuizAnswers = {
  skinType: "normal",
  sensitivity: "rarely",
  concerns: [],
  routine: "regular",
  fragranceFree: false,
};

const SLOTS: Record<RoutineSize, Step[]> = {
  minimal: ["cleanser", "moisturizer", "sunscreen"],
  regular: ["cleanser", "serum", "moisturizer", "sunscreen"],
  full: ["cleanser", "toner", "serum", "serum", "moisturizer", "sunscreen", "mask"],
};

const list = (items: string[]) =>
  items.length <= 1
    ? (items[0] ?? "")
    : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

interface Scored {
  product: Product;
  score: number;
  reasons: string[];
}

function scoreProduct(p: Product, a: QuizAnswers): Scored | null {
  if (a.fragranceFree && !p.fragranceFree) return null;
  if (a.sensitivity === "often" && !p.gentle) return null;

  let score = 0;
  const reasons: string[] = [];

  if (p.skinTypes.includes(a.skinType)) {
    score += 3;
    reasons.push(`Made for ${a.skinType} skin`);
  } else {
    score -= 2;
  }

  if (a.sensitivity !== "rarely" && p.skinTypes.includes("sensitive")) {
    score += 2;
    reasons.push("Gentle enough for reactive skin");
  }
  if (a.sensitivity === "sometimes" && !p.gentle) score -= 2;

  const matched = p.concerns.filter((c) => a.concerns.includes(c));
  if (matched.length) {
    score += matched.length * 4;
    reasons.push(`Helps with ${list(matched.map((c) => CONCERN_LABEL[c].toLowerCase()))}`);
  }

  if (a.fragranceFree && p.fragranceFree) reasons.push("Fragrance-free");
  if (p.bestseller) score += 0.5;

  return { product: p, score, reasons };
}

export interface RoutinePick {
  slot: string;
  product: Product;
  reasons: string[];
}

export interface Recommendation {
  title: string;
  summary: string;
  picks: RoutinePick[];
  morning: RoutinePick[];
  evening: RoutinePick[];
  weekly: RoutinePick[];
}

export function skinTitle(a: QuizAnswers): string {
  const base = `${a.skinType[0].toUpperCase()}${a.skinType.slice(1)} skin`;
  if (a.sensitivity === "often") return `${base}, sensitive`;
  if (a.sensitivity === "sometimes") return `${base}, easily reactive`;
  return base;
}

export function recommend(a: QuizAnswers): Recommendation {
  const taken = new Set<string>();
  const picks: RoutinePick[] = [];

  for (const step of SLOTS[a.routine]) {
    const candidates = PRODUCTS.map((p) => (p.step === step && !taken.has(p.slug) ? scoreProduct(p, a) : null))
      .filter((s): s is Scored => s !== null && s.score > 0)
      .sort((x, y) => y.score - x.score);
    const best = candidates[0];
    if (!best) continue;
    taken.add(best.product.slug);
    picks.push({
      slot: STEP_SINGULAR[step],
      product: best.product,
      reasons: best.reasons.slice(0, 3),
    });
  }

  // "Full" adds one finishing extra: whichever eye cream or oil suits best.
  if (a.routine === "full") {
    const extra = PRODUCTS.filter((p) => (p.step === "eye" || p.step === "oil") && !taken.has(p.slug))
      .map((p) => scoreProduct(p, a))
      .filter((s): s is Scored => s !== null && s.score > 0)
      .sort((x, y) => y.score - x.score)[0];
    if (extra) {
      picks.push({
        slot: STEP_SINGULAR[extra.product.step],
        product: extra.product,
        reasons: extra.reasons.slice(0, 3),
      });
    }
  }

  const morning = picks.filter((p) => p.product.time === "am" || p.product.time === "both");
  const evening = picks.filter((p) => p.product.time === "pm" || p.product.time === "both");
  const weekly = picks.filter((p) => p.product.time === "weekly");

  const focus = a.concerns.length
    ? ` Your focus: ${list(a.concerns.map((c) => CONCERN_LABEL[c].toLowerCase()))}.`
    : "";
  const reactive =
    a.sensitivity === "rarely"
      ? ""
      : " We kept strong actives out where your skin needs more care.";

  return {
    title: skinTitle(a),
    summary: `Here is a ${a.routine === "minimal" ? "three-step" : a.routine === "regular" ? "four-step" : "full"} routine built for ${skinTitle(a).toLowerCase()}.${focus}${reactive}`,
    picks,
    morning,
    evening,
    weekly,
  };
}
