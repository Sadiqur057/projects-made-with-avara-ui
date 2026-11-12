// Static content for the IRONPULSE gym site. Nothing here reads the clock, so it is safe to import
// from server and client components alike.

const U = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

export const IMG = {
  floor: U("photo-1534438327276-14e5300c3a48"),
  lifting: U("photo-1571019613454-1cb2f99b2d8b"),
  gymWide: U("photo-1540497077202-7c8a3999166f"),
  womanLift: U("photo-1517836357463-d25dfeac3438"),
  group: U("photo-1518611012118-696072aa579a"),
  yoga: U("photo-1544367567-0f2fcb009e0b"),
  cycle: U("photo-1574680096145-d05b474e2155"),
  barbell: U("photo-1599058917212-d750089bc07e"),
  rack: U("photo-1599901860904-17e6ed7083a0"),
  cardio: U("photo-1558611848-73f7eb4001a1"),
  dumbbells: U("photo-1548690312-e3b507d8c110"),
  ropes: U("photo-1605296867304-46d5465a13f1"),
  boxing: U("photo-1549060279-7e168fcee0c2"),
  stretch: U("photo-1571902943202-507ec2618e8f"),
  studio: U("photo-1545205597-3d9d02c29597"),
  mobility: U("photo-1576678927484-cc907957088c"),
  hiit: U("photo-1581009146145-b5ef050c2e1e"),
  coach: U("photo-1526506118085-60ce8714f8c5"),
  recovery: U("photo-1517963879433-6ad2b056d712"),
} as const;

const P = (id: string) => U(id, 600);
export const PORTRAIT = {
  m1: P("photo-1507003211169-0a1dd7228f2d"),
  m2: P("photo-1500648767791-00dcc994a43e"),
  m3: P("photo-1472099645785-5658abf4ff4e"),
  m4: P("photo-1522075469751-3a6694fb2f61"),
  f1: P("photo-1494790108377-be9c29b29330"),
  f2: P("photo-1438761681033-6461ffad8d80"),
  f3: P("photo-1534528741775-53994a69daeb"),
  f4: P("photo-1573496359142-b8d87734a5a2"),
} as const;

// ---------------------------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------------------------
export type CategoryId = "strength" | "hiit" | "yoga" | "combat" | "cycle";

export interface Category {
  id: CategoryId;
  label: string;
  tagline: string;
  icon: "Dumbbell" | "Flame" | "Flower2" | "Swords" | "Bike";
}

export const CATEGORIES: Category[] = [
  { id: "strength", label: "Strength", tagline: "Build raw power with coached barbell and dumbbell work.", icon: "Dumbbell" },
  { id: "hiit", label: "HIIT & Cardio", tagline: "Short, brutal intervals that torch calories.", icon: "Flame" },
  { id: "yoga", label: "Yoga & Mobility", tagline: "Move better, recover faster, stay injury-free.", icon: "Flower2" },
  { id: "combat", label: "Combat", tagline: "Boxing and kickboxing conditioning, no sparring required.", icon: "Swords" },
  { id: "cycle", label: "Cycling", tagline: "Rhythm-driven rides in the dark, on the beat.", icon: "Bike" },
];

export const categoryById = (id: CategoryId) => CATEGORIES.find((c) => c.id === id)!;

// ---------------------------------------------------------------------------------------------
// Trainers
// ---------------------------------------------------------------------------------------------
export interface Trainer {
  id: string;
  name: string;
  role: string;
  image: string;
  specialties: string[];
  years: number;
  rating: number;
  reviews: number;
  bio: string;
  certifications: string[];
  quote: string;
  instagram: string;
}

export const TRAINERS: Trainer[] = [
  {
    id: "marcus-reid",
    name: "Marcus Reid",
    role: "Head of Strength",
    image: PORTRAIT.m1,
    specialties: ["Powerlifting", "Hypertrophy", "Programming"],
    years: 12,
    rating: 4.9,
    reviews: 412,
    bio: "Former national-level powerlifter who now coaches everyone from first-time lifters to competitors. Marcus builds programs around leverage, tempo and honest progression, not ego loading.",
    certifications: ["NSCA-CSCS", "USAPL Coach L2", "Precision Nutrition L1"],
    quote: "Strong is a skill. We practise it every week.",
    instagram: "@marcus.lifts",
  },
  {
    id: "sofia-alvarez",
    name: "Sofia Alvarez",
    role: "Yoga & Mobility Lead",
    image: PORTRAIT.f1,
    specialties: ["Vinyasa", "Mobility", "Breathwork"],
    years: 9,
    rating: 4.9,
    reviews: 366,
    bio: "Sofia blends 500-hour yoga training with a sports-rehab background. Her classes make tight lifters and runners feel like they got a new set of joints.",
    certifications: ["RYT-500", "FMS Level 2", "Breathwork Facilitator"],
    quote: "Mobility is the strength you can actually use.",
    instagram: "@sofia.moves",
  },
  {
    id: "jordan-park",
    name: "Jordan Park",
    role: "HIIT Coach",
    image: PORTRAIT.m2,
    specialties: ["HIIT", "Conditioning", "Fat loss"],
    years: 7,
    rating: 4.8,
    reviews: 289,
    bio: "Jordan designs interval blocks that scale to every fitness level. Expect clear cues, big energy and a finisher you will talk about for days.",
    certifications: ["ACE-CPT", "CrossFit L2", "TRX Certified"],
    quote: "Hard is a feeling. Consistency is a decision.",
    instagram: "@jordan.trains",
  },
  {
    id: "amara-okafor",
    name: "Amara Okafor",
    role: "Boxing Conditioning Coach",
    image: PORTRAIT.f2,
    specialties: ["Boxing", "Kickboxing", "Footwork"],
    years: 10,
    rating: 5.0,
    reviews: 241,
    bio: "A decorated amateur boxer, Amara teaches technique first and cardio second. Her rounds are fast, technical and ridiculously fun.",
    certifications: ["USA Boxing Coach", "ACE-GFI", "First Aid / CPR"],
    quote: "Technique is the cheat code.",
    instagram: "@amara.fights",
  },
  {
    id: "leo-chen",
    name: "Leo Chen",
    role: "Cycling Instructor",
    image: PORTRAIT.m3,
    specialties: ["Indoor cycling", "Endurance", "Music-led rides"],
    years: 6,
    rating: 4.8,
    reviews: 198,
    bio: "Leo scores every ride like a set at a festival. Strong cadence work, big climbs and playlists that make 45 minutes disappear.",
    certifications: ["Schwinn Certified", "ACSM-EP", "Spinning Instructor"],
    quote: "Find the beat, then find your limit.",
    instagram: "@leo.rides",
  },
  {
    id: "naomi-brooks",
    name: "Naomi Brooks",
    role: "Performance & Nutrition Coach",
    image: PORTRAIT.f3,
    specialties: ["Body recomposition", "Nutrition", "Women's strength"],
    years: 8,
    rating: 4.9,
    reviews: 305,
    bio: "Naomi pairs smart strength training with practical nutrition coaching. Her clients focus on measurable progress, not crash plans.",
    certifications: ["NASM-CPT", "Precision Nutrition L2", "Pre/Postnatal Fitness"],
    quote: "Progress you can keep beats progress you can brag about.",
    instagram: "@naomi.coaches",
  },
];

export const trainerById = (id: string) => TRAINERS.find((t) => t.id === id)!;

// ---------------------------------------------------------------------------------------------
// Classes
// ---------------------------------------------------------------------------------------------
export type Level = "Beginner" | "All levels" | "Intermediate" | "Advanced";

export interface GymClass {
  slug: string;
  name: string;
  category: CategoryId;
  level: Level;
  duration: number; // minutes
  intensity: 1 | 2 | 3 | 4 | 5;
  calories: string;
  trainerId: string;
  image: string;
  summary: string;
  description: string;
  benefits: string[];
  bring: string[];
  capacity: number;
  rating: number;
  room: string;
}

export const CLASSES: GymClass[] = [
  {
    slug: "barbell-foundations",
    name: "Barbell Foundations",
    category: "strength",
    level: "Beginner",
    duration: 60,
    intensity: 3,
    calories: "300–400",
    trainerId: "marcus-reid",
    image: IMG.barbell,
    summary: "Learn squat, bench, deadlift and press with a coach at your side.",
    description:
      "Barbell Foundations is the safest, fastest way to learn the big lifts. Every session starts with a mobility primer, then moves through skill practice and a short working block with loads that suit you. Small groups mean Marcus can fix your setup in real time.",
    benefits: ["Learn safe lifting technique", "Build a base of full-body strength", "Understand how to progress your weights"],
    bring: ["Flat-soled shoes", "Water bottle", "Small towel"],
    capacity: 12,
    rating: 4.9,
    room: "Strength Lab",
  },
  {
    slug: "power-hour",
    name: "Power Hour",
    category: "strength",
    level: "Intermediate",
    duration: 60,
    intensity: 4,
    calories: "400–550",
    trainerId: "marcus-reid",
    image: IMG.rack,
    summary: "Heavy compound lifts and accessory supersets for serious strength.",
    description:
      "A structured strength session built around one main lift and smart accessories. Power Hour follows a 6-week wave so the weights climb in a way your body can absorb. Expect clear targets, rest timers and plenty of spotting.",
    benefits: ["Increase your 1-rep max", "Add lean muscle", "Follow a periodised plan without thinking"],
    bring: ["Lifting shoes or flats", "Chalk or straps (optional)", "Water"],
    capacity: 14,
    rating: 4.8,
    room: "Strength Lab",
  },
  {
    slug: "recomp-lab",
    name: "Recomp Lab",
    category: "strength",
    level: "All levels",
    duration: 50,
    intensity: 3,
    calories: "350–450",
    trainerId: "naomi-brooks",
    image: IMG.womanLift,
    summary: "Strength circuits designed to lose fat and keep muscle.",
    description:
      "Naomi's signature session mixes resistance circuits with short metabolic finishers. Every class includes a nutrition tip so the effort in the gym matches what is on your plate.",
    benefits: ["Improve body composition", "Learn weight selection", "Walk away with a nutrition takeaway"],
    bring: ["Trainers", "Water", "Small towel"],
    capacity: 16,
    rating: 4.9,
    room: "Studio B",
  },
  {
    slug: "inferno-hiit",
    name: "Inferno HIIT",
    category: "hiit",
    level: "All levels",
    duration: 45,
    intensity: 5,
    calories: "500–700",
    trainerId: "jordan-park",
    image: IMG.hiit,
    summary: "45 minutes of intervals, sleds and ropes. Scalable, sweaty, fun.",
    description:
      "Rotating stations, work/rest timers and a team vibe. Inferno HIIT gives you three scaling options per move, so a first-timer and an athlete can train side by side. Finishes with the Burnout Board challenge.",
    benefits: ["Burn up to 700 calories", "Boost your conditioning", "Train with a high-energy crowd"],
    bring: ["Trainers", "Towel", "Large water bottle"],
    capacity: 20,
    rating: 4.8,
    room: "Studio A",
  },
  {
    slug: "sprint-ladder",
    name: "Sprint Ladder",
    category: "hiit",
    level: "Intermediate",
    duration: 40,
    intensity: 4,
    calories: "450–600",
    trainerId: "jordan-park",
    image: IMG.cardio,
    summary: "Treadmill and rower ladders that push your engine.",
    description:
      "Climb and descend structured sprint ladders on treadmills, rowers and ski-ergs. Everyone works to their own pace targets so it is hard for each person, not for the whole room.",
    benefits: ["Raise your aerobic ceiling", "Get faster", "Track pacing data by machine"],
    bring: ["Running shoes", "Towel", "Water"],
    capacity: 16,
    rating: 4.7,
    room: "Cardio Deck",
  },
  {
    slug: "rope-and-row",
    name: "Rope & Row",
    category: "hiit",
    level: "Advanced",
    duration: 45,
    intensity: 5,
    calories: "550–750",
    trainerId: "jordan-park",
    image: IMG.ropes,
    summary: "Battle ropes, rowers and kettlebells in all-out sets.",
    description:
      "A full-body conditioning grinder for people who already have a training base. Short, spicy rounds mix upper-body ropes with posterior-chain swings and rowing intervals.",
    benefits: ["Full-body conditioning", "Grip and shoulder endurance", "Mental toughness"],
    bring: ["Grippy shoes", "Hand towel", "Water"],
    capacity: 12,
    rating: 4.8,
    room: "Studio A",
  },
  {
    slug: "sunrise-vinyasa",
    name: "Sunrise Vinyasa",
    category: "yoga",
    level: "All levels",
    duration: 60,
    intensity: 2,
    calories: "180–260",
    trainerId: "sofia-alvarez",
    image: IMG.yoga,
    summary: "A breath-led flow to start your day with calm and strength.",
    description:
      "Sofia guides a steady vinyasa flow with options for every body. Expect standing sequences, hip and shoulder openers, and a long final rest. Mats and props are provided.",
    benefits: ["Improve flexibility", "Lower stress", "Build body awareness"],
    bring: ["Comfortable clothes", "Water"],
    capacity: 24,
    rating: 4.9,
    room: "Studio B",
  },
  {
    slug: "mobility-reset",
    name: "Mobility Reset",
    category: "yoga",
    level: "Beginner",
    duration: 40,
    intensity: 1,
    calories: "100–160",
    trainerId: "sofia-alvarez",
    image: IMG.mobility,
    summary: "Targeted hips, spine and shoulders. Great after heavy training.",
    description:
      "A slow, focused class using foam rollers, bands and active stretching. It is the best pairing for a strength-heavy week, and a gentle start if you have not exercised in a while.",
    benefits: ["Reduce stiffness", "Improve lifting positions", "Speed up recovery"],
    bring: ["Comfortable clothes", "Socks (optional)"],
    capacity: 20,
    rating: 4.8,
    room: "Studio B",
  },
  {
    slug: "yin-and-restore",
    name: "Yin & Restore",
    category: "yoga",
    level: "All levels",
    duration: 60,
    intensity: 1,
    calories: "90–140",
    trainerId: "sofia-alvarez",
    image: IMG.stretch,
    summary: "Long-held floor poses and breathwork to unwind your nervous system.",
    description:
      "A candle-lit class finishing with guided breathwork. Postures are held for several minutes with props, targeting connective tissue and encouraging deep relaxation.",
    benefits: ["Deep relaxation", "Better sleep", "Joint mobility"],
    bring: ["Warm layer", "Water"],
    capacity: 20,
    rating: 4.9,
    room: "Studio B",
  },
  {
    slug: "boxing-fundamentals",
    name: "Boxing Fundamentals",
    category: "combat",
    level: "Beginner",
    duration: 50,
    intensity: 3,
    calories: "400–550",
    trainerId: "amara-okafor",
    image: IMG.boxing,
    summary: "Stance, jab-cross-hook and footwork on heavy bags. No contact.",
    description:
      "Amara teaches the building blocks of boxing: guard, footwork, basic combinations and defence. You will rotate between bag rounds and partner pad drills. Gloves and wraps available to rent.",
    benefits: ["Learn real boxing technique", "Torch calories", "Relieve stress"],
    bring: ["Hand wraps (rentable)", "Trainers", "Towel"],
    capacity: 16,
    rating: 5.0,
    room: "Combat Studio",
  },
  {
    slug: "kickbox-cardio",
    name: "Kickbox Cardio",
    category: "combat",
    level: "Intermediate",
    duration: 50,
    intensity: 4,
    calories: "500–650",
    trainerId: "amara-okafor",
    image: IMG.lifting,
    summary: "Punch, kick and move in fast rounds on the bags.",
    description:
      "A rhythm-driven kickboxing class with combinations that build from simple to challenging. Great for coordination, power and an impressive burn.",
    benefits: ["Full-body coordination", "Power and speed", "High calorie burn"],
    bring: ["Hand wraps", "Trainers", "Water"],
    capacity: 16,
    rating: 4.8,
    room: "Combat Studio",
  },
  {
    slug: "night-ride",
    name: "Night Ride",
    category: "cycle",
    level: "All levels",
    duration: 45,
    intensity: 4,
    calories: "450–650",
    trainerId: "leo-chen",
    image: IMG.cycle,
    summary: "Lights low, music loud. A beat-matched ride with big climbs.",
    description:
      "Leo programs every ride to a playlist, matching sprints and climbs to the track. Power meters on every bike show your output so you can push without guessing.",
    benefits: ["Build leg endurance", "Boost your aerobic base", "Track watts and calories"],
    bring: ["Cycling shoes (rentable)", "Towel", "Water"],
    capacity: 22,
    rating: 4.8,
    room: "Cycle Studio",
  },
];

export const classBySlug = (slug: string) => CLASSES.find((c) => c.slug === slug);

// ---------------------------------------------------------------------------------------------
// Weekly timetable. `day` follows Date#getDay(): 0 = Sunday.
// ---------------------------------------------------------------------------------------------
export interface Session {
  id: string;
  classSlug: string;
  day: number;
  time: string; // "HH:MM" 24h
}

const S = (classSlug: string, day: number, time: string): Session => ({
  id: `${classSlug}:${day}:${time.replace(":", "")}`,
  classSlug,
  day,
  time,
});

export const SESSIONS: Session[] = [
  // Monday
  S("sunrise-vinyasa", 1, "06:30"),
  S("barbell-foundations", 1, "07:30"),
  S("inferno-hiit", 1, "12:15"),
  S("boxing-fundamentals", 1, "17:30"),
  S("night-ride", 1, "19:00"),
  // Tuesday
  S("power-hour", 2, "06:00"),
  S("recomp-lab", 2, "09:00"),
  S("sprint-ladder", 2, "12:15"),
  S("kickbox-cardio", 2, "18:00"),
  S("yin-and-restore", 2, "20:00"),
  // Wednesday
  S("sunrise-vinyasa", 3, "06:30"),
  S("inferno-hiit", 3, "07:30"),
  S("mobility-reset", 3, "12:30"),
  S("barbell-foundations", 3, "18:00"),
  S("night-ride", 3, "19:30"),
  // Thursday
  S("power-hour", 4, "06:00"),
  S("rope-and-row", 4, "12:15"),
  S("recomp-lab", 4, "17:30"),
  S("boxing-fundamentals", 4, "18:30"),
  S("yin-and-restore", 4, "20:00"),
  // Friday
  S("sunrise-vinyasa", 5, "06:30"),
  S("sprint-ladder", 5, "07:30"),
  S("kickbox-cardio", 5, "12:15"),
  S("night-ride", 5, "17:30"),
  S("mobility-reset", 5, "19:00"),
  // Saturday
  S("barbell-foundations", 6, "09:00"),
  S("inferno-hiit", 6, "10:00"),
  S("sunrise-vinyasa", 6, "11:00"),
  S("rope-and-row", 6, "12:00"),
  S("night-ride", 6, "16:00"),
  // Sunday
  S("yin-and-restore", 0, "09:00"),
  S("power-hour", 0, "10:30"),
  S("kickbox-cardio", 0, "12:00"),
  S("mobility-reset", 0, "16:00"),
];

export const sessionById = (id: string) => SESSIONS.find((s) => s.id === id);
export const sessionsForClass = (slug: string) => SESSIONS.filter((s) => s.classSlug === slug);
export const sessionsOnDay = (day: number) =>
  SESSIONS.filter((s) => s.day === day).sort((a, b) => a.time.localeCompare(b.time));

// ---------------------------------------------------------------------------------------------
// Membership plans
// ---------------------------------------------------------------------------------------------
export type PlanId = "starter" | "pro" | "elite";
export type Cycle = "monthly" | "annual";

export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  monthly: number; // price per month when billed monthly
  annualMonthly: number; // effective price per month when billed annually
  classLimit: number | null; // classes per month, null = unlimited
  popular?: boolean;
  highlights: string[];
}

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Everything you need to build the habit.",
    monthly: 29,
    annualMonthly: 23,
    classLimit: 8,
    highlights: ["Full gym floor access (5am–11pm)", "8 group classes per month", "Locker room & showers", "IRONPULSE app tracking"],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "Unlimited classes for people who show up.",
    monthly: 59,
    annualMonthly: 47,
    classLimit: null,
    popular: true,
    highlights: [
      "24/7 gym floor access",
      "Unlimited group classes",
      "1 personal training session / month",
      "Sauna & recovery zone",
      "2 guest passes / month",
    ],
  },
  {
    id: "elite",
    name: "Elite",
    tagline: "Coaching, recovery and nutrition in one membership.",
    monthly: 99,
    annualMonthly: 79,
    classLimit: null,
    highlights: [
      "Everything in Pro",
      "4 personal training sessions / month",
      "Monthly nutrition consult",
      "Towel service & premium locker",
      "Priority booking (14 days ahead)",
      "Unlimited guest passes",
    ],
  },
];

export const planById = (id: string) => PLANS.find((p) => p.id === id);

export const planPrice = (plan: Plan, cycle: Cycle) => (cycle === "annual" ? plan.annualMonthly : plan.monthly);
export const planTotal = (plan: Plan, cycle: Cycle) => (cycle === "annual" ? plan.annualMonthly * 12 : plan.monthly);

export type CompareValue = boolean | string;
export interface CompareRow {
  label: string;
  hint?: string;
  values: Record<PlanId, CompareValue>;
}
export interface CompareGroup {
  title: string;
  rows: CompareRow[];
}

export const COMPARISON: CompareGroup[] = [
  {
    title: "Training",
    rows: [
      { label: "Gym floor access", values: { starter: "5am–11pm", pro: "24/7", elite: "24/7" } },
      { label: "Group classes", values: { starter: "8 / month", pro: "Unlimited", elite: "Unlimited" } },
      { label: "Personal training sessions", values: { starter: false, pro: "1 / month", elite: "4 / month" } },
      { label: "Class booking window", values: { starter: "3 days", pro: "7 days", elite: "14 days" } },
      { label: "Workout tracking app", values: { starter: true, pro: true, elite: true } },
    ],
  },
  {
    title: "Recovery & wellness",
    rows: [
      { label: "Locker room & showers", values: { starter: true, pro: true, elite: true } },
      { label: "Sauna & recovery zone", values: { starter: false, pro: true, elite: true } },
      { label: "Monthly nutrition consult", values: { starter: false, pro: false, elite: true } },
      { label: "Towel service", values: { starter: false, pro: false, elite: true } },
    ],
  },
  {
    title: "Perks",
    rows: [
      { label: "Guest passes", values: { starter: false, pro: "2 / month", elite: "Unlimited" } },
      { label: "Free class cancellation", hint: "Cancel up to 2 hours before", values: { starter: true, pro: true, elite: true } },
      { label: "Member events & challenges", values: { starter: false, pro: true, elite: true } },
      { label: "Pause membership", values: { starter: false, pro: "1 month / year", elite: "3 months / year" } },
    ],
  },
];

export const PROMO_CODES: Record<string, { label: string; percent: number }> = {
  PULSE10: { label: "10% off your first payment", percent: 10 },
  NEWYEAR20: { label: "20% off your first payment", percent: 20 },
};

export const JOINING_FEE = 0;

// ---------------------------------------------------------------------------------------------
// Facilities, transformations, reviews
// ---------------------------------------------------------------------------------------------
export interface Facility {
  id: string;
  title: string;
  detail: string;
  image: string;
  ratio: "tall" | "wide" | "square";
}

export const FACILITIES: Facility[] = [
  { id: "f1", title: "Strength Lab", detail: "12 racks, 2 platforms, calibrated plates", image: IMG.rack, ratio: "tall" },
  { id: "f2", title: "Cardio Deck", detail: "Treadmills, rowers, ski-ergs", image: IMG.cardio, ratio: "wide" },
  { id: "f3", title: "Free-weight Zone", detail: "Dumbbells up to 60 kg", image: IMG.dumbbells, ratio: "square" },
  { id: "f4", title: "Cycle Studio", detail: "Power-metered bikes, club lighting", image: IMG.cycle, ratio: "tall" },
  { id: "f5", title: "Combat Studio", detail: "Heavy bags, pads and sprung floor", image: IMG.boxing, ratio: "square" },
  { id: "f6", title: "Yoga Studio", detail: "Heated floor, mats and props provided", image: IMG.yoga, ratio: "wide" },
  { id: "f7", title: "Conditioning Rig", detail: "Ropes, sleds, kettlebells", image: IMG.ropes, ratio: "tall" },
  { id: "f8", title: "Recovery Zone", detail: "Sauna, cold plunge, stretch area", image: IMG.recovery, ratio: "square" },
];

export interface Transformation {
  id: string;
  name: string;
  program: string;
  weeks: number;
  image: string;
  stats: { label: string; value: string }[];
  quote: string;
}

export const TRANSFORMATIONS: Transformation[] = [
  {
    id: "t1",
    name: "Daniel M.",
    program: "Barbell Foundations → Power Hour",
    weeks: 20,
    image: PORTRAIT.m4,
    stats: [
      { label: "Body fat", value: "−9%" },
      { label: "Squat", value: "+55 kg" },
      { label: "Waist", value: "−8 cm" },
    ],
    quote: "I walked in not knowing how to hold a barbell. Marcus rebuilt my whole approach.",
  },
  {
    id: "t2",
    name: "Priya S.",
    program: "Inferno HIIT + Recomp Lab",
    weeks: 16,
    image: PORTRAIT.f4,
    stats: [
      { label: "Weight", value: "−11 kg" },
      { label: "5K time", value: "−7 min" },
      { label: "Energy", value: "2×" },
    ],
    quote: "Three classes a week and a nutrition tweak. That is all it took.",
  },
  {
    id: "t3",
    name: "Tom H.",
    program: "Boxing + Mobility Reset",
    weeks: 12,
    image: PORTRAIT.m3,
    stats: [
      { label: "Resting HR", value: "−12 bpm" },
      { label: "Back pain", value: "Gone" },
      { label: "Stress", value: "−40%" },
    ],
    quote: "Boxing gave me my evenings back. Sofia fixed my posture.",
  },
];

export interface Review {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  content: string;
  program: string;
}

export const REVIEWS: Review[] = [
  {
    id: "r1",
    name: "Daniel Mercer",
    role: "Member for 14 months",
    avatar: PORTRAIT.m4,
    rating: 5,
    program: "Strength",
    content: "The coaching is the difference. I have tried five gyms and this is the first one where somebody actually watches my lifts and fixes them.",
  },
  {
    id: "r2",
    name: "Priya Shah",
    role: "Member for 9 months",
    avatar: PORTRAIT.f4,
    rating: 5,
    program: "HIIT",
    content: "Inferno HIIT is a room full of people cheering each other on. I have never enjoyed being this tired.",
  },
  {
    id: "r3",
    name: "Tom Hartley",
    role: "Member for 11 months",
    avatar: PORTRAIT.m3,
    rating: 5,
    program: "Combat",
    content: "Amara makes you feel like a boxer from the first class, even though you absolutely are not one yet. Pure fun.",
  },
  {
    id: "r4",
    name: "Grace Lin",
    role: "Member for 6 months",
    avatar: PORTRAIT.f3,
    rating: 5,
    program: "Yoga",
    content: "Sofia's Sunrise Vinyasa is my reset button. Booking in the app takes ten seconds and the studio is spotless.",
  },
  {
    id: "r5",
    name: "Samir Khan",
    role: "Member for 18 months",
    avatar: PORTRAIT.m2,
    rating: 5,
    program: "Cycling",
    content: "Night Ride with Leo is a concert you pedal through. I never skip it.",
  },
];

export const GYM = {
  name: "IRONPULSE",
  phone: "+1 (555) 013-4400",
  email: "hello@ironpulse.fit",
  address: ["214 Foundry Street", "Brooklyn, NY 11201"],
  hours: [
    { days: "Mon – Fri", time: "5:00 AM – 11:00 PM" },
    { days: "Saturday", time: "7:00 AM – 8:00 PM" },
    { days: "Sunday", time: "8:00 AM – 6:00 PM" },
  ],
};
