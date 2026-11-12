export const BRAND = {
  name: "Wayfare",
  tagline: "Journeys planned by people who have walked them.",
  email: "hello@wayfare.travel",
  phone: "+1 (415) 555-0142",
  address: "214 Harbor Street, San Francisco, CA",
  hours: "Mon–Fri 9:00–18:00 PT · Sat 10:00–14:00 PT",
};

const img = (id: string, w = 1400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;

export type Region = "Asia" | "Europe" | "Africa" | "Americas";
export type Category = "Beach" | "Adventure" | "Culture" | "Luxury" | "Wildlife";

export const CATEGORIES: { id: Category; blurb: string }[] = [
  { id: "Beach", blurb: "Sand, sea and slow mornings" },
  { id: "Adventure", blurb: "Trails, peaks and big skies" },
  { id: "Culture", blurb: "Cities, food and living history" },
  { id: "Luxury", blurb: "Private, effortless, unhurried" },
  { id: "Wildlife", blurb: "Close encounters, guided well" },
];

export const REGIONS: Region[] = ["Asia", "Europe", "Africa", "Americas"];

export interface Destination {
  slug: string;
  name: string;
  country: string;
  region: Region;
  tagline: string;
  description: string;
  bestTime: string;
  image: string;
  /** CSS object-position for crops. */
  position?: string;
}

export const DESTINATIONS: Destination[] = [
  {
    slug: "bali",
    name: "Bali",
    country: "Indonesia",
    region: "Asia",
    tagline: "Rice terraces, temples and surf breaks",
    description:
      "An island where a morning of temple ceremonies and an afternoon on a surf break fit in one day. We stay in family-run villas, away from the busiest strips.",
    bestTime: "Apr – Oct",
    image: img("1537996194471-e657df975ab4"),
  },
  {
    slug: "santorini",
    name: "Santorini",
    country: "Greece",
    region: "Europe",
    tagline: "Whitewashed cliffs over the caldera",
    description:
      "Volcanic wine, sunsets from Oia and sailing around the caldera. Go in shoulder season for the light without the crowds.",
    bestTime: "May – Jun, Sep – Oct",
    image: img("1570077188670-e3a8d69ac5ff"),
  },
  {
    slug: "kyoto",
    name: "Kyoto",
    country: "Japan",
    region: "Asia",
    tagline: "Temples, tea houses and lantern-lit lanes",
    description:
      "Japan's old capital rewards slow walking. We pair early-morning shrine visits with kaiseki dinners and a day in the bamboo groves of Arashiyama.",
    bestTime: "Mar – Apr, Oct – Nov",
    image: img("1493976040374-85c8e12f0c0e"),
  },
  {
    slug: "swiss-alps",
    name: "Swiss Alps",
    country: "Switzerland",
    region: "Europe",
    tagline: "Panoramic trains and glacier-fed lakes",
    description:
      "Hike above the clouds by day, return to a lakeside village by evening. The rail network does the heavy lifting so you do not need a car.",
    bestTime: "Jun – Sep, Dec – Mar",
    image: img("1527668752968-14dc70a27c95"),
  },
  {
    slug: "maldives",
    name: "Maldives",
    country: "Maldives",
    region: "Asia",
    tagline: "Overwater villas on glassy lagoons",
    description:
      "Snorkel house reefs, dine on a sandbank and swim with manta rays. Seaplane transfers are included in every package.",
    bestTime: "Nov – Apr",
    image: img("1514282401047-d79a71a590e8"),
  },
  {
    slug: "peru",
    name: "Machu Picchu",
    country: "Peru",
    region: "Americas",
    tagline: "The Inca Trail and the Sacred Valley",
    description:
      "Acclimatise in Cusco, walk the trail to Intipunku at sunrise and finish with a long lunch in the Sacred Valley.",
    bestTime: "May – Sep",
    image: img("1526392060635-9d6019884377"),
  },
  {
    slug: "paris",
    name: "Paris",
    country: "France",
    region: "Europe",
    tagline: "Bakeries, bridges and late museum nights",
    description:
      "We skip the queues and keep the pace human: a morning market, a private Louvre hour, a long dinner in the Marais.",
    bestTime: "Apr – Jun, Sep – Oct",
    image: img("1502602898657-3e91760cbb34"),
  },
  {
    slug: "iceland",
    name: "Iceland",
    country: "Iceland",
    region: "Europe",
    tagline: "Waterfalls, black beaches and aurora",
    description:
      "A ring-road journey through lava fields and glacier lagoons, timed for the best chance at the northern lights.",
    bestTime: "Sep – Mar (aurora), Jun – Aug (midnight sun)",
    image: img("1504829857797-ddff29c27927"),
  },
  {
    slug: "marrakech",
    name: "Marrakech",
    country: "Morocco",
    region: "Africa",
    tagline: "Souks, riads and a night under Saharan stars",
    description:
      "Lose yourself in the medina, then cross the Atlas Mountains for a camel trek and a candle-lit desert camp.",
    bestTime: "Mar – May, Oct – Nov",
    image: img("1597212618440-806262de4f6b"),
  },
  {
    slug: "tanzania",
    name: "Tanzania",
    country: "Tanzania",
    region: "Africa",
    tagline: "Serengeti plains and the Ngorongoro Crater",
    description:
      "Small-group game drives with expert local guides, timed around the Great Migration.",
    bestTime: "Jun – Oct",
    image: img("1516426122078-c23e76319801"),
  },
  {
    slug: "amalfi",
    name: "Amalfi Coast",
    country: "Italy",
    region: "Europe",
    tagline: "Lemon groves and cliffside villages",
    description:
      "Stay in Positano, ferry to Capri, hike the Path of the Gods and eat very well along the way.",
    bestTime: "May – Jun, Sep",
    image: img("1612698093158-e07ac200d44e"),
  },
  {
    slug: "thailand",
    name: "Thailand",
    country: "Thailand",
    region: "Asia",
    tagline: "Island hopping on the Andaman Sea",
    description:
      "Longtail boats, limestone karsts and night markets. A relaxed route across Phuket, Phi Phi and Krabi.",
    bestTime: "Nov – Apr",
    image: img("1552465011-b4e21bf6e79a"),
  },
  {
    slug: "cappadocia",
    name: "Cappadocia",
    country: "Türkiye",
    region: "Europe",
    tagline: "Fairy chimneys and sunrise balloons",
    description:
      "Sleep in a cave hotel, float over the valleys at dawn and wander underground cities.",
    bestTime: "Apr – Jun, Sep – Nov",
    image: img("1641128324972-af3212f0f6bd"),
  },
  {
    slug: "banff",
    name: "Banff & Rockies",
    country: "Canada",
    region: "Americas",
    tagline: "Turquoise lakes under jagged peaks",
    description:
      "Canoe at Moraine Lake, soak in alpine hot springs and drive the Icefields Parkway with a local guide.",
    bestTime: "Jun – Sep",
    image: img("1503614472-8c93d56e92ce"),
  },
];

export interface ItineraryStop {
  /** e.g. "Day 1" or "Day 3–4" */
  day: string;
  title: string;
  description: string;
  meals?: string;
}

export interface TravelPackage {
  slug: string;
  title: string;
  destination: string; // destination slug
  category: Category;
  days: number;
  /** Price per adult, in USD. */
  price: number;
  rating: number;
  reviews: number;
  summary: string;
  highlights: string[];
  included: string[];
  excluded: string[];
  maxGroup: number;
  pace: "Relaxed" | "Moderate" | "Active";
  featured?: boolean;
  /** Last-minute deal config. */
  deal?: { discount: number; departsInDays: number; seatsLeft: number };
  itinerary: ItineraryStop[];
}

const STD_INCLUDED = [
  "Return transfers from the arrival airport",
  "Hand-picked accommodation (breakfast daily)",
  "All guided activities listed in the itinerary",
  "A local Wayfare host for the whole trip",
  "24/7 trip support line",
];
const STD_EXCLUDED = [
  "International flights",
  "Travel insurance (optional add-on at checkout)",
  "Meals not listed in the itinerary",
  "Personal expenses and tips",
];

export const PACKAGES: TravelPackage[] = [
  {
    slug: "bali-serenity-retreat",
    title: "Bali Serenity Retreat",
    destination: "bali",
    category: "Beach",
    days: 7,
    price: 1290,
    rating: 4.8,
    reviews: 412,
    summary:
      "Seven slow days between Ubud's rice terraces and the cliffs of Uluwatu, with yoga, cooking classes and a private sunset temple visit.",
    highlights: ["Sunrise at Mount Batur", "Balinese cooking class", "Uluwatu cliff temple at sunset", "Nusa Penida day trip"],
    included: [...STD_INCLUDED, "Private villa with pool in Ubud"],
    excluded: STD_EXCLUDED,
    maxGroup: 12,
    pace: "Relaxed",
    deal: { discount: 22, departsInDays: 9, seatsLeft: 4 },
    itinerary: [
      { day: "Day 1", title: "Arrive in Bali", description: "Meet your host at Denpasar airport and transfer to your Ubud villa. Welcome dinner overlooking the rice fields.", meals: "Dinner" },
      { day: "Day 2", title: "Ubud, culture and craft", description: "Visit the Sacred Monkey Forest, a woodcarving village and the Tegallalang terraces. Evening Legong dance performance.", meals: "Breakfast" },
      { day: "Day 3", title: "Sunrise at Mount Batur", description: "A pre-dawn guided hike to the crater rim, breakfast cooked on volcanic steam, then a soak in natural hot springs.", meals: "Breakfast, Lunch" },
      { day: "Day 4", title: "Cooking class and free afternoon", description: "Market visit and a hands-on Balinese cooking class with a local family. The afternoon is yours: spa, yoga or the pool.", meals: "Breakfast, Lunch" },
      { day: "Day 5–6", title: "Uluwatu and the south coast", description: "Transfer to the Bukit Peninsula. Beach time at Padang Padang, a boat day to Nusa Penida and sunset at Uluwatu Temple.", meals: "Breakfast" },
      { day: "Day 7", title: "Departure", description: "Slow breakfast and transfer to the airport for your flight home.", meals: "Breakfast" },
    ],
  },
  {
    slug: "santorini-sunset-escape",
    title: "Santorini Sunset Escape",
    destination: "santorini",
    category: "Luxury",
    days: 6,
    price: 1890,
    rating: 4.9,
    reviews: 538,
    featured: true,
    summary:
      "Six days in a cave suite on the caldera rim: private catamaran sailing, wine tasting in volcanic vineyards and unhurried dinners in Oia.",
    highlights: ["Private caldera catamaran", "Volcanic wine tasting", "Oia sunset dinner", "Cave suite with plunge pool"],
    included: [...STD_INCLUDED, "Caldera-view cave suite with plunge pool", "Private sunset catamaran"],
    excluded: STD_EXCLUDED,
    maxGroup: 8,
    pace: "Relaxed",
    itinerary: [
      { day: "Day 1", title: "Arrival and check-in", description: "Private transfer to your cave suite in Imerovigli. Evening aperitivo on your terrace.", meals: "Welcome drinks" },
      { day: "Day 2", title: "Fira to Oia walk", description: "The caldera-edge trail from Fira to Oia (about 3 hours), with a seaside lunch and sunset in Oia.", meals: "Breakfast, Dinner" },
      { day: "Day 3", title: "Catamaran day", description: "Sail the caldera, swim in the hot springs, snorkel at the Red Beach and enjoy a grilled lunch on board.", meals: "Breakfast, Lunch" },
      { day: "Day 4", title: "Wineries of Santorini", description: "Three family wineries, Assyrtiko tasting and a vineyard lunch under the vines.", meals: "Breakfast, Lunch" },
      { day: "Day 5", title: "Free day", description: "Optional: pottery workshop in Pyrgos, a spa treatment or simply the pool. Farewell dinner at a clifftop taverna.", meals: "Breakfast, Dinner" },
      { day: "Day 6", title: "Departure", description: "Breakfast and private transfer to the airport.", meals: "Breakfast" },
    ],
  },
  {
    slug: "kyoto-cherry-blossom-journey",
    title: "Kyoto Cherry Blossom Journey",
    destination: "kyoto",
    category: "Culture",
    days: 9,
    price: 2450,
    rating: 4.9,
    reviews: 327,
    summary:
      "Nine days of tea ceremonies, temple dawns and kaiseki dinners, with a bullet-train side trip to Nara and Osaka.",
    highlights: ["Tea ceremony in Gion", "Fushimi Inari at dawn", "Arashiyama bamboo grove", "Kaiseki dinner"],
    included: [...STD_INCLUDED, "Japan Rail pass for the Kansai region", "Tea ceremony and kimono experience"],
    excluded: STD_EXCLUDED,
    maxGroup: 10,
    pace: "Moderate",
    itinerary: [
      { day: "Day 1–2", title: "Arrive in Kyoto", description: "Bullet train from Osaka Kansai Airport to Kyoto. Orientation walk through Higashiyama and a first night in a ryokan.", meals: "Dinner" },
      { day: "Day 3", title: "Temples at first light", description: "Beat the crowds at Fushimi Inari and Kiyomizu-dera, then lunch in Nishiki Market.", meals: "Breakfast, Lunch" },
      { day: "Day 4", title: "Arashiyama", description: "Bamboo grove, Tenryu-ji garden and a river boat ride, then a private tea ceremony in Gion.", meals: "Breakfast" },
      { day: "Day 5–6", title: "Nara and Osaka", description: "Day trip to Nara's deer park and Todai-ji, then Osaka street-food night in Dotonbori.", meals: "Breakfast, Dinner" },
      { day: "Day 7–8", title: "Free days in Kyoto", description: "Choose from a pottery class, a cycling tour, the Philosopher's Path or Nijo Castle.", meals: "Breakfast" },
      { day: "Day 9", title: "Departure", description: "Transfer to Kansai Airport.", meals: "Breakfast" },
    ],
  },
  {
    slug: "swiss-alps-explorer",
    title: "Swiss Alps Explorer",
    destination: "swiss-alps",
    category: "Adventure",
    days: 8,
    price: 2980,
    rating: 4.7,
    reviews: 289,
    summary:
      "Hike between Grindelwald, Zermatt and Lucerne with panoramic trains, cable cars and lakeside hotels.",
    highlights: ["Jungfraujoch viewpoint", "Matterhorn hike", "Glacier Express leg", "Lake Lucerne cruise"],
    included: [...STD_INCLUDED, "Swiss Travel Pass (8 days)", "Mountain guide for hiking days"],
    excluded: STD_EXCLUDED,
    maxGroup: 10,
    pace: "Active",
    deal: { discount: 15, departsInDays: 14, seatsLeft: 6 },
    itinerary: [
      { day: "Day 1", title: "Zurich to Lucerne", description: "Arrive in Zurich and take the train to Lucerne. Chapel Bridge walk and a lakeside dinner.", meals: "Dinner" },
      { day: "Day 2–3", title: "Grindelwald", description: "Cable car to First, the cliff walk and a guided hike to Bachalpsee. Optional Jungfraujoch excursion.", meals: "Breakfast" },
      { day: "Day 4", title: "Glacier Express", description: "A scenic rail day through the Alps to Zermatt.", meals: "Breakfast, Lunch" },
      { day: "Day 5–6", title: "Zermatt and the Matterhorn", description: "Gornergrat railway and a guided ridge hike with views of the Matterhorn.", meals: "Breakfast" },
      { day: "Day 7", title: "Lake Lucerne", description: "Paddle-steamer cruise and a farewell fondue.", meals: "Breakfast, Dinner" },
      { day: "Day 8", title: "Departure", description: "Train to Zurich airport.", meals: "Breakfast" },
    ],
  },
  {
    slug: "maldives-overwater-escape",
    title: "Maldives Overwater Escape",
    destination: "maldives",
    category: "Luxury",
    days: 5,
    price: 3450,
    rating: 4.9,
    reviews: 604,
    summary:
      "Five nights in an overwater villa with seaplane transfers, a house reef at your door and a private sandbank dinner.",
    highlights: ["Overwater villa", "Seaplane transfers", "Manta ray snorkel", "Sandbank dinner"],
    included: [...STD_INCLUDED, "Half-board dining", "Seaplane return transfers"],
    excluded: STD_EXCLUDED,
    maxGroup: 6,
    pace: "Relaxed",
    itinerary: [
      { day: "Day 1", title: "Seaplane to paradise", description: "Land in Malé and take a scenic seaplane to your resort.", meals: "Dinner" },
      { day: "Day 2", title: "Reef and lagoon", description: "Guided house-reef snorkel followed by a free afternoon.", meals: "Half-board" },
      { day: "Day 3", title: "Manta ray excursion", description: "Boat trip to a manta cleaning station and a sandbank picnic.", meals: "Half-board" },
      { day: "Day 4", title: "Private sandbank dinner", description: "A day of spa and water sports, then a candle-lit dinner on a private sandbank.", meals: "Half-board" },
      { day: "Day 5", title: "Departure", description: "Seaplane back to Malé for your flight.", meals: "Breakfast" },
    ],
  },
  {
    slug: "machu-picchu-inca-trail",
    title: "Machu Picchu Inca Trail",
    destination: "peru",
    category: "Adventure",
    days: 10,
    price: 2190,
    rating: 4.8,
    reviews: 351,
    featured: false,
    summary:
      "Acclimatise in Cusco, trek the classic 4-day Inca Trail with porters and guides, and reach Machu Picchu at sunrise.",
    highlights: ["4-day Inca Trail", "Sun Gate sunrise", "Sacred Valley", "Cusco food tour"],
    included: [...STD_INCLUDED, "Inca Trail permit and porters", "Camping equipment and trail meals"],
    excluded: STD_EXCLUDED,
    maxGroup: 12,
    pace: "Active",
    itinerary: [
      { day: "Day 1–2", title: "Cusco acclimatisation", description: "Arrive in Cusco (3,400 m). Gentle walking tour, market visit and coca-tea welcome.", meals: "Breakfast" },
      { day: "Day 3", title: "Sacred Valley", description: "Pisac ruins, Ollantaytambo and a weaving cooperative.", meals: "Breakfast, Lunch" },
      { day: "Day 4–7", title: "The Inca Trail", description: "Four days on foot through cloud forest to Dead Woman's Pass and Wiñay Wayna, arriving at the Sun Gate.", meals: "All meals" },
      { day: "Day 8", title: "Machu Picchu", description: "Guided tour of the citadel, then train back to Cusco.", meals: "Breakfast, Lunch" },
      { day: "Day 9", title: "Cusco free day", description: "Optional cooking class or rainbow-mountain day trip.", meals: "Breakfast" },
      { day: "Day 10", title: "Departure", description: "Transfer to Cusco airport.", meals: "Breakfast" },
    ],
  },
  {
    slug: "paris-romance-weekender",
    title: "Paris Romance Weekender",
    destination: "paris",
    category: "Culture",
    days: 5,
    price: 1490,
    rating: 4.6,
    reviews: 476,
    summary:
      "Five days in a boutique Marais hotel with a private Louvre hour, a Seine dinner cruise and a day trip to Versailles.",
    highlights: ["Private Louvre hour", "Seine dinner cruise", "Versailles gardens", "Montmartre food walk"],
    included: [...STD_INCLUDED, "Louvre early-access entry", "Seine dinner cruise"],
    excluded: STD_EXCLUDED,
    maxGroup: 10,
    pace: "Relaxed",
    deal: { discount: 30, departsInDays: 6, seatsLeft: 3 },
    itinerary: [
      { day: "Day 1", title: "Bonjour, Paris", description: "Hotel check-in, an evening walk along the Seine and dinner in the Marais.", meals: "Dinner" },
      { day: "Day 2", title: "Louvre and Tuileries", description: "Early-access Louvre visit followed by lunch in the Tuileries and an afternoon at Musée d'Orsay.", meals: "Breakfast" },
      { day: "Day 3", title: "Versailles", description: "Day trip to the palace and gardens with skip-the-line entry.", meals: "Breakfast, Lunch" },
      { day: "Day 4", title: "Montmartre and the Seine", description: "Morning food walk through Montmartre, free afternoon and an evening dinner cruise.", meals: "Breakfast, Dinner" },
      { day: "Day 5", title: "Departure", description: "Croissants and transfer to the airport.", meals: "Breakfast" },
    ],
  },
  {
    slug: "iceland-northern-lights",
    title: "Iceland Northern Lights Ring Road",
    destination: "iceland",
    category: "Adventure",
    days: 7,
    price: 2350,
    rating: 4.8,
    reviews: 263,
    summary:
      "Chase the aurora along the south coast: glacier hikes, ice caves, geothermal lagoons and black-sand beaches.",
    highlights: ["Aurora hunting", "Ice cave tour", "Jökulsárlón glacier lagoon", "Blue Lagoon soak"],
    included: [...STD_INCLUDED, "4x4 transport", "Glacier hike and ice cave tour", "Blue Lagoon entry"],
    excluded: STD_EXCLUDED,
    maxGroup: 12,
    pace: "Moderate",
    itinerary: [
      { day: "Day 1", title: "Reykjavik", description: "Pick-up at Keflavik, Blue Lagoon soak and city evening.", meals: "Dinner" },
      { day: "Day 2", title: "Golden Circle", description: "Thingvellir, Geysir and Gullfoss, with a night aurora hunt.", meals: "Breakfast" },
      { day: "Day 3", title: "South coast waterfalls", description: "Seljalandsfoss, Skógafoss and Reynisfjara black-sand beach.", meals: "Breakfast" },
      { day: "Day 4–5", title: "Glaciers and ice caves", description: "Guided glacier walk on Vatnajökull and a visit to Jökulsárlón.", meals: "Breakfast, Dinner" },
      { day: "Day 6", title: "Back to Reykjavik", description: "Scenic return drive and farewell dinner.", meals: "Breakfast, Dinner" },
      { day: "Day 7", title: "Departure", description: "Transfer to Keflavik airport.", meals: "Breakfast" },
    ],
  },
  {
    slug: "morocco-medina-and-desert",
    title: "Morocco Medina & Desert",
    destination: "marrakech",
    category: "Culture",
    days: 6,
    price: 1150,
    rating: 4.7,
    reviews: 318,
    summary:
      "Riads in Marrakech, a crossing of the Atlas Mountains and a night in a candle-lit camp in the Sahara.",
    highlights: ["Marrakech souks", "Atlas Mountains crossing", "Camel trek at sunset", "Desert camp"],
    included: [...STD_INCLUDED, "Riad stay in the medina", "Desert camp with dinner"],
    excluded: STD_EXCLUDED,
    maxGroup: 12,
    pace: "Moderate",
    deal: { discount: 18, departsInDays: 11, seatsLeft: 7 },
    itinerary: [
      { day: "Day 1", title: "Marrakech", description: "Arrive and settle into your riad. Evening at Jemaa el-Fnaa square.", meals: "Dinner" },
      { day: "Day 2", title: "Medina and gardens", description: "Guided souk walk, Bahia Palace and Majorelle Garden.", meals: "Breakfast" },
      { day: "Day 3", title: "Across the Atlas", description: "Drive via Tizi n'Tichka pass and Aït Benhaddou kasbah.", meals: "Breakfast, Dinner" },
      { day: "Day 4", title: "Into the Sahara", description: "Camel trek into the dunes of Merzouga and a night at camp under the stars.", meals: "Breakfast, Dinner" },
      { day: "Day 5", title: "Return to Marrakech", description: "Sunrise over the dunes then a long scenic drive back.", meals: "Breakfast" },
      { day: "Day 6", title: "Departure", description: "Transfer to the airport.", meals: "Breakfast" },
    ],
  },
  {
    slug: "tanzania-serengeti-safari",
    title: "Tanzania Serengeti Safari",
    destination: "tanzania",
    category: "Wildlife",
    days: 8,
    price: 3890,
    rating: 4.9,
    reviews: 207,
    featured: false,
    summary:
      "Eight days of game drives in the Serengeti and Ngorongoro Crater with small-group 4x4s and expert guides.",
    highlights: ["Serengeti game drives", "Ngorongoro Crater floor", "Great Migration (seasonal)", "Maasai village visit"],
    included: [...STD_INCLUDED, "Full-board lodge and tented-camp stays", "Park fees and 4x4 safari vehicle"],
    excluded: STD_EXCLUDED,
    maxGroup: 6,
    pace: "Moderate",
    itinerary: [
      { day: "Day 1", title: "Arusha", description: "Arrive at Kilimanjaro airport and transfer to your lodge.", meals: "Dinner" },
      { day: "Day 2", title: "Tarangire", description: "First game drive among baobabs and elephant herds.", meals: "Full board" },
      { day: "Day 3", title: "Lake Manyara and Karatu", description: "Tree-climbing lions and flamingos, then on to the Ngorongoro highlands.", meals: "Full board" },
      { day: "Day 4", title: "Ngorongoro Crater", description: "Descend onto the crater floor for rhino, hippo and big cats.", meals: "Full board" },
      { day: "Day 5–7", title: "Serengeti", description: "Three days following the herds with early-morning and sunset drives.", meals: "Full board" },
      { day: "Day 8", title: "Departure", description: "Bush flight to Arusha and onward connection.", meals: "Breakfast" },
    ],
  },
  {
    slug: "amalfi-coast-slow-travel",
    title: "Amalfi Coast Slow Travel",
    destination: "amalfi",
    category: "Beach",
    days: 7,
    price: 2150,
    rating: 4.8,
    reviews: 392,
    summary:
      "Seven days between Positano and Capri: boat days, the Path of the Gods and cooking in a lemon grove.",
    highlights: ["Path of the Gods hike", "Capri boat day", "Lemon-grove cooking class", "Positano stay"],
    included: [...STD_INCLUDED, "Private boat day to Capri", "Cooking class"],
    excluded: STD_EXCLUDED,
    maxGroup: 10,
    pace: "Relaxed",
    itinerary: [
      { day: "Day 1", title: "Naples to Positano", description: "Private transfer along the coast road to your hotel.", meals: "Dinner" },
      { day: "Day 2", title: "Positano", description: "Beach club, boutiques and a sunset aperitivo.", meals: "Breakfast" },
      { day: "Day 3", title: "Path of the Gods", description: "A guided walk from Bomerano to Nocelle with sweeping coastal views.", meals: "Breakfast, Lunch" },
      { day: "Day 4", title: "Capri", description: "Private boat to Capri, the Blue Grotto and a long seafood lunch.", meals: "Breakfast, Lunch" },
      { day: "Day 5–6", title: "Ravello and Amalfi", description: "Villa Cimbrone gardens, Amalfi cathedral and a lemon-grove cooking class.", meals: "Breakfast" },
      { day: "Day 7", title: "Departure", description: "Transfer to Naples.", meals: "Breakfast" },
    ],
  },
  {
    slug: "thailand-island-hopping",
    title: "Thailand Island Hopping",
    destination: "thailand",
    category: "Beach",
    days: 10,
    price: 1450,
    rating: 4.6,
    reviews: 521,
    summary:
      "Ten days across Phuket, Phi Phi and Krabi by longtail boat with kayaking, snorkelling and night markets.",
    highlights: ["Phi Phi islands", "Railay Beach climbing", "Kayak the sea caves", "Phuket Old Town"],
    included: [...STD_INCLUDED, "Island boat transfers", "Sea-kayaking day"],
    excluded: STD_EXCLUDED,
    maxGroup: 14,
    pace: "Moderate",
    deal: { discount: 20, departsInDays: 12, seatsLeft: 8 },
    itinerary: [
      { day: "Day 1–2", title: "Phuket", description: "Old Town walk, street food and a beach day on Kata.", meals: "Breakfast" },
      { day: "Day 3–5", title: "Phi Phi Islands", description: "Ferry to Phi Phi, Maya Bay by longtail and a sunset viewpoint hike.", meals: "Breakfast" },
      { day: "Day 6–8", title: "Krabi and Railay", description: "Four-island tour, beginner rock climbing and a quiet beach.", meals: "Breakfast" },
      { day: "Day 9", title: "Sea kayaking", description: "Paddle through mangroves and sea caves in Ao Thalane.", meals: "Breakfast, Lunch" },
      { day: "Day 10", title: "Departure", description: "Transfer to Krabi airport.", meals: "Breakfast" },
    ],
  },
  {
    slug: "cappadocia-balloon-weekend",
    title: "Cappadocia Balloon Weekend",
    destination: "cappadocia",
    category: "Culture",
    days: 4,
    price: 980,
    rating: 4.7,
    reviews: 244,
    summary:
      "Four days in a cave hotel with a sunrise balloon flight, underground city and valley hikes.",
    highlights: ["Sunrise balloon flight", "Göreme open-air museum", "Derinkuyu underground city", "Pottery in Avanos"],
    included: [...STD_INCLUDED, "Hot-air balloon flight (about 1 hour)"],
    excluded: STD_EXCLUDED,
    maxGroup: 12,
    pace: "Relaxed",
    deal: { discount: 25, departsInDays: 7, seatsLeft: 5 },
    itinerary: [
      { day: "Day 1", title: "Arrival in Göreme", description: "Transfer to your cave hotel and a sunset walk to Love Valley.", meals: "Dinner" },
      { day: "Day 2", title: "Balloon flight", description: "Pre-dawn balloon flight, champagne breakfast and an afternoon in Göreme Open-Air Museum.", meals: "Breakfast" },
      { day: "Day 3", title: "Underground and pottery", description: "Derinkuyu underground city and a hands-on pottery workshop in Avanos.", meals: "Breakfast, Lunch" },
      { day: "Day 4", title: "Departure", description: "Transfer to Kayseri airport.", meals: "Breakfast" },
    ],
  },
  {
    slug: "canadian-rockies-lakes",
    title: "Canadian Rockies & Lakes",
    destination: "banff",
    category: "Adventure",
    days: 7,
    price: 2260,
    rating: 4.8,
    reviews: 298,
    summary:
      "Banff, Lake Louise and the Icefields Parkway: canoeing, alpine hikes and hot springs.",
    highlights: ["Moraine Lake canoe", "Icefields Parkway drive", "Johnston Canyon", "Banff hot springs"],
    included: [...STD_INCLUDED, "Rental SUV or guided minibus", "Canoe rental and park pass"],
    excluded: STD_EXCLUDED,
    maxGroup: 10,
    pace: "Active",
    itinerary: [
      { day: "Day 1", title: "Calgary to Banff", description: "Pick-up in Calgary and a scenic drive to Banff.", meals: "Dinner" },
      { day: "Day 2", title: "Banff townsite", description: "Gondola summit, Bow Falls and the Upper Hot Springs.", meals: "Breakfast" },
      { day: "Day 3", title: "Lake Louise & Moraine", description: "Canoeing and the Plain of Six Glaciers trail.", meals: "Breakfast" },
      { day: "Day 4–5", title: "Icefields Parkway", description: "Peyto Lake, Athabasca Glacier and Jasper.", meals: "Breakfast" },
      { day: "Day 6", title: "Johnston Canyon", description: "Catwalks, waterfalls and a farewell dinner.", meals: "Breakfast, Dinner" },
      { day: "Day 7", title: "Departure", description: "Transfer to Calgary airport.", meals: "Breakfast" },
    ],
  },
];

export const getDestination = (slug: string) => DESTINATIONS.find((d) => d.slug === slug);
export const getPackage = (slug: string) => PACKAGES.find((p) => p.slug === slug);
export const packagesFor = (destination: string) => PACKAGES.filter((p) => p.destination === destination);
export const packageImage = (p: TravelPackage) => getDestination(p.destination)?.image ?? DESTINATIONS[0].image;
export const dealPrice = (p: TravelPackage) =>
  p.deal ? Math.round(p.price * (1 - p.deal.discount / 100)) : p.price;
export const DEALS = PACKAGES.filter((p) => p.deal);
export const FEATURED = PACKAGES.find((p) => p.featured)!;

export const PRICE_MIN = 500;
export const PRICE_MAX = 4500;

export const DURATION_FILTERS = [
  { id: "any", label: "Any", test: (d: number) => d > 0 },
  { id: "short", label: "1–5 days", test: (d: number) => d <= 5 },
  { id: "medium", label: "6–8 days", test: (d: number) => d >= 6 && d <= 8 },
  { id: "long", label: "9+ days", test: (d: number) => d >= 9 },
] as const;
export type DurationId = (typeof DURATION_FILTERS)[number]["id"];

export interface Review {
  name: string;
  trip: string;
  location: string;
  avatar: string;
  rating: number;
  date: string;
  quote: string;
  tag: string;
}

const face = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=400&h=400&q=75`;

export const REVIEWS: Review[] = [
  {
    name: "Sienna Laurent",
    trip: "Santorini Sunset Escape",
    location: "Lyon, France",
    avatar: face("1494790108377-be9c29b29330"),
    rating: 5,
    date: "14 Mar 2026",
    tag: "Anniversary trip",
    quote: "Our host had a table waiting at a taverna no guidebook mentions. We were back in the cave suite by sunset every night. I have never felt so looked after.",
  },
  {
    name: "Henrik Lindqvist",
    trip: "Iceland Northern Lights",
    location: "Stockholm, Sweden",
    avatar: face("1507003211169-0a1dd7228f2d"),
    rating: 5,
    date: "28 Apr 2026",
    tag: "Aurora chase",
    quote: "Cloud was forecast on night two. Our guide drove us two hours to a clear gap, and the sky lit up green. That is what you pay for.",
  },
  {
    name: "Camille Moreau",
    trip: "Kyoto Cherry Blossom Journey",
    location: "London, UK",
    avatar: face("1534528741775-53994a69daeb"),
    rating: 5,
    date: "19 May 2026",
    tag: "Solo traveller",
    quote: "Travelling alone, I worried about feeling like a tourist. Instead I had a tea ceremony in a house with no sign, and a group who became friends.",
  },
  {
    name: "Devon Mercer",
    trip: "Tanzania Serengeti Safari",
    location: "Austin, USA",
    avatar: face("1539571696357-5a69c17a67c6"),
    rating: 5,
    date: "04 Jun 2026",
    tag: "Family safari",
    quote: "Six of us, three generations, one vehicle. The guide found a leopard on day two and my dad cried. Nobody rushed us once.",
  },
  {
    name: "Mei-Ling Sato",
    trip: "Maldives Overwater Escape",
    location: "Singapore",
    avatar: face("1517841905240-472988babdf9"),
    rating: 5,
    date: "21 Jul 2026",
    tag: "Honeymoon",
    quote: "The sandbank dinner was perfect. When our seaplane was delayed, the resort and Wayfare sorted a free night upgrade before we even asked.",
  },
  {
    name: "Lukas Richter",
    trip: "Swiss Alps Explorer",
    location: "Berlin, Germany",
    avatar: face("1500648767791-00dcc994a43e"),
    rating: 5,
    date: "09 Aug 2026",
    tag: "Hiking group",
    quote: "Every transfer connected on the minute and the hikes matched our level. I did not open a map once in eight days.",
  },
];

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: "Guides" | "Tips" | "Stories";
  author: string;
  date: string;
  readMinutes: number;
  image: string;
  body: string[];
}

export const BLOG: BlogPost[] = [
  {
    slug: "when-to-visit-japan",
    title: "When to visit Japan: a season-by-season guide",
    excerpt: "Cherry blossoms get the headlines, but autumn leaves and quiet winters are just as good. Here is how to choose.",
    category: "Guides",
    author: "Aiko Tanaka",
    date: "2026-10-28",
    readMinutes: 7,
    image: DESTINATIONS[2].image,
    body: [
      "Japan changes character every few weeks. Spring brings the cherry blossoms, summer brings festivals and humidity, autumn paints the temples red and gold, and winter quietly empties the cities.",
      "If it is your first visit, aim for late March to mid April or late October to mid November. These are the busiest weeks, so book accommodation at least four months ahead.",
      "For fewer crowds, consider early December or February. You will trade blossoms for crisp air, hot noodles and onsen soaks. In Hokkaido, winter is peak season for snow festivals.",
      "Whenever you go, build a slow day into the middle of the trip. Japan rewards wandering with no fixed plan.",
    ],
  },
  {
    slug: "pack-light-two-weeks",
    title: "How to pack for two weeks in a single carry-on",
    excerpt: "Our hosts travel more than 200 days a year. This is what they pack, and what they leave behind.",
    category: "Tips",
    author: "Marco Bellini",
    date: "2026-10-12",
    readMinutes: 5,
    image: DESTINATIONS[3].image,
    body: [
      "Start with a colour palette. Three tops, two bottoms and one layer that work together make more outfits than ten random items.",
      "Roll soft items, fold structured ones and keep shoes to two pairs: one for walking, one for evenings.",
      "A small laundry kit (a travel wash bag and a clothesline) replaces a week of clothes. Most hotels will also do a quick wash for a small fee.",
      "Leave room for souvenirs. A foldable tote weighs nothing and gives you somewhere to put them.",
    ],
  },
  {
    slug: "safari-first-timers",
    title: "First safari? What nobody tells you",
    excerpt: "Dust, early mornings and long stretches of nothing before a lion appears. Here is what to expect.",
    category: "Guides",
    author: "Neema Mwangi",
    date: "2026-09-30",
    readMinutes: 8,
    image: DESTINATIONS[9].image,
    body: [
      "Game drives start at dawn because animals are most active in the cool hours. Expect a 5:30 alarm, a flask of coffee and a lot of patience.",
      "Pack neutral colours, a scarf for dust and binoculars. Many lodges lend binoculars, but your own are worth the weight.",
      "Choose your guide as carefully as your lodge. A great guide reads tracks, calls and the behaviour of other vehicles to find animals.",
      "Finally, put your phone down for at least one sighting. The best photograph is rarely better than the memory.",
    ],
  },
  {
    slug: "greek-islands-shoulder-season",
    title: "Why shoulder season is the best time for the Greek islands",
    excerpt: "Warm sea, empty tavernas and half-price villas. Early June and late September are the sweet spot.",
    category: "Tips",
    author: "Elena Papadakis",
    date: "2026-09-14",
    readMinutes: 4,
    image: DESTINATIONS[1].image,
    body: [
      "By early June the sea is warm enough for swimming and the ferries are running full schedules, but the August crowds have not arrived.",
      "September is even better: the water is at its warmest, grape harvests begin and many islands hold small festivals.",
      "Hotels can be 30 to 40 percent cheaper than in peak summer, and sunset tables do not need booking weeks ahead.",
    ],
  },
  {
    slug: "a-night-in-the-sahara",
    title: "A night in the Sahara: our guide's diary",
    excerpt: "Camel steps, mint tea and a sky with more stars than you thought possible.",
    category: "Stories",
    author: "Youssef El Idrissi",
    date: "2026-08-25",
    readMinutes: 6,
    image: DESTINATIONS[8].image,
    body: [
      "We leave the village at four in the afternoon, when the dunes turn orange. The camels move slowly and no one speaks for the first twenty minutes.",
      "At camp, tea is poured from a height into small glasses. Dinner is a tagine cooked in the sand, followed by drumming around the fire.",
      "Later, walk away from the lights and lie down on a dune. The Milky Way is clear enough to cast a faint shadow.",
    ],
  },
  {
    slug: "travel-insurance-explained",
    title: "Travel insurance, explained in plain English",
    excerpt: "What is covered, what is not, and when it actually pays out.",
    category: "Tips",
    author: "Dana Whitfield",
    date: "2026-08-02",
    readMinutes: 6,
    image: DESTINATIONS[6].image,
    body: [
      "Good travel insurance covers medical care abroad, trip cancellation and lost luggage. Cheap policies often exclude pre-existing conditions and adventure activities.",
      "Check the medical cover limit. For the US and Canada we recommend at least $1 million.",
      "Keep receipts, take photographs and report incidents to the local authorities as soon as they happen. Claims are approved quicker with evidence.",
    ],
  },
];

export const getPost = (slug: string) => BLOG.find((p) => p.slug === slug);

export const WHY_US = [
  { icon: "Compass", title: "Local hosts, not call centres", text: "Every trip has a named Wayfare host who lives in the destination and stays with the group from arrival to departure." },
  { icon: "ShieldCheck", title: "Free changes up to 30 days out", text: "Plans move. Change dates or travellers up to 30 days before departure with no fee." },
  { icon: "Wallet", title: "No hidden costs", text: "The price you see covers transfers, stays and activities. What is not included is listed on every trip page." },
  { icon: "Headset", title: "24/7 support on the ground", text: "A real person answers the trip line at any hour, in your language." },
  { icon: "Leaf", title: "Travel that gives back", text: "Small groups, locally owned stays and a share of every booking goes to community projects in the places we visit." },
  { icon: "Users", title: "Small groups, big memories", text: "Groups of 6 to 14 people, so experiences stay personal and access stays easy." },
] as const;

export const FAQS = [
  { q: "Can I change or cancel my booking?", a: "Yes. You can change dates or traveller details free of charge up to 30 days before departure. Cancellations up to 45 days before receive a full refund; later cancellations follow the schedule shown at checkout." },
  { q: "Are flights included?", a: "Flights are not included so you can fly from your own airport. Our team can recommend routes and suggested arrival times for every trip." },
  { q: "Is travel insurance mandatory?", a: "We strongly recommend it. You can add our partner policy at checkout or bring your own." },
  { q: "How do I pay?", a: "Pay a 25% deposit at booking and the balance 45 days before departure. Last-minute bookings (under 45 days) are paid in full." },
  { q: "Can you organise private or custom trips?", a: "Yes. Tell us your dates, group size and interests using the contact form and we will send an itinerary within two working days." },
];
