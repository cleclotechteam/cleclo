"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { RefreshCw, Leaf, Zap, ArrowRight, CheckCircle2 } from "lucide-react";

// Individual Word Scroll Illuminator Component for Desktop
function WordIlluminator({
  word,
  index,
  totalWords,
  progress,
  startPoint = 0.05,
  endPoint = 0.45,
  accentColor,
}: {
  word: string;
  index: number;
  totalWords: number;
  progress: MotionValue<number>;
  startPoint?: number;
  endPoint?: number;
  accentColor?: string;
}) {
  const step = (endPoint - startPoint) / totalWords;
  const wordStart = startPoint + index * step;
  const wordEnd = wordStart + step * 1.5;

  const color = useTransform(
    progress,
    [wordStart, wordEnd],
    [
      "rgba(255, 255, 255, 0.22)",
      accentColor || "rgba(255, 255, 255, 1.0)",
    ]
  );

  return (
    <motion.span style={{ color }} className="inline-block mr-[0.28em]">
      {word}
    </motion.span>
  );
}

function ScrollTextReveal({
  text,
  progress,
  className = "",
  startPoint = 0.05,
  endPoint = 0.45,
  accentWords = [],
  accentColor = "#D4F63D",
}: {
  text: string;
  progress: MotionValue<number>;
  className?: string;
  startPoint?: number;
  endPoint?: number;
  accentWords?: string[];
  accentColor?: string;
}) {
  const words = text.split(" ");

  return (
    <span className={className}>
      {words.map((word, i) => {
        const isAccent = accentWords.some((aw) =>
          word.toLowerCase().includes(aw.toLowerCase())
        );

        return (
          <WordIlluminator
            key={i}
            word={word}
            index={i}
            totalWords={words.length}
            progress={progress}
            startPoint={startPoint}
            endPoint={endPoint}
            accentColor={isAccent ? accentColor : "rgba(255, 255, 255, 1.0)"}
          />
        );
      })}
    </span>
  );
}

export default function VendorSustainability() {
  const signupUrl = "#signup";
  const [activeCard, setActiveCard] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start 85%", "end 45%"],
  });

  const headlineText = "Better for your facility. Better for the environment.";
  const descText =
    "Cleclo empowers vendor partners with advanced solvent recovery processes, zero single-use plastic compostable packaging, and EV delivery fleets to build a more thoughtful standard for fabric care across India.";

  const pillars = [
    {
      number: "01",
      category: "Hydrocarbon Solvent Care",
      title: "Solvent Recovery & Eco-SOPs",
      description:
        "Our closed-loop Hydrocarbon recovery systems help vendor facilities minimize chemical discharge, reduce waste, and extend fabric life.",
      icon: RefreshCw,
      badge: "Closed-Loop Solvent Care",
    },
    {
      number: "02",
      category: "Better Packaging",
      title: "Zero Single-Use Plastic",
      description:
        "We supply vendor partners with biodegradable garment covers and reusable pickup bags to protect clothes responsibly.",
      icon: Leaf,
      badge: "Compostable Covers",
    },
    {
      number: "03",
      category: "Cleaner Logistics",
      title: "Zero-Emission EV Logistics",
      description:
        "Electric delivery vehicles streamline doorstep pickup and return logistics between customers and certified vendor hubs.",
      icon: Zap,
      badge: "EV Delivery Fleet",
    },
  ];

  return (
    <section
      ref={containerRef}
      id="sustainability"
      className="py-16 sm:py-24 lg:py-32 bg-[#022B22] text-white relative overflow-hidden"
    >
      {/* Subtle Ambient Radial Lighting */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#00B074]/15 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-[#D4F63D]/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Tactile background grid matrix */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1.2px, transparent 1.2px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Mobile View: Static Solid White Text */}
        <div className="block lg:hidden max-w-4xl mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 mb-4 sm:mb-6">
            <span className="w-2 h-2 rounded-full bg-[#D4F63D] animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-widest text-[#D4F63D] uppercase">
              ECO VENDOR STANDARDS
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-[1.15] mb-4 sm:mb-6 font-display text-white">
            Better for your facility. <span className="text-[#D4F63D]">Better for the environment.</span>
          </h2>

          <p className="text-xs sm:text-lg font-normal leading-relaxed text-slate-100 max-w-3xl">
            {descText}
          </p>
        </div>

        {/* Laptop & Desktop View: Cinematic Scroll Illumination Effect */}
        <div ref={headerRef} className="hidden lg:block max-w-4xl mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#D4F63D] animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-widest text-[#D4F63D] uppercase">
              ECO VENDOR STANDARDS
            </span>
          </div>

          <h2 className="text-6xl font-extrabold tracking-tight leading-[1.15] mb-6 font-display">
            <ScrollTextReveal
              text={headlineText}
              progress={scrollYProgress}
              startPoint={0.0}
              endPoint={0.45}
              accentWords={["environment."]}
              accentColor="#D4F63D"
            />
          </h2>

          <p className="text-xl font-normal leading-relaxed max-w-3xl">
            <ScrollTextReveal
              text={descText}
              progress={scrollYProgress}
              startPoint={0.35}
              endPoint={0.95}
              accentColor="#FFFFFF"
            />
          </p>
        </div>

        {/* 3 Pillar Cards - Mobile Horizontal Scroll Rail / Desktop Grid */}
        <div className="flex sm:grid sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 pb-4 sm:pb-0 mb-6 sm:mb-16">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            const isActive = activeCard === idx;
            return (
              <div
                key={pillar.number}
                onClick={() => setActiveCard(idx)}
                onMouseEnter={() => setActiveCard(idx)}
                className={`w-[80vw] max-w-[285px] sm:w-full sm:max-w-none shrink-0 sm:shrink snap-center group relative p-6 sm:p-8 rounded-[28px] sm:rounded-[32px] border backdrop-blur-md transition-all duration-300 flex flex-col justify-between cursor-pointer select-none min-h-[300px] ${
                  isActive
                    ? "bg-white/10 border-[#D4F63D] shadow-[0_12px_32px_rgba(212,246,61,0.15)] -translate-y-1"
                    : "bg-white/5 border-white/10 hover:border-[#D4F63D]/40"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#00B074]/20 border border-[#00B074]/30 text-[#D4F63D] flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      <Icon className="w-6 h-6 stroke-[2.2]" />
                    </div>

                    <span className="text-xs font-mono font-bold tracking-widest text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                      {pillar.number}
                    </span>
                  </div>

                  <span className="inline-block text-[10px] font-mono font-bold tracking-widest text-[#D4F63D] uppercase px-2.5 py-1 rounded-md bg-white/10 border border-white/15 mb-3">
                    {pillar.category}
                  </span>

                  <h3 className="text-lg sm:text-2xl font-extrabold text-white tracking-tight mb-3 group-hover:text-[#D4F63D] transition-colors font-display">
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-8 pt-5 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400">
                    {pillar.badge}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-[#D4F63D]" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Rail Indicator Dots */}
        <div className="flex items-center justify-center gap-1.5 sm:hidden mb-8">
          {pillars.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCard(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeCard === idx
                  ? "w-6 bg-[#D4F63D]"
                  : "w-1.5 bg-white/20"
              }`}
              aria-label={`Go to pillar ${idx + 1}`}
            />
          ))}
        </div>

        {/* Bottom Banner Callout */}
        <div className="p-6 sm:p-10 rounded-[28px] sm:rounded-[32px] bg-gradient-to-r from-white/10 via-white/5 to-white/10 border border-white/15 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#D4F63D] text-[#022B22] flex items-center justify-center shrink-0 shadow-md font-extrabold text-xl">
              ✓
            </div>
            <div className="text-left">
              <p className="font-extrabold text-sm sm:text-xl text-white">
                Empower your facility with eco-friendly dry cleaning standards.
              </p>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Hydrocarbon recovery, compostable covers &amp; zero single-use plastic.
              </p>
            </div>
          </div>

          <Link
            href={signupUrl}
            className="w-full md:w-auto shrink-0 inline-flex items-center justify-center gap-2.5 bg-[#D4F63D] hover:bg-[#c5ea2c] text-[#022B22] font-extrabold text-xs sm:text-sm px-8 py-4 rounded-full transition-all duration-300 shadow-[0_4px_16px_rgba(212,246,61,0.35)] hover:shadow-[0_8px_24px_rgba(212,246,61,0.5)] hover:scale-105 active:scale-95"
          >
            <span>See How Cleclo Works</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
