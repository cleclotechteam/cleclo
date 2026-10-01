import React from "react";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import WhatWeOffer from "@/components/WhatWeOffer";
import WhyCleclo from "@/components/WhyCleclo";
import StandardInNumbers from "@/components/StandardInNumbers";
import GettingStartedProcess from "@/components/GettingStartedProcess";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-[#FBFDFB]">
      <Header />
      <HeroBanner />
      <WhatWeOffer />
      <WhyCleclo />
      <StandardInNumbers />
      <GettingStartedProcess />
    </main>
  );
}

