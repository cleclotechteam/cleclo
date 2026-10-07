"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  Minus,
  ShieldCheck,
  Clock,
  Tag,
} from "lucide-react";

export default function VendorWhyCleclo() {
  const signupUrl = "#signup";
  const sectionRef = useRef<HTMLElement>(null);

  const [showAutoImages, setShowAutoImages] = useState<boolean>(false);
  const [hoveredCard, setHoveredCard] = useState<"traditional" | "cleclo" | null>(null);
  const [hasScrolledIntoView, setHasScrolledIntoView] = useState<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasScrolledIntoView) {
          setHasScrolledIntoView(true);
          setShowAutoImages(true);
          const timer = setTimeout(() => {
            setShowAutoImages(false);
          }, 2000);
          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasScrolledIntoView]);

  const comparisonItems = [
    {
      category: "ORDER INTAKE",
      without: "Paper slips, phone calls & manual customer tracking",
      withCleclo: "Automated app order dispatch to your vendor dashboard",
    },
    {
      category: "PRICING & REVENUE",
      without: "Uncertain pricing, bargaining & delayed payments",
      withCleclo: "Fixed rate card on app + guaranteed weekly bank payouts",
    },
    {
      category: "DELIVERY LOGISTICS",
      without: "Store owner manages individual rider pickups",
      withCleclo: "Live GPS doorstep pickup & EV fleet return",
    },
    {
      category: "OPERATIONAL SOPS",
      without: "Random manual wash cycles & risk of garment mix-ups",
      withCleclo: "Strict 48-point quality inspection & barcode tagging",
    },
    {
      category: "STORE GROWTH",
      without: "Limited strictly to immediate neighborhood footfall",
      withCleclo: "Citywide app customer reach across Tier 1 & Tier 2 hubs",
    },
  ];

  const isTraditionalImageActive = showAutoImages || hoveredCard === "traditional";
  const isClecloImageActive = showAutoImages || hoveredCard === "cleclo";

  return (
    <section
      ref={sectionRef}
      className="py-16 sm:py-20 bg-white relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Responsive 3-Column Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-stretch">
          
          {/* COLUMN 1: Left Narrative & Callout */}
          <div className="lg:col-span-4 flex flex-col justify-between pr-0 lg:pr-2">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50/90 border border-emerald-200/70 mb-4 max-w-full">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse shrink-0"></span>
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-900 leading-snug">
                  WHY CLECLO VENDOR
                </span>
              </div>

              <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold tracking-tight text-[#022B22] leading-[1.1] mb-5">
                Every dry cleaner runs on its own rules. <br className="hidden xs:inline sm:inline" />
                <span className="text-[#00875A]">We replaced them with a standard.</span>
              </h2>

              <p className="text-sm text-slate-500 font-normal leading-relaxed mb-8 max-w-md">
                One standard platform, upfront rate card payouts, and live GPS order dispatch from doorstep to certified fabric care facilities. Hover over either card to inspect visual standards.
              </p>

              <div className="flex flex-wrap items-center gap-3 mb-8">
                <Link
                  href={signupUrl}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#00875A] text-white hover:bg-[#006B47] text-xs sm:text-sm font-semibold transition-all duration-300 shadow-[0_4px_16px_rgba(17,35,27,0.2)] hover:-translate-y-0.5"
                >
                  <span>See How Cleclo Works</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#11231B]">
                <Tag className="w-4 h-4 text-[#00875A]" />
                <span>Zero setup fee · Transparent rate card</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#11231B]">
                <Clock className="w-4 h-4 text-[#00875A]" />
                <span>Instant order dispatch &amp; 7-day bank payouts</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#11231B]">
                <ShieldCheck className="w-4 h-4 text-[#00875A]" />
                <span>48-point quality inspected partner network</span>
              </div>
            </div>
          </div>

          {/* COLUMN 2: Middle Card - The Unstandardized Store */}
          <div
            onMouseEnter={() => setHoveredCard("traditional")}
            onMouseLeave={() => setHoveredCard(null)}
            className="lg:col-span-4 relative p-7 sm:p-8 rounded-[32px] bg-white border border-slate-200/90 flex flex-col justify-between shadow-[0_4px_25px_rgba(0,0,0,0.03)] min-h-[500px] overflow-hidden transition-all duration-500 group cursor-pointer"
          >
            {/* IMAGE REVEAL OVERLAY */}
            <div
              className={`absolute inset-0 z-20 transition-opacity duration-700 pointer-events-none ${
                isTraditionalImageActive ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src="/traditional-way-v2.jpg"
                alt="Traditional Unorganized Dry Cleaning Store"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30" />
              
              <div className="relative z-10 h-full p-7 flex flex-col justify-between text-white">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest font-mono bg-rose-950/80 text-rose-300 border border-rose-500/40 px-3 py-1 rounded-full backdrop-blur-md">
                    01. UNSTANDARDISED
                  </span>
                  <span className="text-xs font-medium text-white/80 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md">
                    Traditional Shop
                  </span>
                </div>

                <div>
                  <h4 className="text-xl font-bold font-display text-white mb-2">
                    Unorganized Care &amp; Paper Receipts
                  </h4>
                  <p className="text-xs text-slate-200 leading-relaxed font-normal">
                    Manual paper slips, variable chemicals, and uncertain delivery schedules.
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold text-rose-300 bg-rose-950/60 border border-rose-800/60 px-3 py-1 rounded-full">
                    <span>Hover off to read comparison</span>
                  </div>
                </div>
              </div>
            </div>

            {/* TEXT CONTENT LAYER */}
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 font-mono px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200/80">
                    01. UNSTANDARDISED STORE
                  </span>
                  <span className="text-xs font-semibold text-slate-400">Without Cleclo</span>
                </div>

                <h3 className="text-2xl font-extrabold text-[#022B22] tracking-tight leading-snug font-display mb-1">
                  The Traditional Store
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  Paper receipts, zero tracking, variable footfall.
                </p>

                <div className="space-y-4">
                  {comparisonItems.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-rose-50 text-rose-600 border border-rose-200/60 flex items-center justify-center shrink-0 mt-0.5 text-xs font-black">
                        <Minus className="w-3 h-3 stroke-[3]" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black tracking-wider uppercase text-slate-400 block mb-0.5">
                          {item.category}
                        </span>
                        <p className="text-xs sm:text-[13px] text-slate-700 leading-snug">
                          {item.without}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-5 border-t border-slate-100 flex items-center justify-between mt-6">
                <span className="text-xs font-semibold text-slate-400">Unpredictable revenue</span>
                <span className="text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200/80">
                  Variable Quality
                </span>
              </div>
            </div>
          </div>

          {/* COLUMN 3: Right Card - The Cleclo Certified Partner Facility */}
          <div
            onMouseEnter={() => setHoveredCard("cleclo")}
            onMouseLeave={() => setHoveredCard(null)}
            className="lg:col-span-4 relative p-7 sm:p-8 rounded-[32px] bg-gradient-to-b from-[#EBF7F1] to-[#E2F3EA] border border-emerald-200/90 flex flex-col justify-between shadow-[0_12px_32px_rgba(0,135,90,0.06)] min-h-[500px] overflow-hidden transition-all duration-500 group cursor-pointer"
          >
            {/* IMAGE REVEAL OVERLAY WITH CLECLO LOGO */}
            <div
              className={`absolute inset-0 z-20 transition-opacity duration-700 pointer-events-none ${
                isClecloImageActive ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src="/cleclo-standard-v2.jpg"
                alt="Cleclo Certified Vendor Facility"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/30" />
              
              <div className="relative z-10 h-full p-7 flex flex-col justify-between text-white">
                <div className="flex items-center justify-between">
                  <div className="bg-white px-3 py-1.5 rounded-xl shadow-md border border-white/80 flex items-center">
                    <Image
                      src="/cleclo-logo.png"
                      alt="Cleclo Logo"
                      width={100}
                      height={25}
                      className="h-5 w-auto object-contain"
                    />
                  </div>

                  <span className="text-[10px] font-extrabold uppercase tracking-widest font-mono bg-[#00875A] text-white px-2.5 py-1 rounded-full shadow-sm">
                    CERTIFIED FACILITY
                  </span>
                </div>

                <div>
                  <h4 className="text-xl font-bold font-display text-white mb-2">
                    Standardised 48-Point Fabric Care
                  </h4>
                  <p className="text-xs text-slate-100 leading-relaxed font-normal">
                    Automated barcode logging, gentle eco-friendly dry cleaning presses, and sealed protective covers.
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#022B22] bg-[#D4F63D] px-3.5 py-1 rounded-full shadow-md">
                    <span>100% Guaranteed Standard ✓</span>
                  </div>
                </div>
              </div>
            </div>

            {/* TEXT CONTENT LAYER */}
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div
                className="absolute inset-0 pointer-events-none opacity-25"
                style={{
                  backgroundImage: "radial-gradient(circle, #00875a 1.5px, transparent 1.5px)",
                  backgroundSize: "16px 16px",
                }}
              />

              <div className="relative z-10">
                <div className="bg-white/90 backdrop-blur-md border border-emerald-200/80 px-3.5 py-2 rounded-2xl flex items-center justify-between shadow-sm mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#00875A] animate-pulse"></div>
                    <span className="text-xs font-bold text-[#022B22] tracking-wide">Live Garment GPS</span>
                  </div>
                  <span className="text-[10px] font-black text-[#00875A] bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-md uppercase">
                    Door to Door
                  </span>
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-black uppercase tracking-widest text-[#00875A] font-mono">
                      02. WITH CLECLO
                    </span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-200">
                      Cleclo Certified
                    </span>
                  </div>

                  <h3 className="text-2xl font-extrabold text-[#022B22] tracking-tight leading-snug font-display flex items-center justify-between">
                    <span>The Cleclo Vendor OS</span>
                  </h3>
                </div>

                <div className="space-y-4">
                  {comparisonItems.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white shadow-sm flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black tracking-wider uppercase text-emerald-800 font-bold block mb-0.5">
                          {item.category}
                        </span>
                        <p className="text-xs sm:text-[13px] text-[#022B22] font-semibold leading-snug">
                          {item.withCleclo}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative z-10 pt-5 border-t border-emerald-200/60 flex items-center justify-between mt-6">
                <span className="text-xs font-semibold text-emerald-900/80">100% Quality Guaranteed</span>
                <span className="inline-flex items-center gap-1.5 bg-[#00875A] text-white text-xs font-extrabold px-3 py-1 rounded-lg shadow-sm">
                  <span>Cleclo Standard ✓</span>
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
