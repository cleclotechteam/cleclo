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

  const cards = [
    {
      step: "01",
      label: "ONBOARDING",
      title: "Simple Vendor Onboarding",
      tag: "QUICK SETUP · CLEAR REQUIREMENTS",
      desc: "Register your laundry business, submit verification documents and configure your outlets and service capabilities through a streamlined onboarding process.",
      icon: Clock,
      meter: 25,
    },
    {
      step: "02",
      label: "LOGISTICS",
      title: "Connected Order Tracking",
      tag: "ORDER VISIBILITY · DELIVERY COORDINATION",
      desc: "Track order allocation, pickup and delivery milestones through one connected platform, with clear visibility into order status.",
      icon: Navigation,
      meter: 50,
    },
    {
      step: "03",
      label: "QUALITY",
      title: "Standardised Quality Workflows",
      tag: "DIGITAL TAGGING · PROCESS CONSISTENCY",
      desc: "Follow standardised operating procedures, digital item tagging and quality checks to support consistent garment care and order handling.",
      icon: ShieldCheck,
      meter: 75,
    },
    {
      step: "04",
      label: "PAYOUTS",
      title: "Transparent Vendor Payouts",
      tag: "FIXED VENDOR RATES · PAYOUT VISIBILITY",
      desc: "Review applicable vendor rates, completed order records and payout status with greater transparency and clarity over your earnings.",
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
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 text-[11px] font-mono font-bold tracking-widest text-[#00875A] uppercase mb-3">
              <Activity className="w-3.5 h-3.5" />
              CLECLO PARTNER ADVANTAGES
            </span>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#022B22] leading-[1.1]">
              The Cleclo Vendor Standard.
            </h2>
            <p className="text-sm sm:text-lg text-slate-600 leading-relaxed mt-3 font-normal">
              The tools, processes and transparency to run your laundry operations with confidence.
            </p>
          </div>

          <div className="inline-flex items-center gap-3 self-start md:self-auto px-4 py-2.5 rounded-xl bg-[#022B22] text-white shadow-lg">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#D4F63D] opacity-75 animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#D4F63D]" />
            </span>
            <span className="text-[11px] sm:text-xs font-mono font-bold tracking-wider uppercase">
              LIVE PARTNER METRICS
            </span>
          </div>
        </div>

        {/* Cards Grid: 1 col mobile, 2 col tablet, 4 col desktop */}
        <div ref={railRef} className={`${RAIL_BASE} sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-5 sm:overflow-visible sm:mx-0 sm:px-0 sm:pb-0`}>
          {cards.map((card, idx) => {
            const Icon = card.icon;
            const isActive = activeTile === idx;

            return (
              <div
                key={card.label}
                onMouseEnter={() => setActiveTile(idx)}
                onClick={() => setActiveTile(idx)}
                className={`${RAIL_CARD} sm:w-auto sm:max-w-none relative rounded-2xl border p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 cursor-pointer select-none min-h-[310px] ${
                  isActive
                    ? "bg-[#022B22] border-[#022B22] text-white shadow-[0_18px_40px_rgba(2,43,34,0.25)]"
                    : "bg-white border-slate-200 text-[#022B22] hover:border-[#00875A]/50"
                }`}
              >
                <div>
                  {/* Card top row */}
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
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
                        {card.step} · {card.label}
                      </span>
                    </div>
                    <ArrowUpRight
                      className={`w-4 h-4 transition-colors ${isActive ? "text-[#D4F63D]" : "text-slate-300"}`}
                    />
                  </div>

                  {/* Title & Tag */}
                  <h3 className="font-display text-lg sm:text-xl font-extrabold tracking-tight mb-2 leading-snug">
                    {card.title}
                  </h3>

                  <div className="mb-4">
                    <span
                      className={`inline-block text-[10px] font-mono font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-md ${
                        isActive
                          ? "bg-[#D4F63D]/15 text-[#D4F63D] border border-[#D4F63D]/30"
                          : "bg-emerald-50 text-[#00875A] border border-emerald-200/70"
                      }`}
                    >
                      {card.tag}
                    </span>
                  </div>

                  {/* Description */}
                  <p
                    className={`text-xs sm:text-sm leading-relaxed font-normal ${
                      isActive ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    {card.desc}
                  </p>
                </div>

                {/* Bottom progress meter */}
                <div className="mt-6 pt-4 border-t border-slate-100/10">
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider mb-1.5">
                    <span className="text-slate-400">STAGE {card.step}/04</span>
                    <span className={isActive ? "text-[#D4F63D]" : "text-[#00875A]"}>{card.meter}%</span>
                  </div>
                  <div className={`h-1.5 rounded-full overflow-hidden ${isActive ? "bg-white/10" : "bg-slate-100"}`}>
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isActive ? "bg-[#D4F63D]" : "bg-[#00875A]"
                      }`}
                      style={{ width: `${card.meter}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <RailDots count={cards.length} index={railIndex} onSelect={railGoTo} className="sm:hidden mt-2" />

      </div>
    </section>
  );
}
