// Content for the Ember & Oak site. Photos are Unsplash images; the guests'
// faces and the review quotes are placeholder copy for the demo.

export const unsplash = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;

export const PHOTO = {
  tasting: "1414235077428-338989a2e8c0",
  diningRoom: "1517248135467-4c7edcad34c4",
  terrace: "1559339352-11d035aa65de",
  wagyu: "1504674900247-0877df9cc836",
  ribs: "1544025162-d76694265947",
  salmon: "1467003909585-2f8a72700288",
  porkChop: "1432139555190-58524dae6a55",
  steakFrites: "1600891964092-4316c288032e",
  dessert: "1565958011703-44f9829ba187",
  cocktail: "1470337458703-46ad1756a187",
  bar: "1514933651103-005eec06c04b",
  knife: "1551218808-94e220e084d2",
} as const;

export const FACES = [
  "https://res.cloudinary.com/dodndg7ai/image/upload/f_webp,q_auto,w_160,c_limit/v1790158812/pexels-photo-2379004-1790158812208.jpg",
  "https://res.cloudinary.com/dodndg7ai/image/upload/f_webp,q_auto,w_160,c_limit/v1790158810/pexels-photo-220453-1790158812206.jpg",
  "https://res.cloudinary.com/dodndg7ai/image/upload/f_webp,q_auto,w_160,c_limit/v1790158812/pexels-photo-2381069-1790158812209.jpg",
  "https://res.cloudinary.com/dodndg7ai/image/upload/f_webp,q_auto,w_160,c_limit/v1790158812/pexels-photo-1130626-1790158812207.jpg",
  "https://res.cloudinary.com/dodndg7ai/image/upload/f_webp,q_auto,w_160,c_limit/v1790158812/pexels-photo-3785079-1790158812209.jpg",
];

export const RESTAURANT = {
  name: "Ember & Oak",
  phone: "(212) 555-0142",
  phoneHref: "tel:+12125550142",
  email: "hello@emberandoak.com",
  address: ["118 Hearth Lane", "Brooklyn, NY 11201"],
};

export const DISHES = [
  {
    name: "Oak-Fired Wagyu Striploin",
    description: "A5 striploin seared over live oak, black garlic jus, charred shallot, wild cress.",
    price: "$62",
    tag: "House signature",
    image: unsplash(PHOTO.wagyu, 1000),
  },
  {
    name: "Cedar-Plank Salmon",
    description: "Line-caught salmon smoked on cedar, heirloom tomato salsa, brown butter hollandaise.",
    price: "$44",
    tag: "From the hearth",
    image: unsplash(PHOTO.salmon, 1000),
  },
  {
    name: "Smoked Apple Pork Chop",
    description: "Heritage pork rested on hay ash, roasted apple, sage and a cider reduction.",
    price: "$48",
    tag: "Seasonal",
    image: unsplash(PHOTO.porkChop, 1000),
  },
  {
    name: "Lacquered Short Rib",
    description: "Twelve-hour braise glazed in maple and smoked chilli, pickled radish, bone marrow.",
    price: "$52",
    tag: "Chef's pick",
    image: unsplash(PHOTO.ribs, 1000),
  },
  {
    name: "Ember Garden Plate",
    description: "Cinder-roasted leeks, brown butter emulsion, toasted hazelnut, garden herbs.",
    price: "$28",
    tag: "Vegetarian",
    image: unsplash(PHOTO.tasting, 1000),
  },
  {
    name: "Raspberry Oak Mille-Feuille",
    description: "Layers of caramelised pastry, oak-smoked cream and fresh raspberries.",
    price: "$17",
    tag: "To finish",
    image: unsplash(PHOTO.dessert, 1000),
  },
];

export const STATS = [
  { value: "2014", label: "Lit our first fire" },
  { value: "12", label: "Local farms we cook with" },
  { value: "420", label: "Labels in the cellar" },
];

export const REVIEWS = [
  {
    id: "1",
    name: "Tamar Mendelson",
    role: "Restaurant Critic",
    company: "The Daily Plate",
    avatar: FACES[0],
    rating: 5,
    content:
      "The wagyu alone is worth the trip. You can taste the oak in every bite, and the service moves like a quiet piece of theatre.",
  },
  {
    id: "2",
    name: "Julien Marchand",
    role: "Food Editor",
    company: "Gazette Gourmand",
    avatar: FACES[1],
    rating: 5,
    content:
      "Cooking over live fire sounds simple until you taste how precise it is here. The best tasting menu in Brooklyn this year.",
  },
  {
    id: "3",
    name: "Priya Raman",
    role: "Sommelier & Writer",
    company: "Cork & Hearth",
    avatar: FACES[2],
    rating: 5,
    content:
      "A cellar that rewards curiosity. The pairing for the short rib made the table go quiet, which is the highest compliment I know.",
  },
  {
    id: "4",
    name: "Marcus Bell",
    role: "Dining Columnist",
    company: "Table Notes",
    avatar: FACES[3],
    rating: 5,
    content:
      "Warm room, candlelight and a kitchen that never shows off. We stayed three hours and wanted a fourth.",
  },
  {
    id: "5",
    name: "Elena Rossi",
    role: "Travel & Dining Writer",
    company: "Savory Quarterly",
    avatar: FACES[4],
    rating: 5,
    content:
      "I came for the fire and stayed for the dessert. The mille-feuille is the kind of dish you describe to friends for weeks.",
  },
];

export const JOINED = [
  { name: "Iris", avatar: FACES[0], when: "just now" },
  { name: "Ben", avatar: FACES[1], when: "2 min ago" },
  { name: "Omar", when: "15 min ago" },
  { name: "Lucia", avatar: FACES[2], when: "1 hr ago" },
  { name: "Noah", when: "3 hr ago" },
];

export const OFFER_IMAGES = [
  PHOTO.wagyu,
  PHOTO.salmon,
  PHOTO.porkChop,
  PHOTO.ribs,
  PHOTO.dessert,
  PHOTO.tasting,
  PHOTO.cocktail,
  PHOTO.diningRoom,
  PHOTO.bar,
  PHOTO.knife,
  PHOTO.terrace,
  PHOTO.steakFrites,
].map((id) => unsplash(id, 700));
