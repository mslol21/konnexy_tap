import React from "react";
import Link from "next/link";
import Logo from "@/components/brand/Logo";

export default function Footer() {
  return (
    <footer className="bg-[#181C21] text-slate-300 text-sm border-t border-white/10">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-12 py-14">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          
          {/* Col 1 — Marca e Propósito */}
          <div className="md:col-span-6 space-y-4">
            <Logo theme="dark" size="md" showTagline={false} />
            <p className="text-[#9BA3AB] text-sm sm:text-base leading-relaxed max-w-md">
              Agência especializada em ajudar negócios locais a fortalecer sua presença no Google e transformar atendimento presencial em reputação digital.
            </p>
            <p className="text-xs text-[#BD7B48] font-semibold italic">
              &ldquo;Sua reputação digital começa no atendimento presencial.&rdquo;
            </p>
          </div>

          {/* Col 2 — Navegação */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-white font-bold text-xs uppercase tracking-widest">
              Navegação
            </div>
            <ul className="space-y-2.5 text-sm text-[#9BA3AB]">
              <li>
                <a href="#como-funciona" className="hover:text-[#BD7B48] transition-colors">
                  Como funciona
                </a>
              </li>
              <li>
                <a href="#beneficios" className="hover:text-[#BD7B48] transition-colors">
                  Benefícios da placa
                </a>
              </li>
              <li>
                <a href="#para-quem-e" className="hover:text-[#BD7B48] transition-colors">
                  Para quem é
                </a>
              </li>
              <li>
                <a href="#preco" className="hover:text-[#BD7B48] transition-colors">
                  Preço e reserva
                </a>
              </li>
              <li>
                <a href="#duvidas" className="hover:text-[#BD7B48] transition-colors">
                  Dúvidas frequentes
                </a>
              </li>
              <li>
                <Link href="/demo" className="hover:text-[#BD7B48] transition-colors text-[#D9945F] font-medium">
                  Ver demonstração
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 — Área do Cliente */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-white font-bold text-xs uppercase tracking-widest">
              Área do Cliente
            </div>
            <ul className="space-y-2.5 text-sm text-[#9BA3AB]">
              <li>
                <Link href="/login" className="hover:text-[#BD7B48] transition-colors">
                  Acessar painel
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#BD7B48] transition-colors">
                  Gerenciar placa
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Rodapé Legal */}
        <div className="pt-8 border-t border-white/10 space-y-3">
          <p className="text-xs text-[#6D7277] max-w-3xl mx-auto leading-relaxed text-center">
            <strong className="text-[#9BA3AB]">Aviso legal:</strong> Otimiza Meu Negócio não tem afiliação, associação, autorização, endosso ou vínculo oficial de qualquer natureza com o Google LLC. &quot;Google&quot; e &quot;Google Maps&quot; são marcas registradas do Google LLC, utilizadas apenas para descrição do serviço. Todas as marcas pertencem aos seus respectivos titulares.
          </p>
          <div className="text-xs text-[#6D7277] text-center">
            © {new Date().getFullYear()} Otimiza Meu Negócio. Todos os direitos reservados.
          </div>
        </div>

      </div>
    </footer>
  );
}
