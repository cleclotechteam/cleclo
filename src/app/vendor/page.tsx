import React from "react";
import VendorHeader from "@/components/vendor/VendorHeader";
import VendorHero from "@/components/vendor/VendorHero";
import VendorMarquee from "@/components/vendor/VendorMarquee";
import VendorSmarterWay from "@/components/vendor/VendorSmarterWay";
import VendorWhyChooseUs from "@/components/vendor/VendorWhyChooseUs";
import VendorServicesWorkflows from "@/components/vendor/VendorServicesWorkflows";
import VendorTrustSafety from "@/components/vendor/VendorTrustSafety";
import VendorHowItWorks from "@/components/vendor/VendorHowItWorks";
import VendorStandardInNumbers from "@/components/vendor/VendorStandardInNumbers";
import VendorWhyVendorsChoose from "@/components/vendor/VendorWhyVendorsChoose";
import VendorSustainability from "@/components/vendor/VendorSustainability";
import VendorWhereWeOperate from "@/components/vendor/VendorWhereWeOperate";
import VendorCtaBanner from "@/components/vendor/VendorCtaBanner";
import VendorFooter from "@/components/vendor/VendorFooter";

export const metadata = {
  title: "Cleclo Vendor Partner | Transform Your Laundry Business Into a Scalable Profit Machine",
  description:
    "Automate orders, track operations in real time and manage deliveries and payments from one unified platform. Built for independent laundry owners, multi outlet operators, backend vendor partners, and franchise owners.",
};

export default function VendorPage() {
  return (
    <main className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      <VendorHeader />
      <VendorHero />
      <VendorMarquee />
      <VendorSmarterWay />
      <VendorWhyChooseUs />
      <VendorServicesWorkflows />
      <VendorTrustSafety />
      <VendorHowItWorks />
      <VendorStandardInNumbers />
      <VendorWhyVendorsChoose />
      <VendorSustainability />
      <VendorWhereWeOperate />
      <VendorCtaBanner />
      <VendorFooter />
    </main>
  );
}
