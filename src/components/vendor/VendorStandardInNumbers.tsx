"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Clock, ShieldCheck, Navigation, CreditCard, CheckCircle2 } from "lucide-react";

export default function VendorStandardInNumbers() {
  const steps = [
    {
      stepNumber: "01",
      stepLabel: "STEP 01",
      metric: "15 MINS",
      title: "Quick Vendor Onboarding",
      desc: "Register your laundry facility and store staff in under 15 minutes with zero setup fees.",
      icon: Clock,
      theme: {
        primary: "#00875A",
        stop1: "#00875A",
        stop2: "#10B981",
        metricColor: "text-[#00875A]",
        pill: "bg-emerald-50 text-[#00875A] border-emerald-200",
        glow: "#00875A",
        ambient: "bg-emerald-100/30",
        dotActive: "bg-[#00875A]",
      },
    },
    {
      stepNumber: "02",
      stepLabel: "STEP 02",
      metric: "100% LIVE",
      title: "Real-Time GPS Tracking",
      desc: "Doorstep pickup and delivery logistics tracked automatically from customer to your facility.",
      icon: Navigation,
      theme: {
        primary: "#0284C7",
        stop1: "#0284C7",
        stop2: "#38BDF8",
        metricColor: "text-[#0284C7]",
        pill: "bg-sky-50 text-[#0284C7] border-sky-200",
        glow: "#0284C7",
        ambient: "bg-sky-100/30",
        dotActive: "bg-[#0284C7]",
      },
    },
    {
      stepNumber: "03",
      stepLabel: "STEP 03",
      metric: "48-POINT",
      title: "Standardised Quality SOPs",
      desc: "Digital barcode tagging, Hydrocarbon solvent care, and multi-point inspection on every order.",
      icon: ShieldCheck,
      theme: {
        primary: "#7C3AED",
        stop1: "#7C3AED",
        stop2: "#A78BFA",
        metricColor: "text-[#7C3AED]",
        pill: "bg-purple-50 text-[#7C3AED] border-purple-200",
        glow: "#7C3AED",
        ambient: "bg-purple-100/30",
        dotActive: "bg-[#7C3AED]",
      },
    },
    {
      stepNumber: "04",
      stepLabel: "STEP 04",
      metric: "7-DAY",
      title: "Guaranteed Bank Payouts",
      desc: "Weekly automated settlements directly into your bank account with zero hidden commissions.",
      icon: CreditCard,
      theme: {
        primary: "#EA580C",
        stop1: "#EA580C",
        stop2: "#FB923C",
        metricColor: "text-[#EA580C]",
        pill: "bg-orange-50 text-[#EA580C] border-orange-200",
        glow: "#EA580C",
        ambient: "bg-orange-100/30",
        dotActive: "bg-[#EA580C]",
      },
    },
  ];

  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll-linked step transitions for desktop sticky gauge
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || window.innerWidth < 640) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollableDistance = rect.height - windowHeight;

      if (totalScrollableDistance <= 0) return;

      if (rect.top <= 0 && rect.bottom >= windowHeight) {
        const scrolled = -rect.top;
        const progress = Math.min(Math.max(scrolled / totalScrollableDistance, 0), 0.999);
        const currentStep = Math.floor(progress * steps.length);
        setActiveStep(currentStep);
      } else if (rect.top > 0) {
        setActiveStep(0);
      } else if (rect.bottom < windowHeight) {
        setActiveStep(steps.length - 1);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [steps.length]);

  // Semi-circle SVG arc calculations
  const radius = 300;
  const arcLength = Math.PI * radius;
  const segmentLength = arcLength / 4;
  const strokeOffset = -activeStep * segmentLength;
  const currentTheme = steps[activeStep].theme;

  return (
    <section className="bg-white py-12 sm:py-0 overflow-hidden">
      
      {/* ===================================================================== */}
      {/* MOBILE VIEW (< 640px): Clean Horizontal Swipe Rail */}
      {/* ===================================================================== */}
      <div className="block sm:hidden px-4 py-8">
        <div className="text-center mb-8">
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#00875A] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 uppercase">
            CLECLO VENDOR STANDARD
          </span>
          <h2 className="font-display text-2xl font-extrabold text-[#022B22] uppercase tracking-tight leading-tight mt-3">
            IN NUMBERS
          </h2>
          <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto">
            What partnering with Cleclo actually means for your laundry business
          </p>
        </div>

        {/* Mobile Horizontal Card Rail */}
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none -mx-4 px-4 pb-4 mb-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStep === idx;

            return (
              <div
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`w-[82vw] max-w-[290px] shrink-0 snap-center p-6 rounded-[28px] border transition-all duration-300 flex flex-col justify-between min-h-[280px] select-none ${
                  isActive
                    ? "bg-white border-[#00875A] shadow-[0_12px_32px_rgba(0,135,90,0.15)] -translate-y-1"
                    : "bg-slate-50/80 border-slate-200/80"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[10px] font-mono font-black uppercase px-3 py-1 rounded-full border ${step.theme.pill}`}>
                      {step.stepLabel}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#022B22] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div className={`text-3xl font-black font-display tracking-tight mb-2 ${step.theme.metricColor}`}>
                    {step.metric}
                  </div>

                  <h3 className="text-lg font-extrabold text-[#022B22] font-display mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-[#00875A] mt-4">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Cleclo Verified Standard</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Dot Navigation */}
        <div className="flex items-center justify-center gap-2">
          {steps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeStep === idx
                  ? `w-6 ${step.theme.dotActive}`
                  : "w-2 bg-slate-200"
              }`}
              aria-label={`Jump to metric ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* DESKTOP VIEW (>= 640px): 240vh Sticky Radial Gauge Arc */}
      {/* ===================================================================== */}
      <div ref={containerRef} className="hidden sm:block relative h-[240vh] bg-white">
        
        <div className="sticky top-0 h-screen flex flex-col justify-center bg-[#FFFFFF] overflow-hidden">
          
          {/* Dynamic ambient background glow */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] ${currentTheme.ambient} rounded-full blur-[150px] pointer-events-none transition-colors duration-700 -z-10`}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
            
            {/* Section Header */}
            <div className="text-center max-w-2xl mx-auto mb-14 px-2">
              <h2 className="font-display text-4xl lg:text-[2.75rem] font-extrabold tracking-tight text-[#022B22] uppercase leading-[1.1]">
                THE CLECLO VENDOR STANDARD, <br />
                <span
                  className="transition-colors duration-500"
                  style={{ color: currentTheme.primary }}
                >
                  IN NUMBERS
                </span>
              </h2>
              <p className="text-lg text-slate-500 font-normal leading-relaxed mt-2 max-w-2xl mx-auto">
                What partnering with Cleclo actually means for your laundry business
              </p>
            </div>

            {/* Semi-Circular Radial Arc Stepper Component */}
            <div className="relative max-w-3xl mx-auto flex flex-col items-center select-none w-full">
              
              <div className="relative w-full max-w-[700px] aspect-[2/1.05] flex items-center justify-center overflow-visible scale-100 origin-center transition-transform duration-300">
                <svg
                  viewBox="0 0 700 370"
                  className="w-full h-full overflow-visible drop-shadow-sm"
                >
                  <defs>
                    <filter id="vendorArcGlow" x="-30%" y="-30%" width="160%" height="160%">
                      <feDropShadow
                        dx="0"
                        dy="0"
                        stdDeviation="6"
                        floodColor={currentTheme.glow}
                        floodOpacity="0.65"
                      />
                    </filter>
                    <linearGradient id="vendorArcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={currentTheme.stop1} />
                      <stop offset="100%" stopColor={currentTheme.stop2} />
                    </linearGradient>
                  </defs>

                  {/* Background Full Semi-Circle Dashed Track */}
                  <path
                    d="M 50 350 A 300 300 0 0 1 650 350"
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="2.5"
                    strokeDasharray="6, 8"
                    strokeLinecap="round"
                  />

                  {/* Active Glowing Arc Segment */}
                  <path
                    d="M 50 350 A 300 300 0 0 1 650 350"
                    fill="none"
                    stroke="url(#vendorArcGradient)"
                    strokeWidth="6.5"
                    strokeDasharray={`${segmentLength} ${arcLength}`}
                    strokeDashoffset={strokeOffset}
                    strokeLinecap="round"
                    filter="url(#vendorArcGlow)"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>

                {/* Step Pill Floating Above Arc Apex */}
                <div className="absolute top-[-2px] left-1/2 -translate-x-1/2 z-20">
                  <span
                    className={`inline-flex items-center gap-1.5 px-5 py-1.5 rounded-full border-2 ${currentTheme.pill} text-sm font-black tracking-widest uppercase font-mono transition-all duration-500 shadow-lg bg-white backdrop-blur-sm`}
                  >
                    {steps[activeStep].stepLabel}
                  </span>
                </div>

                {/* Center Content Enclosed Inside Middle/Bottom of Semicircle Arc */}
                <div className="absolute top-[54%] lg:top-[56%] left-1/2 -translate-x-1/2 text-center flex flex-col items-center w-full max-w-md px-2 z-10">
                  
                  {/* Metric Display */}
                  <div
                    className={`text-5xl lg:text-[4.25rem] font-black tracking-tight ${currentTheme.metricColor} font-display mb-3 drop-shadow-sm transition-all duration-500 scale-100 leading-none`}
                  >
                    {steps[activeStep].metric}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-black text-[#022B22] tracking-tight font-display mb-2 leading-tight">
                    {steps[activeStep].title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-500 leading-relaxed font-normal max-w-sm">
                    {steps[activeStep].desc}
                  </p>

                </div>
              </div>

              {/* Step Navigation Controls & Dots */}
              <div className="flex items-center gap-5 mt-7 relative z-20">
                <button
                  onClick={() => setActiveStep((prev) => (prev - 1 + steps.length) % steps.length)}
                  className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-[#022B22] hover:border-slate-400 flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow active:scale-95 shrink-0"
                  aria-label="Previous step"
                >
                  <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                </button>

                <div className="flex items-center gap-2.5">
                  {steps.map((step, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveStep(idx)}
                      className={`h-2.5 rounded-full transition-all duration-400 ${
                        activeStep === idx
                          ? `w-9 ${step.theme.dotActive} shadow-md`
                          : "w-2.5 bg-slate-200 hover:bg-slate-300"
                      }`}
                      aria-label={`Jump to step ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
                  className="w-10 h-10 rounded-full bg-white border border-slate-200 text-[#022B22] hover:border-slate-400 flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow active:scale-95 shrink-0"
                  aria-label="Next step"
                >
                  <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
