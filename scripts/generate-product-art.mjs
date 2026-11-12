/**
 * Generates the Aurelle product art in /public/products.
 *
 * The store ships without photography, so each product gets four on-brand
 * SVG views (pack shot, texture, ritual, detail). Swap any file for a real
 * photo with the same name and nothing else has to change.
 *
 *   node scripts/generate-product-art.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "products");
mkdirSync(OUT, { recursive: true });

/* form: tube | jar | dropper | pump | spray | bottle | oil */
const PRODUCTS = [
  { slug: "cloud-cleanse-gel-cleanser", name: ["Cloud Cleanse", "Gel Cleanser"], size: "150 ml", form: "tube", tint: "#E8EEE3", body: "#F6F3EC", cap: "#8FA683" },
  { slug: "clear-slate-salicylic-cleanser", name: ["Clear Slate", "Salicylic Cleanser"], size: "150 ml", form: "pump", tint: "#DDE7E3", body: "#EEF5F2", cap: "#4F7A71" },
  { slug: "milk-bath-cream-cleanser", name: ["Milk Bath", "Cream Cleanser"], size: "150 ml", form: "tube", tint: "#F3E6DA", body: "#FBF4EB", cap: "#C48466" },
  { slug: "rosewater-barrier-mist", name: ["Rosewater", "Barrier Mist"], size: "100 ml", form: "spray", tint: "#F4DFDC", body: "#F9E9E6", cap: "#B3645A" },
  { slug: "glow-reset-aha-bha-toner", name: ["Glow Reset", "AHA/BHA Toner"], size: "150 ml", form: "bottle", tint: "#F5E9C9", body: "#FBF3DA", cap: "#B08529" },
  { slug: "dew-drop-hyaluronic-serum", name: ["Dew Drop", "Hyaluronic Serum"], size: "30 ml", form: "dropper", tint: "#DCE6EF", body: "#E9F1F8", cap: "#5F83AB" },
  { slug: "bright-side-vitamin-c-serum", name: ["Bright Side", "Vitamin C Serum"], size: "30 ml", form: "dropper", tint: "#F8E4BF", body: "#FCEBCB", cap: "#C9822A" },
  { slug: "clear-skin-niacinamide-zinc", name: ["Clear Skin", "Niacinamide + Zinc"], size: "30 ml", form: "dropper", tint: "#E3E8D5", body: "#EEF2E1", cap: "#738849" },
  { slug: "night-renew-retinol", name: ["Night Renew", "Retinol 0.3%"], size: "30 ml", form: "dropper", tint: "#EBD7C5", body: "#D6A985", cap: "#5E3F2A" },
  { slug: "calm-down-centella-serum", name: ["Calm Down", "Centella Serum"], size: "30 ml", form: "dropper", tint: "#DDEBD9", body: "#EAF4E6", cap: "#54805A" },
  { slug: "weightless-water-gel", name: ["Weightless", "Water Gel"], size: "50 ml", form: "jar", tint: "#DCEBEF", body: "#EBF5F8", cap: "#548A9C" },
  { slug: "barrier-butter-ceramide-cream", name: ["Barrier Butter", "Ceramide Cream"], size: "50 ml", form: "jar", tint: "#F1E1D3", body: "#FAF1E7", cap: "#A06A48" },
  { slug: "everyday-peptide-cream", name: ["Everyday", "Peptide Cream"], size: "50 ml", form: "jar", tint: "#EBDDE8", body: "#F7EEF4", cap: "#8A5A80" },
  { slug: "invisible-shield-spf-50", name: ["Invisible Shield", "SPF 50"], size: "50 ml", form: "tube", tint: "#F8EBC8", body: "#FDF7E2", cap: "#D9A02A" },
  { slug: "mineral-veil-spf-40", name: ["Mineral Veil", "SPF 40"], size: "50 ml", form: "tube", tint: "#EFE3D6", body: "#F8EFE4", cap: "#B38A64" },
  { slug: "glow-reset-enzyme-mask", name: ["Glow Reset", "Enzyme Mask"], size: "75 ml", form: "jar", tint: "#F6DDD9", body: "#FBE8E4", cap: "#BE6159" },
  { slug: "midnight-squalane-oil", name: ["Midnight", "Squalane Oil"], size: "30 ml", form: "oil", tint: "#E4D9CC", body: "#6D5140", cap: "#2F2620" },
  { slug: "bright-eyes-caffeine-eye-cream", name: ["Bright Eyes", "Eye Cream"], size: "15 ml", form: "tube", tint: "#E7E1EF", body: "#F3EFF8", cap: "#76649D" },
];

/* ───────────── helpers ───────────── */
const clamp = (n) => Math.max(0, Math.min(255, Math.round(n)));
function hexToRgb(h) {
  const v = h.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16));
}
const rgbToHex = (r, g, b) => "#" + [r, g, b].map((x) => clamp(x).toString(16).padStart(2, "0")).join("");
function mix(a, b, t) {
  const A = hexToRgb(a), B = hexToRgb(b);
  return rgbToHex(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t);
}
const lighten = (h, t) => mix(h, "#ffffff", t);
const darken = (h, t) => mix(h, "#1d1612", t);

function rng(seed) {
  let s = 0;
  for (const c of seed) s = (s * 31 + c.charCodeAt(0)) >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/* ───────────── product drawings (origin: bottom centre, y up is negative) ───────────── */
function label(p, w, y, h, ink) {
  const [l1, l2] = p.name;
  const fs = l1.length > 13 || l2.length > 16 ? 15 : 18;
  return `
    <g fill="${ink}" font-family="Georgia, 'Times New Roman', serif" text-anchor="middle">
      <text x="0" y="${y + 30}" font-size="11" letter-spacing="5" font-weight="700">AURELLE</text>
      <line x1="${-w / 5}" y1="${y + 42}" x2="${w / 5}" y2="${y + 42}" stroke="${ink}" stroke-width="1" opacity=".5"/>
      <text x="0" y="${y + h / 2 + 4}" font-size="${fs}" font-style="italic">${l1}</text>
      <text x="0" y="${y + h / 2 + 4 + fs + 4}" font-size="${fs}">${l2}</text>
      <text x="0" y="${y + h - 14}" font-size="10" letter-spacing="2" opacity=".75">${p.size.toUpperCase()}</text>
    </g>`;
}

function gloss(x, y, w, h, r = 8) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="#fff" opacity=".28"/>`;
}

function drawProduct(p) {
  const body = p.body;
  const cap = p.cap;
  const ink = p.form === "oil" ? "#F2E6D8" : darken(cap, 0.25);
  const edge = darken(body, 0.12);
  const capDark = darken(cap, 0.18);
  const shadow = `<ellipse cx="0" cy="6" rx="${p.form === "jar" ? 190 : 120}" ry="16" fill="#1d1612" opacity=".16"/>`;

  switch (p.form) {
    case "dropper":
    case "oil": {
      const h = p.form === "oil" ? 250 : 310;
      const w = p.form === "oil" ? 150 : 190;
      return `${shadow}
        <rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" rx="34" fill="${body}" stroke="${edge}" stroke-width="2"/>
        ${gloss(-w / 2 + 14, -h + 26, 16, h - 70)}
        <rect x="-56" y="${-h - 40}" width="112" height="46" rx="10" fill="${cap}"/>
        <rect x="-56" y="${-h - 40}" width="112" height="10" rx="5" fill="${capDark}" opacity=".5"/>
        <path d="M -34 ${-h - 40} L -34 ${-h - 130} Q -34 ${-h - 170} 0 ${-h - 170} Q 34 ${-h - 170} 34 ${-h - 130} L 34 ${-h - 40} Z" fill="${capDark}"/>
        <rect x="-22" y="${-h - 150}" width="10" height="90" rx="5" fill="#fff" opacity=".22"/>
        <rect x="${-w / 2 + 20}" y="${-h + 70}" width="${w - 40}" height="${h - 110}" rx="6" fill="${p.form === "oil" ? "#2F2620" : lighten(body, 0.55)}" opacity="${p.form === "oil" ? ".35" : ".9"}"/>
        ${label(p, w - 40, -h + 70, h - 110, ink)}`;
    }
    case "pump": {
      const h = 330, w = 200;
      return `${shadow}
        <rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" rx="30" fill="${body}" stroke="${edge}" stroke-width="2"/>
        ${gloss(-w / 2 + 14, -h + 26, 16, h - 60)}
        <rect x="-44" y="${-h - 34}" width="88" height="38" rx="8" fill="${cap}"/>
        <rect x="-12" y="${-h - 94}" width="24" height="64" rx="6" fill="${capDark}"/>
        <rect x="-62" y="${-h - 124}" width="124" height="38" rx="14" fill="${cap}"/>
        <rect x="46" y="${-h - 112}" width="58" height="14" rx="7" fill="${cap}"/>
        <rect x="${-w / 2 + 20}" y="${-h + 70}" width="${w - 40}" height="${h - 110}" rx="6" fill="${lighten(body, 0.55)}" opacity=".9"/>
        ${label(p, w - 40, -h + 70, h - 110, ink)}`;
    }
    case "spray": {
      const h = 300, w = 150;
      return `${shadow}
        <rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" rx="40" fill="${body}" stroke="${edge}" stroke-width="2"/>
        ${gloss(-w / 2 + 12, -h + 30, 14, h - 70)}
        <rect x="-40" y="${-h - 30}" width="80" height="36" rx="8" fill="${cap}"/>
        <rect x="-34" y="${-h - 104}" width="68" height="78" rx="16" fill="${capDark}"/>
        <circle cx="0" cy="${-h - 76}" r="7" fill="#1d1612" opacity=".55"/>
        <rect x="${-w / 2 + 16}" y="${-h + 70}" width="${w - 32}" height="${h - 110}" rx="6" fill="${lighten(body, 0.55)}" opacity=".9"/>
        ${label(p, w - 32, -h + 70, h - 110, ink)}`;
    }
    case "bottle": {
      const h = 310, w = 170;
      return `${shadow}
        <path d="M ${-w / 2} -30 Q ${-w / 2} 0 ${-w / 2 + 30} 0 L ${w / 2 - 30} 0 Q ${w / 2} 0 ${w / 2} -30 L ${w / 2} ${-h + 60} Q ${w / 2} ${-h + 20} 36 ${-h + 8} L 36 ${-h - 24} L -36 ${-h - 24} L -36 ${-h + 8} Q ${-w / 2} ${-h + 20} ${-w / 2} ${-h + 60} Z" fill="${body}" stroke="${edge}" stroke-width="2"/>
        ${gloss(-w / 2 + 14, -h + 70, 14, h - 120)}
        <rect x="-44" y="${-h - 90}" width="88" height="72" rx="10" fill="${cap}"/>
        <rect x="-44" y="${-h - 90}" width="88" height="12" rx="6" fill="${capDark}" opacity=".5"/>
        <rect x="${-w / 2 + 18}" y="${-h + 80}" width="${w - 36}" height="${h - 130}" rx="6" fill="${lighten(body, 0.55)}" opacity=".9"/>
        ${label(p, w - 36, -h + 80, h - 130, ink)}`;
    }
    case "jar": {
      const w = 320, h = 170;
      return `${shadow}
        <rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" rx="34" fill="${body}" stroke="${edge}" stroke-width="2"/>
        ${gloss(-w / 2 + 20, -h + 22, 18, h - 54)}
        <rect x="${-w / 2 - 8}" y="${-h - 76}" width="${w + 16}" height="86" rx="24" fill="${cap}"/>
        <rect x="${-w / 2 - 8}" y="${-h - 76}" width="${w + 16}" height="14" rx="7" fill="${capDark}" opacity=".45"/>
        ${gloss(-w / 2 + 6, -h - 60, w - 12, 10, 5)}
        <rect x="-110" y="${-h + 24}" width="220" height="${h - 60}" rx="6" fill="${lighten(body, 0.55)}" opacity=".9"/>
        <g fill="${ink}" font-family="Georgia, 'Times New Roman', serif" text-anchor="middle">
          <text x="0" y="${-h + 48}" font-size="10" letter-spacing="5" font-weight="700">AURELLE</text>
          <text x="0" y="${-h + 78}" font-size="17" font-style="italic">${p.name[0]}</text>
          <text x="0" y="${-h + 100}" font-size="17">${p.name[1]}</text>
          <text x="0" y="${-18}" font-size="9" letter-spacing="2" opacity=".75">${p.size.toUpperCase()}</text>
        </g>`;
    }
    case "tube":
    default: {
      return `${shadow}
        <rect x="-54" y="-74" width="108" height="74" rx="16" fill="${cap}"/>
        <rect x="-54" y="-74" width="108" height="12" rx="6" fill="${capDark}" opacity=".5"/>
        <path d="M -52 -74 L -88 -400 Q 0 -418 88 -400 L 52 -74 Z" fill="${body}" stroke="${edge}" stroke-width="2"/>
        <path d="M -80 -330 L -70 -150" stroke="#fff" stroke-width="14" stroke-linecap="round" opacity=".3"/>
        <rect x="-90" y="-440" width="180" height="46" rx="6" fill="${darken(body, 0.06)}" stroke="${edge}" stroke-width="2"/>
        ${[-60, -36, -12, 12, 36, 60].map((x) => `<line x1="${x}" y1="-434" x2="${x}" y2="-400" stroke="${edge}" stroke-width="2" opacity=".7"/>`).join("")}
        <g fill="${ink}" font-family="Georgia, 'Times New Roman', serif" text-anchor="middle">
          <text x="0" y="-330" font-size="11" letter-spacing="5" font-weight="700">AURELLE</text>
          <line x1="-28" y1="-318" x2="28" y2="-318" stroke="${ink}" stroke-width="1" opacity=".5"/>
          <text x="0" y="-258" font-size="${p.name[1].length > 14 ? 16 : 19}" font-style="italic">${p.name[0]}</text>
          <text x="0" y="-234" font-size="${p.name[1].length > 14 ? 16 : 19}">${p.name[1]}</text>
          <text x="0" y="-124" font-size="10" letter-spacing="2" opacity=".75">${p.size.toUpperCase()}</text>
        </g>`;
    }
  }
}

/* ───────────── scenes ───────────── */
const W = 800, H = 1000;

function frame(p, content, defs = "") {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${p.name.join(" ")}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${lighten(p.tint, 0.5)}"/>
      <stop offset="1" stop-color="${p.tint}"/>
    </linearGradient>
    <radialGradient id="glow" cx=".5" cy=".4" r=".6">
      <stop offset="0" stop-color="#fff" stop-opacity=".7"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    ${defs}
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  ${content}
</svg>`;
}

/** View 1: pack shot on an arch. */
function packShot(p) {
  const scale = p.form === "jar" ? 1.35 : p.form === "tube" ? 1.05 : 1.25;
  return frame(
    p,
    `<path d="M 130 840 L 130 400 Q 130 130 400 130 Q 670 130 670 400 L 670 840 Z" fill="${lighten(p.tint, 0.55)}" opacity=".85"/>
     <path d="M 130 840 L 130 400 Q 130 130 400 130 Q 670 130 670 400 L 670 840 Z" fill="url(#glow)"/>
     <rect x="0" y="830" width="${W}" height="170" fill="${darken(p.tint, 0.06)}" opacity=".55"/>
     <g transform="translate(400 840) scale(${scale})">${drawProduct(p)}</g>`,
  );
}

/** View 2: texture swatch beside the product. */
function textureShot(p) {
  const r = rng(p.slug + "t");
  const drops = Array.from({ length: 9 }, () => {
    const x = 90 + r() * 360, y = 140 + r() * 520, s = 8 + r() * 22;
    return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${s.toFixed(0)}" fill="${lighten(p.cap, 0.35)}" opacity="${(0.25 + r() * 0.35).toFixed(2)}"/>`;
  }).join("");
  const creamy = p.form === "jar" || p.form === "tube" || p.form === "pump";
  const tex = creamy
    ? `<path d="M 60 520 C 80 380 200 330 300 360 C 420 396 470 300 560 330 C 660 364 700 480 620 560 C 540 640 420 600 330 640 C 220 684 70 660 60 520 Z" fill="${lighten(p.body, 0.3)}" stroke="${darken(p.body, 0.08)}" stroke-width="2"/>
       <path d="M 100 520 C 130 430 220 400 300 420 C 400 446 470 372 540 390" fill="none" stroke="${p.cap}" stroke-width="10" stroke-linecap="round" opacity=".35"/>`
    : `<ellipse cx="270" cy="500" rx="210" ry="170" fill="${lighten(p.cap, 0.45)}" opacity=".6"/>
       <ellipse cx="270" cy="500" rx="140" ry="108" fill="${lighten(p.cap, 0.6)}" opacity=".7"/>
       <ellipse cx="240" cy="470" rx="46" ry="32" fill="#fff" opacity=".55"/>`;
  return frame(
    p,
    `<circle cx="280" cy="470" r="330" fill="${lighten(p.tint, 0.5)}" opacity=".7"/>
     ${tex}${drops}
     <rect x="0" y="830" width="${W}" height="170" fill="${darken(p.tint, 0.06)}" opacity=".55"/>
     <g transform="translate(560 850) scale(.95)">${drawProduct(p)}</g>`,
  );
}

/** View 3: ritual, product on a stone podium. */
function ritualShot(p) {
  const r = rng(p.slug + "r");
  const props = Array.from({ length: 5 }, (_, i) => {
    const x = 90 + r() * 620, y = 120 + r() * 420, s = 18 + r() * 40;
    return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${s.toFixed(0)}" fill="${i % 2 ? lighten(p.cap, 0.5) : lighten(p.tint, 0.65)}" opacity="${(0.4 + r() * 0.4).toFixed(2)}"/>`;
  }).join("");
  const scale = p.form === "jar" ? 1.1 : 0.95;
  return frame(
    p,
    `<rect width="${W}" height="${H}" fill="${mix(p.tint, p.cap, 0.18)}"/>
     <circle cx="400" cy="420" r="300" fill="url(#glow)"/>
     ${props}
     <ellipse cx="400" cy="806" rx="270" ry="40" fill="${darken(p.tint, 0.2)}" opacity=".9"/>
     <rect x="130" y="700" width="540" height="106" fill="${darken(p.tint, 0.1)}"/>
     <ellipse cx="400" cy="700" rx="270" ry="40" fill="${lighten(p.tint, 0.4)}"/>
     <ellipse cx="400" cy="640" rx="170" ry="26" fill="${darken(p.tint, 0.16)}"/>
     <rect x="230" y="614" width="340" height="26" fill="${darken(p.tint, 0.04)}"/>
     <ellipse cx="400" cy="614" rx="170" ry="26" fill="${lighten(p.tint, 0.55)}"/>
     <g transform="translate(400 612) scale(${scale})">${drawProduct(p)}</g>`,
  );
}

/** View 4: label close-up. */
function detailShot(p) {
  const r = rng(p.slug + "d");
  const dots = Array.from({ length: 14 }, () => {
    const x = r() * W, y = r() * H, s = 4 + r() * 16;
    return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${s.toFixed(0)}" fill="${lighten(p.cap, 0.55)}" opacity="${(0.15 + r() * 0.25).toFixed(2)}"/>`;
  }).join("");
  const cy = { tube: 250, jar: 120, dropper: 150, oil: 120, pump: 190, spray: 150, bottle: 180 }[p.form] ?? 180;
  const scale = p.form === "jar" ? 2.3 : 2.5;
  return frame(
    p,
    `<rect width="${W}" height="${H}" fill="${lighten(p.tint, 0.35)}"/>${dots}
     <g transform="translate(400 ${520 + cy * scale}) scale(${scale})">${drawProduct(p)}</g>`,
  );
}

for (const p of PRODUCTS) {
  [packShot, textureShot, ritualShot, detailShot].forEach((fn, i) => {
    writeFileSync(join(OUT, `${p.slug}-${i + 1}.svg`), fn(p));
  });
}

/* Ingredient / hero accents reuse the pack shots, so nothing else to emit. */
console.log(`Wrote ${PRODUCTS.length * 4} SVGs to ${OUT}`);
