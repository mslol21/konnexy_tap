"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  BadgeDollarSign,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Loader2,
  MapPin,
  RefreshCw,
  Save,
  Smartphone,
  Store,
  Users,
  Wifi,
} from "lucide-react";

type Business = {
  id: string; name: string; slug: string; category: string; description?: string | null;
  contact_name?: string | null; contact_email?: string | null; contact_phone?: string | null;
  phone?: string | null; whatsapp?: string | null; instagram?: string | null;
  address?: string | null; city?: string | null; state?: string | null; postal_code?: string | null;
  maps_url?: string | null; google_review_url?: string | null; website?: string | null;
  services_url?: string | null; services_label?: string | null;
  account_status: "lead"|"onboarding"|"active"|"inactive"|"suspended"|"cancelled";
  internal_notes?: string | null; plan_id: string; is_active: boolean;
};

type Experience = {
  business_id: string; google_enabled: boolean; whatsapp_enabled: boolean; services_enabled: boolean;
  maps_enabled: boolean; wifi_enabled: boolean; feedback_enabled: boolean; promotions_enabled: boolean;
  instagram_enabled: boolean; website_enabled: boolean; wifi_ssid?: string | null; wifi_password?: string | null;
};

type Billing = {
  business_id: string; plate_price: number; plate_payment_status: "pending"|"paid"|"overdue"|"cancelled"|"refunded";
  plate_paid_at?: string | null; subscription_enabled: boolean; subscription_plan_id?: string | null;
  subscription_price?: number | null; subscription_status: "not_subscribed"|"trial"|"pending"|"active"|"overdue"|"suspended"|"cancelled";
  last_payment_at?: string | null; next_due_date?: string | null; payment_method?: string | null; notes?: string | null;
};

type Device = {
  id: string; code: string; name: string; location: string; active: boolean;
  status: "pending"|"active"|"inactive"|"suspended"; experience_mode: "direct_review"|"smart_page";
};

type Payment = {
  id: string; kind: string; description?: string | null; amount: number; paid_at?: string | null;
  status: string; payment_method?: string | null; created_at: string;
};

type Account = {
  business: Business;
  experience: Experience | null;
  billing: Billing | null;
  devices: Device[];
  payments: Payment[];
};

type Summary = { clients:number; active:number; platePending:number; subscribers:number; overdue:number; mrr:number };

const defaultExperience = (id:string): Experience => ({
  business_id:id, google_enabled:true, whatsapp_enabled:false, services_enabled:false,
  maps_enabled:false, wifi_enabled:false, feedback_enabled:true, promotions_enabled:false,
  instagram_enabled:false, website_enabled:false, wifi_ssid:"", wifi_password:"",
});

const defaultBilling = (id:string): Billing => ({
  business_id:id, plate_price:79.9, plate_payment_status:"pending", plate_paid_at:null,
  subscription_enabled:false, subscription_plan_id:null, subscription_price:29.9,
  subscription_status:"not_subscribed", last_payment_at:null, next_due_date:null, payment_method:"", notes:"",
});

function money(value:number) {
  return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(Number(value || 0));
}

function Input({label,value,onChange,placeholder,type="text"}:{label:string;value:string|number|null|undefined;onChange:(v:string)=>void;placeholder?:string;type?:string}) {
  return <label className="block">
    <span className="text-[11px] font-bold text-slate-300">{label}</span>
    <input type={type} value={value ?? ""} onChange={(e)=>onChange(e.target.value)} placeholder={placeholder}
      className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-gold-400" />
  </label>;
}

function Select({label,value,onChange,children}:{label:string;value:string;onChange:(v:string)=>void;children:React.ReactNode}) {
  return <label className="block">
    <span className="text-[11px] font-bold text-slate-300">{label}</span>
    <select value={value} onChange={(e)=>onChange(e.target.value)}
      className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-gold-400">
      {children}
    </select>
  </label>;
}

function Toggle({label,checked,onChange}:{label:string;checked:boolean;onChange:(v:boolean)=>void}) {
  return <label className="flex items-center justify-between gap-3 rounded-xl border border-slate-700 bg-slate-950 px-3 py-3">
    <span className="text-sm font-semibold text-white">{label}</span>
    <input type="checkbox" checked={checked} onChange={(e)=>onChange(e.target.checked)} className="h-5 w-5" />
  </label>;
}

function AccountEditor({account,onSaved}:{account:Account;onSaved:()=>void}) {
  const [business,setBusiness]=useState<Business>(account.business);
  const [experience,setExperience]=useState<Experience>(account.experience ?? defaultExperience(account.business.id));
  const [billing,setBilling]=useState<Billing>(account.billing ?? defaultBilling(account.business.id));
  const [device,setDevice]=useState<Device|null>(account.devices[0] ?? null);
  const [saving,setSaving]=useState(false);
  const [paymentBusy,setPaymentBusy]=useState(false);
  const [message,setMessage]=useState<{kind:"ok"|"error";text:string}|null>(null);

  useEffect(()=>{
    setBusiness(account.business);
    setExperience(account.experience ?? defaultExperience(account.business.id));
    setBilling(account.billing ?? defaultBilling(account.business.id));
    setDevice(account.devices[0] ?? null);
  },[account]);

  const patchBusiness=<K extends keyof Business>(key:K,value:Business[K])=>setBusiness((v)=>({...v,[key]:value}));
  const patchExperience=<K extends keyof Experience>(key:K,value:Experience[K])=>setExperience((v)=>({...v,[key]:value}));
  const patchBilling=<K extends keyof Billing>(key:K,value:Billing[K])=>setBilling((v)=>({...v,[key]:value}));
  const patchDevice=<K extends keyof Device>(key:K,value:Device[K])=>setDevice((v)=>v?({...v,[key]:value}):v);

  const save=async()=>{
    setSaving(true); setMessage(null);
    try{
      const response=await fetch("/api/admin/accounts",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({
        business_id:business.id,business,experience,billing,device
      })});
      const data=await response.json().catch(()=>({}));
      if(!response.ok) throw new Error(typeof data.error==="string"?data.error:"Não foi possível salvar.");
      setMessage({kind:"ok",text:"Conta, recursos, placa e financeiro atualizados."});
      onSaved();
    }catch(error){
      setMessage({kind:"error",text:error instanceof Error?error.message:"Não foi possível salvar."});
    }finally{setSaving(false);}
  };

  const registerPayment=async(kind:"plate"|"subscription")=>{
    setPaymentBusy(true); setMessage(null);
    try{
      const amount=kind==="plate"?Number(billing.plate_price):Number(billing.subscription_price ?? 29.9);
      const response=await fetch("/api/admin/accounts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
        business_id:business.id,kind,amount,payment_method:billing.payment_method || "manual",
        description:kind==="plate"?"Pagamento da placa NFC":"Mensalidade"
      })});
      const data=await response.json().catch(()=>({}));
      if(!response.ok) throw new Error(typeof data.error==="string"?data.error:"Falha ao registrar pagamento.");
      setMessage({kind:"ok",text:kind==="plate"?"Placa marcada como paga.":"Mensalidade registrada como paga."});
      onSaved();
    }catch(error){
      setMessage({kind:"error",text:error instanceof Error?error.message:"Falha ao registrar pagamento."});
    }finally{setPaymentBusy(false);}
  };

  return <details className="group rounded-3xl border border-slate-700 bg-slate-800/80 overflow-hidden">
    <summary className="cursor-pointer list-none p-4 sm:p-5 flex items-start justify-between gap-3 sm:gap-4">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-black text-white truncate">{business.name}</h2>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${business.account_status==="active"?"bg-emerald-500/15 text-emerald-300":"bg-amber-500/15 text-amber-300"}`}>{business.account_status}</span>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${billing.plate_payment_status==="paid"?"bg-emerald-500/15 text-emerald-300":"bg-rose-500/15 text-rose-300"}`}>placa {billing.plate_payment_status}</span>
        </div>
        <div className="mt-1 text-xs text-slate-400">{business.category}{business.city? ` • ${business.city}`:""}{device? ` • ${device.code}`:""}</div>
      </div>
      <ChevronDown className="w-5 h-5 text-slate-400 transition-transform group-open:rotate-180 shrink-0" />
    </summary>

    <div className="border-t border-slate-700 p-4 sm:p-5 space-y-6">
      {message&&<div className={`rounded-xl border px-3 py-2 text-xs flex gap-2 ${message.kind==="ok"?"border-emerald-500/30 bg-emerald-500/10 text-emerald-200":"border-rose-500/30 bg-rose-500/10 text-rose-200"}`}>
        {message.kind==="ok"?<CheckCircle2 className="w-4 h-4 shrink-0"/>:<AlertCircle className="w-4 h-4 shrink-0"/>}{message.text}
      </div>}

      <section>
        <div className="flex items-center gap-2 text-xs font-black uppercase text-gold-400 mb-3"><Users className="w-4 h-4"/>Conta / responsável</div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <Input label="Responsável" value={business.contact_name} onChange={(v)=>patchBusiness("contact_name",v)} />
          <Input label="E-mail" type="email" value={business.contact_email} onChange={(v)=>patchBusiness("contact_email",v)} />
          <Input label="Telefone do responsável" value={business.contact_phone} onChange={(v)=>patchBusiness("contact_phone",v)} />
          <Select label="Status da conta" value={business.account_status} onChange={(v)=>patchBusiness("account_status",v as Business["account_status"])}>
            <option value="lead">Lead</option><option value="onboarding">Onboarding</option><option value="active">Ativo</option>
            <option value="inactive">Inativo</option><option value="suspended">Suspenso</option><option value="cancelled">Cancelado</option>
          </Select>
          <div className="md:col-span-2"><Input label="Observações internas" value={business.internal_notes} onChange={(v)=>patchBusiness("internal_notes",v)} /></div>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 text-xs font-black uppercase text-gold-400 mb-3"><Store className="w-4 h-4"/>Dados do negócio</div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <Input label="Nome do estabelecimento" value={business.name} onChange={(v)=>patchBusiness("name",v)} />
          <Input label="Categoria" value={business.category} onChange={(v)=>patchBusiness("category",v)} />
          <Input label="Telefone" value={business.phone} onChange={(v)=>patchBusiness("phone",v)} />
          <Input label="WhatsApp" value={business.whatsapp} onChange={(v)=>patchBusiness("whatsapp",v)} placeholder="11 99999-9999" />
          <Input label="Instagram" value={business.instagram} onChange={(v)=>patchBusiness("instagram",v)} placeholder="@empresa" />
          <Input label="Site" value={business.website} onChange={(v)=>patchBusiness("website",v)} placeholder="https://..." />
          <Input label="Endereço" value={business.address} onChange={(v)=>patchBusiness("address",v)} />
          <Input label="Cidade" value={business.city} onChange={(v)=>patchBusiness("city",v)} />
          <Input label="UF" value={business.state} onChange={(v)=>patchBusiness("state",v.slice(0,2).toUpperCase())} />
          <Input label="CEP" value={business.postal_code} onChange={(v)=>patchBusiness("postal_code",v)} />
          <div className="md:col-span-2"><Input label="Google Maps (opcional se endereço estiver preenchido)" value={business.maps_url} onChange={(v)=>patchBusiness("maps_url",v)} placeholder="https://maps.google.com/..." /></div>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 text-xs font-black uppercase text-gold-400 mb-3"><Smartphone className="w-4 h-4"/>Recursos da página inteligente</div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <Toggle label="Avaliação Google" checked={experience.google_enabled} onChange={(v)=>patchExperience("google_enabled",v)} />
            {experience.google_enabled&&<Input label="Link oficial de avaliação" value={business.google_review_url} onChange={(v)=>patchBusiness("google_review_url",v)} placeholder="https://g.page/.../review" />}
          </div>
          <div className="space-y-2">
            <Toggle label="WhatsApp" checked={experience.whatsapp_enabled} onChange={(v)=>patchExperience("whatsapp_enabled",v)} />
            {experience.whatsapp_enabled&&<Input label="Número / link do WhatsApp" value={business.whatsapp} onChange={(v)=>patchBusiness("whatsapp",v)} />}
          </div>
          <div className="space-y-2">
            <Toggle label="Serviços / cardápio" checked={experience.services_enabled} onChange={(v)=>patchExperience("services_enabled",v)} />
            {experience.services_enabled&&<div className="grid gap-2 sm:grid-cols-2"><Input label="Nome do botão" value={business.services_label} onChange={(v)=>patchBusiness("services_label",v)} /><Input label="Link" value={business.services_url} onChange={(v)=>patchBusiness("services_url",v)} placeholder="https://..." /></div>}
          </div>
          <div className="space-y-2">
            <Toggle label="Localização" checked={experience.maps_enabled} onChange={(v)=>patchExperience("maps_enabled",v)} />
            {experience.maps_enabled&&<div className="text-[11px] text-slate-400 px-1 flex gap-1"><MapPin className="w-3.5 h-3.5"/>Usa o link Maps ou o endereço cadastrado acima.</div>}
          </div>
          <div className="space-y-2">
            <Toggle label="Instagram" checked={experience.instagram_enabled} onChange={(v)=>patchExperience("instagram_enabled",v)} />
            {experience.instagram_enabled&&<Input label="Perfil / URL" value={business.instagram} onChange={(v)=>patchBusiness("instagram",v)} />}
          </div>
          <div className="space-y-2">
            <Toggle label="Site" checked={experience.website_enabled} onChange={(v)=>patchExperience("website_enabled",v)} />
            {experience.website_enabled&&<Input label="URL do site" value={business.website} onChange={(v)=>patchBusiness("website",v)} />}
          </div>
          <div className="space-y-2">
            <Toggle label="Wi-Fi para clientes" checked={experience.wifi_enabled} onChange={(v)=>patchExperience("wifi_enabled",v)} />
            {experience.wifi_enabled&&<div className="grid gap-2 sm:grid-cols-2"><Input label="Rede Wi-Fi" value={experience.wifi_ssid} onChange={(v)=>patchExperience("wifi_ssid",v)} /><Input label="Senha" value={experience.wifi_password} onChange={(v)=>patchExperience("wifi_password",v)} /></div>}
          </div>
          <div className="space-y-2">
            <Toggle label="Feedback privado" checked={experience.feedback_enabled} onChange={(v)=>patchExperience("feedback_enabled",v)} />
            <Toggle label="Promoções" checked={experience.promotions_enabled} onChange={(v)=>patchExperience("promotions_enabled",v)} />
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 text-xs font-black uppercase text-gold-400 mb-3"><Smartphone className="w-4 h-4"/>Placa NFC / QR</div>
        {device?<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Input label="Código" value={device.code} onChange={()=>{}} />
          <Input label="Local" value={device.location} onChange={(v)=>patchDevice("location",v)} />
          <Select label="Status da placa" value={device.status} onChange={(v)=>patchDevice("status",v as Device["status"])}>
            <option value="active">Ativa</option><option value="pending">Pendente</option><option value="inactive">Inativa</option><option value="suspended">Suspensa</option>
          </Select>
          <Select label="Modo" value={device.experience_mode} onChange={(v)=>patchDevice("experience_mode",v as Device["experience_mode"])}>
            <option value="smart_page">Página inteligente</option><option value="direct_review">Direto para avaliação</option>
          </Select>
        </div>:<div className="text-xs text-slate-400">Nenhuma placa vinculada a este negócio.</div>}
        {account.devices.length>1&&<div className="mt-2 text-[11px] text-slate-400">Este cliente possui {account.devices.length} placas. A edição acima controla a placa principal mais recente.</div>}
      </section>

      <section>
        <div className="flex items-center gap-2 text-xs font-black uppercase text-gold-400 mb-3"><CreditCard className="w-4 h-4"/>Financeiro</div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Input label="Valor da placa" type="number" value={billing.plate_price} onChange={(v)=>patchBilling("plate_price",Number(v))} />
          <Select label="Pagamento da placa" value={billing.plate_payment_status} onChange={(v)=>patchBilling("plate_payment_status",v as Billing["plate_payment_status"])}>
            <option value="pending">Pendente</option><option value="paid">Pago</option><option value="overdue">Atrasado</option><option value="cancelled">Cancelado</option><option value="refunded">Reembolsado</option>
          </Select>
          <Input label="Forma de pagamento" value={billing.payment_method} onChange={(v)=>patchBilling("payment_method",v)} placeholder="Pix, dinheiro..." />
          <div className="flex items-end"><button type="button" disabled={paymentBusy||billing.plate_payment_status==="paid"} onClick={()=>void registerPayment("plate")} className="w-full rounded-xl bg-emerald-500 px-3 py-2.5 text-xs font-black text-slate-950 disabled:opacity-40">Registrar placa paga</button></div>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-900/60 p-4">
          <Toggle label="Possui mensalidade" checked={billing.subscription_enabled} onChange={(v)=>{patchBilling("subscription_enabled",v);patchBilling("subscription_status",v?"pending":"not_subscribed");}} />
          {billing.subscription_enabled&&<div className="grid gap-3 md:grid-cols-4 mt-3">
            <Select label="Plano" value={billing.subscription_plan_id || "pro"} onChange={(v)=>patchBilling("subscription_plan_id",v)}><option value="pro">Pro</option><option value="free">Básico</option></Select>
            <Input label="Valor mensal" type="number" value={billing.subscription_price ?? 29.9} onChange={(v)=>patchBilling("subscription_price",Number(v))} />
            <Select label="Status mensalidade" value={billing.subscription_status} onChange={(v)=>patchBilling("subscription_status",v as Billing["subscription_status"])}>
              <option value="pending">Pendente</option><option value="active">Em dia</option><option value="overdue">Atrasada</option><option value="trial">Teste</option><option value="suspended">Suspensa</option><option value="cancelled">Cancelada</option>
            </Select>
            <Input label="Próximo vencimento" type="date" value={billing.next_due_date} onChange={(v)=>patchBilling("next_due_date",v)} />
            <div className="md:col-span-4"><button type="button" disabled={paymentBusy} onClick={()=>void registerPayment("subscription")} className="rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-black text-slate-950 disabled:opacity-40">Registrar mensalidade paga</button></div>
          </div>}
        </div>

        {account.payments.length>0&&<div className="mt-4 overflow-x-auto">
          <table className="w-full text-xs"><thead className="text-left text-slate-400"><tr><th className="py-2">Data</th><th>Tipo</th><th>Valor</th><th>Status</th></tr></thead>
          <tbody className="divide-y divide-slate-700">{account.payments.slice(0,6).map((payment)=><tr key={payment.id}><td className="py-2 text-slate-300">{new Date(payment.paid_at || payment.created_at).toLocaleDateString("pt-BR")}</td><td className="text-slate-300">{payment.kind}</td><td className="font-bold text-white">{money(Number(payment.amount))}</td><td className="text-emerald-300">{payment.status}</td></tr>)}</tbody></table>
        </div>}
      </section>

      <div className="sticky bottom-3 flex justify-end">
        <button type="button" onClick={()=>void save()} disabled={saving} className="rounded-xl bg-gold-500 px-5 py-3 text-sm font-black text-navy-950 shadow-xl disabled:opacity-50 flex items-center gap-2">
          {saving?<Loader2 className="w-4 h-4 animate-spin"/>:<Save className="w-4 h-4"/>}Salvar ficha completa
        </button>
      </div>
    </div>
  </details>;
}

export default function AdminClientesPage() {
  const [accounts,setAccounts]=useState<Account[]>([]);
  const [summary,setSummary]=useState<Summary>({clients:0,active:0,platePending:0,subscribers:0,overdue:0,mrr:0});
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");

  const load=async(silent=false)=>{
    if(!silent)setLoading(true);
    setError("");
    try{
      const response=await fetch("/api/admin/accounts",{cache:"no-store"});
      const data=await response.json().catch(()=>({}));
      if(!response.ok) throw new Error(typeof data.error==="string"?data.error:"Não foi possível carregar clientes.");
      setAccounts(data.accounts || []);
      setSummary(data.summary || {clients:0,active:0,platePending:0,subscribers:0,overdue:0,mrr:0});
    }catch(err){setError(err instanceof Error?err.message:"Não foi possível carregar clientes.");}
    finally{if(!silent)setLoading(false);}
  };

  useEffect(()=>{void load();},[]);
  const ordered=useMemo(()=>[...accounts].sort((a,b)=>Number(b.business.account_status==="active")-Number(a.business.account_status==="active")),[accounts]);

  return <div className="space-y-5">
    <header className="rounded-3xl border border-slate-700 bg-slate-800 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div><div className="text-xs font-black uppercase text-gold-400 flex items-center gap-2"><BadgeDollarSign className="w-4 h-4"/>Gestão comercial</div><h1 className="mt-2 text-2xl font-black text-white">Clientes, contas e placas</h1><p className="mt-1 text-xs text-slate-400">Dados do cliente, recursos ativos, status da placa e financeiro em uma única ficha.</p></div>
      <button onClick={()=>void load()} className="rounded-xl bg-slate-700 px-4 py-2.5 text-xs font-bold text-white flex items-center gap-2 self-start"><RefreshCw className={`w-4 h-4 ${loading?"animate-spin":""}`}/>Atualizar</button>
    </header>

    <section className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      {([
        {label:"Clientes",value:String(summary.clients),icon:Users},
        {label:"Ativos",value:String(summary.active),icon:CheckCircle2},
        {label:"Placas pendentes",value:String(summary.platePending),icon:CreditCard},
        {label:"Mensalistas",value:String(summary.subscribers),icon:BadgeDollarSign},
        {label:"Mensalidades atrasadas",value:String(summary.overdue),icon:AlertCircle},
        {label:"MRR",value:money(summary.mrr),icon:BadgeDollarSign},
      ] satisfies Array<{label:string;value:string;icon:LucideIcon}>).map(({label,value,icon:Icon})=><div key={label} className="rounded-2xl border border-slate-700 bg-slate-800 p-4"><Icon className="w-4 h-4 text-gold-400"/><div className="mt-2 text-xl font-black text-white">{value}</div><div className="mt-1 text-[10px] uppercase font-bold text-slate-400">{label}</div></div>)}
    </section>

    {error&&<div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-200">{error}</div>}
    {loading?<div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-gold-400"/></div>:
      ordered.length===0?<div className="rounded-2xl border border-slate-700 bg-slate-800 p-8 text-center text-sm text-slate-400">Nenhum cliente cadastrado.</div>:
      <div className="space-y-3">{ordered.map((account)=><AccountEditor key={account.business.id} account={account} onSaved={()=>void load(true)} />)}</div>}
  </div>;
}
