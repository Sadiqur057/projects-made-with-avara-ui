/**
 * Aurelle catalog. Everything the storefront renders comes from here, so the
 * store can later be pointed at a real API by swapping these exports.
 *
 * Copy avoids medical claims on purpose: products "help visibly reduce",
 * "support" and "soften" — they never "treat" or "cure".
 */

export type SkinType = "oily" | "dry" | "combination" | "normal" | "sensitive";

export type Concern =
  | "acne"
  | "dullness"
  | "dark-spots"
  | "fine-lines"
  | "redness"
  | "dryness"
  | "pores";

export type Step =
  | "cleanser"
  | "toner"
  | "serum"
  | "moisturizer"
  | "sunscreen"
  | "mask"
  | "eye"
  | "oil";

export interface Size {
  id: string;
  label: string;
  price: number;
}

export interface Product {
  slug: string;
  name: string;
  tagline: string;
  step: Step;
  /** When in the routine it is used. */
  time: "am" | "pm" | "both" | "weekly";
  description: string;
  sizes: Size[];
  skinTypes: SkinType[];
  concerns: Concern[];
  /** Safe for reactive skin. Strong actives set this to false. */
  gentle: boolean;
  fragranceFree: boolean;
  bestseller: boolean;
  isNew: boolean;
  tags: string[];
  keyIngredients: string[];
  highlights: string[];
  howToUse: string[];
  inci: string;
  /** Soft background tint, also used behind the product art. */
  tint: string;
  /** Units in stock — drives the low-stock nudge. */
  stock: number;
}

export const STEP_LABEL: Record<Step, string> = {
  cleanser: "Cleansers",
  toner: "Toners & mists",
  serum: "Serums",
  moisturizer: "Moisturizers",
  sunscreen: "Sun care",
  mask: "Masks",
  eye: "Eye care",
  oil: "Face oils",
};

export const STEP_SINGULAR: Record<Step, string> = {
  cleanser: "Cleanse",
  toner: "Tone",
  serum: "Treat",
  moisturizer: "Moisturize",
  sunscreen: "Protect",
  mask: "Reset",
  eye: "Eyes",
  oil: "Seal",
};

export const SKIN_TYPE_LABEL: Record<SkinType, string> = {
  oily: "Oily",
  dry: "Dry",
  combination: "Combination",
  normal: "Normal",
  sensitive: "Sensitive",
};

export interface ConcernInfo {
  id: Concern;
  name: string;
  blurb: string;
}

export const CONCERNS: ConcernInfo[] = [
  { id: "acne", name: "Breakouts", blurb: "Clearer-looking skin, fewer shiny patches" },
  { id: "dullness", name: "Dullness", blurb: "Bring back the lit-from-within look" },
  { id: "dark-spots", name: "Dark spots", blurb: "Even out tone and fade the look of marks" },
  { id: "fine-lines", name: "Fine lines", blurb: "Smoother, bouncier-looking skin" },
  { id: "redness", name: "Redness", blurb: "Calm, comfortable, less reactive" },
  { id: "dryness", name: "Dryness", blurb: "Deep, lasting hydration" },
  { id: "pores", name: "Visible pores", blurb: "A refined, matte-but-not-flat finish" },
];

export const CONCERN_LABEL = Object.fromEntries(
  CONCERNS.map((c) => [c.id, c.name]),
) as Record<Concern, string>;

const sz = (id: string, label: string, price: number): Size => ({ id, label, price });

export const PRODUCTS: Product[] = [
  {
    slug: "cloud-cleanse-gel-cleanser",
    name: "Cloud Cleanse Gel Cleanser",
    tagline: "A soft-foam cleanser that never squeaks",
    step: "cleanser",
    time: "both",
    description:
      "A cushiony gel that lifts sunscreen, sweat and the day without stripping. Oat and panthenol keep skin feeling soft, never tight.",
    sizes: [sz("150", "150 ml", 24), sz("300", "300 ml", 38)],
    skinTypes: ["normal", "combination", "sensitive", "dry"],
    concerns: ["redness", "dryness"],
    gentle: true,
    fragranceFree: true,
    bestseller: false,
    isNew: false,
    tags: ["Fragrance-free", "Vegan"],
    keyIngredients: ["ceramides"],
    highlights: ["pH-balanced at 5.5", "Rinses clean, no residue", "Safe around the eyes"],
    howToUse: [
      "Massage a pea-sized amount onto damp skin for 30 seconds.",
      "Rinse with lukewarm water and pat dry.",
      "Use morning and evening.",
    ],
    inci: "Aqua, Glycerin, Cocamidopropyl Betaine, Avena Sativa Kernel Extract, Panthenol, Ceramide NP, Sodium Lauroyl Glutamate, Citric Acid, Phenoxyethanol",
    tint: "#E8EEE3",
    stock: 120,
  },
  {
    slug: "clear-slate-salicylic-cleanser",
    name: "Clear Slate Salicylic Cleanser",
    tagline: "A daily reset for congested skin",
    step: "cleanser",
    time: "pm",
    description:
      "A 0.5% salicylic acid cleanser that clears away oil and buildup inside the pore, so skin looks smoother and feels fresh, not stripped.",
    sizes: [sz("150", "150 ml", 22), sz("300", "300 ml", 34)],
    skinTypes: ["oily", "combination"],
    concerns: ["acne", "pores"],
    gentle: false,
    fragranceFree: true,
    bestseller: false,
    isNew: false,
    tags: ["Fragrance-free", "0.5% BHA"],
    keyIngredients: ["salicylic-acid"],
    highlights: ["0.5% salicylic acid", "Oil-clearing without tightness", "Works in under a minute"],
    howToUse: [
      "Massage onto damp skin, avoiding the eye area.",
      "Leave on for 30 seconds, then rinse.",
      "Start every other evening, then build to daily.",
    ],
    inci: "Aqua, Sodium Cocoyl Isethionate, Glycerin, Salicylic Acid, Zinc PCA, Willow Bark Extract, Panthenol, Sodium Hydroxide, Phenoxyethanol",
    tint: "#DDE7E3",
    stock: 95,
  },
  {
    slug: "milk-bath-cream-cleanser",
    name: "Milk Bath Cream Cleanser",
    tagline: "Cleansing that feels like a moisturizer",
    step: "cleanser",
    time: "both",
    description:
      "A lotion-to-milk cleanser with squalane and oat that melts away makeup and leaves dry or reactive skin cushioned and calm.",
    sizes: [sz("150", "150 ml", 26)],
    skinTypes: ["dry", "sensitive", "normal"],
    concerns: ["dryness", "redness"],
    gentle: true,
    fragranceFree: true,
    bestseller: false,
    isNew: false,
    tags: ["Fragrance-free", "Vegan"],
    keyIngredients: ["ceramides"],
    highlights: ["Removes makeup and SPF", "Leaves a soft, cushioned finish", "No foaming agents"],
    howToUse: [
      "Massage onto dry or damp skin.",
      "Rinse, or wipe off with a warm damp cloth.",
      "Use morning and evening.",
    ],
    inci: "Aqua, Squalane, Glycerin, Cetearyl Alcohol, Avena Sativa Kernel Extract, Ceramide NP, Panthenol, Xanthan Gum, Phenoxyethanol",
    tint: "#F3E6DA",
    stock: 80,
  },
  {
    slug: "rosewater-barrier-mist",
    name: "Rosewater Barrier Mist",
    tagline: "A cooling mist for skin that runs warm",
    step: "toner",
    time: "both",
    description:
      "Rose water, glycerin and a touch of hyaluronic acid in a fine, even mist. Refresh over makeup or prep skin before serums.",
    sizes: [sz("100", "100 ml", 20)],
    skinTypes: ["dry", "sensitive", "normal", "combination"],
    concerns: ["dryness", "redness"],
    gentle: true,
    fragranceFree: false,
    bestseller: false,
    isNew: false,
    tags: ["Vegan"],
    keyIngredients: ["hyaluronic-acid"],
    highlights: ["Ultra-fine mist", "Fine for over makeup", "Pocket-sized glass bottle"],
    howToUse: [
      "Hold 20 cm from clean skin and mist once or twice.",
      "Press in with your palms, then layer your serum.",
      "Re-apply through the day as needed.",
    ],
    inci: "Rosa Damascena Flower Water, Glycerin, Sodium Hyaluronate, Panthenol, Betaine, Sodium PCA, Phenoxyethanol, Ethylhexylglycerin",
    tint: "#F4DFDC",
    stock: 150,
  },
  {
    slug: "glow-reset-aha-bha-toner",
    name: "Glow Reset AHA/BHA Toner",
    tagline: "Gentle exfoliation in a swipe",
    step: "toner",
    time: "pm",
    description:
      "Lactic and salicylic acids smooth the surface and refine the look of pores. Skin looks brighter and feels even, with no scrubbing.",
    sizes: [sz("150", "150 ml", 28)],
    skinTypes: ["oily", "combination", "normal"],
    concerns: ["dullness", "pores", "acne"],
    gentle: false,
    fragranceFree: true,
    bestseller: false,
    isNew: false,
    tags: ["Fragrance-free", "AHA + BHA"],
    keyIngredients: ["salicylic-acid"],
    highlights: ["Lactic + salicylic acid", "Visibly smoother in a week", "Alcohol-free"],
    howToUse: [
      "After cleansing, sweep over face with a cotton pad.",
      "Use two to three evenings a week.",
      "Always follow with SPF in the morning.",
    ],
    inci: "Aqua, Glycerin, Lactic Acid, Salicylic Acid, Niacinamide, Aloe Barbadensis Leaf Juice, Panthenol, Sodium Hydroxide, Phenoxyethanol",
    tint: "#F5E9C9",
    stock: 70,
  },
  {
    slug: "dew-drop-hyaluronic-serum",
    name: "Dew Drop Hyaluronic Serum",
    tagline: "Three weights of hydration, one drop",
    step: "serum",
    time: "both",
    description:
      "Low, medium and high molecular weight hyaluronic acid layer hydration through the surface and below it. Skin looks plumped, bouncy and fresh.",
    sizes: [sz("15", "15 ml", 38), sz("30", "30 ml", 62)],
    skinTypes: ["dry", "normal", "combination", "sensitive", "oily"],
    concerns: ["dryness", "fine-lines"],
    gentle: true,
    fragranceFree: true,
    bestseller: true,
    isNew: false,
    tags: ["Fragrance-free", "Vegan", "Bestseller"],
    keyIngredients: ["hyaluronic-acid", "ceramides"],
    highlights: ["3 molecular weights of HA", "Non-sticky, fast-absorbing", "Layers under everything"],
    howToUse: [
      "Apply 3–4 drops to damp skin, morning and evening.",
      "Press in gently, then seal with moisturizer.",
      "Safe to pair with any other active.",
    ],
    inci: "Aqua, Glycerin, Sodium Hyaluronate, Hydrolyzed Sodium Hyaluronate, Sodium Hyaluronate Crosspolymer, Panthenol, Ceramide NP, Betaine, Phenoxyethanol",
    tint: "#DCE6EF",
    stock: 64,
  },
  {
    slug: "bright-side-vitamin-c-serum",
    name: "Bright Side Vitamin C Serum",
    tagline: "15% vitamin C for a lit-from-within look",
    step: "serum",
    time: "am",
    description:
      "A stable 15% ascorbic acid blend with vitamin E and ferulic acid. Used daily, skin looks brighter, more even and better protected against everyday environmental stress.",
    sizes: [sz("15", "15 ml", 44), sz("30", "30 ml", 74)],
    skinTypes: ["normal", "combination", "oily", "dry"],
    concerns: ["dullness", "dark-spots"],
    gentle: false,
    fragranceFree: true,
    bestseller: true,
    isNew: false,
    tags: ["Fragrance-free", "Vegan", "Bestseller"],
    keyIngredients: ["vitamin-c"],
    highlights: ["15% L-ascorbic acid", "With vitamin E + ferulic acid", "Airless pump keeps it fresh"],
    howToUse: [
      "Apply 2–3 drops to clean, dry skin each morning.",
      "Follow with moisturizer and SPF.",
      "If skin tingles, start every other day.",
    ],
    inci: "Aqua, L-Ascorbic Acid, Propanediol, Glycerin, Tocopherol, Ferulic Acid, Sodium Hyaluronate, Panthenol, Phenoxyethanol",
    tint: "#F8E4BF",
    stock: 38,
  },
  {
    slug: "clear-skin-niacinamide-zinc",
    name: "Clear Skin Niacinamide + Zinc",
    tagline: "10% niacinamide for balanced, refined skin",
    step: "serum",
    time: "both",
    description:
      "10% niacinamide with 1% zinc PCA helps balance oil, soften the look of pores and calm the look of blotchy tone, without heaviness.",
    sizes: [sz("30", "30 ml", 32)],
    skinTypes: ["oily", "combination", "normal"],
    concerns: ["pores", "acne", "redness"],
    gentle: true,
    fragranceFree: true,
    bestseller: true,
    isNew: false,
    tags: ["Fragrance-free", "Vegan", "Bestseller"],
    keyIngredients: ["niacinamide"],
    highlights: ["10% niacinamide + 1% zinc", "Lightweight and clear", "Mattifying without drying"],
    howToUse: [
      "Apply 3–4 drops over the whole face, morning and evening.",
      "Layer under moisturizer.",
      "Combine freely with vitamin C or retinol.",
    ],
    inci: "Aqua, Niacinamide, Propanediol, Zinc PCA, Glycerin, Sodium Hyaluronate, Panthenol, Phenoxyethanol, Ethylhexylglycerin",
    tint: "#E3E8D5",
    stock: 110,
  },
  {
    slug: "night-renew-retinol",
    name: "Night Renew Retinol 0.3%",
    tagline: "Retinol that respects your barrier",
    step: "serum",
    time: "pm",
    description:
      "Encapsulated retinol in a squalane base for a gentler ramp-up. Over weeks, skin looks smoother, firmer and more even.",
    sizes: [sz("30", "30 ml", 48)],
    skinTypes: ["normal", "dry", "combination"],
    concerns: ["fine-lines", "dark-spots", "dullness"],
    gentle: false,
    fragranceFree: true,
    bestseller: false,
    isNew: false,
    tags: ["Fragrance-free", "Evening only"],
    keyIngredients: ["retinol", "ceramides"],
    highlights: ["0.3% encapsulated retinol", "Squalane + ceramide cushion", "Beginner-friendly strength"],
    howToUse: [
      "Use 2 evenings a week for 2 weeks, then every other night.",
      "Apply a pea-sized amount to clean, dry skin.",
      "Always wear SPF the next morning. Not for use while pregnant.",
    ],
    inci: "Squalane, Aqua, Caprylic/Capric Triglyceride, Retinol, Ceramide NP, Tocopherol, Bisabolol, Cetearyl Alcohol, Phenoxyethanol",
    tint: "#EBD7C5",
    stock: 52,
  },
  {
    slug: "calm-down-centella-serum",
    name: "Calm Down Centella Serum",
    tagline: "Instant comfort for stressed skin",
    step: "serum",
    time: "both",
    description:
      "Centella asiatica, panthenol and allantoin soothe the look of redness and help skin recover from sun, shaving or an over-enthusiastic routine.",
    sizes: [sz("30", "30 ml", 36)],
    skinTypes: ["sensitive", "dry", "normal", "combination"],
    concerns: ["redness", "dryness"],
    gentle: true,
    fragranceFree: true,
    bestseller: false,
    isNew: false,
    tags: ["Fragrance-free", "Vegan"],
    keyIngredients: ["centella"],
    highlights: ["Centella + madecassoside", "Visibly calms in minutes", "Safe for daily use"],
    howToUse: [
      "Smooth 3–4 drops over clean skin, morning and evening.",
      "Pat in and follow with moisturizer.",
      "Use anytime skin feels warm or tight.",
    ],
    inci: "Aqua, Centella Asiatica Extract, Madecassoside, Glycerin, Panthenol, Allantoin, Sodium Hyaluronate, Betaine, Phenoxyethanol",
    tint: "#DDEBD9",
    stock: 88,
  },
  {
    slug: "weightless-water-gel",
    name: "Weightless Water Gel",
    tagline: "Moisture that feels like nothing",
    step: "moisturizer",
    time: "both",
    description:
      "An oil-free gel-cream that drinks into skin in seconds. Hydrates, sits well under SPF and makeup, and never feels greasy.",
    sizes: [sz("50", "50 ml", 34), sz("100", "100 ml", 56)],
    skinTypes: ["oily", "combination", "normal"],
    concerns: ["pores", "dryness", "acne"],
    gentle: true,
    fragranceFree: true,
    bestseller: false,
    isNew: false,
    tags: ["Fragrance-free", "Oil-free"],
    keyIngredients: ["hyaluronic-acid", "niacinamide"],
    highlights: ["Oil-free hydration", "Sinks in within 20 seconds", "Great under makeup"],
    howToUse: [
      "Smooth over face and neck after serum.",
      "Use morning and evening.",
      "Layer a second pass on dry patches.",
    ],
    inci: "Aqua, Glycerin, Dimethicone, Niacinamide, Sodium Hyaluronate, Squalane, Panthenol, Carbomer, Phenoxyethanol",
    tint: "#DCEBEF",
    stock: 140,
  },
  {
    slug: "barrier-butter-ceramide-cream",
    name: "Barrier Butter Ceramide Cream",
    tagline: "A rich cushion for a compromised barrier",
    step: "moisturizer",
    time: "both",
    description:
      "Three ceramides, cholesterol and shea support the skin's own barrier. Dry, tight, flaky skin feels comfortable again, and stays that way.",
    sizes: [sz("50", "50 ml", 42), sz("100", "100 ml", 68)],
    skinTypes: ["dry", "sensitive", "normal"],
    concerns: ["dryness", "redness"],
    gentle: true,
    fragranceFree: true,
    bestseller: true,
    isNew: false,
    tags: ["Fragrance-free", "Vegan", "Bestseller"],
    keyIngredients: ["ceramides"],
    highlights: ["3 ceramides + cholesterol", "24-hour moisture", "Cushiony, not greasy"],
    howToUse: [
      "Warm a nickel-sized amount between palms.",
      "Press onto face and neck, morning and evening.",
      "Use as a night mask over dry patches.",
    ],
    inci: "Aqua, Butyrospermum Parkii Butter, Glycerin, Squalane, Ceramide NP, Ceramide AP, Ceramide EOP, Cholesterol, Cetearyl Alcohol, Panthenol, Phenoxyethanol",
    tint: "#F1E1D3",
    stock: 76,
  },
  {
    slug: "everyday-peptide-cream",
    name: "Everyday Peptide Cream",
    tagline: "A smoothing day cream with staying power",
    step: "moisturizer",
    time: "both",
    description:
      "A silky cream with a peptide complex and hyaluronic acid. Skin looks bouncier and feels supple from morning to night.",
    sizes: [sz("50", "50 ml", 46)],
    skinTypes: ["normal", "combination", "dry"],
    concerns: ["fine-lines", "dullness", "dryness"],
    gentle: true,
    fragranceFree: true,
    bestseller: false,
    isNew: false,
    tags: ["Fragrance-free", "Vegan"],
    keyIngredients: ["hyaluronic-acid"],
    highlights: ["Peptide complex", "Silky, balanced finish", "Plays well with actives"],
    howToUse: [
      "Apply to face and neck after serum.",
      "Use morning and evening.",
      "Follow with SPF in the daytime.",
    ],
    inci: "Aqua, Glycerin, Caprylic/Capric Triglyceride, Palmitoyl Tripeptide-1, Palmitoyl Tetrapeptide-7, Sodium Hyaluronate, Squalane, Cetearyl Alcohol, Phenoxyethanol",
    tint: "#EBDDE8",
    stock: 66,
  },
  {
    slug: "invisible-shield-spf-50",
    name: "Invisible Shield SPF 50",
    tagline: "Broad-spectrum protection with no white cast",
    step: "sunscreen",
    time: "am",
    description:
      "A weightless chemical-filter fluid with broad-spectrum SPF 50 PA++++. It wears like a primer, layers under makeup and keeps skin protected from the UV that dulls and darkens it.",
    sizes: [sz("50", "50 ml", 30)],
    skinTypes: ["oily", "combination", "normal", "dry"],
    concerns: ["dark-spots", "fine-lines", "dullness"],
    gentle: true,
    fragranceFree: true,
    bestseller: true,
    isNew: false,
    tags: ["Fragrance-free", "SPF 50", "Bestseller"],
    keyIngredients: ["niacinamide"],
    highlights: ["SPF 50 PA++++", "No white cast, any skin tone", "Water-resistant for 40 min"],
    howToUse: [
      "Apply two finger-lengths as the last step of your morning routine.",
      "Re-apply every two hours in direct sun.",
      "Use daily, including on cloudy days.",
    ],
    inci: "Aqua, Homosalate, Ethylhexyl Salicylate, Butyl Methoxydibenzoylmethane, Niacinamide, Glycerin, Tocopherol, Sodium Hyaluronate, Phenoxyethanol",
    tint: "#F8EBC8",
    stock: 180,
  },
  {
    slug: "mineral-veil-spf-40",
    name: "Mineral Veil SPF 40",
    tagline: "Gentle zinc sunscreen with a sheer tint",
    step: "sunscreen",
    time: "am",
    description:
      "A sheer-tinted zinc oxide sunscreen that evens out tone, blends clear on deeper skin and sits comfortably on reactive, easily-flushed complexions.",
    sizes: [sz("50", "50 ml", 34)],
    skinTypes: ["sensitive", "dry", "normal", "combination"],
    concerns: ["redness", "dark-spots"],
    gentle: true,
    fragranceFree: true,
    bestseller: false,
    isNew: false,
    tags: ["Fragrance-free", "SPF 40", "Mineral"],
    keyIngredients: ["centella"],
    highlights: ["Non-nano zinc oxide", "Sheer universal tint", "Soothing centella"],
    howToUse: [
      "Shake well. Apply generously as the last morning step.",
      "Re-apply every two hours outdoors.",
      "Blend well, a little goes a long way.",
    ],
    inci: "Zinc Oxide, Caprylic/Capric Triglyceride, Aqua, Centella Asiatica Extract, Glycerin, Iron Oxides, Tocopherol, Polyglyceryl-3 Polyricinoleate",
    tint: "#EFE3D6",
    stock: 90,
  },
  {
    slug: "glow-reset-enzyme-mask",
    name: "Glow Reset Enzyme Mask",
    tagline: "A ten-minute facial in a jar",
    step: "mask",
    time: "weekly",
    description:
      "Papaya and pumpkin enzymes dissolve dull surface cells, while honey and hyaluronic acid leave skin plump and radiant. A weekly ritual for a fresher face.",
    sizes: [sz("75", "75 ml", 36)],
    skinTypes: ["normal", "dry", "combination"],
    concerns: ["dullness", "dryness"],
    gentle: true,
    fragranceFree: false,
    bestseller: false,
    isNew: true,
    tags: ["New", "Weekly treat"],
    keyIngredients: ["hyaluronic-acid"],
    highlights: ["Papaya + pumpkin enzymes", "Honey-soft, never gritty", "Ten minutes, once a week"],
    howToUse: [
      "Apply a thin layer to clean, dry skin.",
      "Leave for 10 minutes, then rinse with warm water.",
      "Use once or twice a week.",
    ],
    inci: "Aqua, Glycerin, Carica Papaya Fruit Extract, Cucurbita Pepo Fruit Extract, Mel, Sodium Hyaluronate, Kaolin, Parfum, Phenoxyethanol",
    tint: "#F6DDD9",
    stock: 58,
  },
  {
    slug: "midnight-squalane-oil",
    name: "Midnight Squalane Face Oil",
    tagline: "A final seal for dry nights",
    step: "oil",
    time: "pm",
    description:
      "Squalane, jojoba and rosehip in a light, fast-absorbing oil. A few drops at night lock in moisture and leave skin soft by morning.",
    sizes: [sz("30", "30 ml", 40)],
    skinTypes: ["dry", "normal"],
    concerns: ["dryness", "fine-lines"],
    gentle: true,
    fragranceFree: false,
    bestseller: false,
    isNew: false,
    tags: ["Vegan"],
    keyIngredients: ["ceramides"],
    highlights: ["Squalane + jojoba + rosehip", "Lightweight, non-greasy", "Seals in serum and cream"],
    howToUse: [
      "Warm 2–3 drops between palms.",
      "Press over moisturizer as the last evening step.",
      "Mix a drop into your cream for extra cushion.",
    ],
    inci: "Squalane, Simmondsia Chinensis Seed Oil, Rosa Canina Fruit Oil, Tocopherol, Bisabolol, Parfum, Limonene",
    tint: "#E4D9CC",
    stock: 72,
  },
  {
    slug: "bright-eyes-caffeine-eye-cream",
    name: "Bright Eyes Caffeine Eye Cream",
    tagline: "Rested-looking eyes, even on early mornings",
    step: "eye",
    time: "both",
    description:
      "Caffeine, peptides and a touch of vitamin K in a cooling cream. Helps the look of puffiness, tired shadows and fine lines around the eyes.",
    sizes: [sz("15", "15 ml", 34)],
    skinTypes: ["normal", "dry", "combination", "oily", "sensitive"],
    concerns: ["fine-lines", "dullness"],
    gentle: true,
    fragranceFree: true,
    bestseller: false,
    isNew: true,
    tags: ["New", "Fragrance-free"],
    keyIngredients: ["hyaluronic-acid"],
    highlights: ["Caffeine + peptides", "Cooling metal applicator", "Ophthalmologist-friendly formula"],
    howToUse: [
      "Dab a rice-grain amount under each eye with your ring finger.",
      "Pat gently along the orbital bone.",
      "Use morning and evening.",
    ],
    inci: "Aqua, Glycerin, Caffeine, Palmitoyl Tripeptide-1, Phytonadione, Sodium Hyaluronate, Squalane, Cetearyl Alcohol, Phenoxyethanol",
    tint: "#E7E1EF",
    stock: 84,
  },
];

export const PRODUCT_BY_SLUG: Record<string, Product> = Object.fromEntries(
  PRODUCTS.map((p) => [p.slug, p]),
);

export function getProduct(slug: string): Product | undefined {
  return PRODUCT_BY_SLUG[slug];
}

/** Four views per product: pack shot, texture, ritual, detail. */
export function productImages(slug: string): string[] {
  return [1, 2, 3, 4].map((i) => `/products/${slug}-${i}.svg`);
}

export function productImage(slug: string, view = 1): string {
  return `/products/${slug}-${view}.svg`;
}

export const FEATURED_SLUG = "bright-side-vitamin-c-serum";

/** The flash sale: which products, how deep, and how many are left. */
export const FLASH_SALE = {
  discount: 0.25,
  items: [
    { slug: "dew-drop-hyaluronic-serum", claimed: 0.72 },
    { slug: "glow-reset-enzyme-mask", claimed: 0.58 },
    { slug: "everyday-peptide-cream", claimed: 0.41 },
    { slug: "bright-eyes-caffeine-eye-cream", claimed: 0.83 },
  ],
} as const;

export function saleDiscountFor(slug: string): number {
  return FLASH_SALE.items.some((i) => i.slug === slug) ? FLASH_SALE.discount : 0;
}

/* ───────────────────────── ingredients ───────────────────────── */

export interface Ingredient {
  id: string;
  name: string;
  tagline: string;
  /** Plain-English: what it does. */
  does: string;
  bestFor: string[];
  strength: string;
  pairsWith: string;
  careWith: string;
}

export const INGREDIENTS: Ingredient[] = [
  {
    id: "hyaluronic-acid",
    name: "Hyaluronic acid",
    tagline: "The hydration magnet",
    does: "Holds up to 1,000 times its weight in water. We use three molecular weights so hydration sits on the surface and just beneath it.",
    bestFor: ["Dryness", "Dehydrated oily skin", "Fine lines"],
    strength: "Gentle · every day",
    pairsWith: "Everything. It is the friendliest ingredient in the routine.",
    careWith: "Apply to damp skin and seal with moisturizer so it has water to hold.",
  },
  {
    id: "niacinamide",
    name: "Niacinamide",
    tagline: "The great balancer",
    does: "A form of vitamin B3 that helps regulate oil, refine the look of pores and even out tone, while supporting a stronger barrier.",
    bestFor: ["Visible pores", "Breakouts", "Redness"],
    strength: "Gentle · every day",
    pairsWith: "Vitamin C, retinol, hyaluronic acid.",
    careWith: "Above 10% can cause flushing on very reactive skin. Patch test first.",
  },
  {
    id: "vitamin-c",
    name: "Vitamin C",
    tagline: "The brightener",
    does: "L-ascorbic acid is a potent antioxidant. It helps neutralise daily environmental stress and fades the look of dark marks for a clearer glow.",
    bestFor: ["Dullness", "Dark spots", "Uneven tone"],
    strength: "Active · mornings",
    pairsWith: "Vitamin E, ferulic acid, SPF.",
    careWith: "Can tingle at first. Start every other day if skin is sensitive.",
  },
  {
    id: "retinol",
    name: "Retinol",
    tagline: "The renewer",
    does: "A vitamin A derivative that encourages skin to turn over more smoothly, softening the look of fine lines and texture over time.",
    bestFor: ["Fine lines", "Dark spots", "Texture"],
    strength: "Strong · evenings only",
    pairsWith: "Hyaluronic acid, ceramides, niacinamide.",
    careWith: "Build up slowly, wear SPF daily and skip during pregnancy.",
  },
  {
    id: "ceramides",
    name: "Ceramides",
    tagline: "The barrier builders",
    does: "Lipids that make up about half of your skin barrier. Replenishing them locks in water and keeps irritants out.",
    bestFor: ["Dryness", "Redness", "Reactive skin"],
    strength: "Gentle · every day",
    pairsWith: "Cholesterol, fatty acids, any active.",
    careWith: "Nothing to worry about, it is a repair ingredient.",
  },
  {
    id: "centella",
    name: "Centella asiatica",
    tagline: "The calm-down",
    does: "A botanical rich in madecassoside that soothes the look of redness and helps skin feel comfortable again after stress.",
    bestFor: ["Redness", "Sensitivity", "Post-sun skin"],
    strength: "Gentle · every day",
    pairsWith: "Hyaluronic acid, ceramides, niacinamide.",
    careWith: "Generally well tolerated. Patch test if you are allergic to related plants.",
  },
  {
    id: "salicylic-acid",
    name: "Salicylic acid",
    tagline: "The pore clearer",
    does: "An oil-soluble BHA that gets inside the pore to dissolve buildup, so skin looks clearer and smoother.",
    bestFor: ["Breakouts", "Visible pores", "Oily skin"],
    strength: "Active · few times a week",
    pairsWith: "Niacinamide, hyaluronic acid, SPF.",
    careWith: "Avoid stacking with other strong exfoliants. Can dry out already-dry skin.",
  },
];

export const INGREDIENT_BY_ID: Record<string, Ingredient> = Object.fromEntries(
  INGREDIENTS.map((i) => [i.id, i]),
);

export function productsWithIngredient(id: string): Product[] {
  return PRODUCTS.filter((p) => p.keyIngredients.includes(id));
}

/* ───────────────────────── seed reviews ───────────────────────── */

export interface Review {
  id: string;
  productSlug: string;
  name: string;
  skin: string;
  rating: number;
  title: string;
  body: string;
  /** ISO date */
  date: string;
  /** Written by a visitor on this device. */
  mine?: boolean;
}

type SeedRow = [slug: string, name: string, skin: string, rating: number, title: string, body: string, date: string];

const SEED: SeedRow[] = [
  ["dew-drop-hyaluronic-serum", "Maya R.", "Dry skin", 5, "My skin finally holds water", "Three weeks in and the flaky patches around my nose are gone. It absorbs fast and my moisturizer sits better on top.", "2026-09-14"],
  ["dew-drop-hyaluronic-serum", "Priya S.", "Combination skin", 5, "Not sticky at all", "I was nervous about a hyaluronic serum feeling tacky, but this disappears into damp skin. Makeup looks smoother over it.", "2026-10-02"],
  ["dew-drop-hyaluronic-serum", "Jordan T.", "Sensitive skin", 4, "Gentle and effective", "No stinging whatsoever, which is rare for me. Wish the 30 ml came with a pump, but the dropper is fine.", "2026-08-21"],
  ["dew-drop-hyaluronic-serum", "Elena V.", "Oily skin", 5, "Dehydrated, not dry", "Turns out my oily skin was just thirsty. Shine is down and I'm breaking out less.", "2026-10-19"],
  ["bright-side-vitamin-c-serum", "Aisha K.", "Normal skin", 5, "Visible glow in two weeks", "My post-acne marks look softer and my skin looks awake. Smells like nothing, which I love.", "2026-10-08"],
  ["bright-side-vitamin-c-serum", "Chris L.", "Combination skin", 4, "Tingles a bit at first", "Started every other day like the instructions said and now I use it daily. Skin tone is more even.", "2026-09-27"],
  ["bright-side-vitamin-c-serum", "Noor H.", "Dry skin", 5, "Pairs nicely with SPF", "Layered under Invisible Shield it makes my morning routine feel complete. Dull winter skin looks brighter.", "2026-11-01"],
  ["bright-side-vitamin-c-serum", "Sam P.", "Oily skin", 5, "Better than the big-name one", "Half the price of my old serum and it doesn't oxidise orange by week three. Repurchasing.", "2026-08-30"],
  ["clear-skin-niacinamide-zinc", "Tessa W.", "Oily skin", 5, "Pores look smaller", "Obvious difference in my T-zone after a month. It balances shine through the day.", "2026-10-11"],
  ["clear-skin-niacinamide-zinc", "Ravi M.", "Combination skin", 4, "Great for the price", "Calmed down my redness and the occasional breakout. A little goes a long way.", "2026-09-05"],
  ["clear-skin-niacinamide-zinc", "Lena B.", "Normal skin", 5, "Even tone", "My cheeks look less blotchy. Layers perfectly with vitamin C.", "2026-10-25"],
  ["barrier-butter-ceramide-cream", "Hana O.", "Dry skin", 5, "Winter essential", "My skin was peeling after retinol. This repaired it in a week. Thick but not greasy.", "2026-10-29"],
  ["barrier-butter-ceramide-cream", "Marcus D.", "Sensitive skin", 5, "No more tightness", "I've tried a dozen creams and this is the first that doesn't sting. Comfortable all day.", "2026-09-18"],
  ["barrier-butter-ceramide-cream", "Ines F.", "Dry skin", 4, "Rich and worth it", "A tad heavy for summer, but at night it's perfect. The jar lasts ages.", "2026-08-12"],
  ["invisible-shield-spf-50", "Dee A.", "Combination skin", 5, "Finally, no white cast", "I have deep skin and most SPFs ghost me. This is truly invisible and does not pill under makeup.", "2026-10-15"],
  ["invisible-shield-spf-50", "Oliver N.", "Oily skin", 5, "Wears like a primer", "Light, not greasy, no sting in my eyes when I sweat. Daily staple now.", "2026-09-22"],
  ["invisible-shield-spf-50", "Zara Q.", "Normal skin", 4, "Easy to reapply", "Nice finish, easy to top up. I use it on my neck and ears too.", "2026-10-03"],
  ["invisible-shield-spf-50", "Emi J.", "Dry skin", 5, "My dark spots stopped coming back", "Consistent SPF made more difference than any serum. This one I actually enjoy wearing.", "2026-11-04"],
  ["cloud-cleanse-gel-cleanser", "Grace C.", "Sensitive skin", 5, "Gentle but thorough", "Takes off SPF without leaving that squeaky-clean tightness. Foams softly.", "2026-09-09"],
  ["cloud-cleanse-gel-cleanser", "Andre P.", "Normal skin", 4, "Simple and good", "Does the job. Smells like nothing. Rinses clean.", "2026-10-21"],
  ["clear-slate-salicylic-cleanser", "Mia G.", "Oily skin", 4, "Keeps congestion at bay", "I use it every other night and my blackheads are way down. Don't use it with a strong acid toner.", "2026-09-30"],
  ["clear-slate-salicylic-cleanser", "Kofi A.", "Combination skin", 5, "Clean without tightness", "Never strips. My chin breakouts have calmed down after a month.", "2026-10-17"],
  ["milk-bath-cream-cleanser", "Yuki T.", "Dry skin", 5, "Melts makeup off", "Like a lotion that turns into milk. My skin feels like I've already moisturized.", "2026-09-12"],
  ["milk-bath-cream-cleanser", "Beth S.", "Sensitive skin", 5, "My go-to for flare-ups", "Soothing and plain. Perfect for the days when nothing else feels okay on my face.", "2026-10-06"],
  ["rosewater-barrier-mist", "Carla D.", "Dry skin", 4, "Refreshing at my desk", "Lovely cooling mist, light rose scent that fades. I refill on my commute.", "2026-08-25"],
  ["rosewater-barrier-mist", "Tom H.", "Combination skin", 4, "Nice prep step", "Fine mist, no drips. Serum goes on better after.", "2026-10-14"],
  ["glow-reset-aha-bha-toner", "Fatima R.", "Combination skin", 5, "Smoother in a week", "My texture is so much better and makeup sits flat now. Two nights a week is plenty.", "2026-10-10"],
  ["glow-reset-aha-bha-toner", "Leo W.", "Oily skin", 4, "Works, but go slow", "Introduced it too fast and got a little pink. Once I eased in, great results.", "2026-09-16"],
  ["night-renew-retinol", "Anika B.", "Normal skin", 5, "Beginner-friendly retinol", "No peeling, no flaking. Fine lines around my eyes are visibly softer after 8 weeks.", "2026-10-28"],
  ["night-renew-retinol", "David M.", "Combination skin", 4, "Slow and steady", "Takes patience but my skin is smoother and my dark spots are lighter. Sunscreen is a must.", "2026-09-03"],
  ["night-renew-retinol", "Sofia L.", "Dry skin", 5, "Squalane base is a win", "I couldn't tolerate retinol before. This one feels gentle and effective.", "2026-11-02"],
  ["calm-down-centella-serum", "Rina K.", "Sensitive skin", 5, "Redness down in days", "It's like a cooling blanket for my face. I use it after sun and shaving.", "2026-10-07"],
  ["calm-down-centella-serum", "Ben Z.", "Normal skin", 4, "Good all-rounder", "Light and calming. Helps my skin recover after a harsh week.", "2026-09-24"],
  ["weightless-water-gel", "Naomi E.", "Oily skin", 5, "Moisture without grease", "Perfect under SPF. My T-zone stays matte but my cheeks feel hydrated.", "2026-10-12"],
  ["weightless-water-gel", "Pablo V.", "Combination skin", 4, "Light and fresh", "Nice cooling texture. In winter I needed something richer on top.", "2026-08-28"],
  ["everyday-peptide-cream", "Julia M.", "Normal skin", 5, "Plump and supple", "Skin looks bouncier by afternoon. Elegant texture, no pilling under makeup.", "2026-10-20"],
  ["everyday-peptide-cream", "Hiro S.", "Dry skin", 4, "Nice day cream", "Pleasant, not heavy. Does what it says. Would buy again.", "2026-09-11"],
  ["mineral-veil-spf-40", "Camille P.", "Sensitive skin", 5, "The only SPF that doesn't sting", "Sheer tint evens out my redness. Takes a minute to blend but worth it.", "2026-10-05"],
  ["mineral-veil-spf-40", "Idris W.", "Dry skin", 4, "Comfortable on dry skin", "A little dewy and sits nicely. Slight cast on me if I use too much.", "2026-09-19"],
  ["glow-reset-enzyme-mask", "Bianca T.", "Combination skin", 5, "A weekly treat", "Skin feels polished and plump after ten minutes. My go-to before events.", "2026-10-30"],
  ["glow-reset-enzyme-mask", "Matt R.", "Normal skin", 4, "Honey-soft", "Not gritty at all and rinses off easily. Skin looks fresh.", "2026-11-05"],
  ["midnight-squalane-oil", "Dana F.", "Dry skin", 5, "Wake up with soft skin", "A few drops over cream and I'm done. No greasy pillow either.", "2026-10-09"],
  ["midnight-squalane-oil", "Wes K.", "Normal skin", 4, "Lovely texture", "Light scent from the rosehip. Skin looks glowy in the morning.", "2026-09-28"],
  ["bright-eyes-caffeine-eye-cream", "Alma N.", "Normal skin", 5, "Looks like I slept", "Cooling applicator is a nice touch. Puffiness is down on mornings I use it.", "2026-11-03"],
  ["bright-eyes-caffeine-eye-cream", "Theo B.", "Sensitive skin", 4, "No irritation", "My eyes are sensitive and this was fine. Subtle but noticeable.", "2026-10-26"],
];

export const SEED_REVIEWS: Review[] = SEED.map(
  ([productSlug, name, skin, rating, title, body, date], i) => ({
    id: `seed-${i + 1}`,
    productSlug,
    name,
    skin,
    rating,
    title,
    body,
    date,
  }),
);
