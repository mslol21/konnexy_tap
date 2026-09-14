import React from "react";
import { notFound } from "next/navigation";
import PhoneView from "@/components/public-page/PhoneView";
import { DEMO_BUSINESS, DEMO_LINKS, DEMO_CAMPAIGN } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/server";

interface SlugPageProps {
  params: Promise<{ slug: string }>;
}

export default async function SlugPage({ params }: SlugPageProps) {
  const { slug } = await params;

  let business = DEMO_BUSINESS;
  let links = DEMO_LINKS;
  let campaign = DEMO_CAMPAIGN;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const supabase = await createClient();
      const { data: bData } = await supabase
        .from("businesses")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();

      if (bData) {
        business = bData;

        const { data: linksData } = await supabase
          .from("business_links")
          .select("*")
          .eq("business_id", business.id)
          .eq("is_active", true)
          .order("order_index", { ascending: true });

        if (linksData) links = linksData;

        const { data: campData } = await supabase
          .from("campaigns")
          .select("*")
          .eq("business_id", business.id)
          .eq("is_active", true)
          .limit(1)
          .maybeSingle();

        if (campData) campaign = campData;
      } else if (slug !== "cafe-da-ana") {
        notFound();
      }
    } catch {
      // Fallback
    }
  } else if (slug !== "cafe-da-ana") {
    // Modo demo suporta 'cafe-da-ana'
  }

  return (
    <main className="min-h-screen bg-slate-100 flex flex-col justify-start items-center">
      <div className="w-full max-w-[440px] min-h-screen bg-white shadow-xl relative">
        <PhoneView
          business={business}
          links={links}
          campaign={campaign}
          isMockup={false}
        />
      </div>
    </main>
  );
}
