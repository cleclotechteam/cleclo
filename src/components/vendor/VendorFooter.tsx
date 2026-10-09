"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin } from "lucide-react";

export default function VendorFooter() {
  const base = "https://cleclo-vendor-dash-psi.vercel.app/vendor";

  return (
    <footer className="bg-[#022B22] text-white pt-12 sm:pt-16 pb-10 sm:pb-12 border-t border-emerald-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-x-6 gap-y-8 md:gap-10 pb-10 sm:pb-12 border-b border-emerald-900/60">
          
          {/* Brand Info */}
          <div className="col-span-2 md:col-span-4 space-y-4">
            <Link href="/" className="inline-block bg-white p-2 rounded-xl shadow-md">
              <Image
                src="/cleclo-logo.png"
                alt="Cleclo Logo"
                width={160}
                height={40}
                className="h-8 w-auto object-contain"
              />
            </Link>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal max-w-sm">
              Powering laundry businesses with smart technology, new customer opportunities, and streamlined operations — all through one structured platform.
            </p>

            <div className="space-y-2 text-xs text-slate-300 font-normal pt-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D4F63D]" />
                <span>Vendorsupport@cleclo.in</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D4F63D]" />
                <span>New Delhi, India</span>
              </div>
            </div>

            {/* Social Icons (Instagram, X, LinkedIn) */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#D4F63D] hover:text-[#022B22] text-slate-200 flex items-center justify-center transition-all duration-300"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#D4F63D] hover:text-[#022B22] text-slate-200 flex items-center justify-center transition-all duration-300"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#D4F63D] hover:text-[#022B22] text-slate-200 flex items-center justify-center transition-all duration-300"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#D4F63D]">
              Product
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-300">
              <li><Link href={`${base}#why-cleclo`} className="hover:text-white transition-colors">Why Cleclo</Link></li>
              <li><Link href={`${base}#how`} className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href={`${base}#demo`} className="hover:text-white transition-colors">Demo</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#D4F63D]">
              Company
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-300">
              <li><Link href={`${base}#about`} className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href={`${base}#careers`} className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href={`${base}#blog`} className="hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#D4F63D]">
              Support
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-300">
              <li><Link href={`${base}#help`} className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href={`${base}#contact`} className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#D4F63D]">
              Legal
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-300">
              <li><Link href={`${base}#terms`} className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href={`${base}#privacy`} className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href={`${base}#vendor-agreement`} className="hover:text-white transition-colors">Vendor Agreement</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/70 gap-4 text-center">
          <p>© 2026 Cleclo. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link href="/" className="hover:text-white transition-colors">Customer App</Link>
            <span>·</span>
            <Link href="https://cleclo-vendor-dash-psi.vercel.app/signup" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Become a Cleclo Vendor</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
