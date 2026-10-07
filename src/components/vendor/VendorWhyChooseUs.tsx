"use client";

import React, { useState } from "react";
import {
  Building2,
  Cpu,
  TrendingUp,
  ShieldCheck,
  CreditCard,
  Truck,
  Tag,
  Clock,
  Star,
  Check,
} from "lucide-react";

type ThemeKey = "ops" | "insights" | "trust";
type Visual = "outlets" | "chart" | "steps" | "uptime";

// Three accent colours, one per tool group. Full class strings so Tailwind can pick them up.
const THEMES: Record<
  ThemeKey,
  { label: string; dot: string; chipActive: string; tile: string; text: string; soft: string; solid: string; glow: string; hover: string }
> = {
  ops: {
    label: "Operations",
    dot: "bg-[#00875A]",
    chipActive: "bg-[#00875A] text-white border-[#00875A]",
    tile: "bg-gradient-to-br from-emerald-50 to-emerald-100 text-[#00875A] ring-1 ring-emerald-200/70",
    text: "text-[#00875A]",
    soft: "bg-emerald-100",
    solid: "bg-[#00875A]",
    glow: "bg-emerald-200/50",
    hover: "hover:border-emerald-300/80",
  },
  insights: {
    label: "Insights & Revenue",
    dot: "bg-sky-600",
    chipActive: "bg-sky-600 text-white border-sky-600",
    tile: "bg-gradient-to-br from-sky-50 to-sky-100 text-sky-600 ring-1 ring-sky-200/70",
    text: "text-sky-600",
    soft: "bg-sky-100",
    solid: "bg-sky-500",
    glow: "bg-sky-200/50",
    hover: "hover:border-sky-300/80",
  },
  trust: {
    label: "Trust & Compliance",
    dot: "bg-violet-600",
    chipActive: "bg-violet-600 text-white border-violet-600",
    tile: "bg-gradient-to-br from-violet-50 to-violet-100 text-violet-600 ring-1 ring-violet-200/70",
    text: "text-violet-600",
    soft: "bg-violet-100",
    solid: "bg-violet-500",
    glow: "bg-violet-200/50",
    hover: "hover:border-violet-300/80",
  },
};

// Small decorative illustrations for the featured (wide) cards
function MiniVisual({ kind, theme }: { kind: Visual; theme: (typeof THEMES)[ThemeKey] }) {
  if (kind === "outlets") {
    return (
      <div className="space-y-2">
        {["Outlet A", "Outlet B", "Outlet C"].map((o, i) => (
          <div key={o} className="flex items-center gap-2.5 rounded-xl bg-white/80 border border-slate-200/70 px-3 py-2">
            <span className={`w-2 h-2 rounded-full ${theme.solid}`} />
            <span className="text-[11px] font-bold text-slate-700 w-14">{o}</span>
            <div className={`flex-1 h-1.5 rounded-full ${theme.soft} overflow-hidden`}>
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
      <div className="h-full flex items-end gap-1.5 rounded-xl bg-white/80 border border-slate-200/70 p-3">
        {bars.map((h, i) => (
          <div
            key={i}
            className={`flex-1 rounded-md transition-all duration-500 ${i === bars.length - 1 ? theme.solid : theme.soft} group-hover:opacity-100`}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    );
  }
  if (kind === "steps") {
    return (
      <div className="flex items-center justify-between rounded-xl bg-white/80 border border-slate-200/70 px-4 py-4">
        {["Customer", "Pickup", "Vendor"].map((s, i) => (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center gap-1.5">
              <span className={`w-8 h-8 rounded-full ${theme.solid} text-white flex items-center justify-center`}>
                <Check className="w-4 h-4 stroke-[3]" />
              </span>
              <span className="text-[10px] font-bold text-slate-600">{s}</span>
            </div>
            {i < 2 && <span className={`flex-1 h-0.5 mx-2 mb-5 ${theme.soft}`} />}
          </React.Fragment>
        ))}
      </div>
    );
  }
  return (
    <div className="rounded-xl bg-white/80 border border-slate-200/70 p-3">
      <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-500 mb-2">
        <span>00:00</span>
        <span className={theme.text}>● Always on</span>
        <span>24:00</span>
      </div>
      <div className="flex gap-[3px]">
        {Array.from({ length: 24 }).map((_, i) => (
          <span key={i} className={`flex-1 h-6 rounded-sm ${theme.solid} ${i % 2 ? "opacity-80" : ""}`} />
        ))}
      </div>
    </div>
  );
}

export default function VendorWhyChooseUs() {
  const [filter, setFilter] = useState<ThemeKey | "all">("all");

  // Order is tuned for the 4-col bento: [F n n] [n n F] [F F]
  const tools: { title: string; desc: string; icon: React.ElementType; theme: ThemeKey; visual?: Visual }[] = [
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
      title: "Flexible Delivery Workflows",
      desc: "Configure standard and priority delivery workflows with SLA tracking to meet different service commitments.",
      icon: Truck,
      theme: "ops",
    },
    {
      title: "Revenue Dashboard",
      desc: "Monitor revenue, commissions, payouts and margins across outlets- with complete financial transparency.",
      icon: CreditCard,
      theme: "insights",
    },
    {
      title: "Transparent Pricing",
      desc: "Pre-defined & configured pricing rules with automatic GST calculation, invoicing and tax-ready reporting.",
      icon: Tag,
      theme: "trust",
    },
    {
      title: "Growth Analytics",
      desc: "Actionable analytics on revenue, order volume, outlet performance and customer trends- updated in real time.",
      icon: TrendingUp,
      theme: "insights",
      visual: "chart",
    },
    {
      title: "Verification System",
      desc: "Built-in vendor and rider verification with audit trails to ensure compliance, service quality and operational accountability.",
      icon: ShieldCheck,
      theme: "trust",
      visual: "steps",
    },
    {
      title: "24/7 Platform Availability",
      desc: "Orders, tracking and system workflows remain active 24/7, ensuring uninterrupted operations across outlets.",
      icon: Clock,
      theme: "ops",
      visual: "uptime",
    },
  ];

  const filters: (ThemeKey | "all")[] = ["all", "ops", "insights", "trust"];
  const isAll = filter === "all";
  const visible = isAll ? tools : tools.filter((t) => t.theme === filter);
  const gridCols = isAll || visible.length > 2 ? "lg:grid-cols-4" : "lg:grid-cols-2";

  return (
    <section id="features" className="py-16 sm:py-24 bg-gradient-to-b from-white via-slate-50/70 to-white relative overflow-hidden">
      {/* Soft tri-colour glows */}
      <div className="absolute top-20 -left-24 w-72 h-72 rounded-full bg-emerald-200/30 blur-[110px] pointer-events-none" />
      <div className="absolute top-1/3 -right-24 w-72 h-72 rounded-full bg-sky-200/30 blur-[110px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full bg-violet-200/25 blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-4">
            <Star className="w-3.5 h-3.5 text-violet-600 fill-current" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Why Choose Us
            </span>
          </div>

          <h2 className="font-display text-2xl sm:text-5xl font-extrabold tracking-tight text-[#022B22] leading-tight mb-4">
            Purpose Built Tools to Manage Operations <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#00875A] via-sky-600 to-violet-600 bg-clip-text text-transparent">
              and Scale Your Laundry Business.
            </span>
          </h2>

          <p className="text-xs sm:text-base text-slate-600 font-normal leading-relaxed">
            Ideal for independent laundry owners, multi-outlet operators and backend vendors.
          </p>
        </div>

        {/* Category filter chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 sm:mb-12">
          {filters.map((key) => {
            const isActive = filter === key;
            const theme = key === "all" ? null : THEMES[key];
            const count = key === "all" ? tools.length : tools.filter((t) => t.theme === key).length;
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full border text-xs sm:text-sm font-bold transition-all duration-200 ${
                  isActive
                    ? theme
                      ? theme.chipActive
                      : "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                }`}
              >
                {theme ? <span className={`w-2 h-2 rounded-full ${isActive ? "bg-white" : theme.dot}`} /> : null}
                <span>{theme ? theme.label : "All tools"}</span>
                <span className={`text-[10px] font-mono ${isActive ? "opacity-80" : "text-slate-400"}`}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Bento grid */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols} gap-3 sm:gap-5`}>
          {visible.map((item) => {
            const Icon = item.icon;
            const theme = THEMES[item.theme];
            const featured = isAll && !!item.visual;

            return (
              <div
                key={item.title}
                className={`group relative bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-slate-200/80 p-4 sm:p-6 overflow-hidden transition-all duration-300 shadow-[0_2px_12px_rgba(15,23,42,0.03)] hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)] sm:hover:-translate-y-1 ${theme.hover} ${
                  featured ? "sm:col-span-2" : ""
                }`}
              >
                {/* Hover colour wash */}
                <span
                  className={`absolute -bottom-20 -right-20 w-48 h-48 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${theme.glow}`}
                />

                <div className={`relative h-full ${featured ? "sm:grid sm:grid-cols-2 sm:gap-6 sm:items-center" : ""}`}>
                  <div className="flex sm:block gap-4">
                    <div
                      className={`w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-xl sm:rounded-2xl flex items-center justify-center sm:mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 ${theme.tile}`}
                    >
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.1]" />
                    </div>

                    <div className="min-w-0">
                      <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider mb-1 sm:mb-2 ${theme.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${theme.dot}`} />
                        {theme.label}
                      </span>
                      <h3 className="font-display text-base sm:text-lg font-extrabold text-[#022B22] tracking-tight leading-snug mb-1 sm:mb-2">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  {featured && item.visual && (
                    <div className="hidden sm:block h-32">
                      <div className="h-full flex flex-col justify-center">
                        <MiniVisual kind={item.visual} theme={theme} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
