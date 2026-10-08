"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  CheckCircle2,
  Navigation,
  CreditCard,
  Cpu,
  Play,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

export default function VendorDesktopVideo() {
  // Check if an MP4 video file exists at /vendor-video.mp4
  const [hasVideo, setHasVideo] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    fetch("/vendor-video.mp4", { method: "HEAD" })
      .then((res) => {
        if (res.ok) setHasVideo(true);
      })
      .catch(() => {});
  }, []);

  const scenes = [
    {
      stepLabel: "AUTO DISPATCH",
      title: "1. Automated Customer Order Dispatch",
      subtitle: "New Pickup Request Received from South Delhi",
      desc: "Order #ORD-8942 automatically assigned to your vendor dashboard. 3 Suit Jackets & 2 Silk Dresses logged with fixed rate pricing.",
      icon: Cpu,
      pill: "Order Auto-Accepted ✓",
      metric: "42 Orders Today",
      stat: "+18% Daily Growth",
      bgPill: "bg-emerald-100 text-[#00875A] border-emerald-200",
    },
    {
      stepLabel: "DIGITAL TAGGING",
      title: "2. Barcode Tagging & SOP Care",
      subtitle: "48-Point Standard Quality Inspection",
      desc: "Garments scanned into Eco Solvent Hydrocarbon washer. Digital SOP protocol verified with zero fabric mix-ups.",
      icon: ShieldCheck,
      pill: "Tag #CL-902 Verified",
      metric: "16 Items In Wash",
      stat: "Zero Defect Guarantee",
      bgPill: "bg-purple-100 text-purple-800 border-purple-200",
    },
    {
      stepLabel: "GPS TRACKING",
      title: "3. Real-Time Doorstep Delivery",
      subtitle: "EV Van En Route to Customer Location",
      desc: "Live GPS milestone tracking updated for customer. Pickup to delivery SLA guaranteed within 72 hours.",
      icon: Navigation,
      pill: "EV Fleet Out 🚚",
      metric: "8 Shipments Active",
      stat: "Live GPS Door to Door",
      bgPill: "bg-sky-100 text-sky-800 border-sky-200",
    },
    {
      stepLabel: "WEEKLY PAYOUT",
      title: "4. Automated Bank Settlement",
      subtitle: "Weekly Revenue Auto-Deposited",
      desc: "₹1,48,250 transferred directly into your bank account. Zero hidden charges, 100% transparent rate card.",
      icon: CreditCard,
      pill: "Payout Settled ₹",
      metric: "₹1,48,250 Settled",
      stat: "Instant Bank Transfer",
      bgPill: "bg-amber-100 text-amber-900 border-amber-200",
    },
  ];

  // Auto-run video animation loop (cycles every 3.5 seconds automatically)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % scenes.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [scenes.length]);

  return (
    <div className="w-full max-w-5xl mx-auto rounded-2xl sm:rounded-[32px] bg-white border-2 border-slate-200/90 shadow-[0_20px_60px_rgba(0,0,0,0.06)] overflow-hidden transition-all duration-300 relative group">
      
      {/* ========================================================================= */}
      {/* BROWSER / VIDEO PLAYER HEADER BAR (LIGHT THEME) */}
      {/* ========================================================================= */}
      <div className="bg-slate-100/90 px-3 sm:px-4 py-3 border-b border-slate-200/80 flex items-center justify-between gap-2 sm:gap-4 z-20 relative">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 mr-1 sm:mr-2 shrink-0">
            <span className="w-3 h-3 rounded-full bg-rose-500/90 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/90 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/90 inline-block"></span>
          </div>

          <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono font-bold text-[#00875A] bg-emerald-50 px-2.5 sm:px-3 py-1 rounded-full border border-emerald-200/80 min-w-0">
            <span className="w-2 h-2 rounded-full bg-[#00875A] animate-pulse shrink-0"></span>
            <span className="truncate">CLECLO VENDOR OS<span className="hidden sm:inline"> DEMO VIDEO</span></span>
          </span>
        </div>

        {/* Video Auto-Play Badge */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase font-mono tracking-wider bg-[#022B22] text-[#D4F63D] px-3 py-1 rounded-full shadow-sm">
            <Play className="w-3 h-3 fill-current" />
            <span>Auto Playing Video</span>
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIDEO CONTAINER (PURE WHITE BACKGROUND) */}
      {/* ========================================================================= */}
      <div className="relative min-h-[460px] sm:min-h-[500px] flex flex-col justify-between p-4 sm:p-10 bg-white text-[#022B22] overflow-hidden">
        
        {/* If MP4 video exists, play HTML5 Video */}
        {hasVideo ? (
          <video
            src="/vendor-video.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <>
            {/* Automatic Dynamic Video Scene UI Animation Engine */}
            <div className="relative z-10">
              
              {/* Top Scene Stage Indicators (Video Progress Bar) */}
              <div className="flex items-center gap-1.5 sm:gap-2 mb-6 sm:mb-8">
                {scenes.map((scene, idx) => (
                  <div key={idx} className="flex-1 flex flex-col gap-1.5">
                    <div className="h-2 rounded-full bg-slate-100 border border-slate-200 overflow-hidden relative">
                      {idx < activeStep && (
                        <div className="h-full w-full bg-[#00875A]" />
                      )}
                      {idx === activeStep && (
                        <motion.div
                          className="h-full bg-[#00875A]"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 3.5, ease: "linear" }}
                        />
                      )}
                    </div>
                    <span className={`hidden sm:block text-[10px] font-mono font-bold tracking-wider uppercase transition-colors ${
                      idx === activeStep ? "text-[#00875A]" : "text-slate-400"
                    }`}>
                      {scene.stepLabel}
                    </span>
                  </div>
                ))}
              </div>

              {/* Main Animated Video Scene Slide */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -16, scale: 0.98 }}
                  transition={{ duration: 0.35 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-center min-h-[470px] sm:min-h-0"
                >
                  {/* Left Column: Scene Text Info */}
                  <div className="lg:col-span-7 space-y-3 sm:space-y-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-mono font-bold uppercase tracking-wider bg-emerald-50 border-emerald-200/80 text-[#00875A]">
                      <span>SCENE 0{activeStep + 1} OF 04</span>
                    </div>

                    <h3 className="text-xl sm:text-4xl font-extrabold font-display text-[#022B22] tracking-tight leading-tight">
                      {scenes[activeStep].title}
                    </h3>

                    <p className="text-sm sm:text-base font-bold text-[#00875A]">
                      {scenes[activeStep].subtitle}
                    </p>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-xl">
                      {scenes[activeStep].desc}
                    </p>

                    <div className="pt-3 flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase font-mono border ${scenes[activeStep].bgPill}`}>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{scenes[activeStep].pill}</span>
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Live Mockup Feature Display Card */}
                  <div className="lg:col-span-5 flex justify-center">
                    <div className="w-full max-w-md p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#022B22] text-white border border-emerald-900 shadow-2xl flex flex-col justify-between h-[190px] sm:h-[230px] relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4F63D]/10 rounded-full blur-2xl pointer-events-none" />

                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-[#D4F63D] text-[#022B22] flex items-center justify-center font-black shadow-lg">
                          {React.createElement(scenes[activeStep].icon, { className: "w-6 h-6 stroke-[2.5]" })}
                        </div>
                        <span className="text-[10px] font-mono font-bold text-slate-300 bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
                          Live OS Video Feed
                        </span>
                      </div>

                      <div>
                        <div className="text-2xl sm:text-3xl font-black font-display text-white mb-1">
                          {scenes[activeStep].metric}
                        </div>
                        <p className="text-xs font-semibold text-[#D4F63D]">
                          {scenes[activeStep].stat}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300 font-mono">
                        <span>Cleclo Vendor Partner OS</span>
                        <span className="text-[#D4F63D]">Verified ✓</span>
                      </div>
                    </div>
                  </div>

                </motion.div>
              </AnimatePresence>

            </div>

            {/* Bottom Video Controls & Info Bar */}
            <div className="relative z-10 pt-5 sm:pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 sm:mt-8">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveStep((prev) => (prev - 1 + scenes.length) % scenes.length)}
                  className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1"
                  aria-label="Previous scene"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Prev Scene
                </button>
                <button
                  onClick={() => setActiveStep((prev) => (prev + 1) % scenes.length)}
                  className="px-4 py-2 rounded-full bg-[#022B22] hover:bg-[#11231B] text-white text-xs font-extrabold transition-all hover:scale-105 flex items-center gap-1 shadow-md"
                  aria-label="Next scene"
                >
                  Next Scene <ChevronRight className="w-3.5 h-3.5 text-[#D4F63D]" />
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-mono">
                <span className="w-2 h-2 rounded-full bg-[#00875A] animate-pulse" />
                <span>Running Automatically · Click scenes to jump</span>
              </div>
            </div>
          </>
        )}

      </div>

    </div>
  );
}
