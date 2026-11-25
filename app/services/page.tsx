import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar, Phone, FileText } from "lucide-react";
import {
  DEFAULT_BOOKING_URL,
  OFFICIAL_EMAIL,
  getSiteSettingsContent,
} from "@/lib/content";
import { SPECIALTY_SERVICES } from "@/lib/services-data";
import { CITY_LOCATIONS } from "@/lib/locations-data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Local Web & Google Maps Services",
  description:
    "Website Rescues & Modernization, Google Business & Map Optimization, and Restaurant & Food Truck Mobile Menus for small businesses across El Dorado, Placer, Nevada, and Sacramento Counties.",
  alternates: {
    canonical: "https://growlocalcreative.com/services",
  },
  openGraph: {
    title: "Local Web & Google Maps Services | Grow Local Creative",
    description:
      "Flat-rate Website Rescues, Google Business Profile optimization, and zero-PDF mobile menus for Foothill and Greater Sacramento small businesses.",
    url: "https://growlocalcreative.com/services",
    siteName: "Grow Local Creative",
    type: "website",
    images: [{ url: "/logo.png", width: 800, height: 800, alt: "Grow Local Creative Services" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Local Web & Google Maps Services | Grow Local Creative",
    description:
      "Flat-rate Website Rescues, Google Business Profile optimization, and zero-PDF mobile menus for Foothill and Greater Sacramento small businesses.",
    images: ["/logo.png"],
  },
};

export default async function ServicesIndexPage() {
  const settings = await getSiteSettingsContent();
  const bookingUrl = settings.bookingUrl || DEFAULT_BOOKING_URL;
  const phone = settings.phone || "916-869-4142";
  const email = settings.email || OFFICIAL_EMAIL;
  const phoneDigits = phone.replace(/[^0-9]/g, "") || "9168694142";

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://growlocalcreative.com" },
      { "@type": "ListItem", position: 2, name: "Services", item: "https://growlocalcreative.com/services" },
    ],
  };

  const catalogSchema = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Grow Local Creative Core Specialties",
    url: "https://growlocalcreative.com/services",
    itemListElement: SPECIALTY_SERVICES.map((svc, idx) => ({
      "@type": "Offer",
      position: idx + 1,
      url: `https://growlocalcreative.com/services/${svc.slug}`,
      itemOffered: {
        "@type": "Service",
        name: svc.name,
        description: svc.metaDescription,
        provider: { "@id": "https://growlocalcreative.com/#localbusiness" },
      },
    })),
  };

  return (
    <>
      <script
        id="services-hub-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        id="services-hub-catalog-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(catalogSchema) }}
      />

      <main className="flex-grow bg-background text-foreground">
        {/* Hero */}
        <section className="py-20 md:py-28 border-b border-border">
          <div className="container mx-auto px-4 max-w-5xl">
            <p className="text-sm font-medium text-primary mb-4">
              Core Specialties · Cool, CA · El Dorado, Placer, Nevada &amp; Sacramento Counties
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-foreground leading-[1.1] max-w-4xl text-balance mb-6">
              Practical Digital Foundations Built to{" "}
              <span className="italic text-primary">Make Your Phone Ring</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-10">
              We focus on three high-impact specialties for local contractors, restaurants, bakeries,
              and makers: rescuing outdated websites, tuning Google Maps profiles, and replacing slow
              PDF menus—all at transparent flat rates with zero long-term contracts.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3.5 text-base font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors gap-2 whitespace-nowrap"
              >
                <Calendar className="h-4 w-4" aria-hidden="true" />
                <span>Book a Free 15-Min Chat</span>
              </a>
              <a
                href={`tel:${phoneDigits}`}
                className="inline-flex items-center justify-center rounded-full border border-primary/25 bg-background px-7 py-3.5 text-base font-medium text-foreground hover:bg-primary/5 transition-colors gap-2 whitespace-nowrap"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                <span>Call or Text {phone}</span>
              </a>
            </div>
          </div>
        </section>

        {/* Three Core Specialties */}
        <section className="py-20 md:py-24">
          <div className="container mx-auto px-4 max-w-5xl space-y-12">
            {SPECIALTY_SERVICES.map((service, index) => (
              <article
                key={service.slug}
                className="rounded-3xl border border-border bg-card p-8 md:p-10 transition-colors hover:border-primary/40"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-7 space-y-4">
                    <p className="text-sm font-semibold text-primary tabular-nums">
                      0{index + 1}. {service.shortName}
                    </p>
                    <h2 className="font-heading text-3xl md:text-4xl font-medium text-foreground tracking-tight">
                      <Link
                        href={`/services/${service.slug}`}
                        className="hover:text-primary transition-colors"
                      >
                        {service.name}
                      </Link>
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                      {service.heroSubhead}
                    </p>
                    <div className="pt-2 flex flex-wrap items-center gap-6">
                      <Link
                        href={`/services/${service.slug}`}
                        className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors gap-2 whitespace-nowrap"
                      >
                        <span>Explore {service.shortName}</span>
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                      {service.relatedChecklistLink && (
                        <Link
                          href="/checklist/google-maps"
                          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                        >
                          <FileText className="h-4 w-4" aria-hidden="true" />
                          <span>Free 5-Min Google Maps Checklist</span>
                        </Link>
                      )}
                    </div>
                  </div>

                  <div className="lg:col-span-5 lg:border-l lg:border-border lg:pl-8 space-y-3">
                    <h3 className="font-heading text-sm font-semibold text-foreground">
                      What&apos;s Included
                    </h3>
                    <ul className="space-y-2.5 text-sm text-muted-foreground">
                      {service.deliverables.slice(0, 4).map((item) => (
                        <li key={item.title} className="leading-relaxed">
                          <strong className="text-foreground font-medium">{item.title}:</strong>{" "}
                          {item.detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Local Coverage Cross-Links */}
        <section className="py-16 md:py-20 bg-card border-t border-border">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-sm font-medium text-primary mb-2">Where We Work</p>
                <h2 className="font-heading text-3xl md:text-4xl font-medium text-foreground">
                  Serving 13 Foothill &amp; Greater Sacramento Communities
                </h2>
              </div>
              <Link
                href="/locations"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline whitespace-nowrap shrink-0"
              >
                <span>View all service areas</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-3 border-t border-border pt-8">
              {CITY_LOCATIONS.map((loc) => (
                <Link
                  key={loc.slug}
                  href={`/locations/${loc.slug}`}
                  className="py-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center justify-between border-b border-border/50"
                >
                  <span>{loc.city}, CA</span>
                  <span className="text-xs text-muted-foreground">{loc.county.replace(" County", "")}</span>
                </Link>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-muted-foreground">
              <p>
                Not sure which service fits best? Email{" "}
                <a href={`mailto:${email}`} className="text-primary font-medium hover:underline">
                  {email}
                </a>{" "}
                or call{" "}
                <a href={`tel:${phoneDigits}`} className="text-primary font-medium hover:underline">
                  {phone}
                </a>
                .
              </p>
              <Link href="/partners" className="text-primary font-semibold hover:underline whitespace-nowrap">
                See Our Live Work →
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
