"use client";

import React, { useState } from "react";
import { Clock, ShieldCheck, Navigation, CreditCard, Activity, ArrowUpRight } from "lucide-react";
import { useRail, RailDots, RAIL_BASE, RAIL_CARD } from "./MobileRail";

// Vendor "In Numbers" is a dashboard-style KPI scorecard.
// (The semicircle radial gauge is intentionally kept exclusive to the customer site.)
export default function VendorStandardInNumbers() {
  const [activeTile, setActiveTile] = useState(0);
  // on mobile the centred card in the swipe rail is the highlighted one
  const { ref: railRef, index: railIndex, goTo: railGoTo } = useRail(4, setActiveTile);

  const kpis = [
    {
      label: "Onboarding",
      metric: "15",
      unit: "MINS",
      title: "Quick Vendor Onboarding",
      desc: "Register your laundry facility and store staff in under 15 minutes with zero setup fees.",
      icon: Clock,
      meter: 25,
    },
    {
      label: "Logistics",
      metric: "100%",
      unit: "LIVE",
      title: "Real-Time GPS Tracking",
      desc: "Doorstep pickup and delivery logistics tracked automatically from customer to your facility.",
      icon: Navigation,
      meter: 50,
    },
    {
      label: "Quality",
      metric: "48",
      unit: "POINT",
      title: "Standardised Quality SOPs",
      desc: "Digital barcode tagging, Hydrocarbon solvent care, and multi-point inspection on every order.",
      icon: ShieldCheck,
      meter: 75,
    },
    {
      label: "Payouts",
      metric: "7",
      unit: "DAY",
      title: "Guaranteed Bank Payouts",
      desc: "Weekly automated settlements directly into your bank account with zero hidden commissions.",
      icon: CreditCard,
      meter: 100,
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#F4F7F2] border-y border-slate-200/70 relative overflow-hidden">
      {/* Blueprint grid lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #dfe7dc 1px, transparent 1px), linear-gradient(to bottom, #dfe7dc 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header: left-aligned title + live status chip */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10 sm:mb-14">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-[11px] font-mono font-bold tracking-widest text-[#00875A] uppercase mb-3">
              <Activity className="w-3.5 h-3.5" />
              Partner Scorecard
            </span>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#022B22] leading-[1.1]">
              The Cleclo Vendor Standard, <span className="text-[#00875A]">in numbers.</span>
            </h2>
            <p className="text-sm sm:text-lg text-slate-500 leading-relaxed mt-3">
              What partnering with Cleclo actually means for your laundry business.
            </p>
          </div>

          <div className="inline-flex items-center gap-3 self-start md:self-auto px-4 py-2.5 rounded-xl bg-[#022B22] text-white shadow-lg">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#D4F63D] opacity-75 animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#D4F63D]" />
            </span>
            <span className="text-[11px] sm:text-xs font-mono font-bold tracking-wider uppercase">
              Live partner metrics
            </span>
          </div>
        </div>

        {/* KPI Tiles: 1 col mobile, 2 col tablet, 4 col desktop */}
        <div ref={railRef} className={`${RAIL_BASE} sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-5 sm:overflow-visible sm:mx-0 sm:px-0 sm:pb-0`}>
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            const isActive = activeTile === idx;

            return (
              <div
                key={kpi.label}
                onMouseEnter={() => setActiveTile(idx)}
                onClick={() => setActiveTile(idx)}
                className={`${RAIL_CARD} sm:w-auto sm:max-w-none relative rounded-2xl border p-5 sm:p-6 flex flex-col transition-all duration-300 cursor-pointer select-none ${
                  isActive
                    ? "bg-[#022B22] border-[#022B22] text-white shadow-[0_18px_40px_rgba(2,43,34,0.25)]"
                    : "bg-white border-slate-200 text-[#022B22] hover:border-[#00875A]/50"
                }`}
              >
                {/* Widget header row */}
                <div className="flex items-center justify-between mb-5 sm:mb-8">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                        isActive ? "bg-[#D4F63D] text-[#022B22]" : "bg-emerald-50 text-[#00875A]"
                      }`}
                    >
                      <Icon className="w-4.5 h-4.5 stroke-[2.3]" />
                    </div>
                    <span
                      className={`text-[11px] font-mono font-bold uppercase tracking-widest ${
                        isActive ? "text-slate-300" : "text-slate-400"
                      }`}
                    >
                      {kpi.label}
                    </span>
                  </div>
                  <ArrowUpRight
                    className={`w-4 h-4 transition-colors ${isActive ? "text-[#D4F63D]" : "text-slate-300"}`}
                  />
                </div>

                {/* Metric */}
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="font-display text-5xl sm:text-6xl font-black tracking-tight leading-none">
                    {kpi.metric}
                  </span>
                  <span
                    className={`text-xs font-mono font-bold tracking-widest ${
                      isActive ? "text-[#D4F63D]" : "text-[#00875A]"
                    }`}
                  >
                    {kpi.unit}
                  </span>
                </div>

                <h3 className="font-display text-base sm:text-lg font-extrabold tracking-tight mb-1.5">
                  {kpi.title}
                </h3>
                <p
                  className={`text-xs sm:text-sm leading-relaxed ${
                    isActive ? "text-slate-300" : "text-slate-500"
                  }`}
                >
                  {kpi.desc}
                </p>

                {/* Mini progress meter (journey stage) */}
                <div className="mt-auto pt-5">
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider mb-1.5">
                    <span className="text-slate-400">
                      Stage {idx + 1}/{kpis.length}
                    </span>
                    <span className={isActive ? "text-[#D4F63D]" : "text-[#00875A]"}>{kpi.meter}%</span>
                  </div>
                  <div className={`h-1.5 rounded-full overflow-hidden ${isActive ? "bg-white/10" : "bg-slate-100"}`}>
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isActive ? "bg-[#D4F63D]" : "bg-[#00875A]"
                      }`}
                      style={{ width: `${kpi.meter}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <RailDots count={kpis.length} index={railIndex} onSelect={railGoTo} className="sm:hidden mt-2" />

      </div>
    </section>
  );
}
