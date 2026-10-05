"use client";

import React from "react";
import Link from "next/link";
import { Star, Quote, ArrowUpRight, TrendingUp, ShieldCheck } from "lucide-react";

export default function VendorRatings() {
  const signupUrl = "https://cleclo-vendor-dash-psi.vercel.app/signup";

  const testimonials = [
    {
      name: "Rajesh Sharma",
      role: "Independent Outlet Owner",
      city: "Delhi NCR",
      rating: 5,
      quote:
        "Cleclo doubled our order volume within 60 days. Our machines are running at full capacity and customer payments come in on time every week.",
    },
    {
      name: "Ananya Deshmukh",
      role: "Multi-Store Operator",
      city: "Mumbai",
      rating: 5,
      quote:
        "Managing 4 outlets used to be chaos. Cleclo's vendor dashboard gives me live tracking on every garment, staff efficiency, and store revenue from my phone.",
    },
    {
      name: "Vikram Sengupta",
      role: "Backend Processing Facility Partner",
      city: "Bengaluru",
      rating: 5,
      quote:
        "The automated order SOPs and barcode tagging eliminated garment mix-ups completely. 4.9 rating is 100% accurate for Cleclo's vendor support.",
    },
  ];

  return (
    <section id="ratings" className="py-20 sm:py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Rating Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200/80 mb-4 shadow-sm">
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
              ))}
            </div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900">
              4.9 / 5.0 VENDOR RATING
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-[#022B22] leading-tight mb-4">
            Powering Leading Laundry <br />
            <span className="text-[#00875A]">Partners Across India.</span>
          </h2>

          <p className="text-sm sm:text-lg text-slate-600 font-normal leading-relaxed">
            Hear directly from laundry business owners who converted their operations into scalable profit machines with Cleclo.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-8 rounded-[32px] bg-white border border-slate-200/90 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:border-emerald-300 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <Quote className="w-8 h-8 text-emerald-200" />
                  <div className="flex items-center text-amber-500">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-500" />
                    ))}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal mb-6 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-[#022B22] font-display">{t.name}</h4>
                  <p className="text-[11px] text-slate-400 font-medium">{t.role} · {t.city}</p>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  Verified Vendor
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Ratings CTA Box */}
        <div className="max-w-4xl mx-auto rounded-[32px] bg-gradient-to-b from-[#EBF7F1] to-[#E2F3EA] border border-emerald-200/90 p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#00875A] text-white flex items-center justify-center shrink-0 shadow-md">
              <TrendingUp className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#022B22] font-display">
                Ready to join India&apos;s 4.9★ Vendor Network?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Automate orders, operations, deliveries and payments on Cleclo.
              </p>
            </div>
          </div>

          <Link
            href={signupUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 bg-[#D4F63D] hover:bg-[#c5ea2c] text-[#022B22] font-extrabold text-sm px-7 py-3.5 rounded-full transition-all shadow-md hover:scale-105"
          >
            <span>See How Cleclo Works</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
