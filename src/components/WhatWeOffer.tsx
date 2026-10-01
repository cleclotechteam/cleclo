"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Shirt,
  Wind,
  Crown,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function WhatWeOffer() {
  const downloadUrl = "https://cleclo-vendor-dash-psi.vercel.app/#download";

  const cards = [
    {
      number: "01",
      title: "Dry Cleaning",
      description:
        "Delicate garments, formal wear and specialty fabrics, handled with fabric-specific protocols.",
      tag: "FABRIC-SPECIFIC",
      icon: Sparkles,
      iconColor: "#00B074",
      iconBg: "bg-[#E6F7F0]",
      badge: "Suits & Silks",
    },
    {
      number: "02",
      title: "Washing",
      description:
        "Everyday garments, sorted by fabric and colour, with standardised wash cycles and quality checks.",
      tag: "COLOUR-SORTED",
      icon: Shirt,
      iconColor: "#0284C7",
      iconBg: "bg-sky-50",
      badge: "Daily Wear",
    },
    {
      number: "03",
      title: "Steam Ironing",
      description:
        "Professional pressing with fabric-safe temperature control and consistent finishing.",
      tag: "FABRIC-SAFE TEMP",
      icon: Wind,
      iconColor: "#EAB308",
      iconBg: "bg-amber-50",
      badge: "Crisp Finish",
    },
    {
      number: "04",
      title: "Premium & Leather Care",
      description:
        "Designer wear, leather and high-value items, with specialised handling and packaging.",
      tag: "SPECIALISED CARE",
      icon: Crown,
      iconColor: "#8B5CF6",
      iconBg: "bg-purple-50",
      badge: "Designer & Leather",
    },
  ];

  return (
    <section
      id="services"
      className="py-24 lg:py-32 bg-[#FBFDFB] border-t border-[#0A261E]/5 relative overflow-hidden"
    >
      {/* Decorative ambient background glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#00B074]/5 via-transparent to-transparent pointer-events-none blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          {/* Eyebrow */}
          <p className="text-[#00B074] font-bold text-xs sm:text-sm tracking-[0.25em] uppercase mb-4 font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00B074]" />
            WHAT WE OFFER
          </p>

          {/* Main Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A2B24] tracking-tight leading-[1.18] font-sans">
            One app, every <br className="hidden sm:inline" />
            <span className="text-[#00B074]">garment care service</span>
          </h2>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.number}
                className="group relative bg-white rounded-[32px] p-8 sm:p-9 border border-[#0A261E]/8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,176,116,0.12)] hover:border-[#00B074]/30 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Top Section */}
                <div>
                  {/* Number & Icon Row */}
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-3xl sm:text-4xl font-black text-[#0A2B24]/20 group-hover:text-[#00B074] transition-colors font-mono">
                      {card.number}
                    </span>

                    <div
                      className={`w-14 h-14 rounded-2xl ${card.iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm`}
                      style={{ color: card.iconColor }}
                    >
                      <Icon className="w-7 h-7 stroke-[2.2]" />
                    </div>
                  </div>

                  {/* Tag */}
                  <div className="mb-3">
                    <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-2.5 py-1 rounded-md bg-[#F4F9F6] text-[#00875A] border border-[#00B074]/15">
                      {card.tag}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#0A2B24] tracking-tight group-hover:text-[#00875A] transition-colors leading-snug mb-3">
                    {card.title}
                  </h3>

                  {/* Description (Exact user copy) */}
                  <p className="text-sm sm:text-[15px] text-[#0A2B24]/70 leading-relaxed font-normal">
                    {card.description}
                  </p>
                </div>

                {/* Bottom Action Footer */}
                <div className="mt-8 pt-6 border-t border-[#0A261E]/8 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#0A2B24]/50">
                    {card.badge}
                  </span>

                  <Link
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A2B24] group-hover:text-[#00875A] transition-colors"
                  >
                    <span>Book Service</span>
                    <ArrowUpRight className="w-4 h-4 text-[#00B074] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Helper Bar */}
        <div className="mt-12 sm:mt-16 p-6 sm:p-8 rounded-[28px] bg-[#0A2B24] text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#00B074]/20 text-[#D4F63D] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="font-extrabold text-base sm:text-lg">
                All 4 services covered by the Cleclo 72h Standard
              </p>
              <p className="text-xs sm:text-sm text-white/70">
                Item-level tracking, transparent rate card, and zero hidden charges on the app.
              </p>
            </div>
          </div>

          <Link
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 bg-[#D4F63D] hover:bg-[#c5ea2c] text-[#0A2B24] font-bold text-xs sm:text-sm px-6 py-3 rounded-full transition-all duration-300 shadow-md hover:scale-105 active:scale-95"
          >
            <span>Get the App</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
