"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Menu, X, Sparkles, ShieldCheck } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FBFDFB]/85 backdrop-blur-md border-b border-[#0A261E]/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo - Perfectly cropped and clearly visible */}
        <Link href="/" className="flex items-center group py-1">
          <Image
            src="/cleclo-logo.png"
            alt="Cleclo Logo"
            width={180}
            height={44}
            priority
            className="h-10 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
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
