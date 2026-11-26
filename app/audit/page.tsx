import type { Metadata } from "next";
import Link from "next/link";
import { AuditToolClient } from "@/components/audit/AuditToolClient";
import {
  DEFAULT_BOOKING_URL,
  OFFICIAL_EMAIL,
  getSiteSettingsContent,
} from "@/lib/content";
import {
  Smartphone,
  MapPin,
  Gauge,
  Utensils,
  ShieldCheck,
  PhoneCall,
} from "lucide-react";

export const revalidate = 3600;

const CANONICAL_URL = "https://growlocalcreative.com/audit";

export const metadata: Metadata = {
  title: "Free Local Website & Google Readiness Audit | Grow Local Creative",
  description:
    "Run a free 15-second live check on your local business website. Spot mobile speed issues, missing tap-to-call buttons, clunky PDF menus, and Google Maps gaps across Cool, Auburn, Roseville, Placerville, and the Sierra Foothills.",
  alternates: {
    canonical: CANONICAL_URL,
  },
  openGraph: {
    title: "Free Local Website & Google Readiness Audit | Grow Local Creative",
    description:
      "Inspect your live small-business website in seconds and get a plain-English Top 3 Leaks & Quick Wins action plan tailored to your Sierra Foothills or Greater Sacramento town.",
    url: CANONICAL_URL,
    siteName: "Grow Local Creative",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Local Website & Google Readiness Audit | Grow Local Creative",
    description:
      "Plain-English website and Google Maps checkup built for Foothill contractors, eateries, food trucks, and local shops.",
  },
};

const AUDIT_CHECK_POINTS = [
  {
    icon: Gauge,
    title: "Foothill Cell Speed & HTTPS",
    description:
      "Measures real homepage response speed and checks for secure HTTPS so customers on rural LTE don't bounce before your page loads.",
  },
  {
    icon: Smartphone,
    title: "Mobile Screen & Tap-to-Call",
    description:
      "Verifies mobile viewport setup and checks whether smartphone visitors can tap your phone number or request a quote in one thumb-tap.",
  },
  {
    icon: MapPin,
    title: "Local Town & Schema Signals",
    description:
      "Checks whether your homepage clearly names your town and includes LocalBusiness Schema tags that Google Maps and AI search rely on.",
  },
  {
    icon: Utensils,
    title: "PDF Menu & Friction Detection",
    description:
      "Flags clunky pinch-and-zoom PDF links on restaurant, food truck, and bakery homepages that frustrate hungry locals on phones.",
  },
  {
    icon: PhoneCall,
    title: "Clear Next Step for Customers",
    description:
      "Looks for obvious estimate, booking, or contact paths—because a pretty website still loses money if neighbors don't know how to reach you.",
  },
  {
    icon: ShieldCheck,
    title: "No Website Yet? Covered Too",
    description:
      "Just starting out or relying only on Facebook? Toggle to 'I Don't Have a Website Yet' for a prioritized Local Launch Plan tailored to your town.",
  },
];

export default async function AuditPage() {
  const settings = await getSiteSettingsContent();
  const bookingUrl = settings.bookingUrl || DEFAULT_BOOKING_URL;
  const email = settings.email || OFFICIAL_EMAIL;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "Grow Local Creative Website & Google Readiness Audit",
        url: CANONICAL_URL,
        applicationCategory: "BusinessApplication",
        operatingSystem: "All",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        provider: {
          "@type": "LocalBusiness",
          name: "Grow Local Creative",
          url: "https://growlocalcreative.com",
          telephone: "+1-916-869-4142",
          email: OFFICIAL_EMAIL,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://growlocalcreative.com/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Free Website & Google Audit",
            item: CANONICAL_URL,
          },
        ],
      },
    ],
  };

  return (
    <div className="bg-[#F7F4ED] text-stone-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div>
        {/* Hero */}
        <section className="pt-14 pb-10 md:pt-20 md:pb-12 border-b border-stone-200/80">
          <div className="container mx-auto px-4 max-w-4xl">
            <nav aria-label="Breadcrumb" className="text-xs font-medium text-stone-600 mb-5">
              <ol className="flex items-center gap-2">
                <li>
                  <Link href="/" className="hover:text-primary underline-offset-4 hover:underline">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-stone-900 font-semibold">
                  Free Website &amp; Google Audit
                </li>
              </ol>
            </nav>

            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
              Free Local Tool · Sierra Foothills &amp; Greater Sacramento
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl font-medium tracking-tight text-stone-900 leading-[1.12] mb-5">
              Spot the Website &amp; Google Leaks Costing You Local Customers
            </h1>
            <p className="text-lg text-stone-700 leading-relaxed max-w-3xl">
              Enter your website below (or let us know you don&apos;t have one yet). We inspect your
              real live homepage in seconds—checking mobile speed, tap-to-call links, PDF menus, and
              local search signals—and give you a plain-English Top 3 Action Plan written in
              Renee&apos;s neighbor-to-neighbor style.
            </p>
            <p className="text-sm font-medium text-stone-600 mt-5">
              Real live homepage scan · Plain English, zero tech jargon · Free to run · Takes ~10 seconds
            </p>
          </div>
        </section>

        {/* Interactive Tool */}
        <section className="py-10 md:py-14">
          <div className="container mx-auto px-4 max-w-4xl">
            <AuditToolClient bookingUrl={bookingUrl} phone={settings.phone} email={email} />
          </div>
        </section>

        {/* SSR Explanation of What We Check */}
        <section className="py-16 bg-white border-t border-stone-200/80 print:hidden">
          <div className="container mx-auto px-4 max-w-5xl space-y-10">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-primary">
                Under the Hood
              </p>
              <h2 className="font-heading text-3xl sm:text-4xl font-medium text-stone-900">
                What This Free Local Audit Actually Checks
              </h2>
              <p className="text-stone-600 text-base leading-relaxed">
                No vague 100-point vanity scores. Every check focuses on the real everyday things
                that make a neighbor in Cool, Auburn, Roseville, Placerville, or Grass Valley either
                call you—or hit the Back button and call your competitor.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {AUDIT_CHECK_POINTS.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-stone-200/90 bg-[#F7F4ED]/55 p-6 space-y-3"
                  >
                    <div className="h-11 w-11 rounded-xl bg-secondary/25 text-primary flex items-center justify-center">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="font-heading text-xl font-medium text-stone-900">
                      {item.title}
                    </h3>
                    <p className="text-sm text-stone-700 leading-relaxed">{item.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="rounded-2xl border border-stone-200 bg-[#F7F4ED] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1.5 max-w-xl">
                <h3 className="font-heading text-xl font-medium text-stone-900">
                  Prefer a Quick Human Chat Instead?
                </h3>
                <p className="text-sm text-stone-700 leading-relaxed">
                  Happy to look over your website or Google Business Profile live together on a free
                  15-minute call—no prep needed.
                </p>
              </div>
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shrink-0"
              >
                Book a Free 15-Min Chat
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
