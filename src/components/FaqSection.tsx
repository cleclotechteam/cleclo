"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronDown, Smartphone, ShieldCheck } from "lucide-react";

export default function FaqSection() {
  const downloadUrl = "https://cleclo-vendor-dash-psi.vercel.app/#download";
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How is the 72-hour window calculated?",
      answer:
        "From the moment your pickup is collected to the moment it's delivered back to your door — timed and shown to you inside the app for every order.",
    },
    {
      question: "Can I get my order back faster?",
      answer:
        "Yes — Express options for same-day or next-day delivery are available on select services and pincodes. You'll see them at checkout in the app if they're available for your order.",
    },
    {
      question: "How do I know the price before I book?",
      answer:
        "Every service has a fixed, standard price shown in the app before you confirm — the same rate card whether you're in a Tier-1 metro or a Tier-3 town so there's no surprise at delivery.",
    },
    {
      question: "What if my pincode isn't covered yet?",
      answer:
        "The app shows pincode-level availability before you book. We're onboarding certified partners city by city so coverage keeps expanding.",
    },
    {
      question: "Who actually cleans my clothes?",
      answer:
        "A certified local partner in the Cleclo network, matched to you by pincode, trained and audited to the Cleclo standard.",
    },
    {
      question: "Can I add instructions for a specific item?",
      answer:
        "Yes — you can add a note for individual items when you book, like a stain to treat or a particular finish and it's passed along to the partner handling your order.",
    },
    {
      question: "How do I pay?",
      answer:
        "Payment is handled in the app, with online payment or pay-on-delivery available depending on your order — you'll see the options at checkout.",
    },
    {
      question: "Can I reschedule or cancel a pickup?",
      answer:
        "Yes — pickups can be rescheduled or cancelled from the app until your rider is on the way. Once it's confirmed, any changes are handled through in-app support.",
    },
    {
      question: "What if I'm not home when the rider arrives?",
      answer:
        "You'll get a notification as your rider gets close, with a short window to be available. If a pickup or delivery can't be completed, you can reschedule it from the app.",
    },
    {
      question: "What happens if something goes wrong?",
      answer:
        "Every order is logged at pickup, at processing and at delivery. Any damage or loss is handled under Cleclo's SLA and resolution policy — not left to shop-to-shop discretion.",
    },
    {
      question: "How do I actually place an order?",
      answer:
        "Download the Cleclo app for iOS or Android — booking, live tracking and payments all happen there.",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 lg:py-28 bg-[#FBFDFB] relative overflow-hidden border-t border-[#0A261E]/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          {/* Eyebrow badge matching banner style */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50/90 border border-emerald-200/70 mb-4 max-w-full">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse shrink-0"></span>
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-900 leading-snug">
              QUESTIONS
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold text-[#022B22] tracking-tight leading-[1.15]">
            Good to know <span className="text-[#00875A]">before you book</span>
          </h2>
        </div>

        {/* Pine Labs Style Clean Accordion Cards (Matching uploaded screenshot) */}
        <div className="space-y-4 mb-20">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                onClick={() => toggleFaq(index)}
                className={`bg-white rounded-[24px] p-5 sm:p-6 border transition-all duration-300 cursor-pointer ${
                  isOpen
                    ? "border-[#00B074] shadow-[0_10px_30px_rgba(0,176,116,0.08)] ring-1 ring-[#00B074]/30"
                    : "border-slate-200/80 hover:border-[#00B074]/40 shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {/* Green Circle Checkmark Badge (Exact screenshot UI) */}
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isOpen ? "bg-[#00B074] text-white" : "bg-[#00B074]/10 text-[#00875A]"
                      }`}
                    >
                      <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
                    </div>

                    <h3 className="text-base sm:text-lg font-extrabold text-[#0A2B24] leading-snug">
                      {faq.question}
                    </h3>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-[#0A2B24] text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </div>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="pt-4 pl-13 text-sm sm:text-base text-[#0A2B24]/75 font-normal leading-relaxed border-t border-slate-100 mt-4">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Pine Labs Style App Download Banner */}
        <div className="p-8 sm:p-12 rounded-[36px] bg-[#0A2B24] text-white relative overflow-hidden shadow-2xl">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#00B074]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl text-center sm:text-left">
            <span className="text-xs font-mono font-bold tracking-widest text-[#D4F63D] uppercase px-3 py-1 rounded-full bg-white/10 border border-white/15 mb-4 inline-block">
              Get the app
            </span>

            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3 leading-tight font-display">
              Bookings live in the <span className="text-[#D4F63D]">Cleclo app.</span>
            </h3>

            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed mb-8">
              Live tracking, standard pricing and payments — all in one place, for every order you place.
            </p>

            {/* App Store & Google Play Buttons */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
              <Link
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-white text-[#0A2B24] hover:bg-slate-100 transition-all duration-300 shadow-md hover:scale-105 active:scale-95"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 384 512">
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.6 26.1 2 52.3-14.7 69.5-34z" />
                </svg>
                <div className="flex flex-col text-left leading-tight">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Download on the</span>
                  <span className="text-sm font-extrabold font-display">App Store</span>
                </div>
              </Link>

              <Link
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-white text-[#0A2B24] hover:bg-slate-100 transition-all duration-300 shadow-md hover:scale-105 active:scale-95"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 512 512">
                  <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                </svg>
                <div className="flex flex-col text-left leading-tight">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Get it on</span>
                  <span className="text-sm font-extrabold font-display">Google Play</span>
                </div>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
