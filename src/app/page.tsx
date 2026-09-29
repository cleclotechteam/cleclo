import React from "react";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-[#FBFDFB]">
      <Header />
      <HeroBanner />
    </main>
  );
}
