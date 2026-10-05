"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import {
  RefreshCw,
  Leaf,
  Zap,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

// Individual Word Scroll Illuminator Component
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

// Scroll Text Reveal helper that illuminates words sequentially into bright white on scroll
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

export default function Sustainability() {
  const downloadUrl = "#download";
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start 85%", "end 45%"],
  });

  const headlineText = "Better for your clothes. Better for the world.";
  const descText =
    "Better garment care should also mean making more responsible choices for the world around us. From the way we clean and recover solvents to how we package and deliver, Cleclo is building a more thoughtful standard for dry cleaning.";

  const pillars = [
    {
      number: "01",
      category: "Responsible Cleaning",
      title: "Hydrocarbon & Wet Cleaning Systems",
      description:
        "Our Hydrocarbon and Wet Cleaning systems are designed for effective, fabric-appropriate care. Solvent recovery and recycling processes help minimise waste and reduce discharge into the environment.",
      icon: RefreshCw,
      badge: "Solvent Recovery & Eco-SOPs",
    },
    {
      number: "02",
      category: "Better Packaging",
      title: "Biodegradable & Compostable",
      description:
        "We use biodegradable and compostable packaging alternatives to reduce dependence on conventional single-use plastic.",
      icon: Leaf,
      badge: "Zero Single-Use Plastic",
    },
    {
      number: "03",
      category: "Cleaner Deliveries",
      title: "Electric Mobility",
      description:
        "Electric vehicles for pickup and delivery help reduce emissions across the Cleclo journey.",
      icon: Zap,
      badge: "Zero-Emission Fleet",
    },
  ];

  return (
    <section
      ref={containerRef}
      id="sustainability"
      className="py-24 lg:py-32 bg-[#022B22] text-white relative overflow-hidden"
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
        
        {/* Mobile View: Static Solid White Text (No scroll dimming delay on mobile screens) */}
        <div className="block lg:hidden max-w-4xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#D4F63D] animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-widest text-[#D4F63D] uppercase">
              Sustainability
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-[1.15] mb-6 font-display text-white">
            Better for your clothes. <span className="text-[#D4F63D]">Better for the world.</span>
          </h2>

          <p className="text-base sm:text-lg font-normal leading-relaxed text-slate-100 max-w-3xl">
            {descText}
          </p>
        </div>

        {/* Laptop & Desktop View: Cinematic Scroll Illumination Effect */}
        <div ref={headerRef} className="hidden lg:block max-w-4xl mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#D4F63D] animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-widest text-[#D4F63D] uppercase">
              Sustainability
            </span>
          </div>

          <h2 className="text-6xl font-extrabold tracking-tight leading-[1.15] mb-6 font-display">
            <ScrollTextReveal
              text={headlineText}
              progress={scrollYProgress}
              startPoint={0.0}
              endPoint={0.45}
              accentWords={["world."]}
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

        {/* 3 Pillar Cards (Mobile Swipe Rail / Desktop Grid) */}
        <div className="flex sm:grid sm:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 pb-4 sm:pb-0 mb-16">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.number}
                className="w-[76vw] max-w-[275px] sm:w-full sm:max-w-none shrink-0 sm:shrink snap-center group relative p-7 sm:p-8 rounded-[32px] bg-white/5 border border-white/10 hover:border-[#D4F63D]/40 backdrop-blur-md transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5"
              >
                <div>
                  {/* Top Icon & Number Row */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#00B074]/20 border border-[#00B074]/30 text-[#D4F63D] flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      <Icon className="w-6 h-6 stroke-[2.2]" />
                    </div>

                    <span className="text-xs font-mono font-bold tracking-widest text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                      {pillar.number}
                    </span>
                  </div>

                  {/* Category Pill */}
                  <span className="inline-block text-[10px] font-mono font-bold tracking-widest text-[#D4F63D] uppercase px-2.5 py-1 rounded-md bg-white/10 border border-white/15 mb-3">
                    {pillar.category}
                  </span>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-3 group-hover:text-[#D4F63D] transition-colors">
                    {pillar.title}
                  </h3>

                  {/* Description (Exact user copy) */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    {pillar.description}
                  </p>
                </div>

                {/* Footer Badge */}
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

        {/* Bottom Banner Callout */}
        <div className="p-8 sm:p-10 rounded-[32px] bg-gradient-to-r from-white/10 via-white/5 to-white/10 border border-white/15 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#D4F63D] text-[#022B22] flex items-center justify-center shrink-0 shadow-md font-extrabold">
              ✓
            </div>
            <div>
              <p className="font-extrabold text-lg sm:text-xl text-white">
                A better clean shouldn’t come at a greater cost to the world around us.
              </p>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Thoughtful eco-cleaning, zero single-use plastics &amp; electric fleet delivery.
              </p>
            </div>
          </div>

          <Link
            href={downloadUrl}
            className="shrink-0 inline-flex items-center gap-2.5 bg-[#D4F63D] hover:bg-[#c5ea2c] text-[#022B22] font-extrabold text-xs sm:text-sm px-8 py-4 rounded-full transition-all duration-300 shadow-[0_4px_16px_rgba(212,246,61,0.35)] hover:shadow-[0_8px_24px_rgba(212,246,61,0.5)] hover:scale-105 active:scale-95"
          >
            <span>Explore Cleclo App</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
