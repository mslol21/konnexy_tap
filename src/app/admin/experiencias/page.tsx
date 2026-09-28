"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Save, Wifi, Sparkles } from "lucide-react";

type Experience = {
  business_id: string;
  google_enabled: boolean; whatsapp_enabled: boolean; services_enabled: boolean;
  maps_enabled: boolean; wifi_enabled: boolean; feedback_enabled: boolean;
  promotions_enabled: boolean; instagram_enabled: boolean; website_enabled: boolean;
  wifi_ssid?: string | null; wifi_password?: string | null;
  businesses?: { id:string; name:string; slug:string; category?:string|null; city?:string|null; state?:string|null } | null;
};

export default function ExperiencesAdminPage() {
  const [items,setItems]=useState<Experience[]>([]);
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState<string|null>(null);
  const [message,setMessage]=useState("");

  useEffect(()=>{fetch("/api/admin/experiences",{cache:"no-store"}).then(r=>r.json()).then(d=>setItems(d.experiences||[])).finally(()=>setLoading(false));},[]);

  const patch=(id:string,key:keyof Experience,value:unknown)=>setItems(v=>v.map(x=>x.business_id===id?{...x,[key]:value}:x));
  const save=async(item:Experience)=>{
    setSaving(item.business_id); setMessage("");
    const r=await fetch("/api/admin/experiences",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(item)});
    setSaving(null); setMessage(r.ok?"Configuração salva.":"Não foi possível salvar.");
  };

  if(loading)return <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-gold-400"/></div>;
  return <div className="space-y-5">
    <header className="p-6 rounded-3xl bg-slate-800 border border-slate-700"><div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase"><Sparkles className="w-4 h-4"/>Experiência inteligente</div><h1 className="text-2xl font-black text-white mt-2">Recursos das páginas inteligentes</h1><p className="text-xs text-slate-400 mt-1">Ative somente o que fizer sentido para cada cliente. Fidelidade não faz parte desta versão.</p></header>
    {message&&<div className="text-xs text-emerald-300">{message}</div>}
    {items.length===0?<div className="p-8 rounded-2xl bg-slate-800 border border-slate-700 text-sm text-slate-400">Nenhuma experiência cadastrada.</div>:items.map(item=><section key={item.business_id} className="p-5 rounded-2xl bg-slate-800 border border-slate-700">
      <div className="mb-4"><div className="text-base font-black text-white">{item.businesses?.name || "Cliente"}</div><div className="text-xs text-slate-400 mt-1">{[item.businesses?.category,item.businesses?.city,item.businesses?.state].filter(Boolean).join(" • ") || "Dados do estabelecimento"} · <span className="font-mono text-gold-400">{item.business_id.slice(0,8)}</span></div></div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">{([
        ["google_enabled","Avaliação Google"],["whatsapp_enabled","WhatsApp"],["services_enabled","Serviços / cardápio"],["maps_enabled","Localização"],["instagram_enabled","Instagram"],["website_enabled","Site"],["wifi_enabled","Wi-Fi"],["feedback_enabled","Feedback privado"],["promotions_enabled","Promoções"]
      ] as [keyof Experience,string][]).map(([key,label])=><label key={key} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"><span>{label}</span><input type="checkbox" checked={Boolean(item[key])} onChange={e=>patch(item.business_id,key,e.target.checked)} className="w-4 h-4"/></label>)}</div>
      {item.wifi_enabled&&<div className="grid sm:grid-cols-2 gap-3 mt-4"><div><label className="text-xs text-slate-300 flex gap-1"><Wifi className="w-3.5 h-3.5"/>Rede Wi-Fi</label><input value={item.wifi_ssid||""} onChange={e=>patch(item.business_id,"wifi_ssid",e.target.value)} className="mt-1 w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"/></div><div><label className="text-xs text-slate-300">Senha</label><input value={item.wifi_password||""} onChange={e=>patch(item.business_id,"wifi_password",e.target.value)} className="mt-1 w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"/></div></div>}
      <button onClick={()=>save(item)} disabled={saving===item.business_id} className="mt-4 px-4 py-2.5 rounded-xl bg-gold-500 text-navy-950 text-xs font-black flex items-center gap-2 disabled:opacity-50">{saving===item.business_id?<Loader2 className="w-4 h-4 animate-spin"/>:<Save className="w-4 h-4"/>}Salvar</button>
    </section>)}
  </div>;
}
