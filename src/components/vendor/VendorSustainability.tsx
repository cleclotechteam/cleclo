"use client";

import React from "react";
import Link from "next/link";
import { RefreshCw, Leaf, Zap, ArrowRight, Recycle } from "lucide-react";

// Vendor sustainability uses a light split layout with stacked pillar rows,
// distinct from the customer site's dark scroll-illuminated version.
export default function VendorSustainability() {
  const signupUrl = "#signup";

  const pillars = [
    {
      number: "01",
      category: "Hydrocarbon Solvent Care",
      title: "Solvent Recovery & Eco-SOPs",
      description:
        "Our closed-loop Hydrocarbon recovery systems help vendor facilities minimize chemical discharge, reduce waste, and extend fabric life.",
      icon: RefreshCw,
      badge: "Closed-Loop Solvent Care",
    },
    {
      number: "02",
      category: "Better Packaging",
      title: "Zero Single-Use Plastic",
      description:
        "We supply vendor partners with biodegradable garment covers and reusable pickup bags to protect clothes responsibly.",
      icon: Leaf,
      badge: "Compostable Covers",
    },
    {
      number: "03",
      category: "Cleaner Logistics",
      title: "Zero-Emission EV Logistics",
      description:
        "Electric delivery vehicles streamline doorstep pickup and return logistics between customers and certified vendor hubs.",
      icon: Zap,
      badge: "EV Delivery Fleet",
    },
  ];

  return (
    <section id="sustainability" className="py-16 sm:py-24 lg:py-28 bg-[#F6FAEC] relative overflow-hidden">
      {/* Soft lime wash */}
      <div className="absolute -top-32 -right-32 w-[420px] h-[420px] bg-[#D4F63D]/25 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

          {/* Left: heading + impact panel */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#00875A] text-white text-[11px] font-mono font-bold tracking-widest uppercase mb-5">
              <Recycle className="w-3.5 h-3.5" />
              Eco Vendor Standards
            </span>

            <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-[#022B22] leading-[1.1] mb-5">
              Better for your facility.{" "}
              <span
                className="box-decoration-clone"
                style={{ backgroundImage: "linear-gradient(transparent 62%, #D4F63D 62%, #D4F63D 92%, transparent 92%)" }}
              >
                Better for the environment.
              </span>
            </h2>

            <p className="text-sm sm:text-lg text-slate-600 leading-relaxed mb-8">
              Cleclo empowers vendor partners with advanced solvent recovery processes, zero single-use plastic
              compostable packaging, and EV delivery fleets to build a more thoughtful standard for fabric care
              across India.
            </p>

            <Link
              href={signupUrl}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#00875A] hover:bg-[#006B47] text-white font-extrabold text-xs sm:text-sm px-7 py-4 rounded-xl transition-all duration-300 shadow-md group"
            >
              <span>See How Cleclo Works</span>
              <ArrowRight className="w-4 h-4 text-[#D4F63D] transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Right: stacked pillar rows */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl sm:rounded-3xl bg-white border border-[#022B22]/10 shadow-[0_10px_40px_rgba(2,43,34,0.06)] divide-y divide-slate-100 overflow-hidden">
              {pillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={pillar.number}
                    className="group flex gap-4 sm:gap-6 p-5 sm:p-8 hover:bg-[#FBFDF5] transition-colors"
                  >
                    <div className="flex flex-col items-center gap-2 shrink-0">
                      <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl bg-[#D4F63D] text-[#022B22] flex items-center justify-center transition-transform group-hover:-rotate-6">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
                      </div>
                      <span className="text-[11px] font-mono font-bold text-slate-400">{pillar.number}</span>
                    </div>

                    <div className="min-w-0">
                      <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-[#00875A] uppercase">
                        {pillar.category}
                      </span>
                      <h3 className="font-display text-lg sm:text-2xl font-extrabold text-[#022B22] tracking-tight mt-1 mb-2">
                        {pillar.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                        {pillar.description}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#022B22] bg-[#F6FAEC] border border-[#D4F63D] px-2.5 py-1 rounded-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00875A]" />
                        {pillar.badge}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="mt-5 text-xs sm:text-sm text-slate-500 flex items-center gap-2">
              <Leaf className="w-4 h-4 text-[#00875A] shrink-0" />
              Hydrocarbon recovery, compostable covers &amp; zero single-use plastic, supplied to every partner.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
