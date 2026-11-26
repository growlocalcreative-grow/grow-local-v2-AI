export type BusinessTypeOption =
  | "contractor"
  | "restaurant-food-truck"
  | "shop-maker"
  | "service-nonprofit";

export type RecommendedSpecialtySlug =
  | "website-rescues"
  | "google-business-optimization"
  | "restaurant-food-truck-menus";

export type AuditCheckStatus = "pass" | "warn" | "fail";

export interface AuditCheckItem {
  id: string;
  label: string;
  status: AuditCheckStatus;
  detail: string;
}

export interface AuditScanFacts {
  finalUrl: string;
  usesHttps: boolean;
  statusCode: number;
  responseMs: number;
  htmlBytes: number;
  titleText: string;
  metaDescription: string;
  h1Text: string;
  hasMobileViewport: boolean;
  hasClickablePhone: boolean;
  hasBookingOrContactCta: boolean;
  hasPdfMenuLink: boolean;
  mentionsTown: boolean;
  hasLocalBusinessSchema: boolean;
  hasGoogleOrSocialLinks: boolean;
  hasOpenGraph: boolean;
  wordCount: number;
}

export interface AuditLeak {
  title: string;
  severity: "high" | "medium" | "quick-win";
  whatWeFound: string;
  whyItCostsCustomers: string;
  howToFix: string;
}

export interface AuditAiReport {
  headlineSummary: string;
  recommendedSpecialty: RecommendedSpecialtySlug;
  recommendedSpecialtyReason: string;
  topLeaks: AuditLeak[];
  quickWins: string[];
}

export interface AuditScanResponse {
  mode: "website" | "no-website";
  businessName: string;
  businessType: BusinessTypeOption;
  town: string;
  scanFacts: AuditScanFacts | null;
  checks: AuditCheckItem[];
  aiReport: AuditAiReport;
}

export const BUSINESS_TYPE_LABELS: Record<BusinessTypeOption, string> = {
  contractor: "Contractor / Home Services & Trades",
  "restaurant-food-truck": "Restaurant, Food Truck, Cafe or Bakery",
  "shop-maker": "Local Retail Shop, Farm or Maker",
  "service-nonprofit": "Local Service Business or Community Group",
};
