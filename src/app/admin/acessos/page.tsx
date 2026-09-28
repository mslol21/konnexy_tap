"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Copy, ExternalLink, Loader2, QrCode, Radio, Search, Settings2 } from "lucide-react";

type Plate = {
  id:string; code:string; location:string; status:string; experience_mode?:string;
  access_count?:number; nfc_count?:number; qr_count?:number; direct_count?:number;
  businesses?: { name?:string; category?:string; city?:string; state?:string } | null;
};

export default function AccessControlPage(){
  const [items,setItems]=useState<Plate[]>([]);
  const [loading,setLoading]=useState(true);
  const [query,setQuery]=useState("");
  const [copied,setCopied]=useState("");
  const [origin,setOrigin]=useState("");

  useEffect(()=>{
    setOrigin(window.location.origin);
    fetch("/api/admin/plates",{cache:"no-store"}).then(r=>r.json()).then(d=>setItems(d.plates||[])).finally(()=>setLoading(false));
  },[]);

  const filtered=useMemo(()=>{
    const q=query.trim().toLowerCase();
    return items.filter(x=>!q || x.code.toLowerCase().includes(q) || (x.businesses?.name||"").toLowerCase().includes(q));
  },[items,query]);

  const copy=async(value:string,label:string)=>{await navigator.clipboard.writeText(value);setCopied(label);setTimeout(()=>setCopied(""),1500);};

  if(loading)return <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-gold-400"/></div>;

  return <div className="space-y-5">
    <header className="p-6 rounded-3xl bg-slate-800 border border-slate-700">
      <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">Controle operacional</div>
      <h1 className="text-2xl font-black text-white mt-2">Clientes, NFC e QR Code</h1>
      <p className="text-xs text-slate-400 mt-1">Consulte cada cadastro, copie os links permanentes e acompanhe separadamente os acessos por NFC e QR Code.</p>
    </header>

    <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar empresa ou código da placa..." className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white text-sm"/></div>

    <div className="grid md:grid-cols-3 gap-3">
      <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700"><div className="text-xs text-slate-400">Clientes / placas</div><div className="text-2xl font-black text-white mt-1">{items.length}</div></div>
      <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700"><div className="text-xs text-emerald-400">Acessos NFC</div><div className="text-2xl font-black text-white mt-1">{items.reduce((a,x)=>a+(x.nfc_count||0),0)}</div></div>
      <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700"><div className="text-xs text-gold-400">Acessos QR Code</div><div className="text-2xl font-black text-white mt-1">{items.reduce((a,x)=>a+(x.qr_count||0),0)}</div></div>
    </div>

    <div className="space-y-3">{filtered.map(item=>{
      const base=origin||"https://otimizameunegocio.vercel.app";
      const nfc=base+"/t/"+item.code+"?src=nfc";
      const qr=base+"/t/"+item.code+"?src=qr";
      return <section key={item.id} className="p-4 sm:p-5 rounded-2xl bg-slate-800 border border-slate-700">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div><div className="flex flex-wrap items-center gap-2"><h2 className="font-black text-white">{item.businesses?.name||item.code}</h2><span className="px-2 py-1 rounded-lg bg-slate-900 text-[10px] font-mono text-gold-400">{item.code}</span></div><p className="text-xs text-slate-400 mt-1">{[item.businesses?.category,item.businesses?.city,item.businesses?.state].filter(Boolean).join(" • ")} · {item.location}</p></div>
          <div className="grid grid-cols-3 gap-2 w-full lg:w-auto lg:min-w-[260px]"><div className="p-2.5 rounded-xl bg-slate-900 text-center"><div className="text-[10px] text-slate-500">TOTAL</div><div className="font-black text-white">{item.access_count||0}</div></div><div className="p-2.5 rounded-xl bg-slate-900 text-center"><div className="text-[10px] text-emerald-400">NFC</div><div className="font-black text-white">{item.nfc_count||0}</div></div><div className="p-2.5 rounded-xl bg-slate-900 text-center"><div className="text-[10px] text-gold-400">QR</div><div className="font-black text-white">{item.qr_count||0}</div></div></div>
        </div>
        <div className="grid lg:grid-cols-2 gap-3 mt-4">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-700"><div className="flex items-center gap-2 text-xs font-bold text-emerald-400"><Radio className="w-4 h-4"/>Link NFC</div><div className="text-[11px] font-mono text-slate-300 break-all mt-2">{nfc}</div><div className="flex flex-wrap gap-2 mt-3"><button onClick={()=>copy(nfc,"nfc-"+item.id)} className="px-3 py-2 rounded-lg bg-slate-700 text-xs font-bold flex gap-1.5 items-center"><Copy className="w-3.5 h-3.5"/>{copied==="nfc-"+item.id?"Copiado":"Copiar"}</button><a href={nfc} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-lg border border-slate-700 text-xs font-bold flex gap-1.5 items-center"><ExternalLink className="w-3.5 h-3.5"/>Testar</a></div></div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-700"><div className="flex items-center gap-2 text-xs font-bold text-gold-400"><QrCode className="w-4 h-4"/>Link QR Code</div><div className="text-[11px] font-mono text-slate-300 break-all mt-2">{qr}</div><div className="flex gap-2 mt-3"><button onClick={()=>copy(qr,"qr-"+item.id)} className="px-3 py-2 rounded-lg bg-slate-700 text-xs font-bold flex gap-1.5 items-center"><Copy className="w-3.5 h-3.5"/>{copied==="qr-"+item.id?"Copiado":"Copiar"}</button><a href={qr} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-lg border border-slate-700 text-xs font-bold flex gap-1.5 items-center"><ExternalLink className="w-3.5 h-3.5"/>Testar</a></div></div>
        </div>
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 mt-4"><Link href={"/admin/placas?edit="+item.id} className="px-3 py-2 rounded-lg bg-gold-500 text-navy-950 text-xs font-black flex items-center gap-1.5"><Settings2 className="w-3.5 h-3.5"/>Editar cadastro</Link><Link href="/admin/experiencias" className="px-3 py-2 rounded-lg border border-slate-600 text-xs font-bold text-white">Recursos inteligentes</Link><span className="px-3 py-2 text-[11px] text-slate-400">Modo: {item.experience_mode==="smart_page"?"Página inteligente":"Google direto"}</span></div>
      </section>;
    })}</div>
  </div>;
}