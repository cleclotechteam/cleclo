"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Building2,
  Cpu,
  TrendingUp,
  ShieldCheck,
  CreditCard,
  Truck,
  Tag,
  Clock,
  Check,
  ChevronLeft,
  ChevronRight,
  Hand,
} from "lucide-react";
import styles from "./ToolFlipBook.module.css";

/* =====================================================================
   Cleclo vendor toolkit as a flip-book.
   The page-turn engine follows the ThreeUI sketchbook: the turning leaf
   is a chain of nested strips whose tangent sweeps through an arc, lit
   per strip, driven by a spring (or a fixed-tempo tween when riffling).
   Pages are HTML instead of images. Desktop shows two-page spreads;
   narrow screens show one page at a time, bound on the left edge.
   ===================================================================== */

type ThemeKey = "ops" | "insights" | "trust";
type Visual = "outlets" | "chart" | "steps" | "uptime";
type Mode = "double" | "single";

const THEMES: Record<ThemeKey, { label: string; dot: string; text: string; tile: string; soft: string; solid: string; stroke: string }> = {
  ops: {
    label: "Operations",
    dot: "bg-[#00875A]",
    text: "text-[#00875A]",
    tile: "bg-emerald-50 text-[#00875A]",
    soft: "bg-emerald-100",
    solid: "bg-[#00875A]",
    stroke: "#00875A",
  },
  insights: {
    label: "Insights & Revenue",
    dot: "bg-sky-600",
    text: "text-sky-600",
    tile: "bg-sky-50 text-sky-600",
    soft: "bg-sky-100",
    solid: "bg-sky-500",
    stroke: "#0284C7",
  },
  trust: {
    label: "Trust & Compliance",
    dot: "bg-violet-600",
    text: "text-violet-600",
    tile: "bg-violet-50 text-violet-600",
    soft: "bg-violet-100",
    solid: "bg-violet-500",
    stroke: "#7C3AED",
  },
};

const TOOLS: { title: string; desc: string; icon: React.ElementType; theme: ThemeKey; visual?: Visual }[] = [
  {
    title: "Multi-Outlet Management",
    desc: "Centrally manage multiple outlets and processing units with real-time visibility across orders, capacity and performance.",
    icon: Building2,
    theme: "ops",
    visual: "outlets",
  },
  {
    title: "Smart Order Assignment",
    desc: "Automatically allocated orders based on location, capacity, turnaround time and predefined business rules.",
    icon: Cpu,
    theme: "ops",
  },
  {
    title: "Growth Analytics",
    desc: "Actionable analytics on revenue, order volume, outlet performance and customer trends- updated in real time.",
    icon: TrendingUp,
    theme: "insights",
    visual: "chart",
  },
  {
    title: "Revenue Dashboard",
    desc: "Monitor revenue, commissions, payouts and margins across outlets- with complete financial transparency.",
    icon: CreditCard,
    theme: "insights",
  },
  {
    title: "Verification System",
    desc: "Built-in vendor and rider verification with audit trails to ensure compliance, service quality and operational accountability.",
    icon: ShieldCheck,
    theme: "trust",
    visual: "steps",
  },
  {
    title: "Transparent Pricing",
    desc: "Pre-defined & configured pricing rules with automatic GST calculation, invoicing and tax-ready reporting.",
    icon: Tag,
    theme: "trust",
  },
  {
    title: "Flexible Delivery Workflows",
    desc: "Configure standard and priority delivery workflows with SLA tracking to meet different service commitments.",
    icon: Truck,
    theme: "ops",
  },
  {
    title: "24/7 Platform Availability",
    desc: "Orders, tracking and system workflows remain active 24/7, ensuring uninterrupted operations across outlets.",
    icon: Clock,
    theme: "ops",
    visual: "uptime",
  },
];

// Single-page sequence: cover, contents, then one page per tool
const PAGE_COUNT = TOOLS.length + 2;
const SPREAD_COUNT = Math.ceil(PAGE_COUNT / 2);
const PAGE_NAMES = ["The Vendor Toolkit", "Contents", ...TOOLS.map((t) => t.title)];

const leafOf = (p: number, m: Mode) => (m === "double" ? Math.floor(p / 2) : p);
const pageOf = (l: number, m: Mode) => (m === "double" ? l * 2 : l);

/* ------------------------------------------------ curl constants */
const N = 12; // strips — enough for a smooth curve
const BETA = 0.6; // peak curl of the arc, radians
const TILT_X = 4.5;
const TILT_Y = 7; // degrees — deliberately restrained

/* ------------------------------------------------------ page art */
function MiniVisual({ kind, themeKey }: { kind: Visual; themeKey: ThemeKey }) {
  const theme = THEMES[themeKey];
  if (kind === "outlets") {
    return (
      <div className="space-y-[0.45em]">
        {["Outlet A", "Outlet B", "Outlet C"].map((o, i) => (
          <div key={o} className="flex items-center gap-[0.6em] rounded-[0.6em] bg-white border border-slate-200/80 px-[0.75em] py-[0.45em]">
            <span className={`w-[0.5em] h-[0.5em] rounded-full ${theme.solid}`} />
            <span className="text-[0.7em] font-bold text-slate-700 w-[5em]">{o}</span>
            <div className={`flex-1 h-[0.35em] rounded-full ${theme.soft} overflow-hidden`}>
              <div className={`h-full rounded-full ${theme.solid}`} style={{ width: `${[82, 64, 46][i]}%` }} />
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (kind === "chart") {
    const bars = [30, 42, 38, 55, 62, 74, 90];
    return (
      <div className="h-[7em] flex items-end gap-[0.35em] rounded-[0.6em] bg-white border border-slate-200/80 p-[0.7em]">
        {bars.map((h, i) => (
          <div key={i} className={`flex-1 rounded-[0.3em] ${i === bars.length - 1 ? theme.solid : theme.soft}`} style={{ height: `${h}%` }} />
        ))}
      </div>
    );
  }
  if (kind === "steps") {
    return (
      <div className="flex items-center justify-between rounded-[0.6em] bg-white border border-slate-200/80 px-[0.9em] py-[0.9em]">
        {["Customer", "Pickup", "Vendor"].map((s, i) => (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center gap-[0.35em]">
              <span className={`w-[2em] h-[2em] rounded-full ${theme.solid} text-white flex items-center justify-center`}>
                <Check className="w-[1em] h-[1em] stroke-3" />
              </span>
              <span className="text-[0.62em] font-bold text-slate-600">{s}</span>
            </div>
            {i < 2 && <span className={`flex-1 h-[0.12em] mx-[0.5em] mb-[1.2em] ${theme.soft}`} />}
          </React.Fragment>
        ))}
      </div>
    );
  }
  return (
    <div className="rounded-[0.6em] bg-white border border-slate-200/80 p-[0.75em]">
      <div className="flex items-center justify-between text-[0.6em] font-mono font-bold text-slate-500 mb-[0.8em]">
        <span>00:00</span>
        <span className={theme.text}>● Always on</span>
        <span>24:00</span>
      </div>
      <div className="flex gap-[0.15em]">
        {Array.from({ length: 24 }).map((_, i) => (
          <span key={i} className={`flex-1 h-[1.5em] rounded-[0.15em] ${theme.solid} ${i % 2 ? "opacity-80" : ""}`} />
        ))}
      </div>
    </div>
  );
}

// A loose, hand-drawn squiggle underline
function Squiggle({ color, className = "" }: { color: string; className?: string }) {
  return (
    <svg viewBox="0 0 120 12" className={className} fill="none" aria-hidden="true" preserveAspectRatio="none">
      <path d="M2 8 C 18 2, 30 12, 46 6 S 76 2, 92 7 S 112 9, 118 4" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** Paper page with dotted grid, binding shade and page number. `side` = where the binding is. */
function Paper({ side, num, children }: { side: "left" | "right" | "single"; num: number; children: React.ReactNode }) {
  const bindingOnRight = side === "left";
  return (
    <div
      className={`relative h-full w-full overflow-hidden bg-white text-[#022B22] ${
        side === "left" ? "rounded-l-[0.6em]" : side === "right" ? "rounded-r-[0.6em]" : "rounded-r-[0.6em]"
      }`}
    >
      <div
        className="absolute inset-0 opacity-70"
        style={{ backgroundImage: "radial-gradient(#E2E8F0 0.08em, transparent 0.09em)", backgroundSize: "1.5em 1.5em" }}
      />
      {/* binding shade */}
      <div
        className={`absolute top-0 bottom-0 w-[3em] pointer-events-none ${bindingOnRight ? "right-0" : "left-0"}`}
        style={{
          background: `linear-gradient(${bindingOnRight ? "270deg" : "90deg"}, rgba(15,23,42,0.07), rgba(15,23,42,0) 100%)`,
        }}
      />
      <div className="relative h-full flex flex-col px-[2.2em] pt-[2em] pb-[2.4em]">{children}</div>
      <span
        className={`absolute bottom-[1em] text-[0.68em] font-mono text-slate-400 ${bindingOnRight ? "left-[3.2em]" : "right-[3.2em]"}`}
      >
        {String(num).padStart(2, "0")}
      </span>
    </div>
  );
}

function CoverPage() {
  return (
    <>
      <span className="text-[0.66em] font-mono font-bold tracking-[0.25em] text-slate-500 uppercase">CLECLO · PARTNER TOOLKIT</span>
      <div className="mt-auto mb-auto">
        <p className="font-serif italic text-[1.05em] text-slate-500 mb-[0.4em]">a field guide to</p>
        <h3 className="font-display text-[2.7em] font-extrabold leading-[1.02] tracking-tight">
          The Vendor
          <br />
          Toolkit
        </h3>
        <svg viewBox="0 0 120 12" className="w-[9em] h-[0.8em] mt-[0.5em]" fill="none" aria-hidden="true" preserveAspectRatio="none">
          <defs>
            <linearGradient id="fbTri" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#00875A" />
              <stop offset="55%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
          </defs>
          <path d="M2 8 C 18 2, 30 12, 46 6 S 76 2, 92 7 S 112 9, 118 4" stroke="url(#fbTri)" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
        <p className="text-[0.92em] text-slate-600 leading-relaxed mt-[1.2em] max-w-[22em]">
          Eight purpose-built tools to manage operations and scale your laundry business.
        </p>
      </div>
      <div className="space-y-[0.5em]">
        {(Object.keys(THEMES) as ThemeKey[]).map((k) => (
          <div key={k} className="flex items-center gap-[0.6em] text-[0.78em] font-bold text-slate-700">
            <span className={`w-[0.6em] h-[0.6em] rounded-full ${THEMES[k].dot}`} />
            <span>{THEMES[k].label}</span>
            <span className="ml-auto font-mono text-slate-400">{TOOLS.filter((t) => t.theme === k).length}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function ContentsPage({ onJump }: { onJump: (toolIdx: number) => void }) {
  return (
    <>
      <span className="text-[0.66em] font-mono font-bold tracking-[0.25em] text-slate-500 uppercase">Contents</span>
      <h3 className="font-display text-[1.7em] font-extrabold tracking-tight mt-[0.3em] mb-[0.8em]">What&apos;s inside</h3>
      <ol className="space-y-[0.15em]">
        {TOOLS.map((t, i) => (
          <li key={t.title}>
            <button
              type="button"
              data-fb-link
              onClick={() => onJump(i)}
              className="w-full flex items-baseline gap-[0.6em] py-[0.42em] text-left text-[0.86em] group/link"
            >
              <span className={`w-[0.5em] h-[0.5em] rounded-full shrink-0 self-center ${THEMES[t.theme].dot}`} />
              <span className="font-semibold text-slate-700 group-hover/link:text-[#022B22] group-hover/link:underline underline-offset-2 truncate">
                {t.title}
              </span>
              <span className="flex-1 border-b border-dotted border-slate-300 translate-y-[-0.25em] min-w-[1em]" />
              <span className="font-mono text-[0.85em] text-slate-400">{String(i + 3).padStart(2, "0")}</span>
            </button>
          </li>
        ))}
      </ol>
      <p className="mt-auto font-serif italic text-[0.85em] text-slate-400">Tap a tool to jump to its page.</p>
    </>
  );
}

function ToolPage({ i }: { i: number }) {
  const t = TOOLS[i];
  const theme = THEMES[t.theme];
  const Icon = t.icon;
  return (
    <>
      <div className="flex items-center justify-between">
        <span className={`flex items-center gap-[0.45em] text-[0.66em] font-bold uppercase tracking-[0.14em] ${theme.text}`}>
          <span className={`w-[0.55em] h-[0.55em] rounded-full ${theme.dot}`} />
          {theme.label}
        </span>
        <span className="text-[0.66em] font-mono text-slate-400">No. {String(i + 1).padStart(2, "0")}</span>
      </div>

      {/* icon with a sketched ring */}
      <div className="relative w-[4.2em] h-[4.2em] mt-[1.4em]">
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full -rotate-12" fill="none" aria-hidden="true">
          <path
            d="M50 6 C 76 5, 95 24, 94 50 C 93 77, 74 95, 49 94 C 23 93, 6 75, 7 49 C 8 26, 27 8, 55 7"
            stroke={theme.stroke}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="5 6"
          />
        </svg>
        <div className={`absolute inset-[0.55em] rounded-full flex items-center justify-center ${theme.tile}`}>
          <Icon className="w-[1.45em] h-[1.45em]" strokeWidth={2.1} />
        </div>
      </div>

      <h3 className="font-display text-[1.6em] font-extrabold tracking-tight leading-[1.1] mt-[0.8em]">{t.title}</h3>
      <Squiggle color={theme.stroke} className="w-[6em] h-[0.65em] mt-[0.4em]" />
      <p className="text-[0.9em] text-slate-600 leading-relaxed mt-[0.9em]">{t.desc}</p>

      <div className="mt-auto pt-[1em]">
        {t.visual ? (
          <MiniVisual kind={t.visual} themeKey={t.theme} />
        ) : (
          <div className="rounded-[0.7em] border-2 border-dashed border-slate-200 px-[1em] py-[0.9em] flex items-center gap-[1em]">
            <Icon className={`w-[2.4em] h-[2.4em] shrink-0 ${theme.text} opacity-60`} strokeWidth={1.25} />
            <div className="flex-1 space-y-[0.45em]">
              <div className="h-[0.35em] rounded-full bg-slate-200 w-[90%]" />
              <div className="h-[0.35em] rounded-full bg-slate-200 w-[70%]" />
              <div className={`h-[0.35em] rounded-full ${theme.soft} w-[45%]`} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ------------------------------------------------------ the book */
export default function ToolFlipBook() {
  const persp = useRef<HTMLDivElement>(null);
  const bookEl = useRef<HTMLDivElement>(null);
  const stripEls = useRef<(HTMLDivElement | null)[]>([]);
  const capOut = useRef<HTMLParagraphElement>(null);
  const capIn = useRef<HTMLParagraphElement>(null);

  const [bw, setBw] = useState(0);
  const mode: Mode = bw > 0 && bw < 600 ? "single" : "double";
  const modeRef = useRef<Mode>(mode);
  const leafCount = mode === "double" ? SPREAD_COUNT : PAGE_COUNT;

  // position is stored in single-page units so switching layouts keeps your place
  const [page, setPage] = useState(0);
  const pageRef = useRef(0);
  const leaf = mode === "double" ? Math.floor(page / 2) : page;

  const [turn, setTurn] = useState<{ from: number; to: number } | null>(null);
  const turnRef = useRef<{ from: number; to: number } | null>(null);
  const tRef = useRef(0);
  const dirRef = useRef<"next" | "prev">("next");
  const springRef = useRef<
    | { kind: "spring"; v: number; target: number; k: number; c: number; done: () => void }
    | { kind: "tween"; from: number; target: number; dur: number; e: number; done: () => void }
    | null
  >(null);
  const view = useRef({ rx: 0, ry: 0, trx: 0, try: 0 });
  const raf = useRef<number | null>(null);
  const last = useRef(0);
  const drag = useRef<{ dir: "next" | "prev"; x0: number; w: number; moved: number; vel: number; tPrev: number } | null>(null);
  const jumpTarget = useRef<number | null>(null);
  // a press that starts on a contents link only becomes a page drag once it moves
  const pendingLink = useRef<{ dir: "next" | "prev"; x0: number; w: number } | null>(null);
  const suppressLink = useRef(false);
  const [hintGone, setHintGone] = useState(false);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  /* measure the book; it drives strip geometry and type scale */
  useEffect(() => {
    const el = persp.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setBw(Math.round(entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* ------------------------------------------------ lighting per frame */
  const applyTurn = useCallback((t: number) => {
    const host = persp.current;
    if (!host) return;
    const th = Math.PI * t; // how far the leaf has swung
    const beta = BETA * Math.sin(Math.PI * t); // flat at both ends
    const D = 180 / Math.PI;
    const tt = th + beta;
    const td = (2 * beta) / N;
    host.style.setProperty("--tt", (tt * D).toFixed(2) + "deg");
    host.style.setProperty("--td", (td * D).toFixed(3) + "deg");
    host.style.setProperty("--shade", Math.sin(Math.PI * t).toFixed(3));
    for (let i = 0; i < stripEls.current.length; i++) {
      const s = stripEls.current[i];
      if (!s) continue;
      const l1 = Math.abs(Math.cos(tt - i * td));
      const l2 = Math.abs(Math.cos(tt - (i + 1) * td));
      s.style.setProperty("--lit", l1.toFixed(3));
      s.style.setProperty("--a1", ((1 - l1) * 0.62).toFixed(3));
      s.style.setProperty("--a2", ((1 - l2) * 0.62).toFixed(3));
    }
    // the old title is gone before the new one arrives
    if (capOut.current && capIn.current) {
      capOut.current.style.opacity = (1 - Math.max(0, Math.min(1, (t - 0.1) / 0.28))).toFixed(3);
      capIn.current.style.opacity = Math.max(0, Math.min(1, (t - 0.56) / 0.3)).toFixed(3);
    }
  }, []);

  /* ------------------------------------------------------ spring loop */
  const tick = useCallback(
    function loop(now: number) {
      raf.current = null;
      const dt = Math.min(0.032, (now - last.current) / 1000 || 0.016);
      last.current = now;
      const s = springRef.current;
      if (s && turnRef.current) {
        if (s.kind === "tween") {
          s.e += dt;
          const k = Math.min(1, s.e / s.dur);
          tRef.current = s.from + (s.target - s.from) * k;
          applyTurn(tRef.current);
          if (k >= 1) {
            springRef.current = null;
            s.done();
          }
        } else {
          const x = tRef.current - s.target;
          s.v += (-s.k * x - s.c * s.v) * dt;
          tRef.current += s.v * dt;
          if (Math.abs(tRef.current - s.target) < 0.002 && Math.abs(s.v) < 0.02) {
            tRef.current = s.target;
            springRef.current = null;
            applyTurn(tRef.current);
            s.done();
          } else applyTurn(tRef.current);
        }
      }
      // ease the book's lean toward the cursor
      const v = view.current;
      let moved = false;
      for (const [k, tk] of [
        ["rx", "trx"],
        ["ry", "try"],
      ] as const) {
        const d = v[tk] - v[k];
        if (Math.abs(d) > 0.005) {
          v[k] += d * 0.14;
          moved = true;
        } else v[k] = v[tk];
      }
      if (persp.current) {
        persp.current.style.setProperty("--rx", v.rx.toFixed(2) + "deg");
        persp.current.style.setProperty("--ry", v.ry.toFixed(2) + "deg");
      }
      if ((springRef.current || moved) && raf.current === null) raf.current = requestAnimationFrame(loop);
    },
    [applyTurn]
  );

  const kick = useCallback(() => {
    if (raf.current === null) {
      last.current = performance.now();
      raf.current = requestAnimationFrame(tick);
    }
  }, [tick]);

  useEffect(() => () => {
    if (raf.current !== null) cancelAnimationFrame(raf.current);
  }, []);

  /* ------------------------------------------------------ turn control */
  // Geometry is always "from → to" turning forward; a backward turn is the same leaf played in reverse.
  const startTurn = useCallback((dir: "next" | "prev") => {
    if (turnRef.current) return false;
    const count = modeRef.current === "double" ? SPREAD_COUNT : PAGE_COUNT;
    const cur = leafOf(pageRef.current, modeRef.current);
    if (dir === "next" && cur >= count - 1) return false;
    if (dir === "prev" && cur <= 0) return false;
    const next = dir === "next" ? { from: cur, to: cur + 1 } : { from: cur - 1, to: cur };
    dirRef.current = dir;
    tRef.current = dir === "next" ? 0 : 1;
    turnRef.current = next;
    setTurn(next);
    return true;
  }, []);

  const finish = useCallback(
    (commit: boolean, tweenDur?: number) => {
      const tr = turnRef.current;
      if (!tr) return;
      const dir = dirRef.current;
      const target = (dir === "next") === commit ? 1 : 0;
      const done = () => {
        if (commit) {
          const newLeaf = dir === "next" ? tr.to : tr.from;
          pageRef.current = pageOf(newLeaf, modeRef.current);
          setPage(pageRef.current);
        }
        turnRef.current = null;
        setTurn(null);
      };
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
        tRef.current = target;
        applyTurn(target);
        done();
        return;
      }
      springRef.current = tweenDur
        ? { kind: "tween", from: tRef.current, target, dur: tweenDur, e: 0, done }
        : { kind: "spring", v: 0, target, k: 150, c: 22, done };
      kick();
    },
    [applyTurn, kick]
  );

  const turnBy = useCallback(
    (dir: "next" | "prev") => {
      jumpTarget.current = null;
      setHintGone(true);
      if (startTurn(dir)) finish(true);
    },
    [startTurn, finish]
  );

  /* riffle toward a page one leaf at a time, at a fixed tempo */
  const step = useCallback(() => {
    const target = jumpTarget.current;
    if (target === null || turnRef.current) return;
    const cur = leafOf(pageRef.current, modeRef.current);
    const goal = leafOf(target, modeRef.current);
    if (goal === cur) {
      jumpTarget.current = null;
      return;
    }
    if (startTurn(goal > cur ? "next" : "prev")) finish(true, 0.34);
  }, [startTurn, finish]);

  const jumpToTool = useCallback(
    (toolIdx: number) => {
      if (suppressLink.current) {
        suppressLink.current = false;
        return;
      }
      setHintGone(true);
      jumpTarget.current = toolIdx + 2;
      step();
    },
    [step]
  );

  // continue a riffle after each leaf lands
  useEffect(() => {
    if (!turn && jumpTarget.current !== null) step();
  }, [turn, step]);

  // paint the first frame of a new turn once its strips exist
  useLayoutEffect(() => {
    if (turn) applyTurn(tRef.current);
    else persp.current?.style.setProperty("--shade", "0");
  }, [turn, applyTurn]);

  /* ------------------------------------------------------- pointer work */
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    const r = bookEl.current?.getBoundingClientRect();
    if (!r || !r.width) return;
    const dir = (e.clientX - r.left) / r.width > 0.5 ? "next" : "prev";
    suppressLink.current = false;
    if ((e.target as HTMLElement).closest("[data-fb-link]")) {
      pendingLink.current = { dir, x0: e.clientX, w: r.width }; // a tap still follows the link
      return;
    }
    jumpTarget.current = null;
    if (!startTurn(dir)) return;
    e.preventDefault();
    setHintGone(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { dir, x0: e.clientX, w: r.width, moved: 0, vel: 0, tPrev: performance.now() };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const pl = pendingLink.current;
    if (pl && Math.abs(e.clientX - pl.x0) > 8) {
      pendingLink.current = null;
      jumpTarget.current = null;
      if (startTurn(pl.dir)) {
        suppressLink.current = true;
        setHintGone(true);
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        drag.current = { dir: pl.dir, x0: pl.x0, w: pl.w, moved: 0, vel: 0, tPrev: performance.now() };
      }
    }
    const d = drag.current;
    if (d) {
      const dx = e.clientX - d.x0;
      d.moved = Math.max(d.moved, Math.abs(dx));
      const p = Math.max(0, Math.min(1, (d.dir === "next" ? -dx : dx) / (d.w * 0.62)));
      const t = d.dir === "next" ? p : 1 - p;
      const now = performance.now();
      const prevP = d.dir === "next" ? tRef.current : 1 - tRef.current;
      d.vel = (p - prevP) / Math.max(0.001, (now - d.tPrev) / 1000);
      d.tPrev = now;
      tRef.current = t;
      applyTurn(t);
      return;
    }
    // the book leans toward the cursor — never far
    if (e.pointerType === "touch") return;
    const r = bookEl.current?.getBoundingClientRect();
    if (!r || !r.width) return;
    const nx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width * 0.62)));
    const ny = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height * 0.9)));
    view.current.trx = -ny * TILT_X;
    view.current.try = nx * TILT_Y;
    kick();
  };

  const endDrag = () => {
    pendingLink.current = null;
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    if (!turnRef.current) return;
    if (d.moved < 6) {
      finish(true); // a tap, not a drag
      return;
    }
    const p = d.dir === "next" ? tRef.current : 1 - tRef.current;
    finish(p > 0.42 || d.vel > 1.1);
  };

  const onPointerLeave = () => {
    if (drag.current) return;
    view.current.trx = 0;
    view.current.try = 0;
    kick();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      turnBy("next");
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      turnBy("prev");
    }
  };

  /* ------------------------------------------------------- rendering */
  const renderPage = (p: number, side: "left" | "right" | "single") => (
    <Paper side={side} num={p + 1}>
      {p === 0 ? <CoverPage /> : p === 1 ? <ContentsPage onJump={jumpToTool} /> : p < PAGE_COUNT ? <ToolPage i={p - 2} /> : null}
    </Paper>
  );

  // a "leaf" is a two-page spread (double) or one page (single)
  const renderLeaf = (l: number) =>
    mode === "double" ? (
      <div className="flex h-full w-full">
        <div className="w-1/2 h-full">{renderPage(l * 2, "left")}</div>
        <div className="w-1/2 h-full">{l * 2 + 1 < PAGE_COUNT ? renderPage(l * 2 + 1, "right") : <Paper side="right" num={l * 2 + 2}>{null}</Paper>}</div>
      </div>
    ) : (
      renderPage(l, "single")
    );

  const leafName = (l: number) =>
    mode === "double"
      ? l === 0
        ? "The Vendor Toolkit · Contents"
        : `${PAGE_NAMES[l * 2]}${l * 2 + 1 < PAGE_COUNT ? " · " + PAGE_NAMES[l * 2 + 1] : ""}`
      : PAGE_NAMES[l];

  const g = mode === "double" ? 0.5 : 0; // binding position, as a fraction of book width
  const span = mode === "double" ? 0.5 : 1; // binding → outer page edge
  const sw = (bw * span) / N;
  const fontSize = bw ? Math.max(11, Math.min(17, mode === "double" ? bw / 60 : bw / 24)) : 15;

  const renderStrip = (i: number, tr: { from: number; to: number }): React.ReactNode => {
    if (i >= N) return null;
    const front = -(g * bw + i * sw); // faces the from-leaf
    const back = (i + 1) * sw - g * bw; // faces the to-leaf
    return (
      <div
        ref={(el) => {
          stripEls.current[i] = el;
        }}
        className={styles.strip}
      >
        <div className={`${styles.face} ${styles.front}`}>
          <div className={styles.spread} style={{ left: front }}>
            {renderLeaf(tr.from)}
          </div>
          <div className={styles.sh} />
          <div className={styles.gl} />
        </div>
        <div className={`${styles.face} ${styles.back}`}>
          {mode === "double" ? (
            <div className={styles.spread} style={{ left: back }}>
              {renderLeaf(tr.to)}
            </div>
          ) : (
            <div className={styles.paperBack} />
          )}
          <div className={styles.sh} />
          <div className={styles.gl} />
        </div>
        {renderStrip(i + 1, tr)}
      </div>
    );
  };

  const bookVars = {
    "--bw": `${bw}px`,
    "--g": g,
    "--span": span,
    "--n": N,
    fontSize: `${fontSize}px`,
    aspectRatio: mode === "double" ? "1.7" : "0.8",
  } as React.CSSProperties;

  return (
    <div className="w-full flex flex-col items-center gap-5 sm:gap-6">
      <div
        className={styles.stage}
        tabIndex={0}
        role="region"
        aria-roledescription="flip book"
        aria-label="Cleclo vendor tools flip book. Use left and right arrow keys to turn pages."
        onKeyDown={onKeyDown}
      >
        <button type="button" className={`${styles.arrow} hidden sm:inline-flex`} onClick={() => turnBy("prev")} disabled={leaf <= 0 && !turn} aria-label="Previous page">
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div ref={persp} className={styles.persp}>
          <div className={styles.tilt}>
            <div className={`${styles.cast} ${styles.castAmbient}`} aria-hidden="true" />
            <div className={`${styles.cast} ${styles.castContact}`} aria-hidden="true" />
            <div
              ref={bookEl}
              className={styles.book}
              style={bookVars}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onPointerLeave={onPointerLeave}
              onDragStart={(e) => e.preventDefault()}
            >
              <div className={styles.pages} aria-hidden="true" />
              {!turn ? (
                <div className={styles.full}>
                  <div className={styles.spread}>{renderLeaf(leaf)}</div>
                </div>
              ) : mode === "double" ? (
                <>
                  <div className={`${styles.half} ${styles.halfLeft}`}>
                    <div className={styles.spread}>{renderLeaf(turn.from)}</div>
                    <div className={`${styles.gutterShade} ${styles.gutterLeft}`} />
                  </div>
                  <div className={`${styles.half} ${styles.halfRight}`}>
                    <div className={styles.spread}>{renderLeaf(turn.to)}</div>
                    <div className={`${styles.gutterShade} ${styles.gutterRight}`} />
                  </div>
                  <div className={styles.curl}>{renderStrip(0, turn)}</div>
                </>
              ) : (
                <>
                  <div className={styles.full}>
                    <div className={styles.spread}>{renderLeaf(turn.to)}</div>
                    <div className={`${styles.gutterShade} ${styles.gutterRight}`} />
                  </div>
                  <div className={styles.curl}>{renderStrip(0, turn)}</div>
                </>
              )}
            </div>
          </div>
        </div>

        <button type="button" className={`${styles.arrow} hidden sm:inline-flex`} onClick={() => turnBy("next")} disabled={leaf >= leafCount - 1 && !turn} aria-label="Next page">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* caption + progress */}
      <div className="w-full max-w-xl flex flex-col items-center gap-2 px-2">
        <div className={`${styles.captions} font-display text-sm sm:text-base font-bold text-[#022B22]`} aria-live="polite">
          {turn ? (
            <>
              <p ref={capOut} className={styles.caption}>{leafName(turn.from)}</p>
              <p ref={capIn} className={styles.caption} style={{ opacity: 0 }}>{leafName(turn.to)}</p>
            </>
          ) : (
            <p key={leaf} className={`${styles.caption} ${styles.captionStatic}`}>{leafName(leaf)}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button type="button" className={`${styles.arrow} inline-flex sm:hidden !w-9 !h-9`} onClick={() => turnBy("prev")} disabled={leaf <= 0 && !turn} aria-label="Previous page">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: leafCount }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === leaf ? "w-6 bg-[#00875A]" : "w-1.5 bg-slate-300"}`}
              />
            ))}
          </div>
          <button type="button" className={`${styles.arrow} inline-flex sm:hidden !w-9 !h-9`} onClick={() => turnBy("next")} disabled={leaf >= leafCount - 1 && !turn} aria-label="Next page">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <p className={`${styles.hint} ${hintGone ? styles.hintGone : ""} flex items-center gap-1.5 text-xs text-slate-500 font-serif italic`}>
          <Hand className="w-3.5 h-3.5" />
          Drag a page, tap its edge, or use the arrows to turn
        </p>
      </div>
    </div>
  );
}
