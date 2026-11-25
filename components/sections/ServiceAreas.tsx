import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CITY_LOCATIONS } from "@/lib/locations-data";
import { SPECIALTY_SERVICES } from "@/lib/services-data";

const COUNTY_GROUPS = [
  { county: "El Dorado County", slugs: ["cool", "placerville", "camino", "pollock-pines"] },
  { county: "Placer County", slugs: ["auburn", "roseville", "loomis", "lincoln", "foresthill"] },
  { county: "Nevada County", slugs: ["grass-valley", "nevada-city"] },
  { county: "Sacramento County", slugs: ["folsom", "fair-oaks"] },
];

export function ServiceAreas() {
  return (
    <section id="areas" className="py-24 bg-card border-y border-border scroll-mt-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Core Specialties Quick Links */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-medium text-primary">Core Specialties &amp; Local Coverage</p>
              <h2 className="font-heading text-3xl md:text-4xl font-medium text-foreground leading-tight">
                Focused on What Actually Brings Local Customers In
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                Explore our three dedicated specialties or select your town to see how we tailor
                websites, mobile menus, and Google Maps setups for your local market.
              </p>
            </div>

            <div className="divide-y divide-border border-t border-b border-border">
              {SPECIALTY_SERVICES.map((svc, idx) => (
                <Link
                  key={svc.slug}
                  href={`/services/${svc.slug}`}
                  className="group py-4 flex items-center justify-between gap-4 hover:text-primary transition-colors"
                >
                  <div>
                    <span className="text-xs font-semibold text-primary mr-2 tabular-nums">
                      0{idx + 1}.
                    </span>
                    <span className="font-heading text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                      {svc.name}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              ))}
            </div>

            <div className="flex flex-wrap gap-6 text-sm font-semibold">
              <Link href="/services" className="text-primary hover:underline">
                All services →
              </Link>
              <Link href="/locations" className="text-primary hover:underline">
                All 13 service areas →
              </Link>
              <Link href="/checklist/google-maps" className="text-primary hover:underline">
                Free Google Maps checklist →
              </Link>
            </div>
          </div>

          {/* Right: 4-County Interactive Directory */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {COUNTY_GROUPS.map((group) => {
              const cities = group.slugs
                .map((slug) => CITY_LOCATIONS.find((c) => c.slug === slug))
                .filter((c): c is NonNullable<typeof c> => Boolean(c));

              return (
                <div key={group.county} className="space-y-3">
                  <h3 className="font-heading text-lg font-semibold text-foreground border-b border-border pb-2">
                    {group.county}
                  </h3>
                  <ul className="space-y-2">
                    {cities.map((loc) => (
                      <li key={loc.slug}>
                        <Link
                          href={`/locations/${loc.slug}`}
                          className="group flex items-baseline justify-between gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                        >
                          <span className="font-medium text-foreground group-hover:text-primary">
                            {loc.city}, CA
                          </span>
                          <span className="text-xs text-muted-foreground truncate">
                            {loc.zipCodes[0]}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
