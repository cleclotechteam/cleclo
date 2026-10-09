"use client";

import React from "react";
import { Star } from "lucide-react";
import ToolFlipBook from "./ToolFlipBook";

export default function VendorWhyChooseUs() {
  return (
    <section id="why-cleclo" className="scroll-mt-20 py-16 sm:py-24 bg-gradient-to-b from-white via-[#F0F9F5] to-white relative overflow-hidden">
      {/* Soft tri-colour glows */}
      <div className="absolute top-20 -left-24 w-72 h-72 rounded-full bg-emerald-200/30 blur-[110px] pointer-events-none" />
      <div className="absolute top-1/3 -right-24 w-72 h-72 rounded-full bg-sky-200/30 blur-[110px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full bg-violet-200/25 blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-4">
            <Star className="w-3.5 h-3.5 text-violet-600 fill-current" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Why Choose Us
            </span>
          </div>

          <h2 className="font-display text-2xl sm:text-5xl font-extrabold tracking-tight text-[#022B22] leading-tight mb-4">
            Purpose Built Tools to Manage Operations <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#00875A] via-sky-600 to-violet-600 bg-clip-text text-transparent">
              and Scale Your Laundry Business.
            </span>
          </h2>

          <p className="text-xs sm:text-base text-slate-600 font-normal leading-relaxed">
            Ideal for independent laundry owners, multi-outlet operators and backend vendors.
          </p>
        </div>

        {/* Page-turning toolkit */}
        <ToolFlipBook />

      </div>
    </section>
  );
}
