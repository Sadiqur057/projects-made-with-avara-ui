const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export type Spec = { label: string; value: string };

export type Product = {
  slug: string;
  name: string;
  subtitle: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  badge?: string;
  stock: number;
  description: string;
  images: string[];
  colors: { name: string; hex: string }[];
  options: string[];
  optionLabel: string;
  specs: Spec[];
};

export const usd = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const products: Product[] = [
  {
    slug: "volt-pro-x1-headphones",
    name: "Volt Pro X1 Wireless Headphones",
    subtitle: "Adaptive noise cancelling · 40h battery",
    category: "Headphones",
    price: 249,
    originalPrice: 329,
    rating: 4.9,
    reviews: 1284,
    badge: "Best Seller",
    stock: 6,
    description:
      "Studio-tuned 40 mm drivers, hybrid adaptive noise cancelling and multipoint Bluetooth 5.4 in a foldable aluminium frame. Charge for 10 minutes and listen for 5 hours.",
    images: [
      img("1618366712010-f4ae9c647dcb"),
      img("1505740420928-5e560c06d30e"),
      img("1583394838336-acd977736f90"),
      img("1546435770-a3e426bf472b"),
    ],
    colors: [
      { name: "Midnight Black", hex: "#16161a" },
      { name: "Arctic Silver", hex: "#c9ccd3" },
      { name: "Electric Blue", hex: "#3b4cff" },
      { name: "Solar Yellow", hex: "#f5c518" },
    ],
    options: ["Headphones", "+ Travel case", "+ Case & USB-C DAC"],
    optionLabel: "Choose your bundle",
    specs: [
      { label: "Drivers", value: "40 mm dynamic, beryllium-coated" },
      { label: "Noise cancelling", value: "Hybrid ANC, 6 microphones" },
      { label: "Battery life", value: "40 h (ANC on) / 60 h (off)" },
      { label: "Fast charge", value: "10 min = 5 h playback" },
      { label: "Connectivity", value: "Bluetooth 5.4, multipoint, LDAC" },
      { label: "Frequency response", value: "4 Hz – 40 kHz" },
      { label: "Weight", value: "254 g" },
      { label: "Warranty", value: "2 years, worldwide" },
    ],
  },
  {
    slug: "nova-12-5g-smartphone",
    name: "Nova 12 5G Smartphone",
    subtitle: '6.7" LTPO OLED · 256 GB',
    category: "Smartphones",
    price: 699,
    originalPrice: 849,
    rating: 4.8,
    reviews: 962,
    badge: "New",
    stock: 14,
    description:
      "A 120 Hz LTPO OLED display, a 50 MP triple camera and a two-day battery in a 7.8 mm titanium-edged body.",
    images: [
      img("1546054454-aa26e2b734c7"),
      img("1598327105666-5b89351aff97"),
      img("1512941937669-90a1b58e7e9c"),
    ],
    colors: [
      { name: "Graphite", hex: "#2b2d33" },
      { name: "Glacier", hex: "#cfd8e3" },
      { name: "Ultraviolet", hex: "#5b3df5" },
    ],
    options: ["128 GB", "256 GB", "512 GB"],
    optionLabel: "Choose storage",
    specs: [
      { label: "Display", value: '6.7" LTPO OLED, 120 Hz' },
      { label: "Chipset", value: "Octa-core 4 nm, 12 GB RAM" },
      { label: "Main camera", value: "50 MP + 12 MP ultrawide + 10 MP 3×" },
      { label: "Battery", value: "5,000 mAh, 67 W wired" },
      { label: "Connectivity", value: "5G, Wi-Fi 7, NFC" },
      { label: "Weight", value: "194 g" },
      { label: "Water resistance", value: "IP68" },
      { label: "Warranty", value: "2 years, worldwide" },
    ],
  },
  {
    slug: "pulse-watch-s2",
    name: "Pulse Watch S2",
    subtitle: "AMOLED · GPS · 7-day battery",
    category: "Wearables",
    price: 179,
    originalPrice: 229,
    rating: 4.7,
    reviews: 640,
    badge: "-22%",
    stock: 22,
    description:
      "Dual-band GPS, ECG and blood-oxygen sensing with a bright AMOLED face and a week of battery life.",
    images: [img("1523275335684-37898b6baf30"), img("1546868871-7041f2a55e12")],
    colors: [
      { name: "Ceramic White", hex: "#eceef1" },
      { name: "Onyx", hex: "#1b1b1f" },
    ],
    options: ["41 mm", "45 mm"],
    optionLabel: "Choose case size",
    specs: [
      { label: "Display", value: '1.4" AMOLED, 2,000 nits' },
      { label: "Battery", value: "Up to 7 days" },
      { label: "Sensors", value: "ECG, SpO₂, heart rate, skin temp" },
      { label: "Water resistance", value: "5 ATM" },
      { label: "GPS", value: "Dual-band L1 + L5" },
      { label: "Weight", value: "38 g" },
    ],
  },
  {
    slug: "aero-14-ultrabook",
    name: "Aero 14 Ultrabook",
    subtitle: '14" 2.8K OLED · 32 GB RAM',
    category: "Laptops",
    price: 1199,
    originalPrice: 1499,
    rating: 4.8,
    reviews: 418,
    badge: "-20%",
    stock: 9,
    description:
      "A 1.2 kg magnesium chassis with a 2.8K OLED panel, 16-core processor and 18 hours of real-world battery life.",
    images: [
      img("1593642632823-8f785ba67e45"),
      img("1496181133206-80ce9b88a853"),
      img("1525547719571-a2d4ac8945e2"),
    ],
    colors: [
      { name: "Space Grey", hex: "#4a4d55" },
      { name: "Moon Silver", hex: "#d7d9de" },
    ],
    options: ["16 GB / 512 GB", "32 GB / 1 TB"],
    optionLabel: "Choose configuration",
    specs: [
      { label: "Display", value: '14" 2.8K OLED, 120 Hz' },
      { label: "Processor", value: "16-core, up to 5.1 GHz" },
      { label: "Memory", value: "Up to 32 GB LPDDR5X" },
      { label: "Storage", value: "Up to 1 TB NVMe" },
      { label: "Battery", value: "75 Wh, up to 18 h" },
      { label: "Weight", value: "1.2 kg" },
    ],
  },
  {
    slug: "lens-m3-mirrorless-camera",
    name: "Lens M3 Mirrorless Camera",
    subtitle: "26 MP · 4K 60p · 5-axis IBIS",
    category: "Cameras",
    price: 899,
    originalPrice: 1099,
    rating: 4.9,
    reviews: 233,
    badge: "-18%",
    stock: 5,
    description:
      "A 26 MP stacked sensor, in-body stabilisation and 4K 60p video in a body small enough for everyday carry.",
    images: [img("1516035069371-29a1b244cc32")],
    colors: [{ name: "Black", hex: "#18181b" }],
    options: ["Body only", "With 18–55 mm kit lens"],
    optionLabel: "Choose kit",
    specs: [
      { label: "Sensor", value: "26 MP APS-C stacked" },
      { label: "Video", value: "4K 60p, 10-bit" },
      { label: "Stabilisation", value: "5-axis in-body" },
      { label: "Autofocus", value: "Subject-tracking, 425 points" },
    ],
  },
  {
    slug: "buds-air-pro",
    name: "Buds Air Pro Earbuds",
    subtitle: "ANC · 8h + 24h case",
    category: "Earbuds",
    price: 99,
    originalPrice: 149,
    rating: 4.6,
    reviews: 2210,
    badge: "-34%",
    stock: 48,
    description:
      "Pocket-sized true wireless earbuds with active noise cancelling, wireless charging and an IPX5 rating.",
    images: [
      img("1606220588913-b3aacb4d2f46"),
      img("1600294037681-c80b4cb5b434"),
      img("1572569511254-d8f925fe2cbb"),
    ],
    colors: [
      { name: "Onyx", hex: "#1b1b1f" },
      { name: "Cloud", hex: "#f1f2f4" },
    ],
    options: ["Standard", "With charging pad"],
    optionLabel: "Choose bundle",
    specs: [
      { label: "Battery", value: "8 h + 24 h charging case" },
      { label: "Noise cancelling", value: "Adaptive ANC" },
      { label: "Water resistance", value: "IPX5" },
      { label: "Charging", value: "USB-C & Qi wireless" },
    ],
  },
  {
    slug: "orbit-smart-speaker",
    name: "Orbit Smart Speaker",
    subtitle: "360° sound · voice assistant",
    category: "Smart Home",
    price: 89,
    originalPrice: 129,
    rating: 4.5,
    reviews: 770,
    badge: "-31%",
    stock: 31,
    description:
      "Room-filling 360° audio with far-field voice control and a built-in Matter smart-home hub.",
    images: [img("1558089687-f282ffcbc126")],
    colors: [{ name: "Chalk", hex: "#e8e8ea" }],
    options: ["Single", "Pair"],
    optionLabel: "Choose pack",
    specs: [
      { label: "Audio", value: "360°, 2 × 15 W" },
      { label: "Smart home", value: "Matter, Thread, Zigbee" },
      { label: "Microphones", value: "4-mic far-field array" },
    ],
  },
  {
    slug: "forge-desk-setup-kit",
    name: "Forge Desk Setup Kit",
    subtitle: "Keyboard · mouse · headset",
    category: "Accessories",
    price: 159,
    originalPrice: 219,
    rating: 4.7,
    reviews: 356,
    badge: "-27%",
    stock: 17,
    description:
      "A wireless mechanical keyboard, ergonomic mouse and headset in one matched, low-latency bundle.",
    images: [img("1550009158-9ebf69173e03"), img("1587829741301-dc798b83add3")],
    colors: [{ name: "Navy", hex: "#1f2d5a" }],
    options: ["Full-size", "75%"],
    optionLabel: "Choose layout",
    specs: [
      { label: "Switches", value: "Hot-swap, tactile" },
      { label: "Connectivity", value: "2.4 GHz, Bluetooth, USB-C" },
      { label: "Battery", value: "Up to 200 h" },
    ],
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const discountPct = (p: Product) =>
  Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);

export const categories = [
  { name: "Headphones", count: 48, image: img("1583394838336-acd977736f90", 800), href: "/products/volt-pro-x1-headphones" },
  { name: "Earbuds", count: 36, image: img("1606220588913-b3aacb4d2f46", 800), href: "/products/buds-air-pro" },
  { name: "Smartphones", count: 62, image: img("1546054454-aa26e2b734c7", 800), href: "/products/nova-12-5g-smartphone" },
  { name: "Wearables", count: 41, image: img("1523275335684-37898b6baf30", 800), href: "/products/pulse-watch-s2" },
  { name: "Laptops", count: 57, image: img("1593642632823-8f785ba67e45", 800), href: "/products/aero-14-ultrabook" },
  { name: "Cameras", count: 29, image: img("1516035069371-29a1b244cc32", 800), href: "/products/lens-m3-mirrorless-camera" },
  { name: "Smart Home", count: 53, image: img("1558089687-f282ffcbc126", 800), href: "/products/orbit-smart-speaker" },
  { name: "Accessories", count: 120, image: img("1550009158-9ebf69173e03", 800), href: "/products/forge-desk-setup-kit" },
];
