"use client";

import React, { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { usePathname } from "next/navigation";

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function PwaInstallButton() {
  const pathname = usePathname();
  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone);

    setInstalled(isStandalone);

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as InstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setPromptEvent(null);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const eligiblePath =
    pathname === "/login" ||
    pathname === "/admin-login" ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin");

  if (!eligiblePath || installed || !promptEvent) return null;

  const install = async () => {
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    if (choice.outcome === "accepted") setPromptEvent(null);
  };

  return (
    <button
      type="button"
      onClick={install}
      className="fixed z-[80] bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 sm:right-6 min-h-11 px-4 py-3 rounded-2xl bg-[#20252A] text-white shadow-xl border border-white/10 flex items-center gap-2 text-xs font-bold active:scale-[0.98]"
      aria-label="Instalar Otimiza Meu Negócio"
    >
      <Download className="w-4 h-4 text-[#D8A66C]" />
      Instalar aplicativo
    </button>
  );
}
