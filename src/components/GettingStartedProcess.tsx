"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useScroll } from "framer-motion";

export default function GettingStartedProcess() {
  const downloadUrl = "#download";
  const containerRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeCard, setActiveCard] = useState<number>(0);
  const isInteracting = useRef<boolean>(false);

  const steps = [
    {
      number: "01",
      title: "BOOK IN THE APP",
      caption: "CHOOSE YOUR SERVICE & PICKUP SLOT IN JUST A FEW TAPS.",
      detail: "Instant scheduling with zero phone calls.",
    },
    {
      number: "02",
      title: "PICKED UP & LOGGED",
      caption: "OUR RIDER COLLECTS YOUR GARMENTS, WITH EVERY ITEM TAGGED AND RECORDED.",
      detail: "Digital audit & itemized intake receipt.",
    },
    {
      number: "03",
      title: "ASSIGNED TO A VERIFIED PARTNER",
      caption: "YOUR ORDER IS ROUTED TO A TRAINED CLECLO PARTNER OPERATING TO DEFINED SERVICE STANDARDS.",
      detail: "Certified facilities with eco-friendly SOPs.",
    },
    {
      number: "04",
      title: "CLEANED. CHECKED. APPROVED.",
      caption: "YOUR GARMENTS GO THROUGH THE CLECLO PROCESS AND QUALITY CHECKS BEFORE LEAVING THE FACILITY.",
      detail: "Multi-point inspection & steam finishing.",
    },
    {
      number: "05",
      title: "DELIVERED WITHIN 72 HOURS",
      caption: "YOUR ORDER IS TRACKED THROUGH DELIVERY, WITH EXPRESS OPTIONS AVAILABLE WHEN YOU NEED IT SOONER.",
      detail: "Guaranteed turnaround & live tracking.",
    },
  ];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Relaxed & smooth scroll step transition as user scrolls down the section
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      let stepIndex = 0;
      if (latest < 0.2) {
        stepIndex = 0;
      } else if (latest < 0.4) {
        stepIndex = 1;
      } else if (latest < 0.6) {
        stepIndex = 2;
      } else if (latest < 0.8) {
        stepIndex = 3;
      } else {
        stepIndex = 4;
      }
      setActiveCard(stepIndex);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Smooth scroll mobile horizontal rail to active card
  useEffect(() => {
    const activeEl = cardRefs.current[activeCard];
    if (activeEl && railRef.current && window.innerWidth < 640 && !isInteracting.current) {
      activeEl.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeCard]);

  // Handle step click/tap with smooth page scroll
  const handleStepClick = (index: number) => {
    setActiveCard(index);
    if (containerRef.current) {
      const containerTop = containerRef.current.offsetTop;
      const containerHeight = containerRef.current.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollableDistance = containerHeight - windowHeight;
      if (scrollableDistance > 0) {
        const targetScroll = containerTop + (index / (steps.length - 1)) * scrollableDistance;
        window.scrollTo({
          top: targetScroll,
          behavior: "smooth",
        });
      }
    }
  };

  // Handle manual horizontal touch scroll on mobile rail
  const handleRailScroll = () => {
    if (!railRef.current) return;
    isInteracting.current = true;
    const rail = railRef.current;
    const cardWidth = rail.scrollWidth / steps.length;
    const index = Math.min(
      Math.floor((rail.scrollLeft + cardWidth / 2) / cardWidth),
      steps.length - 1
    );
    if (index >= 0 && index !== activeCard) {
      setActiveCard(index);
    }
    setTimeout(() => {
      isInteracting.current = false;
    }, 500);
  };

  return (
    <div ref={containerRef} className="relative h-[220vh] sm:h-[250vh]">
      <section
        id="process"
        className="sticky top-12 sm:top-20 min-h-[90vh] sm:min-h-screen py-12 lg:py-20 bg-[#FBFDFB] border-t border-[#0A261E]/5 overflow-hidden flex flex-col justify-center"
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Heading & Intro */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            {/* Eyebrow badge matching banner style */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50/90 border border-emerald-200/70 mb-5 max-w-full">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse shrink-0"></span>
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-900 leading-snug">
                GETTING STARTED
              </span>
            </div>

            {/* Main Headline */}
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold text-[#022B22] tracking-tight leading-[1.15]">
              One standard. <br />
              Built into <br />
              <span className="text-[#00875A]">every step.</span>
            </h2>

            {/* Description */}
            <p className="mt-6 text-sm sm:text-base text-[#0A2B24]/70 leading-relaxed font-normal">
              Five steps, the same for every order — from the moment you book to
              the moment it&apos;s back in your hands.
            </p>

            {/* Action CTA */}
            <div className="mt-8 pt-6 border-t border-[#0A261E]/10">
              <Link
                href={downloadUrl}
                className="inline-flex items-center gap-2 bg-[#00875A] hover:bg-[#006B47] text-white font-semibold text-xs sm:text-sm px-5 py-3 rounded-full transition-all duration-300 shadow-sm hover:shadow-md group"
              >
                <span>Download the Cleclo App</span>
                <ArrowUpRight className="w-4 h-4 text-[#D4F63D] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Cards with Scroll-Linked Highlight & Soft Light Green Active Style */}
          <div className="lg:col-span-8">
            <div
              ref={railRef}
              onScroll={handleRailScroll}
              className="flex sm:grid sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 pt-3 pb-4 sm:pt-4 sm:pb-2"
            >
              {steps.map((step, index) => {
                const isActive = activeCard === index;

                return (
                  <div
                    key={step.number}
                    ref={(el) => {
                      cardRefs.current[index] = el;
                    }}
                    onClick={() => setActiveCard(index)}
                    onMouseEnter={() => setActiveCard(index)}
                    className={`w-[76vw] max-w-[275px] sm:w-full sm:max-w-none shrink-0 sm:shrink snap-center rounded-[28px] p-6 sm:p-8 border transition-all duration-300 flex flex-col justify-between min-h-[250px] cursor-pointer select-none ${
                      isActive
                        ? "bg-[#F0F9F5] border-[#00B074] shadow-[0_12px_32px_rgba(0,176,116,0.14)] -translate-y-1 sm:-translate-y-1.5"
                        : "bg-white border-[#0A261E]/8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:border-[#00B074]/30 hover:bg-[#F8FCFA] hover:-translate-y-1"
                    } ${
                      index === 3 || index === 4
                        ? "sm:col-span-1 xl:col-span-1"
                        : ""
                    }`}
                  >
                    {/* Top Big Number */}
                    <div>
                      <span
                        className={`text-4xl sm:text-5xl font-black tracking-tight font-sans inline-block transition-colors duration-300 ${
                          isActive ? "text-[#00875A]" : "text-[#00B074]/70"
                        }`}
                      >
                        {step.number}
                      </span>
                    </div>

                    {/* Middle Title & Bottom Caption */}
                    <div className="mt-8 space-y-3">
                      <h3
                        className={`text-[15px] font-extrabold uppercase tracking-wide leading-snug transition-colors duration-300 ${
                          isActive ? "text-[#022B22]" : "text-[#0A2B24]"
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p
                        className={`text-[11px] sm:text-xs font-semibold uppercase tracking-wider leading-relaxed transition-colors duration-300 ${
                          isActive ? "text-[#0A2B24]/80" : "text-[#0A2B24]/50"
                        }`}
                      >
                        {step.caption}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);
}
