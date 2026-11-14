/** Deterministic hue (0-359) from a string. */
function hueOf(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) % 360;
  return h;
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

/** Generates a small SVG avatar so the demo needs no image hosting. */
export function avatarSrc(seed: string, label?: string) {
  const hue = hueOf(seed);
  const text = initials(label ?? seed.replace(/[_-]/g, " "));
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="hsl(${hue} 70% 58%)"/>` +
    `<stop offset="1" stop-color="hsl(${(hue + 40) % 360} 65% 42%)"/>` +
    `</linearGradient></defs>` +
    `<rect width="96" height="96" fill="url(#g)"/>` +
    `<text x="48" y="48" dy=".35em" text-anchor="middle" font-family="system-ui,sans-serif" font-size="38" font-weight="600" fill="white">${text}</text>` +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const rtf = typeof Intl !== "undefined" ? new Intl.RelativeTimeFormat("en", { numeric: "auto" }) : null;

export function timeAgo(iso: string, now = Date.now()) {
  const diff = Date.parse(iso) - now;
  const abs = Math.abs(diff);
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31_536_000_000],
    ["month", 2_592_000_000],
    ["week", 604_800_000],
    ["day", 86_400_000],
    ["hour", 3_600_000],
    ["minute", 60_000],
  ];
  if (abs < 60_000) return "just now";
  for (const [unit, ms] of units) {
    if (abs >= ms) return rtf ? rtf.format(Math.round(diff / ms), unit) : iso;
  }
  return "just now";
}

export function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function monthYear(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
