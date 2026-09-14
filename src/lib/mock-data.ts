import { Business, BusinessLink, TapDevice, Campaign, Customer, CustomerConsent, Lead, DashboardMetrics } from "./types";

export const DEMO_BUSINESS: Business = {
  id: "biz-cafe-ana",
  slug: "cafe-da-ana",
  name: "Café da Ana",
  description: "Café feito com carinho no coração do bairro. Grãos especiais, pães artesanais e ambiente acolhedor.",
  category: "Cafeteria",
  phone: "(11) 98765-4321",
  whatsapp: "5511987654321",
  instagram: "@cafedaana_sp",
  address: "Rua Augusta, 1492 - Cerqueira César",
  city: "São Paulo",
  state: "SP",
  postal_code: "01304-001",
  maps_url: "https://maps.google.com/?q=Rua+Augusta+1492+São+Paulo",
  google_review_url: "https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4",
  website: "https://cafedaana.com.br",
  logo_url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&auto=format&fit=crop&q=80",
  cover_url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80",
  primary_color: "#0F2744",
  secondary_color: "#D4AF37",
  is_active: true,
  plan_id: "free",
  created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
};

export const DEMO_DEVICE: TapDevice = {
  id: "dev-kx-a7k92",
  business_id: "biz-cafe-ana",
  code: "KX-A7K92",
  name: "Placa Balcão Avaliações Google",
  type: "nfc_plate",
  location: "Balcão Principal",
  active: true,
  status: "active",
  destination_url: "https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4",
  destination_type: "google_review",
  created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
};

export const DEMO_DEVICES: TapDevice[] = [
  DEMO_DEVICE,
  {
    id: "dev-kx-b3m01",
    business_id: "biz-cafe-ana",
    code: "KX-B3M01",
    name: "Placa Balcão Caixa",
    type: "nfc_plate",
    location: "Caixa de Pagamento",
    active: true,
    status: "active",
    destination_url: "https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4",
    destination_type: "google_review",
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
  {
    id: "dev-kx-c9x02",
    business_id: "biz-cafe-ana",
    code: "KX-C9X02",
    name: "Display Mesa 01",
    type: "qr_stand",
    location: "Mesa 1 - Salão Externo",
    active: false,
    status: "pending",
    destination_url: "https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4",
    destination_type: "google_review",
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  }
];

export const DEMO_LEADS: Lead[] = [
  {
    id: "lead-01",
    name: "Marcos Vinicius",
    business_name: "Barbearia Dom Pedro",
    whatsapp: "11981234567",
    instagram: "@barbeariadompedro",
    segment: "Barbearia",
    city: "São Paulo - SP",
    source: "site",
    status: "reserved",
    notes: "Quer 2 placas (1 para recepção e 1 para bancada principal). Reservou no primeiro lote.",
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: "lead-02",
    name: "Dra. Juliana Prado",
    business_name: "Clínica Odonto Vida",
    whatsapp: "11972345678",
    instagram: "@odontovida_sp",
    segment: "Clínica",
    city: "Campinas - SP",
    source: "whatsapp",
    status: "interested",
    notes: "Pediu detalhes de como funciona no balcão de saída dos pacientes.",
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "lead-03",
    name: "Felipe Andrade",
    business_name: "Hamburgueria 77",
    whatsapp: "21993456789",
    segment: "Restaurante",
    city: "Rio de Janeiro - RJ",
    source: "site",
    status: "contacted",
    notes: "Enviado vídeo de demonstração do toque NFC.",
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "lead-04",
    name: "Renata Vasconcelos",
    business_name: "Petshop Patinhas Felizes",
    whatsapp: "11964567890",
    segment: "Petshop",
    city: "São Paulo - SP",
    source: "indicacao",
    status: "sold",
    notes: "Placa KX-B3M01 já configurada e entregue.",
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
];

export const DEMO_LINKS: BusinessLink[] = [
  {
    id: "lnk-google",
    business_id: "biz-cafe-ana",
    title: "Avaliar no Google",
    type: "google_review",
    url: "https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4",
    icon: "Star",
    order_index: 1,
    is_active: true,
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: "lnk-whatsapp",
    business_id: "biz-cafe-ana",
    title: "Falar no WhatsApp",
    type: "whatsapp",
    url: "https://wa.me/5511987654321?text=Ol%C3%A1!%20Vim%20pela%20placa%20da%20Otimiza%20Meu%20Neg%C3%B3cio.",
    icon: "MessageCircle",
    order_index: 2,
    is_active: true,
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  }
];

export const DEMO_CAMPAIGN: Campaign = {
  id: "cmp-combo-semana",
  business_id: "biz-cafe-ana",
  title: "Combo da semana ☕🥐",
  description: "Café coado especial 150ml + pão de queijo quentinho.",
  original_price: 16.90,
  current_price: 12.90,
  button_text: "Quero aproveitar",
  button_url: "https://wa.me/5511987654321",
  is_active: true,
  created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
};

export const DEMO_CUSTOMERS: (Customer & { consent: CustomerConsent })[] = [
  {
    id: "cst-01",
    business_id: "biz-cafe-ana",
    name: "Carlos Eduardo Silva",
    phone: "(11) 97123-4567",
    created_at: new Date(Date.now() - 12 * 86400000).toISOString(),
    consent: {
      id: "cst-01-c",
      customer_id: "cst-01",
      business_id: "biz-cafe-ana",
      consent: true,
      consent_at: new Date(Date.now() - 12 * 86400000).toISOString(),
      source: "nfc_tap",
    }
  }
];

export const DEMO_METRICS: DashboardMetrics = {
  totalViewsToday: 37,
  googleClicksToday: 28,
  whatsappClicksToday: 9,
  menuClicksToday: 0,
  clubSignupsToday: 0,
  conversionRate: 75.6,
  viewsHistory: [
    { date: "08/09", views: 24, google: 18, whatsapp: 6 },
    { date: "09/09", views: 28, google: 21, whatsapp: 7 },
    { date: "10/09", views: 31, google: 23, whatsapp: 8 },
    { date: "11/09", views: 35, google: 26, whatsapp: 9 },
    { date: "12/09", views: 42, google: 31, whatsapp: 11 },
    { date: "13/09", views: 48, google: 35, whatsapp: 13 },
    { date: "14/09", views: 37, google: 28, whatsapp: 9 },
  ],
};
