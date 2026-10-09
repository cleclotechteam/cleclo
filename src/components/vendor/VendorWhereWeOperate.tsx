"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, MapPin, ArrowRight } from "lucide-react";

export default function VendorWhereWeOperate() {
  const signupUrl = "#signup";
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCard, setActiveCard] = useState<number>(0);

  const tiers = [
    {
      id: "core-market",
      tag: "01 · CORE MARKETS",
      title: "Delhi NCR Network",
      cities: "DELHI · GURUGRAM · NOIDA · GHAZIABAD",
      desc: "Connect with Cleclo's vendor network across Delhi NCR. Explore partnership opportunities for laundry facilities serving local customer demand.",
      metric: "Active Partner Network",
      image: "/tier1-cleclo-metro-v2.jpg",
      status: "Onboarding Partners",
      badgeBg: "bg-emerald-100 text-[#00875A] border-emerald-200",
      footerLeft: "Vendors Onboarding",
      cta: "Explore Opportunities",
    },
    {
      id: "expansion-market",
      tag: "02 · EXPANSION MARKETS",
      title: "Metro City Expansion",
      cities: "MUMBAI · BENGALURU · HYDERABAD · PUNE · JAIPUR · CHANDIGARH",
      desc: "Help bring standardised laundry services to more customers. Register your facility to express interest in Cleclo's expansion markets.",
      metric: "Partner Applications Open",
      image: "/tier2-cleclo-facility-v2.jpg",
      status: "Expanding Partner Network",
      badgeBg: "bg-sky-100 text-sky-800 border-sky-200",
      footerLeft: "Partner Applications",
      cta: "Register Interest",
    },
    {
      id: "new-market",
      tag: "03 · NEW MARKETS",
      title: "Emerging Cities & Local Markets",
      cities: "INDORE · LUCKNOW · AHMEDABAD · SURAT · DEHRADUN · LUDHIANA",
      desc: "Are you a laundry operator looking to grow with Cleclo? Share your location and business details to explore potential partnership opportunities.",
      metric: "Franchise & Vendor Opportunities",
      image: "/tier3-cleclo-towns-v2.jpg",
      status: "Applications Open",
      badgeBg: "bg-purple-100 text-purple-800 border-purple-200",
      footerLeft: "New Market Applications",
      cta: "Apply to Partner",
    },
  ];

  const filteredTiers = tiers.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.cities.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="where-we-operate" className="py-16 sm:py-28 bg-[#FBFDFB] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 mb-4">
              <MapPin className="w-3.5 h-3.5 text-[#00875A]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#00875A]">
                VENDOR NETWORK
              </span>
            </div>

            <h2 className="font-display text-2xl sm:text-5xl font-extrabold tracking-tight text-[#022B22] leading-tight mb-3">
              Find Your Place in the <span className="text-[#00875A]">Cleclo Network.</span>
            </h2>
            <p className="text-xs sm:text-base text-slate-600 font-normal leading-relaxed">
              Explore our operational markets, discover current vendor onboarding opportunities and register your laundry facility to join Cleclo&apos;s growing partner network.
            </p>
          </div>

          {/* City Search Bar */}
          <div className="w-full md:w-80 relative shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by city, locality or service area"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-full pl-10 pr-4 py-3 text-xs sm:text-sm text-[#022B22] placeholder:text-slate-400 focus:outline-none focus:border-[#00875A] focus:ring-1 focus:ring-[#00875A] transition-all shadow-sm"
            />
          </div>
        </div>

        {/* 3 Coverage Cards - Mobile Horizontal Scroll Rail / Desktop Grid */}
        <div className="flex md:grid md:grid-cols-3 gap-4 sm:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 pb-4 sm:pb-0 mb-6 sm:mb-16">
          {filteredTiers.map((tier, idx) => (
            <div
              key={tier.id}
              onClick={() => setActiveCard(idx)}
              onMouseEnter={() => setActiveCard(idx)}
              className="w-[82vw] max-w-[290px] md:w-full md:max-w-none shrink-0 md:shrink snap-center group rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_35px_rgba(0,135,90,0.1)] transition-all duration-300 flex flex-col justify-between cursor-pointer select-none"
            >
              <div>
                {/* Card Image Cover */}
                <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={tier.image}
                    alt={tier.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                  
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] font-mono font-black uppercase tracking-widest bg-white/90 text-[#022B22] border border-white px-3 py-1 rounded-full shadow-sm backdrop-blur-md">
                      {tier.tag}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                    <span className="text-xs font-bold font-display truncate mr-2">{tier.metric}</span>
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border shrink-0 ${tier.badgeBg}`}>
                      {tier.status}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-7">
                  <h3 className="text-lg sm:text-2xl font-extrabold text-[#022B22] font-display mb-1.5 group-hover:text-[#00875A] transition-colors">
                    {tier.title}
                  </h3>
                  <p className="text-[10px] font-mono font-bold text-[#00875A] tracking-wider uppercase mb-3">
                    {tier.cities}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {tier.desc}
                  </p>
                </div>
              </div>

              {/* Card Footer Link */}
              <div className="px-5 sm:px-7 pb-5 sm:pb-7 flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                <span className="text-xs font-semibold text-slate-400">{tier.footerLeft}</span>
                <Link
                  href={signupUrl}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#00875A] group-hover:translate-x-0.5 transition-transform"
                >
                  <span>{tier.cta} →</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Rail Indicator Dots */}
        <div className="flex items-center justify-center gap-1.5 md:hidden mb-8">
          {filteredTiers.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCard(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeCard === idx
                  ? "w-6 bg-[#00875A]"
                  : "w-1.5 bg-slate-200"
              }`}
              aria-label={`Go to tier ${idx + 1}`}
            />
          ))}
        </div>

        {/* Bottom Callout */}
        <div className="text-center p-6 sm:p-10 rounded-3xl bg-[#022B22] text-white">
          <h3 className="text-lg sm:text-2xl font-extrabold font-display mb-2 text-white">Your City Isn&apos;t Listed?</h3>
          <p className="text-xs sm:text-sm text-slate-300 mb-6 max-w-xl mx-auto leading-relaxed font-normal">
            We&apos;re exploring new markets across India. Register your laundry facility and tell us where you&apos;d like to partner with Cleclo.
          </p>
          <Link
            href={signupUrl}
            className="inline-flex items-center gap-2 bg-[#D4F63D] text-[#022B22] font-extrabold text-xs sm:text-sm px-7 py-3.5 rounded-full hover:bg-[#c5ea2c] transition-all shadow-md hover:scale-105"
          >
            <span>Register Your Interest</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
