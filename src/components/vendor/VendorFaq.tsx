"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Minus, ArrowUpRight, HelpCircle } from "lucide-react";

export default function VendorFaq() {
  const signupUrl = "https://cleclo-vendor-dash-psi.vercel.app/signup";
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "Who is eligible to partner with Cleclo as a Vendor?",
      a: "Independent laundry owners, multi-outlet operators, backend processing plant partners, and franchise operators are all eligible to onboard with Cleclo.",
    },
    {
      q: "How does Cleclo help transform my laundry business into a scalable profit machine?",
      a: "Cleclo provides an end-to-end OS that automates customer order dispatch, provides barcode garment tagging, enables live GPS delivery tracking, and settles payouts weekly automatically.",
    },
    {
      q: "Are there any upfront software fees or hidden commission charges?",
      a: "No. Onboarding your shop and accessing the Cleclo Vendor Dashboard has zero upfront software license fee. You only pay a transparent fixed percentage per completed order.",
    },
    {
      q: "How quickly can my store start accepting orders on Cleclo?",
      a: "Onboarding takes less than 15 minutes. Once your facility passes our 48-point standard verification inspection, your store goes live on the app.",
    },
    {
      q: "How and when do vendor payouts get deposited?",
      a: "Vendor payouts are calculated automatically from completed customer orders and transferred directly to your registered bank account every week.",
    },
  ];

  return (
    <section id="faq" className="py-20 sm:py-28 bg-white relative border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-[#00875A]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#00875A]">
              VENDOR FAQ
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#022B22] leading-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-base text-slate-500 font-normal">
            Everything you need to know about partnering with Cleclo.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4 mb-16">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden transition-all duration-300 shadow-sm"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-extrabold text-base sm:text-lg text-[#022B22] font-display">
                    {faq.q}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#00875A] flex items-center justify-center shrink-0">
                    {isOpen ? <Minus className="w-4 h-4 stroke-[2.5]" /> : <Plus className="w-4 h-4 stroke-[2.5]" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal border-t border-slate-100 mt-2 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center p-8 rounded-3xl bg-[#00875A] text-white">
          <h3 className="text-xl font-bold font-display mb-2 text-white">Have more questions?</h3>
          <p className="text-xs sm:text-sm text-white/85 mb-6">Our vendor partner team is available 24/7 to help you onboard.</p>
          <Link
            href={signupUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#D4F63D] text-[#022B22] font-extrabold text-xs sm:text-sm px-6 py-3 rounded-full hover:bg-[#c5ea2c] transition-all shadow-md"
          >
            <span>See How Cleclo Works</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
