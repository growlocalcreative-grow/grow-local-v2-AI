import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, ExternalLink, FileText, Phone } from "lucide-react";
import {
  DEFAULT_BOOKING_URL,
  OFFICIAL_EMAIL,
  TARGET_CITIES,
  TARGET_COUNTIES,
  getPartnersContent,
  getSiteSettingsContent,
} from "@/lib/content";
import { SPECIALTY_SERVICES, getSpecialtyServiceBySlug } from "@/lib/services-data";
import { CITY_LOCATIONS } from "@/lib/locations-data";

export const revalidate = 3600;

export function generateStaticParams() {
  return SPECIALTY_SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getSpecialtyServiceBySlug(slug);

  if (!service) {
    return { title: "Service Not Found" };
  }

  const url = `https://growlocalcreative.com/services/${service.slug}`;

  return {
    title: service.metaTitle,
    description: service.metaDescription,
    keywords: service.keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${service.metaTitle} | Grow Local Creative`,
      description: service.metaDescription,
      url,
      siteName: "Grow Local Creative",
      type: "website",
      images: [
        {
          url: "/logo.png",
          width: 800,
          height: 800,
          alt: `${service.name} by Grow Local Creative`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.metaTitle} | Grow Local Creative`,
      description: service.metaDescription,
      images: ["/logo.png"],
    },
  };
}

export default async function SpecialtyServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getSpecialtyServiceBySlug(slug);

  if (!service) {
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

  const featuredProjects = partners.projects.filter((p) =>
    service.featuredProjectIds.includes(p.id)
  );
  const otherServices = SPECIALTY_SERVICES.filter((s) => s.slug !== service.slug);

  const pageUrl = `https://growlocalcreative.com/services/${service.slug}`;

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    serviceType: service.name,
    description: service.metaDescription,
    url: pageUrl,
    provider: {
      "@id": "https://growlocalcreative.com/#localbusiness",
    },
    areaServed: [
      ...TARGET_COUNTIES.map((name) => ({ "@type": "AdministrativeArea", name })),
      ...TARGET_CITIES.map((city) => ({ "@type": "City", name: `${city}, CA` })),
    ],
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      url: bookingUrl,
      priceCurrency: "USD",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqs.map((faq) => ({
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
      { "@type": "ListItem", position: 2, name: "Services", item: "https://growlocalcreative.com/services" },
      { "@type": "ListItem", position: 3, name: service.name, item: pageUrl },
    ],
  };

  return (
    <>
      <script
        id="specialty-service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        id="specialty-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        id="specialty-breadcrumb-schema"
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
              <Link href="/services" className="hover:text-primary transition-colors">
                Services
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-foreground font-medium">{service.shortName}</span>
            </nav>

            <p className="text-sm font-medium text-primary mb-4">{service.eyebrow}</p>

            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-foreground leading-[1.08] max-w-4xl text-balance mb-6">
              {service.heroHeadline}{" "}
              <span className="italic text-primary">{service.heroEmphasis}</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-10 hero-subhead">
              {service.heroSubhead}
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
              {service.relatedChecklistLink && (
                <Link
                  href="/checklist/google-maps"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline px-2 py-2"
                >
                  <FileText className="h-4 w-4" aria-hidden="true" />
                  <span>Read the Free 5-Min Checklist</span>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Problems Solved & Who It's For */}
        <section className="py-20 bg-card border-b border-border">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-5 space-y-5">
                <p className="text-sm font-medium text-primary">Built For Local Owners</p>
                <h2 className="font-heading text-3xl md:text-4xl font-medium text-foreground leading-tight">
                  Who Gets the Most Value From {service.shortName}
                </h2>
                <ul className="space-y-4 pt-2 text-base text-muted-foreground leading-relaxed">
                  {service.whoItsFor.map((item) => (
                    <li key={item} className="pb-4 border-b border-border last:border-b-0 last:pb-0">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-7 space-y-6">
                <p className="text-sm font-medium text-primary">What We Fix</p>
                <h2 className="font-heading text-3xl md:text-4xl font-medium text-foreground leading-tight">
                  Common Headaches &amp; How We Solve Them
                </h2>
                <div className="divide-y divide-border border-t border-b border-border">
                  {service.problemsSolved.map((item) => (
                    <div key={item.symptom} className="py-6 space-y-2">
                      <h3 className="font-heading text-lg font-medium text-foreground">
                        {item.symptom}
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {item.fix}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4-Step Editorial Process */}
        <section className="py-20 border-b border-border">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="max-w-2xl mb-14">
              <p className="text-sm font-medium text-primary mb-2">How It Works</p>
              <h2 className="font-heading text-3xl md:text-4xl font-medium text-foreground">
                Four Straightforward Steps—Zero Tech Jargon
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {service.process.map((step) => (
                <div
                  key={step.number}
                  className="rounded-2xl border border-border bg-card p-7 space-y-3"
                >
                  <p className="font-heading text-sm font-semibold text-primary tabular-nums">
                    {step.number}
                  </p>
                  <h3 className="font-heading text-2xl font-medium text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Deliverables */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="max-w-2xl mb-14">
              <p className="text-sm font-medium text-secondary mb-2">Flat-Rate Deliverables</p>
              <h2 className="font-heading text-3xl md:text-4xl font-medium">
                What&apos;s Included in Every {service.shortName} Project
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
              {service.deliverables.map((item, idx) => (
                <div key={item.title} className="space-y-2 border-t border-primary-foreground/20 pt-5">
                  <p className="text-xs font-semibold text-secondary tabular-nums">0{idx + 1}.</p>
                  <h3 className="font-heading text-xl font-medium text-primary-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-primary-foreground/85 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Adjacent Real Proof */}
        {featuredProjects.length > 0 && (
          <section className="py-20 bg-card border-b border-border">
            <div className="container mx-auto px-4 max-w-5xl">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
                <div className="max-w-2xl space-y-2">
                  <p className="text-sm font-medium text-primary">Local Proof</p>
                  <h2 className="font-heading text-3xl md:text-4xl font-medium text-foreground">
                    {service.featuredProofHeadline}
                  </h2>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {service.featuredProofNote}
                  </p>
                </div>
                <Link
                  href="/partners"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline whitespace-nowrap shrink-0"
                >
                  <span>View all local work</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProjects.map((project) => (
                  <article
                    key={project.id}
                    className="rounded-2xl border border-border bg-background p-6 flex flex-col justify-between space-y-5"
                  >
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">
                        {project.category} · {project.statusLabel}
                      </p>
                      <h3 className="font-heading text-2xl font-medium text-foreground">
                        {project.name}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {project.tagline}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-border flex items-center justify-between gap-3">
                      <span className="text-xs font-mono text-muted-foreground truncate">
                        {project.displayUrl}
                      </span>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline whitespace-nowrap shrink-0"
                      >
                        <span>Visit site</span>
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Service-Specific FAQs (100% visible in SSR HTML) */}
        <section className="py-20 border-b border-border">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="mb-12 space-y-2">
              <p className="text-sm font-medium text-primary">Common Questions</p>
              <h2 className="font-heading text-3xl md:text-4xl font-medium text-foreground">
                {service.shortName} FAQ
              </h2>
            </div>

            <dl className="divide-y divide-border border-t border-b border-border">
              {service.faqs.map((faq) => (
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

        {/* Where We Offer This + Related Specialties + Final CTA */}
        <section className="py-20 bg-card">
          <div className="container mx-auto px-4 max-w-5xl space-y-16">
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-medium text-foreground mb-3">
                Available Across the Sierra Foothills &amp; Greater Sacramento
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-6">
                Explore local {service.shortName.toLowerCase()} details for your town:
              </p>
              <div className="flex flex-wrap gap-x-5 gap-y-2.5 text-sm">
                {CITY_LOCATIONS.map((loc) => (
                  <Link
                    key={loc.slug}
                    href={`/locations/${loc.slug}`}
                    className="font-medium text-foreground hover:text-primary underline decoration-border underline-offset-4 hover:decoration-primary transition-colors"
                  >
                    {loc.city}, CA
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border">
              {otherServices.map((other) => (
                <Link
                  key={other.slug}
                  href={`/services/${other.slug}`}
                  className="group rounded-2xl border border-border bg-background p-6 hover:border-primary/50 transition-colors space-y-2"
                >
                  <p className="text-xs font-medium text-primary">Related Specialty</p>
                  <h3 className="font-heading text-xl font-medium text-foreground group-hover:text-primary transition-colors flex items-center justify-between gap-2">
                    <span>{other.name}</span>
                    <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {other.metaDescription}
                  </p>
                </Link>
              ))}
            </div>

            {/* Bottom Booking CTA */}
            <div className="rounded-3xl bg-primary text-primary-foreground p-8 sm:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-2 max-w-xl">
                <h2 className="font-heading text-3xl sm:text-4xl font-medium">
                  Ready to Get Started?
                </h2>
                <p className="text-primary-foreground/85 text-base leading-relaxed">
                  Book a free 15-minute chat with Renee or reach out directly at{" "}
                  <a href={`mailto:${email}`} className="underline hover:text-secondary">
                    {email}
                  </a>{" "}
                  — no pressure, no agency games.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
                <a
                  href={bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-secondary px-7 py-3.5 text-sm font-semibold text-secondary-foreground hover:bg-secondary/90 transition-colors gap-2 whitespace-nowrap"
                >
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  <span>Book a Free 15-Min Chat</span>
                </a>
                <a
                  href={`tel:${phoneDigits}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-primary-foreground/30 px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary-foreground/10 transition-colors whitespace-nowrap"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  <span>Call / Text {phone}</span>
                </a>
              </div>
            </div>

            <div>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                <span>Back to all services</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
