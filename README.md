# Konnexy Tap 📲✨

> **“Um toque conecta seu cliente ao seu negócio.”**

Plataforma SaaS completa voltada para pequenos e médios comércios brasileiros. Conecta placas físicas **NFC + QR Code** inteligentes ao estabelecimento comercial, permitindo que o cliente aproxime o celular da placa no balcão ou na mesa e acesse instantaneamente uma página inteligente com ações de alto valor.

---

## 🎯 Conceito do Produto & Arquitetura

O estabelecimento recebe uma **placa física Konnexy Tap** (R$ 79,90 pagamento único) contendo:
- Chip NFC embutido;
- QR Code impresso em alta definição;
- Identidade visual com chamada “Aproxime seu celular”;
- **URL permanente gerenciada**: ex: `https://tap.konnexy.com.br/t/A7K92` (ou com origem `?src=nfc` / `?src=qr`).

> ⚠️ **Regra Fundamental**: A placa física **NUNCA** aponta diretamente para Google, WhatsApp ou Instagram. Ela sempre aponta para a URL gerenciada da Konnexy Tap. Dessa forma, o comerciante altera telefones, cardápio, redes sociais e promoções pelo painel administrativo a qualquer momento, sem nunca precisar reprogramar ou substituir a placa física.

---

## ⭐ Respeito às Políticas do Google (Sem Review Gating)

A Konnexy Tap segue rigorosamente as diretrizes oficiais de avaliações do Google:
- **NÃO** possui mecanismos antiéticos de bloqueio ("Gostou? Sim -> Google; Não -> Feedback").
- O botão **⭐ Avaliar no Google** é 100% público, direto e independente.
- A função **💡 Enviar sugestão à gerência** é um canal apartado para diálogo construtivo.

---

## 🔒 Conformidade Total com a LGPD

O módulo **Clube de Clientes VIP** respeita a Lei Geral de Proteção de Dados (Lei 13.709/2018):
- Coleta estrita de dados necessários (Nome, WhatsApp, Data de nascimento opcional);
- Checkbox de consentimento explícito **NUNCA** pré-marcado;
- Registro de auditoria de consentimento (`consent_at`, `source`);
- Opção de exclusão imediata dos dados pelo painel a pedido do titular;
- Exportação em formato CSV estruturado para campanhas no WhatsApp;
- Isolamento total multi-tenant (o Comércio A nunca tem acesso aos clientes do Comércio B).

---

## 🛠️ Stack Tecnológica

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router, Server Components & Route Handlers)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Design System**: [Tailwind CSS](https://tailwindcss.com/) com paleta corporativa Navy & Gold
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Visualização de Dados**: [Recharts](https://recharts.org/)
- **QR Code**: `qrcode.react` e renderização SVG/Canvas de alta definição para impressão gráfica
- **Banco de Dados & RLS**: [Supabase](https://supabase.com/) (PostgreSQL com Row Level Security estrito)

---

## 🚀 Como Executar o Projeto Localmente

### 1. Clonar e Instalar Dependências

```bash
cd tag_konnexy
npm install
```

### 2. Configurar Variáveis de Ambiente (Opcional)

Copie o arquivo `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

> 💡 **Nota:** O sistema possui uma camada de dados demonstrativos e fallback inteligente. Você pode rodar e demonstrar todas as telas (Landing page, Demonstração do Café da Ana, Onboarding, Dashboard, Placas, Links, Campanhas, Clientes e Métricas) imediatamente, mesmo antes de criar um projeto no Supabase!

### 3. Rodar em Modo de Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 🗄️ Estrutura do Banco de Dados & Supabase

As migrations com todas as tabelas, índices e políticas de Row Level Security (RLS) estão disponíveis em:
- [`supabase/migrations/20260914_init_schema.sql`](supabase/migrations/20260914_init_schema.sql)
- Seed de dados demonstrativos: [`supabase/seed.sql`](supabase/seed.sql)

### Tabelas Criadas:
1. `profiles`: Dados do usuário autenticado.
2. `businesses`: Estabelecimentos comerciais (multi-tenant).
3. `business_members`: Membros e papéis (`owner`, `admin`, `staff`).
4. `tap_devices`: Placas físicas NFC e QR Codes cadastrados.
5. `business_links`: Botões configuráveis da página pública.
6. `campaigns`: Promoções ativas e combos de ticket médio.
7. `customers`: Clientes cadastrados no Clube VIP.
8. `customer_consents`: Registro formal de consentimento LGPD.
9. `events`: Telemetria anônima de toques NFC e cliques em botões.
10. `plans` & `subscriptions`: Estrutura SaaS (Gratuito Perpétuo e Tap Pro R$ 29,90/mês).

---

## 📱 Rotas Principais da Aplicação

| Rota | Descrição |
| :--- | :--- |
| `/` | Landing page comercial com hero, mockup interativo de smartphone, fluxo físico-digital, segmentos, preços e FAQ |
| `/demo` | Demonstração comercial interativa do **Café da Ana** para vendas em campo |
| `/t/[code]` | Rota ultrarrápida da placa física NFC (ex: `/t/A7K92?src=nfc`) |
| `/[slug]` | Rota web direta do estabelecimento (ex: `/cafe-da-ana`) |
| `/login` | Autenticação do lojista (com atalho para teste instantâneo) |
| `/cadastro` | Cadastro de novo comerciante |
| `/onboarding` | Wizard de 5 passos para configuração rápida da primeira placa |
| `/dashboard` | Painel principal com métricas de hoje e gráficos |
| `/dashboard/minha-pagina` | Editor split-screen com preview de smartphone em tempo real |
| `/dashboard/placas` | Gerenciamento de placas físicas NFC e download de QR Codes |
| `/dashboard/links` | Gestão de botões (Google, WhatsApp, Cardápio, Maps, etc.) |
| `/dashboard/campanhas` | Criação de promoções ativas e combos promocionais |
| `/dashboard/clientes` | Clube de Clientes com consentimento LGPD e exportação CSV |
| `/dashboard/metricas` | Relatórios de engajamento, horários de pico e proporção NFC vs QR |
| `/dashboard/qrcode` | Central de download de posters para gráfica em alta resolução |
| `/dashboard/personalizacao`| Ajuste de cores da marca, tema e logomarcas |
| `/dashboard/plano` | Comparativo de planos e vitrine de Upsell Soluções Konnexy |
| `/dashboard/configuracoes` | Dados da empresa e controle multi-tenant de membros |

---

## ☁️ Deploy na Vercel

1. Suba o repositório para o GitHub ou GitLab.
2. Crie um novo projeto na [Vercel](https://vercel.com).
3. Adicione as variáveis de ambiente descritas em `.env.example`.
4. O build executará `next build` e estará pronto para produção em instantes.

---

## 📄 Licença

Konnexy Tap © Todos os direitos reservados. Desenvolvido para o comércio brasileiro.
