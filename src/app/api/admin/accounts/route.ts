import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { createServiceClient } from "@/lib/supabase/server";
import { validateDestinationUrl } from "@/lib/security";

const statusValues = ["lead","onboarding","active","inactive","suspended","cancelled"] as const;
const platePaymentValues = ["pending","paid","overdue","cancelled","refunded"] as const;
const subscriptionValues = ["not_subscribed","trial","pending","active","overdue","suspended","cancelled"] as const;
const deviceStatusValues = ["pending","active","inactive","suspended"] as const;

const experienceSchema = z.object({
  google_enabled: z.boolean(),
  whatsapp_enabled: z.boolean(),
  services_enabled: z.boolean(),
  maps_enabled: z.boolean(),
  wifi_enabled: z.boolean(),
  feedback_enabled: z.boolean(),
  promotions_enabled: z.boolean(),
  instagram_enabled: z.boolean(),
  website_enabled: z.boolean(),
  wifi_ssid: z.string().max(100).nullable().optional(),
  wifi_password: z.string().max(128).nullable().optional(),
});

const dbDateTime = z.string().datetime({ offset: true });

const updateSchema = z.object({
  business_id: z.string().uuid(),
  business: z.object({
    name: z.string().trim().min(2).max(140),
    category: z.string().trim().min(2).max(100),
    description: z.string().max(800).nullable().optional(),
    contact_name: z.string().max(140).nullable().optional(),
    contact_email: z.string().email().max(200).nullable().or(z.literal("")).optional(),
    contact_phone: z.string().max(40).nullable().optional(),
    phone: z.string().max(40).nullable().optional(),
    whatsapp: z.string().max(80).nullable().optional(),
    instagram: z.string().max(300).nullable().optional(),
    address: z.string().max(300).nullable().optional(),
    city: z.string().max(120).nullable().optional(),
    state: z.string().max(2).nullable().optional(),
    postal_code: z.string().max(20).nullable().optional(),
    maps_url: z.string().max(1200).nullable().optional(),
    google_review_url: z.string().max(1200).nullable().optional(),
    website: z.string().max(1200).nullable().optional(),
    services_url: z.string().max(1200).nullable().optional(),
    services_label: z.string().max(80).nullable().optional(),
    logo_url: z.string().max(1200).nullable().optional(),
    cover_url: z.string().max(1200).nullable().optional(),
    primary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).nullable().optional(),
    secondary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).nullable().optional(),
    account_status: z.enum(statusValues),
    internal_notes: z.string().max(3000).nullable().optional(),
  }),
  experience: experienceSchema,
  billing: z.object({
    plate_price: z.coerce.number().min(0).max(999999),
    plate_payment_status: z.enum(platePaymentValues),
    plate_paid_at: dbDateTime.nullable().optional(),
    subscription_enabled: z.boolean(),
    subscription_plan_id: z.string().max(50).nullable().optional(),
    subscription_price: z.coerce.number().min(0).max(999999).nullable().optional(),
    subscription_status: z.enum(subscriptionValues),
    last_payment_at: dbDateTime.nullable().optional(),
    next_due_date: z.string().nullable().optional(),
    payment_method: z.string().max(80).nullable().optional(),
    notes: z.string().max(1000).nullable().optional(),
  }),
  device: z.object({
    id: z.string().uuid(),
    status: z.enum(deviceStatusValues),
    location: z.string().trim().min(2).max(100),
    experience_mode: z.enum(["direct_review","smart_page"]),
  }).nullable().optional(),
});

const paymentSchema = z.object({
  business_id: z.string().uuid(),
  kind: z.enum(["plate","subscription","service","other"]),
  description: z.string().max(250).nullable().optional(),
  amount: z.coerce.number().positive().max(999999),
  paid_at: dbDateTime.optional(),
  payment_method: z.string().max(80).nullable().optional(),
  notes: z.string().max(1000).nullable().optional(),
});

function clean(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function httpUrl(value?: string | null) {
  const raw = clean(value);
  if (!raw) return null;
  const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  const parsed = new URL(candidate);
  if (!["http:","https:"].includes(parsed.protocol)) throw new Error("URL inválida.");
  return parsed.toString();
}

function whatsappUrl(value?: string | null) {
  const raw = clean(value);
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return httpUrl(raw);
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 10) throw new Error("WhatsApp inválido.");
  return `https://wa.me/${digits.startsWith("55") ? digits : `55${digits}`}`;
}

function instagramUrl(value?: string | null) {
  const raw = clean(value);
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return httpUrl(raw);
  const handle = raw.replace(/^@/, "").replace(/\s/g, "");
  if (!handle) throw new Error("Instagram inválido.");
  return `https://instagram.com/${handle}`;
}

function mapsUrl(input: { maps_url?: string | null; address?: string | null; city?: string | null; state?: string | null }) {
  const explicit = clean(input.maps_url);
  if (explicit) return httpUrl(explicit);
  const address = clean(input.address);
  if (!address) return null;
  const query = [address, clean(input.city), clean(input.state)].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function authError(auth: Awaited<ReturnType<typeof requireAdmin>>) {
  if (auth.ok) return null;
  return NextResponse.json({ error: auth.reason === "config" ? "Supabase não configurado." : auth.reason === "unauthenticated" ? "Não autenticado." : "Acesso negado." }, { status: auth.status });
}

export async function GET() {
  const auth = await requireAdmin();
  const denied = authError(auth);
  if (denied) return denied;

  const service = createServiceClient();
  const [businessesResult, experiencesResult, devicesResult, billingResult, linksResult, paymentsResult] = await Promise.all([
    service.from("businesses").select("*").order("created_at", { ascending: false }),
    service.from("business_experiences").select("*"),
    service.from("tap_devices").select("id,business_id,code,name,location,active,status,experience_mode,created_at").order("created_at", { ascending: false }),
    service.from("business_billing").select("*"),
    service.from("business_links").select("id,business_id,title,type,url,order_index,is_active"),
    service.from("payments").select("id,business_id,kind,description,amount,due_date,paid_at,status,payment_method,created_at").order("created_at", { ascending: false }).limit(500),
  ]);

  const firstError = [businessesResult.error, experiencesResult.error, devicesResult.error, billingResult.error, linksResult.error, paymentsResult.error].find(Boolean);
  if (firstError) {
    console.error("Falha ao carregar contas", firstError.message);
    return NextResponse.json({ error: "Não foi possível carregar os clientes." }, { status: 500 });
  }

  const experiences = new Map((experiencesResult.data ?? []).map((row) => [row.business_id, row]));
  const billings = new Map((billingResult.data ?? []).map((row) => [row.business_id, row]));
  const devices = new Map<string, typeof devicesResult.data>();
  for (const row of devicesResult.data ?? []) devices.set(row.business_id, [...(devices.get(row.business_id) ?? []), row]);
  const links = new Map<string, typeof linksResult.data>();
  for (const row of linksResult.data ?? []) links.set(row.business_id, [...(links.get(row.business_id) ?? []), row]);
  const payments = new Map<string, typeof paymentsResult.data>();
  for (const row of paymentsResult.data ?? []) payments.set(row.business_id, [...(payments.get(row.business_id) ?? []), row]);

  const accounts = (businessesResult.data ?? []).map((business) => ({
    business,
    experience: experiences.get(business.id) ?? null,
    billing: billings.get(business.id) ?? null,
    devices: devices.get(business.id) ?? [],
    links: links.get(business.id) ?? [],
    payments: (payments.get(business.id) ?? []).slice(0, 20),
  }));

  const billingRows = billingResult.data ?? [];
  const summary = {
    clients: accounts.length,
    active: (businessesResult.data ?? []).filter((row) => row.account_status === "active" && row.is_active).length,
    platePending: billingRows.filter((row) => ["pending","overdue"].includes(row.plate_payment_status)).length,
    subscribers: billingRows.filter((row) => row.subscription_enabled && row.subscription_status === "active").length,
    overdue: billingRows.filter((row) => row.subscription_status === "overdue").length,
    mrr: billingRows.reduce((total, row) => total + (row.subscription_enabled && row.subscription_status === "active" ? Number(row.subscription_price ?? 0) : 0), 0),
  };

  return NextResponse.json({ accounts, summary });
}

async function syncLink(
  service: ReturnType<typeof createServiceClient>,
  businessId: string,
  currentLinks: Array<{ id: string; type: string }>,
  type: string,
  enabled: boolean,
  title: string,
  url: string | null,
  orderIndex: number
) {
  const sameType = currentLinks.filter((link) => link.type === type);
  if (!enabled) {
    if (sameType.length) await service.from("business_links").update({ is_active: false }).eq("business_id", businessId).eq("type", type);
    return;
  }
  if (!url) {
    if (sameType.length) {
      await service.from("business_links").update({ is_active: false }).eq("business_id", businessId).eq("type", type);
    }
    return false;
  }
  if (sameType[0]) {
    await service.from("business_links").update({ title, url, is_active: true, order_index: orderIndex }).eq("id", sameType[0].id);
  } else {
    await service.from("business_links").insert({ business_id: businessId, title, type, url, icon: type, is_active: true, order_index: orderIndex });
  }
  return true;
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdmin();
  const denied = authError(auth);
  if (denied) return denied;

  try {
    const parsed = updateSchema.safeParse(await request.json());
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      const field = issue?.path?.join(".");
      return NextResponse.json(
        { error: field ? `Revise o campo ${field}: ${issue.message}` : "Revise os dados informados.", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const { business_id: businessId, business, experience, billing, device } = parsed.data;
    const google = clean(business.google_review_url);
    if (experience.google_enabled) {
      const validation = validateDestinationUrl(google, "google_review");
      if (!validation.isValid) return NextResponse.json({ error: validation.error || "Link de avaliação Google inválido." }, { status: 400 });
      business.google_review_url = validation.sanitizedUrl;
    }

    let website: string | null = null;
    let services: string | null = null;
    let whatsapp: string | null = null;
    let instagram: string | null = null;
    let maps: string | null = null;
    try {
      website = httpUrl(business.website);
      services = httpUrl(business.services_url);
      whatsapp = whatsappUrl(business.whatsapp);
      instagram = instagramUrl(business.instagram);
      maps = mapsUrl(business);
    } catch (error) {
      return NextResponse.json({ error: error instanceof Error ? error.message : "Existe um endereço inválido." }, { status: 400 });
    }

    const warnings: string[] = [];
    if (experience.whatsapp_enabled && !whatsapp) warnings.push("WhatsApp está ativado, mas falta o número/link.");
    if (experience.services_enabled && !services) warnings.push("Serviços / cardápio está ativado, mas falta o link.");
    if (experience.maps_enabled && !maps) warnings.push("Localização está ativada, mas falta endereço completo ou link do Google Maps.");
    if (experience.instagram_enabled && !instagram) warnings.push("Instagram está ativado, mas falta o perfil/link.");
    if (experience.website_enabled && !website) warnings.push("Site está ativado, mas falta a URL.");
    if (experience.wifi_enabled && !clean(experience.wifi_ssid)) warnings.push("Wi-Fi está ativado, mas falta o nome da rede.");

    const service = createServiceClient();
    const { data: currentLinks, error: linksError } = await service.from("business_links").select("id,type").eq("business_id", businessId);
    if (linksError) return NextResponse.json({ error: "Não foi possível validar os links atuais." }, { status: 500 });

    const businessUpdate = {
      name: business.name,
      category: business.category,
      description: clean(business.description),
      contact_name: clean(business.contact_name),
      contact_email: clean(business.contact_email),
      contact_phone: clean(business.contact_phone),
      phone: clean(business.phone),
      whatsapp: clean(business.whatsapp),
      instagram: clean(business.instagram),
      address: clean(business.address),
      city: clean(business.city),
      state: clean(business.state)?.toUpperCase(),
      postal_code: clean(business.postal_code),
      maps_url: clean(business.maps_url),
      google_review_url: clean(business.google_review_url),
      website: clean(business.website),
      services_url: clean(business.services_url),
      services_label: clean(business.services_label) || "Serviços / cardápio",
      logo_url: clean(business.logo_url),
      cover_url: clean(business.cover_url),
      primary_color: clean(business.primary_color) || "#20252A",
      secondary_color: clean(business.secondary_color) || "#C78D4E",
      account_status: business.account_status,
      internal_notes: clean(business.internal_notes),
      is_active: !["inactive","suspended","cancelled"].includes(business.account_status),
      plan_id: billing.subscription_enabled ? (billing.subscription_plan_id || "pro") : "free",
    };

    const { error: businessError } = await service.from("businesses").update(businessUpdate).eq("id", businessId);
    if (businessError) throw businessError;

    const { error: experienceError } = await service.from("business_experiences").upsert({
      business_id: businessId,
      ...experience,
      wifi_ssid: clean(experience.wifi_ssid),
      wifi_password: clean(experience.wifi_password),
    }, { onConflict: "business_id" });
    if (experienceError) throw experienceError;

    const billingUpdate = {
      business_id: businessId,
      plate_price: billing.plate_price,
      plate_payment_status: billing.plate_payment_status,
      plate_paid_at: billing.plate_payment_status === "paid" ? (billing.plate_paid_at || new Date().toISOString()) : billing.plate_paid_at || null,
      subscription_enabled: billing.subscription_enabled,
      subscription_plan_id: billing.subscription_enabled ? (billing.subscription_plan_id || "pro") : null,
      subscription_price: billing.subscription_enabled ? (billing.subscription_price ?? 29.9) : null,
      subscription_status: billing.subscription_enabled ? billing.subscription_status : "not_subscribed",
      last_payment_at: billing.last_payment_at || null,
      next_due_date: billing.next_due_date || null,
      payment_method: clean(billing.payment_method),
      notes: clean(billing.notes),
      updated_at: new Date().toISOString(),
    };
    const { error: billingError } = await service.from("business_billing").upsert(billingUpdate, { onConflict: "business_id" });
    if (billingError) throw billingError;

    if (device) {
      const { error: deviceError } = await service.from("tap_devices").update({
        status: device.status,
        active: device.status === "active",
        location: device.location,
        experience_mode: device.experience_mode,
      }).eq("id", device.id).eq("business_id", businessId);
      if (deviceError) throw deviceError;
    }

    const links = currentLinks ?? [];
    await syncLink(service, businessId, links, "google_review", experience.google_enabled, "Avaliar no Google", clean(business.google_review_url), 10);
    await syncLink(service, businessId, links, "whatsapp", experience.whatsapp_enabled, "Falar no WhatsApp", whatsapp, 20);
    await syncLink(service, businessId, links, "menu", experience.services_enabled, clean(business.services_label) || "Serviços / cardápio", services, 30);
    await syncLink(service, businessId, links, "maps", experience.maps_enabled, "Como chegar", maps, 40);
    await syncLink(service, businessId, links, "instagram", experience.instagram_enabled, "Instagram", instagram, 50);
    await syncLink(service, businessId, links, "website", experience.website_enabled, "Visitar site", website, 60);

    return NextResponse.json({ success: true, warnings });
  } catch (error) {
    console.error("Erro ao atualizar conta", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Não foi possível salvar." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  const denied = authError(auth);
  if (denied) return denied;

  try {
    const parsed = paymentSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Dados do pagamento inválidos." }, { status: 400 });
    const service = createServiceClient();
    const paidAt = parsed.data.paid_at || new Date().toISOString();

    const { data: payment, error } = await service.from("payments").insert({
      business_id: parsed.data.business_id,
      kind: parsed.data.kind,
      description: clean(parsed.data.description),
      amount: parsed.data.amount,
      paid_at: paidAt,
      status: "paid",
      payment_method: clean(parsed.data.payment_method),
      notes: clean(parsed.data.notes),
    }).select("*").single();
    if (error) throw error;

    if (parsed.data.kind === "plate") {
      await service.from("business_billing").update({ plate_payment_status: "paid", plate_paid_at: paidAt, payment_method: clean(parsed.data.payment_method), updated_at: new Date().toISOString() }).eq("business_id", parsed.data.business_id);
    }
    if (parsed.data.kind === "subscription") {
      await service.from("business_billing").update({ subscription_enabled: true, subscription_status: "active", last_payment_at: paidAt, payment_method: clean(parsed.data.payment_method), updated_at: new Date().toISOString() }).eq("business_id", parsed.data.business_id);
    }

    return NextResponse.json({ success: true, payment }, { status: 201 });
  } catch (error) {
    console.error("Erro ao registrar pagamento", error);
    return NextResponse.json({ error: "Não foi possível registrar o pagamento." }, { status: 500 });
  }
}
