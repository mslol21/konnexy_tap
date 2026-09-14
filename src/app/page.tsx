"use client";

import React, { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import FlowSection from "@/components/landing/FlowSection";
import ProblemSection from "@/components/landing/ProblemSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import UseCases from "@/components/landing/UseCases";
import EditorialSection from "@/components/landing/EditorialSection";
import DifferentiatorSection from "@/components/landing/DifferentiatorSection";
import PricingSection from "@/components/landing/PricingSection";
import FAQSection from "@/components/landing/FAQSection";
import Footer from "@/components/landing/Footer";
import ReserveModal from "@/components/landing/ReserveModal";

export default function HomePage() {
  const [reserveModalOpen, setReserveModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F5F2] text-[#20252A] selection:bg-[#C78D4E] selection:text-white">
      <Navbar onOpenReserve={() => setReserveModalOpen(true)} />
      <main className="flex-1">
        <Hero onOpenReserve={() => setReserveModalOpen(true)} />
        <FlowSection />
        <ProblemSection />
        <BenefitsSection />
        <UseCases />
        <EditorialSection />
        <DifferentiatorSection />
        <PricingSection onOpenReserve={() => setReserveModalOpen(true)} />
        <FAQSection />
      </main>
      <Footer />

      {/* Modal de Reserva de Placas */}
      <ReserveModal
        isOpen={reserveModalOpen}
        onClose={() => setReserveModalOpen(false)}
      />
    </div>
  );
}
