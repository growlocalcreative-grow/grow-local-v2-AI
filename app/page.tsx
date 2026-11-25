import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Future } from "@/components/sections/Future";
import { Freebies } from "@/components/sections/Freebies";
import { FAQ } from "@/components/sections/FAQ";
import { ServiceAreas } from "@/components/sections/ServiceAreas";
import {
  DEFAULT_BOOKING_URL,
  OFFICIAL_EMAIL,
  TARGET_CITIES,
  TARGET_COUNTIES,
  getHeroContent,
  getAboutContent,
  getServicesContent,
  getFutureContent,
  getFreebiesContent,
  getFaqContent,
  getSiteSettingsContent,
} from "@/lib/content";

// Page content revalidation (1 hour)
export const revalidate = 3600;

export const metadata: Metadata = {
  alternates: {
    canonical: "https://growlocalcreative.com",
  },
};

export default async function HomePage() {
  const [hero, about, services, future, freebies, faq, settings] = await Promise.all([
    getHeroContent(),
    getAboutContent(),
    getServicesContent(),
    getFutureContent(),
    getFreebiesContent(),
    getFaqContent(),
    getSiteSettingsContent(),
  ]);

  const bookingUrl = settings.bookingUrl || DEFAULT_BOOKING_URL;
  const contactEmail = settings.email || OFFICIAL_EMAIL;

  const order = settings.sectionOrder || ["hero", "about", "services", "future", "freebies", "faq"];
  const visibleOrder = order.filter((id) => !(settings.hiddenSections || []).includes(id));

  const areaServed = [
    ...TARGET_COUNTIES.map((name) => ({ "@type": "AdministrativeArea", name })),
    ...TARGET_CITIES.map((city) => ({ "@type": "City", name: `${city}, CA` })),
  ];

  const servicesJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType:
      "Website Rescues & Modernization, Google Business & Map Optimization, and Restaurant & Food Truck Mobile Menus",
    provider: {
      "@id": "https://growlocalcreative.com/#localbusiness",
    },
    areaServed,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Local Web & Google Maps Services",
      itemListElement: services.items.map((s, i) => ({
        "@type": "Offer",
        position: i + 1,
        itemOffered: {
          "@type": "Service",
          name: s.title,
          description: s.description,
        },
      })),
    },
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://growlocalcreative.com/#webpage",
    url: "https://growlocalcreative.com",
    name: `${settings.agencyName} | Website Rescues, Google Maps SEO & Mobile Menus`,
    isPartOf: {
      "@id": "https://growlocalcreative.com/#website",
    },
    about: {
      "@id": "https://growlocalcreative.com/#localbusiness",
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".hero-subhead", "h2"],
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://growlocalcreative.com",
      },
    ],
  };

  const renderSection = (id: string) => {
    switch (id) {
      case "hero":
        return <Hero key="hero" data={hero} bookingUrl={bookingUrl} />;
      case "about":
        return <About key="about" data={about} />;
      case "services":
        return <Services key="services" data={services} />;
      case "future":
        return <Future key="future" data={future} bookingUrl={bookingUrl} email={contactEmail} />;
      case "freebies":
        return <Freebies key="freebies" data={freebies} />;
      case "faq":
        return (
          <div key="faq-group">
            <ServiceAreas />
            <FAQ data={faq} />
          </div>
        );
      default:
        return null;
    }
  };

  const hasFaqVisible = visibleOrder.includes("faq");

  return (
    <>
      <script
        type="application/ld+json"
        id="home-webpage-schema"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        id="home-services-schema"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
      />
      <script
        type="application/ld+json"
        id="home-breadcrumb-schema"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <main className="flex-grow">
        {visibleOrder.map(renderSection)}
        {!hasFaqVisible && <ServiceAreas />}
      </main>
    </>
  );
}
