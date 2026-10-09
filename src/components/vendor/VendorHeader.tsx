"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Menu, X, LogIn } from "lucide-react";

export default function VendorHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const homeUrl = "/vendor";
  const loginUrl = "#login";
  const signupUrl = "#signup";

  const navLinks = [
    { label: "Home", href: homeUrl },
    { label: "Why Cleclo", href: "#why-cleclo" },
    { label: "Services & Workflows", href: "#services" },
    { label: "How It Works", href: "#how" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-[#0A261E]/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex flex-1 items-center">
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
        </div>

        {/* Desktop Navigation Links - centred between logo and actions */}
        <nav className="hidden lg:flex items-center justify-center gap-8 text-[14px] font-semibold text-[#0A2B24]/85">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className="hover:text-[#00B074] transition-colors py-1 whitespace-nowrap">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions - Login & Become a Partner */}
        <div className="hidden lg:flex flex-1 items-center justify-end gap-3">
          <Link
            href={loginUrl}
            className="inline-flex items-center gap-2 border-2 border-[#022B22] text-[#022B22] hover:bg-[#022B22] hover:text-white font-extrabold text-xs sm:text-sm px-5 py-2 rounded-full transition-all duration-300 active:scale-95"
          >
            <LogIn className="w-4 h-4" />
            <span>Login</span>
          </Link>
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
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 hover:text-[#00B074]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-4 border-t border-slate-100 space-y-3">
            <Link
              href={loginUrl}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 border-2 border-[#022B22] text-[#022B22] hover:bg-[#022B22] hover:text-white font-extrabold text-sm w-full py-3 rounded-full transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </Link>
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
