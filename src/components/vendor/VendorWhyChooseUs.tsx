"use client";

import React, { useState } from "react";
import {
  Building2,
  Cpu,
  TrendingUp,
  ShieldCheck,
  CreditCard,
  Truck,
  Tag,
  Clock,
  Sparkles,
  Check,
} from "lucide-react";

export default function VendorWhyChooseUs() {
  const [activeCard, setActiveCard] = useState<number>(0);

  const tools = [
    {
      title: "Multi-Outlet Management",
      desc: "Centrally manage multiple outlets and processing units with real-time visibility across orders, capacity and performance.",
      icon: Building2,
    },
    {
      title: "Smart Order Assignment",
      desc: "Automatically allocated orders based on location, capacity, turnaround time and predefined business rules.",
      icon: Cpu,
    },
    {
      title: "Growth Analytics",
      desc: "Actionable analytics on revenue, order volume, outlet performance and customer trends- updated in real time.",
      icon: TrendingUp,
    },
    {
      title: "Verification System",
      desc: "Built-in vendor and rider verification with audit trails to ensure compliance, service quality and operational accountability.",
      icon: ShieldCheck,
    },
    {
      title: "Revenue Dashboard",
      desc: "Monitor revenue, commissions, payouts and margins across outlets- with complete financial transparency.",
      icon: CreditCard,
    },
    {
      title: "Flexible Delivery Workflows",
      desc: "Configure standard and priority delivery workflows with SLA tracking to meet different service commitments.",
      icon: Truck,
    },
    {
      title: "Transparent Pricing",
      desc: "Pre-defined & configured pricing rules with automatic GST calculation, invoicing and tax-ready reporting.",
      icon: Tag,
    },
    {
      title: "24/7 Platform Availability",
      desc: "Orders, tracking and system workflows remain active 24/7, ensuring uninterrupted operations across outlets.",
      icon: Clock,
    },
  ];

  return (
    <section id="features" className="py-16 sm:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#00875A]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#00875A]">
              Why Choose Us
            </span>
          </div>

          <h2 className="font-display text-2xl sm:text-5xl font-extrabold tracking-tight text-[#022B22] leading-tight mb-4">
            Purpose Built Tools to Manage Operations <br className="hidden sm:inline" />
            <span className="text-[#00875A]">and Scale Your Laundry Business.</span>
          </h2>

          <p className="text-xs sm:text-base text-slate-600 font-normal leading-relaxed">
            Ideal for independent laundry owners, multi-outlet operators and backend vendors.
          </p>
        </div>

        {/* 8 Bento Cards - Mobile Horizontal Scroll Rail / Desktop Grid */}
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 pb-4 sm:pb-0 mb-6 sm:mb-0">
          {tools.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeCard === idx;

            return (
              <div
                key={idx}
                onClick={() => setActiveCard(idx)}
                onMouseEnter={() => setActiveCard(idx)}
                className={`w-[78vw] max-w-[280px] sm:w-full sm:max-w-none shrink-0 sm:shrink snap-center p-6 sm:p-7 rounded-[28px] border transition-all duration-300 flex flex-col justify-between group min-h-[260px] cursor-pointer select-none ${
                  isActive
                    ? "bg-white border-[#00875A] shadow-[0_12px_32px_rgba(0,135,90,0.12)] -translate-y-1"
                    : "bg-slate-50/80 border-slate-200/80 hover:bg-white hover:border-[#00875A]"
                }`}
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#022B22] text-[#D4F63D] flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 stroke-[2.2]" />
                  </div>

                  <h3 className="text-lg font-extrabold text-[#022B22] tracking-tight mb-2.5 font-display group-hover:text-[#00875A] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-1.5 text-xs font-bold text-[#00875A]">
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Cleclo Built-In</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Rail Indicator Dots */}
        <div className="flex items-center justify-center gap-1.5 sm:hidden mt-4">
          {tools.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCard(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeCard === idx
                  ? "w-6 bg-[#00875A]"
                  : "w-1.5 bg-slate-200"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
