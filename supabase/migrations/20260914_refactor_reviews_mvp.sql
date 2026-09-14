-- ==============================================================================
-- KONNEXY TAP REVIEWS: INCREMENTAL MIGRATION (MVP COMERCIAL)
-- Foco em avaliações Google, gestão de leads/reservas e segurança de redirecionamento
-- ==============================================================================

-- 1. TABELA DE LEADS / RESERVAS DO PRIMEIRO LOTE
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    business_name TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    instagram TEXT,
    segment TEXT,
    city TEXT,
    source TEXT NOT NULL DEFAULT 'site' CHECK (source IN ('instagram', 'whatsapp', 'facebook', 'presencial', 'indicacao', 'site', 'outro')),
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'interested', 'reserved', 'sold', 'lost')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at);

-- 2. ATUALIZAÇÃO DA TABELA TAP_DEVICES COM STATUS E DESTINO GOOGLE
DO $$ 
BEGIN 
    -- Adicionar coluna status se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tap_devices' AND column_name='status') THEN
        ALTER TABLE public.tap_devices ADD COLUMN status TEXT NOT NULL DEFAULT 'active' 
            CHECK (status IN ('pending', 'active', 'inactive', 'suspended'));
    END IF;

    -- Adicionar coluna destination_url se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tap_devices' AND column_name='destination_url') THEN
        ALTER TABLE public.tap_devices ADD COLUMN destination_url TEXT;
    END IF;

    -- Adicionar coluna destination_type se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tap_devices' AND column_name='destination_type') THEN
        ALTER TABLE public.tap_devices ADD COLUMN destination_type TEXT NOT NULL DEFAULT 'google_review'
            CHECK (destination_type IN ('google_review', 'custom'));
    END IF;
END $$;

-- 3. RLS PARA TABELA LEADS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Público pode registrar interesse / reserva pelo site
CREATE POLICY "Public can insert leads"
    ON public.leads FOR INSERT
    WITH CHECK (true);

-- Apenas membros autenticados com papel admin/owner ou service_role podem visualizar e atualizar leads
CREATE POLICY "Admins can view and manage leads"
    ON public.leads FOR ALL
    USING (auth.uid() IS NOT NULL);

-- 4. CONFIGURAÇÃO COMERCIAL SALES_MODE
CREATE TABLE IF NOT EXISTS public.app_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

INSERT INTO public.app_settings (key, value)
VALUES ('sales_mode', '"preorder"'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- 5. TRIGGER PARA ATUALIZAR updated_at EM LEADS
CREATE OR REPLACE FUNCTION public.update_leads_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_leads_updated_at ON public.leads;
CREATE TRIGGER trg_leads_updated_at
BEFORE UPDATE ON public.leads
FOR EACH ROW
EXECUTE FUNCTION public.update_leads_timestamp();
