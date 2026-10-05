"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  PackageCheck,
  TrendingUp,
  MapPin,
  CreditCard,
  Settings,
  Bell,
  Search,
  CheckCircle2,
  Clock,
  Navigation,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  ChevronRight,
  UserCheck,
} from "lucide-react";

export default function VendorDesktopFrame() {
  const [activeTab, setActiveTab] = useState<"orders" | "analytics" | "payouts">("orders");

  return (
    <div className="w-full max-w-5xl mx-auto rounded-2xl sm:rounded-[28px] bg-[#0A1A15] border border-emerald-800/60 shadow-[0_20px_60px_rgba(2,43,34,0.35)] overflow-hidden transition-all duration-300">
      
      {/* ========================================================================= */}
      {/* 1. BROWSER WINDOW HEADER BAR */}
      {/* ========================================================================= */}
      <div className="bg-[#021F18] px-4 py-3 border-b border-emerald-900/80 flex items-center justify-between gap-4">
        
        {/* Window Control Buttons & App Title */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/90 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/90 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/90 inline-block"></span>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-emerald-400/90 bg-emerald-950/80 px-2.5 py-0.5 rounded-md border border-emerald-800/60">
            <ShieldCheck className="w-3 h-3 text-[#D4F63D]" />
            <span>Cleclo Vendor OS v2.4</span>
          </span>
        </div>

        {/* Address Bar */}
        <div className="flex-1 max-w-md bg-[#0A261E] border border-emerald-800/60 rounded-lg px-3 py-1 flex items-center justify-between text-xs text-slate-300 font-mono">
          <div className="flex items-center gap-2 truncate">
            <span className="text-emerald-400">🔒</span>
            <span className="text-slate-200 font-bold truncate">https://vendor.cleclo.in/dashboard</span>
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-[#D4F63D] px-1.5 py-0.5 rounded font-bold uppercase shrink-0">
            Live
          </span>
        </div>

        {/* Top Status */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#D4F63D] animate-pulse"></span>
            <span className="hidden md:inline text-[11px] text-emerald-300">Hub: South Delhi #14</span>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. DASHBOARD BODY GRID */}
      {/* ========================================================================= */}
      <div className="flex flex-col lg:flex-row min-h-[460px] text-slate-200">
        
        {/* Left Sidebar */}
        <div className="w-full lg:w-56 bg-[#04241C] border-b lg:border-b-0 lg:border-r border-emerald-900/60 p-4 shrink-0 flex flex-col justify-between">
          <div className="space-y-4">
            
            {/* Store Name Badge */}
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800/60 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#D4F63D] text-[#022B22] font-black text-xs flex items-center justify-center shrink-0">
                CL
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-white truncate font-display">Royal Eco Cleaners</div>
                <div className="text-[10px] text-emerald-400 font-mono">Partner ID: #V-8924</div>
              </div>
            </div>

            {/* Sidebar Navigation */}
            <nav className="space-y-1 font-semibold text-xs">
              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                  activeTab === "orders"
                    ? "bg-[#D4F63D] text-[#022B22] font-extrabold shadow-md"
                    : "text-slate-300 hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Live Orders</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  activeTab === "orders" ? "bg-[#022B22] text-[#D4F63D]" : "bg-emerald-900 text-emerald-300"
                }`}>
                  14
                </span>
              </button>

              <button
                onClick={() => setActiveTab("analytics")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                  activeTab === "analytics"
                    ? "bg-[#D4F63D] text-[#022B22] font-extrabold shadow-md"
                    : "text-slate-300 hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <TrendingUp className="w-4 h-4" />
                  <span>Analytics &amp; SOP</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("payouts")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                  activeTab === "payouts"
                    ? "bg-[#D4F63D] text-[#022B22] font-extrabold shadow-md"
                    : "text-slate-300 hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4" />
                  <span>Weekly Payouts</span>
                </div>
                <span className="text-[10px] text-emerald-400">₹1.48L</span>
              </button>
            </nav>

          </div>

          {/* Bottom Quality Status */}
          <div className="pt-4 border-t border-emerald-900/60 hidden lg:block">
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-bold mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#D4F63D]" />
              <span>48-Point Quality Verified</span>
            </div>
            <p className="text-[10px] text-slate-400">Hydrocarbon &amp; Eco-Press Active</p>
          </div>
        </div>

        {/* Main Dashboard Panel */}
        <div className="flex-1 p-4 sm:p-6 space-y-5 bg-[#031D16]/90">
          
          {/* Top Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Today&apos;s Orders</span>
              <div className="text-xl sm:text-2xl font-black text-white font-display mt-0.5">42 Orders</div>
              <span className="text-[10px] text-emerald-400 font-semibold">↑ +18% vs yesterday</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">In-Processing</span>
              <div className="text-xl sm:text-2xl font-black text-[#D4F63D] font-display mt-0.5">16 Items</div>
              <span className="text-[10px] text-slate-300">Hydrocarbon Wash</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Out For Delivery</span>
              <div className="text-xl sm:text-2xl font-black text-sky-400 font-display mt-0.5">8 Orders</div>
              <span className="text-[10px] text-sky-300 font-semibold">GPS Active</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">This Week Payout</span>
              <div className="text-xl sm:text-2xl font-black text-emerald-300 font-display mt-0.5">₹84,500</div>
              <span className="text-[10px] text-emerald-400 font-semibold">Instant Settlement</span>
            </div>
          </div>

          {/* Live Orders Table */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D4F63D] animate-pulse"></span>
                <h4 className="text-xs sm:text-sm font-extrabold text-white font-display">Live Order Feed (Real-Time)</h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-md border border-emerald-800">
                Auto Dispatch ON
              </span>
            </div>

            {/* Table Rows */}
            <div className="space-y-2 text-xs">
              
              {/* Row 1 */}
              <div className="p-3 rounded-xl bg-black/30 border border-white/5 flex flex-wrap items-center justify-between gap-2 hover:border-emerald-500/40 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-[#D4F63D] bg-white/10 px-2 py-0.5 rounded font-bold">#ORD-8942</span>
                  <div>
                    <div className="font-bold text-white text-xs">3 Suit Jackets · Dry Clean</div>
                    <div className="text-[10px] text-slate-400">Customer: Ankit M. · Greater Kailash</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-700/60">
                    In Solvent Press
                  </span>
                  <span className="text-[10px] text-slate-300 font-mono">Driver Assigned ✓</span>
                </div>
              </div>

              {/* Row 2 */}
              <div className="p-3 rounded-xl bg-black/30 border border-white/5 flex flex-wrap items-center justify-between gap-2 hover:border-emerald-500/40 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-[#D4F63D] bg-white/10 px-2 py-0.5 rounded font-bold">#ORD-8941</span>
                  <div>
                    <div className="font-bold text-white text-xs">2 Silk Dresses · Wet Care</div>
                    <div className="text-[10px] text-slate-400">Customer: Priyanka S. · Vasant Vihar</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-sky-300 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-700/60">
                    Tag Verified
                  </span>
                  <span className="text-[10px] text-slate-300 font-mono">Barcode Logged ✓</span>
                </div>
              </div>

              {/* Row 3 */}
              <div className="p-3 rounded-xl bg-black/30 border border-white/5 flex flex-wrap items-center justify-between gap-2 hover:border-emerald-500/40 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-[#D4F63D] bg-white/10 px-2 py-0.5 rounded font-bold">#ORD-8940</span>
                  <div>
                    <div className="font-bold text-white text-xs">5 Linen Shirts · Steam Press</div>
                    <div className="text-[10px] text-slate-400">Customer: Kabir R. · Saket</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700/60">
                    Ready For Delivery
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">EV Van Out 🚚</span>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Live GPS & Payout Banner inside Desktop mockup */}
          <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-[#D4F63D]" />
              <span className="text-slate-200 font-semibold">Live GPS Dispatch Active across 14 Delhi Outlets</span>
            </div>
            <span className="text-[10px] font-bold text-[#D4F63D] bg-white/10 px-2.5 py-1 rounded-md">
              Cleclo Unified OS
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
