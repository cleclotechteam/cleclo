"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, Cpu, MapPin, CreditCard, ShieldCheck, Check, Star } from "lucide-react";

export default function VendorFeatures() {
  const signupUrl = "https://cleclo-vendor-dash-psi.vercel.app/signup";

  const features = [
    {
      icon: Cpu,
      title: "Automated Order Dispatch",
      desc: "Receive customer pickup and dry cleaning requests directly to your vendor app. No manual phone calls or messy paper logs.",
    },
    {
      icon: MapPin,
      title: "Real-Time GPS Tracking",
      desc: "Provide customers and delivery partners with live milestone tracking from doorstep pickup to final delivery.",
    },
    {
      icon: CreditCard,
      title: "Unified Digital Payments",
      desc: "Instant customer checkout via UPI, cards, or wallet with automated weekly vendor payouts directly into your bank account.",
    },
    {
      icon: ShieldCheck,
      title: "Digital SOP & Tagging",
      desc: "Barcode tagging at pickup ensures zero lost garments, strict fabric care protocols, and automated 48-point quality checks.",
    },
  ];

  return (
    <section id="features" className="py-20 sm:py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 mb-4">
            <Star className="w-3.5 h-3.5 text-[#00875A] fill-current" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#00875A]">
              PLATFORM FEATURES
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-[#022B22] leading-tight mb-4">
            Automate operations from <br className="hidden sm:inline" />
            <span className="text-[#00875A]">order to payout.</span>
          </h2>

          <p className="text-sm sm:text-lg text-slate-600 font-normal leading-relaxed">
            Cleclo gives laundry owners cutting-edge technology to run orders, track staff, and guarantee customer delight with zero extra friction.
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-7 rounded-[28px] bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:border-emerald-300 hover:shadow-[0_8px_30px_rgba(0,135,90,0.08)] transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#00875A] border border-emerald-200/80 flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 stroke-[2.2]" />
                  </div>

                  <h3 className="text-xl font-extrabold text-[#022B22] tracking-tight mb-2 font-display">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-1.5 text-xs font-bold text-[#00875A]">
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Cleclo OS Included</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Strip */}
        <div className="text-center">
          <Link
            href={signupUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#00875A] hover:bg-[#006B47] text-white font-extrabold text-sm px-8 py-4 rounded-full transition-all duration-300 shadow-xl hover:scale-105"
          >
            <span>See How Cleclo Works</span>
            <ArrowUpRight className="w-4 h-4 text-[#D4F63D]" />
          </Link>
        </div>

      </div>
    </section>
  );
}
