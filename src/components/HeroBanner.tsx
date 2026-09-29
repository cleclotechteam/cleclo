"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Tag,
  Navigation,
  Clock,
  Sparkles,
  ArrowRight,
  Smartphone,
  Star,
  Users,
  CheckCircle2,
  MapPin,
  Zap,
} from "lucide-react";

export default function HeroBanner() {
  const downloadUrl = "https://cleclo-vendor-dash-psi.vercel.app/#download";

  const keyFeatures = [
    {
      title: "Certified Care Partners",
      desc: "Strictly vetted facility & fabric experts",
      icon: ShieldCheck,
      color: "text-emerald-700 bg-emerald-50 border-emerald-200/80",
    },
    {
      title: "Standardised Pricing",
      desc: "Zero hidden charges, transparent rates",
      icon: Tag,
      color: "text-blue-700 bg-blue-50 border-blue-200/80",
    },
    {
      title: "End-to-End Order Tracking",
      desc: "Live garment status from door to door",
      icon: Navigation,
      color: "text-amber-700 bg-amber-50 border-amber-200/80",
    },
    {
      title: "Same-Day to Scheduled Delivery",
      desc: "72h standard promise + Express options",
      icon: Clock,
      color: "text-purple-700 bg-purple-50 border-purple-200/80",
    },
  ];

  const marqueeItems = [
    "CERTIFIED PARTNERS",
    "STANDARDISED CARE",
    "QUALITY CHECKED",
    "ON-TIME DELIVERY",
    "72-HOUR PROMISE",
    "EXPRESS OPTIONS AVAILABLE",
    "END-TO-END DOORSTEP LOGISTICS",
  ];

  return (
    <section className="relative overflow-hidden pt-6 pb-16 lg:pt-12 lg:pb-24 bg-gradient-to-b from-[#FBFDFB] via-[#F4F9F5] to-[#FFFFFF]">
      {/* Background ambient lighting / glowing mesh (Pine Labs style) */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-200/25 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-[#D4F63D]/20 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="absolute -bottom-10 left-10 w-[500px] h-[500px] bg-teal-100/30 rounded-full blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT CONTENT COLUMN (Pine Labs Inspired Typography & Layout) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            
            {/* Top Badge: India's first standardised dry-cleaning network */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/90 border border-[#0A2B24]/10 shadow-[0_2px_10px_rgba(10,43,36,0.04)] mb-6 hover:border-[#0A2B24]/20 transition-all">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
              </span>
              <span className="text-xs sm:text-sm font-semibold tracking-wide uppercase text-[#0A2B24]">
                India&apos;s first standardised dry-cleaning network
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-4xl sm:text-6xl lg:text-[4.25rem] font-extrabold tracking-tight text-[#0A2B24] leading-[1.08] mb-6">
              Dry cleaning, <br />
              <span className="relative inline-block text-emerald-900">
                finally organised.
                {/* Subtle highlighter swoosh under "finally organised" */}
                <svg
                  className="absolute -bottom-2 left-0 w-full text-[#D4F63D] -z-10 opacity-90 h-3"
                  viewBox="0 0 300 20"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M3 15C70 5 180 3 297 12"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Comprehensive descriptive paragraph */}
            <p className="text-base sm:text-lg lg:text-xl text-[#0A2B24]/80 leading-relaxed max-w-2xl mb-8 font-normal">
              Cleclo handles your pickup and delivery end-to-end, while a certified local partner takes care of your garments — <span className="font-medium text-[#0A2B24]">one standard price</span>, <span className="font-medium text-[#0A2B24]">one standard process</span> and a <span className="font-medium text-[#0A2B24]">72-hour promise</span>, with Express options when you need it sooner.
            </p>

            {/* CTAs: App Store & Google Play buttons + Main CTA */}
            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-4">
              
              {/* Apple App Store Button */}
              <Link
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-3 px-5 py-3 rounded-2xl bg-[#0A2B24] text-white hover:bg-[#123E34] transition-all duration-300 shadow-[0_10px_25px_-5px_rgba(10,43,36,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(10,43,36,0.4)] hover:-translate-y-0.5 active:translate-y-0"
              >
                {/* Apple Logo SVG */}
                <svg className="w-6 h-6 fill-current transition-transform group-hover:scale-110" viewBox="0 0 384 512">
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.6 26.1 2 52.3-14.7 69.5-34z" />
                </svg>
                <div className="flex flex-col text-left leading-tight">
                  <span className="text-[11px] uppercase tracking-wider text-slate-300">Download on the</span>
                  <span className="text-base font-semibold font-display">App Store</span>
                </div>
              </Link>

              {/* Google Play Button */}
              <Link
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-3 px-5 py-3 rounded-2xl bg-[#0A2B24] text-white hover:bg-[#123E34] transition-all duration-300 shadow-[0_10px_25px_-5px_rgba(10,43,36,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(10,43,36,0.4)] hover:-translate-y-0.5 active:translate-y-0"
              >
                {/* Google Play Logo SVG */}
                <svg className="w-6 h-6 fill-current transition-transform group-hover:scale-110" viewBox="0 0 512 512">
                  <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                </svg>
                <div className="flex flex-col text-left leading-tight">
                  <span className="text-[11px] uppercase tracking-wider text-slate-300">Get it on</span>
                  <span className="text-base font-semibold font-display">Google Play</span>
                </div>
              </Link>

              {/* Pine Labs Style Quick Button */}
              <Link
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#D4F63D] hover:bg-[#c6ec2b] text-[#0A2B24] font-bold text-sm transition-all duration-300 shadow-[0_4px_16px_rgba(212,246,61,0.4)] hover:shadow-[0_8px_24px_rgba(212,246,61,0.6)] hover:-translate-y-0.5 active:translate-y-0 sm:hidden"
              >
                <span>Book Pickup Now</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Note text below buttons */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#0A2B24]/70 mb-8 font-medium">
              <Smartphone className="w-4 h-4 text-emerald-700" />
              <span>Ordering, tracking &amp; payments happen inside the Cleclo app.</span>
            </div>

            {/* Social Proof: NEW CLIENTS JOINING EVERY WEEK ACROSS DELHI NCR */}
            <div className="w-full p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-[#0A2B24]/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-wrap items-center justify-between gap-4 mb-10">
              <div className="flex items-center gap-3">
                {/* User avatar stack */}
                <div className="flex -space-x-2.5 overflow-hidden">
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white text-[11px] font-bold">
                    RS
                  </div>
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-white text-[11px] font-bold">
                    AK
                  </div>
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gradient-to-tr from-indigo-600 to-blue-400 flex items-center justify-center text-white text-[11px] font-bold">
                    PM
                  </div>
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-emerald-950 flex items-center justify-center text-[#D4F63D] text-[10px] font-bold">
                    +5k
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#0A2B24]">
                    NEW CLIENTS JOINING EVERY WEEK ACROSS DELHI NCR.
                  </p>
                  <p className="text-[11px] text-emerald-800 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Active pickups in South Delhi, Gurugram, Noida &amp; Dwarka
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 text-emerald-900 text-xs font-semibold">
                <div className="flex text-amber-400">
                  {"★".repeat(5)}
                </div>
                <span>4.9/5 Rating</span>
              </div>
            </div>

            {/* 4 Core Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
              {keyFeatures.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white/80 border border-[#0A2B24]/8 hover:border-[#0A2B24]/20 transition-all hover:shadow-[0_6px_20px_rgba(10,43,36,0.06)] group flex items-start gap-3"
                  >
                    <div className={`p-2 rounded-xl border ${item.color} shrink-0 mt-0.5 group-hover:scale-105 transition-transform`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#0A2B24] tracking-tight">
                        {item.title}
                      </h4>
                      <p className="text-xs text-[#0A2B24]/70 mt-0.5 font-normal">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* RIGHT VISUAL COLUMN (Pine Labs 3D Mockup Showcase + Floating Elements) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            {/* Visual glow backdrop */}
            <div className="relative w-full max-w-[480px] lg:max-w-none aspect-square flex items-center justify-center">
              
              {/* Subtle circular pulse rings */}
              <div className="absolute inset-4 rounded-full border border-emerald-500/15 animate-ping opacity-25" />
              <div className="absolute inset-12 rounded-full border border-[#D4F63D]/30" />
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-100/40 via-white/20 to-transparent rounded-3xl" />

              {/* Main 3D Phone & Visual Asset */}
              <div className="relative z-10 w-full h-full p-2 animate-float-slow">
                <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(10,43,36,0.18)] border border-white/80 bg-white/40 backdrop-blur-sm">
                  <Image
                    src="/hero-3d.jpg"
                    alt="Cleclo mobile app dry cleaning workflow and 3D visual"
                    fill
                    priority
                    className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                {/* Floating Interactive Badge 1: 72h Standard Promise */}
                <div className="absolute -top-4 -left-4 z-20 glass-card px-4 py-3 rounded-2xl shadow-xl animate-float-reverse hidden sm:flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#D4F63D] flex items-center justify-center text-[#0A2B24] shadow-inner font-black text-sm">
                    ⚡
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800">
                      Standard SLA
                    </span>
                    <p className="text-xs font-extrabold text-[#0A2B24]">
                      72-Hour Promise
                    </p>
                  </div>
                </div>

                {/* Floating Interactive Badge 2: Certified Partner */}
                <div className="absolute -bottom-5 -right-3 z-20 glass-card px-4 py-3 rounded-2xl shadow-xl animate-float-slow hidden sm:flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#0A2B24] flex items-center justify-center text-[#D4F63D]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#0A2B24]/70">
                      Verified Care
                    </span>
                    <p className="text-xs font-extrabold text-[#0A2B24]">
                      Certified Partners Only
                    </p>
                  </div>
                </div>

                {/* Floating Interactive Badge 3: Express Available */}
                <div className="absolute top-1/2 -right-6 -translate-y-1/2 z-20 glass-card px-3.5 py-2.5 rounded-2xl shadow-lg hidden md:flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-xs font-bold text-[#0A2B24]">
                    Express 24h Available
                  </span>
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>

      {/* BOTTOM TICKER / MARQUEE BANNER: CERTIFIED PARTNERS • STANDARDISED CARE • QUALITY CHECKED • ON-TIME DELIVERY */}
      <div className="mt-16 lg:mt-20 border-y border-[#0A2B24]/10 bg-white/80 py-4.5 overflow-hidden backdrop-blur-sm shadow-[0_4px_20px_rgba(10,43,36,0.02)]">
        <div className="animate-marquee flex items-center gap-8 text-xs sm:text-sm font-extrabold tracking-widest text-[#0A2B24]">
          {/* Repeating sequence for continuous smooth loop */}
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((text, i) => (
            <div key={i} className="flex items-center gap-8 shrink-0">
              <span className="hover:text-emerald-700 transition-colors cursor-default">
                {text}
              </span>
              <span className="text-[#D4F63D] bg-[#0A2B24] w-2 h-2 rounded-full inline-block" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
