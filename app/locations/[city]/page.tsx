import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, ExternalLink, FileText, Phone } from "lucide-react";
import {
  DEFAULT_BOOKING_URL,
  OFFICIAL_EMAIL,
  getPartnersContent,
  getSiteSettingsContent,
} from "@/lib/content";
import { CITY_LOCATIONS, getCityLocationBySlug } from "@/lib/locations-data";
import { getSpecialtyServiceBySlug } from "@/lib/services-data";

export const revalidate = 3600;

export function generateStaticParams() {
  return CITY_LOCATIONS.map((loc) => ({ city: loc.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const loc = getCityLocationBySlug(city);

  if (!loc) {
    return { title: "Location Not Found" };
  }

  const url = `https://growlocalcreative.com/locations/${loc.slug}`;

  return {
    title: loc.metaTitle,
    description: loc.metaDescription,
    keywords: [
      `Web Design ${loc.city} CA`,
      `Website Rescue ${loc.city} CA`,
      `Google Business Profile ${loc.city} CA`,
      `Google Maps SEO ${loc.city} CA`,
      `Restaurant Mobile Menu ${loc.city} CA`,
      `Small Business Websites ${loc.county}`,
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${loc.metaTitle} | Grow Local Creative`,
      description: loc.metaDescription,
      url,
      siteName: "Grow Local Creative",
      type: "website",
      images: [
        {
          url: "/logo.png",
          width: 800,
          height: 800,
          alt: `Grow Local Creative serving ${loc.city}, CA`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${loc.metaTitle} | Grow Local Creative`,
      description: loc.metaDescription,
      images: ["/logo.png"],
    },
  };
}

export default async function CityLocationPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const loc = getCityLocationBySlug(city);

  if (!loc) {
    notFound();
  }

  const [settings, partners] = await Promise.all([
    getSiteSettingsContent(),
    getPartnersContent(),
  ]);

  const bookingUrl = settings.bookingUrl || DEFAULT_BOOKING_URL;
  const phone = settings.phone || "916-869-4142";
  const email = settings.email || OFFICIAL_EMAIL;
  const phoneDigits = phone.replace(/[^0-9]/g, "") || "9168694142";

  const recommendedServices = loc.recommendedServices
    .map((slug) => getSpecialtyServiceBySlug(slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const featuredProjects = partners.projects.filter((p) =>
    loc.featuredProjectIds.includes(p.id)
  );

  const nearbyCities = loc.nearbySlugs
    .map((slug) => getCityLocationBySlug(slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const pageUrl = `https://growlocalcreative.com/locations/${loc.slug}`;

  const localServiceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Web Design, Website Rescues & Google Maps Optimization in ${loc.city}, CA`,
    serviceType:
      "Website Rescues & Modernization, Google Business & Map Optimization, and Restaurant & Food Truck Menus",
    description: loc.metaDescription,
    url: pageUrl,
    provider: {
      "@id": "https://growlocalcreative.com/#localbusiness",
    },
    areaServed: [
      { "@type": "City", name: `${loc.city}, CA` },
      { "@type": "AdministrativeArea", name: `${loc.county}, CA` },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: loc.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://growlocalcreative.com" },
      { "@type": "ListItem", position: 2, name: "Service Areas", item: "https://growlocalcreative.com/locations" },
      { "@type": "ListItem", position: 3, name: `${loc.city}, CA`, item: pageUrl },
    ],
  };

  return (
    <>
      <script
        id="city-service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localServiceSchema) }}
      />
      <script
        id="city-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        id="city-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="flex-grow bg-background text-foreground">
        {/* Hero */}
        <section className="py-16 md:py-24 border-b border-border">
          <div className="container mx-auto px-4 max-w-5xl">
            <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <Link href="/locations" className="hover:text-primary transition-colors">
                Service Areas
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-foreground font-medium">{loc.city}, CA</span>
            </nav>

            <p className="text-sm font-medium text-primary mb-4">
              {loc.county} · {loc.regionLabel} · ZIP {loc.zipCodes.join(", ")}
            </p>

            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-foreground leading-[1.08] max-w-4xl text-balance mb-6">
              {loc.heroHeadline}{" "}
              <span className="italic text-primary">{loc.heroEmphasis}</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-10 hero-subhead">
              {loc.heroSubhead}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3.5 text-base font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors gap-2 whitespace-nowrap"
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

        {/* Local Context & Market Realities */}
        <section className="py-20 bg-card border-b border-border">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-7 space-y-6">
                <p className="text-sm font-medium text-primary">Local Perspective</p>
                <h2 className="font-heading text-3xl md:text-4xl font-medium text-foreground leading-tight">
                  {loc.localContextHeading}
                </h2>
                <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed">
                  {loc.localContextParagraphs.map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 lg:border-l lg:border-border lg:pl-8 space-y-5">
                <h3 className="font-heading text-xl font-medium text-foreground">
                  Who We Help Most in {loc.city}
                </h3>
                <ul className="divide-y divide-border border-t border-b border-border text-sm sm:text-base text-muted-foreground">
                  {loc.topIndustries.map((industry) => (
                    <li key={industry} className="py-3.5 text-foreground/90">
                      {industry}
                    </li>
                  ))}
                </ul>
                <div className="pt-2">
                  <Link
                    href="/checklist/google-maps"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                  >
                    <FileText className="h-4 w-4" aria-hidden="true" />
                    <span>Grab our Free 5-Minute Google Maps Checklist</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* 3 Local Challenges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14 pt-12 border-t border-border">
              {loc.localChallenges.map((item, idx) => (
                <div key={item.title} className="space-y-2">
                  <p className="text-xs font-semibold text-primary tabular-nums">0{idx + 1}.</p>
                  <h3 className="font-heading text-xl font-medium text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Services Tailored for This City */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="max-w-2xl mb-12">
              <p className="text-sm font-medium text-secondary mb-2">
                Most-Requested Services in {loc.city}, CA
              </p>
              <h2 className="font-heading text-3xl md:text-4xl font-medium">
                How We Help {loc.city} Businesses Grow
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recommendedServices.map((svc, idx) => (
                <article
                  key={svc.slug}
                  className="border-t border-primary-foreground/25 pt-6 flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-2.5">
                    <p className="text-xs font-semibold text-secondary tabular-nums">0{idx + 1}.</p>
                    <h3 className="font-heading text-2xl font-medium text-primary-foreground">
                      {svc.name}
                    </h3>
                    <p className="text-sm sm:text-base text-primary-foreground/85 leading-relaxed">
                      {svc.metaDescription}
                    </p>
                  </div>
                  <Link
                    href={`/services/${svc.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:text-primary-foreground transition-colors"
                  >
                    <span>Explore {svc.shortName}</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Regional Proof */}
        {featuredProjects.length > 0 && (
          <section className="py-20 bg-card border-b border-border">
            <div className="container mx-auto px-4 max-w-5xl">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                <div>
                  <p className="text-sm font-medium text-primary mb-2">Regional Work</p>
                  <h2 className="font-heading text-3xl md:text-4xl font-medium text-foreground">
                    Recent Websites Built Across Our Foothills &amp; Sacramento Corridor
                  </h2>
                </div>
                <Link
                  href="/partners"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline whitespace-nowrap shrink-0"
                >
                  <span>See full portfolio</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredProjects.map((project) => (
                  <article
                    key={project.id}
                    className="rounded-2xl border border-border bg-background p-6 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">
                        {project.category} · {project.statusLabel}
                      </p>
                      <h3 className="font-heading text-xl font-medium text-foreground">
                        {project.name}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {project.tagline}
                      </p>
                    </div>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline pt-2 border-t border-border"
                    >
                      <span>Visit {project.name}</span>
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* City-Specific FAQ */}
        <section className="py-20 border-b border-border">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="mb-10 space-y-2">
              <p className="text-sm font-medium text-primary">Local Answers</p>
              <h2 className="font-heading text-3xl md:text-4xl font-medium text-foreground">
                Common Questions From {loc.city} Business Owners
              </h2>
            </div>

            <dl className="divide-y divide-border border-t border-b border-border">
              {loc.faqs.map((faq) => (
                <div key={faq.question} className="py-6 space-y-2">
                  <dt className="font-heading text-xl font-medium text-foreground">
                    {faq.question}
                  </dt>
                  <dd className="text-base text-muted-foreground leading-relaxed">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Nearby Towns + Direct Booking CTA */}
        <section className="py-20 bg-card">
          <div className="container mx-auto px-4 max-w-5xl space-y-14">
            <div className="space-y-4">
              <h2 className="font-heading text-2xl font-medium text-foreground">
                Nearby Communities We Also Serve
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {nearbyCities.map((near) => (
                  <Link
                    key={near.slug}
                    href={`/locations/${near.slug}`}
                    className="rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors flex items-center justify-between"
                  >
                    <span>{near.city}, CA</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-primary text-primary-foreground p-8 sm:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-2 max-w-xl">
                <h2 className="font-heading text-3xl sm:text-4xl font-medium">
                  Let&apos;s Grow Your {loc.city} Business
                </h2>
                <p className="text-primary-foreground/85 text-base leading-relaxed">
                  Book a free 15-minute chat straight on Renee&apos;s calendar, call{" "}
                  <a href={`tel:${phoneDigits}`} className="underline hover:text-secondary">
                    {phone}
                  </a>
                  , or email{" "}
                  <a href={`mailto:${email}`} className="underline hover:text-secondary">
                    {email}
                  </a>
                  .
                </p>
              </div>
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-secondary px-8 py-3.5 text-base font-semibold text-secondary-foreground hover:bg-secondary/90 transition-colors gap-2 whitespace-nowrap shrink-0"
              >
                <Calendar className="h-4 w-4" aria-hidden="true" />
                <span>Book a Free 15-Min Chat</span>
              </a>
            </div>

            <div>
              <Link
                href="/locations"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                <span>View all 13 service areas</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
