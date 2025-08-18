import type { Metadata } from "next";
import HeroSection from "@/sections/hero/HeroSection";
import NextSection from "@/sections/next-section/NextSection";

export const metadata: Metadata = {
  title: "MNX-Developer",
  description: "Portfolio of Mark Reshetov (mnx), backend developer focused on APIs, Stripe integrations, and scalable backend systems.",
  keywords: ["Mark Reshetov", "mnx", "backend developer", "FastAPI", "Stripe", "SQLAlchemy", "portfolio"],
  authors: [{ name: "Mark Reshetov", url: "https://..." }],
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white font-mono relative overflow-hidden select-none">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-orange-500/10 via-orange-500/5 to-transparent"></div>
      </div>
      
      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <HeroSection />
          <NextSection />
        </div>
      </div>
    </div>
  );
}