"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useScroll } from "framer-motion";

export default function VendorGettingStartedProcess() {
  const signupUrl = "https://cleclo-vendor-dash-psi.vercel.app/signup";
  const containerRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeCard, setActiveCard] = useState<number>(0);
  const isInteracting = useRef<boolean>(false);

  const steps = [
    {
      number: "01",
      title: "REGISTER YOUR LAUNDRY FACILITY",
      caption: "SUBMIT YOUR OUTLET DETAILS & CHOOSE YOUR VENDOR PARTNER CATEGORY IN UNDER 15 MINUTES.",
      detail: "Zero setup fee with instant online application.",
    },
    {
      number: "02",
      title: "48-POINT QUALITY VERIFICATION",
      caption: "CLECLO AUDIT TEAM INSPECTS YOUR WASHERS, PRESS EQUIPMENT & HYGIENE SOPS.",
      detail: "Verified partner certification & barcode onboarding.",
    },
    {
      number: "03",
      title: "CONNECT TO CLECLO VENDOR OS",
      caption: "ACCESS YOUR DEDICATED DASHBOARD ON DESKTOP OR MOBILE TO RECEIVE DISPATCHED ORDERS.",
      detail: "Automated order intake & doorstep rider assignment.",
    },
    {
      number: "04",
      title: "RECEIVE ORDERS & GET PAID WEEKLY",
      caption: "FULFILL GARMENT ORDERS WITH DEFINED SOPS & RECEIVE DIRECT BANK DEPOSITS EVERY WEEK.",
      detail: "Transparent rate card with 100% weekly payouts.",
    },
  ];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      let stepIndex = 0;
      if (latest < 0.25) {
        stepIndex = 0;
      } else if (latest < 0.5) {
        stepIndex = 1;
      } else if (latest < 0.75) {
        stepIndex = 2;
      } else {
        stepIndex = 3;
      }
      setActiveCard(stepIndex);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

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

  return (
    <section ref={containerRef} className="relative min-h-[300vh] bg-white text-[#0A2B24]">
      
      {/* Sticky container wrapper pinned while scrolling */}
      <div className="sticky top-0 h-screen flex flex-col justify-between py-6 sm:py-10 bg-white overflow-hidden">
        
        {/* Top Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-4 sm:pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-mono font-bold text-[#00875A] uppercase mb-2">
                <span>ONBOARDING PLAYBOOK</span>
              </div>
              <h2 className="font-display text-2xl sm:text-4xl lg:text-[2.65rem] font-extrabold tracking-tight text-[#022B22] uppercase leading-tight">
                HOW TO PARTNER <span className="text-[#00875A]">WITH CLECLO</span>
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 max-w-md font-normal">
              4 simple steps to onboard your store and transform your laundry business.
            </p>
          </div>
        </div>

        {/* Middle Stacked Cards Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex items-center justify-center my-auto z-10 pt-3 sm:pt-4">
          <div
            ref={railRef}
            onScroll={() => {
              isInteracting.current = true;
            }}
            onTouchStart={() => {
              isInteracting.current = true;
            }}
            onWheel={() => {
              isInteracting.current = true;
            }}
            className="flex sm:block overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none scrollbar-none w-full max-w-4xl relative -mx-4 px-4 sm:mx-auto sm:px-0 py-2 sm:py-0"
          >
            {steps.map((step, index) => {
              const isPassed = index < activeCard;
              const isCurrent = index === activeCard;

              return (
                <div
                  key={step.number}
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  onClick={() => handleStepClick(index)}
                  className={`w-[85vw] max-w-[320px] sm:w-full shrink-0 sm:shrink snap-center transition-all duration-500 ease-out cursor-pointer p-6 sm:p-9 rounded-[32px] sm:rounded-[36px] border select-none sm:absolute sm:inset-x-0 ${
                    isCurrent
                      ? "bg-[#022B22] text-white border-emerald-800 shadow-[0_20px_50px_rgba(2,43,34,0.3)] opacity-100 z-30 scale-100 sm:translate-y-0"
                      : isPassed
                      ? "bg-slate-100/90 text-slate-400 border-slate-200/80 shadow-sm opacity-90 z-10 scale-95 sm:-translate-y-6"
                      : "bg-white text-slate-400 border-slate-200/80 shadow-sm opacity-70 z-0 scale-90 sm:translate-y-6"
                  }`}
                  style={{
                    top: `calc(${index * 6}px)`,
                  }}
                >
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <span className="text-xs font-mono font-bold tracking-widest text-[#D4F63D] bg-white/10 px-3 py-1 rounded-full border border-white/15">
                      STEP {step.number} OF 04
                    </span>
                    <span className={`text-xs font-bold ${isCurrent ? "text-emerald-400" : "text-slate-400"}`}>
                      {step.detail}
                    </span>
                  </div>

                  <h3 className={`text-xl sm:text-3xl font-black font-display tracking-tight mb-3 ${
                    isCurrent ? "text-white" : "text-slate-700"
                  }`}>
                    {step.title}
                  </h3>

                  <p className={`text-xs sm:text-base leading-relaxed font-normal ${
                    isCurrent ? "text-slate-300" : "text-slate-500"
                  }`}>
                    {step.caption}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Interactive Step Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200/80">
            
            {/* Step Navigation Dots */}
            <div className="flex items-center gap-2">
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleStepClick(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === activeCard
                      ? "w-8 bg-[#00875A]"
                      : "w-2 bg-slate-300 hover:bg-slate-400"
                  }`}
                  aria-label={`Jump to step ${i + 1}`}
                />
              ))}
            </div>

            {/* Action CTA */}
            <Link
              href={signupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#D4F63D] hover:bg-[#c5ea2c] text-[#022B22] font-extrabold text-xs sm:text-sm px-7 py-3 rounded-full transition-all shadow-md hover:scale-105"
            >
              <span>See How Cleclo Works</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>

          </div>
        </div>

      </div>
    </section>
  );
}
