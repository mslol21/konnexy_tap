"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Radio,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Building,
  MapPin,
  Globe,
  Palette,
  CheckSquare,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Form State
  const [name, setName] = useState("Café & Bistrô Central");
  const [category, setCategory] = useState("Cafeteria & Restaurante");
  const [phone, setPhone] = useState("(11) 98765-4321");
  const [whatsapp, setWhatsapp] = useState("11987654321");

  const [address, setAddress] = useState("Av. Paulista, 1000 - Bela Vista");
  const [city, setCity] = useState("São Paulo");
  const [state, setState] = useState("SP");
  const [postalCode, setPostalCode] = useState("01310-100");
  const [mapsUrl, setMapsUrl] = useState("https://maps.google.com/?q=Av+Paulista+1000");

  const [instagram, setInstagram] = useState("@cafebistro_central");
  const [website, setWebsite] = useState("https://cafebistrocentral.com.br");
  const [googleReviewUrl, setGoogleReviewUrl] = useState("https://search.google.com/local/writereview");

  const [logoUrl, setLogoUrl] = useState("https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&auto=format&fit=crop&q=80");
  const [coverUrl, setCoverUrl] = useState("https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80");
  const [primaryColor, setPrimaryColor] = useState("#0F2744");
  const [secondaryColor, setSecondaryColor] = useState("#D4AF37");

  // Funções Selecionadas
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    "google",
    "whatsapp",
    "instagram",
    "maps",
    "menu",
    "promo",
    "club",
  ]);

  const toggleFeature = (key: string) => {
    if (selectedFeatures.includes(key)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== key));
    } else {
      setSelectedFeatures([...selectedFeatures, key]);
    }
  };

  const nextStep = () => {
    if (step < 6) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const featuresList = [
    { key: "google", label: "Avaliações no Google", desc: "Direciona para avaliação de 5 estrelas" },
    { key: "whatsapp", label: "Falar no WhatsApp", desc: "Abre conversa com mensagem pronta" },
    { key: "instagram", label: "Perfil do Instagram", desc: "Aumenta seus seguidores locais" },
    { key: "maps", label: "Localização (Google Maps)", desc: "Traça rota direta até sua porta" },
    { key: "menu", label: "Cardápio do dia", desc: "Acesso rápido aos pratos e bebidas" },
    { key: "catalog", label: "Catálogo de Produtos", desc: "Vitrine virtual de itens e estoque" },
    { key: "booking", label: "Agendamento de Horários", desc: "Link para sistema ou calendário" },
    { key: "promo", label: "Promoções & Combos", desc: "Destaque de ofertas ativas no balcão" },
    { key: "club", label: "Clube de Clientes VIP", desc: "Captura de nomes e WhatsApps com LGPD" },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-2xl mx-auto w-full">
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-9 h-9 rounded-xl bg-gold-500 text-navy-950 flex items-center justify-center font-bold shadow-md">
              <Radio className="w-4 h-4" />
            </div>
            <span className="text-xl font-black text-white">
              Konnexy<span className="text-gold-400">Tap</span>
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Configuração do seu Estabelecimento
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Passo {step > 5 ? 5 : step} de 5 • Conectando sua placa física ao mundo digital
          </p>

          {/* Barra de Progresso */}
          <div className="w-full bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-gold-500 to-amber-400 h-full transition-all duration-300 rounded-full"
              style={{ width: `${(Math.min(step, 5) / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Card do Passo Atual */}
        <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-200">
          {/* PASSO 1 */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                <Building className="w-5 h-5 text-navy-800" />
                <h2 className="text-lg font-bold text-navy-950">
                  Passo 1: Dados do Estabelecimento
                </h2>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nome do Estabelecimento *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Pizzaria Bella Italia"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Categoria de Negócio *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-800 bg-white"
                >
                  <option>Cafeteria & Padaria</option>
                  <option>Restaurante & Bar</option>
                  <option>Barbearia & Salão</option>
                  <option>Petshop & Veterinária</option>
                  <option>Clínica & Consultório</option>
                  <option>Loja & Varejo</option>
                  <option>Oficina & Mecânica</option>
                  <option>Outros serviços</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Telefone Fixo
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 3333-4444"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    WhatsApp Comercial *
                  </label>
                  <input
                    type="tel"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-800"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PASSO 2 */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                <MapPin className="w-5 h-5 text-rose-600" />
                <h2 className="text-lg font-bold text-navy-950">
                  Passo 2: Endereço e Localização
                </h2>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Endereço Completo (Rua e Número) *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ex: Rua das Flores, 123"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Estado *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={2}
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-800 uppercase text-center"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    CEP
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="00000-000"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Link do Google Maps
                  </label>
                  <input
                    type="url"
                    value={mapsUrl}
                    onChange={(e) => setMapsUrl(e.target.value)}
                    placeholder="https://maps.google.com/..."
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-800"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PASSO 3 */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                <Globe className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-navy-950">
                  Passo 3: Presença Digital & Google
                </h2>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Link Direto de Avaliações do Google (Crucial) *
                </label>
                <input
                  type="url"
                  required
                  value={googleReviewUrl}
                  onChange={(e) => setGoogleReviewUrl(e.target.value)}
                  placeholder="https://search.google.com/local/writereview?placeid=..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-800"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Encontre no seu Perfil da Empresa no Google $\rightarrow$ “Pedir avaliações”.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Instagram (@seu_negocio)
                  </label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="@seunegocio"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Site / Link Principal
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://seusite.com.br"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-800"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PASSO 4 */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                <Palette className="w-5 h-5 text-gold-500" />
                <h2 className="text-lg font-bold text-navy-950">
                  Passo 4: Identidade Visual & Cores
                </h2>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  URL da Logomarca
                </label>
                <input
                  type="url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://sua-logo.png"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  URL da Imagem de Capa
                </label>
                <input
                  type="url"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  placeholder="https://sua-capa.jpg"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Cor Primária
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                    />
                    <span className="text-xs font-mono font-bold text-slate-700">
                      {primaryColor}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Cor Secundária / Destaque
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                    />
                    <span className="text-xs font-mono font-bold text-slate-700">
                      {secondaryColor}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PASSO 5 */}
          {step === 5 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                <CheckSquare className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-navy-950">
                  Passo 5: Selecione as Funções Ativas
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                Escolha quais botões aparecerão na página quando o cliente aproximar o celular da placa física:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
                {featuresList.map((item) => {
                  const isChecked = selectedFeatures.includes(item.key);
                  return (
                    <div
                      key={item.key}
                      onClick={() => toggleFeature(item.key)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                        isChecked
                          ? "bg-amber-50/70 border-amber-300 text-navy-950 shadow-2xs"
                          : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-1 rounded text-navy-900 border-slate-300 focus:ring-navy-700"
                      />
                      <div>
                        <div className="text-xs font-bold leading-tight">
                          {item.label}
                        </div>
                        <div className="text-[10px] text-slate-500 leading-tight mt-0.5">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SUCESSO / TELA FINAL CONFORME ITEM 12 */}
          {step === 6 && (
            <div className="text-center py-6 space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
                Configuração Concluída
              </div>
              <h2 className="text-2xl font-black text-navy-950">
                Sua página está pronta!
              </h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Sua placa física já pode ser vinculada. Acesse sua URL oficial ou configure mais detalhes pelo painel:
              </p>

              <div className="p-4 bg-slate-100 rounded-2xl border border-slate-300 inline-block font-mono text-xs font-bold text-navy-950 select-all">
                tap.konnexy.com.br/{slug}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => router.push(`/${slug}`)}
                  className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-50 text-navy-950 font-bold text-xs rounded-xl border border-slate-300 transition-all flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <ExternalLink className="w-4 h-4" />
                  Visualizar Página Pública
                </button>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="w-full sm:w-auto px-6 py-3 bg-navy-950 hover:bg-navy-900 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-gold-400" />
                  Ir para o Dashboard
                </button>
              </div>
            </div>
          )}

          {/* Botões de Navegação dos Passos */}
          {step <= 5 && (
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-navy-950 transition-colors flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-navy-950 hover:bg-navy-900 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                {step === 5 ? "Concluir e Ativar Página" : "Próximo Passo"}
                <ArrowRight className="w-4 h-4 text-gold-400" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
