import React from "react";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import WhyCleclo from "@/components/WhyCleclo";
import StandardInNumbers from "@/components/StandardInNumbers";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-[#FBFDFB]">
      <Header />
      <HeroBanner />
      <WhyCleclo />
      <StandardInNumbers />
    </main>
  );
}
