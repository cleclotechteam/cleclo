"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  ArrowRight,
  Navigation,
} from "lucide-react";

export default function WhereWeOperate() {
  const downloadUrl = "https://cleclo-vendor-dash-psi.vercel.app/#download";

  const tiers = [
    {
      tier: "Tier 1",
      subtitle: "Metro & major cities",
      description:
        "Our launch markets, starting with Delhi NCR, with the deepest partner network and fastest onboarding.",
      status: "Live now",
      offsetClass: "lg:translate-y-8",
      imageSrc: "/tier1-delhi-map.jpg",
      imageAlt: "Delhi NCR Live Pickup Map",
    },
    {
      tier: "Tier 2",
      subtitle: "Growing cities",
      description:
        "The same standard price list and SLA, brought to fast-growing cities as partners come online.",
      status: "Onboarding",
      offsetClass: "lg:translate-y-0",
      imageSrc: "/tier2-network-globe.jpg",
      imageAlt: "Expanding Indian Cities Dry Cleaning Network",
    },
    {
      tier: "Tier 3",
      subtitle: "Emerging towns",
      description:
        "Bringing organised, certified dry cleaning to towns that have never had it before.",
      status: "Coming soon",
      offsetClass: "lg:translate-y-8",
      imageSrc: "/tier3-partner-towns.jpg",
      imageAlt: "Certified Dry Cleaning Partner Onboarding Nodes",
    },
  ];

  return (
    <section
      id="where-we-operate"
      className="py-20 lg:py-32 bg-[#F3F4F3] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Title Section (Exact Pine Labs Heading Layout from Image) */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          {/* Eyebrow badge matching banner style */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50/90 border border-emerald-200/70 mb-3 max-w-full">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse shrink-0"></span>
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-900 leading-snug">
              WHERE WE OPERATE
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold text-[#022B22] tracking-tight leading-[1.15]">
            Built for every kind of <br className="hidden sm:inline" />
            <span className="text-[#00875A]">Indian city.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#0A2B24]/75 font-normal leading-relaxed max-w-2xl">
            Cleclo is currently live in Delhi NCR and expanding city by city — onboarding verified partners before we switch a pincode on.
          </p>
        </div>

        {/* 3 Staggered Heights Cards with Custom Tailored Cleclo Visuals */}
        <div className="flex sm:grid sm:grid-cols-3 gap-6 sm:gap-8 overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 pb-6 sm:pb-0 mb-16 lg:mb-24">
          {tiers.map((item) => (
            <div
              key={item.tier}
              className={`w-[78vw] max-w-[290px] sm:w-full sm:max-w-none shrink-0 sm:shrink snap-center group relative bg-white rounded-[36px] p-6 sm:p-8 border border-slate-200/80 shadow-[0_15px_35px_rgba(0,0,0,0.04)] hover:shadow-[0_25px_50px_rgba(0,176,116,0.12)] transition-all duration-300 flex flex-col justify-between overflow-hidden min-h-[470px] ${item.offsetClass}`}
            >
              {/* Card Top Title & Lime Arrow Button */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-xs font-mono font-extrabold text-[#00875A] uppercase tracking-wider block mb-1">
                      {item.tier} • {item.status}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-[#0A2B24] tracking-tight leading-snug">
                      {item.subtitle}
                    </h3>
                  </div>

                  {/* Lime Green Circle Button (Matches Pine Labs Image) */}
                  <div className="w-10 h-10 rounded-full bg-[#D4F63D] text-[#0A2B24] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                    <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
                  </div>
                </div>

                {/* Description (Exact requested copy) */}
                <p className="text-xs sm:text-sm text-[#0A2B24]/75 leading-relaxed font-normal mb-6">
                  {item.description}
                </p>
              </div>

              {/* Bottom Custom Cleclo Business Image Asset */}
              <div className="mt-auto pt-4 relative">
                <div className="relative w-full h-44 sm:h-48 rounded-[24px] overflow-hidden border border-slate-100 shadow-sm group-hover:scale-[1.02] transition-transform duration-300">
                  <Image
                    src={item.imageSrc}
                    alt={item.imageAlt}
                    fill
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner Callout */}
        <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-slate-200/90 shadow-[0_10px_30px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#00B074]/10 text-[#00875A] flex items-center justify-center shrink-0 border border-[#00B074]/20">
              <Navigation className="w-6 h-6 stroke-[2.2]" />
            </div>
            <p className="font-extrabold text-base sm:text-lg text-[#0A2B24]">
              Check pincode-level availability inside the Cleclo app before you book.
            </p>
          </div>

          <Link
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2.5 bg-[#D4F63D] hover:bg-[#c5ea2c] text-[#0A2B24] font-extrabold text-xs sm:text-sm px-7 py-3.5 rounded-full transition-all duration-300 shadow-md hover:scale-105 active:scale-95"
          >
            <span>Check Availability in App</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
