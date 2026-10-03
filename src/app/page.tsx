import React from "react";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import WhatWeOffer from "@/components/WhatWeOffer";
import TrustAndSafety from "@/components/TrustAndSafety";
import VerificationSystem from "@/components/VerificationSystem";
import Sustainability from "@/components/Sustainability";
import WhereWeOperate from "@/components/WhereWeOperate";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import WhyCleclo from "@/components/WhyCleclo";
import StandardInNumbers from "@/components/StandardInNumbers";
import GettingStartedProcess from "@/components/GettingStartedProcess";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-[#FBFDFB]">
      <Header />
      <HeroBanner />
      <WhyCleclo />
      <StandardInNumbers />
      <GettingStartedProcess />
      <WhatWeOffer />
      <TrustAndSafety />
      <VerificationSystem />
      <Sustainability />
      <WhereWeOperate />
      <FaqSection />
      <Footer />
    </main>
  );
}

