export const img = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=${w}`;

export type Property = {
  slug: string;
  title: string;
  type: string;
  price: number;
  originalPrice?: number;
  address: string;
  city: string;
  beds: number;
  baths: number;
  sqft: number;
  lot: string;
  built: number;
  parking: string;
  badge: string;
  description: string;
  neighborhood: string;
  amenities: string[];
  images: string[];
};

export const money = (n: number) => `$${n.toLocaleString("en-US")}`;

export const PROPERTIES: Property[] = [
  {
    slug: "harborview-modern-villa",
    title: "Harborview Modern Villa",
    type: "Villa",
    price: 1285000,
    originalPrice: 1350000,
    address: "48 Lakeshore Drive",
    city: "Austin, TX",
    beds: 5,
    baths: 4,
    sqft: 3850,
    lot: "0.42 acres",
    built: 2021,
    parking: "3-car garage",
    badge: "Featured",
    description:
      "A light-filled modern villa with double-height ceilings, a chef's kitchen and a heated pool, set on a quiet lakeside street ten minutes from downtown.",
    neighborhood:
      "Lakeshore is a calm, tree-lined pocket with a 9-minute drive to downtown, a farmers' market every Saturday and highly rated schools within a mile.",
    amenities: ["Heated pool", "Smart-home wiring", "Chef's kitchen", "Home office", "Solar panels", "EV charger"],
    images: [
      img("1613490493576-7fde63acd811"),
      img("1600596542815-ffad4c1539a9"),
      img("1600607687939-ce8a6c25118c"),
      img("1600566753190-17f0baa2a6c3"),
    ],
  },
  {
    slug: "oakline-family-residence",
    title: "Oakline Family Residence",
    type: "House",
    price: 689000,
    address: "12 Oakline Court",
    city: "Denver, CO",
    beds: 4,
    baths: 3,
    sqft: 2640,
    lot: "0.25 acres",
    built: 2015,
    parking: "2-car garage",
    badge: "New",
    description:
      "A warm, well-kept family home with a sunny open-plan kitchen, a finished basement and a fenced garden made for weekend barbecues.",
    neighborhood:
      "Oakline Court sits on a cul-de-sac beside a park and a bike trail, with an elementary school a five-minute walk away.",
    amenities: ["Finished basement", "Fenced garden", "Fireplace", "Hardwood floors", "Walk-in pantry"],
    images: [
      img("1568605114967-8130f3a36994"),
      img("1480074568708-e7b720bb3f09"),
      img("1600585154340-be6161a56a0c"),
      img("1484154218962-a197022b5858"),
    ],
  },
  {
    slug: "skyline-corner-loft",
    title: "Skyline Corner Loft",
    type: "Apartment",
    price: 425000,
    address: "900 W Wacker, Unit 22B",
    city: "Chicago, IL",
    beds: 2,
    baths: 2,
    sqft: 1180,
    lot: "—",
    built: 2018,
    parking: "1 assigned space",
    badge: "Open house Sat",
    description:
      "A corner loft with floor-to-ceiling windows and skyline views, a building gym and a rooftop terrace, a short walk from the river and transit.",
    neighborhood:
      "River North puts dining, galleries and three train lines within a ten-minute walk, with a grocery store on the ground floor.",
    amenities: ["Rooftop terrace", "Gym", "24/7 doorman", "In-unit laundry", "Pet friendly"],
    images: [
      img("1545324418-cc1a3fa10c00"),
      img("1502672260266-1c1ef2d93688"),
      img("1560448204-e02f11c3d0e2"),
      img("1522708323590-d24dbb6b0267"),
    ],
  },
  {
    slug: "maple-court-townhome",
    title: "Maple Court Townhome",
    type: "Townhouse",
    price: 539000,
    originalPrice: 559000,
    address: "7 Maple Court",
    city: "Raleigh, NC",
    beds: 3,
    baths: 3,
    sqft: 1960,
    lot: "0.08 acres",
    built: 2019,
    parking: "2-car garage",
    badge: "Price reduced",
    description:
      "A bright end-unit townhome with a private patio, rooftop deck and low-maintenance living in a walkable community.",
    neighborhood:
      "Maple Court is a gated community of 40 homes beside a greenway, close to shops, cafés and the commuter rail line.",
    amenities: ["Rooftop deck", "Private patio", "Community pool", "Gated entry"],
    images: [
      img("1564013799919-ab600027ffc6"),
      img("1580587771525-78b9dba3b914"),
      img("1600210492486-724fe5c67fb0"),
      img("1583608205776-bfd35f0d9f83"),
    ],
  },
  {
    slug: "palm-bay-pool-estate",
    title: "Palm Bay Pool Estate",
    type: "Villa",
    price: 1890000,
    address: "3 Palm Bay Lane",
    city: "Miami, FL",
    beds: 6,
    baths: 5,
    sqft: 4900,
    lot: "0.6 acres",
    built: 2022,
    parking: "4-car garage",
    badge: "Exclusive",
    description:
      "A resort-style estate with a saltwater pool, outdoor kitchen and a private dock, finished with natural stone and wide-plank oak.",
    neighborhood:
      "Palm Bay is a guarded waterfront enclave, 15 minutes from the airport and five from the marina.",
    amenities: ["Private dock", "Saltwater pool", "Outdoor kitchen", "Wine room", "Guest house", "Generator"],
    images: [
      img("1512917774080-9991f1c4c750"),
      img("1613490493576-7fde63acd811"),
      img("1600607687939-ce8a6c25118c"),
      img("1600566753190-17f0baa2a6c3"),
    ],
  },
  {
    slug: "juniper-garden-flat",
    title: "Juniper Garden Flat",
    type: "Apartment",
    price: 318000,
    address: "21 Juniper Street, Flat 3",
    city: "Portland, OR",
    beds: 1,
    baths: 1,
    sqft: 780,
    lot: "—",
    built: 1998,
    parking: "Street permit",
    badge: "Great first home",
    description:
      "A renovated garden-level flat with its own entrance, a quiet courtyard and a new kitchen, ideal for a first purchase or a pied-à-terre.",
    neighborhood:
      "Juniper Street is a leafy residential block next to a co-op, a bakery and the bus line into the centre.",
    amenities: ["Private entrance", "Courtyard", "New kitchen", "Storage cage"],
    images: [
      img("1493809842364-78817add7ffb"),
      img("1560448204-e02f11c3d0e2"),
      img("1502672260266-1c1ef2d93688"),
      img("1522708323590-d24dbb6b0267"),
    ],
  },
];

export const getProperty = (slug: string) => PROPERTIES.find((p) => p.slug === slug);

export const PROPERTY_TYPES = [
  { name: "Houses", count: 128, image: img("1568605114967-8130f3a36994", 900), icon: "house" },
  { name: "Apartments", count: 214, image: img("1545324418-cc1a3fa10c00", 900), icon: "building" },
  { name: "Villas", count: 46, image: img("1512917774080-9991f1c4c750", 900), icon: "palmtree" },
  { name: "Townhouses", count: 87, image: img("1564013799919-ab600027ffc6", 900), icon: "landmark" },
] as const;

export const PORTRAITS = {
  a: img("1494790108377-be9c29b29330", 400),
  b: img("1507003211169-0a1dd7228f2d", 400),
  c: img("1438761681033-6461ffad8d80", 400),
  d: img("1500648767791-00dcc994a43e", 400),
  e: img("1472099645785-5658abf4ff4e", 400),
  f: img("1534528741775-53994a69daeb", 400),
};
