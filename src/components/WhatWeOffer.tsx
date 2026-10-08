"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import {
  Shirt,
  Wind,
  Check,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

export default function WhatWeOffer() {
  const downloadUrl = "#download";
  const containerRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Automatically update active service as the user scrolls down the page (3 services)
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (latest < 0.33) {
        setActiveTab(0);
      } else if (latest < 0.66) {
        setActiveTab(1);
      } else {
        setActiveTab(2);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Auto-scroll tab rail so active tab button is always visible on mobile
  useEffect(() => {
    const activeTabEl = tabRefs.current[activeTab];
    if (activeTabEl && tabsContainerRef.current) {
      activeTabEl.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeTab]);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    if (containerRef.current) {
      const containerTop = containerRef.current.offsetTop;
      const containerHeight = containerRef.current.offsetHeight;
      const targetScroll = containerTop + (index / 3) * containerHeight;
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
    }
  };

  const services = [
    {
      id: "dry-cleaning",
      number: "01",
      title: "Dry Cleaning",
      headline: "Precision Care for Every Garment",
      description:
        "From everyday essentials to delicate occasion wear, every garment is handled through fabric-specific care protocols designed for a consistently better finish.",
      cta: "Explore Dry Cleaning →",
      protocolLabel: "DRY CLEANING PROTOCOL",
      priceLabel: "View Rates →",
      icon: ShieldCheck,
      iconColor: "#00B074",
      options: [
        { name: "Suits & Tuxedos", desc: "Structured Garment Care", color: "bg-amber-100 text-amber-700" },
        { name: "Silk Sarees & Lehengas", desc: "Delicate Fabric Care", color: "bg-sky-100 text-sky-700" },
        { name: "Woollens & Outerwear", desc: "Specialised Fibre Care", color: "bg-purple-100 text-purple-700" },
      ],
    },
    {
      id: "washing",
      number: "02",
      title: "Washing",
      headline: "Freshness, Carefully Standardised.",
      description:
        "Everyday garments are sorted by fabric, colour and care requirement, then processed through controlled wash cycles for a clean, fresh and consistent finish.",
      cta: "Explore Washing →",
      protocolLabel: "WASH CARE PROTOCOL",
      priceLabel: "View Rates →",
      icon: Shirt,
      iconColor: "#0284C7",
      options: [
        { name: "Cotton Shirts & T-Shirts", desc: "Everyday Fabric Care", color: "bg-sky-100 text-sky-700" },
        { name: "Denims & Casual Wear", desc: "Colour & Fibre Care", color: "bg-indigo-100 text-indigo-700" },
        { name: "Activewear & Sportswear", desc: "Performance Fabric Care", color: "bg-amber-100 text-amber-700" },
        { name: "Bed Linen & Covers", desc: "Freshness & Hygiene Care", color: "bg-[#00B074]/10 text-[#00875A]" },
      ],
    },
    {
      id: "steam-ironing",
      number: "03",
      title: "Steam Ironing",
      headline: "A Better Finish, Every Time.",
      description:
        "Professional steam finishing that helps restore crispness, shape and presentation — with temperature-controlled care suited to the garment.",
      cta: "Explore Steam Ironing →",
      protocolLabel: "STEAM FINISH PROTOCOL",
      priceLabel: "View Rates →",
      icon: Wind,
      iconColor: "#EAB308",
      options: [
        { name: "Formal Shirts", desc: "Crisp Collar & Cuff Finish", color: "bg-amber-100 text-amber-700" },
        { name: "Trousers & Creases", desc: "Sharp, Defined Finish", color: "bg-emerald-100 text-emerald-700" },
        { name: "Kurtas & Jackets", desc: "Shape & Structure Care", color: "bg-sky-100 text-sky-700" },
        { name: "Occasion Wear", desc: "Delicate Finishing", color: "bg-purple-100 text-purple-700" },
      ],
    },
  ];

  const currentService = services[activeTab];

  return (
    <section
      ref={containerRef}
      id="services"
      className="relative bg-white min-h-[220vh] lg:min-h-[260vh] pb-8 lg:pb-16"
    >
      {/* Sticky Container for Sticky Scroll Experience with Generous Bottom Padding */}
      <div className="sticky top-8 lg:top-12 h-[calc(100vh-3rem)] sm:h-[calc(100vh-4rem)] flex flex-col justify-between py-4 sm:py-6 pb-8 sm:pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header & Navigation Tabs */}
        <div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4 sm:mb-6">
            <div>
              {/* Eyebrow badge matching banner style */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50/90 border border-emerald-200/70 mb-3 max-w-full">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse shrink-0"></span>
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-900 leading-snug">
                  WHAT WE OFFER
                </span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold text-[#022B22] tracking-tight leading-[1.15]">
                One app, every <span className="text-[#00875A]">garment care service</span>
              </h2>
            </div>

            {/* Step Counter Indicator */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-extrabold text-[#00B074] bg-[#00B074]/10 px-3 py-1 rounded-full border border-[#00B074]/20">
                0{activeTab + 1} / 03
              </span>
              <span className="text-xs text-[#0A2B24]/50 font-medium hidden sm:inline">
                (Scroll to switch services)
              </span>
            </div>
          </div>

          {/* Clean Pill Tabs for Manual Selection (With Smooth Auto-Scroll) */}
          <div
            ref={tabsContainerRef}
            className="flex items-center gap-2 overflow-x-auto pb-2.5 scrollbar-none border-b border-slate-100"
          >
            {services.map((service, idx) => {
              const isActive = activeTab === idx;
              return (
                <button
                  key={service.id}
                  ref={(el) => { tabRefs.current[idx] = el; }}
                  onClick={() => handleTabClick(idx)}
                  className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 whitespace-nowrap shrink-0 border select-none ${
                    isActive
                      ? "bg-[#0A2B24] text-white border-[#0A2B24] shadow-sm"
                      : "bg-[#F5F6F5] text-[#0A2B24]/70 border-transparent hover:bg-slate-200/70 hover:text-[#0A2B24]"
                  }`}
                >
                  {service.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-16 items-center my-auto py-1 sm:py-4">
          
          {/* LEFT: Clean Soft Backdrop + Floating App Screen + Official Cleclo Logo */}
          <div className="lg:col-span-6 relative">
            <div className="bg-[#F3F4F3] rounded-[24px] sm:rounded-[40px] p-3 sm:p-8 relative overflow-hidden flex items-center justify-center min-h-[260px] xs:min-h-[290px] sm:min-h-[450px]">
              
              {/* Floating App Screen Card */}
              <div className="w-full max-w-[240px] xs:max-w-[270px] sm:max-w-[330px] bg-white rounded-[20px] sm:rounded-[28px] p-3.5 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-100/80 relative z-10">
                
                {/* Official Cleclo Logo at Top (Positioned cleanly without overlap) */}
                <div className="flex justify-center mb-1.5 sm:mb-2 pt-0.5">
                  <Image
                    src="/cleclo-logo.png"
                    alt="Cleclo Logo"
                    width={130}
                    height={32}
                    priority
                    className="h-6 sm:h-9 w-auto object-contain"
                  />
                </div>

                <p className="text-[8px] sm:text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase text-center mb-2.5 sm:mb-4">
                  {currentService.protocolLabel}
                </p>

                {/* Dynamic Item Options List */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentService.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-1.5 sm:space-y-2.5 mb-2.5 sm:mb-4"
                  >
                    {currentService.options.map((opt, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 sm:p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-100"
                      >
                        <div className="flex items-center gap-2 sm:gap-2.5">
                          <div className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full ${opt.color.split(" ")[0]} flex items-center justify-center shrink-0 mt-0.5`}>
                            <Check className="w-2 h-2 sm:w-2.5 sm:h-2.5 stroke-[3]" />
                          </div>
                          <div className="flex flex-col text-left">
                            <span className="text-[10px] sm:text-xs font-bold text-[#0A2B24] leading-tight">
                              {opt.name}
                            </span>
                            {opt.desc && (
                              <span className="text-[8px] sm:text-[10px] font-medium text-slate-400 leading-tight mt-0.5">
                                {opt.desc}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>

              </div>

              {/* Floating Verified Badge (Shifted to prevent logo overlap on mobile) */}
              <motion.div
                key={`badge-${currentService.id}`}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute top-2 right-2 xs:top-3 xs:right-3 sm:top-6 sm:right-6 z-20 bg-white rounded-xl sm:rounded-2xl p-2 sm:p-4 shadow-[0_12px_28px_rgba(0,0,0,0.06)] border border-slate-100 flex flex-col items-center justify-center text-center w-20 xs:w-24 sm:w-32"
              >
                <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-[#00B074] text-white flex items-center justify-center mb-1 sm:mb-1.5 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 sm:w-6 sm:h-6 stroke-[2.5]" />
                </div>
                <p className="text-[9px] sm:text-xs font-extrabold text-[#0A2B24] leading-tight uppercase">
                  72H STANDARD
                </p>
                <p className="text-[8px] sm:text-[10px] font-bold text-[#00875A] mt-0.5">
                  Verified Care
                </p>
              </motion.div>

              {/* Dark Teal Bottom Booking Pill */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:left-8 sm:right-8 z-20 bg-[#024B3C] text-white rounded-xl sm:rounded-2xl p-2.5 px-3.5 sm:p-3.5 sm:px-6 flex items-center justify-between shadow-lg">
                <span className="text-[11px] sm:text-sm font-extrabold tracking-wide">
                  Book {currentService.title}
                </span>
                <span className="text-[11px] sm:text-sm font-bold text-[#D4F63D]">
                  {currentService.priceLabel}
                </span>
              </div>

            </div>
          </div>

          {/* RIGHT: Text Content with Smooth Transition */}
          <div className="lg:col-span-6 flex flex-col items-start justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentService.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-2 sm:space-y-5"
              >
                {/* Icon Badge */}
                <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#00B074]/10 text-[#00875A] flex items-center justify-center shrink-0">
                  {React.createElement(currentService.icon, { className: "w-4 h-4 sm:w-6 sm:h-6 stroke-[2.2]" })}
                </div>

                {/* Service Title */}
                <h3 className="text-xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A2B24] tracking-tight leading-tight">
                  {currentService.title}
                </h3>

                {/* Subtitle Headline */}
                <p className="text-xs sm:text-lg font-bold text-[#0A2B24] leading-snug">
                  {currentService.headline}
                </p>

                {/* Exact Description Provided by User */}
                <p className="text-xs sm:text-base text-[#0A2B24]/75 font-normal leading-relaxed max-w-lg">
                  {currentService.description}
                </p>

                {/* Lime Green Button */}
                <div className="pt-1 sm:pt-2">
                  <Link
                    href={downloadUrl}
                    className="inline-flex items-center justify-center bg-[#D4F63D] hover:bg-[#c5ea2c] text-[#0A2B24] font-extrabold text-xs sm:text-base px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-full transition-all duration-200 shadow-[0_4px_14px_rgba(212,246,61,0.35)] hover:shadow-[0_6px_20px_rgba(212,246,61,0.5)] active:scale-95"
                  >
                    {currentService.cta}
                  </Link>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
