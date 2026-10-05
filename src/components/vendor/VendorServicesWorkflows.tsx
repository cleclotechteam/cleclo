"use client";

import React, { useState } from "react";
import { Sparkles, CheckCircle2, Zap } from "lucide-react";

export default function VendorServicesWorkflows() {
  const [activeCard, setActiveCard] = useState<number>(0);

  const categories = [
    {
      title: "Dry Clean",
      headline: "Enable professional dry-cleaning workflows for delicate garments, formal wear and specialty fabrics.",
      bullets: [
        "Configurable stain treatment workflows.",
        "Fabric specific handling options.",
        "Premium finishing standards.",
      ],
    },
    {
      title: "Washing",
      headline: "Enable standardized washing workflows for everyday garments with configurable processes across fabric types.",
      bullets: [
        "Fabric-wise and color-based wash segregation.",
        "Detergent, water level and cycle configuration.",
        "Quality checks and freshness controls.",
      ],
    },
    {
      title: "Steam Iron",
      headline: "Provide professional pressing and finishing services with controlled turnaround times.",
      bullets: [
        "Consistent finishing quality.",
        "Fabric-safe temperature controls.",
        "Priority processing options.",
      ],
    },
    {
      title: "Premium Care",
      headline: "Enable premium-care workflows for luxury garments, designer wear and high-value items.",
      bullets: [
        "Specialized handling protocols.",
        "Optional value-protection coverage.",
        "Controlled handover and packaging.",
      ],
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#022B22] text-white relative overflow-hidden">
      
      {/* Subtle Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#00B074]/15 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#D4F63D]" />
            <span className="text-xs font-mono font-bold tracking-widest text-[#D4F63D] uppercase">
              Services &amp; Workflows
            </span>
          </div>

          <h2 className="font-display text-2xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
            Services &amp; Standardised <br />
            <span className="text-[#D4F63D]">Processing Categories</span>
          </h2>
        </div>

        {/* 4 Category Cards - Mobile Horizontal Scroll Rail / Desktop Grid */}
        <div className="flex md:grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 pb-4 sm:pb-0 mb-6 sm:mb-12">
          {categories.map((item, idx) => {
            const isActive = activeCard === idx;
            return (
              <div
                key={idx}
                onClick={() => setActiveCard(idx)}
                onMouseEnter={() => setActiveCard(idx)}
                className={`w-[80vw] max-w-[290px] md:w-full md:max-w-none shrink-0 md:shrink snap-center p-6 sm:p-8 rounded-[28px] sm:rounded-[32px] border backdrop-blur-md transition-all duration-300 flex flex-col justify-between cursor-pointer select-none min-h-[300px] ${
                  isActive
                    ? "bg-white/10 border-[#D4F63D] shadow-[0_12px_32px_rgba(212,246,61,0.15)] -translate-y-1"
                    : "bg-white/5 border-white/10 hover:border-[#D4F63D]/40"
                }`}
              >
                <div>
                  <div className="inline-block text-xs font-mono font-extrabold tracking-widest text-[#D4F63D] uppercase px-3 py-1 rounded-md bg-white/10 border border-white/15 mb-4">
                    CATEGORY {idx + 1}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-3 font-display">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal mb-6">
                    {item.headline}
                  </p>

                  <div className="space-y-3 pt-4 border-t border-white/10">
                    {item.bullets.map((b, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-[#D4F63D] shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Rail Indicator Dots */}
        <div className="flex items-center justify-center gap-1.5 md:hidden mb-8">
          {categories.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCard(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeCard === idx
                  ? "w-6 bg-[#D4F63D]"
                  : "w-1.5 bg-white/20"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Bottom Note */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/10 border border-white/15 text-center flex items-center justify-center gap-2 text-xs sm:text-sm text-[#D4F63D] font-bold">
          <Zap className="w-4 h-4 stroke-[2.5] shrink-0" />
          <span>Priority turnaround options can be configured across all service categories.</span>
        </div>

      </div>
    </section>
  );
}
