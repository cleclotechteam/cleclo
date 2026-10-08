"use client";

import React from "react";
import Link from "next/link";
import { Store, Building2, Factory, Network, ArrowRight, CheckCircle2 } from "lucide-react";

export default function VendorWhoItsFor() {
  const signupUrl = "https://cleclo-vendor-dash-psi.vercel.app/signup";

  const personas = [
    {
      number: "01",
      icon: Store,
      title: "Independent Laundry Owners",
      subtitle: "Digitize local store operations & attract high-value app customers.",
      description:
        "Transform your single neighborhood outlet into a tech-enabled dry cleaning hub. Receive automated doorstep pickup orders and streamline garment tagging without heavy IT costs.",
      badge: "Single Store Growth",
      features: [
        "Automated doorstep order dispatch",
        "Transparent fixed customer rate card",
        "Instant digital billing & Tagging",
      ],
    },
    {
      number: "02",
      icon: Building2,
      title: "Multi Outlet Operators",
      subtitle: "Manage inventory, logistics & staff across multiple stores in one place.",
      description:
        "Gain centralized control over all your retail outlets. Track capacity utilization, transfer orders smoothly between processing plants, and monitor revenue per store.",
      badge: "Multi-Store Dashboard",
      features: [
        "Centralized multi-outlet control",
        "Inter-store transfer management",
        "Real-time store performance analytics",
      ],
    },
    {
      number: "03",
      icon: Factory,
      title: "Backend Vendor Partners",
      subtitle: "Fill facility capacity with guaranteed high-volume, recurring orders.",
      description:
        "Partner your commercial washing & solvent cleaning facility with Cleclo. Receive consistent daily batch orders while adhering to standardized eco-friendly SOPs.",
      badge: "Commercial Facility",
      features: [
        "Guaranteed daily order volume",
        "Standardized Eco SOP workflows",
        "Weekly automated bank payouts",
      ],
    },
    {
      number: "04",
      icon: Network,
      title: "Franchise Owners",
      subtitle: "Scale territory coverage with plug-and-play digital operations.",
      description:
        "Expand your laundry franchise footprint with Cleclo's end-to-end operational playbook, doorstep logistics network, and quality assurance framework.",
      badge: "Territory Expansion",
      features: [
        "Plug-and-play operational stack",
        "Turnkey delivery fleet support",
        "48-Point quality verification SOPs",
      ],
    },
  ];

  return (
    <section id="who-its-for" className="py-20 sm:py-28 bg-[#022B22] text-white relative overflow-hidden">
      
      {/* Subtle Ambient Radial Lighting */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#00B074]/15 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-[#D4F63D]/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Tactile background grid matrix */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1.2px, transparent 1.2px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#D4F63D] animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-widest text-[#D4F63D] uppercase">
              WHO IT&apos;S FOR
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.12] font-display text-white mb-6">
            Built for Every Scale of <br />
            <span className="text-[#D4F63D]">Laundry Business in India.</span>
          </h2>

          <p className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed">
            Whether you operate a single retail counter, a multi-outlet network, or a high-capacity commercial plant, Cleclo provides the software, logistics, and demand to accelerate your revenue.
          </p>
        </div>

        {/* 4 Persona Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-16">
          {personas.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.number}
                className="group relative p-8 sm:p-9 rounded-[32px] bg-white/5 border border-white/10 hover:border-[#D4F63D]/40 backdrop-blur-md transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5"
              >
                <div>
                  {/* Top Icon & Number Row */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-[#00B074]/20 border border-[#00B074]/30 text-[#D4F63D] flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      <Icon className="w-7 h-7 stroke-[2.2]" />
                    </div>

                    <span className="text-xs font-mono font-bold tracking-widest text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                      {item.number}
                    </span>
                  </div>

                  {/* Badge */}
                  <span className="inline-block text-[11px] font-mono font-bold tracking-widest text-[#D4F63D] uppercase px-3 py-1 rounded-md bg-white/10 border border-white/15 mb-3">
                    {item.badge}
                  </span>

                  {/* Title */}
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2 group-hover:text-[#D4F63D] transition-colors font-display">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm font-semibold text-emerald-400 mb-4">
                    {item.subtitle}
                  </p>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal mb-6">
                    {item.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-2.5 pt-4 border-t border-white/10">
                    {item.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2.5 text-xs text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-[#D4F63D] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Link */}
                <div className="mt-8 pt-5 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">Cleclo Partner Ready</span>
                  <Link
                    href={signupUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D4F63D] hover:underline"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Callout Banner */}
        <div className="p-8 sm:p-10 rounded-[32px] bg-gradient-to-r from-white/10 via-white/5 to-white/10 border border-white/15 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#D4F63D] text-[#022B22] flex items-center justify-center shrink-0 shadow-md font-extrabold text-xl">
              ✓
            </div>
            <div>
              <p className="font-extrabold text-lg sm:text-xl text-white">
                Transform your laundry business into a scalable profit machine today.
              </p>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Zero upfront software fees. Onboard your shop in under 15 minutes.
              </p>
            </div>
          </div>

          <Link
            href={signupUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2.5 bg-[#D4F63D] hover:bg-[#c5ea2c] text-[#022B22] font-extrabold text-xs sm:text-sm px-8 py-4 rounded-full transition-all duration-300 shadow-[0_4px_16px_rgba(212,246,61,0.35)] hover:shadow-[0_8px_24px_rgba(212,246,61,0.5)] hover:scale-105 active:scale-95"
          >
            <span>See How Cleclo Works</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
