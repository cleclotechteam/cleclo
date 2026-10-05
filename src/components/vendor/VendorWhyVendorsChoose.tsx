"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  Cpu,
  MapPin,
  Layers,
  ShieldCheck,
  Award,
  CheckCircle2,
  HeartHandshake,
} from "lucide-react";

export default function VendorWhyVendorsChoose() {
  const [activeCard, setActiveCard] = useState<number>(0);

  const features = [
    {
      title: "Increased Order Volume",
      desc: "Gain access to a growing network of customers actively seeking professional laundry services in your service area.",
      icon: TrendingUp,
    },
    {
      title: "Smart Automation",
      desc: "Automated order routing, delivery workflows and customer updates, significantly reducing manual coordination.",
      icon: Cpu,
    },
    {
      title: "Location-Based Assignment",
      desc: "Orders are intelligently routed to the most suitable outlet based on proximity and availability.",
      icon: MapPin,
    },
    {
      title: "Scalable Growth",
      desc: "Scale from a single outlet to a multi-location operation with systems designed to support high-volume growth.",
      icon: Layers,
    },
    {
      title: "Platform Reliability",
      desc: "Built on robust infrastructure with high availability to ensure uninterrupted operations.",
      icon: ShieldCheck,
    },
    {
      title: "Vendor Recognition",
      desc: "High-performing vendors may receive enhanced visibility, performance badges and platform recognition.",
      icon: Award,
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-50/70 relative overflow-hidden border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#00875A] animate-pulse shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#00875A]">
              JOIN RAPIDLY GROWING VENDOR NETWORK
            </span>
          </div>

          <h2 className="font-display text-2xl sm:text-5xl font-extrabold tracking-tight text-[#022B22] leading-tight mb-4">
            Why Vendors Choose Cleclo
          </h2>

          <p className="text-xs sm:text-base text-slate-600 font-normal leading-relaxed">
            Join thousands of laundry vendors already growing their business with Cleclo.
          </p>
        </div>

        {/* 6 Feature Cards - Mobile Horizontal Scroll Rail / Desktop Grid */}
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 pb-4 sm:pb-0 mb-6 sm:mb-12">
          {features.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeCard === idx;
            return (
              <div
                key={idx}
                onClick={() => setActiveCard(idx)}
                onMouseEnter={() => setActiveCard(idx)}
                className={`w-[78vw] max-w-[280px] md:w-full md:max-w-none shrink-0 md:shrink snap-center p-6 sm:p-7 rounded-[28px] border transition-all duration-300 flex flex-col justify-between group min-h-[260px] cursor-pointer select-none ${
                  isActive
                    ? "bg-white border-[#00875A] shadow-[0_12px_32px_rgba(0,135,90,0.12)] -translate-y-1"
                    : "bg-white border-slate-200/90 hover:border-[#00875A]"
                }`}
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#022B22] text-[#D4F63D] flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 stroke-[2.2]" />
                  </div>

                  <h3 className="text-lg sm:text-xl font-extrabold text-[#022B22] tracking-tight mb-2.5 font-display group-hover:text-[#00875A] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-[#00875A]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Cleclo Verified Advantage</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Rail Indicator Dots */}
        <div className="flex items-center justify-center gap-1.5 md:hidden mb-8">
          {features.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCard(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeCard === idx
                  ? "w-6 bg-[#00875A]"
                  : "w-1.5 bg-slate-200"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Bottom Callout Box */}
        <div className="p-5 sm:p-8 rounded-[24px] sm:rounded-[32px] bg-[#022B22] text-white border border-emerald-900 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3 text-left">
            <HeartHandshake className="w-7 h-7 sm:w-8 sm:h-8 text-[#D4F63D] shrink-0" />
            <div>
              <p className="font-extrabold text-xs sm:text-base text-white">
                Join rapidly growing laundry and drycleaning vendor network who trust Cleclo.
              </p>
              <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">
                Designed for long-term partnerships, not short-term transactions.
              </p>
            </div>
          </div>

          <span className="text-[11px] sm:text-xs font-mono font-extrabold text-[#D4F63D] bg-white/10 px-3.5 py-2 rounded-full border border-white/15 shrink-0">
            Long-Term Partner Promise ✓
          </span>
        </div>

      </div>
    </section>
  );
}
