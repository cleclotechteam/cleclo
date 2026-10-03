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
          </div>

          {/* Links Columns (Col 5-12) */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 text-xs">
            
            {/* For Vendors */}
            <div>
              <h4 className="font-extrabold text-white uppercase tracking-wider mb-4 font-mono text-[11px] text-[#D4F63D]">
                For Vendors
              </h4>
              <ul className="space-y-2.5 text-slate-300 font-medium">
                <li>
                  <Link href="https://cleclo-vendor-dash-psi.vercel.app/vendor" target="_blank" className="hover:text-white transition-colors">
                    Partner With Us
                  </Link>
                </li>
                <li>
                  <Link href="https://cleclo-vendor-dash-psi.vercel.app/login" target="_blank" className="hover:text-white transition-colors">
                    Vendor Login
                  </Link>
                </li>
                <li>
                  <Link href="https://cleclo-vendor-dash-psi.vercel.app/#" target="_blank" className="hover:text-white transition-colors">
                    Partner Support
                  </Link>
                </li>
              </ul>
            </div>

            {/* For Delivery Partners */}
            <div>
              <h4 className="font-extrabold text-white uppercase tracking-wider mb-4 font-mono text-[11px] text-[#D4F63D]">
                For Delivery Partners
              </h4>
              <ul className="space-y-2.5 text-slate-300 font-medium">
                <li>
                  <Link href="https://cleclo-vendor-dash-psi.vercel.app/#" target="_blank" className="hover:text-white transition-colors">
                    Ride With Us
                  </Link>
                </li>
                <li>
                  <Link href="https://cleclo-vendor-dash-psi.vercel.app/#" target="_blank" className="hover:text-white transition-colors">
                    Rider App
                  </Link>
                </li>
                <li>
                  <Link href="https://cleclo-vendor-dash-psi.vercel.app/#" target="_blank" className="hover:text-white transition-colors">
                    Rider Support
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-extrabold text-white uppercase tracking-wider mb-4 font-mono text-[11px] text-[#D4F63D]">
                Company
              </h4>
              <ul className="space-y-2.5 text-slate-300 font-medium">
                <li>
                  <Link href="https://cleclo-vendor-dash-psi.vercel.app/#why" target="_blank" className="hover:text-white transition-colors">
                    About Cleclo
                  </Link>
                </li>
                <li>
                  <Link href="https://cleclo-vendor-dash-psi.vercel.app/#" target="_blank" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="https://cleclo-vendor-dash-psi.vercel.app/#" target="_blank" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-extrabold text-white uppercase tracking-wider mb-4 font-mono text-[11px] text-[#D4F63D]">
                Support
              </h4>
              <ul className="space-y-2.5 text-slate-300 font-medium">
                <li>
                  <Link href="https://cleclo-vendor-dash-psi.vercel.app/#faq" target="_blank" className="hover:text-white transition-colors">
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
              <h4 className="font-extrabold text-white uppercase tracking-wider mb-4 font-mono text-[11px] text-[#D4F63D]">
                Legal
              </h4>
              <ul className="space-y-2.5 text-slate-300 font-medium">
                <li>
                  <Link href="https://cleclo-vendor-dash-psi.vercel.app/#" target="_blank" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="https://cleclo-vendor-dash-psi.vercel.app/#" target="_blank" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="https://cleclo-vendor-dash-psi.vercel.app/#" target="_blank" className="hover:text-white transition-colors">
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
            <span className="text-[#00B074] font-bold">India&apos;s Standardised Dry Cleaning Network</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
