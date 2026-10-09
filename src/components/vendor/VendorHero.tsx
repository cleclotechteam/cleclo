"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Star, TrendingUp, ShieldCheck, Zap, Layers, BarChart3 } from "lucide-react";

import VendorDesktopVideo from "./VendorDesktopVideo";

export default function VendorHero() {
  const signupUrl = "#signup";

  return (
    <section className="relative pt-12 sm:pt-16 pb-20 lg:pb-28 bg-white overflow-hidden">
      
      {/* Background Ambient Radial Glow matching main site */}
      <div className="absolute top-0 right-1/3 w-[600px] h-[600px] bg-emerald-200/25 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-[#D4F63D]/20 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Tactile Background Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, #022b22 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Eyebrow Badge with exact text requested */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl sm:rounded-full bg-emerald-50 border border-emerald-200/80 shadow-sm max-w-full">
            <span className="w-2 h-2 rounded-full bg-[#00875A] animate-pulse shrink-0" />
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#00875A] leading-normal text-center">
              Who It&apos;s For: Independent Laundry Owners, Multi Outlet Operators, Backend Vendor Partners, Franchise Owners
            </span>
          </div>
        </div>

        {/* Main Hero Headline & Subheadline */}
        <div className="text-center max-w-4xl mx-auto mb-10 sm:mb-12">
          <h1 className="font-display text-3xl sm:text-6xl lg:text-[4.25rem] font-extrabold tracking-tight text-[#022B22] leading-[1.1] mb-6">
            Transform Your Laundry Business Into a <br className="hidden sm:inline" />
            <span className="text-[#00875A] relative inline-block">
              Scalable Profit Machine.
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#D4F63D] -z-10" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0,15 Q50,0 100,15" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="text-sm sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto mb-8">
            Automate orders, track operations in real time and manage deliveries and payments from one unified platform.
          </p>

          {/* Primary CTA */}
          <div className="flex items-center justify-center mb-12 w-full">
            <Link
              href={signupUrl}
              className="w-full max-w-md group inline-flex items-center justify-center gap-3 bg-[#D4F63D] hover:bg-[#c5ea2c] text-[#022B22] font-extrabold text-base sm:text-lg px-10 py-4 sm:py-5 rounded-full transition-all duration-300 shadow-[0_8px_25px_rgba(212,246,61,0.45)] hover:shadow-[0_12px_30px_rgba(212,246,61,0.6)] hover:scale-105 active:scale-95"
            >
              <span>See How Cleclo Works</span>
              <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>

          {/* Social Proof Subtitle */}
          <p className="text-xs sm:text-sm font-extrabold tracking-widest text-slate-400 uppercase font-mono">
            ⚡ Powering Leading Laundry Partners Across India.
          </p>
        </div>

        {/* Live Vendor Stats Bar (Mobile Stack / Desktop Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-5 max-w-5xl mx-auto mb-12 sm:mb-16">
          
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-[28px] bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 border border-emerald-200 text-[#00875A] flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-extrabold font-display text-[#022B22]">Rapidly Growing</div>
              <p className="text-xs text-slate-500 font-medium">Vendor Network Across India</p>
            </div>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-[28px] bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100/80 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
              <Star className="w-6 h-6 stroke-[2.2] fill-amber-500" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-extrabold font-display text-[#022B22]">4.9 / 5.0 Rating</div>
              <p className="text-xs text-slate-500 font-medium">Average Vendor Satisfaction</p>
            </div>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-[28px] bg-[#022B22] text-white border border-emerald-900 shadow-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#D4F63D] text-[#022B22] flex items-center justify-center shrink-0 font-extrabold">
              <Zap className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-extrabold font-display text-white">1 Unified Platform</div>
              <p className="text-xs text-slate-300 font-medium">Orders, Deliveries &amp; Payments</p>
            </div>
          </div>

        </div>

        {/* Interactive Vendor Desktop Dashboard Window Frame Mockup */}
        <div className="mb-16">
          <div className="text-center max-w-xl mx-auto mb-6">
            <span className="text-[11px] font-mono font-bold tracking-widest text-[#00875A] bg-emerald-100/80 border border-emerald-200 px-3 py-1 rounded-full uppercase">
              Cleclo Vendor Dashboard OS
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold font-display text-[#022B22] mt-2">
              Everything your laundry business needs on desktop &amp; mobile
            </h3>
          </div>

          <VendorDesktopVideo />
        </div>

        {/* Vendor Platform Interface Preview Card */}
        <div className="max-w-5xl mx-auto rounded-[36px] bg-[#022B22] border border-emerald-800/80 p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#00B074]/20 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-mono font-bold text-[#D4F63D] mb-4">
                <span>CLECLO VENDOR OS</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight text-white mb-4">
                Everything your laundry business needs to scale effortlessly.
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal mb-6">
                Connect your existing machines and store staff to Cleclo&apos;s intelligent vendor dashboard. Track customer pickups, order SOP stages, and automated payouts in real time.
              </p>
              
              <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-white">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D4F63D]" />
                  <span>Automated Dispatch</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D4F63D]" />
                  <span>Real-time GPS Tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D4F63D]" />
                  <span>Instant Weekly Payouts</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D4F63D]" />
                  <span>Digital Tagging &amp; SOPs</span>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-auto shrink-0 flex flex-col items-center text-center p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="w-16 h-16 rounded-2xl bg-[#D4F63D] text-[#022B22] flex items-center justify-center font-black text-2xl mb-3 shadow-lg">
                🚀
              </div>
              <span className="text-lg font-bold text-white mb-1">Ready to Partner?</span>
              <p className="text-xs text-slate-300 mb-4 max-w-[200px]">Join India&apos;s fastest growing laundry partner network.</p>
              
              <Link
                href={signupUrl}
                className="inline-flex items-center gap-2 bg-[#D4F63D] hover:bg-[#c5ea2c] text-[#022B22] font-extrabold text-xs px-6 py-3 rounded-full transition-all shadow-md"
              >
                <span>See How Cleclo Works</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
