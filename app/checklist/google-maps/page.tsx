import type { Metadata } from "next";
import Link from "next/link";
import { Download, ArrowLeft } from "lucide-react";
import { ChecklistInteractiveView } from "./ChecklistInteractiveView";
import { DEFAULT_BOOKING_URL, OFFICIAL_EMAIL, getSiteSettingsContent } from "@/lib/content";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "5-Minute Google Maps Setup Checklist",
  description:
    "The free step-by-step Google Business Profile checklist for Cool, Auburn, Roseville, Folsom, Placerville, Grass Valley, and Sierra Foothills businesses to rank higher on Google Maps without paying for ads.",
  alternates: {
    canonical: "https://growlocalcreative.com/checklist/google-maps",
  },
  openGraph: {
    title: "5-Minute Google Maps Setup Checklist | Grow Local Creative",
    description:
      "Free 1-page Google Business Profile action guide for Sierra Foothills and Greater Sacramento small businesses.",
    url: "https://growlocalcreative.com/checklist/google-maps",
    siteName: "Grow Local Creative",
    type: "article",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "Grow Local Creative 5-Minute Google Maps Setup Checklist",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "5-Minute Google Maps Setup Checklist | Grow Local Creative",
    description:
      "Free 1-page Google Business Profile action guide for Sierra Foothills and Greater Sacramento small businesses.",
    images: ["/logo.png"],
  },
};

export default async function ChecklistPage() {
  const settings = await getSiteSettingsContent();
  const bookingUrl = settings.bookingUrl || DEFAULT_BOOKING_URL;
  const contactEmail = settings.email || OFFICIAL_EMAIL;
  const phone = settings.phone || "916-869-4142";

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "5-Minute Google Maps Setup Checklist for Foothill & Local Businesses",
    description:
      "A 5-step practical checklist to verify your service-area address, pick high-intent Google Business Profile categories, upload geotagged photos, build a 1-tap review link, and post weekly updates.",
    totalTime: "PT5M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Fix the Rural Foothill Address Dilemma",
        text: "Avoid P.O. Boxes, hide your residential street address if you travel to customers, and explicitly list your local target cities and ZIP codes.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Lock In High-Intent Primary & Secondary Categories",
        text: "Choose the exact primary trade or food category customers search for and add 3–5 accurate secondary categories.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Upload Real Local Photos",
        text: "Skip stock photography and upload real smartphone photos of your branded vehicle or storefront, team, and recent finished work with location services enabled.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Create Your Direct 1-Tap Google Review Shortlink",
        text: "Copy your g.page/r review shortlink from your Google Business Profile and text it directly to happy customers right after completing a job.",
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Post a 60-Second Weekly Google Update",
        text: "Share one real job or menu photo each week with two sentences mentioning the local town and service completed.",
      },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://growlocalcreative.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "5-Minute Google Maps Setup Checklist",
        item: "https://growlocalcreative.com/checklist/google-maps",
      },
    ],
  };

  return (
    <>
      <script
        id="checklist-howto-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        id="checklist-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <main className="flex-grow min-h-screen bg-stone-100 py-8 px-4 sm:px-6 lg:px-8 text-stone-900 print:bg-white print:p-0">
        {/* Top action header (hidden on print) */}
        <div className="max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-stone-700 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center gap-3">
            <a
              href="/api/checklist/download"
              download="Foothills-Google-Maps-Setup-Checklist.pdf"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow hover:bg-primary/90 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download 1-Page PDF</span>
            </a>
          </div>
        </div>

        {/* Main Checklist Document (Letter Paper Simulation) */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden print:shadow-none print:border-none print:rounded-none">
          <ChecklistInteractiveView
            bookingUrl={bookingUrl}
            email={contactEmail}
            phone={phone}
          />
        </div>

        {/* Footer note (hidden on print) */}
        <div className="max-w-4xl mx-auto mt-6 text-center text-xs text-stone-600 print:hidden">
          Grow Local Creative · Cool, CA · Serving El Dorado, Placer, Nevada &amp; Sacramento Counties
        </div>
      </main>
    </>
  );
}
