"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Menu, X, ShieldCheck } from "lucide-react";

export default function VendorHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const homeUrl = "/vendor";
  const featuresUrl = "#features";
  const howUrl = "#how";
  const loginUrl = "#login";
  const signupUrl = "#signup";

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-[#0A261E]/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Vendor Badge */}
        <div className="flex items-center gap-3">
          <Link href={homeUrl} className="flex items-center group py-1">
            <Image
              src="/cleclo-logo.png"
              alt="Cleclo Logo"
              width={180}
              height={44}
              priority
              className="h-9 sm:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest bg-emerald-100/80 text-[#00875A] border border-emerald-300/80 px-2.5 py-1 rounded-full">
            <ShieldCheck className="w-3 h-3 stroke-[2.5]" />
            <span>Vendor Partner</span>
          </span>
        </div>

        {/* Desktop Navigation Links - Exact User Copy */}
        <nav className="hidden lg:flex items-center gap-7 text-[14px] font-semibold text-[#0A2B24]/85">
          <Link href={homeUrl} className="hover:text-[#00B074] transition-colors py-1">
            Home
          </Link>
          <Link href={featuresUrl} className="hover:text-[#00B074] transition-colors py-1">
            Features
          </Link>
          <Link href={howUrl} className="hover:text-[#00B074] transition-colors py-1">
            How It Works
          </Link>
          <Link href={loginUrl} className="hover:text-[#00B074] transition-colors py-1">
            Login
          </Link>
        </nav>

        {/* Right Action Button - Become a Partner */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href={signupUrl}
            className="group inline-flex items-center gap-2 bg-[#D4F63D] hover:bg-[#c5ea2c] text-[#0A2B24] font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-full transition-all duration-300 shadow-[0_4px_14px_rgba(212,246,61,0.35)] hover:shadow-[0_6px_20px_rgba(212,246,61,0.5)] active:scale-95"
          >
            <span>Become a Partner</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-[#0A2B24] hover:bg-slate-100 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#0A261E]/10 bg-white/95 px-6 py-6 space-y-4 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-3 font-semibold text-[#0A2B24]">
            <Link
              href={homeUrl}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#00B074]"
            >
              Home
            </Link>
            <Link
              href={featuresUrl}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#00B074]"
            >
              Features
            </Link>
            <Link
              href={howUrl}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#00B074]"
            >
              How It Works
            </Link>
            <Link
              href={loginUrl}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#00B074]"
            >
              Login
            </Link>
          </nav>

          <div className="pt-4 border-t border-slate-100">
            <Link
              href={signupUrl}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 bg-[#D4F63D] hover:bg-[#c5ea2c] text-[#0A2B24] font-extrabold text-sm w-full py-3.5 rounded-full transition-all shadow-md"
            >
              <span>Become a Partner</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
