"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, UserPlus, Settings2, Inbox, Wallet } from "lucide-react";
import { useRail, RailDots, RAIL_BASE, RAIL_CARD } from "./MobileRail";

// Vendor onboarding shown as a connected timeline:
// vertical stepper on mobile, horizontal track on desktop.
export default function VendorHowItWorks() {
  const signupUrl = "#signup";
  const [activeStep, setActiveStep] = useState<number>(0);
  const { ref: railRef, index: railIndex, goTo: railGoTo } = useRail<HTMLOListElement>(4);

  const steps = [
    {
      num: "01",
      title: "Register as a Vendor",
      caption: "Sign up with your business details and submit basic verification information.",
      detail: "Basic verification submit",
      icon: UserPlus,
    },
    {
      num: "02",
      title: "Configure Outlets & Services",
      caption: "Set up your outlets, select the services you offer (Drycleaning, Washing, Ironing etc.) and configure serviceable areas. Cleclo handles order routing, notifications and tracking automatically.",
      detail: "Automated routing & SLA tracking",
      icon: Settings2,
    },
    {
      num: "03",
      title: "Start Receiving Orders",
      caption: "Once approved, your outlets go live and begin receiving orders automatically.",
      detail: "Live order dispatch active",
      icon: Inbox,
    },
    {
      num: "04",
      title: "Seamless Payouts",
      caption: "Track your earnings in real time and receive regular transparent settlements.",
      detail: "Real-time transparent settlements",
      icon: Wallet,
    },
  ];

  const progressPct = (activeStep / (steps.length - 1)) * 100;

  return (
    <section id="how" className="py-16 sm:py-24 lg:py-28 bg-white border-t border-[#0A261E]/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-16">
          <div className="max-w-2xl">
            <span className="text-[11px] font-mono font-bold tracking-widest text-[#00875A] uppercase">
              Getting started · 4 steps
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-[#022B22] tracking-tight leading-[1.1] mt-2">
              How it <span className="text-[#00875A]">works.</span>
            </h2>
            <p className="mt-3 text-sm sm:text-lg text-slate-600 leading-relaxed">
              A streamlined process to onboard, operate and scale on Cleclo.
            </p>
          </div>

          <Link
            href={signupUrl}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-[#D4F63D] hover:bg-[#c5ea2c] text-[#022B22] font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all duration-300 shadow-sm group shrink-0"
          >
            <span>See How Cleclo Works</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* ===== Desktop: horizontal timeline ===== */}
        <div className="hidden lg:block">
          {/* Track */}
          <div className="relative mb-8 mx-[12.5%]">
            <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 rounded-full bg-slate-100" />
            <div
              className="absolute top-1/2 left-0 h-1 -translate-y-1/2 rounded-full bg-[#00875A] transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
            <div className="relative flex justify-between">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const reached = idx <= activeStep;
                return (
                  <button
                    key={step.num}
                    onClick={() => setActiveStep(idx)}
                    onMouseEnter={() => setActiveStep(idx)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                      reached
                        ? "bg-[#022B22] border-[#D4F63D] text-[#D4F63D]"
                        : "bg-white border-slate-200 text-slate-400"
                    } ${idx === activeStep ? "scale-110 shadow-lg" : ""}`}
                    aria-label={`Step ${step.num}: ${step.title}`}
                  >
                    <Icon className="w-5 h-5 stroke-[2.3]" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step content columns */}
          <div className="grid grid-cols-4 gap-6">
            {steps.map((step, idx) => {
              const isActive = idx === activeStep;
              return (
                <div
                  key={step.num}
                  onMouseEnter={() => setActiveStep(idx)}
                  className={`text-center px-4 py-6 rounded-2xl transition-all duration-300 cursor-default ${
                    isActive ? "bg-[#F4F7F2]" : ""
                  }`}
                >
                  <span className="text-xs font-mono font-bold text-slate-400 tracking-widest">STEP {step.num}</span>
                  <h3 className="font-display text-lg xl:text-xl font-extrabold text-[#022B22] tracking-tight mt-1.5 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.caption}</p>
                  <span
                    className={`inline-block mt-4 text-[11px] font-bold px-3 py-1 rounded-md transition-colors ${
                      isActive ? "bg-[#022B22] text-[#D4F63D]" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {step.detail}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== Mobile / tablet: left-to-right step rail ===== */}
        <div className="lg:hidden">
          <ol ref={railRef} className={`${RAIL_BASE} sm:gap-4`}>
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isLast = idx === steps.length - 1;
              return (
                <li
                  key={step.num}
                  className={`${RAIL_CARD} sm:w-[46vw] sm:max-w-[340px] rounded-2xl bg-white border border-slate-200 shadow-[0_8px_24px_rgba(15,23,42,0.05)] p-5 flex flex-col`}
                >
                  {/* Step marker with a connector pointing to the next step */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-full bg-[#022B22] text-[#D4F63D] border-4 border-[#EAF7D0] flex items-center justify-center shrink-0">
                      <Icon className="w-4.5 h-4.5 stroke-[2.3]" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#00875A] tracking-widest shrink-0">
                      STEP {step.num}
                    </span>
                    {!isLast ? (
                      <span className="flex-1 h-0.5 rounded-full bg-gradient-to-r from-[#00875A] to-[#00875A]/10" />
                    ) : (
                      <span className="ml-auto text-[10px] font-mono font-bold text-slate-400">DONE ✓</span>
                    )}
                  </div>

                  <h3 className="font-display text-lg font-extrabold text-[#022B22] tracking-tight mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{step.caption}</p>
                  <span className="self-start mt-auto pt-3">
                    <span className="inline-block text-[11px] font-bold px-2.5 py-1 rounded-md bg-[#F4F7F2] text-[#022B22] border border-slate-200">
                      {step.detail}
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>
          <RailDots count={steps.length} index={railIndex} onSelect={railGoTo} className="mt-2" />
        </div>

      </div>
    </section>
  );
}
