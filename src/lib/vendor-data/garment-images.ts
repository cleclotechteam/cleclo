// Garment pictures for the demo data. Each garment name maps to a self-contained SVG
// illustration (returned as a data: URL so it works in <img>, offline and without
// next/image remote config). The shape comes from the garment type ("Red Dress" -> dress)
// and the colour from the name when it names one. Real pickup/receipt photos from the
// API replace these once the backend exists.

type Shape =
  | "dress"
  | "shirt"
  | "tshirt"
  | "blouse"
  | "trousers"
  | "suit"
  | "coat"
  | "kurta"
  | "saree"
  | "scarf"
  | "tie"
  | "towel"
  | "bedsheet"
  | "pillow";

const SHAPES: Record<Shape, string> = {
  dress:
    '<path d="M48 16h24l3 16-6 16 23 58H28l23-58-6-16z"/><path d="M50 48h20" class="d"/><path d="M48 16l-4-6M72 16l4-6" class="d"/>',
  shirt:
    '<path d="M42 22l10-5 8 9 8-9 10 5 22 20-9 11-9-6v58H38V47l-9 6-9-11z"/><path d="M52 17l8 13 8-13M60 30v74" class="d"/><circle cx="60" cy="44" r="1.6" class="f"/><circle cx="60" cy="58" r="1.6" class="f"/><circle cx="60" cy="72" r="1.6" class="f"/>',
  tshirt:
    '<path d="M40 22l12-4q8 10 16 0l12 4 20 16-10 14-10-6v56H40V46l-10 6-10-14z"/><path d="M52 18q8 10 16 0" class="d"/>',
  blouse:
    '<path d="M42 24l11-5q7 9 14 0l11 5 16 14-8 11-8-5v44H42V44l-8 5-8-11z"/><path d="M53 19q7 9 14 0M42 70q18 6 36 0" class="d"/>',
  trousers:
    '<path d="M38 16h44l4 88H66l-6-58-6 58H34z"/><path d="M38 24h44M60 24v22" class="d"/>',
  suit:
    '<path d="M40 20l12-4 8 6 8-6 12 4 20 22-9 11-9-6v57H38V47l-9 6-9-11z"/><path d="M52 16l8 34 8-34M60 50v54" class="d"/><path d="M56 22h8l-4 8z" class="f"/><circle cx="60" cy="64" r="1.8" class="f"/><circle cx="60" cy="78" r="1.8" class="f"/>',
  coat:
    '<path d="M40 18l12-4 8 6 8-6 12 4 20 24-9 11-9-6v63H38V47l-9 6-9-11z"/><path d="M52 14l8 30 8-30M60 44v66" class="d"/><circle cx="54" cy="58" r="1.8" class="f"/><circle cx="54" cy="74" r="1.8" class="f"/><circle cx="66" cy="58" r="1.8" class="f"/><circle cx="66" cy="74" r="1.8" class="f"/>',
  kurta:
    '<path d="M44 18l10-2q6 8 12 0l10 2 20 18-8 10-8-6 4 66H36l4-66-8 6-8-10z"/><path d="M60 22v26" class="d"/><path d="M36 96h48" class="d"/>',
  saree:
    '<path d="M30 18h60v88H30z"/><path d="M30 18l60 52v16L30 34z" class="f"/><path d="M30 98h60" class="d"/>',
  scarf:
    '<path d="M42 16h36v14H70l6 76H62l-2-60-2 60H44l6-76h-8z"/><path d="M44 100h14M62 100h14" class="d"/>',
  tie:
    '<path d="M54 14h12l-2 12 8 58-12 18-12-18 8-58z"/><path d="M56 26h8" class="d"/>',
  towel:
    '<path d="M28 30h64v64H28z"/><path d="M28 80h64M28 86h64" class="d"/><path d="M28 30h64v10H28z" class="f"/>',
  bedsheet:
    '<path d="M24 40h72v16H24zM24 58h72v16H24zM24 76h72v16H24z"/><path d="M24 48h72M24 66h72M24 84h72" class="d"/>',
  pillow:
    '<path d="M28 40q32-10 64 0 6 20 0 40-32 10-64 0-6-20 0-40z"/><path d="M36 50q24-6 48 0" class="d"/>',
};

/** Which shape a garment name maps to (first match wins). */
const SHAPE_RULES: [RegExp, Shape][] = [
  [/dress|gown|frock/i, "dress"],
  [/saree|sari/i, "saree"],
  [/scarf|scarves|dupatta|stole/i, "scarf"],
  [/\btie\b/i, "tie"],
  [/towel/i, "towel"],
  [/curtain|drape/i, "bedsheet"],
  [/bed\s?sheet|sheet|blanket|duvet/i, "bedsheet"],
  [/pillow|cushion/i, "pillow"],
  [/kurta/i, "kurta"],
  [/blouse|top/i, "blouse"],
  [/suit|blazer/i, "suit"],
  [/coat|jacket/i, "coat"],
  [/t-?shirt|tee/i, "tshirt"],
  [/trouser|pant|jeans|pyjama|pajama/i, "trousers"],
  [/shirt/i, "shirt"],
];

const SHAPE_COLOURS: Record<Shape, string> = {
  dress: "#EC4899",
  shirt: "#60A5FA",
  tshirt: "#34D399",
  blouse: "#F472B6",
  trousers: "#475569",
  suit: "#334155",
  coat: "#92400E",
  kurta: "#F59E0B",
  saree: "#DB2777",
  scarf: "#8B5CF6",
  tie: "#1D4ED8",
  towel: "#14B8A6",
  bedsheet: "#93C5FD",
  pillow: "#C7D2FE",
};

/** Colour words in the garment name override the default colour of the shape. */
const NAMED_COLOURS: [RegExp, string][] = [
  [/\bred\b/i, "#DC2626"],
  [/\bwhite\b/i, "#F8FAFC"],
  [/\bblack\b/i, "#1F2937"],
  [/\bjeans\b|\bdenim\b/i, "#3B5B92"],
  [/\bblue\b/i, "#2563EB"],
  [/\bgreen\b/i, "#16A34A"],
  [/\byellow\b/i, "#EAB308"],
  [/\bpyjama\b|\bpajama\b/i, "#818CF8"],
  [/\bwool\b/i, "#A16207"],
];

export function garmentShape(name: string): Shape {
  return SHAPE_RULES.find(([re]) => re.test(name))?.[1] ?? "shirt";
}

const cache = new Map<string, string>();

/**
 * Photo variations so several photos of the same garment look different
 * (as separate shots would): straight, tilted left/right, close-up, mirrored.
 */
const VARIANTS: { transform: string; bgOpacity: number }[] = [
  { transform: "", bgOpacity: 0.12 },
  { transform: "rotate(-8 60 60)", bgOpacity: 0.18 },
  { transform: "rotate(7 60 60)", bgOpacity: 0.09 },
  { transform: "translate(60 62) scale(1.45) translate(-60 -52)", bgOpacity: 0.15 },
  { transform: "translate(120 0) scale(-1 1)", bgOpacity: 0.21 },
];

/**
 * A picture of the garment, as a data: URL usable anywhere an image URL is expected.
 * `variant` picks a different shot of the same garment (photo 1, 2, 3 …).
 */
export function garmentImage(name: string, variant = 0): string {
  const v = VARIANTS[((variant % VARIANTS.length) + VARIANTS.length) % VARIANTS.length];
  const key = `${name}|${variant % VARIANTS.length}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const shape = garmentShape(name);
  const colour = NAMED_COLOURS.find(([re]) => re.test(name))?.[1] ?? SHAPE_COLOURS[shape];
  const isLight = colour === "#F8FAFC";
  const outline = isLight ? "#94A3B8" : "rgba(15,23,42,0.35)";

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">` +
    `<style>path,circle{fill:${colour};stroke:${outline};stroke-width:1.5;stroke-linejoin:round}` +
    `.d{fill:none;stroke:${isLight ? "#94A3B8" : "rgba(15,23,42,0.4)"}}` +
    `.f{fill:${isLight ? "#CBD5E1" : "rgba(15,23,42,0.25)"};stroke:none}</style>` +
    `<rect width="120" height="120" fill="${isLight ? "#E2E8F0" : colour}" fill-opacity="${isLight ? 1 : v.bgOpacity}"/>` +
    `<g transform="${v.transform}">` +
    SHAPES[shape] +
    `</g>` +
    `</svg>`;

  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  cache.set(key, url);
  return url;
}
