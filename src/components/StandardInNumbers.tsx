"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Clock, ShieldCheck, Navigation, CheckCircle2 } from "lucide-react";

export default function StandardInNumbers() {
  const steps = [
    {
      stepNumber: "01",
      stepLabel: "STEP 01",
      metric: "72HRS",
      title: "Standard turnaround",
      desc: "A defined pickup-to-delivery window, so you know when to expect your order.",
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
      metric: "EVERY ORDER",
      title: "Fully tracked",
      desc: "Every garment is logged and tracked from pickup through cleaning to final delivery.",
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
      metric: "3-STEP",
      title: "Quality verification",
      desc: "Your order is checked at pickup, at the cleaning facility and once again before delivery.",
      icon: CheckCircle2,
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
      metric: "100%",
      title: "Verified partners",
      desc: "Every Cleclo partner is onboarded, trained and evaluated before they start serving customers.",
      icon: ShieldCheck,
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

  // Scroll-linked step transitions: updates active step based on scroll progress
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollableDistance = rect.height - windowHeight;

      if (totalScrollableDistance <= 0) return;

      // When the sticky container is in view
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
    <div ref={containerRef} className="relative h-[240vh]">
      
      {/* Sticky Content Wrapper pinned while user scrolls */}
      <div className="sticky top-0 h-screen flex flex-col justify-center bg-[#FFFFFF] overflow-hidden">
        
        {/* Dynamic ambient background glow that matches active step color */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] ${currentTheme.ambient} rounded-full blur-[150px] pointer-events-none transition-colors duration-700 -z-10`}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          
          {/* ========================================================================= */}
          {/* Section Header */}
          {/* ========================================================================= */}
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-14 px-2">
            <h2 className="font-display text-2xl sm:text-4xl lg:text-[2.75rem] font-extrabold tracking-tight text-[#022B22] uppercase leading-[1.1]">
              THE CLECLO STANDARD, <br />
              <span
                className="transition-colors duration-500"
                style={{ color: currentTheme.primary }}
              >
                IN NUMBERS
              </span>
            </h2>
            <p className="text-xs sm:text-lg text-slate-500 font-normal leading-relaxed mt-2 max-w-xs sm:max-w-2xl mx-auto">
              What &ldquo;standardised&rdquo; actually means for you
            </p>
          </div>

          {/* ========================================================================= */}
          {/* Semi-Circular Radial Arc Stepper Component */}
          {/* ========================================================================= */}
          <div className="relative max-w-3xl mx-auto flex flex-col items-center select-none w-full">
            
            {/* SVG Radial Gauge Arc & Enclosed Center Content (Zoomed & Scaled on Mobile) */}
            <div className="relative w-full max-w-[700px] aspect-[2/1.35] xs:aspect-[2/1.25] sm:aspect-[2/1.05] flex items-center justify-center overflow-visible scale-[1.12] xs:scale-105 sm:scale-100 origin-center transition-transform duration-300">
              <svg
                viewBox="0 0 700 370"
                className="w-full h-full overflow-visible drop-shadow-sm"
              >
                <defs>
                  {/* Dynamic Color Glow Filter */}
                  <filter id="arcStepGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow
                      dx="0"
                      dy="0"
                      stdDeviation="6"
                      floodColor={currentTheme.glow}
                      floodOpacity="0.65"
                    />
                  </filter>
                  <linearGradient id="arcColorGradient" x1="0%" y1="0%" x2="100%" y2="0%">
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
                  stroke="url(#arcColorGradient)"
                  strokeWidth="6.5"
                  strokeDasharray={`${segmentLength} ${arcLength}`}
                  strokeDashoffset={strokeOffset}
                  strokeLinecap="round"
                  filter="url(#arcStepGlow)"
                  className="transition-all duration-700 ease-out"
                />
              </svg>

              {/* Step Pill Floating Above Arc Apex (Adjusted slightly lower and larger for mobile clearance) */}
              <div className="absolute top-[6px] xs:top-[8px] sm:top-[-2px] left-1/2 -translate-x-1/2 z-20">
                <span
                  className={`inline-flex items-center gap-1.5 px-4 py-1 sm:px-5 sm:py-1.5 rounded-full border-2 ${currentTheme.pill} text-xs sm:text-sm font-black tracking-widest uppercase font-mono transition-all duration-500 shadow-lg bg-white backdrop-blur-sm`}
                >
                  {steps[activeStep].stepLabel}
                </span>
              </div>

              {/* Center Content Enclosed Inside Middle/Bottom of Semicircle Arc */}
              <div className="absolute top-[48%] xs:top-[52%] sm:top-[54%] lg:top-[56%] left-1/2 -translate-x-1/2 text-center flex flex-col items-center w-full max-w-[240px] xs:max-w-[280px] sm:max-w-md px-2 z-10">
                
                {/* Metric Display (e.g. 72HRS, EVERY ORDER) */}
                <div
                  className={`text-2xl xs:text-3xl sm:text-5xl lg:text-[4.25rem] font-black tracking-tight ${currentTheme.metricColor} font-display mb-1 xs:mb-1.5 sm:mb-3 drop-shadow-sm transition-all duration-500 scale-100 leading-none`}
                >
                  {steps[activeStep].metric}
                </div>

                {/* Title */}
                <h3 className="text-sm xs:text-base sm:text-2xl font-black text-[#022B22] tracking-tight font-display mb-0.5 xs:mb-1 sm:mb-2 leading-tight">
                  {steps[activeStep].title}
                </h3>

                {/* Description */}
                <p className="text-[10px] xs:text-[12px] sm:text-sm text-slate-500 leading-tight sm:leading-relaxed font-normal max-w-[200px] xs:max-w-[240px] sm:max-w-sm">
                  {steps[activeStep].desc}
                </p>

              </div>
            </div>

            {/* Step Navigation Controls & Dots */}
            <div className="flex items-center gap-4 sm:gap-5 mt-2 xs:mt-3 sm:mt-7 relative z-20">
              <button
                onClick={() => setActiveStep((prev) => (prev - 1 + steps.length) % steps.length)}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-[#022B22] hover:border-slate-400 flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow active:scale-95 shrink-0"
                aria-label="Previous step"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              </button>

              <div className="flex items-center gap-2 sm:gap-2.5">
                {steps.map((step, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`h-2 sm:h-2.5 rounded-full transition-all duration-400 ${
                      activeStep === idx
                        ? `w-6 sm:w-9 ${step.theme.dotActive} shadow-md`
                        : "w-2 sm:w-2.5 bg-slate-200 hover:bg-slate-300"
                    }`}
                    aria-label={`Jump to step ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border border-slate-200 text-[#022B22] hover:border-slate-400 flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow active:scale-95 shrink-0"
                aria-label="Next step"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
