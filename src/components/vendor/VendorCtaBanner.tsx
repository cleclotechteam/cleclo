"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, PhoneCall } from "lucide-react";

export default function VendorCtaBanner() {
  const signupUrl = "#signup";
  const contactUrl = "#contact";

  const benefits = [
    "Access New Customer Demand",
    "Increase Your Business Visibility",
    "Reduce Customer Acquisition Cost",
    "Manage Orders Through One Platform",
  ];

  return (
    <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="p-6 sm:p-14 rounded-[28px] sm:rounded-[36px] bg-[#022B22] text-white border border-emerald-900 shadow-2xl relative overflow-hidden">
          
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#00B074]/20 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-3xl relative z-10">
            
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#D4F63D] animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-widest text-[#D4F63D] uppercase">
                Get Started Today
              </span>
            </div>

            {/* Headline */}
            <h2 className="font-display text-2xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
              Ready to Scale Your Business Faster?
            </h2>

            {/* Subheadline */}
            <p className="text-xs sm:text-lg text-slate-300 font-normal leading-relaxed mb-8 max-w-2xl">
              Join Cleclo and start receiving orders through a structured, automated platform built to help laundry vendors scale without operational complexity.
            </p>

            {/* 4 Benefits Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10 text-xs sm:text-sm font-semibold text-white">
              {benefits.map((b, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4.5 h-4.5 text-[#D4F63D] shrink-0" />
                  <span>{b}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href={signupUrl}
                className="group inline-flex items-center justify-center gap-2.5 bg-[#D4F63D] hover:bg-[#c5ea2c] text-[#022B22] font-extrabold text-xs sm:text-sm px-8 py-4 rounded-full transition-all duration-300 shadow-[0_4px_16px_rgba(212,246,61,0.35)] hover:shadow-[0_8px_24px_rgba(212,246,61,0.5)] hover:scale-105 active:scale-95"
              >
                <span>Become a Cleclo Vendor</span>
                <ArrowUpRight className="w-4.5 h-4.5" />
              </Link>

              <Link
                href={contactUrl}
                className="group inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs sm:text-sm px-7 py-4 rounded-full border border-white/15 transition-all duration-300 hover:scale-105"
              >
                <PhoneCall className="w-4 h-4 text-[#D4F63D]" />
                <span>Talk to Sales</span>
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
