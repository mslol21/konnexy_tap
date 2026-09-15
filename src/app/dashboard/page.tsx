import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Radio,
  QrCode,
  ExternalLink,
  MessageCircle,
  BarChart3,
  Building2,
  AlertCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

function startOfTodayIso() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.toISOString();
}

function daysAgoIso(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

export default async function MerchantDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: membership } = await supabase
    .from("business_members")
    .select("business_id, role")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!membership) {
    return (
      <div className="max-w-2xl mx-auto mt-12 bg-white border border-[#E8E3DD] rounded-3xl p-8 text-center shadow-sm">
        <Building2 className="w-10 h-10 text-[#C78D4E] mx-auto mb-4" />
        <h1 className="text-xl font-extrabold text-[#20252A]">Sua conta ainda não possui um estabelecimento vinculado</h1>
        <p className="text-sm text-[#6D7277] mt-2 leading-relaxed">
          Depois que sua placa for configurada, o estabelecimento aparecerá aqui automaticamente.
        </p>
        <Link href="/" className="inline-flex mt-6 px-5 py-2.5 rounded-xl bg-[#20252A] text-white text-sm font-bold">
          Voltar ao site
        </Link>
      </div>
    );
  }

  const businessId = membership.business_id;

  const [{ data: business }, { data: devices }, { data: recentEvents }, totalResult] = await Promise.all([
    supabase
      .from("businesses")
      .select("id, name, google_review_url, city, state")
      .eq("id", businessId)
      .maybeSingle(),
    supabase
      .from("tap_devices")
      .select("id, code, name, location, status, active, destination_url, destination_type, created_at")
      .eq("business_id", businessId)
      .order("created_at", { ascending: true }),
    supabase
      .from("events")
      .select("created_at, session_id")
      .eq("business_id", businessId)
      .eq("event_type", "review_redirect")
      .gte("created_at", daysAgoIso(30))
      .order("created_at", { ascending: false }),
    supabase
      .from("events")
      .select("id", { count: "exact", head: true })
      .eq("business_id", businessId)
      .eq("event_type", "review_redirect"),
  ]);

  if (!business) {
    return (
      <div className="max-w-2xl mx-auto mt-12 bg-amber-50 border border-amber-200 rounded-3xl p-8 text-center">
        <AlertCircle className="w-10 h-10 text-amber-600 mx-auto mb-4" />
        <h1 className="text-xl font-extrabold text-[#20252A]">Não foi possível carregar seu estabelecimento</h1>
        <p className="text-sm text-[#6D7277] mt-2">Entre em contato com o suporte para revisar o vínculo da sua conta.</p>
      </div>
    );
  }

  const events = recentEvents ?? [];
  const todayStart = new Date(startOfTodayIso()).getTime();
  const sevenDaysStart = new Date(daysAgoIso(7)).getTime();
  const thirtyDaysStart = new Date(daysAgoIso(30)).getTime();

  const today = events.filter((event) => new Date(event.created_at).getTime() >= todayStart).length;
  const last7Days = events.filter((event) => new Date(event.created_at).getTime() >= sevenDaysStart).length;
  const last30Days = events.filter((event) => new Date(event.created_at).getTime() >= thirtyDaysStart).length;
  const total = totalResult.count ?? 0;

  const nfc = events.filter((event) => event.session_id === "nfc").length;
  const qr = events.filter((event) => event.session_id === "qr").length;
  const identified = nfc + qr;
  const nfcPercentage = identified > 0 ? Math.round((nfc / identified) * 100) : 0;
  const qrPercentage = identified > 0 ? 100 - nfcPercentage : 0;

  const activeDevices = (devices ?? []).filter(
    (device) => (device.status ?? (device.active ? "active" : "inactive")) === "active"
  );
  const primaryDevice = activeDevices[0] ?? devices?.[0] ?? null;

  const configuredWhatsapp = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, "");
  const requestChangeUrl = configuredWhatsapp && primaryDevice
    ? `https://wa.me/${configuredWhatsapp}?text=${encodeURIComponent(
        `Olá! Sou do ${business.name} (placa ${primaryDevice.code}) e gostaria de atualizar o link de avaliação.`
      )}`
    : null;

  return (
    <div className="space-y-6">
      <section className="bg-white p-6 rounded-3xl border border-[#E8E3DD] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#6D7277] uppercase tracking-wider">
            <span className={`w-2.5 h-2.5 rounded-full ${activeDevices.length ? "bg-emerald-500" : "bg-amber-500"}`} />
            {activeDevices.length ? "Placa ativa" : "Aguardando ativação"}
          </div>
          <h1 className="text-2xl font-extrabold text-[#20252A] mt-1">{business.name}</h1>
          <p className="text-xs text-[#6D7277] mt-1">
            Acompanhe os acessos que passaram pela sua placa de avaliações.
          </p>
        </div>

        {primaryDevice && (
          <Link
            href={`/t/${primaryDevice.code}?src=direct`}
            target="_blank"
            className="px-4 py-2.5 bg-[#20252A] hover:bg-[#30363D] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#C78D4E]" />
            Testar placa
          </Link>
        )}
      </section>

      {primaryDevice ? (
        <section className="bg-white p-6 rounded-3xl border border-[#E8E3DD] shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#F5F3EF] border border-[#E8E3DD] flex items-center justify-center">
                <Radio className="w-5 h-5 text-[#C78D4E]" />
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase text-[#6D7277]">Minha placa</div>
                <div className="font-mono font-extrabold text-[#20252A]">{primaryDevice.code}</div>
                <div className="text-xs text-[#6D7277]">{primaryDevice.location}</div>
              </div>
            </div>

            {requestChangeUrl && (
              <a
                href={requestChangeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#F5F3EF] border border-[#E8E3DD] text-[#30363D] text-xs font-bold hover:border-[#C78D4E] transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#C78D4E]" />
                Solicitar alteração
              </a>
            )}
          </div>

          <div className="mt-5 p-4 bg-[#F7F5F2] border border-[#E8E3DD] rounded-2xl">
            <div className="text-[11px] font-bold text-[#6D7277] uppercase mb-1">Destino configurado</div>
            <div className="text-xs font-mono text-[#30363D] break-all">
              {primaryDevice.destination_url || business.google_review_url || "Aguardando configuração"}
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-white p-6 rounded-3xl border border-[#E8E3DD] text-center">
          <Radio className="w-8 h-8 text-[#C78D4E] mx-auto mb-3" />
          <h2 className="font-bold text-[#20252A]">Nenhuma placa cadastrada ainda</h2>
          <p className="text-xs text-[#6D7277] mt-1">Sua placa aparecerá aqui após a configuração pela equipe.</p>
        </section>
      )}

      <section>
        <div className="mb-3">
          <h2 className="text-sm font-bold text-[#20252A] uppercase tracking-wider">Acessos para avaliação</h2>
          <p className="text-xs text-[#6D7277]">São acessos ao link; não representam avaliações publicadas.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            ["Hoje", today],
            ["Últimos 7 dias", last7Days],
            ["Últimos 30 dias", last30Days],
            ["Total", total],
          ].map(([label, value]) => (
            <div key={String(label)} className="bg-white p-5 rounded-2xl border border-[#E8E3DD] shadow-sm">
              <div className="text-[11px] font-bold text-[#6D7277] uppercase">{label}</div>
              <div className="text-3xl font-extrabold text-[#20252A] mt-1">{value}</div>
              <div className="text-[11px] text-[#6D7277] mt-1">acessos registrados</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white p-6 rounded-3xl border border-[#E8E3DD] shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 className="w-4 h-4 text-[#C78D4E]" />
          <h3 className="text-sm font-bold text-[#20252A]">Origem dos acessos — últimos 30 dias</h3>
        </div>
        <p className="text-xs text-[#6D7277] mb-5">Comparação entre aproximação NFC e leitura do QR Code.</p>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#F7F5F2] border border-[#E8E3DD] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Radio className="w-5 h-5 text-[#C78D4E]" />
              <div>
                <div className="text-xs font-bold text-[#20252A]">NFC</div>
                <div className="text-[11px] text-[#6D7277]">{nfc} acessos identificados</div>
              </div>
            </div>
            <div className="text-2xl font-extrabold text-[#20252A]">{nfcPercentage}%</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F7F5F2] border border-[#E8E3DD] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <QrCode className="w-5 h-5 text-[#C78D4E]" />
              <div>
                <div className="text-xs font-bold text-[#20252A]">QR Code</div>
                <div className="text-[11px] text-[#6D7277]">{qr} acessos identificados</div>
              </div>
            </div>
            <div className="text-2xl font-extrabold text-[#20252A]">{qrPercentage}%</div>
          </div>
        </div>
      </section>
    </div>
  );
}
