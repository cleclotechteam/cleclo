"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X, Sparkles, ShieldCheck } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FBFDFB]/85 backdrop-blur-md border-b border-[#0A261E]/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo - Pine Labs style clean wordmark with Cleclo hanger badge */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-[#0A2B24] flex items-center justify-center text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
            {/* Custom geometric Hanger SVG */}
            <svg
              className="w-5 h-5 text-[#D4F63D]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a3 3 0 0 0-3 3v2l-7 8a2 2 0 0 0 1.5 3.3h17a2 2 0 0 0 1.5-3.3L15 7V5a3 3 0 0 0-3-3z" />
              <path d="M9 18.5h6" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-2xl font-extrabold tracking-tight text-[#0A2B24]">
              cleclo
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#0A2B24]/60 -mt-1">
              Standardised Network
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-[#0A2B24]/80">
          <Link
            href="#services"
            className="hover:text-[#0A2B24] transition-colors flex items-center gap-1.5 py-1"
          >
            Services
          </Link>
          <Link
            href="#pricing"
            className="hover:text-[#0A2B24] transition-colors flex items-center gap-1.5 py-1"
          >
            Standard Pricing
          </Link>
          <Link
            href="#process"
            className="hover:text-[#0A2B24] transition-colors flex items-center gap-1.5 py-1"
          >
            Our 72h Process
          </Link>
          <Link
            href="#network"
            className="hover:text-[#0A2B24] transition-colors flex items-center gap-1.5 py-1"
          >
            Certified Partners
          </Link>
          <Link
            href="#coverage"
            className="hover:text-[#0A2B24] transition-colors flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-xs font-semibold border border-emerald-200/60"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Delhi NCR Live
          </Link>
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="https://cleclo-vendor-dash-psi.vercel.app/#download"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 bg-[#D4F63D] hover:bg-[#c5ea2c] text-[#0A2B24] font-semibold text-sm px-5 py-2.5 rounded-full transition-all duration-300 shadow-[0_4px_14px_rgba(212,246,61,0.35)] hover:shadow-[0_6px_20px_rgba(212,246,61,0.5)] active:scale-95"
          >
            <span>Get the App</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-[#0A2B24] hover:bg-slate-100 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#0A261E]/10 bg-white/95 px-6 py-6 space-y-4 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-3 font-medium text-[#0A2B24]">
            <Link
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-emerald-700"
            >
              Services
            </Link>
            <Link
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-emerald-700"
            >
              Standard Pricing
            </Link>
            <Link
              href="#process"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-emerald-700"
            >
              Our 72h Process
            </Link>
            <Link
              href="#network"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-emerald-700"
            >
              Certified Partners
            </Link>
          </nav>

          <div className="pt-4 border-t border-slate-100">
            <Link
              href="https://cleclo-vendor-dash-psi.vercel.app/#download"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-[#D4F63D] text-[#0A2B24] font-semibold text-sm py-3 rounded-full shadow-md"
            >
              <span>Download App</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
