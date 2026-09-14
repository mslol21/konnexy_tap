import React from "react";
import Link from "next/link";
import Logo from "@/components/brand/Logo";

export default function Footer() {
  return (
    <footer className="bg-[#F5F3EF] text-[#242A30] text-sm border-t border-[#E5E1D8]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-12 py-14">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          
          {/* Col 1 — Marca Oficial e Propósito */}
          <div className="md:col-span-6 space-y-4">
            <div className="inline-block py-1">
              <Logo theme="light" size="md" />
            </div>
            <p className="text-[#666E7A] text-sm sm:text-base leading-relaxed max-w-md">
              Agência especializada em ajudar negócios locais a fortalecer sua presença no Google e transformar atendimento presencial em reputação digital.
            </p>
            <p className="text-xs text-[#BD7B48] font-bold italic">
              &ldquo;Sua reputação digital começa no atendimento presencial.&rdquo;
            </p>
          </div>

          {/* Col 2 — Navegação */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-[#242A30] font-bold text-xs uppercase tracking-widest">
              Navegação
            </div>
            <ul className="space-y-2.5 text-sm text-[#666E7A]">
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
                <Link href="/demo" className="hover:text-[#BD7B48] transition-colors text-[#BD7B48] font-semibold">
                  Ver demonstração
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 — Área do Cliente */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-[#242A30] font-bold text-xs uppercase tracking-widest">
              Área do Cliente
            </div>
            <ul className="space-y-2.5 text-sm text-[#666E7A]">
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
        <div className="pt-8 border-t border-[#E5E1D8] space-y-3">
          <p className="text-xs text-[#8A929E] max-w-3xl mx-auto leading-relaxed text-center">
            <strong className="text-[#666E7A]">Aviso legal:</strong> Otimiza Meu Negócio não tem afiliação, associação, autorização, endosso ou vínculo oficial de qualquer natureza com o Google LLC. &quot;Google&quot; e &quot;Google Maps&quot; são marcas registradas do Google LLC, utilizadas apenas para descrição do serviço. Todas as marcas pertencem aos seus respectivos titulares.
          </p>
          <div className="text-xs text-[#8A929E] text-center">
            © {new Date().getFullYear()} Otimiza Meu Negócio. Todos os direitos reservados.
          </div>
        </div>

      </div>
    </footer>
  );
}
