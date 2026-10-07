"use client";

import React, { useState } from "react";
import { ShieldCheck, CheckCircle2, Award } from "lucide-react";

export default function VendorTrustSafety() {
  const [activeCard, setActiveCard] = useState<number>(0);

  const steps = [
    {
      num: "1",
      title: "Customer Confirmation",
      desc: "Order details and item condition are digitally recorded at initiation, creating a reference point for the entire service lifecycle.",
    },
    {
      num: "2",
      title: "Pickup Verification",
      desc: "Items are verified at pickup to ensure consistency with recorded order details, establishing a secure handover.",
    },
    {
      num: "3",
      title: "Vendor Intake Verification",
      desc: "Items are validated at the processing stage to confirm condition, service scope and handling requirements before execution.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00875A]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#00875A]">
              Trust &amp; Safety
            </span>
          </div>

          <h2 className="font-display text-2xl sm:text-5xl font-extrabold tracking-tight text-[#022B22] leading-tight mb-4">
            3-Step Order Verification System
          </h2>

          <p className="text-xs sm:text-base text-slate-600 font-normal leading-relaxed">
            A built-in verification framework that ensures accountability, reduces disputes and maintains service quality across every order.
          </p>
        </div>

        {/* 3 Step Verification Cards - Mobile Stack / Desktop Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 mb-8 sm:mb-12">
          {steps.map((step, idx) => {
            const isActive = activeCard === idx;
            return (
              <div
                key={idx}
                onClick={() => setActiveCard(idx)}
                onMouseEnter={() => setActiveCard(idx)}
                className={`p-5 sm:p-8 rounded-2xl sm:rounded-[32px] border flex flex-col justify-between transition-all duration-300 md:min-h-[260px] cursor-pointer select-none ${
                  isActive
                    ? "bg-white border-[#00875A] shadow-[0_12px_30px_rgba(0,135,90,0.12)] md:-translate-y-1"
                    : "bg-slate-50/80 border-slate-200/80 hover:bg-white hover:border-[#00875A]"
                }`}
              >
                <div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 text-[#00875A] border border-emerald-200/80 font-black text-lg sm:text-xl flex items-center justify-center mb-4 sm:mb-6 shadow-md">
                    {step.num}
                  </div>

                  <h3 className="text-lg sm:text-xl font-extrabold text-[#022B22] tracking-tight mb-3 font-display">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-200/60 flex items-center gap-2 text-xs font-bold text-[#00875A]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verified Step {step.num}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Impact Callout Pill */}
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center flex items-center justify-center gap-2.5 text-xs sm:text-sm text-[#00875A] font-extrabold shadow-sm">
          <Award className="w-5 h-5 shrink-0" />
          <span>Helps reduce order disputes by up to 90% through transparent and auditable workflows.</span>
        </div>

      </div>
    </section>
  );
}
