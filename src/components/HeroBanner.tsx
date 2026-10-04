"use client";

import React, { useState } from "react";
import Link from "next/link";
import MobileDeviceVideo from "@/components/MobileDeviceVideo";
import {
  ShieldCheck,
  Tag,
  Navigation,
  Clock,
  Smartphone,
  CheckCircle2,
  Zap,
  Check,
  Star,
  MapPin,
  Flame,
  RefreshCw,
  Activity,
  Minus,
} from "lucide-react";

export default function HeroBanner() {
  const downloadUrl = "#download";
  const [activeCardIndex, setActiveCardIndex] = useState<number>(1);

  const keyFeatures = [
    {
      number: "01",
      title: "Certified Care Partners",
      desc: "Strictly vetted facility & fabric experts",
      pill: "48-Point Quality Vetted",
      icon: Zap,
    },
    {
      number: "02",
      title: "Standardised Pricing",
      desc: "Zero hidden charges, transparent rates",
      pill: "Fixed Rate Card on App",
      icon: RefreshCw,
    },
    {
      number: "03",
      title: "End-to-End Order Tracking",
      desc: "Live garment status from door to door",
      pill: "Live GPS & Status Milestones",
      icon: Activity,
    },
    {
      number: "04",
      title: "Same-Day to Scheduled Delivery",
      desc: "72h standard promise + Express options",
      pill: "72h Standard + 24h Express",
      icon: Clock,
    },
  ];

  const marqueeItems = [
    "CERTIFIED PARTNERS",
    "STANDARDISED CARE",
    "QUALITY CHECKED",
    "ON-TIME DELIVERY",
  ];

  return (
    <div className="relative bg-[#FFFFFF] overflow-hidden">
      
      {/* Subtle ambient Pine Labs radial lighting */}
      <div className="absolute top-10 right-1/4 w-[600px] h-[600px] bg-emerald-100/30 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-[#D4F63D]/20 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Spacious, Airy & Minimalist - Pure Pine Labs Aesthetic) */}
      {/* ========================================================================= */}
      <section className="pt-12 pb-16 lg:pt-20 lg:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[540px]">
          
          {/* LEFT: Pine Labs Bold Typography & Exact Copy */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10 pr-0 lg:pr-6 w-full">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50/90 border border-emerald-200/70 mb-6 sm:mb-8 max-w-full">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse shrink-0"></span>
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-900 leading-snug">
                India&apos;s first standardised dry-cleaning network
              </span>
            </div>

            {/* Main Headline (Exact Copy) */}
            <h1 className="font-display text-3xl sm:text-5xl lg:text-[4.75rem] font-extrabold tracking-tight text-[#022B22] leading-[1.1] sm:leading-[1.05] mb-5 sm:mb-7">
              Dry cleaning, <br className="hidden xs:inline sm:inline" />
              <span className="text-emerald-950">finally organised.</span>
            </h1>

            {/* Descriptive Subtitle (Exact Copy) */}
            <p className="text-sm sm:text-base lg:text-[1.15rem] text-[#022B22]/80 leading-relaxed sm:leading-[1.7] max-w-2xl lg:max-w-[680px] mb-8 sm:mb-10 font-normal text-pretty">
              Cleclo handles your pickup and delivery end-to-end, while a certified local partner takes care of your garments — one standard price, one standard process and a 72-hour promise, with Express options when you need it sooner.
            </p>

            {/* Download Buttons: [Download on the App Store] [Get it on Google Play] */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 mb-4 sm:mb-5 w-full sm:w-auto">
              
              {/* Apple App Store Button */}
              <Link
                href={downloadUrl}
                className="group flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-[#022B22] text-white hover:bg-[#0d3f33] transition-all duration-300 shadow-[0_8px_20px_rgba(2,43,34,0.25)] hover:shadow-[0_12px_28px_rgba(2,43,34,0.35)] hover:-translate-y-0.5 active:translate-y-0 text-center"
              >
                <svg className="w-6 h-6 fill-current shrink-0 transition-transform group-hover:scale-105" viewBox="0 0 384 512">
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.6 26.1 2 52.3-14.7 69.5-34z" />
                </svg>
                <div className="flex flex-col text-left leading-tight">
                  <span className="text-[10px] uppercase tracking-wider text-slate-300">Download on the</span>
                  <span className="text-sm sm:text-base font-bold font-display">App Store</span>
                </div>
              </Link>

              {/* Google Play Button */}
              <Link
                href={downloadUrl}
                className="group flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-[#022B22] text-white hover:bg-[#0d3f33] transition-all duration-300 shadow-[0_8px_20px_rgba(2,43,34,0.25)] hover:shadow-[0_12px_28px_rgba(2,43,34,0.35)] hover:-translate-y-0.5 active:translate-y-0 text-center"
              >
                <svg className="w-6 h-6 fill-current shrink-0 transition-transform group-hover:scale-105" viewBox="0 0 512 512">
                  <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                </svg>
                <div className="flex flex-col text-left leading-tight">
                  <span className="text-[10px] uppercase tracking-wider text-slate-300">Get it on</span>
                  <span className="text-sm sm:text-base font-bold font-display">Google Play</span>
                </div>
              </Link>

            </div>

            {/* Note text below button: (Exact Copy) */}
            <p className="text-xs text-[#022B22]/70 font-medium flex items-start sm:items-center gap-1.5 mt-1 sm:mt-2">
              <Smartphone className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5 sm:mt-0" />
              <span>Ordering, tracking &amp; payments happen inside the Cleclo app.</span>
            </p>

          </div>

          {/* RIGHT: Floating 3D Mobile Phone (Clean & Spacious) */}
          <div className="lg:col-span-5 relative flex items-center justify-center py-6">
            <MobileDeviceVideo />
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. SOCIAL PROOF SECTION (High-End Glassmorphic Trust Bar) */}
      {/* ========================================================================= */}
      <section className="border-y border-[#022B22]/8 bg-gradient-to-r from-slate-50/80 via-white to-slate-50/80 py-5 sm:py-6 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4.5 w-full md:w-auto">
            {/* Glowing avatar cluster + Mobile Live Badge */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex -space-x-2.5 sm:-space-x-3 overflow-hidden p-0.5">
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full ring-2 ring-white shadow-sm bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white text-xs font-bold">
                  RS
                </div>
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full ring-2 ring-white shadow-sm bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-white text-xs font-bold">
                  AK
                </div>
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full ring-2 ring-white shadow-sm bg-gradient-to-tr from-indigo-600 to-blue-400 flex items-center justify-center text-white text-xs font-bold">
                  PM
                </div>
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full ring-2 ring-white shadow-md bg-[#022B22] flex items-center justify-center text-[#D4F63D] text-[10px] sm:text-[11px] font-extrabold">
                  +5k
                </div>
              </div>

              {/* Mobile-visible Live Network badge next to avatars */}
              <span className="inline-flex md:hidden items-center gap-1.5 text-[10px] font-bold text-emerald-800 bg-emerald-100/90 px-2.5 py-1 rounded-full border border-emerald-200 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Live Network
              </span>
            </div>
            
            {/* Text description */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-[#022B22] leading-snug">
                  NEW CLIENTS JOINING EVERY WEEK ACROSS DELHI NCR.
                </p>
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live Network
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-emerald-800/80 font-medium mt-0.5 leading-normal">
                Active pickups across South Delhi, Gurugram, Noida, Greater Noida &amp; Dwarka
              </p>
            </div>
          </div>

          {/* Rating Pill */}
          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-3 bg-white px-4 py-2.5 rounded-2xl border border-slate-200/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] shrink-0 mt-1 sm:mt-0">
            <div className="flex text-amber-400 text-sm tracking-widest">
              ★ ★ ★ ★ ★
            </div>
            <div className="flex flex-col text-left leading-tight">
              <span className="text-xs font-extrabold text-[#022B22]">4.9 / 5 Rating</span>
              <span className="text-[10px] text-slate-500 font-medium">Verified App Reviews</span>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. 4 KEY FEATURES SECTION (Clean & Compact Assured Rewards Aesthetic) */}
      {/* ========================================================================= */}
      <section className="py-10 sm:py-14 lg:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Ambient atmospheric glow in background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-60 bg-gradient-to-r from-emerald-100/30 via-teal-50/20 to-emerald-100/30 rounded-full blur-[100px] pointer-events-none -z-10" />

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-black tracking-tight text-[#0F172A] uppercase leading-[1.1] font-display">
            WHY CUSTOMERS LOVE <br />
            <span className="text-[#00875A]">
              ASSURED QUALITY
            </span>
          </h2>
          
          <p className="text-sm sm:text-base text-slate-500 font-normal leading-relaxed mt-2.5 max-w-lg mx-auto">
            Simple to book. Easy to manage. <br className="hidden sm:inline" />
            Built to deliver pristine dry cleaning every single time.
          </p>
        </div>

        {/* 4 Feature Cards Grid / Mobile Horizontal Rail */}
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 pb-4 sm:pb-0">
          {keyFeatures.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeCardIndex === idx;

            return (
              <div
                key={idx}
                onMouseEnter={() => setActiveCardIndex(idx)}
                onClick={() => setActiveCardIndex(idx)}
                className={`w-[68vw] max-w-[245px] sm:w-full sm:max-w-none shrink-0 sm:shrink snap-center group relative p-5 sm:p-7 rounded-[26px] sm:rounded-[28px] transition-all duration-300 ease-out cursor-pointer flex flex-col justify-between overflow-hidden min-h-[270px] sm:min-h-[280px] select-none ${
                  isActive
                    ? "bg-[#00875A] text-white shadow-[0_18px_40px_rgba(0,135,90,0.28)] -translate-y-1.5"
                    : "bg-white text-slate-800 border border-slate-200/80 hover:border-emerald-300 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:-translate-y-1"
                }`}
              >
                {/* Tactile Dotted Grid Matrix (for active card) */}
                {isActive && (
                  <div
                    className="absolute inset-0 pointer-events-none rounded-[28px] opacity-25"
                    style={{
                      backgroundImage: "radial-gradient(circle, #ffffff 1.5px, transparent 1.5px)",
                      backgroundSize: "14px 14px",
                    }}
                  />
                )}

                {/* Card Content Top Section */}
                <div className="relative z-10">
                  {/* Top Row: Icon Container + Number Pill */}
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? "bg-white/20 text-white border border-white/25 backdrop-blur-sm"
                          : "bg-[#E8F8F0] text-[#00875A] border border-[#CDEEDC]"
                      }`}
                    >
                      <Icon className="w-5 h-5 stroke-[2.2]" />
                    </div>

                    <span
                      className={`text-[11px] font-black tracking-wider font-mono px-2.5 py-0.5 rounded-full transition-colors ${
                        isActive
                          ? "bg-white/15 text-white border border-white/20"
                          : "bg-slate-100 text-slate-400 border border-slate-200/60"
                      }`}
                    >
                      {item.number}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className={`text-sm sm:text-[15px] font-black tracking-wider uppercase mb-2 leading-snug font-display transition-colors ${
                      isActive ? "text-white" : "text-[#0F172A]"
                    }`}
                  >
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p
                    className={`text-xs sm:text-[13px] leading-relaxed font-normal transition-colors ${
                      isActive ? "text-white/90" : "text-slate-500"
                    }`}
                  >
                    {item.desc}
                  </p>
                </div>

                {/* Card Bottom Tag Pill */}
                <div
                  className={`relative z-10 mt-5 pt-3.5 border-t flex items-center justify-between transition-colors ${
                    isActive ? "border-white/15" : "border-slate-100"
                  }`}
                >
                  <span
                    className={`text-[11px] font-bold px-3 py-1 rounded-lg border transition-all duration-300 ${
                      isActive
                        ? "bg-white/20 text-white border-white/30 backdrop-blur-sm"
                        : "bg-emerald-50 text-emerald-800 border-emerald-200/70"
                    }`}
                  >
                    {item.pill}
                  </span>

                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-700"
                    }`}
                  >
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Indicator Pills for Mobile */}
        <div className="flex items-center justify-center gap-2 mt-6 sm:hidden">
          {keyFeatures.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCardIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeCardIndex === idx
                  ? "w-6 bg-[#00875A]"
                  : "w-1.5 bg-slate-200 hover:bg-slate-300"
              }`}
              aria-label={`Select card ${idx + 1}`}
            />
          ))}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 4. TICKER MARQUEE BANNER: (Exact Copy) */}
      {/* CERTIFIED PARTNERS • STANDARDISED CARE • QUALITY CHECKED • ON-TIME DELIVERY */}
      {/* ========================================================================= */}
      {/* CERTIFIED PARTNERS • STANDARDISED CARE • QUALITY CHECKED • ON-TIME DELIVERY */}
      {/* ========================================================================= */}
      <div className="border-y border-[#022B22]/10 bg-[#022B22] py-4.5 overflow-hidden">
        <div className="animate-marquee flex items-center gap-10 text-xs sm:text-sm font-extrabold tracking-widest text-white">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((text, i) => (
            <div key={i} className="flex items-center gap-10 shrink-0">
              <span className="hover:text-[#D4F63D] transition-colors cursor-default">
                {text}
              </span>
              <span className="text-[#D4F63D] w-2 h-2 rounded-full inline-block bg-[#D4F63D]" />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
