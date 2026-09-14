import React from "react";
import Link from "next/link";
import Logo from "@/components/brand/Logo";

export default function Footer() {
  return (
    <footer className="bg-[#040711] text-slate-300 text-sm border-t border-white/10">
      <div className="max-w-[1520px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
          {/* Col 1 */}
          <div className="space-y-4 md:col-span-2">
            <Logo theme="dark" size="md" showTagline={true} badge="Reviews" />
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-md">
              Facilitando para clientes avaliarem estabelecimentos comerciais brasileiros no Google com placas físicas inteligentes NFC + QR Code.
            </p>
            <p className="text-xs sm:text-sm text-cyan-400 font-bold italic">
              “Um toque conecta seu cliente ao seu negócio.”
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-3">
            <div className="text-white font-extrabold text-sm uppercase tracking-wider">
              Navegação
            </div>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#como-funciona" className="hover:text-cyan-400 transition-colors">
                  Como funciona
                </a>
              </li>
              <li>
                <a href="#beneficios" className="hover:text-cyan-400 transition-colors">
                  Benefícios da placa
                </a>
              </li>
              <li>
                <a href="#segmentos" className="hover:text-cyan-400 transition-colors">
                  Segmentos atendidos
                </a>
              </li>
              <li>
                <Link href="/demo" className="hover:text-cyan-400 transition-colors text-cyan-400 font-bold">
                  Simulação de Vendas
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <div className="text-white font-extrabold text-sm uppercase tracking-wider">
              Área Administrativa
            </div>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/login" className="hover:text-cyan-400 transition-colors">
                  Acessar Painel
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-cyan-400 transition-colors text-cyan-400 font-bold">
                  Operação Admin (Lote 1)
                </Link>
              </li>
              <li>
                <Link href="/recuperar-senha" className="hover:text-cyan-400 transition-colors">
                  Recuperar Senha
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Linha de rodapé */}
        <div className="pt-8 border-t border-white/10 text-center space-y-3">
          <p className="text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed">
            <strong>Aviso de Isenção:</strong> Konnexy Tap não é afiliada, associada, autorizada, endossada ou de qualquer forma oficialmente conectada ao Google LLC. Todas as marcas registradas são propriedade de seus respectivos titulares.
          </p>
          <div className="text-xs text-slate-400">
            © {new Date().getFullYear()} Konnexy Tap Reviews. Primeiro lote físico. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
}
