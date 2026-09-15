-- ==============================================================================
-- OTIMIZA MEU NEGÓCIO: SECURITY HARDENING DO MVP
-- Restringe áreas administrativas e remove políticas públicas desnecessárias.
-- ==============================================================================

-- 1. Administradores da aplicação
CREATE TABLE IF NOT EXISTS public.app_admins (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE public.app_admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can verify own admin status" ON public.app_admins;
CREATE POLICY "Users can verify own admin status"
    ON public.app_admins FOR SELECT
    USING (auth.uid() = user_id);

-- Não criar políticas de INSERT/UPDATE/DELETE para usuários comuns.
-- O primeiro administrador deve ser promovido manualmente no SQL Editor:
-- INSERT INTO public.app_admins (user_id)
-- SELECT id FROM auth.users WHERE email = 'SEU_EMAIL_AQUI';

-- 2. Leads: qualquer visitante pode enviar uma reserva, mas somente app_admin pode ler/alterar.
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view and manage leads" ON public.leads;
DROP POLICY IF EXISTS "Public can insert leads" ON public.leads;

CREATE POLICY "Public can insert leads"
    ON public.leads FOR INSERT
    WITH CHECK (
        status = 'new'
        AND source IN ('instagram', 'whatsapp', 'facebook', 'presencial', 'indicacao', 'site', 'outro')
    );

CREATE POLICY "App admins can read leads"
    ON public.leads FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.app_admins a WHERE a.user_id = auth.uid()
    ));

CREATE POLICY "App admins can update leads"
    ON public.leads FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.app_admins a WHERE a.user_id = auth.uid()
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.app_admins a WHERE a.user_id = auth.uid()
    ));

CREATE POLICY "App admins can delete leads"
    ON public.leads FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.app_admins a WHERE a.user_id = auth.uid()
    ));

-- 3. MVP: criação de estabelecimentos é operacional/admin, não autoatendimento público.
DROP POLICY IF EXISTS "Users can create businesses" ON public.businesses;
CREATE POLICY "App admins can create businesses"
    ON public.businesses FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.app_admins a WHERE a.user_id = auth.uid()
    ));

-- 4. Placas não precisam mais ser enumeráveis pelo público.
-- O redirecionamento /t/[code] resolve o código com service role no servidor.
DROP POLICY IF EXISTS "Public can read active devices" ON public.tap_devices;

-- 5. Telemetria: remover inserção arbitrária diretamente pelo cliente.
-- O endpoint /t/[code] registra eventos com a service role no servidor.
DROP POLICY IF EXISTS "Public can log telemetry events" ON public.events;

-- 6. Recursos de Fase 2 ficam fechados no MVP.
-- Os endpoints/telas podem permanecer no código para roadmap, mas não devem permitir
-- cadastro público enquanto o produto inicial é apenas a placa de avaliações.
DROP POLICY IF EXISTS "Public can register to customer club" ON public.customers;
DROP POLICY IF EXISTS "Public can log consent" ON public.customer_consents;

-- 7. Configurações comerciais da aplicação.
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read app settings" ON public.app_settings;
DROP POLICY IF EXISTS "App admins can manage app settings" ON public.app_settings;

CREATE POLICY "Public can read app settings"
    ON public.app_settings FOR SELECT
    USING (true);

CREATE POLICY "App admins can manage app settings"
    ON public.app_settings FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.app_admins a WHERE a.user_id = auth.uid()
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.app_admins a WHERE a.user_id = auth.uid()
    ));
