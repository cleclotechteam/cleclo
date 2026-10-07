"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import {
  Tag,
  ShieldCheck,
  Navigation,
  Clock,
  Shirt,
  ArrowRight,
  CheckCircle2,
  Check,
} from "lucide-react";

export default function TrustAndSafety() {
  const downloadUrl = "https://cleclo-vendor-dash-psi.vercel.app/#download";
  const containerRef = useRef<HTMLDivElement>(null);
  const mobileTabsRef = useRef<HTMLDivElement>(null);
  const mobileTabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [activeItem, setActiveItem] = useState<number>(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Automatically update active item as user scrolls down the section
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (latest < 0.2) {
        setActiveItem(0);
      } else if (latest < 0.4) {
        setActiveItem(1);
      } else if (latest < 0.6) {
        setActiveItem(2);
      } else if (latest < 0.8) {
        setActiveItem(3);
      } else {
        setActiveItem(4);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Auto-scroll mobile pill tabs to active item
  useEffect(() => {
    const currentTabEl = mobileTabRefs.current[activeItem];
    if (currentTabEl && mobileTabsRef.current) {
      currentTabEl.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeItem]);

  const handleStepClick = (index: number) => {
    setActiveItem(index);
    if (containerRef.current) {
      const containerTop = containerRef.current.offsetTop;
      const containerHeight = containerRef.current.offsetHeight;
      const targetScroll = containerTop + (index / 5) * containerHeight;
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
    }
  };

  const items = [
    {
      number: "01",
      tag: "01 — PRICING",
      title: "One price. Every time.",
      description:
        "A clear, standardised price list — no shop-to-shop variation for the same service.",
      icon: Tag,
      iconColor: "#00B074",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
    },
    {
      number: "02",
      tag: "02 — PARTNERS",
      title: "Verified to meet the standard.",
      description:
        "Every partner is assessed, onboarded and trained before becoming part of the Cleclo network.",
      icon: ShieldCheck,
      iconColor: "#0284C7",
      bgColor: "bg-sky-50",
      borderColor: "border-sky-200",
    },
    {
      number: "03",
      tag: "03 — CUSTODY",
      title: "Tracked at every handoff.",
      description:
        "Every garment is tagged at pickup and tracked through each stage until it is safely back with you.",
      icon: Navigation,
      iconColor: "#EAB308",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    },
    {
      number: "04",
      tag: "04 — DELIVERY",
      title: "A delivery promise, not an estimate.",
      description:
        "A defined 72-hour turnaround, with Express options when you need your order sooner.",
      icon: Clock,
      color: "#8B5CF6",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      number: "05",
      tag: "05 — GARMENT CARE",
      title: "The right process for every fabric.",
      description:
        "Defined care protocols ensure your garments receive the appropriate treatment, regardless of which partner handles them.",
      icon: Shirt,
      iconColor: "#00B074",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
    },
  ];

  const current = items[activeItem];

  return (
    <section
      ref={containerRef}
      id="trust-and-safety"
      className="relative bg-[#FBFDFB] border-t border-[#0A261E]/5 min-h-[260vh] lg:min-h-[300vh]"
    >
      {/* Sticky Container for Sticky Scroll Experience */}
      <div className="sticky top-6 lg:top-12 h-[calc(100vh-2rem)] sm:h-[calc(100vh-4rem)] flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 relative z-10">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#00B074]/5 rounded-full blur-3xl pointer-events-none -z-10" />
        {/* ========================================================================= */}
        {/* DESKTOP VIEW (Hidden on Mobile) */}
        {/* ========================================================================= */}
        <div className="hidden lg:grid grid-cols-12 gap-16 items-center">
          
          {/* LEFT: Light, Airy Typography */}
          <div className="col-span-6 flex flex-col justify-center">
            
            {/* Eyebrow badge matching banner style */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50/90 border border-emerald-200/70 mb-5 max-w-full">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse shrink-0"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 leading-snug">
                TRUST &amp; SAFETY
              </span>
            </div>

            {/* Main Headline (Exact Copy) */}
            <h2 className="font-display text-4xl lg:text-[2.65rem] font-extrabold text-[#022B22] tracking-tight leading-[1.15] mb-5">
              Standardisation isn&apos;t a tagline. <br />
              <span className="text-[#00875A]">It&apos;s the process.</span>
            </h2>

            {/* Subtitle Paragraph (Exact Copy) */}
            <p className="text-lg text-[#0A2B24]/70 leading-relaxed font-normal max-w-xl mb-8">
              This is what we mean, in practice, when we say every Cleclo order follows the same standard.
            </p>

            {/* Active Feature Spotlight Box (Clean Light Theme) */}
            <div className="p-6 rounded-[24px] bg-white border border-[#0A261E]/10 shadow-[0_8px_30px_rgba(0,0,0,0.03)] mb-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeItem}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#00875A] px-2.5 py-1 rounded-md bg-[#F4F9F6] border border-[#00B074]/20">
                      {current.tag}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      Step 0{activeItem + 1} of 05
                    </span>
                  </div>

                  <h3 className="text-2xl font-extrabold text-[#0A2B24]">
                    {current.title}
                  </h3>

                  <p className="text-base text-[#0A2B24]/75 leading-relaxed font-normal">
                    {current.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* CTA Button */}
            <div>
              <Link
                href={downloadUrl}
                className="inline-flex items-center gap-3 bg-[#D4F63D] hover:bg-[#c5ea2c] text-[#0A2B24] font-extrabold text-base px-8 py-3.5 rounded-full transition-all duration-200 shadow-[0_4px_14px_rgba(212,246,61,0.35)] hover:shadow-[0_6px_20px_rgba(212,246,61,0.5)] active:scale-95"
              >
                <span>Download the Cleclo App</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

          {/* RIGHT: Staggered Light Pill Stream (Clean Off-White & Soft Green Highlight) */}
          <div className="col-span-6 relative flex flex-col space-y-3.5 py-2">
            {items.map((item, idx) => {
              const Icon = item.icon;
              const isActive = activeItem === idx;

              // Arc curvature offsets matching Pine Labs UI
              const curveOffsets = [
                "translate-x-10",
                "translate-x-3",
                "translate-x-0",
                "translate-x-3",
                "translate-x-10",
              ];

              return (
                <div
                  key={item.number}
                  onMouseEnter={() => setActiveItem(idx)}
                  onClick={() => handleStepClick(idx)}
                  className={`transition-all duration-300 transform ${curveOffsets[idx]}`}
                >
                  <div
                    className={`group cursor-pointer rounded-full p-4 px-6 flex items-center justify-between transition-all duration-200 border select-none ${
                      isActive
                        ? "bg-[#E6F4EE] border-[#00B074] shadow-[0_8px_24px_rgba(0,176,116,0.12)] scale-[1.02]"
                        : "bg-white text-[#0A2B24] border-slate-200/80 hover:border-[#00B074]/40 hover:bg-[#F8FAFC]"
                    }`}
                  >
                    {/* Left Circle Icon + Label */}
                    <div className="flex items-center gap-4 overflow-hidden">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                          isActive
                            ? "bg-[#00B074] text-white shadow-sm scale-110"
                            : "bg-[#F4F6F4] text-[#00875A] group-hover:bg-[#00B074] group-hover:text-white"
                        }`}
                      >
                        <Icon className="w-5 h-5 stroke-[2.2]" />
                      </div>

                      <div className="flex flex-col text-left truncate">
                        <span
                          className={`text-[10px] font-mono font-bold tracking-wider uppercase transition-colors ${
                            isActive ? "text-[#00875A]" : "text-slate-400"
                          }`}
                        >
                          {item.tag}
                        </span>
                        <h4
                          className={`text-base font-extrabold truncate transition-colors ${
                            isActive ? "text-[#0A2B24]" : "text-[#0A2B24]/85"
                          }`}
                        >
                          {item.title}
                        </h4>
                      </div>
                    </div>

                    {/* Right Active Indicator Pill */}
                    <div className="shrink-0 ml-3">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                          isActive
                            ? "bg-[#00B074] text-white"
                            : "bg-slate-100 text-slate-400 group-hover:bg-[#00B074]/20 group-hover:text-[#00875A]"
                        }`}
                      >
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* ========================================================================= */}
        {/* MOBILE VIEW (Dedicated Responsive Flow) */}
        {/* ========================================================================= */}
        <div className="flex lg:hidden flex-col space-y-6 w-full">
          {/* Header */}
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50/90 border border-emerald-200/70 mb-4 max-w-full">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse shrink-0"></span>
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-900 leading-snug">
                TRUST &amp; SAFETY
              </span>
            </div>
            <h2 className="font-display text-3xl font-extrabold text-[#022B22] tracking-tight leading-[1.15] mb-3">
              Standardisation isn&apos;t a tagline. <br />
              <span className="text-[#00875A]">It&apos;s the process.</span>
            </h2>
            <p className="text-sm text-[#0A2B24]/75 leading-relaxed font-normal">
              This is what we mean, in practice, when we say every Cleclo order follows the same standard.
            </p>
          </div>

          {/* Mobile 5-Step Selector Pill Bar (With Smooth Auto-Scroll) */}
          <div
            ref={mobileTabsRef}
            className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-100 -mx-4 px-4"
          >
            {items.map((item, idx) => {
              const isActive = activeItem === idx;
              const Icon = item.icon;
              return (
                <button
                  key={item.number}
                  ref={(el) => { mobileTabRefs.current[idx] = el; }}
                  onClick={() => handleStepClick(idx)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold transition-all duration-200 shrink-0 border select-none ${
                    isActive
                      ? "bg-[#00875A] text-white border-[#00875A] shadow-sm"
                      : "bg-white text-slate-700 border-slate-200/80 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#D4F63D]" : "text-[#00875A]"}`} />
                  <span>{item.number} — {item.tag.split(" — ")[1]}</span>
                </button>
              );
            })}
          </div>

          {/* Spotlight Detail Card for Active Step */}
          <div className="p-5 sm:p-6 rounded-[24px] bg-white border border-[#0A261E]/10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-3.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-[#00875A] px-2.5 py-1 rounded-md bg-[#F4F9F6] border border-[#00B074]/20">
                    {current.tag}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    Step 0{activeItem + 1} of 05
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-extrabold text-[#022B22]">
                  {current.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#0A2B24]/75 leading-relaxed font-normal">
                  {current.description}
                </p>

                {/* Navigation Controls inside Card for Mobile */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <button
                    onClick={() => setActiveItem((prev) => (prev - 1 + items.length) % items.length)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-[#022B22] p-1"
                  >
                    ← Previous
                  </button>

                  <div className="flex items-center gap-1.5">
                    {items.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveItem(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          activeItem === i ? "w-5 bg-[#00875A]" : "w-1.5 bg-slate-200"
                        }`}
                        aria-label={`Go to step ${i + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => setActiveItem((prev) => (prev + 1) % items.length)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#00875A] hover:text-[#022B22] p-1"
                  >
                    Next →
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* CTA Button */}
          <div className="pt-2">
            <Link
              href={downloadUrl}
              className="w-full inline-flex items-center justify-center gap-3 bg-[#D4F63D] hover:bg-[#c5ea2c] text-[#022B22] font-extrabold text-sm px-6 py-3.5 rounded-full transition-all duration-200 shadow-[0_4px_14px_rgba(212,246,61,0.35)]"
            >
              <span>Download the Cleclo App</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
