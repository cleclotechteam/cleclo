"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Cpu,
  TrendingUp,
  ShieldCheck,
  FileCheck2,
  Award,
  Headphones,
  ArrowUpRight,
  Check,
} from "lucide-react";

export default function VendorSmarterWay() {
  const signupUrl = "/signup";
  const [activeCardIndex, setActiveCardIndex] = useState<number>(1);

  const pillars = [
    {
      number: "01",
      category: "More Customer Reach",
      title: "Access New Customers",
      desc: "Connect with customers beyond your existing neighbourhood and expand your business reach.",
      icon: Users,
      pill: "Expanded Reach",
    },
    {
      number: "02",
      category: "Smarter Operations",
      title: "Technology That Works for You",
      desc: "Simplified order management, tracking and operations through one connected platform.",
      icon: Cpu,
      pill: "Unified Platform",
    },
    {
      number: "03",
      category: "Built for Growth",
      title: "Focus on What You Do Best",
      desc: "Cleclo helps bring the business, while you focus on quality, service and timely fulfilment.",
      icon: TrendingUp,
      pill: "Revenue Scale",
    },
  ];

  const trustBadges = [
    { label: "Verified Partners", icon: ShieldCheck },
    { label: "Transparent Payouts", icon: FileCheck2 },
    { label: "Standardised Processes", icon: Award },
    { label: "Dedicated Partner Support", icon: Headphones },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white relative overflow-hidden w-full">
      
      {/* Ambient atmospheric glow in background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-60 bg-gradient-to-r from-emerald-100/30 via-teal-50/20 to-emerald-100/30 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        
        {/* Section Header - Perfectly Centered & Width Constrained */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 px-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50/90 border border-emerald-200/70 mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse shrink-0" />
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-900 leading-snug">
              BUILT FOR LAUNDRY PARTNERS
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-[2.75rem] font-extrabold tracking-tight text-[#0F172A] uppercase leading-[1.1] font-display">
            Grow Your Business. <br />
            <span className="text-[#00875A]">
              The Smarter Way.
            </span>
          </h2>
        </div>

        {/* 3 Pillar Cards Grid / Mobile Horizontal Rail */}
        <div className="w-full overflow-hidden mb-6 sm:mb-12">
          <div className="flex sm:grid sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 py-2">
            {pillars.map((item, idx) => {
              const Icon = item.icon;
              const isActive = activeCardIndex === idx;

              return (
                <div
                  key={idx}
                  onMouseEnter={() => setActiveCardIndex(idx)}
                  onClick={() => setActiveCardIndex(idx)}
                  className={`w-[78vw] max-w-[280px] sm:w-full sm:max-w-none shrink-0 sm:shrink snap-center group relative p-6 sm:p-8 rounded-[28px] sm:rounded-[32px] transition-all duration-300 ease-out cursor-pointer flex flex-col justify-between overflow-hidden min-h-[300px] sm:min-h-[320px] select-none ${
                    isActive
                      ? "bg-[#00875A] text-white shadow-[0_18px_40px_rgba(0,135,90,0.28)] -translate-y-1.5"
                      : "bg-white text-slate-800 border border-slate-200/80 hover:border-emerald-300 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:-translate-y-1"
                  }`}
                >
                  {/* Tactile Dotted Grid Matrix (for active card) */}
                  {isActive && (
                    <div
                      className="absolute inset-0 pointer-events-none rounded-[32px] opacity-25"
                      style={{
                        backgroundImage: "radial-gradient(circle, #ffffff 1.5px, transparent 1.5px)",
                        backgroundSize: "14px 14px",
                      }}
                    />
                  )}

                  {/* Card Content Top Section */}
                  <div className="relative z-10">
                    {/* Top Row: Icon Container + Number Pill */}
                    <div className="flex items-center justify-between mb-5">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          isActive
                            ? "bg-white/20 text-white border border-white/25 backdrop-blur-sm"
                            : "bg-[#E8F8F0] text-[#00875A] border border-[#CDEEDC]"
                        }`}
                      >
                        <Icon className="w-6 h-6 stroke-[2.2]" />
                      </div>

                      <span
                        className={`text-[11px] font-black tracking-wider font-mono px-3 py-1 rounded-full transition-colors ${
                          isActive
                            ? "bg-white/15 text-white border border-white/20"
                            : "bg-slate-100 text-slate-400 border border-slate-200/60"
                        }`}
                      >
                        {item.number}
                      </span>
                    </div>

                    {/* Category Pill */}
                    <span
                      className={`inline-block text-[10px] font-mono font-bold tracking-widest uppercase px-2.5 py-1 rounded-md mb-3 transition-colors ${
                        isActive
                          ? "bg-white/15 text-[#D4F63D] border border-white/20"
                          : "bg-emerald-50 text-[#00875A] border border-emerald-200/70"
                      }`}
                    >
                      {item.category}
                    </span>

                    {/* Title */}
                    <h3
                      className={`text-lg sm:text-xl font-extrabold tracking-tight mb-2.5 leading-snug font-display transition-colors ${
                        isActive ? "text-white" : "text-[#0F172A]"
                      }`}
                    >
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p
                      className={`text-xs sm:text-sm leading-relaxed font-normal transition-colors ${
                        isActive ? "text-white/90" : "text-slate-500"
                      }`}
                    >
                      {item.desc}
                    </p>
                  </div>

                  {/* Card Bottom Tag Pill */}
                  <div
                    className={`relative z-10 mt-6 pt-4 border-t flex items-center justify-between transition-colors ${
                      isActive ? "border-white/15" : "border-slate-100"
                    }`}
                  >
                    <span
                      className={`text-[11px] font-bold px-3 py-1 rounded-lg border transition-all duration-300 ${
                        isActive
                          ? "bg-white/20 text-white border-white/30 backdrop-blur-sm"
                          : "bg-emerald-50 text-emerald-800 border-emerald-200/70"
                      }`}
                    >
                      {item.pill}
                    </span>

                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-700"
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Indicator Pills for Mobile */}
        <div className="flex items-center justify-center gap-2 mb-10 sm:hidden">
          {pillars.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCardIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeCardIndex === idx
                  ? "w-6 bg-[#00875A]"
                  : "w-1.5 bg-slate-200 hover:bg-slate-300"
              }`}
              aria-label={`Select card ${idx + 1}`}
            />
          ))}
        </div>

        {/* Bottom Trust Badges Bar */}
        <div className="p-4 sm:p-8 rounded-[24px] sm:rounded-[32px] bg-[#022B22] text-white border border-emerald-900 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-5 w-full overflow-hidden">
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 w-full md:w-auto min-w-0">
            {trustBadges.map((badge, idx) => {
              const BadgeIcon = badge.icon;
              return (
                <div key={idx} className="flex items-center gap-2 bg-white/10 px-2.5 py-2.5 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl border border-white/15 min-w-0">
                  <BadgeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4F63D] shrink-0" />
                  <span className="text-[11px] sm:text-xs font-extrabold text-white tracking-tight sm:tracking-wide truncate min-w-0">
                    {badge.label}
                  </span>
                </div>
              );
            })}
          </div>

          <Link
            href={signupUrl}
            className="w-full md:w-auto shrink-0 inline-flex items-center justify-center gap-2.5 bg-[#D4F63D] hover:bg-[#c5ea2c] text-[#022B22] font-extrabold text-xs sm:text-sm px-6 sm:px-7 py-3.5 rounded-full transition-all duration-300 shadow-[0_4px_16px_rgba(212,246,61,0.35)] hover:shadow-[0_8px_24px_rgba(212,246,61,0.5)] hover:scale-105 active:scale-95"
          >
            <span>See How Cleclo Works</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>

        </div>

      </div>

    </section>
  );
}
