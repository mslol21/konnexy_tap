"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Radio,
  ExternalLink,
  LogOut,
  Menu,
  X,
  MessageCircle,
} from "lucide-react";
import Logo from "@/components/brand/Logo";
import { createClient } from "@/lib/supabase/client";

type Device = {
  id: string;
  code: string;
  name: string;
  location: string;
  status: string;
  active: boolean;
};

type AccountPayload = {
  business: { id: string; name: string };
  devices: Device[];
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [account, setAccount] = useState<AccountPayload | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/dashboard/account", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!cancelled && data?.business) setAccount(data as AccountPayload);
      })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, []);

  const primaryDevice = useMemo(
    () => account?.devices.find((item) => item.status === "active" || item.active) ?? account?.devices[0] ?? null,
    [account]
  );

  const navItems = [
    { label: "Minha placa & acessos", href: "/dashboard", icon: LayoutDashboard },
    { label: "Minhas placas", href: "/dashboard/placas", icon: Radio },
  ];

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  };

  return (
    <>
      <div className="lg:hidden bg-[#20252A] text-white px-4 py-3.5 flex items-center justify-between border-b border-white/10 sticky top-0 z-40">
        <Logo theme="dark" size="sm" showTagline={false} />
        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          className="min-h-11 min-w-11 p-2 rounded-xl bg-[#2D343B] text-[#9BA3AB] hover:text-white flex items-center justify-center"
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={"fixed lg:static inset-y-0 left-0 z-50 w-[86vw] max-w-72 lg:w-64 bg-[#20252A] text-[#9BA3AB] flex flex-col justify-between border-r border-white/10 overflow-y-auto transition-transform duration-200 " +
          (mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0")}
      >
        <div>
          <div className="p-5 border-b border-white/10">
            <div className="flex items-center justify-between gap-3">
              <Logo theme="dark" size="sm" showTagline={false} />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="lg:hidden min-h-10 min-w-10 rounded-lg bg-[#2D343B] flex items-center justify-center"
                aria-label="Fechar menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-[#2D343B] border border-white/10">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#C78D4E]/20 text-[#D8A66C] flex items-center justify-center font-bold text-xs shrink-0">
                  {(account?.business.name || "N").substring(0, 1).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">
                    {account?.business.name || "Carregando estabelecimento..."}
                  </div>
                  <div className="text-[10px] text-[#C78D4E] font-medium truncate">
                    {primaryDevice
                      ? "Placa " + primaryDevice.code + " • " + (primaryDevice.status === "active" ? "Ativa" : primaryDevice.status)
                      : "Aguardando placa vinculada"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={"flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all " +
                    (isActive
                      ? "bg-[#C78D4E] text-white font-bold shadow-sm"
                      : "text-[#9BA3AB] hover:text-white hover:bg-[#2D343B]")}
                >
                  <Icon className={"w-4 h-4 " + (isActive ? "text-white" : "text-[#6D7277]")} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="pt-4 pb-1 px-3">
              <span className="text-[10px] uppercase font-bold text-[#6D7277] tracking-wider">
                Suporte
              </span>
            </div>

            <a
              href="https://wa.me/5511982930221"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold text-[#9BA3AB] hover:text-white hover:bg-[#2D343B] transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#C78D4E]" />
              <span>Suporte no WhatsApp</span>
            </a>
          </nav>
        </div>

        <div className="p-4 border-t border-white/10 space-y-2 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          {primaryDevice && (
            <Link
              href={"/t/" + primaryDevice.code + "?src=direct"}
              target="_blank"
              className="w-full py-2.5 px-3 rounded-xl bg-[#2D343B] hover:bg-[#353D46] text-[#9BA3AB] hover:text-white text-xs font-semibold flex items-center justify-between gap-2 border border-white/10 transition-colors"
            >
              <span className="flex items-center gap-2 min-w-0">
                <ExternalLink className="w-3.5 h-3.5 text-[#C78D4E] shrink-0" />
                <span className="truncate">Testar redirecionamento</span>
              </span>
              <span className="text-[10px] bg-[#20252A] px-1.5 py-0.5 rounded text-[#D8A66C] font-mono border border-white/10 shrink-0">
                {primaryDevice.code}
              </span>
            </Link>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="w-full min-h-11 py-2 px-3 rounded-xl text-[#9BA3AB] hover:text-red-400 hover:bg-[#2D343B] text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair da conta</span>
          </button>
        </div>
      </aside>
    </>
  );
}
