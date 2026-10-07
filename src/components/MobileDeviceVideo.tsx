"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Navigation,
  Shirt,
  Bike,
  PackageCheck,
  ChevronRight,
} from "lucide-react";

export default function MobileDeviceVideo() {
  // Check if a video file is available (e.g. /mobile-video.mp4)
  const [hasVideo, setHasVideo] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "Order Placed",
      status: "Confirmed",
      desc: "Pickup scheduled for 10:30 AM",
      icon: Clock,
      badge: "Step 1 of 4",
      highlight: "South Delhi Area",
    },
    {
      title: "Pilot at Doorstep",
      status: "In Transit 🛵",
      desc: "Pilot Rajesh K. collected 6 garments",
      icon: Bike,
      badge: "Pickup Verified",
      highlight: "Barcode Tagged #CL-902",
    },
    {
      title: "Care & Hydrocarbon Wash",
      status: "Processing 🧺",
      desc: "Hospital-grade eco solvent dry cleaning",
      icon: Shirt,
      badge: "Quality Checked",
      highlight: "Certified Facility",
    },
    {
      title: "Delivered on Hanger",
      status: "72h SLA Met ⚡",
      desc: "Delivered in protective Cleclo eco-bag",
      icon: PackageCheck,
      badge: "Completed",
      highlight: "100% Quality Passed",
    },
  ];

  // Auto-cycle steps like an animated product video
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="relative w-full max-w-[420px] aspect-[9/16] sm:h-[580px] flex items-center justify-center">
      
      {/* 3D Realistic Soft Studio Shadow underneath */}
      <div className="absolute -bottom-8 w-3/4 h-12 bg-slate-900/20 rounded-full blur-2xl transform scale-y-50" />
      <div className="absolute -bottom-4 w-1/2 h-8 bg-emerald-950/25 rounded-full blur-xl transform scale-y-50" />

      {/* 3D Floating Isometric Phone Chassis (Pine Labs Reference Angle) */}
      <div
        className="relative w-[285px] sm:w-[305px] h-[550px] sm:h-[570px] rounded-[48px] p-3 shadow-[0_35px_80px_-15px_rgba(10,43,36,0.35),0_0_0_1px_rgba(10,43,36,0.08),inset_0_1px_2px_rgba(255,255,255,0.9)] bg-gradient-to-br from-[#E2EBE5] via-[#C5D8CD] to-[#99B6A3] transition-transform duration-700 ease-out hover:rotate-y-[-10deg] hover:rotate-x-[10deg] animate-float-slow"
        style={{
          transformStyle: "preserve-3d",
          transform: "perspective(1200px) rotateY(-14deg) rotateX(12deg) rotateZ(4deg)",
        }}
      >
        {/* Shiny Metallic Phone Edge Chamfer */}
        <div className="absolute inset-0 rounded-[48px] border-[3px] border-[#D4F63D]/40 pointer-events-none" />

        {/* Outer Bezel */}
        <div className="relative w-full h-full rounded-[40px] bg-slate-900 p-2.5 overflow-hidden flex flex-col shadow-inner">
          
          {/* Inner OLED Display Screen */}
          <div className="relative w-full h-full rounded-[32px] bg-[#FBFDFB] overflow-hidden flex flex-col text-[#0A261E]">
            
            {/* Dynamic Island / Speaker Notch */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30 flex items-center justify-end px-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            </div>

            {/* Video Player (If user places /mobile-video.mp4) or Interactive Video-Like Animated UI */}
            {hasVideo ? (
              <video
                src="/mobile-video.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex-1 flex flex-col pt-9 px-4 pb-4 bg-gradient-to-b from-[#F2F7F4] via-[#FFFFFF] to-[#F8FAF9]">
                
                {/* App Screen Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#0A2B24]/10 mb-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-lg bg-[#00875A] flex items-center justify-center text-[#D4F63D] text-[11px] font-bold">
                      C
                    </div>
                    <span className="font-extrabold text-xs tracking-tight text-[#0A2B24]">
                      cleclo
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-200">
                    Live SLA
                  </span>
                </div>

                {/* Animated Order Tracker Card */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#00875A] to-[#00B074] text-white shadow-lg mb-3.5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4F63D]/10 rounded-full blur-xl pointer-events-none" />
                  
                  <div className="flex items-center justify-between text-[11px] mb-1.5 text-slate-300">
                    <span>Order #CL-8921</span>
                    <span className="text-[#D4F63D] font-bold">72h Guaranteed</span>
                  </div>
                  
                  <h4 className="text-sm font-extrabold tracking-tight">
                    Standardised Care Cycle
                  </h4>

                  {/* Dynamic Milestone Progress */}
                  <div className="mt-3 flex items-center gap-1.5">
                    {steps.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                          i <= activeStep ? "bg-[#D4F63D]" : "bg-white/20"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Animated Dynamic Lifecycle Cards */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStep}
                      initial={{ opacity: 0, y: 12, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -12, scale: 0.96 }}
                      transition={{ duration: 0.35 }}
                      className="p-3.5 rounded-2xl bg-white border border-[#0A2B24]/10 shadow-[0_8px_20px_rgba(10,43,36,0.06)] flex flex-col justify-between h-[155px]"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/80 flex items-center justify-center">
                            {React.createElement(steps[activeStep].icon, {
                              className: "w-4.5 h-4.5",
                            })}
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                              {steps[activeStep].badge}
                            </span>
                            <h5 className="text-xs font-extrabold text-[#0A2B24]">
                              {steps[activeStep].title}
                            </h5>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-900 bg-[#D4F63D]/60 px-2 py-0.5 rounded-md">
                          {steps[activeStep].status}
                        </span>
                      </div>

                      <p className="text-[11px] text-[#0A2B24]/75 leading-relaxed font-normal">
                        {steps[activeStep].desc}
                      </p>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-500">
                        <span>{steps[activeStep].highlight}</span>
                        <span className="text-emerald-700 flex items-center gap-0.5">
                          Verified <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        </span>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Bottom Action Pill inside screen */}
                  <div className="p-2.5 rounded-xl bg-slate-100/90 border border-slate-200/80 flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-[#0A2B24]">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Certified Care Network</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800">
                      ₹ Standard Price
                    </span>
                  </div>
                </div>

              </div>
            )}

            {/* Glossy Screen Glare Reflection Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none" />

          </div>
        </div>

      </div>

    </div>
  );
}
