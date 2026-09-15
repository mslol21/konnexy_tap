# Otimiza Meu Negócio — Placa Inteligente de Avaliações

> **Transforme bons atendimentos em mais presença no Google.**

MVP comercial de uma placa física **NFC + QR Code** configurada para levar o cliente diretamente ao fluxo de avaliação da empresa no Google.

O produto inicial é propositalmente simples: a placa fica no balcão, recepção ou caixa; o cliente aproxima o celular ou lê o QR Code; a aplicação valida a placa, registra o acesso e redireciona para o link oficial de avaliação configurado para aquele estabelecimento.

## Produto atual

- Placa física NFC + QR Code.
- Preço de referência do primeiro lote: **R$ 79,90 pagamento único**.
- Código individual não sequencial, atualmente no padrão `OM-XXXXX`.
- URL gerenciada para NFC e QR, por exemplo:
  - `/t/OM-ABCDE?src=nfc`
  - `/t/OM-ABCDE?src=qr`
- Redirecionamento HTTP 307 para o destino validado do Google.
- Telemetria de acessos sem afirmar que um acesso necessariamente virou uma avaliação.
- Funil administrativo de leads e reservas.
- Conversão operacional: **Lead → Estabelecimento → Placa**.

## O que não faz parte do MVP

Páginas inteligentes multi-link, clube de clientes, campanhas, exportação de contatos e demais recursos de SaaS amplo permanecem fora da oferta inicial. Componentes antigos podem continuar no repositório para evolução posterior, mas ficam ocultos ou desabilitados no produto comercial atual.

Use:

```env
NEXT_PUBLIC_ENABLE_SMART_PAGES=false
```

## Segurança

A implementação atual foi endurecida para evitar que telas demonstrativas sejam confundidas com operação real:

- `/admin`, `/dashboard`, `/cadastro` e `/onboarding` exigem autenticação;
- `/admin` exige registro explícito em `app_admins`;
- não existe bypass de login para usuário demo;
- leads podem ser enviados publicamente, mas somente administradores podem listá-los e alterá-los;
- placas não ficam enumeráveis pelo cliente público;
- o redirecionamento `/t/[code]` consulta a placa com `SUPABASE_SERVICE_ROLE_KEY` apenas no servidor;
- a service role nunca deve ser exposta com prefixo `NEXT_PUBLIC_`;
- URLs de avaliação passam por allowlist de domínios oficiais do Google;
- recursos de Fase 2 ficam fechados no MVP.

## Stack

- Next.js 15 / App Router
- React 19
- TypeScript strict
- Tailwind CSS
- Supabase PostgreSQL + Auth + RLS
- Zod
- Lucide React
- `qrcode.react`

## Desenvolvimento local

```bash
npm install
cp .env.example .env.local
npm run dev
```

A landing page pode ser desenvolvida sem um banco ativo. Entretanto, **cadastros, login, painel administrativo, métricas e operação real de placas não devem simular sucesso sem Supabase configurado**.

## Configuração do Supabase

O banco ainda pode ser criado posteriormente. Quando for criado, siga o guia:

`docs/SUPABASE_SETUP.md`

As migrations devem ser aplicadas nesta ordem:

1. `supabase/migrations/20260914_init_schema.sql`
2. `supabase/migrations/20260914_refactor_reviews_mvp.sql`
3. `supabase/migrations/20260915_security_hardening.sql`

Depois, configure na Vercel:

```env
NEXT_PUBLIC_APP_URL=https://SEU-DOMINIO
NEXT_PUBLIC_WHATSAPP_NUMBER=55DDDNUMERO
NEXT_PUBLIC_ENABLE_SMART_PAGES=false
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=CHAVE_PUBLICA
SUPABASE_SERVICE_ROLE_KEY=CHAVE_PRIVADA_SERVICE_ROLE
```

## Primeiro administrador

Após criar um usuário no Supabase Auth, promova-o pelo SQL Editor:

```sql
INSERT INTO public.app_admins (user_id)
SELECT id
FROM auth.users
WHERE email = 'SEU_EMAIL_AQUI'
ON CONFLICT (user_id) DO NOTHING;
```

## Fluxo operacional

1. O visitante envia uma reserva pela landing page.
2. O lead aparece em `/admin/leads`.
3. O operador atualiza o estágio comercial.
4. Ao clicar em **Criar placa**, os dados do lead são levados para `/admin/placas`.
5. O operador confirma empresa, segmento, cidade e link de avaliação do Google.
6. O backend cria o estabelecimento e a placa no Supabase.
7. O lead fica vinculado ao `business_id` e `device_id` criados.
8. O painel gera o link NFC e o QR Code para produção.
9. Os acessos reais passam a alimentar as métricas administrativas.

## Rotas principais do MVP

| Rota | Função |
| --- | --- |
| `/` | Landing page comercial |
| `/login` | Login autenticado |
| `/admin` | Visão operacional com dados reais |
| `/admin/leads` | Funil de reservas e vendas |
| `/admin/placas` | Cadastro, ativação, QR e links NFC |
| `/dashboard` | Painel do comerciante autenticado |
| `/t/[code]` | Redirecionamento seguro da placa |

## Validação automática

O workflow de CI executa:

```bash
npm run typecheck
npm test
npm run build
```

A branch só deve ser considerada pronta para merge depois que os três passos passarem e o preview da Vercel concluir com sucesso.

## Licença

Otimiza Meu Negócio © Todos os direitos reservados.
