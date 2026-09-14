"use client";

import React, { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import FlowSection from "@/components/landing/FlowSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import UseCases from "@/components/landing/UseCases";
import FAQSection from "@/components/landing/FAQSection";
import Footer from "@/components/landing/Footer";
import ReserveModal from "@/components/landing/ReserveModal";

export default function HomePage() {
  const [reserveModalOpen, setReserveModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#060B17] text-white selection:bg-cyan-500 selection:text-navy-950">
      <Navbar onOpenReserve={() => setReserveModalOpen(true)} />
      <main className="flex-1">
        <Hero onOpenReserve={() => setReserveModalOpen(true)} />
        <FlowSection />
        <BenefitsSection />
        <UseCases />
        <FAQSection />
      </main>
      <Footer />

      {/* Modal de Reserva de Placas (Primeiro Lote) */}
      <ReserveModal
        isOpen={reserveModalOpen}
        onClose={() => setReserveModalOpen(false)}
      />
    </div>
  );
}
