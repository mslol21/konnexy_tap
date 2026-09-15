export type BusinessRole = "owner" | "admin" | "staff";

export type DeviceType = "nfc_plate" | "nfc_sticker" | "qr_stand";

export type DeviceStatus = "pending" | "active" | "inactive" | "suspended";

export type DestinationType = "google_review" | "custom";

export type SalesMode = "preorder" | "available" | "sold_out";

export type LeadStatus = "new" | "contacted" | "interested" | "reserved" | "sold" | "lost";

export type LeadSource =
  | "instagram"
  | "whatsapp"
  | "facebook"
  | "presencial"
  | "indicacao"
  | "site"
  | "outro";

export type LinkType =
  | "google_review"
  | "whatsapp"
  | "instagram"
  | "menu"
  | "catalog"
  | "booking"
  | "website"
  | "maps"
  | "suggestion"
  | "custom";

export type EventType =
  | "review_redirect"
  | "page_view"
  | "nfc_access"
  | "qr_access"
  | "google_click"
  | "whatsapp_click"
  | "instagram_click"
  | "menu_click"
  | "maps_click"
  | "campaign_click"
  | "club_signup"
  | "suggestion_sent"
  | "custom_link_click";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  created_at: string;
}

export interface Business {
  id: string;
  slug: string;
  name: string;
  description?: string;
  category: string;
  phone?: string;
  whatsapp?: string;
  instagram?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  maps_url?: string;
  google_review_url?: string;
  website?: string;
  logo_url?: string;
  cover_url?: string;
  primary_color: string;
  secondary_color: string;
  is_active: boolean;
  plan_id: "free" | "pro";
  created_at: string;
}

export interface BusinessMember {
  id: string;
  business_id: string;
  user_id: string;
  role: BusinessRole;
  created_at: string;
}

export interface TapDevice {
  id: string;
  business_id: string;
  code: string;
  name: string;
  type: DeviceType;
  location: string;
  active: boolean;
  status: DeviceStatus;
  destination_url?: string;
  destination_type: DestinationType;
  created_at: string;
}

export interface Lead {
  id: string;
  name: string;
  business_name: string;
  whatsapp: string;
  instagram?: string;
  segment?: string;
  city?: string;
  source: LeadSource;
  status: LeadStatus;
  notes?: string | null;
  converted_business_id?: string | null;
  converted_device_id?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface BusinessLink {
  id: string;
  business_id: string;
  title: string;
  type: LinkType;
  url: string;
  icon?: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

export interface Campaign {
  id: string;
  business_id: string;
  title: string;
  description: string;
  image_url?: string;
  original_price?: number;
  current_price: number;
  button_text: string;
  button_url?: string;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  created_at: string;
}

export interface Customer {
  id: string;
  business_id: string;
  name: string;
  phone: string;
  birth_date?: string;
  created_at: string;
}

export interface CustomerConsent {
  id: string;
  customer_id: string;
  business_id: string;
  consent: boolean;
  consent_at: string;
  source: string;
  ip_hash?: string;
}

export interface TelemetryEvent {
  id: string;
  business_id: string;
  device_id?: string;
  event_type: EventType;
  link_id?: string;
  session_id?: string;
  user_agent?: string;
  referrer?: string;
  created_at: string;
}

export interface DashboardMetrics {
  totalViewsToday: number;
  googleClicksToday: number;
  whatsappClicksToday: number;
  menuClicksToday: number;
  clubSignupsToday: number;
  viewsHistory: { date: string; views: number; google: number; whatsapp: number }[];
  conversionRate: number;
}
