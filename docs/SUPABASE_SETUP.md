# Configuração do Supabase — Otimiza Meu Negócio

Este projeto foi preparado para funcionar sem dados fictícios em produção. Enquanto o Supabase não estiver configurado, as áreas administrativas devem exibir estado de configuração pendente em vez de simular cadastros.

## 1. Criar o projeto

Use um projeto Supabase dedicado ao **Otimiza Meu Negócio**. Não reutilize o banco da Vitriniza ou de outro produto.

Região recomendada para operação no Brasil: `sa-east-1` (São Paulo), quando disponível no plano escolhido.

## 2. Aplicar migrations

Execute, nesta ordem:

1. `supabase/migrations/20260914_init_schema.sql`
2. `supabase/migrations/20260914_refactor_reviews_mvp.sql`
3. `supabase/migrations/20260915_security_hardening.sql`

Não rode apenas a migration de hardening em um banco vazio, porque ela depende das tabelas criadas anteriormente.

## 3. Variáveis na Vercel

Configure em Production e Preview conforme necessário:

```env
NEXT_PUBLIC_APP_URL=https://SEU-DOMINIO
NEXT_PUBLIC_WHATSAPP_NUMBER=55DDDNUMERO
NEXT_PUBLIC_ENABLE_SMART_PAGES=false
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=CHAVE_PRIVADA_SERVICE_ROLE
```

### Publishable key vs anon key legado

Projetos novos do Supabase podem fornecer uma chave moderna `sb_publishable_...`. O projeto agora prefere essa chave em `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

A variável antiga `NEXT_PUBLIC_SUPABASE_ANON_KEY` continua aceita apenas como fallback de compatibilidade. Não é necessário configurar as duas.

### Regra crítica

`SUPABASE_SERVICE_ROLE_KEY` é **server-only**. Nunca use prefixo `NEXT_PUBLIC_`, nunca coloque a chave em componente React e nunca salve a chave real no GitHub ou em mensagens de chat. Configure-a diretamente no provedor de deploy.

## 4. Criar o primeiro usuário administrador

Primeiro, crie sua conta pelo Supabase Auth. Depois execute no SQL Editor:

```sql
INSERT INTO public.app_admins (user_id)
SELECT id
FROM auth.users
WHERE email = 'SEU_EMAIL_AQUI'
ON CONFLICT (user_id) DO NOTHING;
```

A tabela `app_admins` é o que libera `/admin` e as APIs operacionais.

## 5. Fluxo operacional esperado

1. Visitante envia reserva pelo site.
2. Reserva entra em `leads` com status `new`.
3. Administrador acompanha em `/admin/leads`.
4. Clica em **Criar placa**.
5. Confirma empresa, segmento, cidade e link oficial de avaliação do Google.
6. O sistema cria `businesses` e `tap_devices`.
7. O lead recebe `converted_business_id` e `converted_device_id`.
8. O sistema gera duas URLs gerenciadas:
   - NFC: `/t/CODIGO?src=nfc`
   - QR: `/t/CODIGO?src=qr`
9. O chip NFC e o QR Code apontam para essas URLs, nunca diretamente para o Google.
10. `/t/[code]` valida a placa, registra o acesso e redireciona para o Google.

## 6. Teste de aceite antes da primeira venda

Valide obrigatoriamente:

- login sem bypass;
- usuário comum não acessa `/admin`;
- administrador visualiza leads;
- criação de placa persiste após atualizar a página;
- código duplicado é recusado;
- URL externa que não seja Google é recusada;
- NFC redireciona para a avaliação correta;
- QR redireciona para a avaliação correta;
- placa `inactive` ou `suspended` não redireciona;
- métrica de acessos aumenta após um novo toque válido;
- nenhum segredo aparece no bundle do navegador.

## 7. Feature flags

Mantenha no MVP:

```env
NEXT_PUBLIC_ENABLE_SMART_PAGES=false
```

A proposta inicial deve permanecer focada em **placa NFC + QR Code para avaliações do Google**. Recursos de página inteligente, clube de clientes, campanhas e exportação devem ficar para uma etapa posterior.
