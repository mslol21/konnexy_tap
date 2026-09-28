import React from "react";
import { notFound } from "next/navigation";
import PhoneView from "@/components/public-page/PhoneView";
import { DEMO_BUSINESS, DEMO_LINKS, DEMO_CAMPAIGN } from "@/lib/mock-data";
import { createServiceClient } from "@/lib/supabase/server";
import type { BusinessLink } from "@/lib/types";

interface SlugPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ device?: string }>;
}

function normalUrl(value?: string | null) {
  const raw = value?.trim();
  if (!raw) return null;
  try {
    return new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`).toString();
  } catch {
    return null;
  }
}

function whatsappUrl(value?: string | null) {
  const raw = value?.trim();
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return normalUrl(raw);
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 10) return null;
  return `https://wa.me/${digits.startsWith("55") ? digits : `55${digits}`}`;
}

function instagramUrl(value?: string | null) {
  const raw = value?.trim();
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return normalUrl(raw);
  const handle = raw.replace(/^@/, "").replace(/\s/g, "");
  return handle ? `https://instagram.com/${handle}` : null;
}

function mapsUrl(business: Record<string, unknown>) {
  const explicit = typeof business.maps_url === "string" ? normalUrl(business.maps_url) : null;
  if (explicit) return explicit;
  const query = [business.address, business.city, business.state].filter((value) => typeof value === "string" && value.trim()).join(", ");
  return query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` : null;
}

function makeLink(
  businessId: string,
  type: BusinessLink["type"],
  title: string,
  url: string | null,
  orderIndex: number
): BusinessLink | null {
  if (!url) return null;
  return {
    id: `derived-${businessId}-${type}`,
    business_id: businessId,
    title,
    type,
    url,
    order_index: orderIndex,
    is_active: true,
    created_at: new Date(0).toISOString(),
  };
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

      const existing = (links ?? []) as BusinessLink[];
      const existingTypes = new Set(existing.map((link) => link.type));
      const derived: Array<BusinessLink | null> = [
        !existingTypes.has("google_review") && (experience?.google_enabled ?? true)
          ? makeLink(business.id, "google_review", "Avaliar no Google", normalUrl(business.google_review_url), 10)
          : null,
        !existingTypes.has("whatsapp") && experience?.whatsapp_enabled
          ? makeLink(business.id, "whatsapp", "Falar no WhatsApp", whatsappUrl(business.whatsapp), 20)
          : null,
        !existingTypes.has("menu") && !existingTypes.has("catalog") && experience?.services_enabled
          ? makeLink(business.id, "menu", business.services_label || "Serviços / cardápio", normalUrl(business.services_url), 30)
          : null,
        !existingTypes.has("maps") && experience?.maps_enabled
          ? makeLink(business.id, "maps", "Como chegar", mapsUrl(business), 40)
          : null,
        !existingTypes.has("instagram") && experience?.instagram_enabled
          ? makeLink(business.id, "instagram", "Instagram", instagramUrl(business.instagram), 50)
          : null,
        !existingTypes.has("website") && experience?.website_enabled
          ? makeLink(business.id, "website", "Visitar site", normalUrl(business.website), 60)
          : null,
      ];

      const combinedLinks = [...existing, ...derived.filter((link): link is BusinessLink => Boolean(link))];
      const filteredLinks = combinedLinks.filter((link) => {
        const featureByType: Record<string, boolean> = {
          google_review: experience?.google_enabled ?? true,
          whatsapp: experience?.whatsapp_enabled ?? false,
          menu: experience?.services_enabled ?? false,
          catalog: experience?.services_enabled ?? false,
          maps: experience?.maps_enabled ?? false,
          instagram: experience?.instagram_enabled ?? false,
          website: experience?.website_enabled ?? false,
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
    } catch (error) {
      console.error("Falha ao carregar página pública", error);
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
