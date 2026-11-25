import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar, Phone } from "lucide-react";
import { DEFAULT_BOOKING_URL, getSiteSettingsContent } from "@/lib/content";
import { CITY_LOCATIONS } from "@/lib/locations-data";
import { SPECIALTY_SERVICES } from "@/lib/services-data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Service Areas — Sierra Foothills & Greater Sacramento",
  description:
    "Based in Cool, CA, serving local businesses across Cool, Auburn, Roseville, Loomis, Lincoln, Folsom, Fair Oaks, Foresthill, Placerville, Camino, Pollock Pines, Grass Valley, and Nevada City.",
  alternates: {
    canonical: "https://growlocalcreative.com/locations",
  },
  openGraph: {
    title: "Service Areas | Grow Local Creative",
    description:
      "Web design, Website Rescues, Google Maps optimization, and mobile menus across El Dorado, Placer, Nevada, and Sacramento Counties.",
    url: "https://growlocalcreative.com/locations",
    siteName: "Grow Local Creative",
    type: "website",
    images: [{ url: "/logo.png", width: 800, height: 800, alt: "Grow Local Creative Service Areas" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Service Areas | Grow Local Creative",
    description:
      "Web design, Website Rescues, Google Maps optimization, and mobile menus across El Dorado, Placer, Nevada, and Sacramento Counties.",
    images: ["/logo.png"],
  },
};

const COUNTY_GROUPS = [
  { county: "El Dorado County", slugs: ["cool", "placerville", "camino", "pollock-pines"] },
  { county: "Placer County", slugs: ["auburn", "roseville", "loomis", "lincoln", "foresthill"] },
  { county: "Nevada County", slugs: ["grass-valley", "nevada-city"] },
  { county: "Sacramento County", slugs: ["folsom", "fair-oaks"] },
];

export default async function LocationsIndexPage() {
  const settings = await getSiteSettingsContent();
  const bookingUrl = settings.bookingUrl || DEFAULT_BOOKING_URL;
  const phone = settings.phone || "916-869-4142";
  const phoneDigits = phone.replace(/[^0-9]/g, "") || "9168694142";

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://growlocalcreative.com" },
      { "@type": "ListItem", position: 2, name: "Service Areas", item: "https://growlocalcreative.com/locations" },
    ],
  };

  return (
    <>
      <script
        id="locations-hub-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="flex-grow bg-background text-foreground">
        <section className="py-20 md:py-28 border-b border-border">
          <div className="container mx-auto px-4 max-w-5xl">
            <p className="text-sm font-medium text-primary mb-4">
              Based in Cool, CA · Serving Four Northern California Counties
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-foreground leading-[1.1] max-w-4xl text-balance mb-6">
              Local Web &amp; Google Maps Growth Across the{" "}
              <span className="italic text-primary">Foothills &amp; Greater Sacramento</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-10">
              Every town along Highways 49, 50, 65, and I-80 has its own mix of local search habits,
              seasonal traffic, and cell-signal quirks. Pick your community below to see how we help
              local businesses stand out.
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
                <span>Call / Text {phone}</span>
              </a>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 max-w-5xl space-y-16">
            {COUNTY_GROUPS.map((group) => {
              const cities = group.slugs
                .map((slug) => CITY_LOCATIONS.find((c) => c.slug === slug))
                .filter((c): c is NonNullable<typeof c> => Boolean(c));

              return (
                <div key={group.county} className="space-y-6">
                  <div className="flex items-baseline justify-between border-b border-border pb-3">
                    <h2 className="font-heading text-2xl sm:text-3xl font-medium text-foreground">
                      {group.county}
                    </h2>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {cities.length} {cities.length === 1 ? "community" : "communities"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {cities.map((loc) => (
                      <Link
                        key={loc.slug}
                        href={`/locations/${loc.slug}`}
                        className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/50 transition-colors flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground">
                            {loc.regionLabel} · {loc.zipCodes.join(", ")}
                          </p>
                          <h3 className="font-heading text-2xl font-medium text-foreground group-hover:text-primary transition-colors flex items-center justify-between gap-2">
                            <span>{loc.city}, CA</span>
                            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {loc.metaDescription}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Core Services Bar */}
        <section className="py-16 bg-card border-t border-border">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="font-heading text-2xl md:text-3xl font-medium text-foreground mb-8">
              Available in Every Town Above
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SPECIALTY_SERVICES.map((svc, idx) => (
                <Link
                  key={svc.slug}
                  href={`/services/${svc.slug}`}
                  className="group rounded-2xl border border-border bg-background p-6 hover:border-primary/50 transition-colors space-y-2"
                >
                  <p className="text-xs font-semibold text-primary tabular-nums">0{idx + 1}.</p>
                  <h3 className="font-heading text-xl font-medium text-foreground group-hover:text-primary transition-colors">
                    {svc.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {svc.metaDescription}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
