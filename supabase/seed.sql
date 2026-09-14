-- ==============================================================================
-- KONNEXY TAP: SEED DATA (CAFÉ DA ANA & PLACA A7K92)
-- ==============================================================================

-- 1. Insert Café da Ana
INSERT INTO public.businesses (
    id, slug, name, description, category, phone, whatsapp, instagram,
    address, city, state, postal_code, maps_url, google_review_url, website,
    logo_url, cover_url, primary_color, secondary_color, is_active, plan_id
) VALUES (
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'cafe-da-ana',
    'Café da Ana',
    'Café feito com carinho no coração do bairro. Grãos especiais, pães artesanais e ambiente acolhedor.',
    'Cafeteria',
    '(11) 98765-4321',
    '5511987654321',
    '@cafedaana_sp',
    'Rua Augusta, 1492 - Cerqueira César',
    'São Paulo',
    'SP',
    '01304-001',
    'https://maps.google.com/?q=Rua+Augusta+1492+São+Paulo',
    'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4',
    'https://cafedaana.com.br',
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
    '#0F2744',
    '#D4AF37',
    true,
    'free'
) ON CONFLICT (slug) DO NOTHING;

-- 2. Insert Placa NFC Principal A7K92
INSERT INTO public.tap_devices (
    id, business_id, code, name, type, location, active
) VALUES (
    'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'A7K92',
    'Placa Balcão Principal',
    'nfc_plate',
    'Balcão de Atendimento',
    true
) ON CONFLICT (code) DO NOTHING;

-- 3. Insert Links do Café da Ana
INSERT INTO public.business_links (
    business_id, title, type, url, icon, order_index, is_active
) VALUES
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Avaliar no Google', 'google_review', 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4', 'Star', 1, true),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Falar no WhatsApp', 'whatsapp', 'https://wa.me/5511987654321', 'MessageCircle', 2, true),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Ver cardápio do dia', 'menu', 'https://cafedaana.com.br/cardapio', 'UtensilsCrossed', 3, true),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Como chegar (Google Maps)', 'maps', 'https://maps.google.com/?q=Rua+Augusta+1492+São+Paulo', 'MapPin', 4, true),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Siga no Instagram', 'instagram', 'https://instagram.com/cafedaana_sp', 'Instagram', 5, true),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Enviar sugestão à gerência', 'suggestion', '#feedback', 'Send', 6, true);

-- 4. Insert Campanha do Combo da Semana
INSERT INTO public.campaigns (
    business_id, title, description, original_price, current_price, button_text, button_url, is_active
) VALUES (
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'Combo da semana ☕🥐',
    'Café coado especial 150ml + pão de queijo da canastra quentinho recheado.',
    16.90,
    12.90,
    'Quero aproveitar',
    'https://wa.me/5511987654321?text=Ol%C3%A1!%20Quero%20aproveitar%20o%20Combo%20da%20Semana%20de%20R$%2012,90!',
    true
);
