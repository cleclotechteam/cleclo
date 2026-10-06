"use client";

import React from "react";
import Link from "next/link";
import {
  Smartphone,
  Bike,
  Building2,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function VerificationSystem() {
  const downloadUrl = "#download";

  const steps = [
    {
      number: "1",
      title: "Customer Confirmation",
      description:
        "Your order details and the condition of each item are logged the moment you book — a reference point that stays with your order end to end.",
      icon: Smartphone,
      tag: "Digitally Logged",
      badge: "Step 01",
    },
    {
      number: "2",
      title: "Pickup Verification",
      description:
        "Items are checked against your recorded order at pickup so both you and the rider agree on condition before handover.",
      icon: Bike,
      tag: "HANDOVER VETTED",
      badge: "Step 02",
    },
    {
      number: "3",
      title: "Vendor Intake Verification",
      description:
        "Your garments are checked again at the partner facility — condition, service scope and handling requirements confirmed before any work begins.",
      icon: Building2,
      tag: "FACILITY INSPECTED",
      badge: "Step 03",
    },
  ];

  return (
    <section
      id="verification"
      className="py-20 lg:py-28 bg-[#FBFDFB] relative overflow-hidden border-t border-[#0A261E]/5"
    >
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-96 bg-gradient-to-r from-[#00B074]/5 via-emerald-50/20 to-transparent pointer-events-none blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14 sm:mb-16">
          {/* Eyebrow badge matching banner style */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50/90 border border-emerald-200/70 mb-4 max-w-full">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse shrink-0"></span>
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-900 leading-snug">
              3-STEP VERIFICATION SYSTEM
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold text-[#022B22] tracking-tight leading-[1.15]">
            A 3-step verification system, <br className="hidden sm:inline" />
            <span className="text-[#00875A]">on every order</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#0A2B24]/75 font-normal leading-relaxed">
            A built-in check at three points in the journey — so there&apos;s always a clear, auditable record of your garments, from booking to delivery.
          </p>
        </div>

        {/* 3 Step Cards Horizontal Mobile Rail / Desktop Grid */}
        <div className="flex md:grid md:grid-cols-3 gap-5 sm:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none scrollbar-none -mx-4 px-4 md:mx-0 md:px-0 pb-4 md:pb-0 mb-10 md:mb-14">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="w-[78vw] max-w-[290px] md:w-full md:max-w-none shrink-0 md:shrink snap-center group relative bg-white rounded-[28px] p-6 sm:p-8 border border-[#0A261E]/8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,176,116,0.1)] hover:border-[#00B074]/30 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Row: Big Number & Icon Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#00B074] text-white font-extrabold text-xl flex items-center justify-center shadow-md">
                      {step.number}
                    </div>

                    <div className="w-11 h-11 rounded-2xl bg-[#F4F9F6] text-[#00875A] border border-[#00B074]/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      <Icon className="w-5 h-5 stroke-[2.2]" />
                    </div>
                  </div>

                  {/* Tag */}
                  <span className="inline-block text-[10px] font-mono font-bold tracking-widest text-[#00875A] uppercase px-2.5 py-1 rounded-md bg-[#F4F9F6] border border-[#00B074]/15 mb-3">
                    {step.tag}
                  </span>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#0A2B24] tracking-tight mb-3 group-hover:text-[#00875A] transition-colors">
                    {step.title}
                  </h3>

                  {/* Description (Exact user copy) */}
                  <p className="text-sm sm:text-[15px] text-[#0A2B24]/75 leading-relaxed font-normal">
                    {step.description}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">
                    {step.badge}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-[#00875A]">
                    <CheckCircle2 className="w-4 h-4 text-[#00B074]" />
                    <span>Verified</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Callout Banner */}
        <div className="p-6 sm:p-8 rounded-[28px] bg-white border border-[#00B074]/30 shadow-[0_10px_30px_rgba(0,176,116,0.08)] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#00B074]/10 text-[#00875A] flex items-center justify-center shrink-0 border border-[#00B074]/20">
              <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <p className="font-extrabold text-base sm:text-lg text-[#0A2B24]">
              Helps reduce order disputes by up to 90% through transparent, auditable checkpoints.
            </p>
          </div>

          <Link
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2.5 bg-[#D4F63D] hover:bg-[#c5ea2c] text-[#0A2B24] font-extrabold text-xs sm:text-sm px-7 py-3.5 rounded-full transition-all duration-300 shadow-md hover:scale-105 active:scale-95"
          >
            <span>Download the Cleclo App</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
