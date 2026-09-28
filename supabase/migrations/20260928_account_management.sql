-- Centraliza dados comerciais, recursos, placa e financeiro por estabelecimento.

ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS services_url TEXT,
  ADD COLUMN IF NOT EXISTS services_label TEXT NOT NULL DEFAULT 'Serviços / cardápio',
  ADD COLUMN IF NOT EXISTS contact_name TEXT,
  ADD COLUMN IF NOT EXISTS contact_email TEXT,
  ADD COLUMN IF NOT EXISTS contact_phone TEXT,
  ADD COLUMN IF NOT EXISTS account_status TEXT NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS internal_notes TEXT;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'businesses_account_status_check') THEN
    ALTER TABLE public.businesses
      ADD CONSTRAINT businesses_account_status_check
      CHECK (account_status IN ('lead','onboarding','active','inactive','suspended','cancelled'));
  END IF;
END $$;

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS source TEXT;
UPDATE public.events
SET source = CASE
  WHEN LOWER(COALESCE(session_id,'')) = 'qr' THEN 'qr'
  WHEN LOWER(COALESCE(session_id,'')) = 'nfc' THEN 'nfc'
  WHEN LOWER(COALESCE(session_id,'')) = 'direct' THEN 'direct'
  ELSE 'unknown'
END
WHERE source IS NULL;

CREATE INDEX IF NOT EXISTS idx_events_device_source_created_at
  ON public.events(device_id, source, created_at DESC);

CREATE TABLE IF NOT EXISTS public.business_billing (
  business_id UUID PRIMARY KEY REFERENCES public.businesses(id) ON DELETE CASCADE,
  plate_price NUMERIC(10,2) NOT NULL DEFAULT 79.90,
  plate_payment_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (plate_payment_status IN ('pending','paid','overdue','cancelled','refunded')),
  plate_paid_at TIMESTAMPTZ,
  subscription_enabled BOOLEAN NOT NULL DEFAULT false,
  subscription_plan_id TEXT REFERENCES public.plans(id),
  subscription_price NUMERIC(10,2),
  subscription_status TEXT NOT NULL DEFAULT 'not_subscribed'
    CHECK (subscription_status IN ('not_subscribed','trial','pending','active','overdue','suspended','cancelled')),
  last_payment_at TIMESTAMPTZ,
  next_due_date DATE,
  payment_method TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('plate','subscription','service','other')),
  description TEXT,
  amount NUMERIC(10,2) NOT NULL,
  due_date DATE,
  paid_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','paid','overdue','cancelled','refunded')),
  payment_method TEXT,
  external_reference TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.business_billing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage business billing" ON public.business_billing;
CREATE POLICY "Admins manage business billing"
ON public.business_billing FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.app_admins a WHERE a.user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.app_admins a WHERE a.user_id = auth.uid()));

DROP POLICY IF EXISTS "Members view business billing" ON public.business_billing;
CREATE POLICY "Members view business billing"
ON public.business_billing FOR SELECT TO authenticated
USING (public.is_business_member(business_id));

DROP POLICY IF EXISTS "Admins manage payments" ON public.payments;
CREATE POLICY "Admins manage payments"
ON public.payments FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.app_admins a WHERE a.user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.app_admins a WHERE a.user_id = auth.uid()));

DROP POLICY IF EXISTS "Members view payments" ON public.payments;
CREATE POLICY "Members view payments"
ON public.payments FOR SELECT TO authenticated
USING (public.is_business_member(business_id));

INSERT INTO public.business_billing (business_id, subscription_plan_id, subscription_price)
SELECT b.id, b.plan_id, p.price
FROM public.businesses b
LEFT JOIN public.plans p ON p.id = b.plan_id
ON CONFLICT (business_id) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_payments_business_created_at
  ON public.payments(business_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_businesses_account_status
  ON public.businesses(account_status);
