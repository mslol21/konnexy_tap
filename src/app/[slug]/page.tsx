import React from "react";
import { notFound } from "next/navigation";
import PhoneView from "@/components/public-page/PhoneView";
import { DEMO_BUSINESS, DEMO_LINKS, DEMO_CAMPAIGN } from "@/lib/mock-data";
import { createServiceClient } from "@/lib/supabase/server";

interface SlugPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ device?: string }>;
}

export default async function SlugPage({ params, searchParams }: SlugPageProps) {
  const { slug } = await params;
  const { device: deviceId } = await searchParams;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const supabase = createServiceClient();
      const { data: business } = await supabase.from("businesses").select("*").eq("slug", slug).eq("is_active", true).maybeSingle();
      if (!business) notFound();

      const [{ data: experience }, { data: links }, { data: campaign }, { data: device }] = await Promise.all([
        supabase.from("business_experiences").select("*").eq("business_id", business.id).maybeSingle(),
        supabase.from("business_links").select("*").eq("business_id", business.id).eq("is_active", true).order("order_index", { ascending: true }),
        supabase.from("campaigns").select("*").eq("business_id", business.id).eq("is_active", true).limit(1).maybeSingle(),
        deviceId
          ? supabase.from("tap_devices").select("*").eq("id", deviceId).eq("business_id", business.id).maybeSingle()
          : Promise.resolve({ data: null }),
      ]);

      const filteredLinks = (links ?? []).filter((link: any) => {
        const featureByType: Record<string, boolean> = {
          google_review: experience?.google_enabled ?? true,
          whatsapp: experience?.whatsapp_enabled ?? true,
          menu: experience?.services_enabled ?? true,
          catalog: experience?.services_enabled ?? true,
          maps: experience?.maps_enabled ?? true,
          instagram: experience?.instagram_enabled ?? true,
          website: experience?.website_enabled ?? true,
          suggestion: experience?.feedback_enabled ?? true,
        };
        return featureByType[link.type] ?? true;
      });

      return (
        <main className="min-h-screen bg-slate-100 flex flex-col justify-start items-center">
          <div className="w-full max-w-[440px] min-h-screen bg-white shadow-xl relative">
            <PhoneView
              business={business}
              links={filteredLinks}
              campaign={experience?.promotions_enabled === false ? null : campaign ?? null}
              device={device ?? null}
              experience={experience ?? null}
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
          <PhoneView business={DEMO_BUSINESS} links={DEMO_LINKS} campaign={DEMO_CAMPAIGN} isMockup={false} />
        </div>
      </main>
    );
  }

  notFound();
}
