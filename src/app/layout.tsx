import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Cleclo | India's First Standardised Dry-Cleaning Network",
  description:
    "Dry cleaning, finally organised. Cleclo handles your pickup and delivery end-to-end, while a certified local partner takes care of your garments.",
  keywords: [
    "dry cleaning",
    "Cleclo",
    "standardised dry cleaning",
    "Delhi NCR dry cleaning",
    "laundry pickup delivery",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#FBFDFB] text-[#0A261E] selection:bg-[#D9F958] selection:text-[#0A261E]">
        {children}
      </body>
    </html>
  );
}
