-- ==============================================================================
-- OTIMIZA MEU NEGÓCIO: SECURITY HARDENING DO MVP
-- Restringe áreas administrativas, fecha superfícies públicas desnecessárias e
-- prepara o fluxo operacional Lead -> Estabelecimento -> Placa NFC/QR.
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

-- 2. Leads: rastrear conversão para estabelecimento/placa.
ALTER TABLE public.leads
    ADD COLUMN IF NOT EXISTS converted_business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS converted_device_id UUID REFERENCES public.tap_devices(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_leads_converted_business ON public.leads(converted_business_id);
CREATE INDEX IF NOT EXISTS idx_leads_converted_device ON public.leads(converted_device_id);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view and manage leads" ON public.leads;
DROP POLICY IF EXISTS "Public can insert leads" ON public.leads;
DROP POLICY IF EXISTS "App admins can read leads" ON public.leads;
DROP POLICY IF EXISTS "App admins can update leads" ON public.leads;
DROP POLICY IF EXISTS "App admins can delete leads" ON public.leads;

-- Visitante pode apenas criar uma nova solicitação. Campos operacionais precisam
-- nascer vazios e só podem ser alterados pela operação autenticada.
CREATE POLICY "Public can insert leads"
    ON public.leads FOR INSERT
    WITH CHECK (
        status = 'new'
        AND source IN ('instagram', 'whatsapp', 'facebook', 'presencial', 'indicacao', 'site', 'outro')
        AND notes IS NULL
        AND converted_business_id IS NULL
        AND converted_device_id IS NULL
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
DROP POLICY IF EXISTS "App admins can create businesses" ON public.businesses;
CREATE POLICY "App admins can create businesses"
    ON public.businesses FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.app_admins a WHERE a.user_id = auth.uid()
    ));

-- 4. Placas não precisam ser enumeráveis pelo público.
-- O redirecionamento /t/[code] resolve o código com service role no servidor.
DROP POLICY IF EXISTS "Public can read active devices" ON public.tap_devices;

-- 5. Telemetria: remover inserção arbitrária diretamente pelo cliente.
-- O endpoint /t/[code] registra eventos com a service role no servidor.
DROP POLICY IF EXISTS "Public can log telemetry events" ON public.events;

-- 6. Recursos de Fase 2 ficam fechados no MVP.
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
