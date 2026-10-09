"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, CheckCircle2, Zap, Shirt, WashingMachine, Wind, Gem, ChevronRight } from "lucide-react";

export default function VendorServicesWorkflows() {
  const [activeCard, setActiveCard] = useState<number>(0);

  const categories = [
    {
      title: "Dry Clean",
      hint: "Delicates, formal & specialty fabrics",
      icon: Shirt,
      headline: "Enable professional dry-cleaning workflows for delicate garments, formal wear and specialty fabrics.",
      bullets: [
        "Configurable stain treatment workflows.",
        "Fabric specific handling options.",
        "Premium finishing standards.",
      ],
    },
    {
      title: "Washing",
      hint: "Everyday garments, configurable cycles",
      icon: WashingMachine,
      headline: "Enable standardized washing workflows for everyday garments with configurable processes across fabric types.",
      bullets: [
        "Fabric-wise and color-based wash segregation.",
        "Detergent, water level and cycle configuration.",
        "Quality checks and freshness controls.",
      ],
    },
    {
      title: "Steam Iron",
      hint: "Pressing & finishing on a timer",
      icon: Wind,
      headline: "Provide professional pressing and finishing services with controlled turnaround times.",
      bullets: [
        "Consistent finishing quality.",
        "Fabric-safe temperature controls.",
        "Priority processing options.",
      ],
    },
    {
      title: "Premium Care",
      hint: "Luxury, designer & high-value items",
      icon: Gem,
      headline: "Enable premium-care workflows for luxury garments, designer wear and high-value items.",
      bullets: [
        "Specialized handling protocols.",
        "Optional value-protection coverage.",
        "Controlled handover and packaging.",
      ],
    },
  ];

  const active = categories[activeCard];
  const ActiveIcon = active.icon;

  return (
    <section id="services" className="scroll-mt-20 py-16 sm:py-24 bg-white border-t border-slate-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 mb-4">
            <Star className="w-3.5 h-3.5 text-[#00875A] fill-current" />
            <span className="text-xs font-mono font-bold tracking-widest text-[#00875A] uppercase">
              Services &amp; Workflows
            </span>
          </div>

          <h2 className="font-display text-2xl sm:text-5xl font-extrabold tracking-tight text-[#022B22] leading-tight mb-3">
            Services &amp; Standardised <br className="hidden sm:inline" />
            <span className="text-[#00875A]">Processing Categories</span>
          </h2>
          <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
            Pick the services your outlets offer. Each one runs on a standard, configurable workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-stretch">

          {/* Service selector: 2x2 grid on mobile, vertical list on desktop */}
          <div className="lg:col-span-5 grid grid-cols-2 lg:grid-cols-1 gap-2.5 sm:gap-3" role="tablist">
            {categories.map((item, idx) => {
              const Icon = item.icon;
              const isActive = activeCard === idx;
              return (
                <button
                  key={item.title}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCard(idx)}
                  onMouseEnter={() => setActiveCard(idx)}
                  className={`relative text-left flex items-center gap-3 sm:gap-4 p-3 sm:p-5 rounded-2xl border transition-all duration-300 ${
                    isActive
                      ? "bg-[#F0F9F5] border-[#00875A] shadow-[0_10px_28px_rgba(0,135,90,0.12)]"
                      : "bg-white border-slate-200 hover:border-[#00875A]/40 hover:bg-slate-50"
                  }`}
                >
                  {/* Active accent bar (desktop) */}
                  <span
                    className={`hidden lg:block absolute left-0 top-4 bottom-4 w-1 rounded-r-full transition-colors ${
                      isActive ? "bg-[#00875A]" : "bg-transparent"
                    }`}
                  />

                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isActive ? "bg-[#00875A] text-white" : "bg-emerald-50 text-[#00875A]"
                    }`}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.1]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="hidden sm:block text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                      Category 0{idx + 1}
                    </span>
                    <span className="block font-display text-sm sm:text-lg font-extrabold text-[#022B22] leading-tight">
                      {item.title}
                    </span>
                    <span className="hidden lg:block text-xs text-slate-500 mt-0.5 truncate">{item.hint}</span>
                  </div>

                  <ChevronRight
                    className={`hidden lg:block w-5 h-5 shrink-0 transition-all ${
                      isActive ? "text-[#00875A] translate-x-0.5" : "text-slate-300"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-7">
            <div className="h-full rounded-3xl border border-slate-200 bg-gradient-to-br from-[#F0F9F5] via-white to-white p-5 sm:p-10 relative overflow-hidden">
              <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[#D4F63D]/20 blur-3xl pointer-events-none" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCard}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="relative"
                  role="tabpanel"
                >
                  <div className="flex items-center justify-between mb-5 sm:mb-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border border-emerald-200 text-[#00875A] flex items-center justify-center shadow-sm">
                      <ActiveIcon className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2]" />
                    </div>
                    <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-[#00875A] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase">
                      Category 0{activeCard + 1} / 0{categories.length}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl sm:text-4xl font-extrabold text-[#022B22] tracking-tight mb-3">
                    {active.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6 sm:mb-8 max-w-xl">
                    {active.headline}
                  </p>

                  <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                    {active.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex sm:flex-col items-start gap-2.5 sm:gap-3 p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 text-xs sm:text-sm font-medium text-[#022B22] leading-snug"
                      >
                        <CheckCircle2 className="w-5 h-5 text-[#00875A] shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="mt-6 sm:mt-10 p-4 sm:p-5 rounded-2xl bg-[#F6FAEC] border border-[#D4F63D] flex items-center justify-center gap-2.5 text-xs sm:text-sm text-[#022B22] font-bold text-center">
          <Zap className="w-4 h-4 stroke-[2.5] shrink-0 text-[#00875A]" />
          <span>Priority turnaround options can be configured across all service categories.</span>
        </div>

      </div>
    </section>
  );
}
