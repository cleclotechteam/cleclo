"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles, CheckCircle2 } from "lucide-react";

export default function VendorHowItWorks() {
  const signupUrl = "#signup";
  const [activeCard, setActiveCard] = useState<number>(0);

  const steps = [
    {
      num: "01",
      stepLabel: "STEP 01",
      title: "Register as a Vendor",
      caption: "Sign up with your business details and submit basic verification information.",
      detail: "Basic verification submit",
    },
    {
      num: "02",
      stepLabel: "STEP 02",
      title: "Configure Outlets & Services",
      caption: "Set up your outlets, select the services you offer (Drycleaning, Washing, Ironing etc.) and configure serviceable areas. Cleclo handles order routing, notifications and tracking automatically.",
      detail: "Automated routing & SLA tracking",
    },
    {
      num: "03",
      stepLabel: "STEP 03",
      title: "Start Receiving Orders",
      caption: "Once approved, your outlets go live and begin receiving orders automatically.",
      detail: "Live order dispatch active",
    },
    {
      num: "04",
      stepLabel: "STEP 04",
      title: "Seamless Payouts",
      caption: "Track your earnings in real time and receive regular transparent settlements.",
      detail: "Real-time transparent settlements",
    },
  ];

  return (
    <section id="how" className="py-16 sm:py-24 lg:py-28 bg-[#FBFDFB] border-t border-[#0A261E]/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left Column: Heading & Intro (Matching Customer Site Layout) */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 mb-5">
              <Sparkles className="w-3.5 h-3.5 text-[#00875A]" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00875A]">
                Getting started
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-[#022B22] tracking-tight leading-[1.12]">
              How It <br />
              <span className="text-[#00875A]">Works</span>
            </h2>

            <p className="mt-5 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              A streamlined process to onboard, operate and scale on Cleclo.
            </p>

            <div className="mt-8 pt-6 border-t border-slate-200/80">
              <Link
                href={signupUrl}
                className="inline-flex items-center gap-2 bg-[#022B22] hover:bg-[#00875A] text-white font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-full transition-all duration-300 shadow-sm hover:shadow-md group"
              >
                <span>See How Cleclo Works</span>
                <ArrowUpRight className="w-4 h-4 text-[#D4F63D] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: 4 Process Cards - Mobile Horizontal Scroll Rail / Desktop Grid */}
          <div className="lg:col-span-8">
            <div className="flex sm:grid sm:grid-cols-2 gap-4 sm:gap-6 overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 pb-4 sm:pb-0 mb-6 sm:mb-0">
              {steps.map((step, index) => {
                const isActive = activeCard === index;

                return (
                  <div
                    key={step.num}
                    onClick={() => setActiveCard(index)}
                    onMouseEnter={() => setActiveCard(index)}
                    className={`w-[80vw] max-w-[290px] sm:w-full sm:max-w-none shrink-0 sm:shrink snap-center rounded-[28px] p-6 sm:p-8 border transition-all duration-300 flex flex-col justify-between min-h-[260px] sm:min-h-[280px] cursor-pointer select-none ${
                      isActive
                        ? "bg-[#F0F9F5] border-[#00B074] shadow-[0_12px_32px_rgba(0,176,116,0.14)] -translate-y-1 sm:-translate-y-1.5"
                        : "bg-white border-[#0A261E]/10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:border-[#00B074]/30 hover:bg-[#F8FCFA] hover:-translate-y-1"
                    }`}
                  >
                    {/* Top Row: Big Number & Step Pill */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className={`text-4xl sm:text-5xl font-black tracking-tight font-sans transition-colors duration-300 ${
                            isActive ? "text-[#00875A]" : "text-[#00B074]/60"
                          }`}
                        >
                          {step.num}
                        </span>

                        <span
                          className={`text-[11px] font-mono font-bold tracking-wider px-3 py-1 rounded-full transition-colors ${
                            isActive
                              ? "bg-[#00875A] text-white"
                              : "bg-slate-100 text-slate-500 border border-slate-200/80"
                          }`}
                        >
                          {step.stepLabel}
                        </span>
                      </div>

                      <h3
                        className={`text-lg sm:text-xl font-extrabold tracking-tight mb-2.5 leading-snug font-display transition-colors duration-300 ${
                          isActive ? "text-[#022B22]" : "text-[#0A2B24]"
                        }`}
                      >
                        {step.title}
                      </h3>

                      <p
                        className={`text-xs sm:text-sm leading-relaxed font-normal transition-colors duration-300 ${
                          isActive ? "text-[#0A2B24]/90" : "text-slate-500"
                        }`}
                      >
                        {step.caption}
                      </p>
                    </div>

                    {/* Bottom Detail Tag */}
                    <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-[#00875A]">
                      <span>{step.detail}</span>
                      <CheckCircle2 className="w-4 h-4 text-[#00875A]" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile Rail Indicator Dots */}
            <div className="flex items-center justify-center gap-1.5 sm:hidden mt-4">
              {steps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveCard(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeCard === idx
                      ? "w-6 bg-[#00875A]"
                      : "w-1.5 bg-slate-200"
                  }`}
                  aria-label={`Go to step ${idx + 1}`}
                />
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
