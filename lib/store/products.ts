// ---------------------------------------------------------------------------
// Catalogue — static demo data for the AVARA storefront.
// ---------------------------------------------------------------------------

export type CategoryId = "dresses" | "outerwear" | "tops" | "knitwear" | "tailoring" | "accessories";

export interface Category {
  id: CategoryId;
  name: string;
  blurb: string;
  image: string;
}

export interface ProductColor {
  name: string;
  /** Any CSS colour, used for the swatch. */
  hex: string;
  /** Index into `Product.images` shown when this colour is selected. */
  image: number;
}

export type ProductBadge = "New" | "Sale" | "Bestseller";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategoryId;
  price: number;
  compareAt?: number;
  badge?: ProductBadge;
  isNew?: boolean;
  featured?: boolean;
  flashSale?: boolean;
  rating: number;
  reviews: number;
  /** Rank used for "popular" sorting. */
  sold: number;
  /** Release order, higher = newer. */
  released: number;
  blurb: string;
  description: string;
  details: string[];
  fabric: string;
  colors: ProductColor[];
  sizes: string[];
  images: string[];
  /** Flat colour behind the cut-out, used by cards. */
  tone: string;
}

/** Unsplash photo URL at a given width. */
export const photo = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;

const APPAREL = ["XS", "S", "M", "L", "XL"];
const SHOE = ["40", "41", "42", "43", "44"];

export const categories: Category[] = [
  { id: "dresses", name: "Dresses", blurb: "Statement silhouettes, day to night", image: photo("1572804013309-59a88b7e92f1", 700) },
  { id: "outerwear", name: "Outerwear", blurb: "Coats and jackets that do the talking", image: photo("1539109136881-3be0616acf4b", 700) },
  { id: "tops", name: "Tops & Tees", blurb: "Everyday basics, elevated", image: photo("1521572163474-6864f9cf17ab", 700) },
  { id: "knitwear", name: "Knitwear", blurb: "Texture-first layers", image: photo("1434389677669-e08b4cac3105", 700) },
  { id: "tailoring", name: "Tailoring", blurb: "Sharp cuts, soft structure", image: photo("1594938298603-c8148c4dae35", 700) },
  { id: "accessories", name: "Accessories", blurb: "Finishing touches and footwear", image: photo("1542291026-7eec264c27ff", 700) },
];

export const products: Product[] = [
  {
    id: "p01",
    slug: "marigold-wrap-dress",
    name: "Marigold Wrap Dress",
    category: "dresses",
    price: 128,
    compareAt: 168,
    badge: "Sale",
    flashSale: true,
    featured: true,
    rating: 4.8,
    reviews: 214,
    sold: 980,
    released: 9,
    blurb: "A floral wrap with a cinched waist and swishy skirt.",
    description:
      "Cut on the bias so it moves when you do, the Marigold wraps and ties at the waist for a fit that flatters without fuss. Printed in a bold poppy floral on a crisp, breathable viscose.",
    details: ["Wrap front with self-tie waist", "Flutter sleeves", "Midi length, hits below the knee", "Concealed side zip"],
    fabric: "100% LENZING™ viscose. Cool hand-wash or dry clean.",
    colors: [
      { name: "Poppy", hex: "#c8322b", image: 0 },
      { name: "Marigold", hex: "#e8a317", image: 0 },
      { name: "Ink", hex: "#1f1f24", image: 0 },
    ],
    sizes: APPAREL,
    images: [photo("1572804013309-59a88b7e92f1", 1100)],
    tone: "#f3b447",
  },
  {
    id: "p02",
    slug: "violet-off-shoulder-gown",
    name: "Violet Off-Shoulder Gown",
    category: "dresses",
    price: 189,
    badge: "New",
    isNew: true,
    featured: true,
    rating: 4.9,
    reviews: 96,
    sold: 420,
    released: 20,
    blurb: "Sculpted bodice, floor-skimming drape.",
    description:
      "An evening gown made for entrances. The structured off-shoulder neckline is boned for support and flows into a column skirt in satin-backed crepe.",
    details: ["Boned off-shoulder bodice", "Satin-backed crepe", "Back zip with hook-and-eye", "Floor length"],
    fabric: "Recycled polyester crepe. Dry clean only.",
    colors: [
      { name: "Plum", hex: "#5b1a4f", image: 0 },
      { name: "Midnight", hex: "#14142b", image: 0 },
    ],
    sizes: APPAREL,
    images: [photo("1566174053879-31528523f8ae", 1100)],
    tone: "#8d7bd1",
  },
  {
    id: "p03",
    slug: "blush-ruffle-dress",
    name: "Blush Ruffle Dress",
    category: "dresses",
    price: 142,
    badge: "Bestseller",
    rating: 4.7,
    reviews: 312,
    sold: 1320,
    released: 6,
    blurb: "Romantic volume in a polka-dot chiffon.",
    description:
      "Puffed sleeves, a ruffled neckline and a gathered skirt give this chiffon dress its romantic shape. Lined, lightweight and ready for golden-hour photos.",
    details: ["Elasticated off-shoulder neckline", "Balloon sleeves", "Fully lined", "Knee length"],
    fabric: "100% polyester chiffon, lined. Machine wash cold.",
    colors: [
      { name: "Blush", hex: "#f1c4cf", image: 0 },
      { name: "Cream", hex: "#f3ead8", image: 0 },
    ],
    sizes: APPAREL,
    images: [photo("1581044777550-4cfa60707c03", 1100)],
    tone: "#e9b6a3",
  },
  {
    id: "p04",
    slug: "meadow-floral-midi",
    name: "Meadow Floral Midi",
    category: "dresses",
    price: 116,
    rating: 4.6,
    reviews: 148,
    sold: 610,
    released: 3,
    blurb: "Breezy wrap midi for seaside weekends.",
    description:
      "A relaxed floral wrap midi that catches the breeze. Soft pleats at the hem add movement, and the adjustable tie keeps the fit forgiving.",
    details: ["Adjustable wrap tie", "Soft pleated hem", "Side-seam pockets", "Midi length"],
    fabric: "Cotton-viscose blend. Machine wash 30°.",
    colors: [{ name: "Ivory floral", hex: "#efe6d4", image: 0 }],
    sizes: APPAREL,
    images: [photo("1496747611176-843222e1e57c", 1100)],
    tone: "#a8c4e8",
  },
  {
    id: "p05",
    slug: "milano-wool-coat",
    name: "Milano Wool Coat",
    category: "outerwear",
    price: 248,
    compareAt: 320,
    badge: "Sale",
    flashSale: true,
    featured: true,
    rating: 4.9,
    reviews: 187,
    sold: 760,
    released: 11,
    blurb: "A powder-blue overcoat with a longline drape.",
    description:
      "Cut from a brushed wool blend, the Milano falls long and clean with a hidden placket and deep pockets. Made to be thrown over everything from tees to tailoring.",
    details: ["Longline, relaxed fit", "Concealed button placket", "Deep welt pockets", "Fully lined"],
    fabric: "70% wool, 30% recycled polyamide. Dry clean only.",
    colors: [
      { name: "Powder", hex: "#9fb8d6", image: 0 },
      { name: "Stone", hex: "#c9c0b1", image: 0 },
    ],
    sizes: APPAREL,
    images: [photo("1539109136881-3be0616acf4b", 1100)],
    tone: "#a9bfd9",
  },
  {
    id: "p06",
    slug: "bordeaux-tailored-coat",
    name: "Bordeaux Tailored Coat",
    category: "outerwear",
    price: 268,
    badge: "New",
    isNew: true,
    rating: 4.8,
    reviews: 74,
    sold: 310,
    released: 19,
    blurb: "High collar, nipped waist, wine-dark wool.",
    description:
      "A tailored coat with a statement collar and a slightly nipped waist. The deep Bordeaux wool is dense and warm without feeling heavy.",
    details: ["Funnel collar", "Nipped waist", "Zip front with storm flap", "Interior phone pocket"],
    fabric: "Wool-blend twill. Dry clean only.",
    colors: [
      { name: "Bordeaux", hex: "#5a1d28", image: 0 },
      { name: "Charcoal", hex: "#3a3a3f", image: 0 },
    ],
    sizes: APPAREL,
    images: [photo("1483985988355-763728e1935b", 1100)],
    tone: "#6e2433",
  },
  {
    id: "p07",
    slug: "rust-bomber-jacket",
    name: "Rust Bomber Jacket",
    category: "outerwear",
    price: 164,
    rating: 4.5,
    reviews: 203,
    sold: 840,
    released: 5,
    blurb: "Lightweight bomber in a warm clay tone.",
    description:
      "A clean, unlined bomber with ribbed trims and a matte water-repellent shell. Light enough for transitional weather, smart enough for the office.",
    details: ["Water-repellent shell", "Ribbed collar, cuffs and hem", "Zip pockets", "Regular fit"],
    fabric: "100% recycled nylon. Machine wash cold.",
    colors: [
      { name: "Clay", hex: "#c0714f", image: 0 },
      { name: "Olive", hex: "#6b6a45", image: 0 },
      { name: "Black", hex: "#1c1c1c", image: 0 },
    ],
    sizes: APPAREL,
    images: [photo("1591047139829-d91aecb6caea", 1100)],
    tone: "#d9a58d",
  },
  {
    id: "p08",
    slug: "noir-leather-biker",
    name: "Noir Leather Biker",
    category: "outerwear",
    price: 329,
    badge: "Bestseller",
    featured: true,
    rating: 4.9,
    reviews: 421,
    sold: 1510,
    released: 2,
    blurb: "The one that gets better with age.",
    description:
      "Full-grain lambskin leather with an asymmetric zip, notch lapels and silver hardware. Soft from day one and built to develop its own patina.",
    details: ["Full-grain lambskin", "Asymmetric zip front", "Quilted shoulder panels", "Fully lined"],
    fabric: "100% lambskin leather, viscose lining. Specialist leather clean.",
    colors: [{ name: "Noir", hex: "#141414", image: 0 }],
    sizes: APPAREL,
    images: [photo("1551028719-00167b16eac5", 1100)],
    tone: "#c8c8c8",
  },
  {
    id: "p09",
    slug: "essential-tee",
    name: "Essential Crew Tee",
    category: "tops",
    price: 38,
    badge: "Bestseller",
    flashSale: true,
    compareAt: 48,
    rating: 4.7,
    reviews: 1204,
    sold: 4200,
    released: 1,
    blurb: "Heavyweight cotton that holds its shape.",
    description:
      "A 220gsm cotton tee that drapes properly. Garment-dyed for a lived-in finish, with a ribbed neckline that won't stretch out.",
    details: ["220gsm combed cotton", "Garment-dyed", "Ribbed crew neck", "Boxy-regular fit"],
    fabric: "100% organic cotton. Machine wash 30°.",
    colors: [
      { name: "White", hex: "#f6f4ef", image: 0 },
      { name: "Black", hex: "#17171a", image: 1 },
    ],
    sizes: APPAREL,
    images: [photo("1521572163474-6864f9cf17ab", 1100), photo("1583743814966-8936f5b7be1a", 1100)],
    tone: "#dedad0",
  },
  {
    id: "p10",
    slug: "peace-graphic-tee",
    name: "Peace Graphic Tee",
    category: "tops",
    price: 46,
    rating: 4.4,
    reviews: 289,
    sold: 1180,
    released: 7,
    blurb: "Cropped fit with a hand-drawn skeleton hand.",
    description:
      "A cropped tee with a soft-touch screen print and slightly cropped hem. Pairs with high-rise denim and little else.",
    details: ["Soft-touch screen print", "Cropped length", "Relaxed shoulder", "Pre-washed"],
    fabric: "100% cotton jersey. Machine wash cold, inside out.",
    colors: [{ name: "Black", hex: "#18181a", image: 0 }],
    sizes: APPAREL,
    images: [photo("1503342217505-b0a15ec3261c", 1100)],
    tone: "#f0b4bf",
  },
  {
    id: "p11",
    slug: "trail-graphic-tee",
    name: "Trail Graphic Tee",
    category: "tops",
    price: 44,
    rating: 4.5,
    reviews: 167,
    sold: 720,
    released: 4,
    blurb: "Soft white tee with a trail-map print.",
    description:
      "Lightweight slub cotton with a vintage-style print across the chest. Relaxed, easy and gets softer every wash.",
    details: ["Slub cotton jersey", "Vintage-style print", "Relaxed fit", "Tag-free neck"],
    fabric: "100% cotton. Machine wash cold.",
    colors: [{ name: "Off-white", hex: "#f3efe6", image: 0 }],
    sizes: APPAREL,
    images: [photo("1554568218-0f1715e72254", 1100)],
    tone: "#e4e1da",
  },
  {
    id: "p12",
    slug: "sol-lounge-set",
    name: "Sol Lounge Set",
    category: "tops",
    price: 112,
    badge: "New",
    isNew: true,
    rating: 4.8,
    reviews: 58,
    sold: 260,
    released: 18,
    blurb: "Cropped hoodie and joggers in sunshine yellow.",
    description:
      "A matching brushed-back fleece set. The cropped hoodie and tapered joggers are made to be worn together or split into separates.",
    details: ["Brushed-back fleece", "Cropped hoodie with kangaroo pocket", "Tapered joggers with drawcord", "Sold as a set"],
    fabric: "80% cotton, 20% recycled polyester. Machine wash 30°.",
    colors: [
      { name: "Sol yellow", hex: "#f2b51d", image: 0 },
      { name: "Fog", hex: "#c9ccd1", image: 0 },
    ],
    sizes: APPAREL,
    images: [photo("1515886657613-9f3515b0c78f", 1100)],
    tone: "#f2c744",
  },
  {
    id: "p13",
    slug: "dune-fringe-poncho",
    name: "Dune Fringe Poncho",
    category: "knitwear",
    price: 96,
    rating: 4.6,
    reviews: 88,
    sold: 390,
    released: 8,
    blurb: "Open-knit poncho with a tasselled hem.",
    description:
      "An airy open-knit poncho that works as a beach cover-up or an easy layer over summer dresses. Tasselled hem, generous drape.",
    details: ["Open-knit construction", "Tasselled hem", "One size fits most", "Layers over anything"],
    fabric: "Organic cotton blend. Hand wash cold, dry flat.",
    colors: [{ name: "Oat", hex: "#e8dcc4", image: 0 }],
    sizes: ["One size"],
    images: [photo("1434389677669-e08b4cac3105", 1100)],
    tone: "#e3d6bd",
  },
  {
    id: "p14",
    slug: "terra-colorblock-sweater",
    name: "Terra Colour-block Sweater",
    category: "knitwear",
    price: 118,
    compareAt: 148,
    badge: "Sale",
    flashSale: true,
    rating: 4.7,
    reviews: 132,
    sold: 540,
    released: 10,
    blurb: "Chunky knit in ember and cream.",
    description:
      "A cosy colour-block jumper knitted in a soft lambswool blend. Slightly cropped and roomy through the body.",
    details: ["Lambswool blend", "Colour-block chevron", "Ribbed trims", "Relaxed fit"],
    fabric: "60% lambswool, 40% cotton. Hand wash cold.",
    colors: [{ name: "Ember", hex: "#b5623a", image: 0 }],
    sizes: APPAREL,
    images: [photo("1475180098004-ca77a66827be", 1100)],
    tone: "#c9b9a7",
  },
  {
    id: "p15",
    slug: "heritage-cable-knit",
    name: "Heritage Cable Knit",
    category: "knitwear",
    price: 134,
    rating: 4.8,
    reviews: 101,
    sold: 470,
    released: 12,
    blurb: "A fisherman cable in undyed wool.",
    description:
      "Classic cable stitching in a naturally dyed merino blend. Warm, durable and quietly luxurious.",
    details: ["Cable-knit body", "Merino blend", "Crew neck", "True to size"],
    fabric: "75% merino wool, 25% cotton. Hand wash cold.",
    colors: [
      { name: "Oatmeal", hex: "#d9ccb2", image: 0 },
      { name: "Camel", hex: "#a97c50", image: 0 },
    ],
    sizes: APPAREL,
    images: [photo("1558769132-cb1aea458c5e", 1100)],
    tone: "#c9b79d",
  },
  {
    id: "p16",
    slug: "cobalt-three-piece-suit",
    name: "Cobalt Three-Piece Suit",
    category: "tailoring",
    price: 420,
    badge: "Bestseller",
    featured: true,
    rating: 4.9,
    reviews: 64,
    sold: 220,
    released: 14,
    blurb: "A windowpane check with a waistcoat to match.",
    description:
      "A three-piece in a Super 110s wool windowpane. Half-canvassed jacket, flat-front trousers and a six-button waistcoat, tailored for a clean modern line.",
    details: ["Half-canvassed jacket", "Flat-front trousers", "Six-button waistcoat", "Sold as a set"],
    fabric: "Super 110s wool. Dry clean only.",
    colors: [{ name: "Cobalt check", hex: "#264a8a", image: 0 }],
    sizes: ["46", "48", "50", "52", "54"],
    images: [photo("1594938298603-c8148c4dae35", 1100)],
    tone: "#8c95a6",
  },
  {
    id: "p17",
    slug: "midnight-check-blazer",
    name: "Midnight Check Blazer",
    category: "tailoring",
    price: 198,
    rating: 4.6,
    reviews: 119,
    sold: 430,
    released: 13,
    blurb: "Oversized blazer in a navy windowpane.",
    description:
      "A relaxed, slightly oversized blazer in a deep navy check. Soft shoulders and a single-button closure make it easy to throw over anything.",
    details: ["Single-button closure", "Soft unpadded shoulder", "Flap pockets", "Oversized fit"],
    fabric: "Wool-blend suiting. Dry clean only.",
    colors: [
      { name: "Navy check", hex: "#1f2d4d", image: 0 },
      { name: "Black", hex: "#1b1b1d", image: 0 },
    ],
    sizes: APPAREL,
    images: [photo("1485968579580-b6d095142e6e", 1100)],
    tone: "#8e9bb3",
  },
  {
    id: "p18",
    slug: "flare-runner-sneaker",
    name: "Flare Runner Sneaker",
    category: "accessories",
    price: 139,
    badge: "New",
    isNew: true,
    featured: true,
    rating: 4.7,
    reviews: 266,
    sold: 1010,
    released: 17,
    blurb: "Knit upper in a saturated crimson.",
    description:
      "A featherweight running-inspired sneaker with a seamless knit upper and a responsive foam sole. Equally at home on the street or a short run.",
    details: ["Seamless knit upper", "Responsive foam midsole", "Rubber outsole", "Padded collar"],
    fabric: "Recycled knit upper, EVA midsole, rubber outsole.",
    colors: [{ name: "Crimson", hex: "#a5121b", image: 0 }],
    sizes: SHOE,
    images: [photo("1542291026-7eec264c27ff", 1100)],
    tone: "#c4262e",
  },
  {
    id: "p19",
    slug: "court-white-sneaker",
    name: "Court White Sneaker",
    category: "accessories",
    price: 99,
    rating: 4.6,
    reviews: 355,
    sold: 1640,
    released: 15,
    blurb: "A clean leather court shoe.",
    description:
      "A minimalist court sneaker in smooth leather with a vulcanised sole. The white that goes with everything.",
    details: ["Smooth leather upper", "Vulcanised rubber sole", "Cushioned insole", "Waxed cotton laces"],
    fabric: "Leather upper, rubber sole.",
    colors: [{ name: "White", hex: "#f4f2ee", image: 0 }],
    sizes: SHOE,
    images: [photo("1544441893-675973e31985", 1100)],
    tone: "#3a3a3d",
  },
  {
    id: "p20",
    slug: "rust-ribbed-beanie",
    name: "Rust Ribbed Beanie",
    category: "accessories",
    price: 28,
    compareAt: 36,
    badge: "Sale",
    flashSale: true,
    rating: 4.5,
    reviews: 412,
    sold: 2050,
    released: 16,
    blurb: "A chunky rib that folds twice.",
    description:
      "A thick ribbed beanie in soft merino blend. Fold it once for a slouch, twice for a snug fit.",
    details: ["Chunky rib knit", "Fold-over cuff", "One size", "Merino blend"],
    fabric: "50% merino wool, 50% acrylic. Hand wash cold.",
    colors: [
      { name: "Rust", hex: "#b4562f", image: 0 },
      { name: "Oat", hex: "#e3d7bf", image: 0 },
    ],
    sizes: ["One size"],
    images: [photo("1556905055-8f358a7a47b2", 1100)],
    tone: "#b3a79b",
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getProductById = (id: string) => products.find((p) => p.id === id);
export const productsByCategory = (id: CategoryId) => products.filter((p) => p.category === id);
export const relatedProducts = (p: Product, n = 4) =>
  products
    .filter((x) => x.id !== p.id)
    .sort((a, b) => Number(b.category === p.category) - Number(a.category === p.category) || b.sold - a.sold)
    .slice(0, n);

export const categoryName = (id: CategoryId) => categories.find((c) => c.id === id)?.name ?? id;

// ---------------------------------------------------------------------------
// Editorial content
// ---------------------------------------------------------------------------
export const lookbook = [
  { src: photo("1509631179647-0177331693ae", 900), alt: "Striped wide-leg trousers against a teal wall", title: "Teal Hour", season: "AW26", ratio: "aspect-[3/4]" },
  { src: photo("1529139574466-a303027c1d8b", 900), alt: "Red tee under an oversized black jacket", title: "Red Signal", season: "AW26", ratio: "aspect-[4/5]" },
  { src: photo("1490481651871-ab68de25d43d", 900), alt: "A rail of white blouses and earthy knits", title: "The Atelier Rail", season: "AW26", ratio: "aspect-square" },
  { src: photo("1445205170230-053b83016050", 900), alt: "Warm-lit rail of coats", title: "Amber Coats", season: "AW26", ratio: "aspect-[4/5]" },
  { src: photo("1525507119028-ed4c629a60a3", 900), alt: "Flat-lay of denim, stripes and red espadrilles", title: "Weekend Kit", season: "AW26", ratio: "aspect-[3/4]" },
  { src: photo("1519238263530-99bdd11df2ea", 900), alt: "A child in a navy cardigan and cobalt shorts", title: "Mini Mood", season: "AW26", ratio: "aspect-[4/5]" },
  { src: photo("1523381210434-271e8be1f52b", 900), alt: "Forest-green tees on wooden hangers", title: "Forest Basics", season: "AW26", ratio: "aspect-square" },
  { src: photo("1542060748-10c28b62716f", 900), alt: "A colourful rail of shirts", title: "Colour Library", season: "AW26", ratio: "aspect-[3/4]" },
];

export const testimonials = [
  {
    id: "t1",
    name: "Amara Okafor",
    role: "Verified buyer · Milano Wool Coat",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=70",
    rating: 5,
    content: "The coat is unreal in person. The drape, the weight, the colour: everyone asks where it's from. Delivery took three days and the packaging was gorgeous.",
  },
  {
    id: "t2",
    name: "Lucas Meyer",
    role: "Verified buyer · Noir Leather Biker",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=70",
    rating: 5,
    content: "I've owned three biker jackets and this is the best fit and leather quality by far. Size guide was spot on and the exchange process is painless.",
  },
  {
    id: "t3",
    name: "Sofia Alvarez",
    role: "Verified buyer · Marigold Wrap Dress",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=70",
    rating: 4.5,
    content: "Wore the Marigold to a wedding and got compliments all night. Fabric is cool and breathable. I'd size up if you're between sizes.",
  },
  {
    id: "t4",
    name: "Jonah Reyes",
    role: "Verified buyer · Essential Crew Tee",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=70",
    rating: 5,
    content: "Bought five of these tees. Heavyweight, no see-through, and they keep their shape after dozens of washes. Easy repeat order.",
  },
  {
    id: "t5",
    name: "Priya Nair",
    role: "Verified buyer · Terra Sweater",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=70",
    rating: 5,
    content: "So soft, and the colour-blocking is even better than the photos. Customer support answered my sizing question in minutes.",
  },
];

export const newsletterFaces = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=70",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=70",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=70",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=70",
];

// ---------------------------------------------------------------------------
// Coupons
// ---------------------------------------------------------------------------
export type Coupon =
  | { code: string; kind: "percent"; value: number; minSubtotal?: number; description: string }
  | { code: string; kind: "amount"; value: number; minSubtotal?: number; description: string }
  | { code: string; kind: "shipping"; minSubtotal?: number; description: string };

export const coupons: Coupon[] = [
  { code: "WELCOME10", kind: "percent", value: 10, description: "10% off your order" },
  { code: "FASHION20", kind: "percent", value: 20, minSubtotal: 150, description: "20% off orders over $150" },
  { code: "FREESHIP", kind: "shipping", description: "Free standard shipping" },
  { code: "AVARA50", kind: "amount", value: 50, minSubtotal: 300, description: "$50 off orders over $300" },
];

export const findCoupon = (code: string) => coupons.find((c) => c.code === code.trim().toUpperCase());
