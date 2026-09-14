-- ==============================================================================
-- KONNEXY TAP: INITIAL SCHEMA & ROW LEVEL SECURITY (RLS)
-- Multi-tenant architecture for Brazilian SMB NFC + QR Code smart plates
-- ==============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. PLANS (Gratuito e Tap Pro)
CREATE TABLE IF NOT EXISTS public.plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    interval TEXT NOT NULL DEFAULT 'month',
    max_devices INTEGER NOT NULL DEFAULT 1,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

INSERT INTO public.plans (id, name, price, interval, max_devices, features)
VALUES 
('free', 'Plano Básico Perpétuo', 0.00, 'lifetime', 1, '["Página pública", "Até 5 links", "Avaliações Google", "WhatsApp", "Instagram", "Como Chegar", "1 Placa cadastrada"]'::jsonb),
('pro', 'Konnexy Tap Pro', 29.90, 'month', 10, '["Tudo do gratuito", "Campanhas ilimitadas", "Clube de clientes LGPD", "Métricas avançadas", "Exportação de contatos", "Múltiplas placas", "Personalização avançada"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 3. BUSINESSES (Estabelecimentos comerciais)
CREATE TABLE IF NOT EXISTS public.businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    phone TEXT,
    whatsapp TEXT,
    instagram TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    postal_code TEXT,
    maps_url TEXT,
    google_review_url TEXT,
    website TEXT,
    logo_url TEXT,
    cover_url TEXT,
    primary_color TEXT NOT NULL DEFAULT '#0F2744',
    secondary_color TEXT NOT NULL DEFAULT '#D4AF37',
    is_active BOOLEAN NOT NULL DEFAULT true,
    plan_id TEXT NOT NULL DEFAULT 'free' REFERENCES public.plans(id),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_businesses_slug ON public.businesses(slug);

-- 4. BUSINESS MEMBERS (Multi-tenant memberships)
CREATE TABLE IF NOT EXISTS public.business_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'staff')),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(business_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_business_members_user ON public.business_members(user_id);
CREATE INDEX IF NOT EXISTS idx_business_members_business ON public.business_members(business_id);

-- 5. TAP DEVICES (Placas NFC e QR Codes cadastrados)
CREATE TABLE IF NOT EXISTS public.tap_devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'nfc_plate' CHECK (type IN ('nfc_plate', 'nfc_sticker', 'qr_stand')),
    location TEXT NOT NULL DEFAULT 'Balcão',
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tap_devices_code ON public.tap_devices(code);
CREATE INDEX IF NOT EXISTS idx_tap_devices_business ON public.tap_devices(business_id);

-- 6. BUSINESS LINKS (Botões de ação da página)
CREATE TABLE IF NOT EXISTS public.business_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_business_links_business ON public.business_links(business_id);

-- 7. CAMPAIGNS (Promoções ativas no balcão)
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    original_price NUMERIC(10, 2),
    current_price NUMERIC(10, 2) NOT NULL,
    button_text TEXT NOT NULL DEFAULT 'Quero aproveitar',
    button_url TEXT,
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_campaigns_business ON public.campaigns(business_id);

-- 8. CUSTOMERS & CONSENTS (Clube de Clientes LGPD)
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    birth_date DATE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_customers_business ON public.customers(business_id);

CREATE TABLE IF NOT EXISTS public.customer_consents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    consent BOOLEAN NOT NULL DEFAULT true,
    consent_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    source TEXT NOT NULL DEFAULT 'nfc_tap',
    ip_hash TEXT
);

-- 9. EVENTS (Telemetria anônima de acessos e cliques)
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    device_id UUID REFERENCES public.tap_devices(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    link_id UUID,
    session_id TEXT,
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_events_business ON public.events(business_id);
CREATE INDEX IF NOT EXISTS idx_events_device ON public.events(device_id);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON public.events(created_at);

-- 10. SUBSCRIPTIONS (Estrutura SaaS)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL REFERENCES public.plans(id),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
    current_period_start TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    current_period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict multi-tenant isolation: User A cannot access Business B
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tap_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user belongs to business
CREATE OR REPLACE FUNCTION public.is_business_member(b_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.business_members
        WHERE business_id = b_id AND user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: users manage their own profile
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Businesses:
-- Public can read active businesses (for public pages)
CREATE POLICY "Public can view active businesses"
    ON public.businesses FOR SELECT
    USING (is_active = true);

-- Members can manage their business
CREATE POLICY "Members can update their business"
    ON public.businesses FOR UPDATE
    USING (public.is_business_member(id));

CREATE POLICY "Users can create businesses"
    ON public.businesses FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- Business Members:
CREATE POLICY "Members can view membership"
    ON public.business_members FOR SELECT
    USING (user_id = auth.uid() OR public.is_business_member(business_id));

-- Tap Devices:
-- Public can look up devices by code
CREATE POLICY "Public can read active devices"
    ON public.tap_devices FOR SELECT
    USING (active = true);

CREATE POLICY "Members can manage their devices"
    ON public.tap_devices FOR ALL
    USING (public.is_business_member(business_id));

-- Business Links:
-- Public can view active links
CREATE POLICY "Public can view active business links"
    ON public.business_links FOR SELECT
    USING (is_active = true);

CREATE POLICY "Members can manage business links"
    ON public.business_links FOR ALL
    USING (public.is_business_member(business_id));

-- Campaigns:
CREATE POLICY "Public can view active campaigns"
    ON public.campaigns FOR SELECT
    USING (is_active = true);

CREATE POLICY "Members can manage campaigns"
    ON public.campaigns FOR ALL
    USING (public.is_business_member(business_id));

-- Customers & Consents:
CREATE POLICY "Public can register to customer club"
    ON public.customers FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Public can log consent"
    ON public.customer_consents FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Members can view their customers"
    ON public.customers FOR SELECT
    USING (public.is_business_member(business_id));

CREATE POLICY "Members can delete customer data (LGPD)"
    ON public.customers FOR DELETE
    USING (public.is_business_member(business_id));

-- Events:
CREATE POLICY "Public can log telemetry events"
    ON public.events FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Members can view telemetry events"
    ON public.events FOR SELECT
    USING (public.is_business_member(business_id));
