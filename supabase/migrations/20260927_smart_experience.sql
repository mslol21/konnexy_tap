-- ==============================================================================
-- OTIMIZA MEU NEGÓCIO: EXPERIÊNCIA INTELIGENTE (SEM FIDELIDADE)
-- Google, WhatsApp, serviços/cardápio, localização, Wi-Fi, feedback e promoções.
-- ==============================================================================

ALTER TABLE public.tap_devices
  ADD COLUMN IF NOT EXISTS experience_mode TEXT NOT NULL DEFAULT 'direct_review';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'tap_devices_experience_mode_check'
  ) THEN
    ALTER TABLE public.tap_devices
      ADD CONSTRAINT tap_devices_experience_mode_check
      CHECK (experience_mode IN ('direct_review', 'smart_page'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_tap_devices_experience_mode
  ON public.tap_devices(experience_mode);

CREATE TABLE IF NOT EXISTS public.business_experiences (
  business_id UUID PRIMARY KEY REFERENCES public.businesses(id) ON DELETE CASCADE,
  google_enabled BOOLEAN NOT NULL DEFAULT true,
  whatsapp_enabled BOOLEAN NOT NULL DEFAULT false,
  services_enabled BOOLEAN NOT NULL DEFAULT false,
  maps_enabled BOOLEAN NOT NULL DEFAULT false,
  wifi_enabled BOOLEAN NOT NULL DEFAULT false,
  feedback_enabled BOOLEAN NOT NULL DEFAULT true,
  promotions_enabled BOOLEAN NOT NULL DEFAULT false,
  instagram_enabled BOOLEAN NOT NULL DEFAULT false,
  website_enabled BOOLEAN NOT NULL DEFAULT false,
  wifi_ssid TEXT,
  wifi_password TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

INSERT INTO public.business_experiences (business_id)
SELECT id FROM public.businesses
ON CONFLICT (business_id) DO NOTHING;

CREATE OR REPLACE FUNCTION public.update_business_experience_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_business_experiences_updated_at ON public.business_experiences;
CREATE TRIGGER trg_business_experiences_updated_at
BEFORE UPDATE ON public.business_experiences
FOR EACH ROW
EXECUTE FUNCTION public.update_business_experience_timestamp();

CREATE TABLE IF NOT EXISTS public.feedbacks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  device_id UUID REFERENCES public.tap_devices(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'seen', 'resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX IF NOT EXISTS idx_feedbacks_business_created
  ON public.feedbacks(business_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_feedbacks_status
  ON public.feedbacks(status);

ALTER TABLE public.business_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "App admins can manage business experiences" ON public.business_experiences;
CREATE POLICY "App admins can manage business experiences"
  ON public.business_experiences FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.app_admins a WHERE a.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.app_admins a WHERE a.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Members can view business experiences" ON public.business_experiences;
CREATE POLICY "Members can view business experiences"
  ON public.business_experiences FOR SELECT
  USING (public.is_business_member(business_id));

DROP POLICY IF EXISTS "Members can update business experiences" ON public.business_experiences;
CREATE POLICY "Members can update business experiences"
  ON public.business_experiences FOR UPDATE
  USING (public.is_business_member(business_id))
  WITH CHECK (public.is_business_member(business_id));

DROP POLICY IF EXISTS "App admins can manage feedbacks" ON public.feedbacks;
CREATE POLICY "App admins can manage feedbacks"
  ON public.feedbacks FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.app_admins a WHERE a.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.app_admins a WHERE a.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Members can view feedbacks" ON public.feedbacks;
CREATE POLICY "Members can view feedbacks"
  ON public.feedbacks FOR SELECT
  USING (public.is_business_member(business_id));

DROP POLICY IF EXISTS "Members can update feedbacks" ON public.feedbacks;
CREATE POLICY "Members can update feedbacks"
  ON public.feedbacks FOR UPDATE
  USING (public.is_business_member(business_id))
  WITH CHECK (public.is_business_member(business_id));

-- Feedback público entra somente pela API server-side com validação e service role.
