"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0A2B24] text-white border-t border-white/10 pt-16 pb-12 relative overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#00B074]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          
          {/* Brand & Bio (Col 1-4) */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-block">
              <Image
                src="/cleclo-logo.png"
                alt="Cleclo Logo"
                width={150}
                height={38}
                className="h-9 w-auto object-contain brightness-0 invert"
              />
            </Link>

            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed max-w-sm">
              Cleclo brings together technology, standardised processes and verified local partners to make dry cleaning more consistent, convenient and reliable — from pickup to delivery.
            </p>

            <div className="space-y-2 pt-2 text-xs text-slate-300 font-medium">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D4F63D]" />
                <a href="mailto:customersupport@cleclo.in" className="hover:text-white transition-colors">
                  customersupport@cleclo.in
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D4F63D]" />
                <span>New Delhi, India</span>
              </div>
            </div>

            {/* Social Media Icons (Instagram, X, LinkedIn) */}
            <div className="pt-3">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#D4F63D] block mb-3">
                Connect With Us
              </span>
              <div className="flex items-center gap-2.5">
                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#00B074] text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 border border-white/10 hover:border-[#00B074] group"
                >
                  <svg className="w-4 h-4 fill-none stroke-current stroke-[2] transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>

                {/* X (Twitter) */}
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X (Twitter)"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#00B074] text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 border border-white/10 hover:border-[#00B074] group"
                >
                  <svg className="w-3.5 h-3.5 fill-current transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#00B074] text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 border border-white/10 hover:border-[#00B074] group"
                >
                  <svg className="w-4 h-4 fill-current transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Links Columns (Col 5-12) */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 text-xs">
            
            {/* For Vendors */}
            <div>
              <h4 className="font-display font-extrabold text-[#D4F63D] uppercase tracking-wider mb-4 text-xs">
                For Vendors
              </h4>
              <ul className="space-y-2.5 text-slate-300 font-medium">
                <li>
                  <Link href="/vendor" className="hover:text-white transition-colors">
                    Partner With Us
                  </Link>
                </li>
                <li>
                  <Link href="/vendor#login" className="hover:text-white transition-colors">
                    Vendor Login
                  </Link>
                </li>
                <li>
                  <Link href="/vendor#support" className="hover:text-white transition-colors">
                    Partner Support
                  </Link>
                </li>
              </ul>
            </div>

            {/* For Delivery Partners */}
            <div>
              <h4 className="font-display font-extrabold text-[#D4F63D] uppercase tracking-wider mb-4 text-xs">
                For Delivery Partners
              </h4>
              <ul className="space-y-2.5 text-slate-300 font-medium">
                <li>
                  <Link href="#ride" className="hover:text-white transition-colors">
                    Ride With Us
                  </Link>
                </li>
                <li>
                  <Link href="#download" className="hover:text-white transition-colors">
                    Rider App
                  </Link>
                </li>
                <li>
                  <Link href="#support" className="hover:text-white transition-colors">
                    Rider Support
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-display font-extrabold text-[#D4F63D] uppercase tracking-wider mb-4 text-xs">
                Company
              </h4>
              <ul className="space-y-2.5 text-slate-300 font-medium">
                <li>
                  <Link href="#why" className="hover:text-white transition-colors">
                    About Cleclo
                  </Link>
                </li>
                <li>
                  <Link href="#careers" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#blog" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-display font-extrabold text-[#D4F63D] uppercase tracking-wider mb-4 text-xs">
                Support
              </h4>
              <ul className="space-y-2.5 text-slate-300 font-medium">
                <li>
                  <Link href="#faq" className="hover:text-white transition-colors">
                    Help Centre
                  </Link>
                </li>
                <li>
                  <a href="mailto:support@cleclo.in" className="hover:text-white transition-colors">
                    Contact us
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-display font-extrabold text-[#D4F63D] uppercase tracking-wider mb-4 text-xs">
                Legal
              </h4>
              <ul className="space-y-2.5 text-slate-300 font-medium">
                <li>
                  <Link href="#terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#refund" className="hover:text-white transition-colors">
                    Refund Policy
                  </Link>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
          <p>© 2026 Cleclo. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-[#00B074] font-bold">Building India’s Standard for Garment Care</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
