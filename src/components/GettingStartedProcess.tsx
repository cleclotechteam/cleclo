"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function GettingStartedProcess() {
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

  return (
    <section
      id="process"
      className="py-24 lg:py-32 bg-[#FBFDFB] border-t border-[#0A261E]/5 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Heading & Intro (Exact Typography & Structure from Reference) */}
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
                href="https://cleclo-vendor-dash-psi.vercel.app/#download"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#0A2B24] hover:bg-[#00875A] text-white font-semibold text-xs sm:text-sm px-5 py-3 rounded-full transition-all duration-300 shadow-sm hover:shadow-md group"
              >
                <span>Download the Cleclo App</span>
                <ArrowUpRight className="w-4 h-4 text-[#D4F63D] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Clean White Cards in Mobile Rail View & Desktop Grid */}
          <div className="lg:col-span-8">
            <div className="flex sm:grid sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 pb-4 sm:pb-0">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className={`w-[76vw] max-w-[275px] sm:w-full sm:max-w-none shrink-0 sm:shrink snap-center bg-white rounded-[28px] p-6 sm:p-8 border border-[#0A261E]/8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,176,116,0.08)] hover:border-[#00B074]/30 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between min-h-[250px] ${
                    index === 3 || index === 4
                      ? "sm:col-span-1 xl:col-span-1"
                      : ""
                  }`}
                >
                  {/* Top Big Number */}
                  <div>
                    <span className="text-4xl sm:text-5xl font-black text-[#00B074] tracking-tight font-sans inline-block">
                      {step.number}
                    </span>
                  </div>

                  {/* Middle Title & Bottom Caption */}
                  <div className="mt-8 space-y-3">
                    <h3 className="text-[15px] font-extrabold text-[#0A2B24] uppercase tracking-wide leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs font-semibold text-[#0A2B24]/50 uppercase tracking-wider leading-relaxed">
                      {step.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
