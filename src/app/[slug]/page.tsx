import React from "react";
import { notFound } from "next/navigation";
import PhoneView from "@/components/public-page/PhoneView";
import { DEMO_BUSINESS, DEMO_LINKS, DEMO_CAMPAIGN } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/server";

interface SlugPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Página inteligente multi-link é um recurso de Fase 2.
 * No MVP de validação da placa de avaliações, a rota fica desabilitada por padrão.
 */
export default async function SlugPage({ params }: SlugPageProps) {
  if (process.env.NEXT_PUBLIC_ENABLE_SMART_PAGES !== "true") {
    notFound();
  }

  const { slug } = await params;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const supabase = await createClient();
      const { data: business } = await supabase
        .from("businesses")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();

      if (!business) {
        notFound();
      }

      const [{ data: links }, { data: campaign }] = await Promise.all([
        supabase
          .from("business_links")
          .select("*")
          .eq("business_id", business.id)
          .eq("is_active", true)
          .order("order_index", { ascending: true }),
        supabase
          .from("campaigns")
          .select("*")
          .eq("business_id", business.id)
          .eq("is_active", true)
          .limit(1)
          .maybeSingle(),
      ]);

      return (
        <main className="min-h-screen bg-slate-100 flex flex-col justify-start items-center">
          <div className="w-full max-w-[440px] min-h-screen bg-white shadow-xl relative">
            <PhoneView
              business={business}
              links={links ?? []}
              campaign={campaign ?? null}
              isMockup={false}
            />
          </div>
        </main>
      );
    } catch {
      notFound();
    }
  }

  if (process.env.NODE_ENV !== "production" && slug === "cafe-da-ana") {
    return (
      <main className="min-h-screen bg-slate-100 flex flex-col justify-start items-center">
        <div className="w-full max-w-[440px] min-h-screen bg-white shadow-xl relative">
          <PhoneView
            business={DEMO_BUSINESS}
            links={DEMO_LINKS}
            campaign={DEMO_CAMPAIGN}
            isMockup={false}
          />
        </div>
      </main>
    );
  }

  notFound();
}
