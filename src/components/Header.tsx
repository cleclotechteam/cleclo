"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Menu, X, ShieldCheck } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-[#0A261E]/5 transition-all">
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
        <nav className="hidden lg:flex items-center gap-7 text-[14px] font-semibold text-[#0A2B24]/85">
          <Link
            href="#services"
            className="hover:text-[#00B074] transition-colors py-1"
          >
            Services
          </Link>
          <Link
            href="#trust-and-safety"
            className="hover:text-[#00B074] transition-colors py-1"
          >
            Trust &amp; Safety
          </Link>
          <Link
            href="#verification"
            className="hover:text-[#00B074] transition-colors py-1"
          >
            Verification
          </Link>
          <Link
            href="#sustainability"
            className="hover:text-[#00B074] transition-colors py-1"
          >
            Sustainability
          </Link>
          <Link
            href="#where-we-operate"
            className="hover:text-[#00B074] transition-colors py-1"
          >
            Cities
          </Link>
          <Link
            href="#faq"
            className="hover:text-[#00B074] transition-colors py-1"
          >
            FAQ
          </Link>
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/vendor"
            className="group inline-flex items-center gap-1.5 bg-white text-[#0A2B24] border border-slate-300 hover:border-[#00B074] hover:bg-emerald-50/50 font-bold text-xs px-4 py-2.5 rounded-full transition-all duration-300"
          >
            <span>Partner as Vendor</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#00875A] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>

          <Link
            href="#download"
            className="group inline-flex items-center gap-2 bg-[#D4F63D] hover:bg-[#c5ea2c] text-[#0A2B24] font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-full transition-all duration-300 shadow-[0_4px_14px_rgba(212,246,61,0.35)] hover:shadow-[0_6px_20px_rgba(212,246,61,0.5)] active:scale-95"
          >
            <span>Get the App</span>
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
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#00B074]"
            >
              Services
            </Link>
            <Link
              href="#trust-and-safety"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#00B074]"
            >
              Trust &amp; Safety
            </Link>
            <Link
              href="#verification"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#00B074]"
            >
              3-Step Verification
            </Link>
            <Link
              href="#sustainability"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#00B074]"
            >
              Sustainability
            </Link>
            <Link
              href="#where-we-operate"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#00B074]"
            >
              Cities &amp; Coverage
            </Link>
            <Link
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#00B074]"
            >
              FAQ
            </Link>
          </nav>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
            <Link
              href="/vendor"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-[#0A2B24] font-bold text-xs py-3 rounded-full shadow-sm"
            >
              <span>Partner as Vendor</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#00875A]" />
            </Link>

            <Link
              href="#download"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-[#D4F63D] text-[#0A2B24] font-extrabold text-sm py-3 rounded-full shadow-md"
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
