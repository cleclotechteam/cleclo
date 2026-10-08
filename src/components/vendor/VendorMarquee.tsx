"use client";

import React from "react";
import { Star } from "lucide-react";

export default function VendorMarquee() {
  const marqueeItems = [
    "INDEPENDENT LAUNDRY OWNERS",
    "MULTI OUTLET OPERATORS",
    "BACKEND VENDOR PARTNERS",
    "FRANCHISE OWNERS",
    "24/7 PLATFORM AVAILABILITY",
    "SCALABLE OPERATIONS",
  ];

  return (
    <div className="w-full bg-[#022B22] border-y border-emerald-900/60 py-4.5 overflow-hidden relative select-none">
      {/* Subtle ambient lighting */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#022B22] via-transparent to-[#022B22] z-10 pointer-events-none" />

      <div className="flex whitespace-nowrap animate-marquee">
        {[...Array(4)].map((_, arrayIdx) => (
          <div key={arrayIdx} className="flex items-center shrink-0">
            {marqueeItems.map((item, idx) => (
              <div key={idx} className="flex items-center mx-6">
                <span className="text-xs sm:text-sm font-mono font-bold tracking-[0.22em] text-[#D4F63D] uppercase">
                  {item}
                </span>
                <Star className="w-3.5 h-3.5 text-[#D4F63D] ml-12 shrink-0 fill-current" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
